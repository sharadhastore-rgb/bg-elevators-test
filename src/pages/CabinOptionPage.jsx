import ContentSection from "@/components/cabinoptionpage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/cabin-option.json";

export default function CabinOptionPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
