import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import dns from "node:dns";

const root = process.cwd();
const defaultsFile = path.join(root, "shared", "configurator-defaults.json");
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim().replace(/\/$/, "");
if (!privateKey || !endpoint)
  throw new Error("IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT are required.");

const config = JSON.parse(await readFile(defaultsFile, "utf8"));
const migrated = new Map();
const authentication = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;
const cmsFolders = {
  wallDesign: "cabin-appearance",
  controlPanel: "control-panels",
  ceilingDesign: "ceilings",
  floorDesign: "floors",
  accessory: "accessory",
};

async function relocateCmsUpload(url, category) {
  const folder = cmsFolders[category];
  const needsRelocation =
    url.includes("/bg-elevators/configurator/uploads/") ||
    (category === "accessory" &&
      url.includes("/bg-elevators/configurator/accessories/"));
  if (!folder || !needsRelocation)
    return url;
  const fileName = path.basename(new URL(url).pathname);
  const form = new FormData();
  form.set("file", url);
  form.set("fileName", fileName);
  form.set("folder", `/bg-elevators/configurator/${folder}`);
  form.set("useUniqueFileName", "true");
  form.set("tags", "bg-elevators,configurator,cms-upload,relocated");
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: authentication },
    body: form,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(`${url}: ${result.message || response.statusText}`);
  console.log(`Moved CMS image into ${folder}: ${fileName}`);
  return result.url;
}

async function upload(localUrl, category) {
  if (migrated.has(localUrl)) return migrated.get(localUrl);
  if (/^https:\/\//i.test(localUrl)) return localUrl;
  const localFile = path.join(root, "public", ...localUrl.split("/").filter(Boolean));
  const bytes = await readFile(localFile);
  const fileName = path.basename(localFile).replace(/[^a-zA-Z0-9._-]/g, "-");
  const form = new FormData();
  form.set("file", new Blob([bytes]));
  form.set("fileName", fileName);
  form.set("folder", `/bg-elevators/configurator/${category}`);
  form.set("useUniqueFileName", "false");
  form.set("overwriteFile", "true");
  form.set("tags", "bg-elevators,configurator,migrated");
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: authentication },
    body: form,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`${localUrl}: ${result.message || response.statusText}`);
  const url = String(result.url || "");
  if (!url.startsWith(`${endpoint}/`) && !url.startsWith("https://ik.imagekit.io/"))
    throw new Error(`${localUrl}: ImageKit returned an unexpected URL.`);
  migrated.set(localUrl, url);
  console.log(`Uploaded ${migrated.size}: ${localUrl}`);
  return url;
}

for (const [category, items] of Object.entries(config.catalogs)) {
  for (const item of items) item.image = await upload(item.image, category);
}

await writeFile(defaultsFile, `${JSON.stringify(config, null, 2)}\n`);

const imageUrls = [...new Set(
  Object.values(config.catalogs).flat().map((item) => item.image),
)];
for (let index = 0; index < imageUrls.length; index += 10) {
  const batch = imageUrls.slice(index, index + 10);
  const responses = await Promise.all(
    batch.map((url) => fetch(url, { method: "HEAD" })),
  );
  responses.forEach((response, offset) => {
    if (!response.ok)
      throw new Error(
        `ImageKit delivery check failed (${response.status}): ${batch[offset]}`,
      );
  });
}
console.log(`Verified delivery for ${imageUrls.length} ImageKit images.`);

const uri = process.env.MONGODB_URI?.trim();
if (uri) {
  const dnsServers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean) || [];
  if (dnsServers.length) dns.setServers(dnsServers);
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
  const collection = mongoose.connection.collection("configuratorsettings");
  const record = await collection.findOne({ key: "main" });
  if (record?.settings?.catalogs) {
    for (const [category, items] of Object.entries(record.settings.catalogs)) {
      const defaultsById = new Map(
        (config.catalogs[category] || []).map((item) => [item.id, item.image]),
      );
      for (const item of items) {
        const image = defaultsById.get(item.id);
        if (
          item.image?.includes("/bg-elevators/configurator/uploads/") ||
          (category === "accessory" &&
            item.image?.includes("/bg-elevators/configurator/accessories/"))
        )
          item.image = await relocateCmsUpload(item.image, category);
        else if (image && !/^https:\/\//i.test(item.image || ""))
          item.image = image;
      }
    }
    await collection.updateOne(
      { _id: record._id },
      { $set: { settings: record.settings, updatedAt: new Date() }, $inc: { revision: 1 } },
    );
    console.log("Updated the saved CMS configurator settings.");
  } else {
    console.log("No saved CMS configurator settings required migration.");
  }
  await mongoose.disconnect();
}

console.log(`ImageKit migration complete: ${migrated.size} unique images.`);
