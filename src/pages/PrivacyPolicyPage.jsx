import ContentSection from "@/components/privacypolicypage/ContentSection";
import data from "@/data/pages/privacy-policy.json";

export default function PrivacyPolicyPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
    </>
  );
}
