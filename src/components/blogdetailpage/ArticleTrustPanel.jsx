import { businessProfile } from "@/data/businessProfile";
const sources = [
  [
    "BIS — lift safety rules, IS 17900 (Part 1):2022",
    "https://standards.bis.gov.in/website/standard-details?encryptedId=eyJpdiI6IktKUlkrZUkyN3ZTdkdzUXRUcElnT1E9PSIsInZhbHVlIjoiRTFqZmNhc0hKTW1Uc3JvcCtheUROQT09IiwibWFjIjoiYWQ1Yzk1MzNmNGM1MjZmNmZjODE5ZDU1OGQ1YjEzYmRhNDJmYjg5OWE1MzEyNWFlYTNiMjZlMWFlMjNiNzIyYyIsInRhZyI6IiJ9",
  ],
  [
    "BIS — National Building Code of India",
    "https://www.bis.gov.in/standards/national-building-code/?lang=en",
  ],
  [
    "Central Electricity Authority — electrical safety",
    "https://cea.nic.in/about-cei/?lang=en",
  ],
];
export default function ArticleTrustPanel() {
  return (
    <aside
      className="tw:mt-10 tw:rounded-xl tw:border tw:border-[#ded6c8] tw:bg-[#faf7f0] tw:p-[22px] tw:text-[#4d423b]"
      aria-label="Editorial and technical information"
    >
      <div className="tw:mb-2.5 tw:grid tw:grid-cols-[140px_1fr] tw:gap-3 tw:max-[479px]:grid-cols-1 tw:max-[479px]:gap-1">
        <strong>Technical review</strong>
        <span>{businessProfile.technicalReviewer}</span>
      </div>
      <div className="tw:mb-2.5 tw:grid tw:grid-cols-[140px_1fr] tw:gap-3 tw:max-[479px]:grid-cols-1 tw:max-[479px]:gap-1">
        <strong>Service area</strong>
        <span>{businessProfile.serviceArea}</span>
      </div>
      <div className="tw:mb-2.5 tw:grid tw:grid-cols-[140px_1fr] tw:gap-3 tw:max-[479px]:grid-cols-1 tw:max-[479px]:gap-1">
        <strong>Official references</strong>
        <ul className="tw:m-0 tw:list-disc tw:pl-[18px]">
          {sources.map(([label, href]) => (
            <li key={href}>
              <a
                className="tw:text-[#0877ba] tw:underline tw:underline-offset-2"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="tw:mt-3.5 tw:mb-0 tw:text-[13px] tw:leading-[1.6]">
        Requirements vary by site and authority. Confirm current standards and
        approvals for each project.
      </p>
    </aside>
  );
}
