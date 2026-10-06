import { AppLink, Icon, Carousel } from "@/components/ui";

export default function ProductsSection({ data }) {
  return (
    <section className="home-products-section tw:overflow-hidden tw:px-[5%] tw:py-12 tw:max-[479px]:px-4 tw:max-[479px]:py-8">
      <div className="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-[82.5rem]">
        <div className="tw:mb-[3.75rem] tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-6 tw:max-[767px]:mb-9 tw:max-[767px]:items-start">
          <div className="tw:flex tw:flex-col tw:gap-4">
            <div className="tw:flex tw:w-max tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-soft tw:px-5 tw:py-2.5 tw:text-sm tw:leading-[1.3] tw:font-medium tw:text-[#17331c]">
              {data.text}
            </div>
            <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[1.75rem] tw:min-[992px]:text-[2rem] tw:xl:text-[2.75rem] tw:xl:leading-[1.3]">
              {data.heading}
            </h2>
          </div>
          <AppLink
            className="tw:flex tw:w-max tw:flex-wrap tw:items-center tw:justify-center tw:gap-2 tw:overflow-hidden tw:py-2 tw:text-[#181818] tw:no-underline"
            href={data.link}
          >
            <span className="tw:text-base tw:font-medium">{data.text2}</span>
            <Icon name="ArrowRight" className="tw:size-6" />
          </AppLink>
        </div>
        <div>
          <Carousel variant="products">
            {data.items.map((item, index) => (
              <div className="tw:h-full tw:w-full" key={index}>
                <div className="tw:flex tw:h-full tw:w-full tw:justify-center">
                  <AppLink
                    className="tw:group tw:flex tw:h-full tw:w-full tw:max-w-[26.5rem] tw:flex-col tw:gap-5 tw:no-underline tw:max-[991px]:max-w-none"
                    href={item.link}
                  >
                    <div className="tw:relative tw:overflow-hidden tw:pt-[129.953%] tw:max-[767px]:pt-[120%] tw:[touch-action:pan-x_pan-y_pinch-zoom]">
                      <img
                        alt={item.imageAlt}
                        className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-[650ms] tw:ease-[cubic-bezier(0.22,1,0.36,1)] tw:group-hover:scale-[1.035]"
                        loading="lazy"
                        sizes="100vw"
                        src={item.image}
                      />
                    </div>
                    <div className="tw:grid tw:min-h-[62px] tw:grid-cols-[minmax(0,1fr)_2rem] tw:items-center tw:gap-3 tw:pt-4 tw:pb-3">
                      <h3 className="tw:m-0 tw:min-w-0 tw:text-[1.18rem] tw:leading-[1.25] tw:font-semibold tw:text-[#183b23]">
                        {item.heading}
                      </h3>
                      <span className="tw:grid tw:size-8 tw:place-items-center tw:justify-self-end tw:text-[#333]">
                        <Icon
                          name="CircleArrowOutUpRight"
                          className="tw:size-[23px]"
                        />
                      </span>
                    </div>
                  </AppLink>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
