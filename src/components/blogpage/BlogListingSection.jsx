import { useEffect, useRef, useState } from "react";
import BlogCard from "./BlogCard";
import usePublishedBlogs from "./usePublishedBlogs";
import ui from "@/data/ui.json";

// Three complete rows on desktop avoid a single orphaned card and keep the
// listing visually balanced. The responsive grid still collapses naturally.
const PAGE_SIZE = 9;

function paginationItems(currentPage, pageCount) {
  if (pageCount <= 7)
    return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set([1, pageCount]);
  for (let number = currentPage - 1; number <= currentPage + 1; number += 1) {
    if (number > 1 && number < pageCount) pages.add(number);
  }
  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
  }
  if (currentPage >= pageCount - 2) {
    pages.add(pageCount - 2);
    pages.add(pageCount - 1);
  }

  const ordered = [...pages].sort((a, b) => a - b);
  return ordered.flatMap((number, index) => {
    const previous = ordered[index - 1];
    return previous && number - previous > 1 ? ["ellipsis", number] : [number];
  });
}
export default function BlogListingSection({ initialArticles }) {
  const { articles, unavailable, loading } = usePublishedBlogs(initialArticles);
  const latestArticle = articles[0],
    remainingArticles = articles.slice(1);
  const [page, setPage] = useState(1);
  const listRef = useRef(null);
  const initialRender = useRef(true);
  const pageCount = Math.ceil(remainingArticles.length / PAGE_SIZE);
  const pageArticles = remainingArticles.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    listRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, [page]);

  return (
    <section>
      <div className="tw:border-b tw:border-[#dce9f2] tw:bg-mist tw:py-16 tw:pb-[4.875rem] tw:max-[767px]:py-11 tw:max-[767px]:pb-12">
        <div className="tw:mx-auto tw:w-[90%] tw:max-w-[1200px]">
          <p className="tw:mt-0 tw:mb-[18px] tw:text-[13px] tw:leading-[1.5] tw:font-semibold tw:tracking-[0.13em] tw:text-brand tw:uppercase">
            {ui.blog.eyebrow}
          </p>
          <h1
            className="tw:m-0 tw:max-w-[820px] tw:text-[clamp(32px,4.4vw,58px)] tw:leading-[1.08] tw:font-semibold tw:tracking-[-0.045em] tw:text-ink"
            aria-label={ui.blog.title}
          >
            <span>Stay Informed with</span>
            <span className="tw:block">Our Latest Blogs</span>
          </h1>
        </div>
      </div>
      <div className="tw:mx-auto tw:w-[90%] tw:max-w-[1200px] tw:pt-12 tw:pb-20 tw:max-[767px]:pt-7">
        {unavailable && (
          <p role="status" className="tw:mb-6 tw:text-sm tw:text-copy-muted">
            Recent articles are temporarily unavailable. You can still browse
            our existing guides.
          </p>
        )}
        {loading && !latestArticle && (
          <div className="tw:mb-14 tw:grid tw:min-h-[390px] tw:grid-cols-[1.15fr_1fr] tw:overflow-hidden tw:rounded-[14px] tw:bg-[#edf4f8] tw:max-[767px]:min-h-[480px] tw:max-[767px]:grid-cols-1" role="status" aria-label="Loading recent blogs">
            <div className="tw:animate-pulse tw:bg-[#dceaf2]" />
            <div className="tw:m-10 tw:animate-pulse tw:rounded-xl tw:bg-[#dceaf2] tw:max-[767px]:m-6" />
          </div>
        )}
        {latestArticle && <BlogCard article={latestArticle} featured />}
        <div
          className="tw:grid tw:grid-cols-1 tw:gap-8 tw:md:grid-cols-2 tw:xl:grid-cols-3 tw:max-[767px]:gap-6"
          ref={listRef}
        >
          {pageArticles.map((article, index) => (
            <BlogCard article={article} key={`${article.href}-${index}`} />
          ))}
        </div>
        {pageCount > 1 && (
          <nav
            className="tw:mt-[54px] tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-[18px] tw:border-t tw:border-[#dfe9f0] tw:pt-7 tw:max-[767px]:mt-9 tw:max-[767px]:gap-2"
            aria-label="Blog pages"
          >
            <button
              type="button"
              className="tw:inline-flex tw:h-[42px] tw:min-w-[42px] tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:border tw:border-[#cfdde6] tw:bg-white tw:px-3.5 tw:text-[13px] tw:font-semibold tw:text-[#244357] tw:transition-colors tw:hover:border-[#0877ba] tw:hover:bg-[#0877ba] tw:hover:text-white tw:disabled:cursor-not-allowed tw:disabled:opacity-40 tw:max-[767px]:h-[38px] tw:max-[767px]:min-w-[38px] tw:max-[767px]:px-2.5"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
              aria-label="Previous blog page"
            >
              ← <span className="tw:max-[767px]:hidden">Previous</span>
            </button>
            <div className="tw:flex tw:flex-wrap tw:justify-center tw:items-center tw:gap-2 tw:max-[767px]:gap-1.5">
              {paginationItems(page, pageCount).map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    className="tw:inline-flex tw:h-[42px] tw:min-w-5 tw:items-center tw:justify-center tw:text-sm tw:font-semibold tw:text-[#78909e] tw:max-[767px]:h-[38px]"
                    aria-hidden="true"
                    key={`ellipsis-${index}`}
                  >
                    &hellip;
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`tw:inline-flex tw:h-[42px] tw:min-w-[42px] tw:items-center tw:justify-center tw:rounded-full tw:border tw:px-0 tw:text-[13px] tw:font-semibold tw:transition-colors tw:max-[767px]:h-[38px] tw:max-[767px]:min-w-[38px] ${
                      item === page
                        ? "tw:border-[#0877ba] tw:bg-[#0877ba] tw:text-white"
                        : "tw:border-[#cfdde6] tw:bg-white tw:text-[#244357] tw:hover:border-[#0877ba] tw:hover:bg-[#0877ba] tw:hover:text-white"
                    }`}
                    aria-current={item === page ? "page" : undefined}
                    aria-label={`Blog page ${item}`}
                    onClick={() => setPage(item)}
                    key={item}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              className="tw:inline-flex tw:h-[42px] tw:min-w-[42px] tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:border tw:border-[#cfdde6] tw:bg-white tw:px-3.5 tw:text-[13px] tw:font-semibold tw:text-[#244357] tw:transition-colors tw:hover:border-[#0877ba] tw:hover:bg-[#0877ba] tw:hover:text-white tw:disabled:cursor-not-allowed tw:disabled:opacity-40 tw:max-[767px]:h-[38px] tw:max-[767px]:min-w-[38px] tw:max-[767px]:px-2.5"
              disabled={page === pageCount}
              onClick={() => setPage((value) => value + 1)}
              aria-label="Next blog page"
            >
              <span className="tw:max-[767px]:hidden">Next</span> →
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
