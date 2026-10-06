import ContentSection from "@/components/featurespage/ContentSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/features.json";

export default function FeaturesPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <TestimonialsSection data={data.section2} />
      <ConsultationSection data={data.section3} />
    </>
  );
}
