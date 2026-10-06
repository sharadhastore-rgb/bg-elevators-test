import { AppLink, Icon } from "@/components/ui";

export default function ContentSection({ data }) {
  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[479px]:px-5 tw:max-[479px]:py-8">
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
        <div>
          <div
            className="tw:grid tw:grid-cols-4 tw:items-start tw:gap-x-6 tw:gap-y-10 tw:max-[991px]:grid-cols-2 tw:max-[767px]:grid-cols-1 tw:max-[767px]:justify-items-center"
            role="list"
          >
            {data.items.map((item, index) => (
              <div
                className="tw:flex tw:w-full tw:max-[767px]:justify-center"
                role="listitem"
                key={index}
              >
                <AppLink
                  className="tw:flex tw:w-full tw:max-w-[40.5rem] tw:flex-col tw:gap-5 tw:border-b tw:border-[#8a8a8a] tw:pb-4 tw:text-inherit tw:no-underline"
                  href={item.link}
                >
                  <div className="tw:relative tw:overflow-hidden tw:pt-[104.348%] tw:min-[1280px]:pt-[126.0309%]">
                    <img
                      alt={item.imageAlt}
                      className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-500 tw:hover:scale-[1.03]"
                      loading="lazy"
                      src={item.image}
                    />
                  </div>
                  <div className="tw:flex tw:items-end tw:justify-between tw:gap-4">
                    <div className="tw:flex tw:flex-col tw:gap-2">
                      <div className="tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-[#17331c]">
                        {item.heading}
                      </div>
                    </div>
                    <div className="tw:h-6 tw:w-6 tw:shrink-0">
                      <Icon name="CircleArrowOutUpRight" className="" />
                    </div>
                  </div>
                  <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
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
