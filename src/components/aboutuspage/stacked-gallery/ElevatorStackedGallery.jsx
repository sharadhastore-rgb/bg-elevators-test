import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import { slides as defaultSlides } from "./slides";
import { cardPosition, wrapIndex } from "./carousel";
import "./stacked-gallery.css";

export default function ElevatorStackedGallery({ items = defaultSlides, assetBase = "/assets/elevators", highlight = "Elevators", heading = "for Every Space", buttonLabel = "View elevator", onSelect }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(null);
  const root = useRef(null);
  const track = useRef(null);
  const dialog = useRef(null);
  const cards = useRef([]);
  const controller = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const headingId = useId();
  const dialogId = useId();
  const current = wrapIndex(active, items.length);
  const move = (delta) => setActive((index) => wrapIndex(index + delta, items.length));

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {}, root);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let selectedIndex = current;
    const draw = (index, animate) => ctx.add(() => {
      selectedIndex = index;
      const width = cards.current[0]?.offsetWidth || 606;
      cards.current.forEach((card, cardIndex) => {
        if (!card) return;
        const props = cardPosition(cardIndex, index, items.length, width, innerWidth <= 991);
        gsap.set(card, { zIndex: props.zIndex });
        if (animate && !mq.matches) gsap.to(card, { ...props, duration: 0.4, ease: "power2.out", overwrite: true });
        else { gsap.killTweensOf(card); gsap.set(card, props); }
      });
    });
    controller.current = (index) => draw(index, true);
    draw(current, false);
    const resize = () => draw(selectedIndex, false);
    const observer = new ResizeObserver(resize);
    observer.observe(track.current);
    mq.addEventListener("change", resize);
    return () => { observer.disconnect(); mq.removeEventListener("change", resize); controller.current = null; ctx.revert(); };
  }, [items.length]);

  useLayoutEffect(() => { controller.current?.(current); }, [current]);
  useLayoutEffect(() => { if (selected && !dialog.current.open) dialog.current.showModal(); }, [selected]);

  const open = () => onSelect ? onSelect(items[current]) : setSelected(items[current]);
  const pointerUp = (event) => {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    const threshold = (cards.current[0]?.offsetWidth || 326) * 0.25;
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) { move(dx < 0 ? 1 : -1); suppressClick.current = true; }
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <section ref={root} className="elevator-stack tw:w-full tw:overflow-hidden tw:bg-white tw:px-5 tw:pt-16 tw:pb-12 tw:text-[#012034] tw:md:pt-20 tw:md:pb-16" aria-labelledby={headingId}>
    <h2 id={headingId} className="stack-heading tw:text-center tw:font-medium"><span className="tw:text-[#006699]">{highlight}</span> {heading}</h2>
    <div className="stack-wrapper tw:relative tw:mx-auto tw:w-full tw:max-w-[1056px]" role="region" aria-roledescription="carousel" aria-label="Elevator designs" tabIndex={0} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      <div className="stack-viewport tw:relative tw:mx-auto tw:max-w-[960px] tw:overflow-hidden">
        <div ref={track} className="stack-track tw:relative tw:flex tw:select-none tw:items-center tw:justify-center tw:[touch-action:pan-y]" onPointerDown={(event) => { if (event.button !== 0 || event.target.closest("button,a")) return; drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; suppressClick.current = false; }} onPointerMove={(event) => { if (drag.current && Math.abs(event.clientX - drag.current.x) > 8) event.currentTarget.setPointerCapture(event.pointerId); }} onClickCapture={(event) => { if (suppressClick.current) { suppressClick.current = false; event.preventDefault(); event.stopPropagation(); } }} onPointerUp={pointerUp} onPointerCancel={() => { drag.current = null; }}>
          {items.map((item, index) => <article key={item.id} ref={(element) => { cards.current[index] = element; }} className={`stack-card tw:absolute tw:flex tw:flex-col tw:justify-end tw:overflow-hidden tw:rounded-xl tw:p-6 ${index === current ? "tw:cursor-grab tw:active:cursor-grabbing" : "tw:cursor-pointer"}`} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } if (index !== current) setActive(index); }} aria-roledescription="slide" aria-label={`${index + 1} of ${items.length}: ${item.name}`}>
            <img src={`${assetBase}/${item.image}`} alt={item.alt} draggable="false" fetchPriority={index === 0 ? "high" : "auto"} className="tw:pointer-events-none tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover" />
            <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:bg-gradient-to-t tw:from-[#012034]/30 tw:via-transparent tw:to-transparent" />
            {index === current && <div className="tw:relative tw:text-center"><button type="button" onClick={(event) => { event.stopPropagation(); open(); }} className="tw:rounded-full tw:bg-white tw:px-[30px] tw:py-[14px] tw:text-base tw:leading-5 tw:text-[#123a4f] tw:transition-colors tw:hover:bg-[#e5f2f8] tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-[#3396d6]">{buttonLabel}</button></div>}
          </article>)}
        </div>
        <div className="stack-fade tw:pointer-events-none tw:absolute tw:inset-y-0 tw:left-0 tw:z-10 tw:w-12 tw:bg-gradient-to-r tw:from-white tw:to-transparent" />
        <div className="stack-fade tw:pointer-events-none tw:absolute tw:inset-y-0 tw:right-0 tw:z-10 tw:w-12 tw:bg-gradient-to-l tw:from-white tw:to-transparent" />
      </div>
      <div className="stack-controls tw:mx-auto tw:mt-6 tw:flex tw:max-w-[960px] tw:justify-between tw:px-1">
        <button type="button" onClick={() => move(-1)} className="stack-prev stack-arrow" aria-label="Previous elevator"><FiArrowLeft size={16} /></button>
        <button type="button" onClick={() => move(1)} className="stack-next stack-arrow" aria-label="Next elevator"><FiArrowRight size={16} /></button>
      </div>
      <p className="tw:sr-only" aria-live="polite" aria-atomic="true">{items[current].name}, {current + 1} of {items.length}</p>
    </div>
    <dialog ref={dialog} aria-labelledby={dialogId} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === dialog.current) dialog.current.close(); }} className="tw:m-auto tw:max-h-[90svh] tw:w-[calc(100%_-_2rem)] tw:max-w-[760px] tw:overflow-auto tw:rounded-2xl tw:border tw:border-[#d6e2e6] tw:bg-white tw:p-5 tw:text-[#123a4f] tw:shadow-2xl tw:backdrop:bg-[#012034]/70 tw:md:p-7">
      {selected && <><div className="tw:mb-5 tw:flex tw:items-center tw:justify-between tw:gap-4"><h3 id={dialogId} className="tw:text-2xl tw:font-medium tw:text-[#012034]">{selected.name}</h3><button type="button" autoFocus onClick={() => dialog.current.close()} aria-label="Close elevator details" className="tw:rounded-full tw:bg-[#e5f2f8] tw:p-3 tw:text-[#006699]"><FiX size={20} /></button></div><img src={`${assetBase}/${selected.image}`} alt={selected.alt} className="tw:max-h-[55svh] tw:w-full tw:rounded-xl tw:object-contain" /><p className="tw:mt-5 tw:leading-relaxed tw:text-[#647985]">{selected.description}</p></>}
    </dialog>
  </section>;
}
