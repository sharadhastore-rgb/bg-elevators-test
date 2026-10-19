import dns from "node:dns";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import mongoose, { Schema } from "mongoose";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const sourceRoot = path.join(root, ".tmp", "blog-import-31-40");
const docsRoot = path.join(sourceRoot, "docs");
const imagesRoot = path.join(sourceRoot, "images");
const apply = process.argv.includes("--apply");
const audit = process.argv.includes("--audit");
const importSource = "blogs-31-40-november-v1";
const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const slugify = (value) =>
  clean(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function walk(directory, extension) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(fullPath, extension)));
    else if (entry.name.toLowerCase().endsWith(extension)) result.push(fullPath);
  }
  return result.sort((a, b) => path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true }));
}

function unzipEntry(buffer, name) {
  const signature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const end = buffer.lastIndexOf(signature);
  if (end < 0) throw new Error("Invalid DOCX ZIP package.");
  const count = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16);
  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error("Invalid ZIP directory.");
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8");
    if (fileName === name) {
      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(start, start + compressedSize);
      if (method === 0) return compressed.toString("utf8");
      if (method === 8) return inflateRawSync(compressed).toString("utf8");
      throw new Error(`Unsupported DOCX compression method: ${method}`);
    }
    offset += 46 + fileNameLength + extraLength + commentLength;
  }
  throw new Error(`Missing DOCX entry: ${name}`);
}

function decodeXml(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

function xmlText(xml = "") {
  return [...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((match) => decodeXml(match[1])).join("");
}

function paragraphText(xml, relationships) {
  let result = "";
  const tokenPattern = /<w:hyperlink\b[^>]*r:id="([^"]+)"[^>]*>([\s\S]*?)<\/w:hyperlink>|<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g;
  for (const match of xml.matchAll(tokenPattern)) {
    if (match[1]) {
      const text = xmlText(match[2]);
      let target = relationships.get(match[1]);
      if (target?.toLowerCase().startsWith("https://www.bgelevators.com")) {
        target = new URL(target).pathname.replace(/\.html$/, "") || "/";
      }
      result += target ? `[${text}](${target})` : text;
    } else result += xmlText(match[3]);
  }
  return result.trim();
}

async function parseDoc(file) {
  const buffer = await readFile(file);
  const document = unzipEntry(buffer, "word/document.xml");
  const rels = unzipEntry(buffer, "word/_rels/document.xml.rels");
  const relationships = new Map(
    [...rels.matchAll(/<Relationship\b([^>]+)\/?\s*>/g)]
      .map(([, attributes]) => [attributes.match(/\bId="([^"]+)"/)?.[1], decodeXml(attributes.match(/\bTarget="([^"]+)"/)?.[1] || ""), attributes])
      .filter(([id, , attributes]) => id && /\/hyperlink"/.test(attributes))
      .map(([id, target]) => [id, target]),
  );
  const body = document.match(/<w:body>([\s\S]*?)<w:sectPr/)?.[1] || "";
  const nodes = [...body.matchAll(/<w:(p|tbl)\b[^>]*>([\s\S]*?)<\/w:\1>/g)];
  const metadata = {};
  const blocks = [];
  let title = "";
  let internalImageAlt = "";
  let imageMarkerAdded = false;
  for (const [, type, xml] of nodes) {
    if (type === "tbl") {
      const rows = [...xml.matchAll(/<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/g)].map((row) =>
        [...row[1].matchAll(/<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g)].map((cell) => xmlText(cell[1]).trim().replace(/\|/g, "\\|")),
      );
      if (rows.length) {
        blocks.push(`| ${rows[0].join(" | ")} |`);
        blocks.push(`| ${rows[0].map(() => "---").join(" | ")} |`);
        blocks.push(...rows.slice(1).map((row) => `| ${row.join(" | ")} |`), "");
      }
      continue;
    }
    const plain = xmlText(xml).trim();
    const text = paragraphText(xml, relationships);
    const style = xml.match(/<w:pStyle\b[^>]*w:val="([^"]+)"/)?.[1] || "";
    if (/^Meta Title:\s*/.test(plain)) { metadata.metaTitle = plain.replace(/^Meta Title:\s*/, "").trim(); continue; }
    if (/^Meta Description:\s*/.test(plain)) { metadata.metaDescription = plain.replace(/^Meta Description:\s*/, "").trim(); continue; }
    if (/^URL:\s*/.test(plain)) { metadata.sourceUrl = plain.replace(/^URL:\s*/, "").trim(); continue; }
    if (style === "Title" && !title) { title = plain; continue; }
    if (/^Alt text:\s*/.test(plain)) { internalImageAlt = plain.replace(/^Alt text:\s*/, "").trim(); continue; }
    if (/<w:drawing\b/.test(xml)) {
      if (!imageMarkerAdded) blocks.push("[[INTERNAL_IMAGE]]", "");
      imageMarkerAdded = true;
      continue;
    }
    if (!text) continue;
    if (style === "Heading2") blocks.push(`## ${text}`, "");
    else if (style === "Heading3") blocks.push(`### ${text}`, "");
    else if (/^•\s*/.test(text)) blocks.push(`- ${text.replace(/^•\s*/, "")}`);
    else if (/^\d+\.\s*/.test(text)) blocks.push(text.replace(/^(\d+)\.\s*/, "$1. "));
    else blocks.push(text, "");
  }
  const content = blocks.join("\n").replace(/(\r?\n){3,}/g, "\n\n").trim();
  return {
    file: path.basename(file), title, ...metadata, internalImageAlt,
    internalImageMarkers: (content.match(/\[\[INTERNAL_IMAGE\]\]/g) || []).length,
    content,
  };
}

