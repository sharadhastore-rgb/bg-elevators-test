import { AppLink, Icon } from "@/components/ui";

export default function ServicesSection({ data }) {
  return (
    <section className="tw:bg-[#fbfcfb] tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <header className="tw:mb-10 tw:flex tw:flex-col tw:gap-2">
          <div className="tw:flex tw:items-center tw:gap-2.5">
            <span className="tw:h-px tw:w-[2.625rem] tw:shrink-0 tw:rounded-lg tw:bg-brand" />
            <p className="tw:m-0 tw:text-lg tw:leading-[1.2] tw:font-semibold tw:text-brand">
              {data.heading}
            </p>
          </div>
          <h1 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[1.75rem] tw:min-[992px]:text-[2rem] tw:xl:text-[2.75rem] tw:xl:leading-[1.3]">
            {data.heading2}
          </h1>
        </header>
        <div>
          <div
            className="tw:grid tw:grid-cols-3 tw:gap-6 tw:max-[991px]:grid-cols-2 tw:max-[767px]:grid-cols-1 tw:max-[767px]:justify-items-center"
            role="list"
          >
            {data.items.map((item, index) => (
              <div className="tw:w-full" role="listitem" key={index}>
                <AppLink
                  className="tw:group tw:flex tw:w-full tw:max-w-[26.5rem] tw:flex-col tw:gap-5 tw:border-b tw:border-[#adadad] tw:pb-4 tw:text-inherit tw:no-underline tw:max-[767px]:max-w-none"
                  href={item.link}
                >
                  <div className="tw:relative tw:overflow-hidden tw:pt-[104.348%]">
                    <img
                      alt={item.imageAlt}
                      className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-[1.025]"
                      loading="lazy"
                      sizes="100vw"
                      src={item.image}
                    />
                  </div>
                  <div className="tw:flex tw:items-end tw:justify-between tw:gap-4">
                    <h2 className="tw:m-0 tw:text-lg tw:leading-[1.2] tw:font-semibold tw:text-[#17331c]">
                      {item.heading}
                    </h2>
                    <span className="tw:grid tw:size-6 tw:shrink-0 tw:place-items-center tw:text-[#181818]">
                      <Icon
                        name="CircleArrowOutUpRight"
                        className="tw:size-6"
                      />
                    </span>
                  </div>
                  <p className="tw:m-0 tw:text-sm tw:leading-[1.6] tw:text-[#2e2e2e]">
                    {item.description}
                  </p>
                </AppLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
