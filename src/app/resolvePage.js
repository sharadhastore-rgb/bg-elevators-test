import routes from "@/data/routes.json";
import articleIndex from "@/data/articleIndex.json";
import metadata from "@/data/metadata.json";
import { withStructuredData } from "./structuredData";

const pageModules = import.meta.glob("../pages/*.jsx");
const articles = import.meta.glob("../data/articles/*.json");
const routeMap = Object.fromEntries(
  routes.map((route) => [route.slug, route.page]),
);
const articleSlugs = new Set(articleIndex.map((article) => article.slug));
export function pageSlug(pathname) {
  return (
    decodeURIComponent(pathname)
      .replace(/^\/+|\/+$/g, "")
      .replace(/\.html$/, "") || "index"
  );
}
export async function resolvePage(pathname, suppliedArticle, suppliedBlogs) {
  const slug = pageSlug(pathname);
  if (slug.startsWith("journal/")) {
    let article = suppliedArticle;
    if (!article && typeof window !== "undefined") {
      const response = await fetch(
        `/api/blogs/${encodeURIComponent(slug.slice(8))}`,
        { cache: "no-store" },
      );
      if (response.ok) article = await response.json();
      else if (response.status !== 404)
        throw new Error("Article temporarily unavailable");
    }
    if (article) {
      const page = await pageModules["../pages/BlogDetailPage.jsx"]();
      const canonical = `https://www.bgelevators.com/${slug}`;
      return {
        slug,
        Component: page.default,
        props: { article },
        found: true,
        meta: {
          title: `${article.seoTitle} | BG Elevators`,
          canonical,
          meta: [
            { name: "description", content: article.seoDescription },
            { property: "og:type", content: "article" },
            {
              property: "og:image",
              content: `https://www.bgelevators.com${article.image}`,
            },
          ],
          schemas: [
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: article.title,
              datePublished: article.publishedAt,
              description: article.description,
              image: `https://www.bgelevators.com${article.image}`,
              mainEntityOfPage: canonical,
              author: { "@type": "Organization", name: "BG Elevators" },
            },
          ],
        },
      };
    }
  }
  if (articleSlugs.has(slug)) {
    const [page, staticArticle] = await Promise.all([
      pageModules["../pages/BlogDetailPage.jsx"](),
      articles[`../data/articles/${slug}.json`](),
    ]);
    const article = suppliedArticle || staticArticle.default;
    return {
      slug,
      Component: page.default,
      props: { article },
      meta: withStructuredData(metadata[slug], {
        slug,
        article,
      }),
      found: true,
    };
  }
  const name = routeMap[slug];
  const page = await pageModules[`../pages/${name || "NotFoundPage"}.jsx`]();
  const baseMeta = metadata[slug] || {
    title: "Page not found | BG Elevators",
    meta: [{ name: "robots", content: "noindex" }],
    schemas: [],
  };
  return {
    slug,
    Component: page.default,
    props: name === "BlogsPage" ? { initialArticles: suppliedBlogs } : {},
    meta: withStructuredData(baseMeta, { slug }),
    found: !!name,
  };
}
export const allPaths = [
  "/",
  ...routes
    .filter((route) => route.slug !== "index")
    .map((route) => route.path),
  ...articleIndex.map((article) => `/${article.slug}`),
];
