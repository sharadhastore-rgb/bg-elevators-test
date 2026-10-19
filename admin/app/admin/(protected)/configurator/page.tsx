import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ConfiguratorEditor from "@/components/ConfiguratorEditor";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ConfiguratorSetting, ConfiguratorRequest } from "@/lib/configurator";
import { plain, dateTime } from "@/lib/format";
import {
  defaultConfigurator,
  resolveConfiguratorSettings,
  statuses,
} from "../../../../../shared/configurator.js";
import { updateConfiguratorRequest } from "@/app/admin/configurator-actions";
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
          <form className="mb-5 flex gap-3">
            <label className="text-sm">
              Request status{" "}
              <select
                className="ml-2 rounded border border-slate-200 bg-white p-2"
                name="status"
                defaultValue={params.status || ""}
              >
                <option value="">All</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button className="rounded bg-white px-3 text-sm">Filter</button>
          </form>
          <div className="space-y-4">
            {!items.length && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
                No configuration requests yet. New submissions appear here.
              </div>
            )}
            {items.map((item) => (
              <details
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer">
                  <strong>{item.customer.name}</strong>
                  <span className="ml-3 text-sm text-slate-500">
                    {item.customer.projectName || "Elevator project"} ·{" "}
                    {item.specification.floorCount} floors ·{" "}
                    {item.specification.capacity} kg · {item.status} ·{" "}
                    {dateTime(item.createdAt)}
                  </span>
                </summary>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-semibold">Contact & project</h3>
                    <dl className="space-y-2 text-sm">
                      {Object.entries(item.customer).map(([k, v]) => (
                        <div className="flex flex-wrap gap-3" key={k}>
                          <dt className="w-24 text-slate-500">{k}</dt>
                          <dd className="break-all">{String(v) || "—"}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-xs text-slate-500">
                      Reference {item._id} · catalog revision {item.revision}
                      <br />
                      Privacy consent: {item.consent ? "Yes" : "No"} ·
                      Marketing: {item.marketing ? "Opted in" : "No"}
                    </p>
                    {item.drawing?.filename && (
                      <a
                        className="mt-3 inline-block text-sm text-sky-700 underline"
                        href={`/api/configurator/requests/${item._id}/drawing`}
                      >
                        Download drawing: {item.drawing.filename}
                      </a>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">
                      Submitted specification
                    </h3>
                    <dl className="space-y-2 text-sm">
                      {Object.entries(item.specification).map(([k, v]) => (
                        <div className="grid grid-cols-2 gap-2" key={k}>
                          <dt className="break-words text-slate-500">
                            {k.replace(/([A-Z])/g, " $1")}
                          </dt>
                          <dd className="break-words">
                            {item.selections?.[k]?.label ||
                              (Array.isArray(v)
                                ? v.join(", ")
                                : typeof v === "boolean"
                                  ? v
                                    ? "Yes"
                                    : "No"
                                  : String(v ?? "—"))}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                {actor.role !== "viewer" && (
                  <form
                    action={updateConfiguratorRequest}
                    className="mt-5 flex gap-3"
                  >
                    <input type="hidden" name="id" value={item._id} />
                    <select
                      aria-label="Request status"
                      name="status"
                      defaultValue={item.status}
                      className="rounded border border-slate-200 p-2"
                    >
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button className="rounded bg-[#006699] px-4 py-2 text-sm text-white">
                      Update status
                    </button>
                  </form>
                )}
              </details>
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
