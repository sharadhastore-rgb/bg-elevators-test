import Link from "next/link";
import { Plus, PenLine, BookOpen, Search } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Blog } from "@/lib/blogs";
import { Admin } from "@/lib/models";
import PageHeader from "@/components/PageHeader";

const formatDate = (value: Date | string | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "—";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string; deleted?: string }> }) {
  const actor = await requireAdmin();
  const params = await searchParams;
  await connectDb();
  const filter: any = {};
  if (["draft", "published"].includes(params.status || "")) filter.status = params.status;
  if (params.q) filter.title = { $regex: params.q.slice(0, 120).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  const requestedPage = Math.max(1, Number.parseInt(params.page || "1") || 1);
  const [result] = await Blog.aggregate([
    { $match: filter },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        posts: [
          { $sort: { updatedAt: -1, _id: -1 } },
          { $skip: (requestedPage - 1) * 12 },
          { $limit: 12 },
          {
            $project: {
              content: 0,
              structuredBody: 0,
              structuredHeadings: 0,
              additionalSections: 0,
              "cover.data": 0,
              "cover.thumbnailData": 0,
            },
          },
        ],
      },
    },
  ]).allowDiskUse(true);
  const total = result?.metadata?.[0]?.total || 0;
  const pages = Math.max(1, Math.ceil(total / 12));
  const page = Math.min(pages, requestedPage);
  const posts = requestedPage > pages && total
    ? await Blog.find(filter)
        .select("-content -structuredBody -structuredHeadings -additionalSections")
        .sort({ updatedAt: -1, _id: -1 })
        .skip((pages - 1) * 12)
        .limit(12)
        .lean()
    : result?.posts || [];
  const authorIds = posts
    .map((post: any) => String(post.createdBy || ""))
    .filter((id: string) => /^[a-f0-9]{24}$/i.test(id));
  const authors = authorIds.length ? await Admin.find({ _id: { $in: authorIds } }).select("name").lean() : [];
  const authorNames = new Map(authors.map((admin: any) => [String(admin._id), admin.name]));
  const canEdit = actor.role !== "viewer";
  const pageLink = (number: number) => `?${new URLSearchParams({ q: params.q || "", status: params.status || "", page: String(number) })}`;

  return <>
    <PageHeader title="Blog posts" description={`${total.toLocaleString("en-IN")} ${total === 1 ? "post" : "posts"}`} action={canEdit ? <Link href="/admin/blogs/new" className="button rounded-lg"><Plus size={17} />New post</Link> : undefined} />
    {params.deleted && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-4 text-emerald-800">Article deleted.</p>}

    <form className="mb-4 flex flex-wrap gap-2.5">
      <label className="relative min-w-0 basis-full sm:basis-[280px]">
        <span className="sr-only">Search titles</span>
        <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
        <input name="q" defaultValue={params.q} placeholder="Search title" className="h-11 w-full rounded-lg border border-admin-line bg-white pl-10 pr-4 text-sm outline-none focus:border-admin-blue focus:ring-4 focus:ring-admin-blue/10" />
      </label>
      <select aria-label="Filter status" name="status" defaultValue={params.status} className="h-11 min-w-40 rounded-lg border border-admin-line bg-white px-4 text-sm outline-none focus:border-admin-blue">
        <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>
      </select>
      <button className="button h-11 rounded-lg px-5">Search</button>
    </form>

    <section className="overflow-hidden rounded-xl border border-admin-line bg-white shadow-[0_6px_24px_#01203408]">
      <div className="hidden grid-cols-[minmax(300px,2fr)_minmax(110px,.65fr)_120px_100px_120px_44px] items-center gap-4 border-b border-admin-line bg-[#fbfcfd] px-4 py-3 text-[11px] font-semibold uppercase tracking-[.06em] text-admin-muted lg:grid">
        <span>Title</span><span>Author</span><span>Published</span><span>Status</span><span>Updated</span><span className="sr-only">Edit</span>
      </div>
      {posts.map((post: any) => <article key={String(post._id)} className="grid min-w-0 grid-cols-[minmax(0,1fr)_36px] gap-3 border-b border-admin-line px-4 py-3.5 last:border-b-0 lg:grid-cols-[minmax(300px,2fr)_minmax(110px,.65fr)_120px_100px_120px_44px] lg:items-center lg:gap-4">
        {canEdit ? (
          <Link
            href={`/admin/blogs/${post._id}/edit`}
            className="group flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-admin-blue/40"
            aria-label={`Open ${post.title}`}
          >
            {post.cover?.contentType ? <img src={`/api/blog-covers/${post._id}?size=thumb`} alt="" className="h-11 w-16 shrink-0 rounded border border-admin-line object-cover transition group-hover:border-admin-blue" /> : <span className="grid h-11 w-16 shrink-0 place-items-center rounded border border-admin-line bg-admin-surface text-admin-brand transition group-hover:border-admin-blue"><BookOpen size={18} /></span>}
            <div className="min-w-0"><h2 className="truncate text-sm font-semibold text-admin-navy transition group-hover:text-admin-brand group-hover:underline group-hover:underline-offset-2">{post.title}</h2><p className="mt-1 truncate text-xs text-admin-muted">{post.routePath || `/journal/${post.slug}`}</p></div>
          </Link>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            {post.cover?.contentType ? <img src={`/api/blog-covers/${post._id}?size=thumb`} alt="" className="h-11 w-16 shrink-0 rounded border border-admin-line object-cover" /> : <span className="grid h-11 w-16 shrink-0 place-items-center rounded border border-admin-line bg-admin-surface text-admin-brand"><BookOpen size={18} /></span>}
            <div className="min-w-0"><h2 className="truncate text-sm font-semibold text-admin-navy">{post.title}</h2><p className="mt-1 truncate text-xs text-admin-muted">{post.routePath || `/journal/${post.slug}`}</p></div>
          </div>
        )}
        <span className="hidden truncate text-sm text-admin-ink lg:block">{authorNames.get(String(post.createdBy)) || "BG Elevators"}</span>
        <time className="hidden text-sm text-admin-ink lg:block">{formatDate(post.publishedAt)}</time>
        <span className={`hidden w-fit rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide lg:inline-flex ${post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>{post.status}</span>
        <time className="hidden text-sm text-admin-muted lg:block">
          {formatDate(
            post.importSource === "legacy-json-v1" &&
              String(post.updatedBy || "") === "legacy-import"
              ? post.publishedAt
              : post.updatedAt,
          )}
        </time>
        {canEdit ? <Link href={`/admin/blogs/${post._id}/edit`} aria-label={`Edit ${post.title}`} className="grid size-9 place-items-center rounded-md text-admin-brand transition hover:bg-admin-surface"><PenLine size={16} /></Link> : <span />}
        <div className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 pl-[76px] text-xs text-admin-muted lg:hidden">
          <span>{authorNames.get(String(post.createdBy)) || "BG Elevators"}</span><span>•</span><span>{formatDate(post.publishedAt)}</span><span className={post.status === "published" ? "text-emerald-700" : "text-slate-700"}>{post.status}</span>
        </div>
      </article>)}
      {!posts.length && <div className="p-14 text-center"><BookOpen className="mx-auto mb-3 text-admin-brand" /><h2>{params.q || params.status ? "No matching posts" : "No posts yet"}</h2><p className="mt-2 text-sm text-admin-muted">{params.q || params.status ? "Try another title or status." : "Create your first blog post."}</p></div>}
    </section>

    {pages > 1 && <nav aria-label="Blog post pages" className="mt-5 flex items-center justify-between">
      {page > 1 ? <Link href={pageLink(page - 1)} className="button button-secondary rounded-lg">Previous</Link> : <span />}
      <span className="text-sm text-admin-muted">Page {page} of {pages}</span>
      {page < pages ? <Link href={pageLink(page + 1)} className="button button-secondary rounded-lg">Next</Link> : <span />}
    </nav>}
  </>;
}
