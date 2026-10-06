import ContentSection from "@/components/breakdownandemergencyrepairspage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/breakdown-and-emergency-repairs.json";

export default function BreakdownAndEmergencyRepairsPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
