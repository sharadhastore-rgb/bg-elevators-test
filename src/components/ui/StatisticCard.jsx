export default function StatisticCard({ data }) {
  return (
    <article className="tw:px-2.5 tw:pt-2.5 tw:pb-5">
      <div className="tw:mb-5 tw:flex tw:flex-col tw:gap-4 tw:border-b tw:border-[#efffe5] tw:pb-5">
        <div className="tw:flex tw:min-h-[3.875rem] tw:items-start">
          <div className="tw:text-[3.25rem] tw:leading-[1.2] tw:font-semibold tw:text-white tw:max-sm:text-[3rem]">
            {data.value}
          </div>
        </div>
        <h3 className="tw:m-0 tw:text-lg tw:leading-[1.2] tw:font-semibold tw:text-[#efffe5]">
          {data.label}
        </h3>
      </div>
      <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:font-normal tw:text-primary-soft">
        {data.description}
      </p>
    </article>
  );
}
