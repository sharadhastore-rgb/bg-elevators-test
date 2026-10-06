import { AppLink, Icon } from "@/components/ui";

const columns = [
  ["/images/passenger5.jpg", "/images/Products/ssfc.jpg", "/images/Products/glass-finish-cabin.jpg"],
  ["/images/passenger2.jpg", "/images/Products/wooden-finish.webp", "/images/passenger6.jpg"],
  ["/images/Products/rose-gold.avif", "/images/Products/mirror-finish.jpg", "/images/Products/SS-Mirror-Cabin.jpg"],
  ["/images/Products/vision-door.jpg", "/images/passenger4.jpg", "/images/Products/gold-cabin.jpg"],
];

const labels = ["Purpose-built engineering", "Curated cabin finishes", "Installation and lifelong care"];

export default function HomeLiftShowcaseSection() {
  return (
    <section className="home-lift-showcase tw:px-[3%] tw:py-10 tw:max-[600px]:px-4 tw:max-[600px]:py-8">
      <div className="home-lift-showcase-shell tw:mx-auto tw:grid tw:w-full tw:max-w-[82.5rem] tw:min-w-0 tw:grid-cols-[minmax(18rem,0.76fr)_minmax(0,1.24fr)] tw:overflow-hidden tw:rounded-3xl tw:bg-ink tw:max-[900px]:grid-cols-1 tw:max-[600px]:rounded-[1.25rem]">
        <div className="home-lift-showcase-copy tw:relative tw:z-[2] tw:flex tw:flex-col tw:items-start tw:justify-center tw:px-[clamp(2rem,3.5vw,3.25rem)] tw:py-8 tw:max-[600px]:px-5 tw:max-[600px]:py-8">
          <div className="tw:mb-3.5 tw:inline-flex tw:rounded-full tw:border tw:border-white/20 tw:bg-white/10 tw:px-3.5 tw:py-1.5 tw:text-[0.68rem] tw:font-semibold tw:tracking-[0.13em] tw:text-[#8ed8fa] tw:uppercase">Engineered around you</div>
          <h2 className="tw:m-0 tw:max-w-[24rem] tw:text-[clamp(2rem,2.7vw,2.7rem)] tw:leading-[1.06] tw:font-semibold tw:tracking-[-0.04em] tw:text-white tw:max-[600px]:text-[1.85rem]">A lift for every <span className="tw:text-brand-bright">space and ambition.</span></h2>
          <p className="tw:mt-4 tw:mb-0 tw:max-w-[25rem] tw:text-[0.88rem] tw:leading-[1.6] tw:text-white/72">From quiet home lifts to commercial systems, every BG elevator is configured for the people and building it serves.</p>
          <ul className="tw:mt-4 tw:mb-0 tw:grid tw:list-none tw:gap-2 tw:p-0 tw:text-[0.82rem] tw:font-medium tw:text-white/90">
            {labels.map((item) => <li className="tw:flex tw:items-center tw:gap-2.5" key={item}><span className="tw:grid tw:size-5 tw:shrink-0 tw:place-items-center tw:rounded-full tw:bg-brand-bright/20 tw:text-[#8ed8fa]"><Icon name="CircleCheck" size={13} /></span>{item}</li>)}
          </ul>
          <AppLink href="/products" className="tw:mt-5 tw:inline-flex tw:min-h-10 tw:items-center tw:justify-center tw:gap-2 tw:rounded-lg tw:bg-white tw:px-4 tw:py-2 tw:text-[0.82rem] tw:font-semibold tw:text-ink tw:no-underline tw:transition-colors tw:hover:bg-[#dff3fc]">Explore elevator finishes <Icon name="ArrowRight" size={16} /></AppLink>
        </div>
        <div className="home-lift-showcase-gallery" aria-label="Elevator applications and finishes">
          {columns.map((images, columnIndex) => (
            <div className={`home-lift-showcase-column home-lift-showcase-column-${columnIndex + 1}`} key={columnIndex}>
              <div className="home-lift-showcase-track">
                {[...images, ...images].map((src, index) => <figure className="home-lift-showcase-card" key={`${src}-${index}`} aria-hidden={index >= images.length || undefined}><img src={src} alt={index < images.length ? "BG Elevators lift design" : ""} loading="lazy" /></figure>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
