import { AppLink, Icon } from "@/components/ui";

const columns = [
  [["/images/Products/ssfc.jpg", "Stainless steel elevator cabin"], ["/images/Products/glass-finish-cabin.jpg", "Glass finish elevator cabin"], ["/images/passenger5.jpg", "Contemporary home elevator"]],
  [["/images/Products/gold-cabin.jpg", "Premium gold elevator cabin"], ["/images/passenger2.jpg", "Hospital elevator interior"], ["/images/Products/wooden-finish.webp", "Warm wooden finish elevator cabin"]],
  [["/images/Products/mirror-finish.jpg", "Mirror Finish Cabin"], ["/images/passenger4.jpg", "MRL Elevator"], ["/images/Products/rose-gold.avif", "Rose Gold Cabin"]],
];

export default function MotionShowcaseSection() {
  return (
    <section className="motion-showcase tw:px-[3%] tw:py-10 tw:max-[600px]:px-4 tw:max-[600px]:py-8">
      <div className="motion-showcase-shell tw:mx-auto tw:grid tw:w-full tw:max-w-[78rem] tw:min-w-0 tw:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] tw:overflow-hidden tw:rounded-3xl tw:max-[760px]:grid-cols-1 tw:max-[600px]:rounded-[1.25rem]">
        <div className="motion-showcase-copy tw:relative tw:z-[2] tw:flex tw:flex-col tw:items-start tw:justify-center tw:px-[clamp(2rem,4vw,3.75rem)] tw:py-[clamp(2.5rem,5vw,4.5rem)] tw:max-[600px]:px-6 tw:max-[600px]:py-9">
          <div className="tw:mb-4 tw:text-xs tw:font-semibold tw:tracking-[0.14em] tw:text-white/70 tw:uppercase">BG signature collection</div>
          <h2 className="tw:m-0 tw:max-w-[24rem] tw:text-[clamp(2rem,3vw,3.1rem)] tw:leading-[1.05] tw:font-semibold tw:tracking-[-0.04em] tw:text-white tw:max-[600px]:text-[1.9rem]">
            Designed to move you.
          </h2>
          <p className="tw:mt-4 tw:mb-0 tw:max-w-[22rem] tw:text-sm tw:leading-[1.65] tw:text-white/78">Explore premium cabin finishes crafted for modern homes and landmark buildings.</p>
          <AppLink href="/products" className="tw:mt-7 tw:inline-flex tw:min-h-10 tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:border tw:border-white/55 tw:bg-white tw:px-4 tw:py-2 tw:text-xs tw:font-semibold tw:tracking-[0.04em] tw:text-brand tw:no-underline tw:uppercase tw:transition-colors tw:hover:bg-[#e8f7ff]">
            View collection <Icon name="ArrowRight" size={16} />
          </AppLink>
        </div>
        <div className="motion-showcase-gallery" aria-label="BG Elevators design gallery">
          {columns.map((images, columnIndex) => (
            <div className={`motion-showcase-column motion-showcase-column-${columnIndex + 1}`} key={columnIndex}>
              <div className="motion-showcase-track">
                {[...images, ...images].map(([src, alt], index) => (
                  <figure className="motion-showcase-card" key={`${src}-${index}`} aria-hidden={index >= images.length || undefined}>
                    <img src={src} alt={index < images.length ? alt : ""} loading="lazy" />
                    <figcaption>{alt}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
