import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PageFaqSection from "@/components/shared/PageFaqSection";
import { EnquiryProvider } from "@/components/ui";
import footerData from "@/data/footer.json";
import whatsappData from "@/data/whatsapp.json";
import { resolvePage, pageSlug } from "./resolvePage";
import PageMetadata from "./PageMetadata";

export default function App({ initialPage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(initialPage);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    if (location.pathname === "/index")
      navigate(`/${location.search}${location.hash}`, { replace: true });
    else if (
      location.pathname === "/brochure.html" ||
      location.pathname === "/brochure" ||
      location.pathname === "/download-brochure.html"
    )
      navigate(`/download-brochure${location.search}${location.hash}`, {
        replace: true,
      });
  }, [location.pathname, location.search, location.hash, navigate]);
  useEffect(() => {
    let cancelled = false;
    if (page.slug !== pageSlug(location.pathname)) {
      setLoadError(false);
      resolvePage(location.pathname)
        .then((result) => {
          if (!cancelled) setPage(result);
        })
        .catch(() => {
          if (!cancelled) setLoadError(true);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [location.pathname, page.slug]);
  useEffect(() => {
    if (page.slug !== pageSlug(location.pathname)) return;
    if (location.hash)
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView(),
      );
    else window.scrollTo(0, 0);
  }, [page.slug, location.pathname, location.hash]);
  useEffect(() => {
    if (page.slug !== pageSlug(location.pathname)) return undefined;
    const sections = [
      ...document.querySelectorAll(
        'main section:not(:first-child), main > div[class*="section"], footer',
      ),
    ];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) =>
        section.classList.add("scroll-reveal-visible"),
      );
      return undefined;
    }
    const revealDirections = [
      { x: "0px", y: "28px" },
      { x: "-24px", y: "12px" },
      { x: "24px", y: "12px" },
      { x: "0px", y: "28px" },
    ];
    sections.forEach((section, index) => {
      const direction = revealDirections[index % revealDirections.length];
      section.classList.add("scroll-reveal");
      section.style.setProperty("--reveal-x", direction.x);
      section.style.setProperty("--reveal-y", direction.y);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("scroll-reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 },
    );
    sections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.95 && bounds.bottom > 0)
        section.classList.add("scroll-reveal-visible");
      else observer.observe(section);
    });
    return () => observer.disconnect();
  }, [page.slug, location.pathname]);
  const { Component, props } = page;
  const isRouteLoading = page.slug !== pageSlug(location.pathname);
  const standalone = page.slug === "thank-you";
  return (
    <EnquiryProvider key={page.slug}>
      <div className={`page-wrapper page-${page.slug}`}>
        <PageMetadata meta={page.meta} />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {!standalone && <Header />}
        <main id="main-content" aria-busy={isRouteLoading || undefined}>
          {loadError ? (
            <div className="section" role="alert">
              Unable to load this page.{" "}
              <a href={location.pathname}>Reload page</a>
            </div>
          ) : (
            <>
              <Component {...props} />
              {page.slug !== "index" && <PageFaqSection slug={page.slug} />}
            </>
          )}
        </main>
        {!standalone && (
          <>
            <Footer
              data={footerData}
              openBrochure={location.pathname === "/download-brochure"}
            />
            <WhatsAppButton data={whatsappData} />
          </>
        )}
      </div>
    </EnquiryProvider>
  );
}
