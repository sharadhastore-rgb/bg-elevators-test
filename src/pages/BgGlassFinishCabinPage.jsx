import ContentSection from "@/components/shared/ProductDetailSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/bg-glass-finish-cabin.json";

export default function BgGlassFinishCabinPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
