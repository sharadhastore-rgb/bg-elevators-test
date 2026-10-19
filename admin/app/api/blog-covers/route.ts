import { getSession } from "@/lib/auth";
import { uploadImageKit } from "@/lib/imagekit";
import sharp from "sharp";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !["admin", "staff"].includes(session.role))
    return Response.json({ message: "Access denied." }, { status: 403 });
  const origin = request.headers.get("origin");
  try {
    if (!origin || new URL(origin).host !== request.headers.get("host"))
      return Response.json({ message: "Invalid origin." }, { status: 403 });
  } catch {
    return Response.json({ message: "Invalid origin." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") || 0) > 6 * 1024 * 1024)
    return Response.json({ message: "Maximum image size is 5 MB." }, { status: 413 });

  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024)
      return Response.json({ message: "Choose an image smaller than 5 MB." }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const image = sharp(bytes, { limitInputPixels: 30_000_000 });
    const metadata = await image.metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format))
      return Response.json({ message: "Choose a valid JPG, PNG or WebP image." }, { status: 400 });
    const data = await image
      .resize(1800, 1400, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer();
    const url = await uploadImageKit(
      data,
      file.name.replace(/\.[^.]+$/, ".webp"),
      "blogs/content",
      "bg-elevators,blog,content",
    );
    return Response.json({ url });
  } catch (error: any) {
    return Response.json({ message: error.message || "Image upload failed." }, { status: 400 });
  }
}
