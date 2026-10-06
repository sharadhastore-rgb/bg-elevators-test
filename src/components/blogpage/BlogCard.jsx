import { AppLink, Icon } from "@/components/ui";
import ui from "@/data/ui.json";

export default function BlogCard({ article, featured = false }) {
  return (
    <article
      className={`tw:group tw:overflow-hidden ${
        featured
          ? "tw:mb-14 tw:grid tw:grid-cols-[1.15fr_1fr] tw:rounded-[14px] tw:bg-ink tw:text-white tw:max-[767px]:mb-[30px] tw:max-[767px]:grid-cols-1"
          : "tw:flex tw:flex-col tw:rounded-[10px] tw:border tw:border-[#dfe9f0] tw:bg-white"
      }`}
    >
      <AppLink
        href={article.href}
        className={`tw:block tw:overflow-hidden tw:bg-[#e9f2f8] ${
          featured
            ? "tw:min-h-[390px] tw:max-[767px]:aspect-[16/10] tw:max-[767px]:min-h-0"
            : "tw:aspect-[16/10]"
        }`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={article.image}
          className="tw:block tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-[1.035]"
          alt={article.imageAlt || `${article.title} — BG Elevators`}
          loading={featured ? "eager" : "lazy"}
        />
      </AppLink>
      <div
        className={`tw:flex tw:flex-1 tw:flex-col tw:items-start ${
          featured
            ? "tw:justify-center tw:p-[42px] tw:max-[1199px]:p-7 tw:max-[767px]:p-[26px]"
            : "tw:p-6"
        }`}
      >
        {article.date && (
          <p
            className={`tw:mt-0 tw:mb-[17px] tw:flex tw:items-center tw:gap-2 tw:text-[13px] tw:leading-[1.5] ${featured ? "tw:text-[#abd2eb]" : "tw:text-[#577284]"}`}
          >
            <Icon name="CalendarDays" size={15} />
            {article.date}
          </p>
        )}
        <h2
          className={`tw:mt-0 tw:font-semibold ${
            featured
              ? "tw:mb-[30px] tw:text-[clamp(26px,2.5vw,36px)] tw:leading-[1.25] tw:tracking-[-0.03em] tw:max-[767px]:text-[27px]"
              : "tw:mb-[26px] tw:text-xl tw:leading-[1.45] tw:tracking-[-0.02em] tw:text-ink"
          }`}
        >
          <AppLink
            className="tw:hover:underline tw:hover:underline-offset-4"
            href={article.href}
          >
            {article.title}
          </AppLink>
        </h2>
        {article.description && (
          <p
            className={`tw:-mt-2.5 tw:mb-[26px] tw:text-[15px] tw:leading-[1.75] ${featured ? "tw:text-[#c3d8e5]" : "tw:text-[#577284]"}`}
          >
            {article.description}
          </p>
        )}
        <AppLink
          href={article.href}
          className={`tw:inline-flex tw:items-center tw:gap-3 tw:text-sm tw:leading-[1.5] tw:font-medium ${featured ? "tw:text-white" : "tw:mt-auto tw:text-[#1275b5]"}`}
          aria-label={`${ui.blog.readArticle}: ${article.title}`}
        >
          {ui.blog.readArticle}
          <Icon
            name="ArrowUpRight"
            className="tw:transition-transform tw:duration-200 tw:group-hover:translate-x-0.5 tw:group-hover:-translate-y-0.5"
            size={20}
          />
        </AppLink>
      </div>
    </article>
  );
}
