import ServiceImageGallery from "@/components/shared/ServiceImageGallery";

export default function ContentSection({ data }) {
  const sections = [
    [data.heading3, data.description2],
    [data.heading4, data.description3],
    [data.heading5, data.description4],
    [data.heading6, data.description5],
    [data.heading7, data.description6],
  ];

  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mb-10 tw:flex tw:flex-col tw:gap-2">
          <div className="tw:flex tw:items-center tw:gap-2.5">
            <div className="tw:h-px tw:w-[2.625rem] tw:shrink-0 tw:rounded-lg tw:bg-brand" />
            <p className="tw:m-0 tw:text-lg tw:leading-[1.2] tw:font-semibold tw:text-brand">
              {data.heading}
            </p>
          </div>
          <h1 className="tw:m-0 tw:text-2xl tw:leading-[1.3] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[2rem]">
            {data.heading2}
          </h1>
        </div>
        <div className="tw:grid tw:grid-cols-[minmax(0,1fr)_22rem] tw:items-start tw:gap-8 tw:max-[991px]:grid-cols-1">
          <div className="tw:min-w-0 tw:rounded-xl tw:bg-surface-soft tw:px-8 tw:py-6 tw:max-[479px]:px-4">
            <p className="tw:mt-0 tw:mb-6 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
              {data.description}
            </p>
            {sections.map(([heading, description]) => (
              <section key={heading}>
                <h2 className="tw:mt-0 tw:mb-4 tw:text-lg tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                  {heading}
                </h2>
                <p className="tw:mt-0 tw:mb-6 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
                  {description}
                </p>
              </section>
            ))}
          </div>
          <ServiceImageGallery images={data.images} />
        </div>
      </div>
    </section>
  );
}
