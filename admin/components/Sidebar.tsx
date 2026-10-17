"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Activity,
  SlidersHorizontal,
  ArrowUpRight,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Menu,
  FileText,
  BookOpen,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { initials } from "@/lib/format";
export default function Sidebar({
  role,
  name,
}: {
  role: string;
  name: string;
}) {
  const pathname = usePathname(),
    menu = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    menu.current?.close();
  }, [pathname]);
  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Leads", icon: Users },
    { href: "/admin/careers", label: "Careers", icon: BriefcaseBusiness },
    { href: "/admin/blogs", label: "Blog studio", icon: BookOpen },
    { href: "/admin/configurator", label: "Elevator Configurator", icon: SlidersHorizontal },
    { href: "/admin/activity", label: "Activity", icon: Activity },
    ...(role === "admin"
      ? [
          { href: "/admin/brochure", label: "Brochure", icon: FileText },
          { href: "/admin/team", label: "Team & access", icon: UserCog },
        ]
      : []),
  ];
  function content(mobile = false) {
    return (
      <>
        <div className="sidebar-brand">
          <span className="brand-mark brand-logo-mark">
            <img src="/images/bgElevetorLogo.jpg" alt="" />
          </span>
          <div>
            <strong>BG Elevators</strong>
            <small>ADMIN WORKSPACE</small>
          </div>
          {mobile && (
            <button
              className="close-menu"
              type="button"
              aria-label="Close navigation"
              onClick={() => menu.current?.close()}
            >
              <X size={21} />
            </button>
          )}
        </div>
        <div className="sidebar-label">MANAGE</div>
        <nav
          aria-label={mobile ? "Mobile admin navigation" : "Admin navigation"}
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                className={`sidebar-link transition-all duration-200 hover:translate-x-0.5 ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
                href={href}
                key={href}
              >
                <Icon size={19} />
                <span>{label}</span>
                {active && <ArrowUpRight size={16} />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div className="sidebar-user">
            <span className="avatar">{initials(name)}</span>
            <div>
              <strong>{name}</strong>
              <small>{role === "admin" ? "Administrator" : role}</small>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="logout-button" type="submit">
              <LogOut size={17} />
              Sign out
            </button>
          </form>
          <p>BG Elevators · Operations</p>
        </div>
      </>
    );
  }
  return (
    <>
      <aside className="sidebar desktop-sidebar">{content()}</aside>
      <div className="mobile-bar">
        <Link href="/admin">
          <img className="mobile-brand-logo" src="/images/bgElevetorLogo.jpg" alt="" />
          BG Elevators
        </Link>
        <button
          className="icon-button"
          type="button"
          aria-label="Open navigation"
          onClick={() => menu.current?.showModal()}
        >
          <Menu size={22} />
        </button>
      </div>
      <dialog
        className="mobile-drawer"
        ref={menu}
        aria-label="Admin navigation"
        onClick={(event) => {
          if (event.target === event.currentTarget) menu.current?.close();
        }}
      >
        <div className="sidebar">{content(true)}</div>
      </dialog>
    </>
  );
}
