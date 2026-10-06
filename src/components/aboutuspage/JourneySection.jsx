const journey = [
  {
    marker: "Established 1995",
    title: "A foundation built on trust",
    description:
      "BG Elevators began with a clear commitment to dependable vertical transportation and attentive customer service.",
  },
  {
    marker: "Understanding",
    title: "Listen before we engineer",
    description:
      "Every requirement starts with understanding the building, its users and the performance expected from the elevator.",
  },
  {
    marker: "Engineering",
    title: "Design with purpose",
    description:
      "Safety, reliability, function and aesthetics are brought together in a solution suited to the project.",
  },
  {
    marker: "Long-term care",
    title: "Support beyond handover",
    description:
      "Our relationship continues through responsive service and maintenance support after installation.",
  },
];

export default function JourneySection() {
  return (
    <section className="tw:overflow-hidden tw:bg-[#f4f8fb] tw:px-[5%] tw:py-12 tw:max-[600px]:px-4 tw:max-[600px]:py-8">
      <div className="tw:mx-auto tw:grid tw:w-full tw:min-w-0 tw:max-w-[82.5rem] tw:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] tw:items-center tw:gap-[clamp(2.5rem,6vw,6rem)] tw:rounded-3xl tw:bg-ink tw:p-[clamp(2.25rem,5vw,5rem)] tw:max-[991px]:grid-cols-1 tw:max-[991px]:gap-10 tw:max-[600px]:gap-8 tw:max-[600px]:rounded-[1.25rem] tw:max-[600px]:p-5">
        <div className="tw:flex tw:max-w-[30rem] tw:flex-col tw:items-start tw:self-center tw:gap-[1.35rem]">
          <div className="badge">About BG Elevators</div>
          <h2 className="tw:m-0 tw:max-w-[29rem] tw:text-[clamp(2.35rem,3.6vw,3.65rem)] tw:leading-[1.06] tw:font-semibold tw:tracking-[-0.035em] tw:text-white tw:max-[600px]:text-[2rem] tw:max-[600px]:leading-[1.1]">
            What defines{" "}
            <span className="tw:whitespace-nowrap tw:text-brand-bright tw:max-[600px]:whitespace-normal">
              our approach
            </span>
          </h2>
          <p className="tw:m-0 tw:max-w-[28rem] tw:text-[0.98rem] tw:leading-[1.75] tw:text-white/75">
            From the first conversation to long-term support, our approach keeps
            people, performance and reliability at the centre of every project.
          </p>
        </div>

        <ol className="tw:m-0 tw:grid tw:w-full tw:min-w-0 tw:list-none tw:grid-cols-2 tw:gap-px tw:overflow-hidden tw:rounded-2xl tw:border tw:border-white/15 tw:bg-white/15 tw:p-0 tw:max-[600px]:grid-cols-1">
          {journey.map((item) => (
            <li
              className="tw:flex tw:min-h-60 tw:min-w-0 tw:flex-col tw:bg-[#07374f] tw:p-[clamp(1.5rem,2.5vw,2.25rem)] tw:transition-colors tw:duration-300 tw:hover:bg-[#0a425f] tw:max-[991px]:p-7 tw:max-[600px]:min-h-0 tw:max-[600px]:p-5"
              key={item.title}
            >
              <div
                className="tw:mb-auto tw:inline-flex tw:w-max tw:pb-6 tw:text-[0.7rem] tw:leading-normal tw:tracking-[0.1em] tw:text-[#6bc7f2] tw:uppercase"
                aria-hidden="true"
              >
                {item.marker}
              </div>
              <div>
                <h3 className="tw:mb-2.5 tw:text-xl tw:leading-[1.2] tw:font-semibold tw:text-white">
                  {item.title}
                </h3>
                <p className="tw:m-0 tw:text-base tw:leading-[1.6] tw:text-white/75">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
