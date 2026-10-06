import { AppLink, Icon } from "@/components/ui";

export default function RelatedArticlesSection({ data }) {
  return (
    <section className="tw:bg-[#eaf4fb] tw:px-[5%] tw:py-20 tw:max-[991px]:px-10 tw:max-[767px]:py-14 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mb-10 tw:flex tw:items-end tw:justify-between tw:gap-8 tw:max-[767px]:items-start">
          <div className="tw:flex tw:max-w-3xl tw:flex-col tw:items-start tw:gap-4">
            <div className="tw:rounded-full tw:bg-[#b9e1f4] tw:px-5 tw:py-2 tw:text-sm tw:font-medium tw:text-[#123d2a]">
              {data.text}
            </div>
            <h2 className="tw:m-0 tw:text-[clamp(2rem,3.4vw,3.5rem)] tw:leading-[1.08] tw:font-semibold tw:tracking-[-0.035em] tw:text-[#181818]">
              {data.heading}
              <span className="tw:text-brand">{data.text2}</span>
            </h2>
          </div>
          <AppLink
            className="tw:inline-flex tw:shrink-0 tw:items-center tw:gap-2 tw:pb-1 tw:text-base tw:font-medium tw:text-[#181818] tw:hover:text-brand tw:max-[767px]:hidden"
            href={data.link}
          >
            <span>{data.text3}</span>
            <Icon name="ArrowRight" className="tw:size-5" />
          </AppLink>
        </div>
        <div>
          <div
            className="tw:grid tw:grid-cols-3 tw:items-start tw:gap-6 tw:max-[991px]:grid-cols-2 tw:max-[767px]:grid-cols-1"
            role="list"
          >
            {data.items.map((item, index) => (
              <div role="listitem" key={index}>
                <AppLink
                  className="tw:block tw:w-full tw:group"
                  href={item.link}
                >
                  <div className="tw:relative tw:mb-4 tw:aspect-[1.116/1] tw:overflow-hidden tw:rounded-xl tw:bg-white">
                    <img
                      alt={
                        item.imageAlt ||
                        `${item.heading || item.title} — BG Elevators`
                      }
                      className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-[1.035]"
                      loading="lazy"
                      src={item.image}
                    />
                  </div>
                  <div className="tw:mb-5 tw:flex tw:items-end tw:justify-between tw:gap-4 tw:border-b tw:border-[#a7b4bb] tw:pb-5">
                    <div className="tw:flex tw:flex-col tw:gap-2.5">
                      <div className="tw:text-sm tw:text-brand">
                        {item.text}
                      </div>
                      <h3 className="tw:m-0 tw:text-xl tw:leading-[1.25] tw:font-semibold tw:text-[#183625]">
                        {item.heading}
                      </h3>
                    </div>
                    <Icon
                      name="CircleArrowOutUpRight"
                      className="tw:size-6 tw:shrink-0 tw:transition-transform tw:duration-300 tw:group-hover:translate-x-0.5 tw:group-hover:-translate-y-0.5"
                    />
                  </div>
                  <p className="tw:m-0 tw:text-base tw:leading-[1.65] tw:text-[#465b50]">
                    {item.description}
                  </p>
                </AppLink>
              </div>
            ))}
          </div>
        </div>
        <AppLink
          className="tw:mt-8 tw:hidden tw:items-center tw:gap-2 tw:text-base tw:font-medium tw:text-[#181818] tw:max-[767px]:inline-flex"
          href={data.link}
        >
          <span>{data.text3}</span>
          <Icon name="ArrowRight" className="tw:size-5" />
        </AppLink>
      </div>
    </section>
  );
}
