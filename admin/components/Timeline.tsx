import Link from "next/link";
import {
  Activity as ActivityIcon,
  ArrowUpRight,
  UserRound,
  Plus,
  Pencil,
  Trash2,
  FileDown,
  KeyRound,
} from "lucide-react";
import { dateTime } from "@/lib/format";
import { actionLabels } from "@/lib/constants";
export type ActivityItem = {
  _id: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  action?: string;
  description: string;
  createdAt: string;
  actorName?: string;
  actorRole?: string;
  changes?: { field: string; before: string; after: string }[];
  deleted?: boolean;
};
export default function Timeline({
  activities,
  links = false,
}: {
  activities: ActivityItem[];
  links?: boolean;
}) {
  if (!activities.length)
    return (
      <div className="empty-state">
        <ActivityIcon />
        <h3>No activity yet</h3>
        <p>New submissions and admin changes will appear here.</p>
      </div>
    );
  return (
    <ol className="timeline">
      {activities.map((item) => {
        const Icon =
          item.action === "created" || item.action === "account_created"
            ? Plus
            : item.action === "deleted"
              ? Trash2
              : item.action === "resume_viewed"
                ? FileDown
                : item.action === "password_reset"
                  ? KeyRound
                  : Pencil;
        const href =
          item.entityType === "team"
            ? "/admin/team"
            : `/admin/${item.entityType === "lead" ? "leads" : "careers"}/${item.entityId}`;
        return (
          <li key={item._id}>
            <span
              className={`timeline-icon ${item.action === "deleted" ? "deleted" : ""}`}
            >
              <Icon size={16} />
            </span>
            <div className="timeline-content">
              <div className="timeline-top">
                <span className="activity-label">
                  {actionLabels[item.action || ""] || "Activity"}
                </span>
                <time dateTime={new Date(item.createdAt).toISOString()}>
                  {dateTime(item.createdAt)}
                </time>
              </div>
              {links && (
                <div className="activity-record">
                  {!item.deleted &&
                  item.action !== "deleted" &&
                  item.entityId ? (
                    <Link href={href}>
                      {item.entityName ||
                        (item.entityType === "lead"
                          ? "Lead"
                          : item.entityType === "team"
                            ? "Team account"
                            : "Application")}
                      <ArrowUpRight size={14} />
                    </Link>
                  ) : (
                    <strong>{item.entityName || "Deleted record"}</strong>
                  )}
                  <span>
                    {item.entityType === "career"
                      ? "Career"
                      : item.entityType === "team"
                        ? "Team"
                        : "Lead"}
                    {item.deleted ? " · Deleted" : ""}
                  </span>
                </div>
              )}
              <p>{item.description}</p>
              <div className="timeline-actor">
                <UserRound size={13} />
                {item.actorName || "Website"}
              </div>
              {Boolean(item.changes?.length) && (
                <details className="change-details">
                  <summary>
                    View changes <span>{item.changes!.length}</span>
                  </summary>
                  <div>
                    {item.changes!.map((change, i) => (
                      <div className="change-row" key={i}>
                        <strong>{change.field}</strong>
                        <div>
                          <span>Before</span>
                          <p>{change.before || "Empty"}</p>
                        </div>
                        <div>
                          <span>After</span>
                          <p>{change.after || "Empty"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
