import { ExternalLink, FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BrochureUploadForm from "@/components/BrochureUploadForm";
import DownloadButton from "@/components/DownloadButton";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Brochure } from "@/lib/models";
import { dateTime, plain } from "@/lib/format";

function fileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function BrochurePage() {
  await requireRole(["admin"]);
  await connectDb();
  const versions: any[] = plain(
    await Brochure.find()
      .select("filename size active uploadedByName createdAt")
      .sort({ createdAt: -1 })
      .lean(),
  );
  return (
    <>
      <PageHeader
        eyebrow="WEBSITE CONTENT"
        title="Brochure"
        description="Publish the PDF downloaded from the website and QR code."
        action={
          <a
            className="button button-secondary"
            href="/download-brochure"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={16} />
            Test public download
          </a>
        }
      />
      <div className="brochure-layout">
        <BrochureUploadForm />
        <section className="card brochure-versions">
          <div className="panel-heading padded">
            <div>
              <h2>Brochure versions</h2>
              <p>Previous files remain available to administrators.</p>
            </div>
          </div>
          <div className="brochure-version-list">
            {versions.map((version) => (
              <article className="brochure-version" key={version._id}>
                <span className="brochure-file-icon">
                  <FileText size={18} />
                </span>
                <div>
                  <strong>{version.filename}</strong>
                  <span>
                    {fileSize(version.size)} · {dateTime(version.createdAt)} ·{" "}
                    {version.uploadedByName}
                  </span>
                </div>
                {version.active && (
                  <span className="status-badge tone-green">
                    <i />
                    Active
                  </span>
                )}
                <DownloadButton
                  href={`/api/brochures/${version._id}`}
                  label={`Download ${version.filename}`}
                  iconOnly
                />
              </article>
            ))}
            {!versions.length && (
              <div className="empty-state">
                <FileText />
                <h3>Using the original brochure</h3>
                <p>Upload a PDF to create the first CMS-managed version.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
