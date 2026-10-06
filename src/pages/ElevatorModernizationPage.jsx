import ContentSection from "@/components/elevatormodernizationpage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/elevator-modernization.json";

export default function ElevatorModernizationPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
