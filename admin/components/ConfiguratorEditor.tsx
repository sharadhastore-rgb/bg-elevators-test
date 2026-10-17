"use client";
import { useActionState, useState } from "react";
import { saveConfigurator } from "@/app/admin/configurator-actions";
const names: Record<string, string> = {
  doorConfig: "Door arrangements",
  door1Opening: "First door opening",
  door2Opening: "Second door opening",
  usageType: "Usage types",
  safetySpace: "Space beneath the shaft",
  wallRear: "Rear wall materials",
  wallLeft: "Left wall materials",
  wallRight: "Right wall materials",
  cabinDimensions: "Cabin dimensions (W x D mm)",
  cabinHeight: "Cabin heights (mm)",
  wallDesign: "Cabin appearance",
  controlPanel: "Control panels",
  ceilingDesign: "Ceilings",
  floorDesign: "Floors",
  accessory: "Accessories",
};
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-2 focus:outline-sky-600";
export default function ConfiguratorEditor({
  settings,
  revision,
  website,
}: {
  settings: any;
  revision: number;
  website: string;
}) {
  const [config, setConfig] = useState(settings),
    [state, action, pending] = useActionState(
      saveConfigurator,
      {} as { error?: string; success?: string; revision?: number },
    ),
    [uploadError, setUploadError] = useState(""),
    [uploading, setUploading] = useState("");
  const update = (path: (string | number)[], value: any) =>
    setConfig((current: any) => {
      const next = structuredClone(current);
      let target = next;
      for (const k of path.slice(0, -1)) target = target[k];
      target[path[path.length - 1]] = value;
      return next;
    });
  async function upload(path: (string | number)[], file: File) {
    setUploading(path.join("."));
    setUploadError("");
    try {
      const data = new FormData();
      data.set("image", file);
      const r = await fetch("/api/configurator/assets", {
        method: "POST",
        body: data,
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.message);
      update([...path, "image"], body.image);
    } catch (e: any) {
      setUploadError(e.message || "Upload failed.");
    } finally {
      setUploading("");
    }
  }
  const groups = [
    ...Object.keys(config.options).map((key) => ({
      key,
      path: ["options", key],
      items: config.options[key],
      catalog: false,
    })),
    {
      key: "capacities",
      path: ["capacities"],
      items: config.capacities,
      catalog: false,
    },
    {
      key: "regulations",
      path: ["regulations"],
      items: config.regulations,
      catalog: false,
    },
    ...Object.keys(config.catalogs).map((key) => ({
      key,
      path: ["catalogs", key],
      items: config.catalogs[key],
      catalog: true,
    })),
  ];
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="settings" value={JSON.stringify(config)} />
      <input type="hidden" name="revision" value={state.revision ?? revision} />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Page & publishing</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => update(["enabled"], e.target.checked)}
            />
            Enable public configurator
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "intro",
            "title",
            "description",
            "submitLabel",
            "successMessage",
            "measurementHelp",
            "reviewNote",
          ].map((key) => (
            <label
              className={`grid gap-1.5 text-sm font-medium ${["description", "measurementHelp", "reviewNote"].includes(key) ? "md:col-span-2" : ""}`}
              key={key}
            >
              {key.replace(/([A-Z])/g, " $1")}
              <textarea
                rows={key === "description" ? 2 : 1}
                className={inputClass}
                value={config[key]}
                maxLength={1500}
                required
                onChange={(e) => update([key], e.target.value)}
              />
            </label>
          ))}
        </div>
      </div>
      <details
        className="rounded-2xl border border-slate-200 bg-white p-5"
        open
      >
        <summary className="cursor-pointer text-lg font-semibold">
          Input labels & limits
        </summary>
        <p className="my-3 text-sm text-slate-500">
          All distances use mm. Floors stay between 2 and 50. Changes are
          validated again on the server.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {["Field", "Label", "Minimum", "Maximum", "Step"].map((x) => (
                  <th className="p-2" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(config.fields).map(([key, f]: [string, any]) => (
                <tr key={key}>
                  <td className="p-2">{key}</td>
                  {["label", "min", "max", "step"].map((prop) => (
                    <td className="min-w-24 p-2" key={prop}>
                      <input
                        aria-label={`${key} ${prop}`}
                        className={inputClass}
                        type={prop === "label" ? "text" : "number"}
                        step="any"
                        value={f[prop]}
                        required
                        onChange={(e) =>
                          update(
                            ["fields", key, prop],
                            prop === "label"
                              ? e.target.value
                              : Number(e.target.value),
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      {groups.map(({ key, path, items, catalog }) => (
        <details
          key={key}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <summary className="cursor-pointer text-base font-semibold">
            {names[key] || key}{" "}
            <span className="ml-2 text-sm font-normal text-slate-500">
              {items.filter((x: any) => x.enabled).length} enabled /{" "}
              {items.length}
            </span>
          </summary>
          <div className="mt-5 space-y-4">
            {items.map((item: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) =>
                        update([...path, index, "enabled"], e.target.checked)
                      }
                    />
                    Enabled
                  </label>
                  <div className="ml-auto flex gap-2">
                    {[-1, 1].map((direction) => (
                      <button
                        type="button"
                        key={direction}
                        className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-30"
                        disabled={
                          index + direction < 0 ||
                          index + direction >= items.length
                        }
                        aria-label={`Move ${item.label} ${direction < 0 ? "up" : "down"}`}
                        onClick={() => {
                          const next = [...items];
                          [next[index], next[index + direction]] = [
                            next[index + direction],
                            next[index],
                          ];
                          update(path, next);
                        }}
                      >
                        {direction < 0 ? "↑ Up" : "↓ Down"}
                      </button>
                    ))}
                    <button
                      className="text-xs text-red-700"
                      type="button"
                      onClick={() =>
                        update(
                          path,
                          items.filter((_: any, i: number) => i !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "id",
                    "label",
                    ...(key === "capacities" ? ["dimensions", "speed"] : []),
                    ...(catalog ? ["description", "image"] : []),
                  ].map((prop) => (
                    <label
                      key={prop}
                      className="grid gap-1 text-xs font-medium"
                    >
                      {prop}
                      <input
                        className={inputClass}
                        type={prop === "speed" ? "number" : "text"}
                        step="any"
                        value={item[prop] ?? ""}
                        required={[
                          "id",
                          "label",
                          "dimensions",
                          "speed",
                          "image",
                        ].includes(prop)}
                        onChange={(e) =>
                          update(
                            [...path, index, prop],
                            prop === "speed"
                              ? Number(e.target.value)
                              : e.target.value,
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
                {catalog && (
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {item.image && (
                      <img
                        className="h-24 w-24 rounded-lg bg-white object-contain"
                        src={`${website}${item.image}`}
                        alt={item.label}
                      />
                    )}
                    <label className="text-xs font-medium">
                      Upload replacement (JPG, PNG, WebP, max 2 MB)
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={!!uploading}
                        className="mt-2 block text-xs"
                        onChange={(e) => {
                          if (e.target.files?.[0])
                            void upload([...path, index], e.target.files[0]);
                        }}
                      />
                    </label>
                    {uploading === [...path, index].join(".") && (
                      <span role="status">Uploading…</span>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold"
              onClick={() =>
                update(path, [
                  ...items,
                  {
                    id: `new-${items.length + 1}`,
                    label: "New option",
                    enabled: true,
                    ...(key === "capacities"
                      ? {
                          dimensions: config.options.cabinDimensions[0].id,
                          speed: 1,
                        }
                      : {}),
                    ...(catalog ? { description: "", image: "" } : {}),
                  },
                ])
              }
            >
              + Add option
            </button>
          </div>
        </details>
      ))}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <button
          className="rounded-lg bg-[#006699] px-6 py-3 font-semibold text-white disabled:opacity-50"
          disabled={pending || !!uploading}
        >
          {pending ? "Publishing…" : "Publish configurator"}
        </button>
        <span className="text-sm text-slate-500">
          Changes apply to new requests immediately.
        </span>
        {state.error && (
          <p role="alert" className="w-full text-sm text-red-700">
            {state.error}
          </p>
        )}
        {uploadError && (
          <p role="alert" className="w-full text-sm text-red-700">
            {uploadError}
          </p>
        )}
        {state.success && (
          <p role="status" className="w-full text-sm text-green-700">
            {state.success}
          </p>
        )}
      </div>
    </form>
  );
}
