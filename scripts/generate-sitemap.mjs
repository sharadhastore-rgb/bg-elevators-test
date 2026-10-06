import { readFile, writeFile } from "node:fs/promises";
const metadata = JSON.parse(await readFile("src/data/metadata.json", "utf8"));
const siteOrigin = (
  process.env.SITE_URL || "https://www.bgelevators.com"
).replace(/\/$/, "");
const urls = [
  ...new Set(
    Object.values(metadata)
      .filter(
        (page) =>
          !page.meta?.some(
            (item) =>
              item.name === "robots" && /noindex/i.test(item.content || ""),
          ),
      )
      .map((page) => page.canonical)
      .filter(Boolean)
      .map((url) => new URL(url, siteOrigin).href),
  ),
].sort();
const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile("public/sitemap.xml", xml);
console.log(
  `Generated sitemap.xml with ${urls.length} canonical, indexable URLs.`,
);
