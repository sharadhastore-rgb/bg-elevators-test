export default function MissionSection({ data }) {
  return (
    <section className="tw:overflow-hidden tw:bg-primary-soft tw:px-[5%] tw:py-12 tw:max-[600px]:px-4 tw:max-[600px]:py-8">
      <div className="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-[82.5rem]">
        <div className="tw:grid tw:grid-cols-1 tw:gap-10 tw:xl:grid-cols-2">
          <div>
            <div className="tw:mb-8 tw:flex tw:flex-col tw:gap-6">
              <h2 className="h4">
                {data.heading}
                <span className="tw:text-brand">{data.text}</span>
              </h2>
              <p className="text-base">{data.description}</p>
            </div>
            <div>
              {data.items.map((item, index) => (
                <div
                  className="tw:mb-5 tw:flex tw:w-max tw:min-w-0 tw:max-w-full tw:items-center tw:gap-3 tw:border-b tw:border-[#2e2e2e] tw:pr-8 tw:pb-5 tw:max-[600px]:w-full tw:max-[600px]:pr-0"
                  key={index}
                >
                  <img
                    alt={item.imageAlt}
                    loading="lazy"
                    src={item.image}
                    width="24"
                  />
                  <p className="text-lg">{item.description}</p>
                </div>
              ))}
              <div className="tw:flex tw:w-max tw:min-w-0 tw:max-w-full tw:items-center tw:gap-3 tw:pr-8 tw:max-[600px]:w-full tw:max-[600px]:pr-0">
                <img
                  alt={data.imageAlt}
                  loading="lazy"
                  src={data.image}
                  width="24"
                />
                <p className="text-lg">{data.description2}</p>
              </div>
            </div>
          </div>
          <div className="tw:grid tw:grid-cols-[1fr_1.5fr] tw:items-start tw:gap-6 tw:max-[479px]:grid-cols-1">
            <div className="tw:h-full tw:w-full">
              <div className="tw:relative tw:pt-[100.321%]">
                <img
                  alt={data.imageAlt2}
                  className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                  loading="lazy"
                  sizes="(max-width: 479px) 100vw, 312px"
                  src={data.image2}
                  width="312"
                />
              </div>
              <div>
                <div className="tw:text-right">
                  <div className="h2 tw:text-brand">{data.heading2}</div>
                </div>
                <div className="about-number-wrap-left">
                  <div className="h2 small">{data.heading3}</div>
                </div>
              </div>
            </div>
            <div className="tw:h-full tw:w-full">
              <div className="tw:relative tw:h-full tw:pt-0 tw:max-[991px]:h-auto tw:max-[991px]:pt-[134.943%]">
                <img
                  alt={data.imageAlt3}
                  className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                  loading="lazy"
                  sizes="(max-width: 479px) 100vw, 409px"
                  src={data.image3}
                  width="409"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
