import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleCheck,
  Plus,
  Users,
  Inbox,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ActivityTable from "@/components/ActivityTable";
import Feedback from "@/components/Feedback";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Activity, CareerApplication, Lead } from "@/lib/models";
import { leadStatuses } from "@/lib/constants";
import { initials, plain, shortDate } from "@/lib/format";
import { enrichActivities } from "@/lib/activity";
export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const session = await requireAdmin();
  await connectDb();
  const query = await searchParams;
  const [leadCounts, careers, leads, applications, activities] =
    await Promise.all([
      Lead.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CareerApplication.countDocuments(),
      Lead.find()
        .select("name email status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      CareerApplication.find()
        .select("name position status createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Activity.find(
        session.role === "admin" ? {} : { entityType: { $ne: "team" } },
      )
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);
  const counts = Object.fromEntries(leadCounts.map((x) => [x._id, x.count])),
    total = leadCounts.reduce((sum, x) => sum + x.count, 0);
  const stats = [
    {
      label: "Total leads",
      value: total,
      caption: "All enquiries",
      icon: Users,
      path: "/admin/leads",
      tone: "blue",
    },
    {
      label: "New enquiries",
      value: counts.New || 0,
      caption: "Awaiting first contact",
      icon: Inbox,
      path: "/admin/leads?status=New",
      tone: "orange",
    },
    {
      label: "Converted leads",
      value: counts.Converted || 0,
      caption: `${total ? Math.round(((counts.Converted || 0) / total) * 100) : 0}% of all leads`,
      icon: CircleCheck,
      path: "/admin/leads?status=Converted",
      tone: "green",
    },
    {
      label: "Career applications",
      value: careers,
      caption: "All candidates",
      icon: BriefcaseBusiness,
      path: "/admin/careers",
      tone: "blue",
    },
  ];
  return (
    <>
      <PageHeader
        title="Overview"
        description={`Welcome back, ${session.name.split(" ")[0]}. Here's where things stand.`}
        action={
          session.role !== "viewer" ? (
            <Link href="/admin/leads/create" className="button">
              <Plus size={18} />
              Add lead
            </Link>
          ) : undefined
        }
      />
      {query.denied && (
        <Feedback error="Your account does not have access to that page." />
      )}
      <div className="metrics-grid">
        {stats.map(({ label, value, caption, icon: Icon, path, tone }) => (
          <Link
            href={path}
            className={`metric-card metric-${tone}`}
            key={label}
          >
            <div className="metric-heading">
              <span>{label}</span>
              <span className="metric-icon">
                <Icon size={20} />
              </span>
            </div>
            <strong className="metric-value">
              {value.toLocaleString("en-IN")}
            </strong>
            <div className="metric-bottom">
              <span>{caption}</span>
              <ArrowUpRight size={17} />
            </div>
          </Link>
        ))}
      </div>
      <section className="card pipeline-panel">
        <div className="panel-heading">
          <div>
            <h2>Lead pipeline</h2>
            <p>Enquiries by current status</p>
          </div>
          <Link href="/admin/leads" className="text-link">
            Manage leads
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="pipeline">
          {leadStatuses.map((status, i) => (
            <Link
              href={`/admin/leads?status=${encodeURIComponent(status)}`}
              className="pipeline-stage"
              key={status}
            >
              <div>
                <span>{status}</span>
                <strong>{counts[status] || 0}</strong>
              </div>
              <div className="pipeline-track">
                <span
                  style={{
                    width: `${total ? ((counts[status] || 0) / total) * 100 : 0}%`,
                    background: [
                      "#3396d6",
                      "#006699",
                      "#f27b22",
                      "#21845a",
                      "#728493",
                    ][i],
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div className="dashboard-columns">
        <section className="card">
          <div className="panel-heading padded">
            <div>
              <h2>Latest leads</h2>
              <p>Recent customer enquiries</p>
            </div>
            <Link className="text-link" href="/admin/leads">
              View all
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="recent-list">
            {(plain(leads) as any[]).map((lead) => (
              <Link
                className="recent-item"
                href={`/admin/leads/${lead._id}`}
                key={lead._id}
              >
                <span className="avatar">{initials(lead.name)}</span>
                <div className="recent-person">
                  <strong>{lead.name}</strong>
                  <span>{lead.email}</span>
                </div>
                <div className="recent-right">
                  <StatusBadge status={lead.status} />
                  <time>{shortDate(lead.createdAt)}</time>
                </div>
              </Link>
            ))}
          </div>
          {!leads.length && (
            <div className="empty-state">
              <Inbox />
              <h3>No leads yet</h3>
              <p>Website enquiries and manual leads appear here.</p>
            </div>
          )}
        </section>
        <section className="card">
          <div className="panel-heading padded">
            <div>
              <h2>Latest applications</h2>
              <p>Recent career submissions</p>
            </div>
            <Link className="text-link" href="/admin/careers">
              View all
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="recent-list">
            {(plain(applications) as any[]).map((item) => (
              <Link
                className="recent-item"
                href={`/admin/careers/${item._id}`}
                key={item._id}
              >
                <span className="avatar warm">{initials(item.name)}</span>
                <div className="recent-person">
                  <strong>{item.name}</strong>
                  <span>{item.position}</span>
                </div>
                <div className="recent-right">
                  <StatusBadge status={item.status} />
                  <time>{shortDate(item.createdAt)}</time>
                </div>
              </Link>
            ))}
          </div>
          {!applications.length && (
            <div className="empty-state">
              <BriefcaseBusiness />
              <h3>No applications yet</h3>
              <p>Career form submissions appear here.</p>
            </div>
          )}
        </section>
      </div>
      <section className="card activity-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent activity</h2>
            <p>The latest changes across your workspace</p>
          </div>
          <Link href="/admin/activity" className="text-link">
            All activity
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <ActivityTable items={await enrichActivities(plain(activities))} />
      </section>
    </>
  );
}