function numberFrom(file) {
  return Number(path.basename(file).match(/(?:^|\s)(3[1-9]|40)(?:\s|_)/)?.[1]);
}

function normalizeTitle(value) {
  return clean(value).replace(/[?_.]+$/g, "").toLowerCase();
}

async function uploadImage(data, fileName, folder, tags) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim().replace(/\/$/, "");
  if (!privateKey || !endpoint) throw new Error("ImageKit credentials are not configured.");
  const form = new FormData();
  form.set("file", new Blob([new Uint8Array(data)], { type: "image/webp" }));
  form.set("fileName", fileName);
  form.set("folder", `/bg-elevators/${folder}`);
  form.set("useUniqueFileName", "true");
  form.set("tags", tags);
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
    body: form,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.message || `ImageKit upload failed for ${fileName}.`);
  if (!String(result.url || "").startsWith("https://ik.imagekit.io/"))
    throw new Error(`ImageKit returned an invalid URL for ${fileName}.`);
  return result.url;
}

const docFiles = await walk(docsRoot, ".docx");
const imageFiles = await walk(imagesRoot, ".jpeg");
const errors = [];
if (docFiles.length !== 10) errors.push(`Expected 10 DOCX files; found ${docFiles.length}.`);
if (imageFiles.length !== 20) errors.push(`Expected 20 JPEG files; found ${imageFiles.length}.`);

const sources = [];
for (const docFile of docFiles) {
  const number = numberFrom(docFile);
  const article = await parseDoc(docFile);
  const matchingImages = imageFiles.filter((file) => numberFrom(file) === number);
  const internalImage = matchingImages.find((file) => /\binternal[-_\s]/i.test(path.basename(file)));
  const coverImage = matchingImages.find((file) => file !== internalImage);
  if (!number || number < 31 || number > 40) errors.push(`${article.file}: invalid blog number.`);
  if (matchingImages.length !== 2 || !coverImage || !internalImage)
    errors.push(`${article.file}: expected one cover and one internal image.`);
  if (article.internalImageMarkers !== 1) errors.push(`${article.file}: expected exactly one internal-image position.`);
  if (!article.internalImageAlt) errors.push(`${article.file}: internal image alt text is missing.`);
  if (!article.metaTitle || article.metaTitle.length > 70) errors.push(`${article.file}: SEO title is missing or exceeds 70 characters.`);
  if (!article.metaDescription || article.metaDescription.length > 170) errors.push(`${article.file}: SEO description is missing or exceeds 170 characters.`);
  if (normalizeTitle(path.basename(coverImage || "").replace(/^blog\s+\d+\s+(?:external\s+)?/i, "").replace(/\.jpeg$/i, "")) !== normalizeTitle(article.title))
    errors.push(`${article.file}: cover filename does not match the article title.`);
  const slug = slugify(article.title);
  if (!slug || slug.length > 120) errors.push(`${article.file}: generated slug is invalid or too long.`);
  sources.push({ number, article, slug, coverImage, internalImage });
}
if (new Set(sources.map(({ number }) => number)).size !== 10) errors.push("Blog numbers 31–40 are not unique and complete.");
if (new Set(sources.map(({ slug }) => slug)).size !== 10) errors.push("Generated blog slugs are not unique.");

