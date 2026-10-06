import { Icon, EnquiryForm } from "@/components/ui";

export default function ContentSection({ data }) {
  const jobInformation = [
    {
      icon: <img alt={data.imageAlt2} src={data.image2} width="23" />,
      label: data.description2,
      value: data.text,
    },
    {
      icon: <img alt={data.imageAlt3} src={data.image3} width="24" />,
      label: data.description3,
      value: data.text2,
    },
    {
      icon: (
        <Icon
          name="BriefcaseBusiness"
          className="tw:h-6 tw:w-6 tw:text-brand-bright"
        />
      ),
      label: data.description4,
      value: data.text3,
    },
    {
      icon: <img alt={data.imageAlt4} src={data.image4} width="24" />,
      label: data.description5,
      value: data.text4,
    },
  ];

  const detailGroups = [
    { heading: data.heading3, items: data.items },
    { heading: data.heading4, items: data.items2 },
    { heading: data.heading5, items: data.items3 },
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
          className="tw:mb-6 tw:h-[30rem] tw:w-full tw:rounded-sm tw:object-cover tw:max-[479px]:h-[25rem]"
          loading="lazy"
          sizes="100vw"
          src={data.image}
        />
        <div className="tw:flex tw:items-start tw:justify-between tw:gap-8 tw:max-[991px]:flex-col">
          <div className="tw:w-full tw:max-w-[31.25rem] tw:min-[1280px]:max-w-[42.75rem] tw:min-[1280px]:px-[1.875rem] tw:min-[1280px]:pt-6 tw:max-[991px]:max-w-none">
            <div className="tw:mb-8 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
              <p className="tw:m-0">{data.description}</p>
            </div>
            <div className="tw:mb-8">
              {jobInformation.map((item, index) => (
                <div
                  className={`tw:flex tw:items-center tw:justify-between tw:gap-4 ${
                    index === jobInformation.length - 1
                      ? ""
                      : "tw:mb-5 tw:border-b tw:border-[#2e2e2e33] tw:pb-5"
                  }`}
                  key={item.label}
                >
                  <div className="tw:flex tw:items-center tw:gap-2.5">
                    <span className="tw:flex tw:shrink-0">{item.icon}</span>
                    <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:font-medium tw:text-[#181818]">
                      {item.label}
                    </p>
                  </div>
                  <div className="tw:text-base tw:leading-[1.6] tw:font-semibold tw:text-[#2e2e2e]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="tw:flex tw:flex-col tw:gap-6">
              {detailGroups.map((group) => (
                <section key={group.heading}>
                  <h2 className="tw:mt-0 tw:mb-6 tw:w-max tw:max-w-full tw:bg-[url('/images/6742acf07eb2ae96a2ca3aa8_vector-line.webp')] tw:bg-right tw:bg-[length:119px] tw:bg-no-repeat tw:pr-[8.5rem] tw:text-[2rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:max-[991px]:bg-none tw:max-[991px]:pr-0 tw:max-[767px]:text-[1.375rem]">
                    {group.heading}
                  </h2>
                  <ul
                    className="tw:m-0 tw:flex tw:list-none tw:flex-col tw:gap-5 tw:p-0"
                    role="list"
                  >
                    {group.items.map((item, index) => (
                      <li
                        className="tw:w-max tw:max-w-full tw:border-b tw:border-[#2e2e2e66] tw:bg-[url('/images/6741459c3282084269f1000d_check-circle-broken.webp')] tw:bg-[length:24px_24px] tw:bg-left-top tw:bg-no-repeat tw:pb-5 tw:pl-9 tw:text-base tw:leading-[1.4] tw:font-medium tw:text-[#2e2e2e]"
                        key={index}
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
          <div className="tw:mb-0 tw:w-full tw:flex-1 tw:rounded-lg tw:border tw:border-[#72727242] tw:bg-white tw:px-5 tw:py-8 tw:min-[1280px]:px-8 tw:max-[479px]:px-4 tw:max-[479px]:py-6">
            <EnquiryForm data={data.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
