import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const source = process.argv[2];
const root = path.resolve(import.meta.dirname, "..");
if (!source) throw new Error("Pass the extracted legacy project directory.");

const slugs = [
  "elevator-dimensions-which-measurements-matter-most-before-ordering-a-lift",
  "home-lift-installation-bangalore-what-should-be-decided-before-construction-begins",
  "how-can-homeowners-prepare-their-property-for-home-elevator-installation-in-bangalore",
  "how-do-elevator-cabin-dimensions-affect-wheelchair-and-luggage-space",
  "how-is-the-required-elevator-overhead-space-determined",
  "how-is-the-required-elevator-pit-depth-determined",
  "how-should-elevator-shaft-dimensions-be-planned-for-different-lift-types",
  "installing-an-elevator-in-an-existing-house-what-should-homeowners-check-first",
  "residential-elevator-installation-how-can-an-elevator-be-integrated-into-an-existing-home-design",
  "what-happens-between-elevator-installation-and-final-handover",
  "what-information-do-elevator-manufacturers-in-bangalore-need-before-giving-a-quote",
  "what-should-be-finalized-before-an-elevator-shaft-is-constructed",
];

const entities = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
const decode = (value = "") => value
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (match, name) => entities[name.toLowerCase()] ?? match);
const clean = (value = "") => decode(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const attr = (tag, name) => decode(tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "");
const normalizeHref = (href) => {
  let value = href.trim();
  value = value.replace(/^https?:\/\/(?:www\.)?bgelevators\.com/i, "");
  if (!value || value.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(value)) return value;
  if (!value.startsWith("/")) value = `/${value.replace(/^\.\//, "")}`;
  value = value.replace(/\/index(?:\.html)?(?=([?#]|$))/i, "/");
  return value.replace(/\.html(?=([?#]|$))/gi, "");
};
const extractDiv = (html, className) => {
  const start = html.search(new RegExp(`<div[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "i"));
  if (start < 0) throw new Error(`Missing ${className}`);
  const openEnd = html.indexOf(">", start) + 1;
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = openEnd;
  let depth = 1, match;
  while ((match = tags.exec(html))) {
    depth += /^<\/div/i.test(match[0]) ? -1 : 1;
    if (!depth) return html.slice(openEnd, match.index);
  }
  throw new Error(`Unclosed ${className}`);
};

function structured(html) {
  const rootNode = { children: [] };
  const stack = [rootNode];
  const allowed = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "strong", "b", "em", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "br"]);
  const voidTags = new Set(["br"]);
  const tokens = html.match(/<[^>]+>|[^<]+/g) || [];
  for (const token of tokens) {
    if (!token.startsWith("<")) {
      const text = decode(token).replace(/\s+/g, " ");
      if (text.trim()) stack.at(-1).children.push(text);
      continue;
    }
    if (/^<!--/.test(token)) continue;
    const closing = token.match(/^<\/\s*([\w-]+)/);
    if (closing) {
      const tag = closing[1].toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
      continue;
    }
    const opening = token.match(/^<\s*([\w-]+)/);
    if (!opening) continue;
    let tag = opening[1].toLowerCase();
    if (!allowed.has(tag)) continue;
    if (tag === "b") tag = "strong";
    if (tag === "h1") tag = "h2";
    const node = { tag, children: [] };
    if (tag === "a") {
      const href = normalizeHref(attr(token, "href"));
      if (href) node.attributes = { href };
    }
    stack.at(-1).children.push(node);
    if (!voidTags.has(tag) && !/\/>$/.test(token)) stack.push(node);
  }
  const body = rootNode.children.filter((node) => typeof node !== "string" || node.trim());
  const headings = [];
  const textOf = (node) => typeof node === "string" ? node : (node.children || []).map(textOf).join("");
  for (const node of body) {
    if (!/^h[2-6]$/.test(node?.tag || "")) continue;
    const id = `section-${headings.length + 1}`;
    node.attributes = { ...(node.attributes || {}), id };
    headings.push({ id, title: clean(textOf(node)), level: node.tag });
  }
  return { body, headings };
}

const indexPath = path.join(root, "src/data/articleIndex.json");
const blogsPath = path.join(root, "src/data/blogs.json");
const metadataPath = path.join(root, "src/data/metadata.json");
const [index, blogs, metadata] = await Promise.all([
  readFile(indexPath, "utf8").then(JSON.parse),
  readFile(blogsPath, "utf8").then(JSON.parse),
  readFile(metadataPath, "utf8").then(JSON.parse),
]);

for (const slug of slugs) {
  const html = await readFile(path.join(source, `${slug}.html`), "utf8");
  const title = clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const description = clean(html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/i)?.[1] || "");
  const published = attr(html.match(/<meta[^>]+article:published_time[^>]*>/i)?.[0] || "", "content");
  const rawImage = attr(html.match(/<img[^>]+class=["'][^"']*blog-cover-image[^"']*["'][^>]*>/i)?.[0] || "", "src");
  const imageName = path.basename(rawImage);
  const image = `/images/${imageName}`;
  const { body, headings } = structured(extractDiv(html, "blog-content"));
  const date = new Date(`${published || "2026-01-01"}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric", timeZone: "UTC" });
  const article = { slug, title, date, image, imageAlt: title, eyebrow: "Latest News", headings, body, additionalSections: [] };
  await writeFile(path.join(root, "src/data/articles", `${slug}.json`), `${JSON.stringify(article, null, 2)}\n`);
  if (imageName) {
    await mkdir(path.join(root, "public/images"), { recursive: true });
    await copyFile(path.join(source, "images", imageName), path.join(root, "public/images", imageName));
  }
  if (!index.some((item) => item.slug === slug)) index.push({ slug, title, date, image, imageAlt: title, eyebrow: "Latest News" });
  if (!blogs.some((item) => normalizeHref(item.href) === `/${slug}`)) blogs.unshift({ href: `/${slug}`, title, date, image, description });
  metadata[slug] = {
    title,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: `https://www.bgelevators.com${image}` },
      { property: "article:published_time", content: published },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    canonical: `https://www.bgelevators.com/${slug}`,
    schemas: [],
  };
}

index.sort((a, b) => a.slug.localeCompare(b.slug));
blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
await Promise.all([
  writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`),
  writeFile(blogsPath, `${JSON.stringify(blogs, null, 2)}\n`),
  writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`),
]);
console.log(`Imported ${slugs.length} extensionless blog pages.`);
