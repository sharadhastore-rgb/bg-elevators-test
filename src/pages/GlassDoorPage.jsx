import ContentSection from "@/components/shared/ProductDetailSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/glass-door.json";

export default function GlassDoorPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
