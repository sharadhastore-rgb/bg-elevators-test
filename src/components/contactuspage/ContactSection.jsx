import { EnquiryForm } from "@/components/ui";

export default function ContactSection({ data }) {
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
        <div className="tw:grid tw:grid-cols-2 tw:items-center tw:gap-x-14 tw:gap-y-6 tw:max-[991px]:grid-cols-1">
          <div>
            <div className="tw:relative tw:pt-[110.802%]">
              <img
                alt={data.imageAlt}
                className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
                loading="lazy"
                sizes="(max-width: 767px) 100vw, 648px"
                src={data.image}
                width="648"
              />
              <div className="tw:absolute tw:right-5 tw:bottom-5 tw:left-5 tw:z-10 tw:flex tw:flex-col tw:gap-6 tw:rounded-xl tw:border tw:border-[#cfe5d2] tw:bg-white tw:px-6 tw:py-8 tw:max-[479px]:right-1 tw:max-[479px]:bottom-2 tw:max-[479px]:left-1 tw:max-[479px]:gap-4 tw:max-[479px]:px-4 tw:max-[479px]:py-6">
                {data.items.map((item, index) => (
                  <div className="tw:flex tw:items-center tw:gap-3" key={index}>
                    <div className="tw:flex tw:h-[3.25rem] tw:w-[3.25rem] tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:bg-[#e8f3ea] tw:max-[479px]:h-11 tw:max-[479px]:w-11">
                      <img
                        alt={item.imageAlt}
                        className="tw:h-8 tw:w-8 tw:object-contain tw:max-[479px]:h-6 tw:max-[479px]:w-6"
                        loading="lazy"
                        src={item.image}
                        width="32"
                      />
                    </div>
                    <div className="tw:text-lg tw:leading-[1.4] tw:font-medium tw:text-[#181818]">
                      {item.text}
                    </div>
                  </div>
                ))}
                <div className="tw:flex tw:items-center tw:gap-3">
                  <div className="tw:flex tw:h-[3.25rem] tw:w-[3.25rem] tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:bg-[#e8f3ea] tw:max-[479px]:h-11 tw:max-[479px]:w-11">
                    <img
                      alt={data.imageAlt2}
                      className="tw:h-8 tw:w-8 tw:object-contain tw:max-[479px]:h-6 tw:max-[479px]:w-6"
                      loading="lazy"
                      src={data.image2}
                      width="32"
                    />
                  </div>
                  <div className="tw:text-lg tw:leading-[1.4] tw:font-medium tw:text-[#181818]">
                    {data.text}
                    <br />
                    {data.text2}
                    <br />
                    {data.text3}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tw:mb-0 tw:rounded-lg tw:border tw:border-[#72727242] tw:bg-white tw:px-5 tw:py-8 tw:min-[1280px]:px-8 tw:max-[479px]:px-4 tw:max-[479px]:py-6">
            <EnquiryForm data={data.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
