import { AppLink, Icon } from "@/components/ui";

const featuredCabins = [
  {
    title: "Glass Finish Cabin",
    detail: "Open, architectural elegance",
    image: "/images/Products/glass-finish-cabin.jpg",
    href: "/bg-glass-finish-cabin",
  },
  {
    title: "Gold Finish Cabin",
    detail: "A refined statement finish",
    image: "/images/Products/gold-cabin.jpg",
    href: "/gold-finish",
    badge: "Signature",
  },
  {
    title: "Rose Gold Cabin",
    detail: "Warm, contemporary luxury",
    image: "/images/Products/rose-gold.avif",
    href: "/rose-gold-finish",
  },
];

export default function FeaturedCollectionStrip() {
  return (
    <section className="tw:overflow-hidden tw:px-[2%] tw:py-12 tw:max-[600px]:px-4 tw:max-[600px]:py-9" aria-labelledby="featured-collection-title">
      <div className="tw:mx-auto tw:grid tw:w-full tw:max-w-[94rem] tw:grid-cols-[1.1fr_repeat(3,minmax(0,1fr))] tw:overflow-hidden tw:rounded-2xl tw:border tw:border-[#d8e7ef] tw:bg-white tw:max-[850px]:grid-cols-2 tw:max-[520px]:rounded-xl">
        <div className="tw:relative tw:flex tw:min-h-[23.5rem] tw:flex-col tw:items-start tw:justify-center tw:overflow-hidden tw:bg-[linear-gradient(145deg,#0878b2,#02537d)] tw:px-12 tw:py-10 tw:text-white tw:max-[850px]:col-span-2 tw:max-[850px]:min-h-[16rem] tw:max-[520px]:px-6">
          <span className="tw:mb-3 tw:text-[0.67rem] tw:font-semibold tw:tracking-[0.17em] tw:text-[#bce9ff] tw:uppercase">BG Signature Collection</span>
          <h2 id="featured-collection-title" className="tw:m-0 tw:max-w-[15rem] tw:text-[clamp(1.7rem,2.5vw,2.35rem)] tw:leading-[1.05] tw:font-semibold tw:tracking-[-0.035em]">Elevated design, newly curated.</h2>
          <p className="tw:mt-3 tw:mb-5 tw:max-w-[18rem] tw:text-[0.78rem] tw:leading-[1.55] tw:text-white/76">Discover premium finishes chosen for modern homes and landmark spaces.</p>
          <AppLink href="/products" className="tw:inline-flex tw:min-h-9 tw:items-center tw:gap-2 tw:rounded-md tw:border tw:border-white/30 tw:bg-white tw:px-4 tw:py-2 tw:text-[0.72rem] tw:font-semibold tw:tracking-[0.04em] tw:text-[#04334d] tw:no-underline tw:uppercase tw:transition tw:hover:-translate-y-0.5 tw:hover:bg-[#eaf8ff]">
            View collection <Icon name="ArrowRight" size={15} />
          </AppLink>
        </div>

        {featuredCabins.map((item) => (
          <AppLink key={item.title} href={item.href} className="tw:group tw:flex tw:min-w-0 tw:flex-col tw:border-l tw:border-[#e1ebf0] tw:bg-white tw:text-ink tw:no-underline tw:max-[850px]:border-t tw:max-[850px]:first-of-type:border-l-0 tw:max-[520px]:col-span-2 tw:max-[520px]:border-l-0">
            <div className="tw:relative tw:h-[18.5rem] tw:overflow-hidden tw:bg-[#eaf2f5] tw:max-[850px]:h-[15rem]">
              <img src={item.image} alt={item.title} loading="lazy" className="tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-700 tw:ease-out tw:group-hover:scale-[1.045]" />
              {item.badge && <span className="tw:absolute tw:top-3 tw:right-3 tw:rounded-full tw:bg-brand tw:px-2.5 tw:py-1 tw:text-[0.58rem] tw:font-semibold tw:tracking-[0.08em] tw:text-white tw:uppercase">{item.badge}</span>}
            </div>
            <div className="tw:flex tw:min-h-[5rem] tw:items-center tw:justify-between tw:gap-3 tw:px-5 tw:py-4">
              <div className="tw:min-w-0">
                <h3 className="tw:m-0 tw:truncate tw:text-[0.83rem] tw:font-semibold tw:text-[#12384b]">{item.title}</h3>
                <p className="tw:mt-1 tw:mb-0 tw:truncate tw:text-[0.66rem] tw:text-[#6b808c]">{item.detail}</p>
              </div>
              <span className="tw:grid tw:size-7 tw:shrink-0 tw:place-items-center tw:rounded-full tw:border tw:border-[#cfe0e8] tw:text-brand tw:transition tw:group-hover:border-brand tw:group-hover:bg-brand tw:group-hover:text-white"><Icon name="ArrowUpRight" size={14} /></span>
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
