import { getSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ConfiguratorAsset } from "@/lib/configurator";
import sharp from "sharp";
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return Response.json({ message: "Access denied." }, { status: 403 });
  // Require a same-origin browser request before storing any upload.
  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try {
    sameOrigin =
      !!origin && new URL(origin).host === request.headers.get("host");
  } catch {}
  if (!sameOrigin)
    return Response.json({ message: "Invalid origin." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 3 * 1024 * 1024)
    return Response.json(
      { message: "Maximum image size is 2 MB." },
      { status: 413 },
    );
  try {
    const form = await request.formData(),
      file = form.get("image");
    if (!(file instanceof File) || !file.size || file.size > 2 * 1024 * 1024)
      return Response.json(
        { message: "Choose a JPG, PNG or WebP smaller than 2 MB." },
        { status: 400 },
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    const isJpeg = bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
    const isPng = bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isWebp =
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP";
    if (!isJpeg && !isPng && !isWebp)
      return Response.json(
        { message: "Choose a valid JPG, PNG or WebP image." },
        { status: 400 },
      );
    const data = await sharp(bytes, {
      limitInputPixels: 25000000,
    })
      .resize(1000, 1200, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await connectDb();
    const asset = await ConfiguratorAsset.create({
      data,
      contentType: "image/webp",
    });
    return Response.json({ image: `/api/configurator/assets/${asset._id}` });
  } catch {
    return Response.json(
      { message: "Image upload failed. Choose a valid JPG, PNG or WebP." },
      { status: 400 },
    );
  }
}
