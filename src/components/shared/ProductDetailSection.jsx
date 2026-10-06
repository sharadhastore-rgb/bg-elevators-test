import { AppLink, Icon } from "@/components/ui";

export default function ProductDetailSection({ data }) {
  return (
    <section className="section tw:px-[5%] tw:py-12">
      <div className="container tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="two-row-title-wrap tw:mb-10 tw:flex tw:flex-col tw:gap-2">
          <div className="two-row-sub-title-wrap tw:flex tw:items-center tw:gap-2.5">
            <div className="sub-title-line tw:h-px tw:w-10.5 tw:shrink-0 tw:rounded-lg tw:bg-brand" />
            <p className="h6 secondary-700 tw:text-brand">{data.heading}</p>
          </div>
          <h1 className="h3">{data.heading2}</h1>
        </div>
        <img
          alt={data.imageAlt}
          className="inner-cover tw:relative tw:h-[32.4375rem] tw:w-full tw:object-cover tw:max-[991px]:h-[30rem] tw:max-[767px]:h-[25rem] tw:max-[479px]:h-[22.5rem]"
          loading="lazy"
          sizes="100vw"
          src={data.image}
        />
        <div className="project-grid tw:mb-10 tw:flex tw:flex-col tw:items-start tw:gap-6 tw:min-[1280px]:flex-row">
          <div className="project-overview w-richtext tw:shrink-0 tw:rounded-xl tw:bg-surface-soft tw:px-8 tw:py-6 tw:max-[479px]:px-4">
            <h2>{data.heading3}</h2>
            {data.items.map((item, index) => (
              <p key={index}>{item.description}</p>
            ))}
          </div>
          <div className="project-information-wrap tw:w-full tw:rounded-xl tw:border tw:border-border tw:bg-surface tw:p-10 tw:min-[1280px]:basis-[28.9375rem] tw:max-[479px]:px-4 tw:max-[479px]:py-8">
            <h2 className="h4">{data.heading4}</h2>
            <div className="project-info-items tw:my-6 tw:flex tw:flex-wrap tw:items-center tw:gap-x-[0.6rem] tw:gap-y-4">
              <div className="project-info-item">
                <AppLink href={data.link}>
                  <div className="text-base medium text-color-900">
                    {data.text}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text2}</span>
              <div className="project-info-item">
                <AppLink href={data.link2}>
                  <div className="text-base medium text-color-900">
                    {data.text3}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text4}</span>
              <div className="project-info-item">
                <AppLink href={data.link3}>
                  <div className="text-base medium text-color-900">
                    {data.text5}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text6}</span>
              <div className="project-info-item">
                <AppLink href={data.link4}>
                  <div className="text-base medium text-color-900">
                    {data.text7}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text8}</span>
              <div className="project-info-item">
                <AppLink href={data.link5}>
                  <div className="text-base medium text-color-900">
                    {data.text9}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text10}</span>
              <div className="project-info-item">
                <AppLink href={data.link6}>
                  <div className="text-base medium text-color-900">
                    {data.text11}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text12}</span>
              <div className="project-info-item">
                <AppLink href={data.link7}>
                  <div className="text-base medium text-color-900">
                    {data.text13}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text14}</span>
              <div className="project-info-item">
                <AppLink href={data.link8}>
                  <div className="text-base medium text-color-900">
                    {data.text15}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text16}</span>
              <div className="project-info-item">
                <AppLink href={data.link9}>
                  <div className="text-base medium text-color-900">
                    {data.text17}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text18}</span>
              <div className="project-info-item">
                <AppLink href={data.link10}>
                  <div className="text-base medium text-color-900">
                    {data.text19}
                  </div>
                </AppLink>
              </div>
            </div>
            <h2 className="h4">{data.heading5}</h2>
            <div className="project-info-items tw:my-6 tw:flex tw:flex-wrap tw:items-center tw:gap-x-[0.6rem] tw:gap-y-4">
              <div className="project-info-item">
                <AppLink href={data.link11}>
                  <div className="text-base medium text-color-900">
                    {data.text20}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text21}</span>
              <div className="project-info-item">
                <AppLink href={data.link12}>
                  <div className="text-base medium text-color-900">
                    {data.text22}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text23}</span>
              <div className="project-info-item">
                <AppLink href={data.link13}>
                  <div className="text-base medium text-color-900">
                    {data.text24}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text25}</span>
              <div className="project-info-item">
                <AppLink href={data.link14}>
                  <div className="text-base medium text-color-900">
                    {data.text26}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text27}</span>
              <div className="project-info-item">
                <AppLink href={data.link15}>
                  <div className="text-base medium text-color-900">
                    {data.text28}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text29}</span>
              <div className="project-info-item">
                <AppLink href={data.link16}>
                  <div className="text-base medium text-color-900">
                    {data.text30}
                  </div>
                </AppLink>
              </div>
              <span className="project-info-slash-icon">{data.text31}</span>
              <div className="project-info-item">
                <AppLink href={data.link17}>
                  <div className="text-base medium text-color-900">
                    {data.text32}
                  </div>
                </AppLink>
              </div>
            </div>
            <div className="project-information-bottom tw:mb-10 tw:flex tw:flex-col tw:gap-6">
              <h2 className="h4">{data.heading6}</h2>
              <div className="project-contact-info-items tw:flex tw:flex-col tw:gap-5">
                {data.items2.map((item, index) => (
                  <div
                    className="project-contact-info-item tw:flex tw:items-center tw:gap-2.5"
                    key={index}
                  >
                    <img
                      alt={item.imageAlt}
                      className="project-contact-info-item-icon tw:w-5"
                      loading="lazy"
                      src={item.image}
                      width="32"
                    />
                    <div className="text-base secondary-700">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <AppLink
              className="btn-primary full-width w-inline-block tw:inline-flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:bg-brand-dark tw:px-6 tw:py-3 tw:text-base tw:font-medium tw:text-white tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-brand"
              href={data.link18}
            >
              <div>{data.text33}</div>
              <div className="btn-icon-box tw:relative tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                <Icon
                  name="ArrowUpRight"
                  className="up-arrow-icon tw:relative tw:z-[1] tw:size-6"
                />
                <Icon
                  name="ArrowUpRight"
                  className="up-arrow-icon is-absolute tw:absolute tw:size-6"
                />
              </div>
            </AppLink>
          </div>
        </div>
        <div className="project-grid center tw:mb-10 tw:flex tw:flex-row tw:items-start tw:gap-6 tw:max-[991px]:flex-col">
          <div className="project-col _w-29-rem tw:shrink-0 tw:min-[1280px]:basis-[29.875rem] tw:max-[991px]:w-full">
            <img
              alt={data.imageAlt2}
              className="project-side-image tw:h-[32.5625rem] tw:w-full tw:object-cover tw:max-[991px]:h-96"
              loading="lazy"
              sizes="100vw"
              src={data.image2}
            />
          </div>
          <div className="project-overview _w-51-rem w-richtext tw:basis-[51.1875rem] tw:rounded-xl tw:bg-surface-soft tw:px-8 tw:py-6 tw:max-[991px]:basis-auto tw:max-[479px]:px-4">
            <h2>{data.heading7}</h2>
            <p>{data.description}</p>
            <ul role="list">
              {data.items3.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="project-grid tw:mb-10 tw:flex tw:flex-col tw:items-start tw:gap-6 tw:min-[1280px]:flex-row">
          <div className="project-overview _w-51-rem w-richtext tw:basis-[51.1875rem] tw:rounded-xl tw:bg-surface-soft tw:px-8 tw:py-6 tw:max-[991px]:basis-auto tw:max-[479px]:px-4">
            <h2>{data.heading8}</h2>
            <p>{data.description2}</p>
            <ul role="list">
              {data.items4.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          </div>
          <div className="project-col _w-33-rem tw:grid tw:w-full tw:shrink-0 tw:grid-cols-1 tw:grid-rows-2 tw:gap-2.5">
            <img
              alt={data.imageAlt3}
              className="project-side-image tw:h-[32.5625rem] tw:w-full tw:object-cover tw:max-[991px]:h-96"
              loading="lazy"
              sizes="100vw"
              src={data.image3}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