for (const { article } of sources) {
  const internalTargets = [...article.content.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g)].map((match) => match[1]);
  for (const target of internalTargets) {
    if (/\.html(?:$|[?#])/.test(target)) errors.push(`${article.file}: obsolete .html internal link remains: ${target}`);
  }
}
if (errors.length) {
  console.error(`Import validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated blogs 31–40: 10 documents, 10 matched covers, 10 matched internal images, and every inline link.`);
for (const { number, article, slug } of sources)
  console.log(`${number}: ${slug} (${article.content.length} content characters)`);
if (!apply && !audit) {
  console.log("Dry run complete. Re-run with --apply to upload images and write the ten posts to MongoDB.");
  process.exit(0);
}

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
const dnsServers = process.env.DNS_SERVERS?.split(",").map((value) => value.trim()).filter(Boolean);
if (dnsServers?.length) dns.setServers(dnsServers);
await mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.MONGODB_DB || undefined,
  bufferCommands: false,
  serverSelectionTimeoutMS: 15000,
});
const Blog = mongoose.model("BlogImport3140", new Schema({}, { strict: false, timestamps: true }), "blogs");

try {
  if (audit) {
    const saved = await Blog.find({ importSource })
      .select("slug routePath title excerpt content category imageAlt seoTitle seoDescription status showDate cover.url")
      .lean();
    const savedBySlug = new Map(saved.map((post) => [post.slug, post]));
    const mismatches = [];
    for (const source of sources) {
      const post = savedBySlug.get(source.slug);
      if (!post) {
        mismatches.push(`${source.number}: CMS post is missing.`);
        continue;
      }
      const internalUrl = String(post.content || "").match(/!\[[^\]]+\]\((https:\/\/ik\.imagekit\.io\/[^)]+)\)/)?.[1];
      const expected = {
        routePath: `/blog/${source.slug}`,
        title: source.article.title,
        excerpt: source.article.metaDescription,
        content: source.article.content.replace("[[INTERNAL_IMAGE]]", `![${source.article.internalImageAlt}](${internalUrl})`),
        category: "Elevator insights",
        imageAlt: source.article.title,
        seoTitle: source.article.metaTitle,
        seoDescription: source.article.metaDescription,
        status: "published",
        showDate: false,
      };
      if (!internalUrl) mismatches.push(`${source.number}: internal ImageKit image is missing.`);
      if (!String(post.cover?.url || "").startsWith("https://ik.imagekit.io/"))
        mismatches.push(`${source.number}: cover ImageKit image is missing.`);
      for (const [field, value] of Object.entries(expected)) {
        if (post[field] !== value) {
          const expectedText = String(value ?? "");
          const actualText = String(post[field] ?? "");
          let offset = 0;
          while (offset < expectedText.length && expectedText[offset] === actualText[offset]) offset += 1;
          mismatches.push(`${source.number}: ${field} differs at character ${offset + 1} (expected length ${expectedText.length}, actual ${actualText.length}).`);
        }
      }
      const expectedLinks = [...expected.content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => [match[1], match[2]]);
      const actualLinks = [...String(post.content).matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => [match[1], match[2]]);
      if (JSON.stringify(expectedLinks) !== JSON.stringify(actualLinks))
        mismatches.push(`${source.number}: hyperlink text or destination differs.`);
    }
    if (saved.length !== 10) mismatches.push(`Expected 10 imported CMS posts; found ${saved.length}.`);
    if (mismatches.length) {
      console.error(`Strict source-to-CMS audit failed with ${mismatches.length} mismatch(es):`);
      mismatches.forEach((message) => console.error(`- ${message}`));
      process.exitCode = 1;
    } else {
      console.log("Strict source-to-CMS audit passed: all 10 posts match every converted character, metadata field, image position, alt text, and hyperlink.");
    }
    await mongoose.disconnect();
    process.exit(process.exitCode || 0);
  }
  const existing = await Blog.find({ slug: { $in: sources.map(({ slug }) => slug) } }).select("slug importSource cover.url content").lean();
  const conflicts = existing.filter((post) => post.importSource !== importSource);
  if (conflicts.length) throw new Error(`Refusing to overwrite existing posts: ${conflicts.map(({ slug }) => slug).join(", ")}`);
  const existingBySlug = new Map(existing.map((post) => [post.slug, post]));
  const documents = [];
  for (const source of sources.sort((a, b) => a.number - b.number)) {
    let coverUrl;
    let internalUrl;
    const previous = existingBySlug.get(source.slug);
    if (previous?.cover?.url) {
      coverUrl = previous.cover.url;
      internalUrl = String(previous.content || "").match(/!\[[^\]]+\]\((https:\/\/ik\.imagekit\.io\/[^)]+)\)/)?.[1];
    }
    if (!coverUrl || !internalUrl) {
      const [coverData, internalData] = await Promise.all([
        sharp(await readFile(source.coverImage)).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer(),
        sharp(await readFile(source.internalImage)).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer(),
      ]);
      [coverUrl, internalUrl] = await Promise.all([
        uploadImage(coverData, `blog-${source.number}-${source.slug}-cover.webp`, "blogs/covers", "bg-elevators,blog,cover,cms-import"),
        uploadImage(internalData, `blog-${source.number}-${path.basename(source.internalImage, ".jpeg")}.webp`, "blogs/content", "bg-elevators,blog,content,cms-import"),
      ]);
    }
    const content = source.article.content.replace(
      "[[INTERNAL_IMAGE]]",
      `![${source.article.internalImageAlt}](${internalUrl})`,
    );
    documents.push({
      slug: source.slug,
      routePath: `/blog/${source.slug}`,
      title: source.article.title,
      excerpt: source.article.metaDescription,
      content,
      category: "Elevator insights",
      imageAlt: source.article.title,
      seoTitle: source.article.metaTitle,
      seoDescription: source.article.metaDescription,
      status: "published",
      publishedAt: new Date(Date.now() - (source.number - 31) * 1000),
      showDate: false,
      cover: { url: coverUrl, contentType: "image/webp" },
      importSource,
      createdBy: "document-import",
      updatedBy: "document-import",
    });
  }
  const result = await Blog.bulkWrite(documents.map((document) => ({
    updateOne: {
      filter: { slug: document.slug },
      update: { $set: document, $unset: { structuredBody: "", structuredHeadings: "", additionalSections: "" } },
      upsert: true,
    },
  })), { ordered: true });
  const verified = await Blog.find({ importSource }).select("slug title content cover.url showDate status routePath").lean();
  if (
    verified.length !== 10 ||
    verified.some(
      (post) =>
        post.showDate !== false ||
        post.status !== "published" ||
        !post.cover?.url ||
        post.routePath?.endsWith(".html") ||
        /\[[^\]]+\]\((?:https:\/\/www\.bgelevators\.com)?\/[^)]*\.html(?:[?#][^)]*)?\)/i.test(post.content || "") ||
        !post.content.includes("https://ik.imagekit.io/"),
    )
  )
    throw new Error(`Post-import verification failed; verified ${verified.length} complete posts.`);
  console.log(`Import complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated; 10 published posts verified with hidden dates and no .html internal URLs.`);
} finally {
  await mongoose.disconnect();
}
