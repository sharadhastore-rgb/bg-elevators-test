"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { actionLabels } from "@/lib/constants";
import { dateTime } from "@/lib/format";
import type { ActivityItem } from "@/components/Timeline";

function recordLabel(item: ActivityItem) {
  if (item.entityType === "career") return "Career";
  if (item.entityType === "team") return "Team";
  return "Lead";
}

function recordHref(item: ActivityItem) {
  if (item.entityType === "team") return "/admin/team";
  return `/admin/${item.entityType === "lead" ? "leads" : "careers"}/${item.entityId}`;
}

export default function ActivityTable({ items }: { items: ActivityItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (!items.length)
    return (
      <div className="empty-state">
        <h3>No activity yet</h3>
        <p>New submissions and admin changes will appear here.</p>
      </div>
    );

  return (
    <div className="audit-table-wrap">
      <table className="audit-table">
        <thead>
          <tr>
            <th>When</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Record type</th>
            <th>Record</th>
            <th><span className="sr-only">Details</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const expanded = openId === item._id;
            return (
              <ActivityRows
                key={item._id}
                item={item}
                expanded={expanded}
                onToggle={() => setOpenId(expanded ? null : item._id)}
                canLink={Boolean(!item.deleted && item.action !== "deleted" && item.entityId)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ActivityRows({ item, expanded, onToggle, canLink }: {
  item: ActivityItem;
  expanded: boolean;
  onToggle: () => void;
  canLink: boolean;
}) {
  const origin = item.actorRole === "website" || item.actorName === "Website" ? "Website" : "Manual";

  return (
    <>
      <tr
        className={`audit-row ${expanded ? "is-open" : ""}`}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
        tabIndex={0}
        aria-expanded={expanded}
      >
        <td><time dateTime={new Date(item.createdAt).toISOString()}>{dateTime(item.createdAt)}</time></td>
        <td>
          <strong className="audit-actor">{item.actorName || "Website"}</strong>
          <span className={`audit-origin audit-origin-${origin.toLowerCase()}`}>{origin}</span>
        </td>
        <td>{actionLabels[item.action || ""] || "Activity"}</td>
        <td>{recordLabel(item)}</td>
        <td>
          {canLink ? (
            <Link className="audit-record-link" href={recordHref(item)} onClick={(event) => event.stopPropagation()}>
              {item.entityName || "View record"}<ArrowUpRight size={12} />
            </Link>
          ) : <span>{item.entityName || "Deleted record"}</span>}
        </td>
        <td>
          <button className="audit-expand" type="button" aria-label={expanded ? "Hide activity details" : "Show activity details"} onClick={(event) => { event.stopPropagation(); onToggle(); }}>
            <ChevronDown size={16} />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="audit-detail-row">
          <td colSpan={6}>
            <div className="audit-detail">
              <div className="audit-summary"><span>Activity</span><p>{item.description}</p></div>
              {item.changes?.length ? (
                <div className="audit-changes">
                  {item.changes.map((change, index) => (
                    <div className="audit-change" key={`${change.field}-${index}`}>
                      <strong>{change.field}</strong>
                      <div><span>Before</span><p>{change.before || "Empty"}</p></div>
                      <div><span>After</span><p>{change.after || "Empty"}</p></div>
                    </div>
                  ))}
                </div>
              ) : <p className="audit-no-changes">No field-level changes were recorded for this activity.</p>}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
