import mongoose, { Schema } from "mongoose";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const apply = process.argv.includes("--apply");
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const clip = (value, max) => clean(value).slice(0, max).trim();
const normalizeSlug = (value) =>
  String(value)
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html$/i, "")
    .toLowerCase();

function inline(nodes = []) {
  return (Array.isArray(nodes) ? nodes : [nodes])
    .map((node) => {
      if (typeof node === "string") return node;
      if (!node || typeof node !== "object") return "";
      const text = inline(node.children || []);
      if (node.tag === "a" && node.attributes?.href)
        return `[${text || node.attributes.href}](${node.attributes.href})`;
      if (node.tag === "strong") return `**${text}**`;
      if (node.tag === "em") return `*${text}*`;
      if (node.tag === "br") return "\n";
      return text;
    })
    .join("");
}

function markdown(nodes = []) {
  const blocks = [];
  for (const node of nodes) {
    if (typeof node === "string" || !node?.tag) continue;
    const text = clean(inline(node.children || []));
    if (/^h[1-6]$/.test(node.tag)) {
      blocks.push(`${"#".repeat(Math.max(2, Number(node.tag[1])))} ${text}`);
    } else if (node.tag === "p" && text) {
      blocks.push(text);
    } else if (node.tag === "ul" || node.tag === "ol") {
      const items = (node.children || []).filter((child) => child?.tag === "li");
      blocks.push(
        items
          .map((item, index) => `${node.tag === "ol" ? `${index + 1}.` : "-"} ${clean(inline(item.children))}`)
          .join("\n"),
      );
    } else if (node.tag === "table") {
      const rows = [];
      const visit = (value) => {
        if (Array.isArray(value)) return value.forEach(visit);
        if (!value || typeof value !== "object") return;
        if (value.tag === "tr")
          rows.push(
            (value.children || [])
              .filter((cell) => cell?.tag === "td" || cell?.tag === "th")
              .map((cell) => clean(inline(cell.children))),
          );
        else visit(value.children);
      };
      visit(node);
      if (rows.length) blocks.push(rows.map((row) => row.join(" | ")).join("\n"));
    } else if (node.tag === "figure" || node.tag === "div") {
      const nested = markdown(node.children || []);
      if (nested) blocks.push(nested);
    }
  }
  return blocks.filter(Boolean).join("\n\n");
}

function findMetaDescription(meta = {}) {
  return meta.meta?.find((entry) => entry.name === "description")?.content || "";
}

function mimeFor(filename) {
  const extension = path.extname(filename).toLowerCase();
  return extension === ".png"
    ? "image/png"
    : extension === ".webp"
      ? "image/webp"
      : extension === ".jpg" || extension === ".jpeg"
        ? "image/jpeg"
        : null;
}

const [files, index, listings, metadata] = await Promise.all([
  readdir(path.join(root, "src/data/articles")),
  readFile(path.join(root, "src/data/articleIndex.json"), "utf8").then(JSON.parse),
  readFile(path.join(root, "src/data/blogs.json"), "utf8").then(JSON.parse),
  readFile(path.join(root, "src/data/metadata.json"), "utf8").then(JSON.parse),
]);
const articleFiles = files.filter((file) => file.endsWith(".json")).sort();
const listingBySlug = new Map(
  listings.map((item) => [normalizeSlug(item.href), item]),
);
const dateByTitle = new Map(
  [...index, ...listings]
    .filter((item) => item.date)
    .map((item) => [clean(item.title), item.date]),
);
const indexSlugs = new Set(index.map((item) => normalizeSlug(item.slug)));
const fileSlugs = new Set(articleFiles.map((file) => file.slice(0, -5)));
const errors = [];
for (const slug of indexSlugs)
  if (!fileSlugs.has(slug)) errors.push(`Missing article file for index slug: ${slug}`);
for (const slug of fileSlugs)
  if (!indexSlugs.has(slug)) errors.push(`Article file missing from index: ${slug}`);
for (const slug of listingBySlug.keys())
  if (!fileSlugs.has(slug)) errors.push(`Listing points to missing article: ${slug}`);

