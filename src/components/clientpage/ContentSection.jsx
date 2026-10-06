import { Carousel } from "@/components/ui";

export default function ContentSection({ data }) {
  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mx-auto tw:mb-10 tw:flex tw:max-w-[54rem] tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:text-center tw:min-[1280px]:max-w-[65rem]">
          <div className="badge">{data.text}</div>
          <h1 className="tw:m-0 tw:text-[2.5rem] tw:leading-[1.2] tw:font-semibold tw:text-[#181818] tw:max-[479px]:text-[2rem]">
            <span className="tw:text-brand">{data.text2}</span>
            {data.heading}
            <span className="tw:text-brand">{data.text3}</span>
            {data.heading2}
          </h1>
        </div>
        <Carousel>
          {data.items.map((item, index) => (
            <article className="tw:w-full" key={index}>
              <div className="tw:h-[250px] tw:w-full tw:overflow-hidden tw:rounded-lg tw:bg-white">
                <img
                  alt={item.imageAlt}
                  className="tw:h-full tw:w-full tw:object-cover"
                  loading="lazy"
                  src={item.image}
                />
              </div>
              <h2 className="tw:mt-4 tw:mb-2 tw:text-center tw:text-base tw:leading-[1.4] tw:font-semibold tw:text-[#181818]">
                {item.heading}
              </h2>
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
