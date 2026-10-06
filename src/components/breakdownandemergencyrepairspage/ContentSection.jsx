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
        <div className="tw:max-w-[52.0625rem] tw:rounded-xl tw:bg-surface-soft tw:px-8 tw:py-6 tw:max-[479px]:px-4">
          <p className="tw:mt-0 tw:mb-4 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
            {data.description}
          </p>
          <ul className="tw:m-0 tw:flex tw:list-none tw:flex-col tw:gap-5 tw:p-0">
            {data.items.map((item, index) => (
              <li
                className="tw:w-max tw:max-w-full tw:border-b tw:border-[#181818] tw:bg-[url('/images/6741459c3282084269f1000d_check-circle-broken.webp')] tw:bg-[length:24px_24px] tw:bg-left-top tw:bg-no-repeat tw:pb-5 tw:pl-9 tw:text-base tw:leading-[1.6] tw:text-[#181818]"
                key={index}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
