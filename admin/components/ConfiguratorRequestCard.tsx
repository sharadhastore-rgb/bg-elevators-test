import { ChevronDown, Download, UserRound, Building2, Mail, Phone } from "lucide-react";
import { dateTime } from "@/lib/format";
import { statuses } from "../../shared/configurator.js";
import ConfiguratorStatusForm from "@/components/ConfiguratorStatusForm";
import ConfiguratorRequestDelete from "@/components/ConfiguratorRequestDelete";

const labels: Record<string, string> = {
  name: "Contact name", email: "Email address", phone: "Phone number",
  projectName: "Project name", country: "Country", city: "City", district: "District",
  address: "Site address", plot: "Plot / property number", wallDesign: "Cabin appearance",
  doorConfig: "Door arrangement", door1Opening: "First door opening", door2Opening: "Second door opening",
  ceilingHeight: "Shaft headroom", safetySpace: "Space below shaft", wallRear: "Rear wall",
  wallLeft: "Left wall", wallRight: "Right wall", floorHeights: "Floor-to-floor heights",
  cabinDimensions: "Cabin dimensions", secondPanel: "Second control panel",
  ceilingDesign: "Ceiling", floorDesign: "Floor finish", accessory: "Accessories",
  regulations: "Standards", progress: "Completion", warnings: "Review notes",
};
const groups = [
  { title: "Shaft & dimensions", keys: ["shaftWidth", "shaftDepth", "pitDepth", "ceilingHeight", "floorCount", "floorHeights", "totalTravel", "travelMetres", "shaftHeight"] },
  { title: "Lift & door configuration", keys: ["capacity", "speed", "usageType", "cabinDimensions", "cabinHeight", "doorConfig", "door1Opening", "door2Opening"] },
  { title: "Cabin finishes", keys: ["wallDesign", "controlPanel", "ceilingDesign", "floorDesign", "accessory", "secondPanel", "panelCount"] },
  { title: "Structure & compliance", keys: ["wallRear", "wallLeft", "wallRight", "safetySpace", "regulations", "progress", "warnings"] },
];
const units: Record<string, string> = {
  shaftWidth: "mm", shaftDepth: "mm", pitDepth: "mm", ceilingHeight: "mm",
  floorHeights: "mm", totalTravel: "mm", shaftHeight: "mm", cabinHeight: "mm",
  cabinDimensions: "mm", capacity: "kg", speed: "m/s", travelMetres: "m", progress: "%",
};
const label = (key: string) => labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
function display(value: any): string {
  if (value === undefined || value === null || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.map(display).join(", ") : "None";
  if (typeof value === "number") return value.toLocaleString("en-IN");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
function specificationValue(item: any, key: string) {
  const selection = item.selections?.[key]?.label;
  if (selection) return selection;
  const value = item.specification?.[key];
  return `${display(value)}${units[key] && value !== undefined && value !== null && value !== "" ? ` ${units[key]}` : ""}`;
}
function Rows({ entries }: { entries: [string, string][] }) {
  return <dl className="divide-y divide-slate-100">
    {entries.map(([key, value]) => <div key={key} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-2 sm:gap-4">
      <dt className="text-sm leading-6 text-slate-500">{label(key)}</dt>
      <dd className="min-w-0 whitespace-pre-wrap break-words text-sm font-medium leading-6 text-slate-800 [overflow-wrap:anywhere]">{value}</dd>
    </div>)}
  </dl>;
}
export default function ConfiguratorRequestCard({ item, canEdit, canDelete, open, requestNumber }: { item: any; canEdit: boolean; canDelete: boolean; open: boolean; requestNumber: number }) {
  const customer = item.customer || {};
  const specification = item.specification || {};
  const known = new Set(groups.flatMap((group) => group.keys));
  const sections = [...groups, { title: "Additional details", keys: Object.keys(specification).filter((key) => !known.has(key)) }];
  const statusColor = item.status === "Closed" ? "bg-slate-100 text-slate-600" : item.status === "New" ? "bg-sky-50 text-sky-800" : "bg-amber-50 text-amber-800";
  return <details open={open} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5 focus-visible:outline-2 focus-visible:outline-sky-600 sm:p-6 [&::-webkit-details-marker]:hidden">
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700">
        <Building2 size={21} aria-hidden="true" />
        <span className="absolute -right-2 -top-2 min-w-6 rounded-full bg-[#006699] px-1.5 py-0.5 text-center text-[10px] font-bold leading-5 text-white shadow-sm">{String(requestNumber).padStart(2, "0")}</span>
      </span>
      <div className="min-w-0 flex-1 basis-40">
        <h2 className="break-words text-base font-semibold text-slate-900">{customer.projectName || "Elevator project"}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          <span className="break-words">{customer.name || "Customer"}{customer.city ? ` · ${customer.city}` : ""}</span>
          {customer.email && <a href={`mailto:${customer.email}`} className="inline-flex min-w-0 items-center gap-1.5 hover:text-[#006699]">
            <Mail size={14} className="shrink-0" aria-hidden="true" />
            <span className="break-all">{customer.email}</span>
          </a>}
          {customer.phone && <a href={`tel:${String(customer.phone).replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-[#006699]">
            <Phone size={14} className="shrink-0" aria-hidden="true" />
            <span>{customer.phone}</span>
          </a>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>{item.status}</span>
        <span className="text-xs text-slate-500">{dateTime(item.createdAt)}</span>
        <ChevronDown size={18} className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
      </div>
    </summary>
    <div className="border-t border-slate-100">
      <div className="grid grid-cols-2 gap-px bg-slate-200 border-b border-slate-200 md:grid-cols-4">
        {[["Floors", display(specification.floorCount)], ["Capacity", specificationValue(item, "capacity")], ["Total travel", specificationValue(item, "totalTravel")], ["Speed", specificationValue(item, "speed")]].map(([title, value]) =>
          <div className="bg-slate-50 px-5 py-4 sm:px-6" key={title}><p className="text-xs font-medium text-slate-500">{title}</p><p className="mt-1 break-words text-lg font-semibold text-[#123a4f]">{value}</p></div>)}
      </div>
      <div className="grid items-start gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(240px,0.8fr)_minmax(0,2fr)]">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><UserRound size={17} aria-hidden="true" /> Contact & project</h3>
          <Rows entries={Object.entries(customer).map(([key, value]) => [key, display(value)])} />
          {item.drawing?.filename && <a className="mt-4 flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-3 py-3 text-sm font-medium text-sky-800 hover:bg-sky-50" href={`/api/configurator/requests/${item._id}/drawing`}><Download size={17} className="shrink-0" aria-hidden="true" /><span className="min-w-0 break-all">{item.drawing.filename}</span></a>}
          <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
            <p>Privacy consent: {item.consent ? "Yes" : "No"}<br />Marketing: {item.marketing ? "Opted in" : "Not opted in"}</p>
            <p className="break-all">Request ID: {item._id}<br />Catalogue revision: {item.revision}</p>
          </div>
          {canDelete && <ConfiguratorRequestDelete id={item._id} name={customer.projectName || customer.name || "this request"} />}
        </section>
        <div className="grid min-w-0 items-start gap-5 md:grid-cols-2">
          {sections.map(({ title, keys }) => {
            const present = keys.filter((key) => Object.hasOwn(specification, key));
            if (!present.length) return null;
            return <section className="min-w-0 rounded-xl border border-slate-200 p-5" key={title}>
              <h3 className="mb-1 text-sm font-semibold text-[#006699]">{title}</h3>
              <Rows entries={present.map((key) => [key, specificationValue(item, key)])} />
            </section>;
          })}
        </div>
      </div>
      {canEdit && <ConfiguratorStatusForm id={item._id} status={item.status} statuses={statuses} />}
    </div>
  </details>;
}
