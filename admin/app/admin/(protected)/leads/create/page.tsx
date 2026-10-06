import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import RecordForm from "@/components/RecordForm";
import { requireRole } from "@/lib/auth";
export default async function CreateLeadPage() {
  await requireRole(["admin", "staff"]);
  return (
    <>
      <Link className="back-link" href="/admin/leads">
        <ArrowLeft size={16} />
        Back to leads
      </Link>
      <PageHeader
        title="Add lead"
        description="Record a phone call, WhatsApp enquiry or walk-in."
      />
      <RecordForm />
    </>
  );
}
