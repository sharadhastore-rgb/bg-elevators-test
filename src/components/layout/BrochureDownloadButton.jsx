import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

const fieldClass =
  "tw:w-full tw:rounded tw:border tw:border-[#adadad] tw:bg-white tw:px-4 tw:py-3 tw:text-[#181818] tw:focus:border-brand tw:focus:outline-2 tw:focus:outline-brand-soft";

export default function BrochureDownloadButton({ label, autoOpen = false }) {
  const dialog = useRef(null);
  const form = useRef(null);
  const submissionLocked = useRef(false);
  const submissionComplete = useRef(false);
  const redirectTimer = useRef(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function openDialog() {
    setMessage("");
    setStatus("idle");
    submissionLocked.current = false;
    submissionComplete.current = false;
    form.current?.reset();
    dialog.current?.showModal();
  }

  function closeDialog() {
    if (status === "submitting") return;
    dialog.current?.close();
  }

  useEffect(() => {
    if (!autoOpen || dialog.current?.open) return;
    const frame = window.requestAnimationFrame(() => openDialog());
    return () => window.cancelAnimationFrame(frame);
  }, [autoOpen]);

  useEffect(
    () => () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    },
    [],
  );

  async function downloadBrochure() {
    const response = await fetch("/download-brochure/file", {
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(
        "The brochure is unavailable right now. Please try again.",
      );
    if (
      !(response.headers.get("content-type") || "").includes("application/pdf")
    )
      throw new Error("The brochure download did not return a PDF.");

    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const filename =
      disposition.match(/filename="?([^";]+)"?/i)?.[1] ||
      "BG-Elevators-Brochure.pdf";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function submit(event) {
    event.preventDefault();
    if (submissionLocked.current) return;

    submissionLocked.current = true;
    setStatus("submitting");
    setMessage("");

    try {
      if (!submissionComplete.current) {
        const fields = new FormData(event.currentTarget);
        fields.set("kind", "brochure");
        fields.set("page", `${window.location.pathname}#brochure-download`);
        fields.set("Message", "Requested the BG Elevators brochure.");
        const response = await fetch(
          import.meta.env.VITE_FORM_ENDPOINT || "/api/enquiry",
          { method: "POST", body: fields },
        );
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.status !== "success")
          throw new Error(
            result?.message ||
              "We could not submit your details. Please try again.",
          );
        submissionComplete.current = true;
      }

      await downloadBrochure();
      setStatus("success");
      setMessage("Thank you. Your brochure download has started.");
      if (autoOpen)
        redirectTimer.current = window.setTimeout(
          () => window.location.replace("/"),
          1800,
        );
    } catch (error) {
      submissionLocked.current = false;
      setStatus("error");
      setMessage(
        error.message ||
          "We could not complete your request. Please try again.",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        className="download-Brochure-btn tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-3 tw:rounded-full tw:border-0 tw:bg-brand-dark tw:px-7 tw:py-3.5 tw:text-base tw:font-semibold tw:text-white tw:shadow-[0_4px_15px_rgba(0,102,153,0.3)] tw:transition-all tw:duration-300 tw:hover:-translate-y-0.5 tw:hover:bg-[#004d73] tw:hover:shadow-[0_6px_20px_rgba(0,102,153,0.4)] tw:active:translate-y-0"
        onClick={openDialog}
      >
        <Icon name="Download" className="download-Brochure-icon" />
        {label}
      </button>

      <dialog
        ref={dialog}
        id="brochure-download"
        className="enquiry-dialog tw:w-[calc(100%_-_32px)] tw:max-w-[520px] tw:overflow-visible tw:border-0 tw:bg-transparent tw:p-0 tw:backdrop:bg-[rgb(1_32_52/0.6)] tw:backdrop:backdrop-blur-[3px]"
        aria-labelledby="brochure-dialog-title"
        onCancel={(event) => {
          if (status === "submitting") event.preventDefault();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) closeDialog();
        }}
      >
        <div className="modal-content tw:relative tw:max-h-[90vh] tw:overflow-y-auto tw:rounded-[10px] tw:bg-white tw:px-8 tw:py-6 tw:[scrollbar-width:none] tw:max-[767px]:p-[22px] tw:[&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            className="modal-close tw:absolute tw:top-2.5 tw:right-2.5 tw:flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:border-0 tw:bg-transparent tw:text-[#333]"
            aria-label="Close brochure form"
            onClick={closeDialog}
            disabled={status === "submitting"}
          >
            <Icon name="X" />
          </button>

          <div className="tw:mb-5 tw:pr-8">
            <h2 id="brochure-dialog-title" className="h4">
              Download our brochure
            </h2>
            <p className="tw:mt-2 tw:text-sm tw:text-[#607686]">
              Please fill in your details to download the latest BG Elevators
              brochure.
            </p>
          </div>

          <form
            ref={form}
            className="tw:flex tw:flex-col tw:gap-4"
            onSubmit={submit}
          >
            <label className="tw:flex tw:flex-col tw:gap-1.5 tw:text-sm tw:font-medium">
              Full name
              <input
                className={fieldClass}
                name="Name"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={256}
                required
              />
            </label>
            <label className="tw:flex tw:flex-col tw:gap-1.5 tw:text-sm tw:font-medium">
              Email address
              <input
                className={fieldClass}
                name="Email"
                type="email"
                autoComplete="email"
                maxLength={256}
                required
              />
            </label>
            <label className="tw:flex tw:flex-col tw:gap-1.5 tw:text-sm tw:font-medium">
              Phone number
              <input
                className={fieldClass}
                name="Phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                minLength={7}
                maxLength={25}
                required
              />
            </label>
            <label className="tw:flex tw:flex-col tw:gap-1.5 tw:text-sm tw:font-medium">
              Location
              <input
                className={fieldClass}
                name="Location"
                type="text"
                autoComplete="address-level2"
                maxLength={256}
                required
              />
            </label>
            <div
              className="form-honeypot tw:absolute tw:left-[-10000px] tw:h-px tw:w-px tw:overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="brochure-website">Website</label>
              <input
                id="brochure-website"
                name="website"
                autoComplete="off"
                tabIndex={-1}
              />
            </div>
            <button
              className="btn-primary tw:mt-1 tw:inline-flex tw:items-center tw:justify-center tw:disabled:cursor-wait tw:disabled:opacity-60"
              type="submit"
              disabled={status === "submitting" || status === "success"}
            >
              {status === "submitting"
                ? "Preparing brochure…"
                : "Download brochure"}
            </button>
            {message && (
              <p
                className={`form-message tw:mt-0 tw:rounded-md tw:p-3 tw:text-sm ${
                  status === "error"
                    ? "error tw:bg-[#fff0f0] tw:text-[#9b1c20]"
                    : "success tw:bg-[#ecfdf5] tw:text-[#166534]"
                }`}
                role={status === "error" ? "alert" : "status"}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </dialog>
    </>
  );
}
