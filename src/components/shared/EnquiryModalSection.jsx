import { EnquiryForm, EnquiryModal } from "@/components/ui";

export default function EnquiryModalSection({ data }) {
  return (
    <EnquiryModal>
      <EnquiryForm data={data.form} />
    </EnquiryModal>
  );
}
