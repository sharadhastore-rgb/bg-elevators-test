import ContentSection from "@/components/shared/ProductDetailSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/gold-finish.json";

export default function GoldFinishPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
