import assert from "node:assert/strict";
import { createApp } from "../server/app.js";
import { validateBlog, contentBlocks, publicBlog } from "../shared/blog.js";
const valid = {
  title: "Planning a home elevator",
  slug: "planning-a-home-elevator",
  excerpt: "A useful guide to planning your new home lift.",
  content:
    "Plan the installation early and consult a qualified professional.\n\n## Measure the site\n\n- Review space\n- Plan access",
  status: "published",
  imageAlt: "Residential elevator cabin",
};
assert.equal(validateBlog(valid).slug, valid.slug);
for (const input of [
  { ...valid, slug: "../admin" },
  { ...valid, status: "scheduled" },
  { ...valid, title: "Hi" },
  { ...valid, imageAlt: "" },
])
  assert.throws(() => validateBlog(input));
const blocks = contentBlocks(
  "## Planning\n\n<script>alert(1)</script>\n\n- First step\n- Second step",
);
assert.equal(blocks.body[1].tag, "p");
assert.equal(blocks.body[1].children[0], "<script>alert(1)</script>");
assert.equal(blocks.headings[0].id, "section-1");
assert.equal(blocks.body[2].tag, "ul");
const rich = contentBlocks(
  "## **Why It Matters**\n\n#### **Frequently Asked Questions**\n\n**Q1. Is it safe? ** Yes.\n\n[Contact us](/contact-us)\n\n1. **First step**\n2. Second step",
);
assert.equal(rich.body[0].tag, "h2");
assert.equal(rich.body[0].children[0].tag, "strong");
assert.equal(rich.body[1].tag, "h4");
assert.equal(rich.body[2].children[0].tag, "strong");
assert.equal(rich.body[3].children[0].tag, "a");
assert.equal(rich.body[3].children[0].attributes.href, "/contact-us");
assert.equal(rich.body[4].tag, "ol");
const post = {
  ...valid,
  publishedAt: new Date("2026-10-06T00:00:00Z"),
  updatedAt: new Date("2026-10-06T00:00:00Z"),
  cover: { contentType: "image/png", data: Buffer.from([137, 80, 78, 71]) },
};
const repo = {
  listBlogs: async () => [post],
  getBlog: async (slug) => (slug === post.slug ? post : null),
};
const server = createApp({ repository: repo, config: {} }).listen(
  0,
  "127.0.0.1",
);
await new Promise((r) => server.once("listening", r));
const origin = `http://127.0.0.1:${server.address().port}`;
try {
  const list = await fetch(`${origin}/api/blogs`);
  assert.equal(list.status, 200);
  const data = await list.json();
  assert.equal(data.articles[0].href, "/journal/planning-a-home-elevator");
  assert(!("cover" in data.articles[0]));
  assert.equal((await fetch(`${origin}/api/blogs/missing`)).status, 404);
  const detail = await fetch(`${origin}/api/blogs/${post.slug}`);
  assert.equal((await detail.json()).body[1].tag, "h2");
  const cover = await fetch(`${origin}/api/blogs/${post.slug}/cover`);
  assert.equal(cover.headers.get("content-type"), "image/png");
  assert.equal((await cover.arrayBuffer()).byteLength, 4);
  const sitemap = await fetch(`${origin}/sitemap.xml`);
  assert((await sitemap.text()).includes("/journal/planning-a-home-elevator"));
  const page = await fetch(`${origin}/journal/${post.slug}`);
  const html = await page.text();
  assert.equal(page.status, 200);
  assert(html.includes("Measure the site"));
  assert(html.includes("BlogPosting"));
  assert(html.includes('id="cms-article"'));
  assert.equal((await fetch(`${origin}/journal/missing`)).status, 404);
  assert.equal(publicBlog(post).seoTitle, post.title);
  console.log(
    "PASS: blog validation, safe article blocks, public list/detail/cover, SEO rendering, sitemap and 404 handling.",
  );
} finally {
  server.close();
}
