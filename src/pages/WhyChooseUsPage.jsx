import ContentSection from "@/components/whychooseuspage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import ApplicationModalSection from "@/components/shared/EnquiryModalSection";
import data from "@/data/pages/why-choose-us.json";

export default function WhyChooseUsPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
      <ApplicationModalSection data={data.section3} />
    </>
  );
}
