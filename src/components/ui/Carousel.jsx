import { Children, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

/** Native scroll-snap supports touch/trackpad and keyboard, without legacy scripts. */
export default function Carousel({
  children,
  autoPlay = false,
  interval = 4500,
  variant = "default",
}) {
  const track = useRef(null);
  const [position, setPosition] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [paused, setPaused] = useState(false);
  const slides = Children.toArray(children).filter(Boolean);

  function metrics() {
    const el = track.current;
    const item = el?.firstElementChild;
    if (!el || !item) return { step: 1, visible: 1, pages: 1 };
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = item.getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.round((el.clientWidth + gap) / step));
    return {
      step,
      visible,
      pages: Math.max(1, Math.ceil(slides.length / visible)),
    };
  }

  function goTo(page) {
    const el = track.current;
    if (!el) return;
    const { step, visible, pages } = metrics();
    const nextPage = (page + pages) % pages;
    el.scrollTo({
      left: Math.min(
        nextPage * visible * step,
        el.scrollWidth - el.clientWidth,
      ),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    setPosition(nextPage);
  }

  function move(direction) {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next =
      direction > 0 && el.scrollLeft >= max - 3
        ? 0
        : direction < 0 && el.scrollLeft <= 3
          ? max
          : el.scrollLeft +
            direction *
              metrics().step;
    el.scrollTo({
      left: next,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  useEffect(() => {
    const update = () => setPageCount(metrics().pages);
    update();
    const observer = new ResizeObserver(update);
    if (track.current) observer.observe(track.current);
    return () => observer.disconnect();
  }, [slides.length]);

  useEffect(() => {
    if (
      !autoPlay ||
      paused ||
      pageCount < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return undefined;
    const timer = window.setInterval(() => goTo(position + 1), interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, interval, pageCount, paused, position]);

  const itemWidth =
    variant === "testimonials" ||
    variant === "projects" ||
    variant === "products"
      ? "tw:basis-[calc((100%_-_72px)/4)]"
      : "tw:basis-[calc((100%_-_48px)/3)]";

  return (
    <div
      className={`tw:h-auto tw:w-full tw:min-w-0 tw:max-w-full tw:overflow-hidden ${variant === "products" ? "tw:relative" : ""}`}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
    >
      <div
        ref={track}
        className="tw:flex tw:w-full tw:max-w-full tw:gap-6 tw:overflow-x-auto tw:overscroll-x-contain tw:pb-2 tw:[touch-action:pan-x_pan-y_pinch-zoom] tw:[scrollbar-width:none] tw:[scroll-snap-type:x_mandatory] tw:[&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-label="Scrollable cards"
        onScroll={() => {
          const { step, visible } = metrics();
          setPosition(Math.round(track.current.scrollLeft / (step * visible)));
        }}
      >
        {slides.map((slide, index) => (
          <div
            className={`tw:flex tw:min-w-0 tw:shrink-0 tw:justify-center tw:[scroll-snap-align:start] tw:max-[991px]:basis-[calc((100%_-_24px)/2)] tw:max-[479px]:basis-full ${itemWidth}`}
            key={index}
          >
            {slide}
          </div>
        ))}
      </div>
      {variant === "testimonials" || variant === "projects" ? (
        <div
          className="tw:mt-10 tw:flex tw:max-w-full tw:flex-wrap tw:items-center tw:justify-center tw:gap-1.5 tw:max-[600px]:mt-7"
          aria-label={`Choose ${variant} page`}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              type="button"
              key={index}
              className={`tw:size-3 tw:rounded-full tw:border-0 tw:p-0 tw:transition-all tw:duration-200 ${position === index ? "tw:scale-105 tw:bg-[#242424]" : "tw:bg-[#aaa]"}`}
              aria-label={`Show ${variant} page ${index + 1}`}
              aria-current={position === index ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : variant === "products" ? (
        <div className="tw:pointer-events-none tw:absolute tw:inset-0">
          <button
            type="button"
            className="tw:pointer-events-auto tw:absolute tw:top-[42%] tw:left-2 tw:z-[2] tw:grid tw:size-10 tw:-translate-y-1/2 tw:place-items-center tw:rounded-full tw:border-0 tw:bg-[#171717] tw:p-0 tw:text-white tw:shadow-[0_6px_18px_rgb(0_0_0/0.18)] tw:transition-[background-color,transform] tw:duration-300 tw:hover:-translate-y-1/2 tw:hover:scale-[1.08] tw:hover:bg-[#3396d6] tw:max-[479px]:left-2.5"
            aria-label="Previous products"
            onClick={() => move(-1)}
          >
            <Icon name="ChevronLeft" />
          </button>
          <button
            type="button"
            className="tw:pointer-events-auto tw:absolute tw:top-[42%] tw:right-2 tw:z-[2] tw:grid tw:size-10 tw:-translate-y-1/2 tw:place-items-center tw:rounded-full tw:border-0 tw:bg-[#171717] tw:p-0 tw:text-white tw:shadow-[0_6px_18px_rgb(0_0_0/0.18)] tw:transition-[background-color,transform] tw:duration-300 tw:hover:-translate-y-1/2 tw:hover:scale-[1.08] tw:hover:bg-[#3396d6] tw:max-[479px]:right-2.5"
            aria-label="Next products"
            onClick={() => move(1)}
          >
            <Icon name="ChevronRight" />
          </button>
        </div>
      ) : (
        <div className="tw:mt-7 tw:flex tw:items-center tw:justify-center tw:gap-5">
          <button
            type="button"
            className="tw:flex tw:size-[42px] tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-[#cee1ee] tw:bg-white tw:text-[#012034] tw:transition-colors tw:hover:border-[#3396d6] tw:hover:bg-[#3396d6] tw:hover:text-white"
            aria-label="Previous cards"
            onClick={() => move(-1)}
          >
            <Icon name="ChevronLeft" />
          </button>
          <div
            className="tw:h-[3px] tw:w-[100px] tw:overflow-hidden tw:rounded-[3px] tw:bg-[#dfebf3]"
            aria-hidden="true"
          >
            <span
              className="tw:block tw:h-full tw:bg-[#3396d6] tw:transition-[margin-left] tw:duration-200"
              style={{
                width: `${100 / Math.max(slides.length - 2, 1)}%`,
                marginLeft: `${Math.min((position / Math.max(slides.length - 2, 1)) * 100, 90)}%`,
              }}
            />
          </div>
          <button
            type="button"
            className="tw:flex tw:size-[42px] tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-[#cee1ee] tw:bg-white tw:text-[#012034] tw:transition-colors tw:hover:border-[#3396d6] tw:hover:bg-[#3396d6] tw:hover:text-white"
            aria-label="Next cards"
            onClick={() => move(1)}
          >
            <Icon name="ChevronRight" />
          </button>
        </div>
      )}
    </div>
  );
}
