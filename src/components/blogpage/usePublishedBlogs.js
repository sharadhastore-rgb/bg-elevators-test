import { useEffect, useState } from "react";
import existing from "@/data/blogs.json";
const baseline = [...existing].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
);
function mergeArticles(dynamicArticles = []) {
  const merged = new Map();
  const cmsArticles = Array.isArray(dynamicArticles) ? dynamicArticles : [];
  for (const article of [...baseline, ...cmsArticles])
    merged.set(article.href.replace(/\.html$/, "").replace(/\/$/, ""), article);
  return [...merged.values()].sort(
    (a, b) =>
      new Date(b.updatedAt || b.publishedAt || b.date) -
      new Date(a.updatedAt || a.publishedAt || a.date),
  );
}

export default function usePublishedBlogs(initialArticles) {
  const hasInitialArticles = Array.isArray(initialArticles);
  const [articles, setArticles] = useState(() =>
    hasInitialArticles ? mergeArticles(initialArticles) : [],
  );
  const [loading, setLoading] = useState(!hasInitialArticles);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/blogs", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => {
        setArticles(mergeArticles(data.articles));
        setUnavailable(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setUnavailable(true);
          if (!hasInitialArticles) setArticles(baseline);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [hasInitialArticles]);
  return { articles, unavailable, loading };
}
