"use client";
import { useActionState, useEffect, useState } from "react";
import { Eye, ImagePlus, ArrowUpRight, Search } from "lucide-react";
import { saveBlog, deleteBlog } from "@/app/admin/blog-actions";
import SubmitButton from "./SubmitButton";
import RichTextEditor from "./RichTextEditor";
export default function BlogEditor({
  post,
  canDelete = false,
}: {
  post?: any;
  canDelete?: boolean;
}) {
  const [state, action] = useActionState(
    saveBlog.bind(null, post?._id || null),
    {},
  );
  const [deletion, remove] = useActionState(
    deleteBlog.bind(null, post?._id || ""),
    {},
  );
  const [title, setTitle] = useState(post?.title || ""),
    [slug, setSlug] = useState(post?.slug || ""),
    [content, setContent] = useState(post?.content || "");
  const [confirm, setConfirm] = useState(false),
    [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [cover, setCover] = useState(
    post?.cover?.contentType
      ? `/api/blog-covers/${post._id}?v=${encodeURIComponent(post.updatedAt || post.__v || 0)}`
      : "",
  );
  const normalizeSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/^https?:\/\/[^/]+\//, "")
      .replace(/\.html?$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  useEffect(
    () => () => {
      if (cover.startsWith("blob:")) URL.revokeObjectURL(cover);
    },
    [cover],
  );
  const field =
    "mt-2 block w-full rounded-xl border border-admin-line bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-admin-blue focus:ring-4 focus:ring-admin-blue/10";
  return (
    <>
      <form
        action={action}
        className="blog-editor grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <input type="hidden" name="version" value={post?.__v ?? 0} />
        <div className="blog-editor-toolbar xl:col-span-2">
          <div>
            <span>Editing article</span>
            <strong>{title || "Untitled article"}</strong>
          </div>
          <div>
            {post?.status === "published" && (
              <a className="button button-secondary" href={`${(process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:5173").replace(/\/$/, "")}${post.routePath || `/journal/${post.slug}`}`} target="_blank" rel="noreferrer">
                <Eye size={16} /> View
              </a>
            )}
            <SubmitButton className="button" pendingText="Saving…">Save changes</SubmitButton>
          </div>
        </div>
        <nav className="blog-editor-tabs xl:col-span-2" aria-label="Article editor sections">
          <button type="button" className={activeTab === "content" ? "is-active" : ""} onClick={() => setActiveTab("content")}>Content</button>
          <button type="button" className={activeTab === "seo" ? "is-active" : ""} onClick={() => setActiveTab("seo")}>SEO</button>
        </nav>
        <div className={`blog-editor-main space-y-6 rounded-2xl border border-white bg-white/90 p-5 shadow-[0_12px_45px_#01203408] sm:p-8 ${activeTab !== "content" ? "hidden" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg">Article content</h2>
            <span className="rounded-full bg-admin-surface px-3 py-1.5 text-xs font-medium text-admin-brand">
              Visual editing
            </span>
          </div>
          <label className="block text-sm font-medium">
            Title
            <input
              className={field}
              name="title"
              value={title}
              required
              minLength={5}
              maxLength={160}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!post)
                  setSlug(normalizeSlug(e.target.value));
              }}
            />
          </label>
          <label className="block text-sm font-medium">
            Article URL
            <span className="mt-1 block text-xs font-normal text-admin-muted">
              {post?.routePath || `/journal/${slug || "your-article-title"}`}
              {post ? " · URL stays fixed to protect links." : ""}
            </span>
            <input
              className={field}
              name="slug"
              value={slug}
              onChange={(e) => setSlug(normalizeSlug(e.target.value))}
              readOnly={!!post}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              maxLength={120}
            />
          </label>
          <label className="block text-sm font-medium">
            Summary
            <textarea
              className={field}
              name="excerpt"
              defaultValue={post?.excerpt}
              required
              minLength={20}
              maxLength={320}
              rows={3}
            />
          </label>
          <div>
            <label
              className="block text-sm font-medium"
              htmlFor="article-content"
            >
              Article body
            </label>
            <p className="mt-2 text-xs leading-6 text-admin-muted">
              Select text and use the toolbar to format your article.
            </p>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>
        <aside className={`space-y-5 xl:sticky xl:top-6 ${activeTab !== "content" ? "hidden" : ""}`}>
          <div className="blog-editor-side-card space-y-5 rounded-2xl border border-white bg-white/90 p-5 shadow-[0_12px_45px_#01203408]">
            <h2>Publishing</h2>
            <label className="block text-sm font-medium">
              Status
              <select
                className={field}
                name="status"
                defaultValue={post?.status || "draft"}
              >
                <option value="draft">Draft — only visible in CMS</option>
                <option value="published">
                  Published — visible on website
                </option>
              </select>
            </label>
            <input
              type="hidden"
              name="category"
              value={post?.category || "Elevator insights"}
            />
            <p className="text-xs leading-6 text-admin-muted">
              Saving as published updates the website immediately. Choose draft
              to remove an article from public view.
            </p>
            {state.error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {state.error}
              </p>
            )}
            <SubmitButton
              className="button w-full rounded-xl"
              pendingText="Saving article…"
            >
              Save article
            </SubmitButton>
            {post?.status === "published" && (
              <a
                className="flex items-center justify-center gap-2 text-sm text-admin-brand"
                href={`${(process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:5173").replace(/\/$/, "")}${post.routePath || `/journal/${post.slug}`}`}
                target="_blank"
                rel="noreferrer"
              >
                View published article <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <div className="blog-editor-side-card space-y-4 rounded-2xl border border-white bg-white/90 p-5">
            <h2 className="flex items-center gap-2">
              <ImagePlus size={17} />
              Cover image
            </h2>
            {cover && (
              <img
                src={cover}
                alt="Selected cover"
                className="aspect-video w-full rounded-xl object-cover"
              />
            )}
            <label className="block text-sm">
              JPG, PNG or WebP · up to 5 MB
              <input
                type="file"
                name="cover"
                accept="image/jpeg,image/png,image/webp"
                className="mt-3 w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-admin-surface file:p-2 file:text-admin-brand"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setCover(URL.createObjectURL(f));
                }}
              />
            </label>
            <label className="block text-sm font-medium">
              Image description
              <input
                className={field}
                name="imageAlt"
                defaultValue={post?.imageAlt}
                maxLength={180}
              />
            </label>
          </div>
        </aside>
        <section className={`blog-editor-seo xl:col-span-2 ${activeTab !== "seo" ? "hidden" : ""}`}>
          <div className="blog-editor-side-card seo-settings rounded-2xl border border-white bg-white/90 p-6 sm:p-8">
            <div className="seo-settings-heading">
              <span className="seo-settings-icon"><Search size={17} /></span>
              <div>
                <h2>Search engine settings</h2>
                <p>Control how this article appears in search results.</p>
              </div>
            </div>
            <div className="seo-search-preview">
              <span>Search preview</span>
              <div>
                <small>{`${(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.bgelevators.com").replace(/\/$/, "")}${post?.routePath || `/journal/${slug || "your-article-title"}`}`}</small>
                <strong>{post?.seoTitle || title || "Article title"}</strong>
                <p>{post?.seoDescription || post?.excerpt || "Add an SEO description to preview how this article may appear in search results."}</p>
              </div>
            </div>
            <label className="mt-5 block text-sm font-medium">
              SEO title (optional)
              <input
                className={field}
                name="seoTitle"
                defaultValue={post?.seoTitle}
                maxLength={70}
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              SEO description (optional)
              <textarea
                className={field}
                name="seoDescription"
                defaultValue={post?.seoDescription}
                maxLength={170}
                rows={5}
              />
            </label>
          </div>
        </section>
      </form>
      {post && canDelete && (
        <div className="mt-8 rounded-2xl border border-red-100 bg-white/70 p-5">
          {!confirm ? (
            <button
              type="button"
              className="text-sm font-medium text-red-700"
              onClick={() => setConfirm(true)}
            >
              Delete this article
            </button>
          ) : (
            <form action={remove} className="flex flex-wrap items-center gap-4">
              <input type="hidden" name="confirm" value="delete" />
              <p className="text-sm">
                Permanently delete “{post.title}” and its cover image?
              </p>
              <SubmitButton className="button button-danger">
                Delete permanently
              </SubmitButton>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
              {deletion.error && <p role="alert">{deletion.error}</p>}
            </form>
          )}
        </div>
      )}
    </>
  );
}
