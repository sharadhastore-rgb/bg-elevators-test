import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import RelatedArticlesSection from "@/components/blogdetailpage/RelatedArticlesSection";

const components = {
  TestimonialsSection,
  ConsultationSection,
  RelatedArticlesSection,
};

export default function AdditionalSections({ sections }) {
  return sections.map((section, index) => {
    const Component = components[section.component];
    return <Component key={index} data={section.data} />;
  });
}
