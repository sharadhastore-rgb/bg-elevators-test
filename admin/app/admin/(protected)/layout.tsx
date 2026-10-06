import Sidebar from "@/components/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { initials } from "@/lib/format";
import { ShieldCheck } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="admin-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar role={session.role} name={session.name} />
      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="topbar-label">Workspace</span>
            <span className="topbar-divider">/</span>
            <strong>Administration</strong>
          </div>
          <div className="topbar-account">
            <ShieldCheck size={16} />
            <span>
              {session.role === "admin"
                ? "Administrator"
                : session.role === "staff"
                  ? "Staff access"
                  : "Read-only access"}
            </span>
            <span className="avatar small">{initials(session.name)}</span>
          </div>
        </header>
        <main id="main-content" className="admin-main [overflow-wrap:anywhere]">
          {children}
        </main>
        <footer className="workspace-footer">
          <span>BG Elevators</span>
        </footer>
      </div>
    </div>
  );
}
