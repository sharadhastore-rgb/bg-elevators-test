import Link from "next/link";
import { ArrowUpRight, Inbox, Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusSelect from "@/components/StatusSelect";
import StatusBadge from "@/components/StatusBadge";
import Feedback from "@/components/Feedback";
import DeleteButton from "@/components/DeleteButton";
import FavoriteButton from "@/components/FavoriteButton";
import { Filters, Pagination } from "@/components/ListTools";
import { updateStatus } from "../../actions";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Lead, leadSources, leadStatuses } from "@/lib/models";
import { initials, plain, shortDate } from "@/lib/format";
import {
  pageSize,
  requestedPage,
  searchFilter,
  type Query,
} from "@/lib/queries";
export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const session = await requireAdmin();
  await connectDb();
  const query = await searchParams;
  const filter = searchFilter(query, ["name", "email", "phone", "location"]);
  if (leadStatuses.includes(query.status as never))
    filter.status = query.status;
  if (leadSources.includes(query.source as never)) filter.source = query.source;
  if (query.favorite === "1") filter.favorite = true;
  const total = await Lead.countDocuments(filter),
    page = Math.min(
      requestedPage(query),
      Math.max(1, Math.ceil(total / pageSize)),
    );
  const leads: any[] = plain(
    await Lead.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
  );
  const canEdit = session.role !== "viewer";
  return (
    <>
      <PageHeader
        eyebrow="CUSTOMER RELATIONSHIPS"
        title="Leads"
        description="Every enquiry, from first contact to conversion."
        action={
          canEdit ? (
            <Link className="button" href="/admin/leads/create">
              <Plus size={18} />
              Add lead
            </Link>
          ) : undefined
        }
      />
      {query.deleted && (
        <Feedback success="Lead deleted. Its history is retained in Activity." />
      )}
      <section className="card list-card">
        <div className="list-heading">
          <h2>
            All leads <span className="count-badge">{total}</span>
          </h2>
        </div>
        <Filters
          path="/admin/leads"
          query={query}
          statuses={leadStatuses}
          sources={leadSources}
          favorites
        />
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Customer leads</caption>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Created</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <Link
                      className="table-person"
                      href={`/admin/leads/${lead._id}`}
                    >
                      <span className="avatar">{initials(lead.name)}</span>
                      <span>
                        <strong>{lead.name}</strong>
                        <small>{lead.email}</small>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <a
                      className="phone-link"
                      href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td>
                    <span className="source-chip">{lead.source}</span>
                  </td>
                  <td className="date-cell">{shortDate(lead.createdAt)}</td>
                  <td>
                    {canEdit ? (
                      <StatusSelect
                        label={`Status for ${lead.name}`}
                        status={lead.status}
                        statuses={leadStatuses}
                        action={updateStatus.bind(null, "lead", lead._id)}
                      />
                    ) : (
                      <StatusBadge status={lead.status} />
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <FavoriteButton
                        id={lead._id}
                        name={lead.name}
                        favorite={Boolean(lead.favorite)}
                        editable={canEdit}
                      />
                      <Link
                        className="table-action"
                        href={`/admin/leads/${lead._id}`}
                        aria-label={`View ${lead.name}`}
                      >
                        View
                        <ArrowUpRight size={16} />
                      </Link>
                      {session.role === "admin" && (
                        <DeleteButton
                          compact
                          kind="lead"
                          id={lead._id}
                          name={lead.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!leads.length && (
          <div className="empty-state">
            <Inbox />
            <h3>
              {query.q || query.status || query.source || query.favorite
                ? "No matching leads"
                : "No leads yet"}
            </h3>
            <p>
              {query.q || query.status || query.source || query.favorite
                ? "Try a different search or clear the filters."
                : "New enquiries appear here. You can also add a lead manually."}
            </p>
          </div>
        )}
        <Pagination
          path="/admin/leads"
          query={query}
          page={page}
          total={total}
        />
      </section>
    </>
  );
}
