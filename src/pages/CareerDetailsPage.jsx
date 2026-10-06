import ContentSection from "@/components/careerdetailspage/ContentSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/career-details.json";

export default function CareerDetailsPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <ConsultationSection data={data.section2} />
    </>
  );
}
