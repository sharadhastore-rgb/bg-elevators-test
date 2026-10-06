import ContentSection from "@/components/projectspage/ContentSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/projects.json";

export default function ProjectsPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <TestimonialsSection data={data.section2} />
      <ConsultationSection data={data.section3} />
    </>
  );
}
