import { AppLink, Icon } from "@/components/ui";

export default function WhatsAppButton({ data }) {
  return (
    <section className="whatsapp-fixed-button tw:fixed tw:right-5 tw:bottom-5 tw:z-[1000] tw:max-[479px]:right-4 tw:max-[479px]:bottom-4">
      <div className="tw:flex tw:items-center">
        <p className="whatsapp-text tw:mr-2 tw:hidden tw:text-sm tw:text-white">
          {data.description}
        </p>
        <AppLink
          className="tw:inline-flex tw:rounded-full tw:focus-visible:outline-3 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-brand"
          aria-label="Chat with us on WhatsApp"
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
