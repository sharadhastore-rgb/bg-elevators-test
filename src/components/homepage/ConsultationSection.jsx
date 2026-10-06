import { AppLink, Icon } from "@/components/ui";

export default function ConsultationSection({ data }) {
  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:flex tw:items-center tw:justify-between tw:overflow-hidden tw:rounded-2xl tw:bg-primary-soft tw:pl-10 tw:pr-2 tw:max-[767px]:flex-col tw:max-[767px]:px-6">
          <div className="tw:w-full tw:max-w-[34.0625rem] tw:py-10 tw:max-[767px]:pb-0">
            <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[2rem]">
              {data.heading}
              <span className="tw:text-brand">{data.text}</span>
            </h2>
            <div className="tw:mt-5 tw:mb-8 tw:w-[85%] tw:max-[767px]:w-full">
              <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
                {data.description}
              </p>
            </div>
            <AppLink
              className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:bg-brand-dark tw:px-6 tw:py-3 tw:text-base tw:leading-[1.4] tw:font-medium tw:text-white"
              href={data.link}
            >
              <div>{data.text2}</div>
              <div className="tw:relative tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                <Icon
                  name="ArrowUpRight"
                  className="tw:relative tw:z-[1] tw:size-6"
                />
                <Icon name="ArrowUpRight" className="tw:absolute tw:size-6" />
              </div>
            </AppLink>
          </div>
          <div className="tw:mt-[-3rem] tw:w-full tw:max-[767px]:mt-0">
            <div className="tw:relative tw:pt-[75.8495%]">
              <img
                alt={data.imageAlt}
                className="tw:absolute tw:inset-0 tw:mx-auto tw:w-4/5 tw:object-contain"
                loading="lazy"
                sizes="(max-width: 567px) 70vw, 397px"
                src={data.image}
                width="397"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
