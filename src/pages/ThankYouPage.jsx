import ContentSection from "@/components/thankyoupage/ContentSection";
import data from "@/data/pages/thank-you.json";

export default function ThankYouPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
    </>
  );
}
