import ContentSection from "@/components/shared/ProductDetailSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/rose-gold-finish.json";

export default function RoseGoldFinishPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
