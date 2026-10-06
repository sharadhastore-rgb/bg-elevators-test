import ContentSection from "@/components/amcandservicemaintencepage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/amc-and-service-maintence.json";

export default function AmcAndServiceMaintencePage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
