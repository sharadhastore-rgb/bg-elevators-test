import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Blog } from "@/lib/blogs";
import PageHeader from "@/components/PageHeader";
import BlogEditor from "@/components/BlogEditor";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const actor = await requireRole(["admin", "staff"]);
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) notFound();
  await connectDb();
  const post = await Blog.findById(id).lean();
  if (!post) notFound();
  const { saved } = await searchParams;
  return (
    <>
      <PageHeader
        title="Edit article"
        description="Keep your guidance useful, accurate and up to date."
        eyebrow="JOURNAL / EDIT ARTICLE"
      />
      {saved && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          Article saved successfully.
        </p>
      )}
      <BlogEditor
        key={JSON.stringify(post)}
        post={JSON.parse(JSON.stringify(post))}
        canDelete={actor.role === "admin"}
      />
    </>
  );
}
