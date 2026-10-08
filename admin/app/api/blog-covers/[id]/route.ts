import { getSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Blog } from "@/lib/blogs";
import sharp from "sharp";

function toBuffer(value: unknown): Buffer | null {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (
    typeof value === "object" &&
    "value" in value &&
    typeof (value as { value?: unknown }).value === "function"
  ) {
    const bytes = (value as { value: (copy?: boolean) => Uint8Array }).value(
      true,
    );
    return Buffer.from(bytes);
  }
  return null;
}

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

  let data = toBuffer(thumbnail ? post.cover?.thumbnailData : post.cover?.data);
  let contentType = thumbnail
    ? post.cover?.thumbnailContentType || "image/webp"
    : post.cover?.contentType;

  if (thumbnail && !data) {
    const original = (await Blog.findById(id)
      .select("+cover.data cover.contentType")
      .lean()) as any;
    const originalData = toBuffer(original?.cover?.data);
    if (!originalData)
      return new Response("Not found", { status: 404 });

    data = await sharp(originalData)
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
      // The UI appends the post version to this URL, so an edited cover gets
      // a new URL while unchanged thumbnails can stay in the browser cache.
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
