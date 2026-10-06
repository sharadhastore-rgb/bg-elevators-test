import { AppLink, Icon } from "@/components/ui";

export default function ConsultationSection({ data }) {
  return (
    <section className="section tw:px-[5%] tw:py-12">
      <div className="container tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="cta-main-wrap tw:relative tw:flex tw:items-center tw:justify-between tw:gap-0 tw:overflow-hidden tw:rounded-2xl tw:bg-primary-soft tw:pr-2 tw:pl-10 tw:max-[991px]:px-10 tw:max-[991px]:py-[3.125rem] tw:max-[479px]:px-5">
          <div className="cta-left tw:w-full tw:max-w-[34.0625rem] tw:py-10 tw:max-[991px]:max-w-[23.125rem] tw:max-[991px]:py-8 tw:max-[767px]:py-0">
            <h2 className="h2">
              {data.heading}
              <span className="secondary-700 tw:text-brand">{data.text}</span>
            </h2>
            <div className="cta-des-wrap tw:mt-5 tw:mb-8 tw:w-[85%] tw:max-[991px]:w-auto">
              <p className="text-base text-color-900">{data.description}</p>
            </div>
            <AppLink
              className="btn-primary w-inline-block tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:bg-brand-dark tw:px-6 tw:py-3 tw:text-base tw:leading-[1.4] tw:font-medium tw:text-white tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-brand"
              href={data.link}
            >
              <div>{data.text2}</div>
              <div className="btn-icon-box tw:relative tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                <Icon
                  name="ArrowUpRight"
                  className="up-arrow-icon tw:relative tw:z-[1] tw:flex tw:size-6 tw:items-center tw:justify-center"
                />
                <Icon
                  name="ArrowUpRight"
                  className="up-arrow-icon is-absolute tw:absolute tw:flex tw:size-6 tw:items-center tw:justify-center"
                />
              </div>
            </AppLink>
          </div>
          <div className="cta-right tw:-mt-12 tw:w-full tw:max-[991px]:absolute tw:max-[991px]:right-0 tw:max-[991px]:bottom-0 tw:max-[991px]:mt-0 tw:max-[991px]:max-w-[25.75rem] tw:max-[767px]:hidden">
            <div className="cta-image tw:relative tw:pt-[75.8495%] tw:max-[991px]:pt-[99.5146%]">
              <img
                alt={data.imageAlt}
                className="image tw:absolute tw:inset-0 tw:m-auto tw:h-full tw:w-4/5 tw:object-contain"
                loading="lazy"
                sizes="(max-width: 767px) 100vw, 497px"
                src={data.image}
                width="497"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
