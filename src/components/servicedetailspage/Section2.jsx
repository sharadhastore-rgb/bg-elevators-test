import { AppLink, Icon } from "@/components/ui";

export default function Section2({ data }) {
  return (
    <section className="tw:bg-primary-soft tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mb-[3.75rem] tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-6 tw:max-[767px]:mb-8">
          <div className="tw:flex tw:flex-col tw:gap-4">
            <div className="badge">{data.text}</div>
            <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.3] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[2rem]">
              {data.heading}
              <span className="tw:text-brand">{data.text2}</span>
            </h2>
          </div>
          <AppLink
            className="tw:flex tw:w-max tw:flex-wrap tw:items-center tw:justify-center tw:gap-2 tw:overflow-hidden tw:py-2 tw:text-[#181818] tw:no-underline"
            href={data.link}
          >
            <div>{data.text3}</div>
            <div className="tw:flex tw:h-6 tw:w-6 tw:items-center tw:justify-center tw:overflow-hidden">
              <Icon name="ArrowRight" className="tw:h-6 tw:w-6" />
            </div>
          </AppLink>
        </div>
        <div>
          <div
            className="tw:flex tw:items-start tw:gap-6 tw:max-[991px]:flex-wrap tw:max-[991px]:justify-center tw:max-[767px]:flex-col tw:max-[767px]:items-center"
            role="list"
          >
            {data.items.map((item, index) => (
              <div
                className="tw:flex tw:w-full tw:items-stretch tw:justify-center tw:max-[991px]:max-w-[20.5rem] tw:max-[767px]:max-w-none"
                role="listitem"
                key={index}
              >
                <AppLink
                  className="tw:flex tw:w-full tw:max-w-[26.5rem] tw:flex-col tw:gap-5 tw:border-b tw:border-[#8a8a8a] tw:pb-4 tw:text-inherit tw:no-underline tw:max-[767px]:max-w-none"
                  href={item.link}
                >
                  <div className="tw:relative tw:overflow-hidden tw:pt-[129.953%] tw:max-[479px]:pt-[120%]">
                    <img
                      alt={item.imageAlt}
                      className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                      loading="lazy"
                      sizes="100vw"
                      src={item.image}
                    />
                  </div>
                  <div className="tw:flex tw:items-end tw:justify-between tw:gap-4">
                    <div className="tw:flex tw:flex-col tw:gap-2">
                      <div className="tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-[#17331c]">
                        {item.heading}
                      </div>
                    </div>
                    <div className="tw:h-6 tw:w-6 tw:shrink-0">
                      <Icon name="CircleArrowOutUpRight" className="" />
                    </div>
                  </div>
                </AppLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
