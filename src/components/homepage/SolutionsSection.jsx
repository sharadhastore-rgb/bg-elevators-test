function SolutionCard({
  image,
  imageAlt,
  heading,
  descriptions,
  dark = false,
}) {
  return (
    <article
      className={`tw:flex tw:min-w-0 tw:flex-[1_1_calc(50%_-_1rem)] tw:items-center tw:gap-4 tw:max-[991px]:w-full tw:max-[991px]:flex-none tw:max-[767px]:flex-col ${dark ? "tw:bg-[#023556] tw:text-[#f2f2f2]" : "tw:bg-[#f2f2f2] tw:text-[#181818]"}`}
    >
      <div className="tw:h-80 tw:w-full tw:min-w-0 tw:max-[767px]:h-[260px]">
        <img
          alt={imageAlt}
          className="tw:h-full tw:w-full tw:object-cover"
          loading="lazy"
          src={image}
        />
      </div>
      <div className="tw:flex tw:h-full tw:w-full tw:min-w-0 tw:flex-col tw:justify-center tw:gap-[0.7rem] tw:px-4 tw:pt-4 tw:pb-6">
        <h3 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-current tw:max-[767px]:text-[1.375rem]">
          {heading}
        </h3>
        {descriptions.map((description, index) => (
          <p className="tw:m-0 tw:text-[15px] tw:leading-[1.6]" key={index}>
            {description}
          </p>
        ))}
      </div>
    </article>
  );
}

export default function SolutionsSection({ data }) {
  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[479px]:px-5 tw:max-[479px]:py-8">
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
        <div
          className="tw:flex tw:flex-wrap tw:justify-between tw:gap-8"
          role="list"
        >
          <SolutionCard
            descriptions={[data.description2]}
            heading={data.heading2}
            image={data.image}
            imageAlt={data.imageAlt}
          />
          {data.items.map((item, index) => (
            <SolutionCard
              dark
              descriptions={[item.description]}
              heading={item.heading}
              image={item.image}
              imageAlt={item.imageAlt}
              key={index}
            />
          ))}
          <SolutionCard
            descriptions={data.items2.map((item) => item.description)}
            heading={data.heading3}
            image={data.image2}
            imageAlt={data.imageAlt2}
          />
          <SolutionCard
            descriptions={[data.description3]}
            heading={data.heading4}
            image={data.image3}
            imageAlt={data.imageAlt3}
          />
          <SolutionCard
            dark
            descriptions={data.items3.map((item) => item.description)}
            heading={data.heading5}
            image={data.image4}
            imageAlt={data.imageAlt4}
          />
        </div>
      </div>
    </section>
  );
}
