import { useEffect, useRef, useState } from "react";
import { AppLink, Icon } from "@/components/ui";
export default function HeroSection({ data }) {
  const [active, setActive] = useState(0),
    [hovered, setHovered] = useState(false),
    [paused, setPaused] = useState(false),
    touch = useRef(null);
  const count = data.slides.length,
    move = (delta) => setActive((i) => (i + delta + count) % count);
  useEffect(() => {
    if (
      paused ||
      hovered ||
      count < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % count);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, hovered, count]);
  return (
    <section
      aria-label="BG Elevators solutions"
      aria-roledescription="carousel"
      className="tw:relative tw:overflow-hidden tw:bg-ink"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const x = e.changedTouches[0].clientX - touch.current.x,
          y = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(x) > 60 && Math.abs(x) > Math.abs(y)) {
          move(x < 0 ? 1 : -1);
          setPaused(true);
        }
        touch.current = null;
      }}
    >
      <div className="tw:grid">
        {data.slides.map((slide, index) => (
          <div
            key={slide.image}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            aria-hidden={index !== active}
            inert={index !== active}
            className={`tw:col-start-1 tw:row-start-1 tw:grid tw:min-w-0 tw:transition-[opacity,transform] tw:duration-[800ms] tw:ease-out tw:motion-reduce:transition-none tw:min-[768px]:min-h-[600px] tw:min-[768px]:grid-cols-[1.15fr_1fr] ${active === index ? "tw:z-10 tw:translate-x-0 tw:opacity-100" : "tw:pointer-events-none tw:translate-x-5 tw:opacity-0"}`}
          >
            <div className="tw:flex tw:min-w-0 tw:flex-col tw:items-start tw:justify-center tw:px-[6%] tw:py-12 tw:min-[768px]:py-20 tw:min-[768px]:pr-10 tw:min-[768px]:pl-[max(7vw,calc((100vw-1320px)/2))] tw:max-[479px]:py-9">
              <h1 className="tw:m-0 tw:max-w-[650px] tw:text-[clamp(2rem,4.2vw,4rem)] tw:leading-[1.12] tw:font-semibold tw:tracking-[-0.035em] tw:text-brand-bright tw:max-[767px]:text-[clamp(2rem,7.5vw,3rem)]">
                {slide.title}{" "}
                <span className="tw:text-white">{slide.highlight}</span>
              </h1>
              <p className="tw:mt-6 tw:mb-0 tw:max-w-[530px] tw:text-base tw:leading-[1.75] tw:text-white/80 tw:min-[1100px]:text-lg">
                {slide.description}
              </p>
              <div className="tw:mt-8 tw:flex tw:flex-wrap tw:items-center tw:gap-x-6 tw:gap-y-3">
                {slide.links.map((link, i) => (
                  <AppLink
                    key={link.href}
                    href={link.href}
                    tabIndex={index === active ? 0 : -1}
                    className={
                      i === 0
                        ? "tw:inline-flex tw:min-h-12 tw:items-center tw:justify-center tw:gap-2 tw:rounded-lg tw:bg-brand tw:px-6 tw:py-3 tw:font-medium tw:text-white tw:transition-colors tw:hover:bg-brand-bright"
                        : "tw:inline-flex tw:min-h-12 tw:items-center tw:gap-2 tw:py-3 tw:text-white tw:underline-offset-4 tw:hover:underline"
                    }
                  >
                    {link.label}
                    {i !== 0 && <Icon name="ArrowRight" size={19} />}
                  </AppLink>
                ))}
              </div>
            </div>
            <div className="tw:relative tw:min-w-0 tw:max-[767px]:aspect-[16/11]">
              <img
                src={slide.image}
                alt={slide.imageAlt || "BG Elevators lift installation"}
                width="800"
                height="800"
                fetchPriority={index === 0 ? "high" : "auto"}
                className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover tw:object-center"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="tw:absolute tw:right-5 tw:bottom-4 tw:z-20 tw:flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-white/25 tw:bg-ink/65 tw:p-1 tw:text-white tw:backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            move(-1);
            setPaused(true);
          }}
          aria-label="Previous slide"
          className="tw:grid tw:size-11 tw:place-items-center tw:rounded-full tw:bg-transparent tw:text-white tw:hover:bg-white/15"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        {data.slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => {
              setActive(i);
              setPaused(true);
            }}
            aria-label={`Show slide ${i + 1}`}
            aria-current={active === i}
            className="tw:grid tw:size-9 tw:place-items-center tw:bg-transparent"
          >
            <span
              className={`tw:block tw:h-2 tw:rounded-full tw:transition-all ${active === i ? "tw:w-5 tw:bg-white" : "tw:w-2 tw:bg-white/40"}`}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            move(1);
            setPaused(true);
          }}
          aria-label="Next slide"
          className="tw:grid tw:size-11 tw:place-items-center tw:rounded-full tw:bg-transparent tw:text-white tw:hover:bg-white/15"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          aria-pressed={paused}
          className="tw:grid tw:size-11 tw:place-items-center tw:rounded-full tw:bg-transparent tw:text-white tw:hover:bg-white/15"
        >
          <Icon name={paused ? "Play" : "Pause"} size={16} />
        </button>
      </div>
    </section>
  );
}
