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
import { Pagination } from "@/components/ListTools";
import { pageSize, requestedPage } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; tab?: string }>;
}) {
  const actor = await requireAdmin();
  await connectDb();
  const params = await searchParams;
  const page = requestedPage(params),
    filter = statuses.includes(params.status || "")
      ? { status: params.status }
      : {};
  const [record, requests, count] = await Promise.all([
    ConfiguratorSetting.findOne({ key: "main" }).lean(),
    ConfiguratorRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
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
        title="Elevator Estimator"
        description="Manage the public estimation experience and review customer project briefs."
        action={
          <a
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
            href={`${website}/estimator`}
            target="_blank"
            rel="noreferrer"
          >
            Open estimator ↗
          </a>
        }
      />
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          className={`rounded-lg px-4 py-2 text-sm ${!settingsTab ? "bg-[#006699] text-white" : "bg-white"}`}
          href="/admin/estimator"
        >
          Requests ({count})
        </Link>
        {actor.role === "admin" && (
          <Link
            className={`rounded-lg px-4 py-2 text-sm ${settingsTab ? "bg-[#006699] text-white" : "bg-white"}`}
            href="/admin/estimator?tab=settings"
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
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {!items.length && (
              <div className="p-8 text-slate-500">
                No estimator requests yet. New submissions appear here.
              </div>
            )}
            {!!items.length && <div className="divide-y divide-slate-200">
              {items.map((item, index) => (
                <ConfiguratorRequestCard
                  key={item._id}
                  item={item}
                  canEdit={actor.role !== "viewer"}
                  canDelete={actor.role === "admin"}
                  requestNumber={(page - 1) * pageSize + index + 1}
                />
              ))}
            </div>}
            <Pagination
              path="/admin/estimator"
              query={params}
              page={page}
              total={count}
            />
          </section>
        </>
      )}
    </>
  );
}
