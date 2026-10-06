import { createContext, useContext, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useLocation } from "react-router-dom";

const EnquiryContext = createContext(null);
export function EnquiryProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <EnquiryContext.Provider value={{ open, setOpen }}>
      {children}
    </EnquiryContext.Provider>
  );
}
export function ContactTrigger({ children, ...props }) {
  const context = useContext(EnquiryContext);
  return (
    <button type="button" {...props} onClick={() => context.setOpen(true)}>
      {children}
    </button>
  );
}
export default function EnquiryModal({ children }) {
  const { open, setOpen } = useContext(EnquiryContext);
  const [notice, setNotice] = useState("");
  const dialog = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/" && pathname !== "/index") return;
    const timer = window.setTimeout(() => setOpen(true), 10000);
    return () => window.clearTimeout(timer);
  }, [pathname, setOpen]);
  useEffect(() => {
    let timer;
    const showSuccess = (event) => {
      setNotice(event.detail?.message || "Form submitted successfully.");
      if (event.detail?.closeModal) setOpen(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setNotice(""), 6000);
    };
    window.addEventListener("bg:enquiry-success", showSuccess);
    return () => {
      window.removeEventListener("bg:enquiry-success", showSuccess);
      window.clearTimeout(timer);
    };
  }, [setOpen]);
  useEffect(() => {
    const element = dialog.current;
    if (open) {
      element.showModal();
      document.body.style.overflow = "hidden";
    } else if (element.open) element.close();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      {notice && (
        <div className="submission-toast" role="status" aria-live="polite">
          <span className="submission-toast-icon" aria-hidden="true">✓</span>
          <span>
            <strong>Thank you!</strong>
            {notice}
          </span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">
            <Icon name="X" />
          </button>
        </div>
      )}
      <dialog
      ref={dialog}
      className="enquiry-dialog tw:w-[calc(100%_-_32px)] tw:max-w-[520px] tw:overflow-visible tw:border-0 tw:bg-transparent tw:p-0 tw:backdrop:bg-[rgb(1_32_52/0.6)] tw:backdrop:backdrop-blur-[3px]"
      aria-label="Get in touch"
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === dialog.current) setOpen(false);
      }}
    >
      <div className="modal-content tw:relative tw:m-0 tw:max-h-[90vh] tw:w-full tw:max-w-full tw:overflow-y-auto tw:rounded-[10px] tw:bg-white tw:px-8 tw:py-6 tw:[scrollbar-width:none] tw:max-[767px]:p-[22px] tw:[&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          className="modal-close tw:absolute tw:top-2.5 tw:right-2.5 tw:flex tw:h-8 tw:w-8 tw:cursor-pointer tw:items-center tw:justify-center tw:border-0 tw:bg-transparent tw:text-[#333]"
          aria-label="Close enquiry"
          onClick={() => setOpen(false)}
        >
          <Icon name="X" />
        </button>
        {children}
      </div>
      </dialog>
    </>
  );
}
