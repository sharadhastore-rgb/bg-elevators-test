"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

export default function DownloadButton({
  href,
  label = "Download",
  iconOnly = false,
}: {
  href: string;
  label?: string;
  iconOnly?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  async function download() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(href, { credentials: "same-origin" });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") || "";
      const filename =
        disposition.match(/filename="?([^";]+)"?/i)?.[1] ||
        "BG-Elevators-Brochure.pdf";
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.alert("The brochure could not be downloaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      className={iconOnly ? "icon-button" : "button button-secondary"}
      type="button"
      onClick={download}
      disabled={loading}
      aria-label={loading ? "Downloading brochure" : label}
    >
      {loading ? (
        <LoaderCircle className="spin" size={16} />
      ) : (
        <Download size={16} />
      )}
      {!iconOnly && <span>{loading ? "Downloading…" : label}</span>}
    </button>
  );
}
