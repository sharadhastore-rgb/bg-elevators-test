import VacanciesSection from "@/components/careerpage/VacanciesSection";
import BenefitsSection from "@/components/careerpage/BenefitsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import ApplicationModalSection from "@/components/shared/EnquiryModalSection";
import data from "@/data/pages/career.json";

export default function CareerPage() {
  return (
    <>
      <VacanciesSection data={data.vacanciesSection} />
      <BenefitsSection data={data.benefitsSection} />
      <ConsultationSection data={data.consultationSection} />
      <ApplicationModalSection data={data.applicationModalSection} />
    </>
  );
}
