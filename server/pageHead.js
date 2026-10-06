export const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export function pageHead(meta) {
  const description =
    meta.meta?.find((item) => item.name === "description")?.content || "";
  const defaults = [
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "BG Elevators" },
    { property: "og:title", content: meta.title },
    { property: "og:description", content: description },
    {
      property: "og:image",
      content:
        "https://www.bgelevators.com/images/673d74269488c8595948fdd9_home-hero-image.webp",
    },
    {
      property: "og:image:alt",
      content: "BG Elevators premium elevator solutions",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content:
        "https://www.bgelevators.com/images/673d74269488c8595948fdd9_home-hero-image.webp",
    },
  ];
  const pageMeta = [...(meta.meta || [])];
  for (const item of defaults)
    if (
      item.content &&
      !pageMeta.some(
        (current) =>
          (item.name && current.name === item.name) ||
          (item.property && current.property === item.property),
      )
    )
      pageMeta.push(item);
  if (process.env.VITE_GOOGLE_SITE_VERIFICATION)
    pageMeta.push({
      name: "google-site-verification",
      content: process.env.VITE_GOOGLE_SITE_VERIFICATION,
    });
  const tags = pageMeta.map(
    (item) =>
      `<meta data-page-meta ${Object.entries(item)
        .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
        .join(" ")}>`,
  );
  if (meta.canonical)
    tags.push(
      `<link data-page-meta rel="canonical" href="${escapeHtml(meta.canonical)}">`,
    );
  if (
    meta.canonical &&
    !(meta.meta || []).some((item) => item.property === "og:url")
  )
    tags.push(
      `<meta data-page-meta property="og:url" content="${escapeHtml(meta.canonical)}">`,
    );
  for (const schema of meta.schemas || [])
    tags.push(
      `<script data-page-meta type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`,
    );
  return tags.join("\n    ");
}
