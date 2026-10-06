import { Icon, Carousel } from "@/components/ui";

export default function TestimonialsSection({ data }) {
  return (
    <section className="section testimonials-section tw:relative tw:overflow-hidden tw:bg-[linear-gradient(180deg,#fff_0%,#f7fafc_100%)] tw:px-[5%] tw:py-12 tw:max-[600px]:px-4 tw:max-[600px]:py-9">
      <div className="container tw:relative tw:z-[1] tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-[82.5rem]">
        <div className="three-row-title-wrap tw:mx-auto tw:mb-12 tw:flex tw:max-w-[35rem] tw:flex-col tw:items-center tw:text-center tw:max-[600px]:mb-8">
          <div className="three-row-title-top tw:flex tw:flex-col tw:items-center tw:gap-4">
            <div className="badge">{data.text}</div>
            <h2 className="h3 tw:max-w-[30rem] tw:text-[clamp(2.25rem,3.4vw,3rem)] tw:leading-[1.05] tw:max-[600px]:text-[2rem] tw:max-[600px]:leading-[1.1]">
              {data.heading}
              <span className="secondary-700 tw:text-brand">{data.text2}</span>
            </h2>
          </div>
          <p className="tw:max-w-[32rem] tw:text-base tw:text-copy-muted tw:max-[600px]:text-[0.95rem] tw:max-[600px]:leading-[1.6]">{data.description}</p>
        </div>
        <Carousel autoPlay interval={3000} variant="testimonials">
          {data.items.map((item, index) => (
            <div className="slider-item w-slide tw:mx-auto tw:mr-0 tw:h-full tw:w-full tw:max-w-none" key={index}>
              <div className="testimonial-card tw:relative tw:mx-auto tw:flex tw:min-h-96 tw:h-full tw:w-full tw:max-w-full tw:flex-col tw:overflow-hidden tw:rounded-2xl tw:border tw:border-[#d7e7ef] tw:bg-white tw:p-7 tw:shadow-none tw:transition-[transform,border-color,background-color] tw:duration-500 tw:ease-[cubic-bezier(0.22,1,0.36,1)] tw:hover:-translate-y-0.5 tw:hover:border-[#afd8eb] tw:hover:bg-[#fbfdff] tw:max-[600px]:min-h-0 tw:max-[600px]:p-5">
                <Icon
                  name="Quote"
                  className="tw:mb-5 tw:grid tw:size-12 tw:place-items-center tw:rounded-[0.875rem] tw:bg-[#e8f5fb] tw:p-[0.7rem] tw:text-[#0073ad] tw:max-[600px]:mb-4 tw:max-[600px]:size-11"
                />
                <p className="text-base tw:flex-1 tw:text-[0.98rem] tw:leading-[1.7] tw:text-[#294555] tw:max-[600px]:text-[0.94rem] tw:max-[600px]:leading-[1.65]">
                  {item.description}
                </p>
                <div className="testimoni-profile-wrap tw:mt-6 tw:flex tw:items-center tw:gap-2.5 tw:border-t tw:border-[#e3edf2] tw:pt-5">
                  <img
                    alt={item.imageAlt}
                    className="testimoni-profile-image tw:size-13 tw:rounded-full tw:border-3 tw:border-[#e7f3f9] tw:bg-[#f1f5f7] tw:object-cover"
                    loading="lazy"
                    src={item.image}
                  />
                  <div className="testimoni-profile-content tw:flex tw:flex-col tw:gap-1">
                    <div className="h6 tw:font-bold tw:text-ink">
                      {item.heading}
                    </div>
                    <p className="text-md secondary-700 tw:text-[0.78rem] tw:font-semibold tw:tracking-[0.02em] tw:text-[#0073ad]">
                      {item.description2}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
