"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { uploadBrochure } from "@/app/admin/actions";
import Feedback from "./Feedback";
import SubmitButton from "./SubmitButton";

export default function BrochureUploadForm() {
  const [state, action] = useActionState(uploadBrochure, {});
  return (
    <form action={action} className="card brochure-upload">
      <div className="panel-heading">
        <div>
          <h2>Upload new brochure</h2>
          <p>PDF only · Maximum 12 MB</p>
        </div>
      </div>
      <div className="brochure-upload-body">
        <label className="label">
          Brochure PDF
          <input
            className="field"
            type="file"
            name="brochure"
            accept="application/pdf,.pdf"
            required
          />
        </label>
        <Feedback {...state} />
        <SubmitButton pendingText="Uploading…">
          <Upload size={16} />
          Upload and publish
        </SubmitButton>
        <p className="muted">
          The public QR link remains unchanged and immediately serves the new
          active version.
        </p>
      </div>
    </form>
  );
}
