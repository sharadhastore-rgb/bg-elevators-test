import ContentSection from "@/components/clientpage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import ApplicationModalSection from "@/components/shared/EnquiryModalSection";
import data from "@/data/pages/client.json";

export default function ClientPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
      <ApplicationModalSection data={data.section3} />
    </>
  );
}
