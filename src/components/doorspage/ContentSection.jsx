import { AppLink, Icon } from "@/components/ui";

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
            <p className="tw:mt-0 tw:mb-6 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
              {data.description}
            </p>
            <h3 className="tw:mt-2.5 tw:mb-4 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-brand-dark">
              {data.heading4}
            </h3>
            <p className="tw:mt-0 tw:mb-6 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
              {data.description2}
              <strong>{data.text}</strong>
            </p>
            <div className="tw:mb-6 tw:grid tw:grid-cols-3 tw:gap-4 tw:max-[767px]:grid-cols-2 tw:max-[479px]:grid-cols-1">
              {data.items.map((item, index) => (
                <article
                  className="tw:overflow-hidden tw:rounded-xl tw:bg-white tw:p-2.5 tw:text-center tw:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                  key={index}
                >
                  <div className="tw:h-[250px] tw:w-full tw:overflow-hidden">
                    <img
                      alt={item.imageAlt}
                      className="tw:h-full tw:w-full tw:object-cover"
                      loading="lazy"
                      src={item.image}
                    />
                  </div>
                  <h3 className="tw:m-0 tw:p-[0.6rem] tw:text-base tw:font-semibold tw:text-black">
                    {item.heading}
                  </h3>
                </article>
              ))}
            </div>
            <h3 className="tw:mt-2.5 tw:mb-4 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-brand-dark">
              {data.heading5}
            </h3>
            <p className="tw:mt-0 tw:mb-6 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
              {data.description3}
              <strong>{data.text2}</strong>
            </p>
            <div className="tw:grid tw:grid-cols-3 tw:gap-4 tw:max-[767px]:grid-cols-2 tw:max-[479px]:grid-cols-1">
              {data.items2.map((item, index) => (
                <article
                  className="tw:overflow-hidden tw:rounded-xl tw:bg-white tw:p-2.5 tw:text-center tw:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                  key={index}
                >
                  <div className="tw:h-[250px] tw:w-full tw:overflow-hidden">
                    <img
                      alt={item.imageAlt}
                      className="tw:h-full tw:w-full tw:object-cover"
                      loading="lazy"
                      src={item.image}
                    />
                  </div>
                  <h3 className="tw:m-0 tw:p-[0.6rem] tw:text-base tw:font-semibold tw:text-black">
                    {item.heading}
                  </h3>
                </article>
              ))}
            </div>
          </div>
          <div className="tw:w-full tw:rounded-xl tw:border tw:border-border tw:bg-surface tw:p-10 tw:min-[1280px]:basis-[28.9375rem] tw:max-[479px]:px-4 tw:max-[479px]:py-8">
            <h2 className="tw:mt-0 tw:mb-6 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
              {data.heading6}
            </h2>
            <div className="project-info-items">
              <div className="project-info-item">
                <AppLink href={data.link}>
                  <div className="text-base medium text-color-900">
                    {data.text3}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text4}</span>
              <div className="project-info-item">
                <AppLink href={data.link2}>
                  <div className="text-base medium text-color-900">
                    {data.text5}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text6}</span>
              <div className="project-info-item">
                <AppLink href={data.link3}>
                  <div className="text-base medium text-color-900">
                    {data.text7}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text8}</span>
              <div className="project-info-item">
                <AppLink href={data.link4}>
                  <div className="text-base medium text-color-900">
                    {data.text9}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text10}</span>
              <div className="project-info-item">
                <AppLink href={data.link5}>
                  <div className="text-base medium text-color-900">
                    {data.text11}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text12}</span>
              <div className="project-info-item">
                <AppLink href={data.link6}>
                  <div className="text-base medium text-color-900">
                    {data.text13}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text14}</span>
              <div className="project-info-item">
                <AppLink href={data.link7}>
                  <div className="text-base medium text-color-900">
                    {data.text15}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text16}</span>
              <div className="project-info-item">
                <AppLink href={data.link8}>
                  <div className="text-base medium text-color-900">
                    {data.text17}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text18}</span>
              <div className="project-info-item">
                <AppLink href={data.link9}>
                  <div className="text-base medium text-color-900">
                    {data.text19}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text20}</span>
              <div className="project-info-item">
                <AppLink href={data.link10}>
                  <div className="text-base medium text-color-900">
                    {data.text21}
                  </div>
                </AppLink>
              </div>
            </div>
            <h2 className="tw:mt-0 tw:mb-6 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
              {data.heading7}
            </h2>
            <div className="project-info-items">
              <div className="project-info-item">
                <AppLink href={data.link11}>
                  <div className="text-base medium text-color-900">
                    {data.text22}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text23}</span>
              <div className="project-info-item">
                <AppLink href={data.link12}>
                  <div className="text-base medium text-color-900">
                    {data.text24}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text25}</span>
              <div className="project-info-item">
                <AppLink href={data.link13}>
                  <div className="text-base medium text-color-900">
                    {data.text26}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text27}</span>
              <div className="project-info-item">
                <AppLink href={data.link14}>
                  <div className="text-base medium text-color-900">
                    {data.text28}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text29}</span>
              <div className="project-info-item">
                <AppLink href={data.link15}>
                  <div className="text-base medium text-color-900">
                    {data.text30}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text31}</span>
              <div className="project-info-item">
                <AppLink href={data.link16}>
                  <div className="text-base medium text-color-900">
                    {data.text32}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text33}</span>
              <div className="project-info-item">
                <AppLink href={data.link17}>
                  <div className="text-base medium text-color-900">
                    {data.text34}
                  </div>
                </AppLink>
              </div>
            </div>
            <div className="project-information-bottom">
              <h2 className="tw:mt-0 tw:mb-0 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                {data.heading8}
              </h2>
              <div className="project-contact-info-items">
                {data.items3.map((item, index) => (
                  <div
                    className="tw:flex tw:items-center tw:gap-2.5"
                    key={index}
                  >
                    <img
                      alt={item.imageAlt}
                      className="tw:w-5 tw:shrink-0"
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
              <div>{data.text35}</div>
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
