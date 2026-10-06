import { AppLink, Icon } from "@/components/ui";

export default function MaintenanceSupportSection({ data }) {
  return (
    <section className="tw:bg-[#fbfcfb] tw:px-[5%] tw:py-10 tw:max-[479px]:px-5 tw:max-[479px]:py-8">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mb-8 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:text-center">
          <div className="tw:flex tw:w-max tw:items-center tw:justify-center tw:rounded-full tw:bg-brand-soft tw:px-5 tw:py-2.5 tw:text-sm tw:leading-[1.3] tw:font-medium tw:text-[#17331c]">
            {data.badge}
          </div>
          <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[1.75rem] tw:min-[992px]:text-[2rem] tw:xl:text-[2.75rem] tw:xl:leading-[1.3]">
            {data.heading} <span className="tw:text-brand">{data.accent}</span>
          </h2>
          <p className="tw:mt-4 tw:mb-0 tw:max-w-[46rem] tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
            {data.description}
          </p>
        </div>
        <div className="tw:grid tw:grid-cols-3 tw:items-start tw:gap-6 tw:max-[991px]:grid-cols-2 tw:max-[767px]:grid-cols-1">
          {data.items.map((item, index) => (
            <AppLink
              className={`tw:block tw:overflow-hidden tw:rounded-[0.875rem] tw:border tw:border-border tw:bg-white tw:text-inherit tw:no-underline tw:transition-[transform,border-color,box-shadow] tw:duration-300 tw:hover:-translate-y-1 tw:hover:border-brand tw:hover:shadow-[0_18px_42px_rgba(1,32,52,0.1)] tw:focus-visible:outline-3 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-brand-bright ${index === 0 || index === 2 ? "tw:min-[992px]:mt-5" : ""}`}
              href={item.link}
              key={item.heading}
            >
              <img
                alt={item.imageAlt}
                className="tw:block tw:h-48 tw:w-full tw:object-cover"
                height="260"
                loading="lazy"
                src={item.image}
                width="420"
              />
              <div className="tw:flex tw:flex-col tw:items-start tw:gap-3 tw:p-5">
                <h3 className="tw:m-0 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                  {item.heading}
                </h3>
                <p className="tw:m-0 tw:flex-1 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
                  {item.description}
                </p>
                <span className="tw:flex tw:w-max tw:items-center tw:gap-2 tw:py-2 tw:text-[#181818]">
                  <span className="tw:text-base tw:font-medium">
                    Learn More
                  </span>
                  <Icon name="ArrowRight" className="tw:size-6" />
                </span>
              </div>
            </AppLink>
          ))}
        </div>
        <div className="tw:mt-6 tw:flex tw:justify-center">
          <AppLink
            className="btn-primary w-inline-block tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:bg-brand tw:px-6 tw:py-3 tw:text-base tw:font-medium tw:text-white"
            href={data.link}
          >
            <span>{data.linkText}</span>
            <span className="btn-icon-box">
              <Icon name="ArrowUpRight" className="up-arrow-icon" />
              <Icon name="ArrowUpRight" className="up-arrow-icon is-absolute" />
            </span>
          </AppLink>
        </div>
      </div>
    </section>
  );
}
