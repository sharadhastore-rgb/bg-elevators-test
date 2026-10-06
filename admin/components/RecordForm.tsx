"use client";
import { useActionState } from "react";
import Link from "next/link";
import { Save, UserRound, MessageSquareText } from "lucide-react";
import { createLead, updateDetails } from "@/app/admin/actions";
import { leadSources, leadStatuses } from "@/lib/constants";
import type { FormState } from "@/lib/validation";
import Feedback from "./Feedback";
import SubmitButton from "./SubmitButton";
export default function RecordForm({
  kind = "lead",
  record,
}: {
  kind?: "lead" | "career";
  record?: Record<string, string>;
}) {
  const editing = Boolean(record),
    path = kind === "lead" ? "leads" : "careers";
  const [state, action] = useActionState<FormState, FormData>(
    record ? updateDetails.bind(null, kind, record._id) : createLead,
    {},
  );
  const values = { ...record, ...state.values };
  const cancel = editing ? `/admin/${path}/${record?._id}` : "/admin/leads";
  return (
    <form action={action} className="record-form card">
      <div className="record-form-body">
        <div className="form-section">
          <div className="section-title">
            <UserRound size={19} />
            <div>
              <h2>
                {kind === "lead"
                  ? "Contact information"
                  : "Candidate information"}
              </h2>
              <p>Fields marked * are required.</p>
            </div>
          </div>
          <Feedback {...state} />
          <div className="form-grid">
            <label className="label">
              Full name *
              <input
                className="field"
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={256}
                required
                defaultValue={values.name}
              />
            </label>
            <label className="label">
              Email address *
              <input
                className="field"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={256}
                required
                defaultValue={values.email}
              />
            </label>
            <label className="label">
              Phone number *
              <input
                className="field"
                name="phone"
                type="tel"
                autoComplete="tel"
                minLength={7}
                maxLength={25}
                required
                defaultValue={values.phone}
              />
            </label>
            <label className="label">
              Location
              <input
                className="field"
                name="location"
                maxLength={256}
                defaultValue={values.location}
              />
            </label>
            {kind === "lead" ? (
              <label className="label">
                Lead source *
                <select
                  className="field"
                  name="source"
                  defaultValue={values.source || "Manual"}
                >
                  {leadSources
                    .filter((x) => editing || x !== "Website")
                    .map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                </select>
              </label>
            ) : (
              <>
                <label className="label">
                  Position
                  <input
                    className="field"
                    name="position"
                    maxLength={256}
                    defaultValue={values.position}
                  />
                </label>
                <label className="label">
                  Experience
                  <input
                    className="field"
                    name="experience"
                    maxLength={256}
                    defaultValue={values.experience}
                  />
                </label>
              </>
            )}
            {!editing && (
              <label className="label">
                Initial status
                <select
                  className="field"
                  name="status"
                  defaultValue={values.status || "New"}
                >
                  {leadStatuses.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
        <div className="form-section">
          <div className="section-title">
            <MessageSquareText size={19} />
            <h2>
              {kind === "lead" ? "Enquiry details" : "Application details"}
            </h2>
          </div>
          <label className="label">
            {kind === "lead" ? "Message / requirement" : "Message"}
            <textarea
              className="field"
              rows={5}
              name="message"
              maxLength={5000}
              defaultValue={values.message}
            />
          </label>
          {!editing && (
            <label className="label mt-5">
              Internal note
              <textarea
                className="field"
                rows={3}
                name="adminNote"
                maxLength={10000}
                defaultValue={values.adminNote}
              />
              <small>Only your team can see this note.</small>
            </label>
          )}
        </div>
      </div>
      <div className="form-footer">
        <Link className="button button-secondary" href={cancel}>
          Cancel
        </Link>
        <SubmitButton>
          <Save size={17} />
          {editing ? "Save changes" : "Create lead"}
        </SubmitButton>
      </div>
    </form>
  );
}
