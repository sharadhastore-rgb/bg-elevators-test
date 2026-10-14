import { AppLink, Icon } from "@/components/ui";

export default function WhatsAppButton({ data }) {
  return (
    <section className="whatsapp-fixed-button tw:fixed tw:right-5 tw:bottom-5 tw:z-[1000] tw:max-[479px]:right-4 tw:max-[479px]:bottom-4">
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-3">
        <AppLink
          className="floating-contact-link floating-call-link tw:inline-flex tw:rounded-full tw:focus-visible:outline-3 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-brand"
          aria-label={data.callDescription || "Call BG Elevators"}
          title={data.callDescription || "Call us"}
          href={data.callLink}
        >
          <Icon
            name="Phone"
            className="floating-call-ico tw:static tw:z-10 tw:h-[46px] tw:w-[46px] tw:rounded-full"
          />
        </AppLink>
        <AppLink
          className="floating-contact-link tw:inline-flex tw:rounded-full tw:focus-visible:outline-3 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-brand"
          aria-label="Chat with us on WhatsApp"
          title={data.description}
          href={data.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon
            name="MessageCircle"
            className="whatsapp-ico tw:static tw:z-10 tw:h-[50px] tw:w-[50px] tw:rounded-full tw:bg-[#4dc247] tw:p-2.5 tw:text-white tw:shadow-[2px_2px_6px_rgba(0,0,0,0.4)] tw:transition-shadow tw:hover:shadow-[2px_2px_11px_rgba(0,0,0,0.7)]"
          />
        </AppLink>
      </div>
    </section>
  );
}
