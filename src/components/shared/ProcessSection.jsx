"use client";

import { useEffect, useRef, useState } from "react";

export default function ProcessSection({ data }) {
  const cards = [
    ...data.items,
    { imageAlt: data.imageAlt, image: data.image, heading: data.heading3, description: data.description },
    { imageAlt: data.imageAlt2, image: data.image2, heading: data.heading4, description: data.description2 },
  ];
  const cardRefs = useRef([]);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        const target = window.innerHeight * 0.52;
        let closest = 0;
        let distance = Number.POSITIVE_INFINITY;
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const nextDistance = Math.abs(rect.top + rect.height / 2 - target);
          if (nextDistance < distance) {
            distance = nextDistance;
            closest = index;
          }
        });
        setActive(closest);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="section process-section tw:px-[5%] tw:py-12 tw:max-[600px]:px-4 tw:max-[600px]:py-9">
      <div className="container tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-[82.5rem]">
        <div className="title-center _3-rem tw:mb-12 tw:flex tw:flex-col tw:items-center tw:text-center tw:max-[767px]:mb-8">
          <div className="badge">{data.text}</div>
          <h2>{data.heading}<span className="secondary-700 tw:text-brand">{data.text2}</span>{data.heading2}<span className="secondary-700 tw:text-brand">{data.text3}</span></h2>
        </div>
        <div className="about-work-card-list process-card-list tw:grid tw:grid-cols-2 tw:gap-6 tw:min-[1280px]:grid-cols-4 tw:max-[767px]:grid-cols-1 tw:max-[767px]:gap-4">
          {cards.map((item, index) => (
            <article
              ref={(element) => { cardRefs.current[index] = element; }}
              className={`work-card process-card tw:group tw:flex tw:flex-col tw:gap-3 tw:rounded-xl tw:border tw:border-border tw:bg-surface tw:px-6 tw:pt-6 tw:pb-[1.875rem] tw:transition-all tw:duration-500 tw:ease-out tw:hover:-translate-y-1 tw:hover:border-brand-bright tw:hover:bg-brand-bright tw:hover:shadow-[0_18px_42px_rgba(1,32,52,0.14)] tw:max-[991px]:px-5 ${active === index ? "is-scroll-active" : ""}`}
              key={item.heading}
            >
              <span className="process-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className="work-card-top tw:flex tw:flex-col tw:items-start tw:gap-6">
                <img alt={item.imageAlt} className="work-card-image tw:h-auto tw:w-[3.98988rem] tw:transition-all tw:duration-500 tw:group-hover:scale-105 tw:group-hover:brightness-0 tw:group-hover:invert" loading="lazy" src={item.image} width="58" />
                <div className="h5 tw:transition-colors tw:duration-500 tw:group-hover:text-white">{item.heading}</div>
              </div>
              <p className="text-base tw:transition-colors tw:duration-500 tw:group-hover:text-white">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
