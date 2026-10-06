import { AppLink, Icon } from "@/components/ui";

export default function ContentSection({ data }) {
  const featureGroups = [
    [
      data.heading4,
      [
        [data.link, data.text],
        [data.text2],
        [data.link2, data.text3],
        [data.text4],
        [data.link3, data.text5],
        [data.text6],
        [data.link4, data.text7],
        [data.text8],
        [data.link5, data.text9],
        [data.text10],
        [data.link6, data.text11],
        [data.text12],
        [data.link7, data.text13],
        [data.text14],
        [data.link8, data.text15],
        [data.text16],
        [data.link9, data.text17],
        [data.text18],
        [data.link10, data.text19],
      ],
    ],
    [
      data.heading5,
      [
        [data.link11, data.text20],
        [data.text21],
        [data.link12, data.text22],
        [data.text23],
        [data.link13, data.text24],
        [data.text25],
        [data.link14, data.text26],
        [data.text27],
        [data.link15, data.text28],
        [data.text29],
        [data.link16, data.text30],
        [data.text31],
        [data.link17, data.text32],
      ],
    ],
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
        <img
          alt={data.imageAlt}
          className="tw:mb-6 tw:h-auto tw:w-full tw:object-contain"
          loading="lazy"
          sizes="100vw"
          src={data.image}
        />
        <div className="tw:mb-10 tw:flex tw:flex-col tw:items-start tw:gap-6 tw:min-[1280px]:flex-row">
          <div className="tw:w-full tw:shrink-0 tw:rounded-xl tw:bg-surface-soft tw:px-8 tw:py-6 tw:min-[1280px]:basis-[52.0625rem] tw:max-[479px]:px-4">
            <h2 className="tw:mt-0 tw:mb-6 tw:text-[2rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
              {data.heading3}
            </h2>
            <p className="tw:mb-4 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
              {data.description}
            </p>
            <div className="tw:mb-5 tw:pl-4">
              {data.items.map((item, index) => (
                <div
                  className="tw:mb-2 tw:pl-4 tw:text-base tw:leading-[1.6] tw:text-[#181818] tw:before:-ml-4 tw:before:inline-block tw:before:w-4 tw:before:font-bold tw:before:text-[#313860] tw:before:content-['•']"
                  key={index}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div className="tw:w-full tw:rounded-xl tw:border tw:border-border tw:bg-surface tw:p-10 tw:min-[1280px]:basis-[28.9375rem] tw:max-[479px]:px-4 tw:max-[479px]:py-8">
            {featureGroups.map(([heading, entries]) => (
              <section key={heading}>
                <h2 className="tw:mt-0 tw:mb-6 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                  {heading}
                </h2>
                <div className="tw:my-6 tw:flex tw:flex-wrap tw:items-center tw:gap-x-[0.6rem] tw:gap-y-4">
                  {entries.map((entry, index) =>
                    entry.length === 1 ? (
                      <span key={`${heading}-${index}`}>{entry[0]}</span>
                    ) : (
                      <AppLink
                        className="tw:w-max tw:border-b tw:border-[#2e2e2e33] tw:pb-[0.2rem] tw:text-base tw:font-medium tw:text-[#181818]"
                        href={entry[0]}
                        key={entry[0]}
                      >
                        {entry[1]}
                      </AppLink>
                    ),
                  )}
                </div>
              </section>
            ))}
            <div className="tw:mb-10 tw:flex tw:flex-col tw:gap-6">
              <h2 className="tw:mt-0 tw:mb-0 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                {data.heading6}
              </h2>
              <div className="tw:flex tw:flex-col tw:gap-5">
                {data.items2.map((item, index) => (
                  <div
                    className="tw:flex tw:items-center tw:gap-2.5"
                    key={index}
                  >
                    <img
                      alt={item.imageAlt}
                      className="tw:w-5"
                      loading="lazy"
                      src={item.image}
                      width="32"
                    />
                    <div className="tw:text-base tw:text-brand">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <AppLink
              className="tw:inline-flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:bg-brand-dark tw:px-6 tw:py-3 tw:text-base tw:leading-[1.4] tw:font-medium tw:text-white"
              href={data.link18}
            >
              <div>{data.text33}</div>
              <div className="tw:relative tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                <Icon
                  name="ArrowUpRight"
                  className="tw:relative tw:z-[1] tw:size-6"
                />
                <Icon name="ArrowUpRight" className="tw:absolute tw:size-6" />
              </div>
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
