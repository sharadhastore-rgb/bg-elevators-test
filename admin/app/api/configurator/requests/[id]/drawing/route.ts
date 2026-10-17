import { getSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ConfiguratorRequest } from "@/lib/configurator";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSession()))
    return new Response("Access denied", { status: 401 });
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id))
    return new Response("Not found", { status: 404 });
  await connectDb();
  const record = (await ConfiguratorRequest.findById(id).select(
    "+drawing.data",
  )) as any;
  if (!record?.drawing?.data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(record.drawing.data), {
    headers: {
      "Content-Type": record.drawing.contentType,
      "Content-Disposition": `attachment; filename="${record.drawing.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox; default-src 'none'",
    },
  });
}
