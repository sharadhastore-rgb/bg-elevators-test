import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";
import DeleteButton from "./DeleteButton";
import PageHeader from "./PageHeader";
import StatusSelect from "./StatusSelect";
import StatusBadge from "./StatusBadge";
import ActivityTable from "./ActivityTable";
import NoteForm from "./NoteForm";
import Feedback from "./Feedback";
import { updateStatus } from "@/app/admin/actions";
import { careerStatuses, leadStatuses } from "@/lib/constants";
import { dateTime, initials, safeUrl } from "@/lib/format";
export default function RecordDetails({
  kind,
  record,
  activities,
  role,
  saved,
  created,
}: {
  kind: "lead" | "career";
  record: any;
  activities: any[];
  role: string;
  saved?: string;
  created?: string;
}) {
  const lead = kind === "lead",
    path = lead ? "leads" : "careers",
    canEdit = role !== "viewer";
  return (
    <>
      <Link className="back-link" href={`/admin/${path}`}>
        <ArrowLeft size={16} />
        Back to {path}
      </Link>
      <PageHeader
        title={record.name}
        description={
          lead
            ? "Enquiry details and follow-up history."
            : "Candidate details and application history."
        }
        action={
          <>
            {canEdit && (
              <Link
                className="button button-secondary"
                href={`/admin/${path}/${record._id}/edit`}
              >
                <Pencil size={17} />
                Edit details
              </Link>
            )}
            {role === "admin" && (
              <DeleteButton kind={kind} id={record._id} name={record.name} />
            )}
          </>
        }
      />
      {(saved || created) && (
        <Feedback
          success={
            created
              ? "Lead created successfully."
              : "Details updated successfully."
          }
        />
      )}
      <div className="detail-layout">
        <div className="detail-main">
          <section className="card profile-card">
            <div className="profile-heading">
              <span className="avatar large">{initials(record.name)}</span>
              <div>
                <h2>{record.name}</h2>
                <p>{lead ? `${record.source} enquiry` : record.position}</p>
              </div>
              <StatusBadge status={record.status} />
            </div>
            <dl className="info-grid">
              <Info icon={<Mail size={17} />} label="Email">
                <a href={`mailto:${record.email}`}>{record.email}</a>
              </Info>
              <Info icon={<Phone size={17} />} label="Phone">
                <a href={`tel:${record.phone.replace(/[^+\d]/g, "")}`}>
                  {record.phone}
                </a>
              </Info>
              <Info icon={<MapPin size={17} />} label="Location">
                {record.location || "Not provided"}
              </Info>
              <Info
                icon={<CalendarDays size={17} />}
                label={lead ? "Created" : "Applied"}
              >
                {dateTime(record.createdAt)}
              </Info>
              {!lead && (
                <Info icon={<UserRound size={17} />} label="Experience">
                  {record.experience || "Not provided"}
                </Info>
              )}
              {record.page && (
                <Info icon={<ExternalLink size={17} />} label="Submitted from">
                  {record.page}
                </Info>
              )}
            </dl>
            <div className="record-message">
              <h3>{lead ? "Message / requirement" : "Application message"}</h3>
              <p>{record.message || "No message provided."}</p>
            </div>
            {!lead && (
              <div className="resume-panel">
                <div>
                  <h3>Candidate resume</h3>
                  <p>
                    {record.resume?.filename ||
                      (safeUrl(record.resume?.externalUrl)
                        ? "External CV link"
                        : "No resume available")}
                  </p>
                </div>
                {(record.resume?.filename ||
                  safeUrl(record.resume?.externalUrl)) && (
                  <div className="resume-detail-actions">
                    <a
                      className="button button-secondary"
                      href={`/api/careers/${record._id}/resume`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View resume
                    </a>
                    <a
                      className="button button-primary"
                      href={`/api/careers/${record._id}/resume?download=1`}
                    >
                      <Download size={17} />
                      Download
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>
          <section className="card activity-panel">
            <div className="panel-heading">
              <div>
                <h2>Activity history</h2>
                <p>
                  Updates and changes to this {lead ? "lead" : "application"}
                </p>
              </div>
              <span className="count-badge">{activities.length}</span>
            </div>
            <ActivityTable items={activities} />
          </section>
        </div>
        <aside className="card management-panel">
          <div className="panel-heading">
            <h2>{lead ? "Lead" : "Application"} management</h2>
          </div>
          <div className="management-status">
            <label className="label">Current status</label>
            {canEdit ? (
              <StatusSelect
                status={record.status}
                statuses={lead ? leadStatuses : careerStatuses}
                action={updateStatus.bind(null, kind, record._id)}
              />
            ) : (
              <StatusBadge status={record.status} />
            )}
          </div>
          {canEdit ? (
            <NoteForm
              kind={kind}
              id={record._id}
              note={record.adminNote || ""}
            />
          ) : (
            <div>
              <h3>Internal note</h3>
              <p className="note-text">
                {record.adminNote || "No internal note."}
              </p>
            </div>
          )}
          <div className="record-meta">
            <span>Last updated</span>
            <time>{dateTime(record.updatedAt)}</time>
            <span className="record-id">
              ID: {String(record._id).slice(-8).toUpperCase()}
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
function Info({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="info-item">
      <span>{icon}</span>
      <div>
        <dt>{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}
