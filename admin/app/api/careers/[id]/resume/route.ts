import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { CareerApplication } from "@/lib/models";
import { audit } from "@/lib/mutations";
import { safeUrl } from "@/lib/format";
import { validId } from "@/lib/validation";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  const { id } = await params;
  if (!validId(id))
    return new NextResponse("Resume not found", { status: 404 });
  await connectDb();
  const career = await CareerApplication.findById(id).select("+resume.data");
  if (!career) return new NextResponse("Resume not found", { status: 404 });
  const external = safeUrl(career.resume?.externalUrl);
  const download = new URL(request.url).searchParams.get("download") === "1";
  if (!career.resume?.data && !external)
    return new NextResponse("Resume not found", { status: 404 });
  await audit(
    session,
    "career",
    career,
    "resume_viewed",
    external && !career.resume?.data
      ? `External resume link opened${download ? " for download" : ""}`
      : download
        ? "Resume downloaded"
        : "Resume viewed",
  );
  if (!career.resume?.data && external)
    return NextResponse.redirect(external, {
      status: 302,
      headers: {
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  const filename = String(career.resume.filename || "resume").replace(
    /[^a-zA-Z0-9._ -]/g,
    "_",
  );
  const ext = filename.split(".").pop()?.toLowerCase();
  const mime: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return new NextResponse(new Uint8Array(career.resume.data), {
    headers: {
      "Content-Type": mime[ext || ""] || "application/octet-stream",
      "Content-Disposition": `${!download && ext === "pdf" ? "inline" : "attachment"}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox; default-src 'none'",
    },
  });
}
