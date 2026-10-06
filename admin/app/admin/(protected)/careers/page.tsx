import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusSelect from "@/components/StatusSelect";
import StatusBadge from "@/components/StatusBadge";
import Feedback from "@/components/Feedback";
import DeleteButton from "@/components/DeleteButton";
import { Filters, Pagination } from "@/components/ListTools";
import { updateStatus } from "../../actions";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { CareerApplication, careerStatuses } from "@/lib/models";
import { initials, plain, safeUrl, shortDate } from "@/lib/format";
import {
  pageSize,
  requestedPage,
  searchFilter,
  type Query,
} from "@/lib/queries";
export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const session = await requireAdmin();
  await connectDb();
  const query = await searchParams;
  const filter = searchFilter(query, ["name", "email", "phone", "position"]);
  if (careerStatuses.includes(query.status as never))
    filter.status = query.status;
  const total = await CareerApplication.countDocuments(filter),
    page = Math.min(
      requestedPage(query),
      Math.max(1, Math.ceil(total / pageSize)),
    );
  const items: any[] = plain(
    await CareerApplication.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
  );
  return (
    <>
      <PageHeader
        eyebrow="RECRUITMENT"
        title="Careers"
        description="Review applicants and manage the next step."
      />
      {query.deleted && (
        <Feedback success="Application deleted. Its history is retained in Activity." />
      )}
      <section className="card list-card">
        <div className="list-heading">
          <h2>
            All applications <span className="count-badge">{total}</span>
          </h2>
        </div>
        <Filters
          path="/admin/careers"
          query={query}
          statuses={careerStatuses}
        />
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Career applications</caption>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Resume</th>
                <th>Applied</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <Link
                      className="table-person"
                      href={`/admin/careers/${item._id}`}
                    >
                      <span className="avatar warm">{initials(item.name)}</span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.email}</small>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <span className="cell-wrap">{item.position}</span>
                  </td>
                  <td>
                    {item.resume?.filename ||
                    safeUrl(item.resume?.externalUrl) ? (
                      <span className="resume-actions">
                        <a
                          className="resume-action"
                          href={`/api/careers/${item._id}/resume`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${item.name}'s resume`}
                        >
                          <Eye size={15} />
                          View
                        </a>
                        <a
                          className="resume-action"
                          href={`/api/careers/${item._id}/resume?download=1`}
                          aria-label={`Download ${item.name}'s resume`}
                        >
                          <Download size={15} />
                          Download
                        </a>
                      </span>
                    ) : (
                      <span className="muted">No resume</span>
                    )}
                  </td>
                  <td className="date-cell">{shortDate(item.createdAt)}</td>
                  <td>
                    {session.role !== "viewer" ? (
                      <StatusSelect
                        label={`Status for ${item.name}`}
                        status={item.status}
                        statuses={careerStatuses}
                        action={updateStatus.bind(null, "career", item._id)}
                      />
                    ) : (
                      <StatusBadge status={item.status} />
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        className="table-action"
                        href={`/admin/careers/${item._id}`}
                      >
                        View
                        <ArrowUpRight size={16} />
                      </Link>
                      {session.role === "admin" && (
                        <DeleteButton
                          compact
                          kind="career"
                          id={item._id}
                          name={item.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && (
          <div className="empty-state">
            <BriefcaseBusiness />
            <h3>
              {query.q || query.status
                ? "No matching applications"
                : "No applications yet"}
            </h3>
            <p>
              {query.q || query.status
                ? "Try a different search or clear the filters."
                : "Applications submitted on the website appear here."}
            </p>
          </div>
        )}
        <Pagination
          path="/admin/careers"
          query={query}
          page={page}
          total={total}
        />
      </section>
    </>
  );
}
