/** Isolated database + HTTP regression checks; no browser and no outbound email. */
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
const requireAdmin = createRequire(
  new URL("../admin/package.json", import.meta.url),
);
const mongoose = requireAdmin("mongoose");
const bcrypt = requireAdmin("bcryptjs");
const { Activity, Admin, Lead, CareerApplication } =
  await import("../admin/lib/models.ts");
const { addLead, editRecord, setNote, setStatus, removeRecord, addTeamMember } =
  await import("../admin/lib/mutations.ts");
const { searchFilter } = await import("../admin/lib/queries.ts");
const origin = process.env.QA_ADMIN_ORIGIN || "http://127.0.0.1:3102";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin))
  throw new Error("QA_ADMIN_ORIGIN must be local.");
const sourceUri = process.env.QA_MONGODB_URI;
if (!sourceUri || !/^mongodb(\+srv)?:\/\//.test(sourceUri))
  throw new Error(
    "Set QA_MONGODB_URI to a local or dedicated test MongoDB server.",
  );
// Always use a newly generated database. Never reuse, empty, or seed production data.
const dbName = `bg_admin_qa_${Date.now()}_${randomBytes(3).toString("hex")}`;
const parsed = new URL(sourceUri);
parsed.pathname = `/${dbName}`;
const uri = parsed.toString();
const form = (values) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
};
const runs = [];
let next,
  api,
  appMongoose,
  nextLog = "",
  passed = false;
