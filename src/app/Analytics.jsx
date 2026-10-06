import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
export default function Analytics() {
  const location = useLocation();
  useEffect(() => {
    if (
      !measurementId ||
      typeof window === "undefined" ||
      navigator.doNotTrack === "1"
    )
      return;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false,
      anonymize_ip: true,
    });
    if (!document.querySelector(`script[data-ga="${measurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset.ga = measurementId;
      document.head.append(script);
    }
  }, []);
  useEffect(() => {
    if (!measurementId || !window.gtag || navigator.doNotTrack === "1") return;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}`,
    });
  }, [location.pathname, location.search]);
  return null;
}
