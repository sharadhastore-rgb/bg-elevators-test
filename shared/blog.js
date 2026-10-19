// Shared validation and plain-text blocks: never execute CMS-authored HTML.
export function validateBlog(input) {
  const data = Object.fromEntries(
    [
      "title",
      "slug",
      "excerpt",
      "content",
      "category",
      "imageAlt",
      "seoTitle",
      "seoDescription",
      "status",
    ].map((key) => [key, String(input[key] || "").trim()]),
  );
  if (data.title.length < 5 || data.title.length > 160)
    throw new Error("Title must contain 5–160 characters.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.slug.length > 120)
    throw new Error(
      "Use a URL slug with lowercase letters, numbers and hyphens.",
    );
  if (data.excerpt.length < 20 || data.excerpt.length > 320)
    throw new Error("Summary must contain 20–320 characters.");
  if (data.content.length < 50 || data.content.length > 100000)
    throw new Error("Article must contain 50–100,000 characters.");
  if (!["draft", "published"].includes(data.status))
    throw new Error("Choose draft or published.");
  for (const [key, max] of [
    ["category", 60],
    ["imageAlt", 180],
    ["seoTitle", 70],
    ["seoDescription", 170],
  ])
    if (data[key].length > max)
      throw new Error(`${key} is too long (maximum ${max}).`);
  if (data.status === "published" && !data.imageAlt)
    throw new Error("Add descriptive cover image alt text before publishing.");
  return data;
}
export function contentBlocks(content) {
  // Keep a Markdown image as its own block even when imported documents place
  // it directly after a list without an empty line.
  const normalizedContent = String(content).replace(
    /(^|\n)(!\[[^\]\r\n]+\]\(https:\/\/ik\.imagekit\.io\/[^)\r\n]+\))(?=\r?\n|$)/gm,
    "$1\n$2\n",
  );
  const inline = (text) => {
    const nodes = [];
    const pattern = /(\*\*([^*]+?)\s*\*\*|\*([^*]+?)\s*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/|#)[^)]+)\))/g;
    let index = 0;
    for (const match of String(text).matchAll(pattern)) {
      if (match.index > index) nodes.push(text.slice(index, match.index));
      if (match[2]) nodes.push({ tag: "strong", children: [match[2]] });
      else if (match[3]) nodes.push({ tag: "em", children: [match[3]] });
      else nodes.push({ tag: "a", attributes: { href: match[5] }, children: [match[4]] });
      index = match.index + match[0].length;
    }
    if (index < text.length) nodes.push(text.slice(index));
    return nodes.length ? nodes : [text];
  };
  const headings = [];
  const body = normalizedContent
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => {
      const image = paragraph.match(/^!\[([^\]]+)\]\((https:\/\/ik\.imagekit\.io\/[^)]+)\)$/);
      if (image)
        return {
          tag: "img",
          attributes: { src: image[2], alt: image[1], loading: "lazy" },
        };
      const match = paragraph.match(/^(#{1,6})\s+([^\n]+)$/);
      if (match) {
        const id = `section-${headings.length + 1}`,
          tag = `h${Math.max(2, match[1].length)}`,
          title = match[2].replace(/^\*\*|\*\*$/g, "").trim();
        headings.push({ id, title, level: tag });
        return { tag, attributes: { id }, children: inline(match[2]) };
      }
      const lines = paragraph.split("\n");
      if (
        lines.length >= 2 &&
        lines.every((line) => /^\|.*\|$/.test(line.trim())) &&
        /^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(lines[1].trim())
      ) {
        const cells = (line) => line.trim().slice(1, -1).split("|").map((cell) => cell.trim());
        return {
          tag: "table",
          children: [
            { tag: "thead", children: [{ tag: "tr", children: cells(lines[0]).map((cell) => ({ tag: "th", children: inline(cell) })) }] },
            { tag: "tbody", children: lines.slice(2).map((line) => ({ tag: "tr", children: cells(line).map((cell) => ({ tag: "td", children: inline(cell) })) })) },
          ],
        };
      }
      if (lines.every((line) => /^-\s+/.test(line)))
        return {
          tag: "ul",
          children: lines.map((line) => ({
            tag: "li",
            children: inline(line.replace(/^-\s+/, "")),
          })),
        };
      if (lines.every((line) => /^\d+\.\s+/.test(line)))
        return {
          tag: "ol",
          children: lines.map((line) => ({
            tag: "li",
            children: inline(line.replace(/^\d+\.\s+/, "")),
          })),
        };
      if (lines.every((line) => /^>\s+/.test(line)))
        return {
          tag: "blockquote",
          children: inline(lines.map((line) => line.replace(/^>\s+/, "")).join("\n")),
        };
      return { tag: "p", children: inline(paragraph) };
    });
  return { body, headings };
}
export function publicBlog(post) {
  const date = post.showDate === false
    ? ""
    : new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      });
  return {
    slug: String(post.routePath || `/journal/${post.slug}`).replace(/^\//, ""),
    href: post.routePath || `/journal/${post.slug}`,
    title: post.title,
    date,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    description: post.excerpt,
    image: post.cover?.url || `/api/blogs/${post.slug}/cover`,
    imageAlt: post.imageAlt,
    eyebrow: post.category || "Elevator insights",
    seoTitle: post.seoTitle || post.title,
    seoDescription: post.seoDescription || post.excerpt,
    ...(post.structuredBody?.length
      ? { body: post.structuredBody, headings: post.structuredHeadings || [] }
      : contentBlocks(post.content || "")),
    additionalSections: post.additionalSections || [],
  };
}

export function publicBlogSummary(post) {
  const article = publicBlog(post);
  const { body, headings, additionalSections, ...summary } = article;
  return summary;
}
