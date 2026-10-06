import { Icon } from "@/components/ui";

export default function DownloadBrochurePage() {
  return (
    <section className="tw:min-h-[48vh] tw:bg-[linear-gradient(145deg,#f3f9fc,#fff)] tw:px-[5%] tw:py-20">
      <div className="tw:mx-auto tw:flex tw:max-w-2xl tw:flex-col tw:items-center tw:text-center">
        <span className="tw:grid tw:size-14 tw:place-items-center tw:rounded-2xl tw:bg-brand tw:text-white tw:shadow-[0_12px_30px_rgba(0,102,153,.22)]">
          <Icon name="Download" size={24} />
        </span>
        <h1 className="tw:mt-5 tw:text-[clamp(2rem,4vw,3.25rem)] tw:leading-tight tw:font-semibold tw:tracking-[-.04em] tw:text-ink">
          Download the BG Elevators brochure
        </h1>
        <p className="tw:mt-4 tw:max-w-xl tw:text-base tw:leading-7 tw:text-[#607686]">
          Complete the short form to receive the latest company and product brochure.
        </p>
      </div>
    </section>
  );
}
