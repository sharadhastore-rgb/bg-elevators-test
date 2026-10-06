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
            <div>
              <h2 className="tw:mt-2.5 tw:mb-4 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-brand-dark">
                {data.heading3}
              </h2>
              <p className="tw:mt-0 tw:mb-6 tw:text-base tw:leading-[1.6] tw:text-[#181818]">
                {data.description}
              </p>
            </div>
            <div className="tw:mb-5 tw:pl-4">
              {data.items.map((item, index) => (
                <div
                  className="tw:mb-2 tw:pl-4 tw:text-base tw:leading-[1.6] tw:text-[#181818] tw:before:-ml-4 tw:before:inline-block tw:before:w-4 tw:before:font-bold tw:before:text-[#313860] tw:before:content-['•']"
                  key={index}
                >
                  <strong>{item.text}</strong>
                  {item.text2}
                </div>
              ))}
              <div className="tw:mb-2 tw:pl-4 tw:text-base tw:leading-[1.6] tw:text-[#181818] tw:before:-ml-4 tw:before:inline-block tw:before:w-4 tw:before:font-bold tw:before:text-[#313860] tw:before:content-['•']">
                <strong>{data.text}</strong>
                <p className="tw:mt-0 tw:mb-0">{data.description2}</p>
              </div>
              {data.items2.map((item, index) => (
                <div
                  className="tw:mb-2 tw:pl-4 tw:text-base tw:leading-[1.6] tw:text-[#181818] tw:before:-ml-4 tw:before:inline-block tw:before:w-4 tw:before:font-bold tw:before:text-[#313860] tw:before:content-['•']"
                  key={index}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div className="tw:w-full tw:rounded-xl tw:border tw:border-border tw:bg-surface tw:p-10 tw:min-[1280px]:basis-[28.9375rem] tw:max-[479px]:px-4 tw:max-[479px]:py-8">
            <h2 className="tw:mt-0 tw:mb-6 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
              {data.heading4}
            </h2>
            <div className="project-info-items">
              <div className="project-info-item">
                <AppLink href={data.link}>
                  <div className="text-base medium text-color-900">
                    {data.text2}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text3}</span>
              <div className="project-info-item">
                <AppLink href={data.link2}>
                  <div className="text-base medium text-color-900">
                    {data.text4}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text5}</span>
              <div className="project-info-item">
                <AppLink href={data.link3}>
                  <div className="text-base medium text-color-900">
                    {data.text6}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text7}</span>
              <div className="project-info-item">
                <AppLink href={data.link4}>
                  <div className="text-base medium text-color-900">
                    {data.text8}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text9}</span>
              <div className="project-info-item">
                <AppLink href={data.link5}>
                  <div className="text-base medium text-color-900">
                    {data.text10}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text11}</span>
              <div className="project-info-item">
                <AppLink href={data.link6}>
                  <div className="text-base medium text-color-900">
                    {data.text12}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text13}</span>
              <div className="project-info-item">
                <AppLink href={data.link7}>
                  <div className="text-base medium text-color-900">
                    {data.text14}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text15}</span>
              <div className="project-info-item">
                <AppLink href={data.link8}>
                  <div className="text-base medium text-color-900">
                    {data.text16}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text17}</span>
              <div className="project-info-item">
                <AppLink href={data.link9}>
                  <div className="text-base medium text-color-900">
                    {data.text18}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text19}</span>
              <div className="project-info-item">
                <AppLink href={data.link10}>
                  <div className="text-base medium text-color-900">
                    {data.text20}
                  </div>
                </AppLink>
              </div>
            </div>
            <h2 className="tw:mt-0 tw:mb-6 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
              {data.heading5}
            </h2>
            <div className="project-info-items">
              <div className="project-info-item">
                <AppLink href={data.link11}>
                  <div className="text-base medium text-color-900">
                    {data.text21}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text22}</span>
              <div className="project-info-item">
                <AppLink href={data.link12}>
                  <div className="text-base medium text-color-900">
                    {data.text23}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text24}</span>
              <div className="project-info-item">
                <AppLink href={data.link13}>
                  <div className="text-base medium text-color-900">
                    {data.text25}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text26}</span>
              <div className="project-info-item">
                <AppLink href={data.link14}>
                  <div className="text-base medium text-color-900">
                    {data.text27}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text28}</span>
              <div className="project-info-item">
                <AppLink href={data.link15}>
                  <div className="text-base medium text-color-900">
                    {data.text29}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text30}</span>
              <div className="project-info-item">
                <AppLink href={data.link16}>
                  <div className="text-base medium text-color-900">
                    {data.text31}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text32}</span>
              <div className="project-info-item">
                <AppLink href={data.link17}>
                  <div className="text-base medium text-color-900">
                    {data.text33}
                  </div>
                </AppLink>
              </div>
            </div>
            <div className="project-information-bottom">
              <h2 className="tw:mt-0 tw:mb-0 tw:text-[1.375rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818]">
                {data.heading6}
              </h2>
              <div className="project-contact-info-items">
                {data.items3.map((item, index) => (
                  <div
                    className="tw:flex tw:items-center tw:gap-2.5"
                    key={index}
                  >
                    <img
                      alt={item.imageAlt}
                      className="tw:w-5"
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
              <div>{data.text34}</div>
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
