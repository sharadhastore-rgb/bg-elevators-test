export default function WhyChooseUsSection({ data }) {
  const items = [
    {
      image: data.image,
      imageAlt: data.imageAlt,
      width: 55.5,
      heading: data.heading2,
      description: data.description,
    },
    {
      image: data.image2,
      imageAlt: data.imageAlt2,
      width: 60,
      heading: data.heading3,
      description: data.description2,
    },
    {
      image: data.image3,
      imageAlt: data.imageAlt3,
      width: 66.5,
      heading: data.heading4,
      description: data.description3,
    },
    {
      image: data.image4,
      imageAlt: data.imageAlt4,
      width: 65.5,
      heading: data.heading5,
      description: data.description4,
    },
  ];

  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:text-center">
          <div className="tw:flex tw:w-max tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-soft tw:px-5 tw:py-2.5 tw:text-sm tw:leading-[1.3] tw:font-medium tw:text-[#17331c]">
            {data.text}
          </div>
          <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[1.75rem] tw:min-[992px]:text-[2rem] tw:xl:text-[2.75rem] tw:xl:leading-[1.3]">
            {data.heading}
            <span className="tw:text-brand">{data.text2}</span>
          </h2>
        </div>
        <div className="tw:mt-[3.75rem] tw:flex tw:flex-col tw:gap-10 tw:max-[991px]:mt-8 tw:xl:flex-row tw:xl:items-center tw:xl:justify-between tw:xl:gap-8">
          <div className="tw:w-full tw:xl:max-w-[47.4375rem]">
            {items.map((item, index) => (
              <article
                className={`tw:flex tw:w-full tw:max-w-[28.4375rem] tw:items-start tw:gap-6 tw:px-6 tw:py-5 tw:max-[479px]:flex-col ${index === 1 ? "tw:ml-28 tw:max-[991px]:ml-20 tw:max-[767px]:ml-0 tw:xl:ml-20" : ""} ${index === 2 ? "tw:ml-56 tw:max-[991px]:ml-40 tw:max-[767px]:ml-0 tw:xl:ml-40" : ""} ${index === 3 ? "tw:ml-[21rem] tw:max-[991px]:ml-60 tw:max-[767px]:ml-0 tw:xl:ml-60" : ""}`}
                key={item.heading}
              >
                <img
                  alt={item.imageAlt}
                  className="tw:h-[60px] tw:shrink-0 tw:object-contain"
                  height="60"
                  loading="lazy"
                  src={item.image}
                  width={item.width}
                />
                <div className="tw:flex tw:flex-col tw:gap-2.5">
                  <h3 className="tw:m-0 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                    {item.heading}
                  </h3>
                  <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="tw:w-full tw:max-[991px]:hidden tw:xl:max-w-[33.5625rem]">
            <img
              alt={data.imageAlt5}
              className="tw:relative tw:h-[46.25rem] tw:w-full tw:object-cover tw:xl:h-[38.75rem]"
              loading="lazy"
              sizes="(max-width: 767px) 100vw, 537px"
              src={data.image5}
              width="537"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
