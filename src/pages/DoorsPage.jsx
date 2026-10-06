import ContentSection from "@/components/doorspage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/doors.json";

export default function DoorsPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
