import { getSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Blog } from "@/lib/blogs";
import sharp from "sharp";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession()))
    return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id))
    return new Response("Not found", { status: 404 });
  await connectDb();
  const thumbnail = new URL(request.url).searchParams.get("size") === "thumb";
  const post = await Blog.findById(id).select(
    thumbnail ? "+cover.thumbnailData +cover.data" : "+cover.data",
  );
  if (!post?.cover?.data) return new Response("Not found", { status: 404 });
  const generatedThumbnail = thumbnail && !post.cover.thumbnailData
    ? await sharp(post.cover.data)
        .resize(160, 100, { fit: "cover", position: "centre" })
        .webp({ quality: 72 })
        .toBuffer()
    : null;
  const data = post.cover.thumbnailData || generatedThumbnail || post.cover.data;
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": thumbnail
        ? post.cover.thumbnailContentType || "image/webp"
        : post.cover.contentType,
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
