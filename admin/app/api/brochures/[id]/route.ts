import { getSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Brochure } from "@/lib/models";
import { validId } from "@/lib/validation";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  if (!validId(id)) return new Response("Not found", { status: 404 });
  await connectDb();
  const brochure: any = await Brochure.findById(id)
    .select("+data filename contentType")
    .lean();
  if (!brochure?.data) return new Response("Not found", { status: 404 });
  const filename = String(brochure.filename || "brochure.pdf").replace(
    /[^\w. -]/g,
    "_",
  );
  const source = brochure.data.buffer || brochure.data;
  const bytes = Buffer.from(source);
  const length = Number(brochure.data.position || bytes.length);
  return new Response(new Uint8Array(bytes.subarray(0, length)), {
    headers: {
      "Content-Type": brochure.contentType || "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