const mail = [];
const password = `Qa-${randomBytes(12).toString("hex")}`;
const adminDir = new URL("../admin/", import.meta.url).pathname;
const samplePdf = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n",
);
function check(name, fn) {
  console.log(`CHECK ${name}`);
  return Promise.resolve()
    .then(fn)
    .then(() => {
      runs.push(name);
      console.log(`PASS ${name}`);
    });
}
function decode(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
function htmlForm(html, containing) {
  const forms = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)];
  const entry = forms.find((x) => x[1].includes(containing));
  assert(entry, `Missing form: ${containing}`);
  const data = new FormData();
  for (const match of entry[1].matchAll(/<input\b([^>]*)>/g)) {
    const attrs = match[1];
    if (!/type="hidden"/.test(attrs)) continue;
    const name = attrs.match(/\bname="([^"]*)"/)?.[1],
      value = attrs.match(/\bvalue="([^"]*)"/)?.[1] || "";
    if (name) data.append(decode(name), decode(value));
  }
  return data;
}
async function request(path, cookie = "", init = {}) {
  const response = await fetch(`${origin}${path}`, {
    signal: AbortSignal.timeout(15000),
    ...init,
    redirect: "manual",
    headers: { ...(cookie ? { Cookie: cookie } : {}), ...(init.headers || {}) },
  });
  const bytes = await response.arrayBuffer();
  return new Response(bytes, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
async function expectRedirect(response, destination) {
  if ([303, 307].includes(response.status)) {
    assert.equal(response.headers.get("location"), destination);
    return;
  }
  const html = await response.text();
  assert.equal(response.status, 200);
  assert(
    html.includes("NEXT_REDIRECT") && html.includes(destination),
    `Expected streamed redirect to ${destination}`,
  );
  assert(
    !html.includes("Team members"),
    "Restricted team content must not be rendered",
  );
}
async function postForm(path, marker, values, cookie = "") {
  const page = await request(path, cookie);
  assert.equal(page.status, 200);
  const data = htmlForm(await page.text(), marker);
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return request(path, cookie, {
    method: "POST",
    headers: { Origin: origin },
    body: data,
  });
}
const { encodeReply } = requireAdmin(
  "next/dist/compiled/react-server-dom-webpack/client.node",
);
const manifest = JSON.parse(
  await readFile(
    new URL(
      "../admin/.next/server/server-reference-manifest.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
async function invokeAction(name, args, cookie, path = "/admin") {
  const id = Object.entries(manifest.node).find(
    ([, meta]) => meta.exportedName === name,
  )?.[0];
  assert(id, `Action missing from production build: ${name}`);
  return request(path, cookie, {
    method: "POST",
    headers: { "Next-Action": id, Accept: "text/x-component", Origin: origin },
    body: await encodeReply(args),
  });
}
async function signIn(email, secret = password) {
  const response = await postForm("/admin/login", 'name="email"', {
    email,
    password: secret,
  });
  assert.equal(response.status, 303);
  const cookie = response.headers
    .getSetCookie()
    .find((x) => x.startsWith("bg_admin_session="));
  assert(cookie, "Session cookie missing");
  return cookie.split(";")[0];
}
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  const primary = await Admin.create({
    name: "QA Administrator",
    email: "admin@example.test",
    passwordHash: await bcrypt.hash(password, 12),
    role: "admin",
    active: true,
  });
  const actor = { id: String(primary._id), name: primary.name, role: "admin" };
  // Public API uses its real Mongo repository and a captured SMTP transport.
  api = createApp({
    config: {
      MONGODB_URI: uri,
      SMTP_FROM: "noreply@example.test",
      ENQUIRY_TO: "sales@example.test",
      CAREERS_TO: "careers@example.test",
    },
    transport: {
      sendMail: async (data) => {
        mail.push(data);
        return { messageId: String(mail.length) };
      },
    },
  }).listen(0, "127.0.0.1");
  await once(api, "listening");
  const apiUrl = `http://127.0.0.1:${api.address().port}`;
  const submit = (data) =>
    fetch(`${apiUrl}/api/enquiry`, { method: "POST", body: data });
  let lead, career;
  await check(
    "Public enquiry persists actual form data and creates an Activity entry",
    async () => {
      const response = await submit(
        form({
          Name: "QA Ravi Kumar",
          Email: "ravi@example.test",
          Phone: "9876543210",
          Location: "Kadapa",
          Message: "Passenger elevator for a five-floor building.",
          kind: "contact",
          page: "/contact-us",
        }),
      );
      assert.equal(response.status, 200);
      lead = await Lead.findOne({ email: "ravi@example.test" });
      assert(lead);
      assert.equal(lead.location, "Kadapa");
      assert.equal(lead.page, "/contact-us");
      assert.equal(lead.status, "New");
      assert.equal(lead.source, "Website");
      const activity = await Activity.findOne({ entityId: lead._id });
      assert.equal(activity.actorName, "Website");
      assert.equal(activity.entityName, "QA Ravi Kumar");
    },
  );
  await check(
    "Career form persists candidate data and private resume bytes",
    async () => {
      const data = form({
        Name: "QA Ananya Reddy",
        Email: "ananya@example.test",
        Phone: "9876543211",
        kind: "career",
        Position: "Service Engineer",
        Experience: "2 years",
        page: "/career",
        Message: "Application for service engineer.",
      });
      data.set(
        "Resume",
        new Blob([samplePdf], { type: "application/pdf" }),
        "qa-resume.pdf",
      );
      assert.equal((await submit(data)).status, 200);
      career = await CareerApplication.findOne({
        email: "ananya@example.test",
      }).select("+resume.data");
      assert(career);
      assert.equal(career.position, "Service Engineer");
      assert.deepEqual(Buffer.from(career.resume.data), samplePdf);
      assert.equal(
        (await CareerApplication.findById(career._id)).resume.data,
        undefined,
      );
    },
  );
  await check(
    "Admin and thank-you emails are composed correctly (captured, not sent)",
    () => {
      assert.equal(mail.length, 4);
      assert.equal(mail[0].to, "sales@example.test");
      assert.equal(mail[1].to, "ravi@example.test");
      assert.equal(mail[2].to, "careers@example.test");
      assert.equal(mail[3].to, "ananya@example.test");
      assert(mail[0].text.includes("Location: Kadapa"));
    },
  );
  await check(
    "Invalid form fields and invalid resume file are rejected without storage",
    async () => {
      assert.equal(
        (
          await submit(
            form({ Name: "QA Bad", Email: "invalid", Phone: "9876543210" }),
          )
        ).status,
        400,
      );
      const bad = form({
        Name: "QA Bad",
        Email: "bad@example.test",
        Phone: "9876543210",
        kind: "career",
      });
      bad.set("Resume", new Blob(["not a resume"]), "fake.pdf");
      assert.equal((await submit(bad)).status, 400);
      assert.equal(await Lead.countDocuments(), 1);
      assert.equal(await CareerApplication.countDocuments(), 1);
    },
  );
  next = spawn(
    process.execPath,
    [
      requireAdmin.resolve("next/dist/bin/next"),
      "start",
      "-p",
      new URL(origin).port,
      "-H",
      "127.0.0.1",
    ],
    {
      cwd: adminDir,
      env: {
        ...process.env,
        MONGODB_URI: uri,
        SESSION_SECRET: randomBytes(40).toString("hex"),
        NEXT_TELEMETRY_DISABLED: "1",
        NODE_ENV: "production",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  next.stdout.on("data", (x) => (nextLog += x));
  next.stderr.on("data", (x) => (nextLog += x));
  const started = Date.now();
  while (true) {
    if (next.exitCode !== null) throw new Error(nextLog);
    try {
      const r = await request("/admin/login");
      if (r.status === 200) break;
    } catch {}
    if (Date.now() - started > 20000)
      throw new Error("Next server did not start. " + nextLog);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await check(
    "Admin pages and private resumes require authentication",
    async () => {
      for (const path of [
        "/admin",
        "/admin/leads",
        "/admin/careers",
        "/admin/activity",
        "/admin/team",
        `/admin/leads/${lead._id}`,
      ]) {
        const r = await request(path);
        assert.equal(r.status, 307, path);
        assert.equal(r.headers.get("location"), "/admin/login");
      }
      assert.equal(
        (await request(`/api/careers/${career._id}/resume`)).status,
        401,
      );
    },
  );
  const cookie = await signIn("admin@example.test");
  await check(
    "Real login form, dashboard, record lists and Activity render test records",
    async () => {
      for (const [path, content] of [
        ["/admin", "QA Ravi Kumar"],
        ["/admin/leads", "ravi@example.test"],
        ["/admin/careers", "QA Ananya Reddy"],
        ["/admin/activity", "Lead submitted through the website"],
        ["/admin/team", "QA Administrator"],
      ]) {
        const r = await request(path, cookie);
        assert.equal(r.status, 200);
        assert((await r.text()).includes(content), path);
      }
    },
  );
  let manual;
  await check(
    "Admin create lead form saves a record and redirects to its details",
    async () => {
      const r = await postForm(
        "/admin/leads/create",
        'name="name"',
        {
          name: "QA Meera Rao",
          email: "meera@example.test",
          phone: "9876543212",
          source: "WhatsApp",
          status: "New",
          location: "Hyderabad",
          message: "Home elevator enquiry",
          adminNote: "Call tomorrow.",
        },
        cookie,
      );
      assert.equal(r.status, 303);
      manual = await Lead.findOne({ email: "meera@example.test" });
      assert(manual);
      assert(r.headers.get("location").includes(String(manual._id)));
      assert.equal(
        (await Activity.findOne({ entityId: manual._id, action: "created" }))
          .actorName,
        "QA Administrator",
      );
    },
  );
  await check(
    "Lead edit form saves changed fields with before-and-after Activity values",
    async () => {
      const r = await postForm(
        `/admin/leads/${manual._id}/edit`,
        'name="name"',
        {
          name: "QA Meera Rao",
          email: "meera@example.test",
          phone: "9876543212",
          source: "WhatsApp",
          location: "Chennai",
          message: "Home elevator enquiry — site visit requested",
        },
        cookie,
      );
      assert.equal(r.status, 303);
      assert.equal((await Lead.findById(manual._id)).location, "Chennai");
      const event = await Activity.findOne({
        entityId: manual._id,
        action: "details_updated",
      });
      assert(
        event.changes.some(
          (x) =>
            x.field === "Location" &&
            x.before === "Hyderabad" &&
            x.after === "Chennai",
        ),
      );
    },
  );
  await check(
    "Internal note form saves and records the previous note",
    async () => {
      const r = await invokeAction(
        "updateNote",
        [
          "lead",
          String(manual._id),
          {},
          form({ adminNote: "Site visit confirmed for Monday." }),
        ],
        cookie,
        `/admin/leads/${manual._id}`,
      );
      assert.equal(r.status, 200);
      assert.equal(
        (await Lead.findById(manual._id)).adminNote,
        "Site visit confirmed for Monday.",
      );
      const event = await Activity.findOne({
        entityId: manual._id,
        action: "note_updated",
      });
      assert.equal(event.changes[0].before, "Call tomorrow.");
    },
  );
  await check(
    "Lead and career statuses persist; no-op changes do not add misleading history",
    async () => {
      assert.equal(
        (
          await invokeAction(
            "updateStatus",
            ["lead", String(manual._id), form({ status: "Converted" })],
            cookie,
            "/admin/leads",
          )
        ).status,
        200,
      );
      assert.equal(
        (
          await invokeAction(
            "updateStatus",
            ["career", String(career._id), form({ status: "Shortlisted" })],
            cookie,
            "/admin/careers",
          )
        ).status,
        200,
      );
      const count = await Activity.countDocuments({ entityId: manual._id });
      await setStatus(
        actor,
        "lead",
        String(manual._id),
        form({ status: "Converted" }),
      );
      assert.equal(
        await Activity.countDocuments({ entityId: manual._id }),
        count,
      );
      assert.equal((await Lead.findById(manual._id)).status, "Converted");
      assert.equal(
        (await CareerApplication.findById(career._id)).status,
        "Shortlisted",
      );
      await assert.rejects(
        setStatus(
          actor,
          "lead",
          String(manual._id),
          form({ status: "Unknown" }),
        ),
      );
    },
  );
  await check(
    "Career edit form persists changes and records them in history",
    async () => {
      const r = await postForm(
        `/admin/careers/${career._id}/edit`,
        'name="name"',
        {
          name: "QA Ananya Reddy",
          email: "ananya@example.test",
          phone: "9876543211",
          position: "Senior Service Engineer",
          experience: "3 years",
          location: "Chennai",
          message: "Interview requested.",
        },
        cookie,
      );
      assert.equal(r.status, 303);
      assert.equal(
        (await CareerApplication.findById(career._id)).experience,
        "3 years",
      );
      assert(
        await Activity.exists({
          entityId: career._id,
          action: "details_updated",
        }),
      );
    },
  );
  await check(
    "Resume endpoint returns exact bytes, safe headers, and an attributed log",
    async () => {
      const r = await request(`/api/careers/${career._id}/resume`, cookie);
      assert.equal(r.status, 200);
      assert.deepEqual(Buffer.from(await r.arrayBuffer()), samplePdf);
      assert.equal(r.headers.get("cache-control"), "private, no-store");
      assert.equal(r.headers.get("content-type"), "application/pdf");
      assert.equal(
        (await Activity.findOne({ action: "resume_viewed" })).actorName,
        "QA Administrator",
      );
    },
  );
  await check(
    "Search treats regex characters literally; lists filter by status and source",
    async () => {
      assert.equal(
        searchFilter({ q: "a.b" }, ["name"]).$or[0].name.$regex,
        "a\\.b",
      );
      let r = await request(
        "/admin/leads?q=meera&status=Converted&source=WhatsApp",
        cookie,
      );
      assert.equal(r.status, 200);
      let html = await r.text();
      assert(html.includes("meera@example.test"));
      assert(!html.includes("ravi@example.test"));
      r = await request(
        "/admin/activity?type=lead&action=details_updated&q=Meera",
        cookie,
      );
      assert((await r.text()).includes("Location"));
    },
  );
  console.log("CHECK creating permission test accounts");
  await addTeamMember(
    actor,
    form({
      name: "QA Viewer",
      email: "viewer@example.test",
      password,
      role: "viewer",
    }),
  );
  await addTeamMember(
    actor,
    form({
      name: "QA Staff",
      email: "staff@example.test",
      password,
      role: "staff",
    }),
  );
  const viewer = await Admin.findOne({ email: "viewer@example.test" }),
    staff = await Admin.findOne({ email: "staff@example.test" });
  const viewerCookie = await signIn(viewer.email),
    staffCookie = await signIn(staff.email);
  await check(
    "Viewer pages are read-only; staff cannot delete or manage the team",
    async () => {
      for (const path of [
        `/admin/leads/${manual._id}`,
        `/admin/careers/${career._id}`,
      ]) {
        const html = await (await request(path, viewerCookie)).text();
        assert(!html.includes("Edit details"));
        assert(!html.includes("Delete record"));
        assert(!html.includes('name="adminNote"'));
      }
      await expectRedirect(
        await request("/admin/team", viewerCookie),
        "/admin?denied=1",
      );
      await expectRedirect(
        await request("/admin/leads/create", viewerCookie),
        "/admin?denied=1",
      );
      await expectRedirect(
        await request("/admin/team", staffCookie),
        "/admin?denied=1",
      );
      await assert.rejects(
        setNote(
          { id: String(viewer._id), name: viewer.name, role: "viewer" },
          "lead",
          String(lead._id),
          form({ adminNote: "Blocked" }),
        ),
      );
      await assert.rejects(
        removeRecord(
          { id: String(staff._id), name: staff.name, role: "staff" },
          "lead",
          String(lead._id),
        ),
      );
    },
  );
  await check(
    "Direct viewer mutation requests are rejected and validation errors preserve data",
    async () => {
      const r = await invokeAction(
        "updateStatus",
        ["lead", String(lead._id), form({ status: "Converted" })],
        viewerCookie,
        "/admin/leads",
      );
      assert.equal(r.status, 200);
      assert((await r.text()).includes("permission"));
      assert.equal((await Lead.findById(lead._id)).status, "New");
      const before = await Lead.countDocuments();
      const invalid = await invokeAction(
        "createLead",
        [
          {},
          form({
            name: "QA Invalid",
            email: "wrong",
            phone: "9876543210",
            source: "Manual",
            status: "New",
          }),
        ],
        cookie,
        "/admin/leads/create",
      );
      assert.equal(invalid.status, 200);
      assert((await invalid.text()).includes("valid email"));
      assert.equal(await Lead.countDocuments(), before);
    },
  );
  await check(
    "External CV links are private, redirect safely and create an activity event",
    async () => {
      const response = await submit(
        form({
          Name: "QA CV Link",
          Email: "cvlink@example.test",
          Phone: "9876543213",
          kind: "career",
          "CV-URL": "https://example.test/cv.pdf",
        }),
      );
      assert.equal(response.status, 200);
      const application = await CareerApplication.findOne({
        email: "cvlink@example.test",
      });
      assert.equal(
        (await request(`/api/careers/${application._id}/resume`)).status,
        401,
      );
      const r = await request(`/api/careers/${application._id}/resume`, cookie);
      assert.equal(r.status, 302);
      assert.equal(r.headers.get("location"), "https://example.test/cv.pdf");
      assert(
        await Activity.exists({
          entityId: application._id,
          action: "resume_viewed",
          actorName: "QA Administrator",
        }),
      );
    },
  );
  await check(
    "Team creation form validates and creates a staff account",
    async () => {
      const r = await invokeAction(
        "createTeamMember",
        [
          {},
          form({
            name: "QA New Member",
            email: "newmember@example.test",
            password,
            role: "staff",
          }),
        ],
        cookie,
        "/admin/team",
      );
      assert.equal(r.status, 200);
      assert(
        await Admin.exists({ email: "newmember@example.test", role: "staff" }),
      );
    },
  );
  await check(
    "Team deactivate and password reset forms revoke existing sessions",
    async () => {
      let r = await invokeAction(
        "toggleTeamMember",
        [String(viewer._id), {}, form({ active: "false" })],
        cookie,
        "/admin/team",
      );
      assert.equal(r.status, 200);
      assert.equal((await request("/admin", viewerCookie)).status, 307);
      r = await invokeAction(
        "resetTeamPassword",
        [String(staff._id), {}, form({ password: password + "New" })],
        cookie,
        "/admin/team",
      );
      assert.equal(r.status, 200);
      assert.equal((await request("/admin", staffCookie)).status, 307);
      await signIn(staff.email, password + "New");
      assert(
        await Activity.exists({
          entityId: staff._id,
          action: "password_reset",
        }),
      );
    },
  );
  await check(
    "Delete forms remove records while preserving attributable Activity history",
    async () => {
      for (const [kind, doc] of [
        ["leads", manual],
        ["careers", career],
      ]) {
        const path = `/admin/${kind}/${doc._id}`;
        const response = await postForm(path, "Delete record", {}, cookie);
        assert.equal(response.status, 303);
        const model = kind === "leads" ? Lead : CareerApplication;
        assert.equal(await model.findById(doc._id), null);
        assert(
          await Activity.exists({
            entityId: doc._id,
            action: "deleted",
            entityName: doc.name,
          }),
        );
      }
      const html = await (
        await request("/admin/activity?action=deleted", cookie)
      ).text();
      assert(html.includes("QA Meera Rao"));
      assert(html.includes("QA Ananya Reddy"));
      assert(!html.includes(`href="/admin/leads/${manual._id}"`));
    },
  );
  await check(
    "Invalid and missing record IDs return a controlled not-found page",
    async () => {
      for (const path of [
        "/admin/leads/not-an-id",
        `/admin/careers/${career._id}`,
        "/api/careers/not-an-id/resume",
      ]) {
        const r = await request(path, cookie);
        const html = await r.text();
        assert(r.status === 404 || html.includes("Record not found"), path);
      }
    },
  );
  await check(
    "Pagination produces a second page using actual inserted records",
    async () => {
      const ids = [];
      for (let i = 0; i < 16; i++)
        ids.push(
          await addLead(
            actor,
            form({
              name: `QA Pagination ${i}`,
              email: `page${i}@example.test`,
              phone: "9876543210",
              source: "Manual",
              status: "New",
            }),
          ),
        );
      const r = await request("/admin/leads?q=QA%20Pagination&page=2", cookie);
      const html = await r.text();
      assert.equal(r.status, 200);
      assert(html.replace(/<!--.*?-->/g, "").includes("Page 2 of 2"));
      assert(html.replace(/<!--.*?-->/g, "").includes("11–16 of 16"));
    },
  );
  await check("Logout invalidates the session cookie", async () => {
    const r = await postForm("/admin", "Sign out", {}, cookie);
    assert.equal(r.status, 303);
    assert(
      r.headers.getSetCookie().some((x) => x.startsWith("bg_admin_session=;")),
    );
  });
  passed = true;
} catch (error) {
  console.error("FAILED:", error.message);
  throw error;
} finally {
  if (next && next.exitCode === null) {
    const done = once(next, "exit");
    next.kill("SIGTERM");
    const forced = setTimeout(() => next.kill("SIGKILL"), 2000);
    await done.catch(() => {});
    clearTimeout(forced);
  }
  if (api) await new Promise((resolve) => api.close(resolve));
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  const rootRequire = createRequire(
    new URL("../package.json", import.meta.url),
  );
  appMongoose = rootRequire("mongoose");
  await appMongoose.disconnect();
  await writeFile(
    new URL("../docs/admin-test-results.json", import.meta.url),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        passed,
        checks: runs,
        browserPreview: false,
        database: "Isolated real MongoDB database, removed after checks",
        email: "Captured transport; no external email sent",
      },
      null,
      2,
    ),
  );
  if (!passed && nextLog) console.error(nextLog.slice(-7000));
}
console.log(
  `Completed ${runs.length} admin checks. Isolated QA database removed. No preview opened and no email sent.`,
);
