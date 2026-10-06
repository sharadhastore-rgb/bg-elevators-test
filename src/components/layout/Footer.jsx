import { AppLink, Icon } from "@/components/ui";
import BrochureDownloadButton from "./BrochureDownloadButton";

export default function Footer({ data, openBrochure = false }) {
  return (
    <footer className="footer tw:p-5 tw:max-[479px]:p-2">
      <div className="container">
        <div className="footer-content-wrap tw:rounded-2xl tw:bg-ink tw:px-[3.75rem] tw:py-[3.125rem] tw:max-[991px]:px-10 tw:max-[767px]:px-5 tw:max-[767px]:py-8">
          <div className="footer-grid tw:mb-6 tw:flex tw:flex-wrap tw:items-start tw:justify-between tw:gap-x-6 tw:gap-y-10 tw:border-b tw:border-[#efffe5] tw:pb-[3.125rem]">
            <div
              className="footer-content-col tw:flex tw:w-full tw:max-w-[24.375rem] tw:flex-col tw:items-start tw:gap-4"
              id="w-node-e13f295f-e30f-5327-12ae-86719bffba73-9bffba6f"
            >
              <AppLink
                className="footer-brand w-inline-block tw:block"
                href={data.link}
              >
                <div className="footer-brand-wrap">
                  <img
                    alt={data.imageAlt}
                    className="footer-logo"
                    loading="lazy"
                    src={data.image}
                    width="847"
                    height="131"
                  />
                </div>
              </AppLink>
              <div className="max-w-18-rem tw:w-full tw:max-w-72">
                <p className="text-md primary-500">{data.description}</p>
              </div>
              <BrochureDownloadButton label={data.label} autoOpen={openBrochure} />
            </div>
            <div className="footer-links-col tw:flex tw:w-full tw:max-w-32 tw:flex-col tw:gap-[1.125rem]">
              <div className="footer-title tw:text-base tw:leading-[1.4] tw:font-semibold tw:text-white tw:uppercase">
                {data.text}
              </div>
              <div className="footer-links-wrap tw:flex tw:flex-col tw:gap-2.5">
                {data.items.map((item, index) => (
                  <AppLink
                    className="footer-link tw:text-base tw:leading-[1.6] tw:font-normal tw:text-[#d0d0d0] tw:no-underline"
                    href={item.link}
                    key={index}
                  >
                    {item.label}
                  </AppLink>
                ))}
              </div>
            </div>
            <div
              className="footer-content-link-col tw:flex tw:w-full tw:max-w-[18.5625rem] tw:flex-col tw:items-start tw:gap-4"
              id="w-node-e13f295f-e30f-5327-12ae-86719bffba73-9bffba6f"
            >
              <div className="footer-title tw:text-base tw:leading-[1.4] tw:font-semibold tw:text-white tw:uppercase">
                {data.text2}
              </div>
              <div className="footer-links-wrap tw:flex tw:flex-col tw:gap-2.5">
                {data.items2.map((item, index) => (
                  <AppLink
                    className="footer-link tw:text-base tw:leading-[1.6] tw:text-[#d0d0d0] tw:no-underline"
                    href={item.link}
                    key={index}
                  >
                    {item.label}
                  </AppLink>
                ))}
              </div>
              <div className="footer-title tw:text-base tw:leading-[1.4] tw:font-semibold tw:text-white tw:uppercase">
                {data.text3}
              </div>
              <div className="footer-links-wrap tw:flex tw:flex-col tw:gap-2.5">
                {data.items3.map((item, index) => (
                  <AppLink
                    className="footer-link tw:text-base tw:leading-[1.6] tw:text-[#d0d0d0] tw:no-underline"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                  >
                    {item.label}
                  </AppLink>
                ))}
              </div>
            </div>
            <div className="footer-links-col address tw:flex tw:w-full tw:max-w-[14.5625rem] tw:flex-col tw:gap-[1.125rem] tw:max-[767px]:max-w-full">
              <div className="footer-title tw:text-base tw:leading-[1.4] tw:font-semibold tw:text-white tw:uppercase">
                {data.text4}
              </div>
              <div className="footer-address-wrap tw:flex tw:items-start tw:gap-2.5">
                <Icon name="MapPin" />
                <div className="text-base primary-600">{data.text5}</div>
              </div>
              <div className="footer-address-wrap tw:flex tw:items-start tw:gap-2.5">
                <Icon name="Mail" />
                <div className="text-base primary-600">{data.text6}</div>
              </div>
              <div className="footer-address-wrap tw:flex tw:items-start tw:gap-2.5">
                <Icon name="Phone" />
                <div>
                  {data.items4.map((item, index) => (
                    <div className="text-base primary-600" key={index}>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="footer-grid tw:mb-6 tw:flex tw:flex-wrap tw:items-start tw:justify-between tw:gap-x-6 tw:gap-y-10 tw:border-b tw:border-[#efffe5] tw:pb-[3.125rem]">
            {data.items5.map((item, index) => (
              <div
                className="footer-content-link-col tw:flex tw:w-full tw:max-w-[18.5625rem] tw:flex-col tw:items-start tw:gap-4"
                id="w-node-e13f295f-e30f-5327-12ae-86719bffba73-9bffba6f"
                key={index}
              >
                <div className="footer-links-wrap tw:flex tw:flex-col tw:gap-2.5">
                  {item.items.map((item, index) => (
                    <AppLink
                      className="footer-link tw:text-base tw:leading-[1.6] tw:text-[#d0d0d0] tw:no-underline"
                      href={item.link}
                      key={index}
                    >
                      {item.label}
                    </AppLink>
                  ))}
                </div>
              </div>
            ))}
            <div
              className="footer-content-link-col tw:flex tw:w-full tw:max-w-[18.5625rem] tw:flex-col tw:items-start tw:gap-4"
              id="w-node-e13f295f-e30f-5327-12ae-86719bffba73-9bffba6f"
            >
              <div className="footer-links-wrap tw:flex tw:flex-col tw:gap-2.5">
                {data.items6.map((item, index) => (
                  <AppLink
                    className="footer-link tw:text-base tw:leading-[1.6] tw:text-[#d0d0d0] tw:no-underline"
                    href={item.link}
                    key={index}
                  >
                    {item.label}
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom tw:flex tw:items-center tw:justify-between tw:max-[767px]:flex-col tw:max-[767px]:gap-5 tw:max-[767px]:text-center">
            <div className="text-base medium primary-600 footer-icons-data tw:flex tw:items-center tw:gap-2.5">
              <AppLink
                href={data.link3}
                aria-label={data.socialLabels[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Linkedin" />
              </AppLink>
              <AppLink
                href={data.link4}
                aria-label={data.socialLabels[1]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Facebook" />
              </AppLink>
              <AppLink
                href={data.link5}
                aria-label={data.socialLabels[2]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Instagram" />
              </AppLink>
              <AppLink
                href={data.link6}
                aria-label={data.socialLabels[3]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Twitter" />
              </AppLink>
              <AppLink
                href={data.link7}
                aria-label={data.socialLabels[4]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Pin" />
              </AppLink>
              <AppLink
                href={data.link8}
                aria-label={data.socialLabels[5]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Youtube" />
              </AppLink>
              <span>{data.text7}</span>
            </div>
            <div className="text-lg semi-bold primary-600">
              {data.text8}
              <AppLink
                className="primary-900"
                href={data.link9}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.label2}
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
