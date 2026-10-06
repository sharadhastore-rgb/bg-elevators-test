import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RecordForm from "@/components/RecordForm";
import PageHeader from "@/components/PageHeader";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { CareerApplication } from "@/lib/models";
import { plain } from "@/lib/format";
import { validId } from "@/lib/validation";
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin", "staff"]);
  const { id } = await params;
  if (!validId(id)) notFound();
  await connectDb();
  const doc = await CareerApplication.findById(id).lean();
  if (!doc) notFound();
  const record: any = plain(doc);
  return (
    <>
      <Link className="back-link" href={`/admin/careers/${id}`}>
        <ArrowLeft size={16} />
        Back to details
      </Link>
      <PageHeader
        title="Edit application"
        description={`Update details for ${record.name}. Changes are recorded in Activity.`}
      />
      <RecordForm kind="career" record={record} />
    </>
  );
}
