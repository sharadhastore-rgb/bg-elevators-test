import { Icon, ContactTrigger } from "@/components/ui";

export default function VacanciesSection({ data }) {
  return (
    <section className="tw:bg-primary-soft tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
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
          <div className="tw:flex tw:flex-col tw:gap-6" role="list">
            {data.items.map((item, index) => (
              <div role="listitem" key={index}>
                <article className="tw:grid tw:grid-cols-[1.25fr_1fr_0.75fr] tw:items-center tw:gap-4 tw:rounded-xl tw:border tw:border-[#cfe5d2] tw:bg-white tw:px-5 tw:py-8 tw:min-[1280px]:px-10 tw:max-[991px]:grid-cols-[1fr_1fr_0.75fr] tw:max-[991px]:gap-2 tw:max-[767px]:grid-cols-1 tw:max-[767px]:gap-6 tw:max-[767px]:text-center tw:max-[479px]:px-4 tw:max-[479px]:py-6">
                  <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:max-[767px]:text-[1.375rem]">
                    {item.heading}
                  </h2>
                  <div className="tw:flex tw:items-center tw:justify-center tw:gap-4 tw:max-[991px]:flex-col tw:max-[991px]:items-start tw:max-[767px]:block tw:max-[767px]:justify-self-center">
                    <p className="tw:m-0 tw:text-lg tw:leading-[1.2] tw:font-semibold tw:text-[#707070]">
                      {item.heading2}
                    </p>
                  </div>
                  <div className="tw:justify-self-end tw:max-[767px]:justify-self-center">
                    <ContactTrigger className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:bg-brand tw:px-6 tw:py-3 tw:text-base tw:leading-[1.4] tw:font-medium tw:text-white tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-brand">
                      <div>{item.text}</div>
                      <div className="tw:flex tw:h-6 tw:w-6 tw:items-center tw:justify-center tw:overflow-hidden">
                        <Icon name="ArrowUpRight" className="tw:h-6 tw:w-6" />
                      </div>
                    </ContactTrigger>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
