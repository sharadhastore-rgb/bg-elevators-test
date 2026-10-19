import usePublishedBlogs from "../blogpage/usePublishedBlogs";
import { AppLink, Icon } from "@/components/ui";

export default function LatestBlogsSection({ data }) {
  const { articles, loading } = usePublishedBlogs();
  const items = articles
    .slice(0, 3)
    .map((article) => ({
      link: article.href,
      image: article.image,
      imageAlt: article.imageAlt,
      heading: article.title,
      text: article.date,
      description: article.description,
    }));
  return (
    <section className="tw:bg-[#fbfcfb] tw:px-[5%] tw:py-12 tw:max-[479px]:px-5 tw:max-[479px]:py-8">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mx-auto tw:mb-[3.75rem] tw:flex tw:max-w-[30.5rem] tw:flex-col tw:items-center tw:gap-6 tw:text-center tw:max-[991px]:mb-8">
          <div className="tw:flex tw:flex-col tw:items-center tw:gap-4">
            <div className="tw:flex tw:w-max tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-soft tw:px-5 tw:py-2.5 tw:text-sm tw:leading-[1.3] tw:font-medium tw:text-[#17331c]">
              {data.text}
            </div>
            <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[1.75rem] tw:min-[992px]:text-[2rem] tw:xl:text-[2.75rem] tw:xl:leading-[1.3]">
              {data.heading}
            </h2>
          </div>
          <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
            {data.description}
          </p>
        </div>
        <div>
          <div
            className="tw:flex tw:items-start tw:gap-6 tw:max-[991px]:flex-wrap tw:max-[991px]:justify-center tw:max-[767px]:flex-col tw:max-[767px]:items-center"
            role="list"
          >
            {loading && !items.length && [0, 1, 2].map((item) => (
              <div className="tw:w-full tw:animate-pulse tw:max-[991px]:max-w-[20.5rem] tw:max-[767px]:max-w-none" role="status" aria-label="Loading blog" key={item}>
                <div className="tw:mb-4 tw:aspect-[16/10] tw:rounded-lg tw:bg-[#dceaf2]" />
                <div className="tw:h-24 tw:rounded-lg tw:bg-[#edf4f8]" />
              </div>
            ))}
            {items.map((item, index) => (
              <div
                className="tw:w-full tw:max-[991px]:max-w-[20.5rem] tw:max-[767px]:max-w-none"
                role="listitem"
                key={index}
              >
                <AppLink
                  className="tw:block tw:w-full tw:max-w-[26.5rem] tw:no-underline tw:max-[767px]:max-w-none"
                  href={item.link}
                >
                  <div className="tw:relative tw:mb-4 tw:overflow-hidden tw:pt-[89.6226%]">
                    <img
                      alt={
                        item.imageAlt ||
                        `${item.heading || item.title} — BG Elevators`
                      }
                      className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                      loading="lazy"
                      src={item.image}
                    />
                  </div>
                  <div className="tw:mb-5 tw:grid tw:w-full tw:grid-cols-[minmax(0,1fr)_auto] tw:items-end tw:gap-4 tw:border-b tw:border-[#adadad] tw:pb-5">
                    <div className="tw:flex tw:flex-col tw:gap-2">
                      <div className="tw:text-sm tw:text-brand">
                        {item.text}
                      </div>
                      <h3 className="tw:m-0 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                        {item.heading}
                      </h3>
                    </div>
                    <Icon
                      name="CircleArrowOutUpRight"
                      className="tw:size-6 tw:text-[#181818]"
                    />
                  </div>
                  <p className="tw:m-0 tw:text-lg tw:leading-[1.6] tw:text-[#2e2e2e]">
                    {item.description}
                  </p>
                </AppLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
