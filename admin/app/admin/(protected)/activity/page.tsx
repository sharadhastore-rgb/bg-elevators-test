import Link from "next/link";
import { Search, History } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ActivityTable from "@/components/ActivityTable";
import { Pagination } from "@/components/ListTools";
import FilterForm from "@/components/FilterForm";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Activity } from "@/lib/models";
import { activityActions, actionLabels } from "@/lib/constants";
import { plain } from "@/lib/format";
import { enrichActivities } from "@/lib/activity";
import {
  pageSize,
  requestedPage,
  searchFilter,
  type Query,
} from "@/lib/queries";
export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const session = await requireAdmin();
  await connectDb();
  const query = await searchParams;
  const filter = searchFilter(query, [
    "entityName",
    "description",
    "actorName",
  ]);
  if (
    ["lead", "career", ...(session.role === "admin" ? ["team"] : [])].includes(
      query.type || "",
    )
  )
    filter.entityType = query.type;
  else if (session.role !== "admin") filter.entityType = { $ne: "team" };
  if (activityActions.includes(query.action as never))
    filter.action = query.action;
  const dates: Record<string, Date> = {};
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.from || "")) {
    const start = new Date(`${query.from}T00:00:00+05:30`);
    if (!isNaN(start.valueOf())) dates.$gte = start;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.to || "")) {
    const end = new Date(`${query.to}T23:59:59.999+05:30`);
    if (!isNaN(end.valueOf())) dates.$lte = end;
  }
  if (Object.keys(dates).length) filter.createdAt = dates;
  const total = await Activity.countDocuments(filter),
    page = Math.min(
      requestedPage(query),
      Math.max(1, Math.ceil(total / pageSize)),
    );
  const items = await enrichActivities(
    plain(
      await Activity.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
    ),
  );
  return (
    <>
      <PageHeader
        title="Activity log"
        description={`${total} ${total === 1 ? "entry" : "entries"} · All website submissions and team changes`}
      />
      <section className="card activity-page">
        <div className="list-heading">
          <h2>
            <History size={20} />
            Activity log <span className="count-badge">{total}</span>
          </h2>
        </div>
        <FilterForm className="activity-filters" action="/admin/activity">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              name="q"
              aria-label="Search activity"
              placeholder="Search record, person or change…"
              maxLength={120}
              defaultValue={query.q}
            />
          </label>
          <label className="label">
            Record type
            <select
              name="type"
              className="field"
              defaultValue={query.type || ""}
            >
              <option value="">All records</option>
              <option value="lead">Leads</option>
              <option value="career">Careers</option>
              {session.role === "admin" && <option value="team">Team</option>}
            </select>
          </label>
          <label className="label">
            Action
            <select
              name="action"
              className="field"
              defaultValue={query.action || ""}
            >
              <option value="">All actions</option>
              {activityActions.map((action) => (
                <option value={action} key={action}>
                  {actionLabels[action]}
                </option>
              ))}
            </select>
          </label>
          <label className="label">
            From
            <input
              type="date"
              name="from"
              className="field"
              defaultValue={query.from}
            />
          </label>
          <label className="label">
            To
            <input
              type="date"
              name="to"
              className="field"
              defaultValue={query.to}
            />
          </label>
          {(query.q ||
            query.type ||
            query.action ||
            query.from ||
            query.to) && (
            <div className="filter-actions">
              <Link className="text-link" href="/admin/activity">
                Clear
              </Link>
            </div>
          )}
        </FilterForm>
        <ActivityTable items={items} />
        <Pagination
          path="/admin/activity"
          query={query}
          page={page}
          total={total}
        />
      </section>
    </>
  );
}