const documents = [];
for (const filename of articleFiles) {
  const article = JSON.parse(
    await readFile(path.join(root, "src/data/articles", filename), "utf8"),
  );
  const slug = normalizeSlug(article.slug || filename.slice(0, -5));
  const listing = listingBySlug.get(slug);
  const meta = metadata[slug] || {};
  const image = article.image || listing?.image;
  const imagePath = image && path.join(root, "public", image.replace(/^\//, ""));
  const contentType = imagePath ? mimeFor(imagePath) : null;
  let cover;
  try {
    if (!imagePath || !contentType) throw new Error("unsupported or absent image");
    const info = await stat(imagePath);
    if (info.size > 5 * 1024 * 1024) throw new Error("image exceeds 5 MB");
    cover = { data: await readFile(imagePath), contentType };
  } catch (error) {
    errors.push(`${slug}: cover ${image || "missing"} (${error.message})`);
  }
  const content = markdown(article.body);
  const excerpt = clip(listing?.description || findMetaDescription(meta) || content, 320);
  const publishedAt = new Date(
    article.date || listing?.date || dateByTitle.get(clean(article.title)),
  );
  const routePath = `/${slug}`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120)
    errors.push(`${slug}: invalid or oversized slug`);
  if (routePath.endsWith(".html")) errors.push(`${slug}: .html route found`);
  if (clip(article.title, 160).length < 5) errors.push(`${slug}: invalid title`);
  if (excerpt.length < 20) errors.push(`${slug}: excerpt is too short`);
  if (content.length < 50 || content.length > 100000)
    errors.push(`${slug}: converted editor content has ${content.length} characters`);
  if (Number.isNaN(publishedAt.valueOf())) errors.push(`${slug}: invalid publication date`);
  documents.push({
    slug,
    routePath,
    title: clip(article.title, 160),
    excerpt,
    content,
    category: clip(article.eyebrow || "Elevator insights", 60),
    imageAlt: clip(article.imageAlt || article.title, 180),
    seoTitle: clip(meta.title || article.title, 70),
    seoDescription: clip(findMetaDescription(meta) || excerpt, 170),
    status: "published",
    publishedAt,
    cover,
    structuredBody: article.body || [],
    structuredHeadings: article.headings || [],
    additionalSections: article.additionalSections || [],
    importSource: "legacy-json-v1",
    createdBy: "legacy-import",
    updatedBy: "legacy-import",
  });
}

if (new Set(documents.map((doc) => doc.slug)).size !== documents.length)
  errors.push("Duplicate normalized article slugs detected.");
if (documents.length !== index.length)
  errors.push(`Completeness mismatch: ${documents.length} files vs ${index.length} index entries.`);
if (errors.length) {
  console.error(`Migration validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Validated ${documents.length} unique articles (${listingBySlug.size} listed, ${documents.length - listingBySlug.size} unlisted), all with extensionless URLs and cover images.`,
);
if (!apply) {
  console.log("Dry run complete. Re-run with --apply to write to MongoDB.");
  process.exit(0);
}
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
await mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false,
  serverSelectionTimeoutMS: 10000,
});
const Blog = mongoose.model(
  "LegacyBlogMigration",
  new Schema({}, { strict: false, timestamps: true }),
  "blogs",
);
try {
  const existing = await Blog.find({ slug: { $in: documents.map((doc) => doc.slug) } })
    .select("slug importSource")
    .lean();
  const conflicts = existing.filter((doc) => doc.importSource !== "legacy-json-v1");
  if (conflicts.length)
    throw new Error(`Refusing to overwrite non-migrated slugs: ${conflicts.map((doc) => doc.slug).join(", ")}`);
  const result = await Blog.bulkWrite(
    documents.map((document) => ({
      updateOne: {
        filter: { slug: document.slug },
        update: { $setOnInsert: document },
        upsert: true,
      },
    })),
    { ordered: true },
  );
  const imported = await Blog.countDocuments({ importSource: "legacy-json-v1" });
  const published = await Blog.countDocuments({
    importSource: "legacy-json-v1",
    status: "published",
    routePath: /^\/(?!journal\/)/,
  });
  if (imported !== documents.length || published !== documents.length)
    throw new Error(`Post-import verification failed: imported=${imported}, published=${published}`);
  console.log(
    `Import complete: ${result.upsertedCount} inserted, ${documents.length - result.upsertedCount} already present, ${published} verified published.`,
  );
} finally {
  await mongoose.disconnect();
}
