export default function BenefitsSection({ data }) {
  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mx-auto tw:mb-10 tw:flex tw:max-w-[54rem] tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:text-center tw:min-[1280px]:max-w-[65rem]">
          <div className="badge">{data.text}</div>
          <h2 className="tw:m-0 tw:text-[2.5rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:max-[479px]:text-[2rem]">
            {data.heading}
            <span className="tw:text-brand">{data.text2}</span>
            {data.heading2}
            <span className="tw:text-brand">{data.text3}</span>
          </h2>
        </div>
        <div className="tw:grid tw:grid-cols-2 tw:gap-6 tw:xl:grid-cols-4 tw:max-[767px]:grid-cols-1">
          {data.items.map((item, index) => (
            <article
              className="tw:flex tw:flex-col tw:gap-3 tw:rounded-xl tw:border tw:border-[#cfe5d2] tw:bg-white tw:px-6 tw:pt-6 tw:pb-[1.875rem] tw:text-center tw:max-[991px]:px-5"
              key={index}
            >
              <div className="tw:flex tw:flex-col tw:items-center tw:gap-6">
                <h3 className="tw:m-0 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                  {item.heading}
                </h3>
              </div>
              <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
