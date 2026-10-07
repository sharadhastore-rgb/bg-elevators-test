"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";

export default function DoorCardScroller({ items }) {
  const trackRef = useRef(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollBack(track.scrollLeft > 2);
    setCanScrollForward(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 2,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateControls();
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    return () => observer.disconnect();
  }, [items.length, updateControls]);

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.8, 240),
      behavior: "smooth",
    });
  };

  return (
    <div className="tw:relative tw:mb-6">
      <div
        ref={trackRef}
        onScroll={updateControls}
        className="tw:flex tw:snap-x tw:snap-mandatory tw:gap-4 tw:overflow-x-auto tw:[scrollbar-width:none] tw:[&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <article
            className="tw:min-w-[14rem] tw:basis-[calc((100%_-_2rem)/3)] tw:shrink-0 tw:snap-start tw:overflow-hidden tw:rounded-xl tw:bg-white tw:p-2.5 tw:text-center tw:shadow-[0_2px_8px_rgba(0,0,0,0.05)] tw:max-[767px]:basis-[72%] tw:max-[479px]:basis-[88%]"
            key={`${item.image}-${index}`}
          >
            <div className="tw:h-[250px] tw:w-full tw:overflow-hidden">
              <img
                alt={item.imageAlt}
                className="tw:h-full tw:w-full tw:object-cover"
                loading="lazy"
                src={item.image}
              />
            </div>
            <h3 className="tw:m-0 tw:p-[0.6rem] tw:text-base tw:font-semibold tw:text-black">
              {item.heading}
            </h3>
          </article>
        ))}
      </div>
      {canScrollBack && (
        <button
          type="button"
          aria-label="Show previous doors"
          onClick={() => move(-1)}
          className="tw:absolute tw:top-1/2 tw:left-2 tw:grid tw:size-10 tw:-translate-y-1/2 tw:place-items-center tw:rounded-full tw:border tw:border-border tw:bg-white tw:text-brand tw:shadow-lg tw:transition tw:hover:bg-brand tw:hover:text-white"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
      )}
      {canScrollForward && (
        <button
          type="button"
          aria-label="Show more doors"
          onClick={() => move(1)}
          className="tw:absolute tw:top-1/2 tw:right-2 tw:grid tw:size-10 tw:-translate-y-1/2 tw:place-items-center tw:rounded-full tw:border tw:border-border tw:bg-white tw:text-brand tw:shadow-lg tw:transition tw:hover:bg-brand tw:hover:text-white"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      )}
    </div>
  );
}
