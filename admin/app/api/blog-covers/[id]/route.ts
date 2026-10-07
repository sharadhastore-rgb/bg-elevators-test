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
  const post = (await Blog.findById(id)
    .select(
      thumbnail
        ? "+cover.thumbnailData cover.thumbnailContentType cover.contentType"
        : "+cover.data cover.contentType",
    )
    .lean()) as any;
  if (!post) return new Response("Not found", { status: 404 });

  let data = thumbnail ? post.cover?.thumbnailData : post.cover?.data;
  let contentType = thumbnail
    ? post.cover?.thumbnailContentType || "image/webp"
    : post.cover?.contentType;

  if (thumbnail && !data) {
    const original = (await Blog.findById(id)
      .select("+cover.data cover.contentType")
      .lean()) as any;
    if (!original?.cover?.data)
      return new Response("Not found", { status: 404 });

    data = await sharp(original.cover.data)
      .resize(160, 100, { fit: "cover", position: "centre" })
      .webp({ quality: 72 })
      .toBuffer();
    contentType = "image/webp";

    await Blog.updateOne(
      { _id: id, "cover.thumbnailData": { $exists: false } },
      {
        $set: {
          "cover.thumbnailData": data,
          "cover.thumbnailContentType": contentType,
        },
      },
    );
  }

  if (!data || !contentType) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
