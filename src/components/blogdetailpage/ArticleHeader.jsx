import { AppLink, Icon } from "@/components/ui";
import { businessProfile } from "@/data/businessProfile";

function nodeText(node) {
  if (typeof node === "string") return node;
  return node?.children?.map(nodeText).join("") || "";
}

export default function ArticleHeader({ article }) {
  const introduction = article.body
    .find((node) => node?.tag === "p" && nodeText(node).trim())
    ?.children?.map(nodeText)
    .join("")
    .trim();
  const articleWords = article.body
    .map(nodeText)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(articleWords / 220));
  const reviewedDate =
    article.modifiedDate || article.date || "September 29, 2026";

  return (
    <header className="tw:pt-7 tw:max-[767px]:pt-[22px]">
      <div className="tw:mx-auto tw:grid tw:w-[90%] tw:max-w-[1400px] tw:grid-cols-[minmax(20rem,0.95fr)_minmax(0,1.05fr)] tw:items-start tw:gap-x-[clamp(2.5rem,5vw,5rem)] tw:gap-y-[clamp(1.75rem,3vw,2.75rem)] tw:max-[1199px]:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)] tw:max-[1199px]:gap-x-10 tw:max-[1199px]:gap-y-8 tw:max-[767px]:block tw:max-[767px]:w-[min(calc(100%_-_32px),860px)]">
        <div className="tw:col-span-full tw:grid tw:grid-cols-[1fr_auto_1fr] tw:items-start tw:gap-6 tw:border-b tw:border-[#ddd3c4] tw:pb-6 tw:max-[767px]:grid-cols-1 tw:max-[767px]:gap-5">
          <AppLink
            href="/blogs"
            className="tw:m-0 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-[#38251d] tw:hover:text-[#a56d18]"
          >
            <Icon name="ArrowLeft" size={16} />
            Journal
          </AppLink>
          <div className="tw:grid tw:justify-items-center tw:gap-1.5">
            <div className="tw:m-0 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-2.5 tw:text-xs tw:leading-normal tw:text-[#604c42] tw:max-[767px]:mb-[18px] tw:max-[767px]:gap-[7px] tw:max-[767px]:text-[11px]">
              <span className="tw:text-[#b47a22]">{article.eyebrow}</span>
              {article.date && (
                <>
                  <i className="tw:not-italic tw:text-[#8d7c72]">·</i>
                  <time>{article.date}</time>
                </>
              )}
              <i className="tw:not-italic tw:text-[#8d7c72]">·</i>
              <span>{readingMinutes} min read</span>
            </div>
            <div className="tw:m-0 tw:flex tw:flex-wrap tw:justify-center tw:gap-2 tw:text-xs tw:text-[#6e625b]">
              <span>By {businessProfile.legalAuthorName}</span>
              <i className="tw:not-italic tw:text-[#a29389]">·</i>
              <span>
                Last reviewed <time>{reviewedDate}</time>
              </span>
            </div>
          </div>
          <span
            className="tw:min-w-20 tw:max-[767px]:hidden"
            aria-hidden="true"
          />
        </div>
        <div className="tw:m-0 tw:max-[767px]:my-9 tw:max-[767px]:mb-[30px]">
          <h1 className="tw:m-0 tw:max-w-[620px] tw:text-left tw:text-[clamp(38px,4vw,58px)] tw:leading-[1.06] tw:font-semibold tw:tracking-[-0.045em] tw:text-pretty tw:text-[#211612] tw:max-[767px]:mb-5 tw:max-[767px]:text-[clamp(34px,10vw,48px)] tw:max-[767px]:leading-[1.08]">
            {article.title}
          </h1>
          {introduction && (
            <p className="tw:mt-7 tw:mb-0 tw:max-w-xl tw:p-0 tw:text-left tw:text-[15px] tw:leading-[1.65] tw:font-normal tw:text-pretty tw:text-[#674d40] tw:max-[767px]:mt-0 tw:max-[767px]:pl-4 tw:max-[767px]:text-sm tw:max-[767px]:leading-[1.6]">
              {introduction}
            </p>
          )}
        </div>
        {article.image && (
          <div className="tw:col-start-2 tw:w-full tw:max-w-[650px] tw:justify-self-end tw:overflow-hidden tw:rounded-2xl tw:bg-[#eaf2f6] tw:shadow-[0_20px_55px_rgb(1_32_52/0.1)] tw:max-[767px]:rounded-[10px]">
            <img
              src={article.image}
              alt={article.imageAlt || `${article.title} — BG Elevators`}
              className="tw:block tw:h-[clamp(350px,36vw,500px)] tw:w-full tw:object-cover tw:max-[767px]:h-auto tw:max-[767px]:min-h-[230px] tw:max-[767px]:max-h-[430px]"
              fetchPriority="high"
            />
          </div>
        )}
      </div>
    </header>
  );
}
