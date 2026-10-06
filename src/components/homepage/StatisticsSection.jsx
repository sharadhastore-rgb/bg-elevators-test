import { StatisticCard } from "@/components/ui";

export default function StatisticsSection({ data }) {
  return (
    <section className="tw:bg-brand-bright tw:px-4 tw:py-3">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-3 tw:xl:gap-[1.625rem]">
          <StatisticCard data={data.statistic} />
          <StatisticCard data={data.statistic2} />
          <StatisticCard data={data.statistic3} />
        </div>
      </div>
    </section>
  );
}
