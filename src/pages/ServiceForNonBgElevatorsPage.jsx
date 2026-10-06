import ContentSection from "@/components/servicefornonbgelevatorspage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/service-for-non-bg-elevators.json";

export default function ServiceForNonBgElevatorsPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
