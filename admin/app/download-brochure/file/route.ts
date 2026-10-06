import { readFile } from "node:fs/promises";
import path from "node:path";
import { connectDb } from "@/lib/db";
import { Brochure } from "@/lib/models";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await connectDb();
    const brochure: any = await Brochure.findOne({ active: true })
      .sort({ createdAt: -1 })
      .select("+data filename contentType")
      .lean();
    if (brochure?.data)
      return download(
        mongoBytes(brochure.data),
        String(brochure.filename || "BG-Elevators-Brochure.pdf").replace(
          /[^\w. -]/g,
          "_",
        ),
        brochure.contentType,
      );
  } catch {}
  try {
    const bytes = await readFile(
      path.resolve(process.cwd(), "..", "public", "images", "brochure.pdf"),
    );
    return download(bytes, "BG-Elevators-Brochure.pdf");
  } catch {
    return new Response("Brochure not found", { status: 404 });
  }
}
function mongoBytes(value: any) {
  if (Buffer.isBuffer(value)) return value;
  const bytes = Buffer.from(value?.buffer || value);
  return bytes.subarray(0, Number(value?.position || bytes.length));
}
function download(
  bytes: Uint8Array,
  filename: string,
  contentType = "application/pdf",
) {
  const body = new Uint8Array(bytes.byteLength);
  body.set(bytes);
  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
