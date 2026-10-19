import { getSession } from "@/lib/auth";
import { uploadConfiguratorImage } from "@/lib/imagekit";
import sharp from "sharp";
import path from "node:path";
import { readFile } from "node:fs/promises";

const imageTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return new Response("Not found", { status: 404 });
  const catalog = new URL(request.url).searchParams.get("catalog") || "";
  const segments = catalog.split("/").filter(Boolean);
  if (
    !segments.length ||
    segments.some((segment) => !/^[a-zA-Z0-9._-]+$/.test(segment))
  )
    return new Response("Not found", { status: 404 });

  const root = path.resolve(
    process.cwd(),
    "..",
    "public",
    "images",
    "configurator",
  );
  const file = path.resolve(root, ...segments);
  const contentType = imageTypes[path.extname(file).toLowerCase()];
  if (!file.startsWith(`${root}${path.sep}`) || !contentType)
    return new Response("Not found", { status: 404 });

  try {
    return new Response(await readFile(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

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
      file = form.get("image"),
      category = String(form.get("category") || "");
    const folders: Record<string, string> = {
      wallDesign: "cabin-appearance",
      controlPanel: "control-panels",
      ceilingDesign: "ceilings",
      floorDesign: "floors",
      accessory: "accessory",
    };
    const folder = folders[category];
    if (!folder)
      return Response.json(
        { message: "Choose a valid estimator catalogue." },
        { status: 400 },
      );
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
    const image = await uploadConfiguratorImage(
      data,
      file.name.replace(/\.[^.]+$/, ".webp"),
      folder,
    );
    return Response.json({ image });
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Image upload failed. Choose a valid JPG, PNG or WebP." },
      { status: 400 },
    );
  }
}
