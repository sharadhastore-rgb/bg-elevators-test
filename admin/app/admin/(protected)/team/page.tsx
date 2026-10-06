import { ShieldCheck, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import TeamForm from "@/components/TeamForm";
import TeamActions from "@/components/TeamActions";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Admin } from "@/lib/models";
import { initials, plain, shortDate } from "@/lib/format";
export default async function TeamPage() {
  const session = await requireRole(["admin"]);
  await connectDb();
  const members: any[] = plain(
    await Admin.find()
      .select("name email role active createdAt")
      .sort({ createdAt: 1 })
      .lean(),
  );
  return (
    <div className="team-page">
      <PageHeader
        eyebrow="WORKSPACE SETTINGS"
        title="Team & access"
        description="Manage who can access the admin and what they can do."
      />
      <div className="role-guide">
        <div>
          <ShieldCheck size={20} />
          <span>
            <strong>Administrator</strong>
            <small>All records, deletions and team access</small>
          </span>
        </div>
        <div>
          <Users size={20} />
          <span>
            <strong>Staff</strong>
            <small>Create and edit leads and applications</small>
          </span>
        </div>
        <div>
          <Users size={20} />
          <span>
            <strong>Viewer</strong>
            <small>Read records, activity and resumes</small>
          </span>
        </div>
      </div>
      <div className="team-layout">
        <section className="card">
          <div className="panel-heading padded">
            <div>
              <h2>
                Team members{" "}
                <span className="count-badge">{members.length}</span>
              </h2>
              <p>
                {members.filter((x) => x.active !== false).length} active
                accounts
              </p>
            </div>
          </div>
          <div className="team-list scrollbar-hidden overscroll-contain">
            {members.map((member) => (
              <article className="team-member" key={member._id}>
                <div className="team-member-heading">
                  <span className="avatar">{initials(member.name)}</span>
                  <div className="team-info">
                    <strong>
                      {member.name}
                      {member._id === session.id && (
                        <span className="you-badge">You</span>
                      )}
                    </strong>
                    <span>{member.email}</span>
                  </div>
                  <StatusBadge
                    status={member.active === false ? "Inactive" : "Active"}
                  />
                </div>
                <div className="team-member-meta">
                  <span className="role-badge">
                    {member.role === "admin" ? "Administrator" : member.role}
                  </span>
                  <span>Joined {shortDate(member.createdAt)}</span>
                </div>
                <TeamActions
                  id={member._id}
                  name={member.name}
                  active={member.active !== false}
                  self={member._id === session.id}
                />
              </article>
            ))}
          </div>
        </section>
        <TeamForm />
      </div>
    </div>
  );
}
