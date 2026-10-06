import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppLink, Icon } from "@/components/ui";
import data from "@/data/navigation.json";
export default function Header() {
  const [open, setOpen] = useState(false),
    { pathname } = useLocation(),
    button = useRef(null),
    panel = useRef(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab") {
        const items = [
          button.current,
          ...panel.current.querySelectorAll("a,button"),
        ].filter((el) => el && el.getClientRects().length);
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1100px)");
    const close = () => setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  const links = data.links.slice(0, -1),
    cta = data.links.at(-1);
  return (
    <header className="tw:relative tw:z-40 tw:border-b tw:border-ink/5 tw:bg-white tw:px-[5%]">
      <div className="tw:mx-auto tw:flex tw:min-h-24 tw:max-w-[1320px] tw:items-center tw:justify-between tw:gap-5 tw:max-[767px]:min-h-20">
        <AppLink
          href="/"
          aria-label={data.brand}
          className="tw:block tw:w-[220px] tw:shrink-0 tw:max-[479px]:w-[175px]"
        >
          <img
            src={data.logo}
            alt={data.brand}
            width="270"
            height="80"
            className="tw:block tw:h-auto tw:w-full tw:max-h-16 tw:object-contain"
          />
        </AppLink>
        <nav
          aria-label="Main navigation"
          className="tw:hidden tw:min-[1100px]:block"
        >
          <ul className="tw:m-0 tw:flex tw:list-none tw:items-center tw:gap-1 tw:p-0">
            {links.map((link) => (
              <li key={link.href}>
                <AppLink
                  href={link.href}
                  aria-current={
                    pathname === link.href ||
                    (pathname === "/" && link.href === "/index")
                      ? "page"
                      : undefined
                  }
                  className={`tw:block tw:rounded-full tw:px-3 tw:py-3 tw:text-[15px] tw:font-medium tw:transition-colors tw:hover:bg-brand-soft/50 ${pathname === link.href || (pathname === "/" && link.href === "/index") ? "tw:bg-brand-soft tw:text-brand" : "tw:text-ink"}`}
                >
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tw:flex tw:items-center tw:gap-3">
          <AppLink
            href={cta.href}
            className="tw:hidden tw:min-[768px]:inline-flex tw:min-h-12 tw:items-center tw:gap-2 tw:rounded-lg tw:bg-brand tw:px-5 tw:font-medium tw:text-white tw:transition-colors tw:hover:bg-ink"
          >
            {cta.label}
            <Icon name="ArrowUpRight" size={18} />
          </AppLink>
          <button
            ref={button}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
            className="tw:grid tw:size-12 tw:place-items-center tw:rounded-lg tw:bg-mist tw:text-ink tw:min-[1100px]:hidden"
          >
            <Icon name={open ? "X" : "Menu"} size={26} />
          </button>
        </div>
      </div>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation overlay"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="tw:fixed tw:inset-0 tw:top-24 tw:-z-10 tw:bg-ink/30 tw:backdrop-blur-sm tw:max-[767px]:top-20"
          />
          <nav
            ref={panel}
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="tw:absolute tw:top-full tw:right-0 tw:left-0 tw:max-h-[calc(100dvh-6rem)] tw:overflow-y-auto tw:border-t tw:border-ink/5 tw:bg-white tw:px-[5%] tw:py-5 tw:shadow-xl tw:min-[1100px]:hidden"
          >
            {links.map((link) => (
              <AppLink
                href={link.href}
                key={link.href}
                aria-current={
                  pathname === link.href ||
                  (pathname === "/" && link.href === "/index")
                    ? "page"
                    : undefined
                }
                className={`tw:flex tw:min-h-12 tw:items-center tw:justify-between tw:rounded-lg tw:px-4 tw:py-3 tw:font-medium ${pathname === link.href || (pathname === "/" && link.href === "/index") ? "tw:bg-mist tw:text-brand" : "tw:text-ink"}`}
              >
                {link.label}
                <Icon name="ChevronRight" size={16} />
              </AppLink>
            ))}
            <AppLink
              href={cta.href}
              className="tw:mt-4 tw:flex tw:min-h-12 tw:items-center tw:justify-center tw:gap-2 tw:rounded-lg tw:bg-brand tw:px-4 tw:py-3 tw:font-medium tw:text-white"
            >
              {cta.label}
              <Icon name="ArrowUpRight" size={18} />
            </AppLink>
          </nav>
        </>
      )}
    </header>
  );
}
