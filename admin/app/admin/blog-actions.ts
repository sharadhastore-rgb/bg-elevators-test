"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Blog } from "@/lib/blogs";
import sharp from "sharp";
import { validateBlog } from "@/lib/blog";
export type BlogState = { error?: string };
export async function saveBlog(
  id: string | null,
  _state: BlogState,
  form: FormData,
): Promise<BlogState> {
  const actor = await requireRole(["admin", "staff"]);
  try {
    const data = validateBlog(Object.fromEntries(form));
    await connectDb();
    const post =
      id && /^[a-f0-9]{24}$/i.test(id)
        ? await Blog.findById(id)
        : id
          ? null
          : new Blog({ createdBy: actor.id });
    if (!post) return { error: "Article not found." };
    if (id && String(post.__v) !== form.get("version"))
      return {
        error:
          "This article was changed in another session. Reload before saving.",
      };
    if (id && post.slug !== data.slug)
      return {
        error: "The URL is fixed after creation to preserve existing links.",
      };
    const cover = form.get("cover");
    if (cover instanceof File && cover.size) {
      if (cover.size > 5 * 1024 * 1024)
        return { error: "Choose a cover smaller than 5 MB." };
      const bytes = Buffer.from(await cover.arrayBuffer());
      const mime = bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
        ? "image/jpeg"
        : bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          ? "image/png"
          : bytes.toString("ascii", 0, 4) === "RIFF" &&
              bytes.toString("ascii", 8, 12) === "WEBP"
            ? "image/webp"
            : null;
      if (!mime) return { error: "Choose a valid JPG, PNG or WebP image." };
      const thumbnailData = await sharp(bytes)
        .resize(160, 100, { fit: "cover", position: "centre" })
        .webp({ quality: 72 })
        .toBuffer();
      post.cover = {
        data: bytes,
        contentType: mime,
        thumbnailData,
        thumbnailContentType: "image/webp",
      };
    }
    if (data.status === "published" && !post.cover?.contentType)
      return { error: "Upload a cover image before publishing." };
    const contentChanged = id && post.content !== data.content;
    Object.assign(post, data, { updatedBy: actor.id });
    if (contentChanged) {
      post.structuredBody = undefined;
      post.structuredHeadings = undefined;
      post.additionalSections = undefined;
    }
    if (data.status === "published" && !post.publishedAt)
      post.publishedAt = new Date();
    await post.save();
  } catch (error: any) {
    return {
      error:
        error.code === 11000
          ? "This URL slug already exists. Choose another."
          : error.name === "VersionError"
            ? "Someone else updated this article. Reload before saving."
            : error.name === "MongooseServerSelectionError"
              ? "Database unavailable. Try again."
              : error.message || "Unable to save article.",
    };
  }
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}
export async function deleteBlog(
  id: string,
  _state: BlogState,
  form: FormData,
): Promise<BlogState> {
  await requireRole(["admin"]);
  if (form.get("confirm") !== "delete") return { error: "Confirm deletion." };
  try {
    await connectDb();
    if (!/^[a-f0-9]{24}$/i.test(id)) return { error: "Invalid article." };
    await Blog.findByIdAndDelete(id);
  } catch {
    return { error: "Unable to delete. Try again." };
  }
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs?deleted=1");
}
