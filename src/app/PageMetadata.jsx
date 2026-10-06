import { useEffect } from "react";
export default function PageMetadata({ meta }) {
  useEffect(() => {
    if (!meta) return;
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
    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim();
    if (verification)
      pageMeta.push({
        name: "google-site-verification",
        content: verification,
      });
    document.title = meta.title;
    document
      .querySelectorAll("[data-page-meta]")
      .forEach((element) => element.remove());
    for (const data of pageMeta) {
      const element = document.createElement("meta");
      for (const [key, value] of Object.entries(data))
        element.setAttribute(key, value);
      element.setAttribute("data-page-meta", "");
      document.head.append(element);
    }
    if (meta.canonical) {
      const element = document.createElement("link");
      element.rel = "canonical";
      element.href = meta.canonical;
      element.setAttribute("data-page-meta", "");
      document.head.append(element);
      if (!pageMeta.some((item) => item.property === "og:url")) {
        const openGraphUrl = document.createElement("meta");
        openGraphUrl.setAttribute("property", "og:url");
        openGraphUrl.content = meta.canonical;
        openGraphUrl.setAttribute("data-page-meta", "");
        document.head.append(openGraphUrl);
      }
    }
    for (const schema of meta.schemas || []) {
      const element = document.createElement("script");
      element.type = "application/ld+json";
      element.textContent = JSON.stringify(schema);
      element.setAttribute("data-page-meta", "");
      document.head.append(element);
    }
  }, [meta]);
  return null;
}
