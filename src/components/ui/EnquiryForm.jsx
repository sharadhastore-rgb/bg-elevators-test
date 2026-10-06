import { useId, useRef, useState } from "react";
import Icon from "./Icon";
import ui from "@/data/ui.json";

export default function EnquiryForm({ data }) {
  const id = useId();
  const submissionLocked = useRef(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (submissionLocked.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const file = fields.get("Resume");
    if (file?.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage(ui.forms.fileTooLarge);
      return;
    }
    submissionLocked.current = true;
    setStatus("submitting");
    setMessage("");
    fields.set("kind", data.kind);
    fields.set("page", window.location.pathname);
    try {
      const response = await fetch(
        import.meta.env.VITE_FORM_ENDPOINT || "/api/enquiry",
        { method: "POST", body: fields },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.status !== "success")
        throw new Error(result?.message || ui.forms.unavailable);
      setStatus("success");
      setMessage(
        data.kind === "career"
          ? "Application submitted successfully. Our team will review it and contact you soon."
          : "Thank you! Your details have been received. Our team will contact you soon.",
      );
      form.reset();
      if (data.kind === "career")
        window.dispatchEvent(
          new CustomEvent("bg:enquiry-success", {
            detail: {
              message:
                "Application submitted successfully. Our team will review it and contact you soon.",
              closeModal: true,
            },
          }),
        );
    } catch (error) {
      submissionLocked.current = false;
      setStatus("error");
      setMessage(error.message || ui.forms.unavailable);
    }
  }
  return (
    <form
      className={`${data.className || "contact-form"} tw:flex tw:flex-col tw:gap-10`}
      onSubmit={submit}
    >
      {data.title && (
        <div className="contact-form-heading-wrap tw:flex tw:flex-col tw:items-center tw:pr-5 tw:text-center">
          <h2 className="h4">{data.title}</h2>
          <p className="text-base text-color-700">{data.description}</p>
        </div>
      )}
      <div className="contact-form-inputs-wrap tw:flex tw:flex-col tw:gap-6">
        {data.fields.map((field, index) => {
          const fieldId = `${id}-${index}`;
          const props = {
            id: fieldId,
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            className: `${field.className || "contact-input w-input"} tw:m-0 tw:w-full tw:rounded tw:border tw:border-[#adadad] tw:bg-white tw:px-6 tw:py-4 tw:text-[#181818] tw:focus:border-brand tw:focus:outline-2 tw:focus:outline-brand-soft`,
            maxLength: field.type === "textarea" ? 5000 : 256,
          };
          return (
            <div className="form-field tw:w-full tw:min-w-0" key={fieldId}>
              <label className="sr-only" htmlFor={fieldId}>
                {field.placeholder || field.name}
              </label>
              {field.type === "textarea" ? (
                <textarea {...props} />
              ) : (
                <input
                  {...props}
                  type={field.type}
                  accept={field.accept || undefined}
                  autoComplete={
                    /name/i.test(field.name)
                      ? "name"
                      : /email/i.test(field.name)
                        ? "email"
                        : /phone/i.test(field.name)
                          ? "tel"
                          : undefined
                  }
                />
              )}
            </div>
          );
        })}
      </div>
      <div
        className="form-honeypot tw:absolute tw:left-[-10000px] tw:h-px tw:w-px tw:overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${id}-website`}>Website</label>
        <input
          id={`${id}-website`}
          name="website"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>
      <button
        className="btn-primary tw:inline-flex tw:items-center tw:justify-center tw:disabled:cursor-wait tw:disabled:opacity-60"
        type="submit"
        disabled={status === "submitting" || status === "success"}
      >
        <span className="form-submit-content tw:inline-flex tw:items-center tw:justify-center tw:gap-2.5 tw:leading-none">
          {status === "submitting" && (
            <Icon
              name="LoaderCircle"
              className="form-submit-spinner tw:animate-spin tw:motion-reduce:animate-none"
            />
          )}
          <span>
            {status === "submitting" ? ui.forms.submitting : data.submitLabel}
          </span>
          {status !== "submitting" && <Icon name="ArrowUpRight" />}
        </span>
      </button>
      {message && (
        <p
          className={`form-message tw:mt-4 tw:rounded-md tw:p-3 tw:text-sm ${
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
  );
}
