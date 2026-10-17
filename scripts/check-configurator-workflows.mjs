// Run only against a disposable local/test MongoDB server. Creates and drops its own isolated database.
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import net from "node:net";
import mongoose from "mongoose";
import { createApp } from "../server/app.js";
import {
  defaultConfigurator,
  initialConfiguration,
} from "../shared/configurator.js";
const requireAdmin = createRequire(
  new URL("../admin/package.json", import.meta.url),
);
const bcrypt = requireAdmin("bcryptjs");
const { encodeReply } = requireAdmin(
  "next/dist/compiled/react-server-dom-webpack/client.node",
);
const source = process.env.QA_MONGODB_URI;
if (!source || !/^mongodb(?:\+srv)?:\/\//.test(source))
  throw new Error("Set QA_MONGODB_URI to a disposable test MongoDB server.");
const dbName = `bg_configurator_qa_${Date.now()}_${randomBytes(4).toString("hex")}`;
const parsed = new URL(source);
parsed.pathname = `/${dbName}`;
const uri = parsed.href;
const secret = randomBytes(48).toString("hex"),
  password = randomBytes(20).toString("hex");
const temp = net.createServer().listen(0, "127.0.0.1");
await once(temp, "listening");
const port = temp.address().port;
await new Promise((r) => temp.close(r));
const origin = `http://127.0.0.1:${port}`;
let api, child;
let checks = 0;
async function check(fn) {
  await fn();
  checks++;
  console.log(`PASS workflow ${checks}`);
}
const decode = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const request = (path, cookie = "", init = {}) =>
  fetch(origin + path, {
    ...init,
    redirect: "manual",
    headers: { ...(cookie ? { Cookie: cookie } : {}), ...init.headers },
    signal: AbortSignal.timeout(20000),
  });
async function signIn(email) {
  let r = await request("/admin/login");
  const html = await r.text();
  const form = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].find(
    (x) => x[1].includes('name="email"'),
  );
  assert(form);
  const data = new FormData();
  for (const [, attrs] of form[1].matchAll(/<input\b([^>]*)>/g)) {
    if (!attrs.includes('type="hidden"')) continue;
    const name = attrs.match(/\bname="([^"]*)"/)?.[1],
      value = attrs.match(/\bvalue="([^"]*)"/)?.[1] || "";
    if (name) data.append(decode(name), decode(value));
  }
  data.set("email", email);
  data.set("password", password);
  r = await request("/admin/login", "", {
    method: "POST",
    headers: { Origin: origin },
    body: data,
  });
  assert.equal(r.status, 303);
  const cookie = r.headers
    .getSetCookie()
    .find((x) => x.startsWith("bg_admin_session="));
  assert(cookie);
  return cookie.split(";")[0];
}
const manifest = JSON.parse(
  await readFile(
    new URL(
      "../admin/.next/server/server-reference-manifest.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
async function action(name, args, cookie) {
  const id = Object.entries(manifest.node).find(
    ([, meta]) => meta.exportedName === name,
  )?.[0];
  assert(id, `Missing action ${name}`);
  return request("/admin/configurator?tab=settings", cookie, {
    method: "POST",
    headers: { "Next-Action": id, Accept: "text/x-component", Origin: origin },
    body: await encodeReply(args),
  });
}
try {
  console.log("QA: connecting isolated database");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("QA: database connected");
  const hash = await bcrypt.hash(password, 4);
  for (const role of ["admin", "staff", "viewer"])
    await mongoose.connection.collection("admins").insertOne({
      name: `QA ${role}`,
      email: `${role}@example.test`,
      passwordHash: hash,
      role,
      active: true,
      sessionVersion: 0,
    });
  api = createApp({ config: { MONGODB_URI: uri } }).listen(0, "127.0.0.1");
  await once(api, "listening");
  const publicOrigin = `http://127.0.0.1:${api.address().port}`;
  child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      String(port),
    ],
    {
      cwd: new URL("../admin", import.meta.url),
      env: {
        ...process.env,
        NODE_ENV: "production",
        MONGODB_URI: uri,
        MONGODB_DB: dbName,
        SESSION_SECRET: secret,
        NEXT_PUBLIC_WEBSITE_URL: publicOrigin,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let output = "";
  child.stdout.on("data", (b) => {
    console.log(String(b).trim());
    output += b;
  });
  child.stderr.on("data", (b) => {
    console.error(String(b).trim());
    output += b;
  });
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error(output);
    try {
      if ((await request("/admin/login")).status === 200) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
    if (i === 99) throw new Error("CMS did not start: " + output);
  }
  let r = await request("/admin/configurator");
  await check(() => assert.equal(r.status, 307));
  const admin = await signIn("admin@example.test"),
    staff = await signIn("staff@example.test"),
    viewer = await signIn("viewer@example.test");
  checks += 3;
  r = await request("/admin/configurator?tab=settings", admin);
  let html = await r.text();
  await check(() => assert.equal(r.status, 200));
  await check(() => assert.match(html, /Settings &amp; catalog/));
  await check(() => assert.match(html, /Publish configurator/));
  r = await request("/admin/configurator?tab=settings", viewer);
  html = await r.text();
  await check(() =>
    assert.doesNotMatch(html, /<button[^>]*>Publish configurator/),
  );
  const settings = structuredClone(defaultConfigurator);
  settings.title = "QA CMS title";
  settings.capacities[1].speed = 1.2;
  const form = new FormData();
  form.set("settings", JSON.stringify(settings));
  form.set("revision", "0");
  r = await action("saveConfigurator", [{}, form], admin);
  await r.text();
  let stored = await mongoose.connection
    .collection("configuratorsettings")
    .findOne({ key: "main" });
  await check(() => assert.equal(stored?.settings.title, "QA CMS title"));
  await check(() => assert.equal(stored?.revision, 1));
  r = await fetch(publicOrigin + "/api/configurator");
  const live = await r.json();
  await check(() => assert.equal(live.settings.title, "QA CMS title"));
  await check(() => assert.equal(live.revision, 1));
  await check(() => assert.equal(live.settings.capacities[1].speed, 1.2));
  r = await action("saveConfigurator", [{}, form], admin);
  await r.text();
  stored = await mongoose.connection
    .collection("configuratorsettings")
    .findOne({ key: "main" });
  await check(() => assert.equal(stored.revision, 1));
  form.set("revision", "1");
  r = await action("saveConfigurator", [{}, form], staff);
  await r.text();
  stored = await mongoose.connection
    .collection("configuratorsettings")
    .findOne({ key: "main" });
  await check(() => assert.equal(stored.revision, 1));
  const invalid = structuredClone(settings);
  invalid.capacities = [];
  const bad = new FormData();
  bad.set("settings", JSON.stringify(invalid));
  bad.set("revision", "1");
  r = await action("saveConfigurator", [{}, bad], admin);
  await r.text();
  await check(async () =>
    assert.equal(
      (
        await mongoose.connection
          .collection("configuratorsettings")
          .findOne({ key: "main" })
      ).revision,
      1,
    ),
  );
  const spec = {
    ...initialConfiguration(settings),
    shaftWidth: 1700,
    shaftDepth: 1900,
    pitDepth: 1200,
    ceilingHeight: 3500,
    floorCount: 3,
    floorHeights: [3000, 3200],
    totalTravel: 999999,
  };
  const data = new FormData();
  for (const [k, v] of Object.entries({
    name: "QA configuration customer",
    email: "customer@example.test",
    consent: "true",
    configuration: JSON.stringify(spec),
    revision: "1",
  }))
    data.set(k, v);
  data.set("drawing", new Blob(["%PDF-1.7\nQA"]), "project.pdf");
  r = await fetch(publicOrigin + "/api/configurator/requests", {
    method: "POST",
    body: data,
  });
  const receipt = await r.json();
  await check(() => assert.equal(r.status, 201));
  const saved = await mongoose.connection
    .collection("configuratorrequests")
    .findOne({ _id: new mongoose.Types.ObjectId(receipt.reference) });
  await check(() => assert.equal(saved.specification.totalTravel, 6200));
  await check(() => assert.equal(saved.specification.speed, 1.2));
  await check(() =>
    assert.equal(saved.customer.email, "customer@example.test"),
  );
  r = await request("/admin/configurator", admin);
  html = await r.text();
  await check(() => assert.match(html, /QA configuration customer/));
  await check(() => assert.match(html, /6200/));
  r = await request(`/api/configurator/requests/${receipt.reference}/drawing`);
  await check(() => assert.equal(r.status, 401));
  r = await request(
    `/api/configurator/requests/${receipt.reference}/drawing`,
    viewer,
  );
  await check(() => assert.equal(r.status, 200));
  await check(() => assert.match(r.headers.get("cache-control"), /private/));
  await check(async () => assert.equal((await r.text()).slice(0, 5), "%PDF-"));
  const statusForm = new FormData();
  statusForm.set("id", receipt.reference);
  statusForm.set("status", "Quoted");
  r = await action("updateConfiguratorRequest", [statusForm], staff);
  await r.text();
  await check(async () =>
    assert.equal(
      (
        await mongoose.connection
          .collection("configuratorrequests")
          .findOne({ _id: saved._id })
      ).status,
      "Quoted",
    ),
  );
  statusForm.set("status", "Closed");
  r = await action("updateConfiguratorRequest", [statusForm], viewer);
  await r.text();
  await check(async () =>
    assert.equal(
      (
        await mongoose.connection
          .collection("configuratorrequests")
          .findOne({ _id: saved._id })
      ).status,
      "Quoted",
    ),
  );
  const upload = new FormData();
  upload.set("image", new Blob(["not an image"]), "bad.png");
  r = await request("/api/configurator/assets", "", {
    method: "POST",
    headers: { Origin: origin },
    body: upload,
  });
  await check(() => assert.equal(r.status, 403));
  r = await request("/api/configurator/assets", admin, {
    method: "POST",
    headers: { Origin: "https://unrelated.example" },
    body: upload,
  });
  await check(() => assert.equal(r.status, 403));
  r = await request("/api/configurator/assets", staff, {
    method: "POST",
    headers: { Origin: origin },
    body: upload,
  });
  await check(() => assert.equal(r.status, 403));
  r = await request("/api/configurator/assets", admin, {
    method: "POST",
    headers: { Origin: origin },
    body: upload,
  });
  await check(() => assert.equal(r.status, 400));
  const sharp = requireAdmin("sharp");
  const png = await sharp({
    create: { width: 20, height: 20, channels: 3, background: "#006699" },
  })
    .png()
    .toBuffer();
  const image = new FormData();
  image.set("image", new Blob([png], { type: "image/png" }), "finish.png");
  r = await request("/api/configurator/assets", admin, {
    method: "POST",
    headers: { Origin: origin },
    body: image,
  });
  const asset = await r.json();
  await check(() => assert.equal(r.status, 200, JSON.stringify(asset)));
  r = await fetch(publicOrigin + asset.image);
  await check(() => assert.equal(r.status, 200));
  await check(() => assert.equal(r.headers.get("content-type"), "image/webp"));
  await check(async () => assert.ok((await r.arrayBuffer()).byteLength > 0));
  settings.enabled = false;
  form.set("settings", JSON.stringify(settings));
  r = await action("saveConfigurator", [{}, form], admin);
  await r.text();
  r = await fetch(publicOrigin + "/api/configurator");
  await check(() => assert.equal(r.status, 404));
  console.log(
    `Configurator CMS/database: ${checks} checks passed (real isolated MongoDB, production Next.js, authenticated admin/staff/viewer workflows).`,
  );
} finally {
  if (child && child.exitCode === null) {
    const stopped = once(child, "exit");
    child.kill("SIGTERM");
    await stopped;
  }
  if (api) {
    api.close();
    api.closeAllConnections();
  }
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
}
