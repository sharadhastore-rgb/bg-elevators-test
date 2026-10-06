import { Icon } from "@/components/ui";

export default function FaqSection({ data }) {
  return (
    <section className="section home-faq-section tw:px-[5%] tw:py-12">
      <div className="container home-faq-layout tw:mx-auto tw:grid tw:w-full tw:max-w-[82.5rem] tw:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] tw:items-start tw:gap-16 tw:max-[991px]:grid-cols-1 tw:max-[991px]:gap-10">
        <div className="home-faq-heading tw:sticky tw:top-8 tw:max-[991px]:static">
          <div className="badge">{data.badge}</div>
          <h2 className="h3 tw:mt-4">
            {data.heading}{" "}
            <span className="secondary-700 tw:text-brand">{data.accent}</span>
          </h2>
          <p className="text-base text-color-900 tw:mt-4">{data.description}</p>
        </div>
        <div className="home-faq-list tw:border-t tw:border-border">
          {data.items.map((item, index) => (
            <details
              className="home-faq-item tw:group tw:border-b tw:border-border"
              key={item.question}
              name="page-faq"
              open={index === 0}
            >
              <summary className="tw:flex tw:cursor-pointer tw:list-none tw:items-center tw:justify-between tw:gap-5 tw:py-[1.4rem] tw:text-lg tw:font-semibold tw:text-ink tw:[&::-webkit-details-marker]:hidden tw:max-[767px]:text-base">
                <span>{item.question}</span>
                <Icon
                  name="ChevronDown"
                  className="home-faq-icon tw:size-5 tw:shrink-0 tw:transition-transform tw:duration-[250ms] tw:group-open:rotate-180"
                />
              </summary>
              <p className="text-base text-color-900 tw:max-w-[46rem] tw:pr-12 tw:pb-6">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
