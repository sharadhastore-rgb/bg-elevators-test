import { AppLink } from "@/components/ui";

export default function AboutSection({ data }) {
  return (
    <section className="section home-about-content tw:px-[6.5%] tw:py-12">
      <div className="container tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="w-layout-grid h-about-content-grid tw:grid tw:grid-cols-2 tw:items-center tw:gap-10 tw:min-[1280px]:gap-16 tw:max-[991px]:grid-cols-1">
          <div className="h-about-content-left tw:w-full tw:max-w-[36.1728rem] tw:max-[991px]:max-w-none tw:max-[767px]:hidden">
            <div className="h-about-content-image tw:relative tw:pt-[117.492%]">
              <img
                alt={data.imageAlt}
                className="image tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                loading="lazy"
                sizes="(max-width: 767px) 100vw, 579px"
                src={data.image}
                width="579"
              />
            </div>
          </div>
          <div
            className="h-about-content-right"
            id="w-node-f07c7ffa-595c-5d23-d001-9a22499bdd99-c1e57074"
          >
            <div className="badge">{data.text}</div>
            <div className="spacer _1-rem tw:h-4 tw:w-full" />
            <h2 className="h3">
              {data.heading}
              <span className="secondary-700 tw:text-brand">{data.text2}</span>
              {data.heading2}
            </h2>
            <div className="spacer _1-5-rem tw:h-6 tw:w-full" />
            <p className="text-base">{data.description}</p>
            <div className="h-about-items-wrap tw:mt-8 tw:mb-11">
              <div className="h-about-item tw:flex tw:items-center tw:gap-3">
                <img
                  alt={data.imageAlt2}
                  height="24"
                  loading="lazy"
                  src={data.image2}
                  width="24.5"
                />
                <div className="text-lg medium text-color-800">
                  {data.text3}
                </div>
              </div>
              <div className="h-about-item center tw:my-[1.125rem] tw:flex tw:items-center tw:gap-3 tw:border-y tw:border-[#8a8a8a] tw:py-[1.125rem]">
                <img
                  alt={data.imageAlt3}
                  height="24"
                  loading="lazy"
                  src={data.image3}
                  width="24.5"
                />
                <div className="text-lg medium text-color-800">
                  {data.text4}
                </div>
              </div>
              <div className="h-about-item tw:flex tw:items-center tw:gap-3">
                <img
                  alt={data.imageAlt4}
                  height="24"
                  loading="lazy"
                  src={data.image4}
                  width="24.5"
                />
                <div className="text-lg medium text-color-800">
                  {data.text5}
                </div>
              </div>
            </div>
            <AppLink
              className="btn-primary w-button tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:bg-brand tw:px-6 tw:py-3 tw:text-base tw:font-medium tw:text-white tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-brand"
              href={data.link}
            >
              {data.label}
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
