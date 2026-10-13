import StorySection from "@/components/aboutuspage/StorySection";
import MissionSection from "@/components/aboutuspage/MissionSection";
import JourneySection from "@/components/aboutuspage/JourneySection";
import ElevatorStackedGallery from "@/components/aboutuspage/stacked-gallery/ElevatorStackedGallery";
import ProcessSection from "@/components/shared/ProcessSection";
import MotionShowcaseSection from "@/components/homepage/MotionShowcaseSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/about-us.json";

export default function AboutUsPage() {
  return (
    <>
      <StorySection data={data.storySection} />
      <JourneySection />
      <MissionSection data={data.missionSection} />
      <ElevatorStackedGallery />
      <MotionShowcaseSection />
      <ProcessSection data={data.processSection} />
      <TestimonialsSection data={data.testimonialsSection} />
      <ConsultationSection data={data.consultationSection} />
    </>
  );
}
