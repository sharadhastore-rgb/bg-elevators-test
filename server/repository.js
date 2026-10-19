import mongoose, { Schema } from "mongoose";
import dns from "node:dns";

let dnsConfigured = false;

function configureDns() {
  if (dnsConfigured) return;
  const servers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);
  if (servers?.length) dns.setServers(servers);
  dnsConfigured = true;
}
let connection;
function models() {
  const person = {
    name: String,
    email: { type: String, lowercase: true, trim: true },
    phone: String,
    location: String,
    page: String,
    message: String,
    status: String,
    adminNote: String,
  };
  const leadSchema = new Schema(
    { ...person, source: String },
    { timestamps: true },
  );
  const careerSchema = new Schema(
    {
      ...person,
      position: String,
      experience: String,
      resume: {
        filename: String,
        contentType: String,
        data: Buffer,
        externalUrl: String,
      },
    },
    { timestamps: true },
  );
  const activitySchema = new Schema(
    {
      entityType: String,
      entityId: Schema.Types.ObjectId,
      entityName: String,
      action: String,
      description: String,
      actorName: String,
      actorRole: String,
    },
    { timestamps: { createdAt: true, updatedAt: false } },
  );
  const brochureSchema = new Schema(
    {
      filename: String,
      contentType: String,
      size: Number,
      data: { type: Buffer, select: false },
      active: Boolean,
      uploadedByName: String,
    },
    { timestamps: true },
  );
  return {
    Blog:
      mongoose.models.Blog ||
      mongoose.model(
        "Blog",
        new Schema(
          {
            slug: String,
            title: String,
            excerpt: String,
            content: String,
            category: String,
            imageAlt: String,
            seoTitle: String,
            seoDescription: String,
            status: String,
            publishedAt: Date,
            showDate: Boolean,
            routePath: String,
            structuredBody: Schema.Types.Mixed,
            structuredHeadings: Schema.Types.Mixed,
            additionalSections: Schema.Types.Mixed,
            importSource: String,
            cover: {
              url: String,
              data: { type: Buffer, select: false },
              contentType: String,
            },
          },
          { timestamps: true },
        ),
      ),
    Lead: mongoose.models.Lead || mongoose.model("Lead", leadSchema),
    Career:
      mongoose.models.CareerApplication ||
      mongoose.model("CareerApplication", careerSchema),
    Activity:
      mongoose.models.Activity || mongoose.model("Activity", activitySchema),
    Brochure:
      mongoose.models.Brochure || mongoose.model("Brochure", brochureSchema),
  };
}
async function connect(uri, dbName) {
  if (!uri)
    throw Object.assign(new Error("Lead storage is not configured."), {
      status: 503,
    });
  if (!connection)
    connection = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        dbName: dbName || undefined,
      })
      .catch((error) => {
        connection = undefined;
        throw error;
      });
  await connection;
}
export function createMongoRepository(uri, dbName) {
  configureDns();
  uri = uri
    ?.trim()
    .replace(/^["']/, "")
    .replace(
      /["']?(?:SMTP_HOST|SMTP_PORT|SMTP_USER|MONGODB_DB|DNS_SERVERS)=.*/,
      "",
    )
    .replace(/["']$/, "");
  return {
    async getConfigurator() {
      await connect(uri, dbName);
      const model =
        mongoose.models.ConfiguratorSetting ||
        mongoose.model(
          "ConfiguratorSetting",
          new Schema(
            { key: String, settings: Schema.Types.Mixed, revision: Number },
            { timestamps: true },
          ),
        );
      return model.findOne({ key: "main" }).lean();
    },
    async getConfiguratorAsset(id) {
      await connect(uri, dbName);
      const model =
        mongoose.models.ConfiguratorAsset ||
        mongoose.model(
          "ConfiguratorAsset",
          new Schema(
            { data: Buffer, contentType: String },
            { timestamps: true },
          ),
        );
      return model.findById(id);
    },
    async saveConfiguratorRequest(data) {
      await connect(uri, dbName);
      const model =
        mongoose.models.ConfiguratorRequest ||
        mongoose.model(
          "ConfiguratorRequest",
          new Schema(
            {
              customer: Schema.Types.Mixed,
              specification: Schema.Types.Mixed,
              selections: Schema.Types.Mixed,
              revision: Number,
              status: String,
              consent: Boolean,
              marketing: Boolean,
              drawing: {
                data: { type: Buffer, select: false },
                contentType: String,
                filename: String,
              },
            },
            { timestamps: true },
          ),
        );
      return model.create(data);
    },
    async listBlogs() {
      await connect(uri, dbName);
      return models()
        .Blog.find({ status: "published" })
        .select(
          "slug routePath title excerpt category imageAlt seoTitle seoDescription status publishedAt showDate updatedAt cover.url cover.contentType",
        )
        .sort({ updatedAt: -1, _id: -1 })
        .lean();
    },
    async getBlog(slug, cover = false) {
      await connect(uri, dbName);
      return models()
        .Blog.findOne({ slug, status: "published" })
        .select(cover ? "+cover.data" : "")
        .lean();
    },
    async getBlogByRoute(routePath, cover = false) {
      await connect(uri, dbName);
      return models()
        .Blog.findOne({ routePath })
        .select(cover ? "+cover.data" : "")
        .lean();
    },
    async saveLead(data) {
      await connect(uri, dbName);
      const { Lead, Activity } = models();
      const lead = await Lead.create({
        ...data,
        source: data.source || "Website",
        status: "New",
        adminNote: "",
      });
      await Activity.create({
        entityType: "lead",
        entityId: lead._id,
        entityName: lead.name,
        action: "created",
        description:
          data.source === "Brochure"
            ? "Brochure requested through the website"
            : "Lead submitted through the website",
        actorName: "Website",
        actorRole: "website",
      });
      return lead;
    },
    async saveCareer(data) {
      await connect(uri, dbName);
      const { Career, Activity } = models();
      const career = await Career.create({
        ...data,
        status: "New",
        adminNote: "",
      });
      await Activity.create({
        entityType: "career",
        entityId: career._id,
        entityName: career.name,
        action: "created",
        description: "Career application submitted through the website",
        actorName: "Website",
        actorRole: "website",
      });
      return career;
    },
    async getActiveBrochure() {
      await connect(uri, dbName);
      const { Brochure } = models();
      return Brochure.findOne({ active: true })
        .sort({ createdAt: -1 })
        .select("+data filename contentType size")
        .lean();
    },
  };
}
