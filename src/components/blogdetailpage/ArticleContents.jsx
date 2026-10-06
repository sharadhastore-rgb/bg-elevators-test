import ui from "@/data/ui.json";

export default function ArticleContents({ article }) {
  if (!article.headings.length) return null;
  const primaryHeadings = article.headings
    .filter((heading) => heading.level === "h2")
    .slice(0, 5);
  return (
    <aside className="tw:sticky tw:top-[110px] tw:pt-1.5 tw:max-[1199px]:hidden">
      <nav aria-label={ui.blog.contents}>
        <h2 className="tw:mt-0 tw:mb-[15px] tw:text-[13px] tw:font-semibold tw:text-[#012034]">
          In this story
        </h2>
        <ol className="tw:mt-0 tw:mb-[25px] tw:list-disc tw:pl-[17px]">
          {primaryHeadings.map((heading) => (
            <li
              className="tw:mt-0 tw:mb-[9px] tw:text-[11px] tw:leading-[1.45] tw:text-[#597181]"
              key={heading.id}
            >
              <a
                className="tw:text-inherit tw:hover:text-[#0877ba]"
                href={`#${heading.id}`}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ol>
        <a
          className="tw:flex tw:w-full tw:items-center tw:justify-between tw:rounded-full tw:bg-[#201712] tw:px-[18px] tw:py-3 tw:text-[11px] tw:font-semibold tw:text-white tw:hover:bg-[#0877ba]"
          href="#main-content"
        >
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </nav>
    </aside>
  );
}
