import { notFound } from "next/navigation";
import RecordDetails from "@/components/RecordDetails";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Activity, Lead } from "@/lib/models";
import { plain } from "@/lib/format";
import { validId } from "@/lib/validation";
export default async function Details({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string }>;
}) {
  const session = await requireAdmin(),
    { id } = await params;
  if (!validId(id)) notFound();
  await connectDb();
  const [doc, activity] = await Promise.all([
    Lead.findById(id).lean(),
    Activity.find({ entityType: "lead", entityId: id })
      .sort({ createdAt: -1 })
      .lean(),
  ]);
  if (!doc) notFound();
  const query = await searchParams;
  return (
    <RecordDetails
      kind="lead"
      record={plain(doc)}
      activities={plain(activity)}
      role={session.role}
      {...query}
    />
  );
}
