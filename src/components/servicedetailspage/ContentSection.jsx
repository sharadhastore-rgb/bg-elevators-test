export default function ContentSection({ data }) {
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
          className="tw:mb-6 tw:h-[32.4375rem] tw:w-full tw:object-cover tw:max-[991px]:h-[30rem] tw:max-[767px]:h-[25rem] tw:max-[479px]:h-[22.5rem]"
          loading="lazy"
          sizes="100vw"
          src={data.image}
        />
        <div className="tw:mb-10 tw:rounded-xl tw:bg-[#eef5ef] tw:px-8 tw:py-6 tw:max-[479px]:px-4">
          <h2 className="tw:mt-0 tw:mb-6 tw:text-[2rem] tw:leading-[1.2] tw:font-semibold tw:text-[#2e2e2e]">
            {data.heading3}
          </h2>
          {data.items.map((item, index) => (
            <p
              className="tw:mt-0 tw:mb-4 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]"
              key={index}
            >
              {item.description}
            </p>
          ))}
          <ul
            className="tw:mb-4 tw:flex tw:list-none tw:flex-col tw:gap-5 tw:p-0"
            role="list"
          >
            {data.items2.map((item, index) => (
              <li
                className="tw:w-max tw:max-w-full tw:border-b tw:border-[#2e2e2e] tw:bg-[url('/images/6741459c3282084269f1000d_check-circle-broken.webp')] tw:bg-[length:24px_24px] tw:bg-left-top tw:bg-no-repeat tw:pb-5 tw:pl-9"
                key={index}
              >
                {item.text}
              </li>
            ))}
          </ul>
          <p className="tw:mt-0 tw:mb-4 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
            {data.description}
          </p>
        </div>
        <div className="tw:grid tw:grid-cols-1 tw:items-center tw:gap-6 tw:min-[1280px]:grid-cols-[1fr_0.75fr]">
          <div className="tw:mb-0 tw:rounded-xl tw:bg-[#eef5ef] tw:px-[1.875rem] tw:py-6 tw:max-[991px]:px-5 tw:max-[479px]:px-4">
            <h2 className="tw:mt-0 tw:mb-6 tw:text-[2rem] tw:leading-[1.2] tw:font-semibold tw:text-[#2e2e2e]">
              {data.heading4}
            </h2>
            <p className="tw:mt-0 tw:mb-4 tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e]">
              {data.description2}
            </p>
            <ul
              className="tw:mb-4 tw:flex tw:list-none tw:flex-col tw:gap-5 tw:p-0"
              role="list"
            >
              {data.items3.map((item, index) => (
                <li
                  className="tw:w-max tw:max-w-full tw:border-b tw:border-[#2e2e2e] tw:bg-[url('/images/6741459c3282084269f1000d_check-circle-broken.webp')] tw:bg-[length:24px_24px] tw:bg-left-top tw:bg-no-repeat tw:pb-5 tw:pl-9"
                  key={index}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <img
              alt={data.imageAlt2}
              className="tw:h-[42.875rem] tw:w-full tw:object-cover tw:max-[991px]:h-[34rem] tw:max-[767px]:h-[30rem] tw:max-[479px]:h-[25rem]"
              loading="lazy"
              sizes="100vw"
              src={data.image2}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
