export default function MapSection({ data }) {
  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:mb-10 tw:flex tw:flex-col tw:gap-2">
          <div className="badge">{data.text}</div>
          <h2 className="tw:m-0 tw:text-2xl tw:leading-[1.3] tw:font-semibold tw:text-[#181818] tw:min-[480px]:text-[2rem]">
            {data.heading}
          </h2>
        </div>
        <div className="tw:w-full">
          <div className="tw:relative tw:overflow-hidden tw:rounded-lg tw:pt-[56.8182%]">
            <iframe
              allowFullScreen
              className="tw:absolute tw:inset-0 tw:h-full tw:w-full"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={data.source}
              style={{ border: "0" }}
              width="100%"
              title="BG Elevators location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
