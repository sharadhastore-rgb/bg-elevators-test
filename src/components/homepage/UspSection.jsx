import { AppLink, Icon } from "@/components/ui";

export default function UspSection({ data }) {
  return (
    <section className="tw:bg-primary-soft tw:px-[5%] tw:py-12 tw:max-[479px]:px-5 tw:max-[479px]:py-8">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:flex tw:flex-col tw:gap-12 tw:xl:flex-row tw:xl:items-start tw:max-[479px]:gap-10">
          <div className="tw:w-full tw:max-w-[30.1875rem] tw:xl:sticky tw:xl:top-8 tw:xl:self-start">
            <div className="tw:flex tw:w-max tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-soft tw:px-5 tw:py-2.5 tw:text-sm tw:leading-[1.3] tw:font-medium tw:text-[#17331c]">
              {data.text}
            </div>
            <div className="tw:h-4 tw:w-full" />
            <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[1.75rem] tw:min-[992px]:text-[2rem] tw:xl:text-[2.75rem] tw:xl:leading-[1.3]">
              <span className="tw:text-brand">{data.text2}</span>
              {data.heading}
            </h2>
            <div className="tw:h-10 tw:w-full" />
            <AppLink
              className="tw:flex tw:w-max tw:flex-wrap tw:items-center tw:justify-center tw:gap-2 tw:overflow-hidden tw:py-2 tw:text-[#181818] tw:no-underline"
              href={data.link}
            >
              <span className="tw:text-base tw:font-medium">{data.text3}</span>
              <Icon name="ArrowRight" className="tw:size-6" />
            </AppLink>
          </div>
          <div className="tw:grid tw:w-full tw:grid-cols-2 tw:gap-x-5 tw:gap-y-6 tw:scroll-smooth tw:max-[767px]:grid-cols-1 tw:max-[767px]:gap-y-5">
            {data.items.map((item, index) => (
              <article
                className="tw:flex tw:flex-col tw:gap-6 tw:rounded-xl tw:border tw:border-border tw:bg-white tw:px-8 tw:py-6 tw:max-[479px]:px-5"
                key={index}
              >
                <img
                  alt={item.imageAlt}
                  className="tw:h-auto tw:w-[3.25rem]"
                  height="52"
                  loading="lazy"
                  src={item.image}
                  width="52"
                />
                <div className="tw:flex tw:flex-col tw:gap-4">
                  <h3 className="tw:m-0 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                    {item.heading}
                  </h3>
                  <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
                    {item.description}
                  </p>
                </div>
                <AppLink
                  className="tw:flex tw:w-max tw:flex-wrap tw:items-center tw:justify-center tw:gap-2 tw:overflow-hidden tw:py-2 tw:text-[#181818] tw:no-underline"
                  href={item.link}
                >
                  <span className="tw:text-base tw:font-medium">
                    {item.text}
                  </span>
                  <Icon name="ArrowRight" className="tw:size-6" />
                </AppLink>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
