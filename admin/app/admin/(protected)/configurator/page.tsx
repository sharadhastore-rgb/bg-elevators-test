import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ConfiguratorEditor from "@/components/ConfiguratorEditor";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ConfiguratorSetting, ConfiguratorRequest } from "@/lib/configurator";
import { plain } from "@/lib/format";
import {
  defaultConfigurator,
  resolveConfiguratorSettings,
  statuses,
} from "../../../../../shared/configurator.js";
import ConfiguratorRequestCard from "@/components/ConfiguratorRequestCard";
export const dynamic = "force-dynamic";
export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; tab?: string }>;
}) {
  const actor = await requireAdmin();
  await connectDb();
  const params = await searchParams;
  const page = Math.max(1, Math.min(100000, Number(params.page) || 1)),
    filter = statuses.includes(params.status || "")
      ? { status: params.status }
      : {};
  const [record, requests, count] = await Promise.all([
    ConfiguratorSetting.findOne({ key: "main" }).lean(),
    ConfiguratorRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * 20)
      .limit(20)
      .lean(),
    ConfiguratorRequest.countDocuments(filter),
  ]);
  const current = plain(record) as any,
    items = plain(requests) as any[];
  const website = (process.env.NEXT_PUBLIC_WEBSITE_URL || "").replace(
    /\/$/,
    "",
  );
  const settingsTab = params.tab === "settings" && actor.role === "admin";
  return (
    <>
      <PageHeader
        eyebrow="WEBSITE EXPERIENCE"
        title="Elevator Configurator"
        description="Manage the public configuration experience and review customer project briefs."
        action={
          <a
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
            href={`${website}/configurator`}
            target="_blank"
            rel="noreferrer"
          >
            Open configurator ↗
          </a>
        }
      />
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          className={`rounded-lg px-4 py-2 text-sm ${!settingsTab ? "bg-[#006699] text-white" : "bg-white"}`}
          href="/admin/configurator"
        >
          Requests ({count})
        </Link>
        {actor.role === "admin" && (
          <Link
            className={`rounded-lg px-4 py-2 text-sm ${settingsTab ? "bg-[#006699] text-white" : "bg-white"}`}
            href="/admin/configurator?tab=settings"
          >
            Settings & catalog
          </Link>
        )}
      </div>
      {settingsTab ? (
        <ConfiguratorEditor
          settings={resolveConfiguratorSettings(current?.settings || defaultConfigurator)}
          revision={current?.revision || 0}
          website={website}
        />
      ) : (
        <>
          <form className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <label className="grid gap-2 text-xs font-semibold text-slate-500">
              Request status{" "}
              <select
                className="min-h-11 min-w-44 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"
                name="status"
                defaultValue={params.status || ""}
              >
                <option value="">All</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button className="min-h-11 rounded-lg bg-[#006699] px-5 text-sm font-semibold text-white">Filter</button>
          </form>
          <div className="space-y-4">
            {!items.length && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
                No configuration requests yet. New submissions appear here.
              </div>
            )}
            {items.map((item, index) => (
              <ConfiguratorRequestCard
                key={item._id}
                item={item}
                canEdit={actor.role !== "viewer"}
                canDelete={actor.role === "admin"}
                open={index === 0}
                requestNumber={(page - 1) * 20 + index + 1}
              />
            ))}
          </div>
          <div className="my-6 flex gap-5 text-sm">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}&status=${encodeURIComponent(params.status || "")}`}
              >
                ← Previous
              </Link>
            )}
            <span>
              Page {page} · {count} requests
            </span>
            {page * 20 < count && (
              <Link
                href={`?page=${page + 1}&status=${encodeURIComponent(params.status || "")}`}
              >
                Next →
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
}
