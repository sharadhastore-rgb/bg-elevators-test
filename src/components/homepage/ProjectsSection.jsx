import { Carousel } from "@/components/ui";

export default function ProjectsSection({ data }) {
  return (
    <section className="tw:bg-[#fbfcfb] tw:px-[5%] tw:py-12 tw:max-[479px]:px-5 tw:max-[479px]:py-8">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mb-[3.25rem] tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-6 tw:max-[767px]:mb-8">
          <div className="tw:flex tw:flex-col tw:gap-4">
            <div className="tw:flex tw:w-max tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-soft tw:px-5 tw:py-2.5 tw:text-sm tw:leading-[1.3] tw:font-medium tw:text-[#17331c]">
              {data.text}
            </div>
            <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[1.75rem] tw:min-[992px]:text-[2rem] tw:xl:text-[2.75rem] tw:xl:leading-[1.3]">
              {data.heading}
              <span className="tw:text-brand">{data.text2}</span>
            </h2>
          </div>
        </div>
        <Carousel autoPlay interval={5000} variant="projects">
          {data.items.map((item, index) => (
            <div className="tw:h-full tw:w-full" key={index}>
              <div className="tw:h-full tw:w-full" role="listitem">
                <article className="tw:flex tw:h-full tw:w-full tw:flex-col tw:border-b tw:border-[#aaa] tw:pb-[15px]">
                  <div className="tw:relative tw:overflow-hidden tw:bg-[#edf2f4] tw:pt-[129.953%] tw:max-[767px]:pt-[120%]">
                    <img
                      alt={item.imageAlt}
                      className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                      loading="lazy"
                      sizes="100vw"
                      src={item.image}
                    />
                  </div>
                  <div className="tw:flex tw:items-end tw:justify-between tw:pt-[15px]">
                    <div className="tw:flex tw:flex-col tw:gap-[7px]">
                      <div className="tw:text-[0.9rem] tw:font-medium tw:text-[#0575ad]">
                        {item.text}
                      </div>
                      <h3 className="tw:m-0 tw:text-base tw:leading-[1.2] tw:font-semibold tw:text-[#183b23]">
                        {item.heading}
                      </h3>
                    </div>
                  </div>
                  <div className="tw:mt-3.5 tw:text-[#777]">
                    <div className="tw:flex tw:gap-[18px]">
                      {item.items.map((detail, detailIndex) => (
                        <p
                          className="tw:m-0 tw:text-[0.72rem] tw:whitespace-nowrap"
                          key={detailIndex}
                        >
                          {detail.description}
                          <strong>{detail.text}</strong>
                        </p>
                      ))}
                    </div>
                    <div className="tw:flex tw:gap-[18px]">
                      <p className="tw:m-0 tw:text-[0.72rem] tw:whitespace-nowrap">
                        {item.description}
                        <strong>{item.text2}</strong>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
