import { requireRole } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import BlogEditor from "@/components/BlogEditor";
export default async function Page() {
  await requireRole(["admin", "staff"]);
  return (
    <>
      <PageHeader
        title="Create an article"
        description="Share helpful elevator advice with your customers."
        eyebrow="JOURNAL / NEW ARTICLE"
      />
      <BlogEditor />
    </>
  );
}
