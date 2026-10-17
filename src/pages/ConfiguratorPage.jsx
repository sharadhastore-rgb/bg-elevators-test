import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  RotateCcw,
  Ruler,
  Layers,
  Palette,
  Send,
  Download,
  X,
  Plus,
  Minus,
} from "lucide-react";
import {
  calculateConfiguration,
  enabledItems,
  initialConfiguration,
  validateConfiguration,
} from "../../shared/configurator.js";
import "./configurator.css";
const categoryLabels = {
  wallDesign: "Cabin appearance",
  controlPanel: "Control panel",
  ceilingDesign: "Ceiling",
  floorDesign: "Floor",
  accessory: "Accessories",
};
const optionLabels = {
  door1Opening: "First door opening",
  door2Opening: "Second door opening",
  usageType: "Elevator usage type",
  safetySpace: "Available space beneath the shaft",
  wallRear: "Rear wall",
  wallLeft: "Left wall",
  wallRight: "Right wall",
  cabinDimensions: "Cabin dimensions (W × D mm)",
  cabinHeight: "Cabin height (mm)",
};
const format = (n) => Number(n).toLocaleString("en-IN");
function Field({ field, value, onChange, name }) {
  return (
    <label className="cfg-field">
      <span>
        {field.label} <i>*</i>
      </span>
      <div className="cfg-input">
        <input
          name={name}
          type="number"
          inputMode="decimal"
          required
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          placeholder={`${field.min}–${field.max}`}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>{field.unit}</span>
      </div>
      <small>
        {format(field.min)}–{format(field.max)} {field.unit}
      </small>
    </label>
  );
}
function Gallery({ items, name, value, onChange }) {
  const [search, setSearch] = useState("");
  const enabled = enabledItems(items),
    selected = enabled.find((x) => x.id === value),
    filtered = enabled.filter((x) =>
      `${x.label} ${x.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  return (
    <details className="cfg-gallery-section" open={name === "wallDesign"}>
      <summary>
        <span>
          {categoryLabels[name]} <small>{enabled.length} options</small>
        </span>
        <span>
          {selected?.label} <ChevronDown size={16} />
        </span>
      </summary>
      <div className="cfg-gallery-body">
        <input
          className="cfg-search"
          type="search"
          aria-label={`Search ${categoryLabels[name]}`}
          placeholder="Search finishes or model codes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div
          className="cfg-catalog"
          role="group"
          aria-label={categoryLabels[name]}
        >
          {filtered.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`cfg-option ${value === item.id ? "selected" : ""}`}
              aria-pressed={value === item.id}
            >
              <div className="cfg-option-image">
                {item.image && (
                  <img loading="lazy" src={item.image} alt={item.label} />
                )}
                <span className="cfg-check">
                  <Check size={13} />
                </span>
              </div>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
        {!filtered.length && <p>No matching options. Try another search.</p>}
        {selected?.description && (
          <p className="cfg-caption">{selected.description}</p>
        )}
      </div>
    </details>
  );
}
function ShaftDiagram({ state, result }) {
  const heights = state.floorHeights.map((h) => Math.max(0, Number(h) || 0));
  const gaps = heights.map((h) => Math.max(64, h * 0.035));
  const top = 145,
    bottom = top + gaps.reduce((a, b) => a + b, 0),
    height = bottom + 120;
  let y = bottom;
  const landings = [y];
  for (const gap of gaps) {
    y -= gap;
    landings.push(y);
  }
  const badge = (value, at) => (
    <g>
      <rect
        x="137"
        y={at - 15}
        width="68"
        height="31"
        rx="6"
        fill="#f6fbfd"
        stroke="#dce3e8"
      />
      <text x="171" y={at + 5} textAnchor="middle" fontSize="12" fill="#42647d">
        {value}
      </text>
    </g>
  );
  return (
    <svg
      className="cfg-shaft"
      viewBox={`0 0 370 ${height}`}
      role="img"
      aria-label={`Shaft cross-section: ${state.floorCount} floors, ${result.totalTravel} millimetres travel, ${result.shaftHeight} millimetres overall shaft height`}
    >
      <g fill="none" stroke="#8b9197" strokeWidth="1">
        <path
          d={`M80 35H267V60H313V30L304 10H40V${height - 10}H306V${bottom + 20}H359V${bottom}H267V${height - 35}H80Z`}
        />
        <path d={`M40 ${top}H80M40 ${bottom}H80`} />
        <path d={`M40 10H18V${height - 10}H40`} stroke="#dce3e8" />
        <path d={`M171 50V${height - 52}`} />
        <path
          d={`M104 ${top}V${bottom}`}
          stroke="#dce3e8"
          strokeDasharray="7 7"
        />
      </g>
      <text x="171" y="45" textAnchor="middle" fontSize="11" fill="#647985">
        Shaft headroom
      </text>
      {badge(Number(state.ceilingHeight) || 0, 82)}
      {landings.map((at, i) => (
        <g key={i}>
          <line
            x1={i === 0 || i === landings.length - 1 ? 104 : 180}
            x2="267"
            y1={at}
            y2={at}
            stroke="#dce3e8"
            strokeDasharray="7 7"
          />
          {i > 0 && (
            <path
              d={`M267 ${at}H359V${at + 20}H313V${at + 8}H267Z`}
              fill="white"
              stroke="#8b9197"
            />
          )}
          <text
            x="340"
            y={at - 12}
            textAnchor="middle"
            fontSize="13"
            fill="#737b83"
          >
            {i + 1}
          </text>
          {i < gaps.length && badge(heights[i], (at + landings[i + 1]) / 2)}
        </g>
      ))}
      {badge(Number(state.pitDepth) || 0, bottom + 48)}
      <text
        x="171"
        y={height - 47}
        textAnchor="middle"
        fontSize="11"
        fill="#647985"
      >
        Shaft pit
      </text>
      {[
        ["Shaft height", 18, (height + 10) / 2, 100],
        ["Travel", 104, (top + bottom) / 2, 65],
      ].map(([label, x, at, w]) => (
        <g key={label} transform={`translate(${x},${at}) rotate(-90)`}>
          <rect
            x={-w / 2}
            y="-15"
            width={w}
            height="30"
            rx="6"
            fill="#f6fbfd"
            stroke="#dce3e8"
          />
          <text textAnchor="middle" y="4" fontSize="10" fill="#42647d">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}
export default function ConfiguratorPage() {
  const [config, setConfig] = useState(null),
    [revision, setRevision] = useState(0),
    [state, setState] = useState(null),
    [loadingError, setLoadingError] = useState(""),
    [step, setStep] = useState(1),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [receipt, setReceipt] = useState(null);
  const technicalForm = useRef(null),
    dialog = useRef(null),
    heading = useRef(null),
    sending = useRef(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/configurator", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message);
        if (!cancelled) {
          setConfig(data.settings);
          setRevision(data.revision);
          setState(initialConfiguration(data.settings));
        }
      })
      .catch((e) => {
        if (!cancelled)
          setLoadingError(e.message || "Unable to load the configurator.");
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const change = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setError("");
  };
  if (!config || !state)
    return (
      <div className="bg-configurator cfg-loading" aria-live="polite">
        {loadingError ? (
          <>
            <h1>Configurator unavailable</h1>
            <p>{loadingError}</p>
            <button
              className="cfg-primary"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </>
        ) : (
          <>
            <Ruler size={32} />
            <h1>Preparing your configurator…</h1>
            <p>Loading the latest options from BG Elevators.</p>
          </>
        )}
      </div>
    );
  const result = calculateConfiguration(state, config),
    selectedCabin = config.catalogs.wallDesign.find(
      (x) => x.id === state.wallDesign,
    );
  function floorCount(value) {
    const n = Math.max(
      config.fields.floorCount.min,
      Math.min(config.fields.floorCount.max, Number(value)),
    );
    setState((prev) => ({
      ...prev,
      floorCount: n,
      floorHeights: Array.from(
        { length: n - 1 },
        (_, i) =>
          prev.floorHeights[i] ??
          Math.min(
            config.fields.floorHeight.max,
            Math.max(config.fields.floorHeight.min, 3000),
          ),
      ),
    }));
    setError("");
  }
  function capacity(id) {
    const option = config.capacities.find((x) => x.id === id);
    setState((prev) => ({
      ...prev,
      capacity: id,
      cabinDimensions: option.dimensions,
      speed: option.speed,
    }));
    setError("");
  }
  function next() {
    if (technicalForm.current && !technicalForm.current.reportValidity())
      return;
    try {
      validateConfiguration(state, config, true);
      setError("");
      setStep(2);
      heading.current?.focus();
    } catch (e) {
      setError(e.message);
    }
  }
  function submitDialog() {
    try {
      validateConfiguration(state, config);
      setError("");
      dialog.current.showModal();
    } catch (e) {
      setStep(1);
      setError(e.message);
      heading.current?.focus();
    }
  }
  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    const data = new FormData(event.currentTarget);
    data.set("configuration", JSON.stringify(state));
    data.set("revision", String(revision));
    data.set("consent", String(data.get("consent") === "on"));
    data.set("marketing", String(data.get("marketing") === "on"));
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/configurator/requests", {
        method: "POST",
        body: data,
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.message || "Unable to save your request.");
      setReceipt(body);
      dialog.current.close();
      heading.current?.focus();
    } catch (e) {
      setError(e.message || "Connection interrupted. Please try again.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  const select = (key) => (
    <label className="cfg-field" key={key}>
      <span>{optionLabels[key]}</span>
      <select
        value={state[key] ?? ""}
        onChange={(e) => change(key, e.target.value)}
      >
        {enabledItems(config.options[key]).map((x) => (
          <option value={x.id} key={x.id}>
            {x.label}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="bg-configurator">
      <div className="cfg-hero">
        <div>
          <span className="cfg-eyebrow">{config.intro}</span>
          <h1 ref={heading} tabIndex={-1}>
            {config.title}
          </h1>
          <p>{config.description}</p>
        </div>
        <div className="cfg-hero-mark">
          <Ruler size={28} />
          <span>
            Designed around
            <br />
            <strong>your building.</strong>
          </span>
        </div>
      </div>
      {receipt ? (
        <div className="cfg-receipt" role="status">
          <Check size={44} />
          <h2>Configuration received</h2>
          <p>{receipt.message}</p>
          <p>
            Reference: <strong>{receipt.reference}</strong>
          </p>
          <button
            className="cfg-primary"
            onClick={() => {
              setReceipt(null);
              setState(initialConfiguration(config));
              setStep(1);
            }}
          >
            Configure another elevator
          </button>
        </div>
      ) : (
        <>
          <div className="cfg-topbar">
            <nav aria-label="Configuration steps">
              <button
                className={step === 1 ? "active" : ""}
                aria-current={step === 1 ? "step" : undefined}
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                <span>01</span>Dimensions & specifications
              </button>
              <button
                className={step === 2 ? "active" : ""}
                aria-current={step === 2 ? "step" : undefined}
                onClick={next}
              >
                <span>02</span>Cabin appearance
              </button>
            </nav>
            <div className="cfg-progress">
              <span>
                Configuration progress <strong>{result.progress}%</strong>
              </span>
              <progress
                max="100"
                value={result.progress}
                aria-label="Configuration progress"
              />
            </div>
          </div>
          <div className="cfg-workspace">
            <div className="cfg-main">
              {error && !dialog.current?.open && (
                <p className="cfg-error" role="alert">
                  {error}
                </p>
              )}
              {step === 1 ? (
                <form
                  ref={technicalForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                    next();
                  }}
                >
                  <section className="cfg-card">
                    <div className="cfg-section-heading">
                      <Ruler size={20} />
                      <div>
                        <h2>Shaft dimensions</h2>
                        <p>Start with the available space in your building.</p>
                      </div>
                    </div>
                    <div className="cfg-grid">
                      {["shaftWidth", "shaftDepth"].map((key) => (
                        <Field
                          name={key}
                          key={key}
                          field={config.fields[key]}
                          value={state[key]}
                          onChange={(v) => change(key, v)}
                        />
                      ))}
                    </div>
                  </section>
                  <section className="cfg-card">
                    <h2>Pit and headroom of the shaft</h2>
                    <div className="cfg-grid">
                      {["pitDepth", "ceilingHeight"].map((key) => (
                        <Field
                          key={key}
                          name={key}
                          field={config.fields[key]}
                          value={state[key]}
                          onChange={(v) => change(key, v)}
                        />
                      ))}
                    </div>
                    <details className="cfg-help">
                      <summary>How should I measure the shaft?</summary>
                      <p>{config.measurementHelp}</p>
                    </details>
                  </section>
                  <section className="cfg-card">
                    <div className="cfg-section-heading">
                      <Layers size={20} />
                      <div>
                        <h2>Floors & travel</h2>
                        <p>
                          One inter-floor height for each gap between landings.
                        </p>
                      </div>
                    </div>
                    <div className="cfg-floor-bar">
                      <div>
                        <span>{config.fields.floorCount.label}</span>
                        <div className="cfg-stepper">
                          <button
                            type="button"
                            aria-label="Remove a floor"
                            disabled={
                              state.floorCount <= config.fields.floorCount.min
                            }
                            onClick={() => floorCount(state.floorCount - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <output>{state.floorCount}</output>
                          <button
                            type="button"
                            aria-label="Add a floor"
                            disabled={
                              state.floorCount >= config.fields.floorCount.max
                            }
                            onClick={() => floorCount(state.floorCount + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="cfg-travel">
                        <small>TOTAL TRAVEL</small>
                        <strong>
                          {format(result.totalTravel)} <span>mm</span>
                        </strong>
                        <small>
                          {result.travelMetres.toFixed(2)} metres ·{" "}
                          {state.floorCount - 1} inter-floor gaps
                        </small>
                      </div>
                    </div>
                    <div className="cfg-grid">
                      {state.floorHeights.map((value, i) => (
                        <Field
                          key={i}
                          name={`floor-height-${i}`}
                          field={{
                            ...config.fields.floorHeight,
                            label: `Floor ${i + 1} → Floor ${i + 2}`,
                          }}
                          value={value}
                          onChange={(v) =>
                            change(
                              "floorHeights",
                              state.floorHeights.map((h, j) =>
                                j === i ? v : h,
                              ),
                            )
                          }
                        />
                      ))}
                    </div>
                    {state.floorHeights.length > 1 && (
                      <button
                        type="button"
                        className="cfg-text-button"
                        disabled={!state.floorHeights[0]}
                        onClick={() =>
                          change(
                            "floorHeights",
                            state.floorHeights.map(() => state.floorHeights[0]),
                          )
                        }
                      >
                        Apply first height to all floors
                      </button>
                    )}
                  </section>
                  <section className="cfg-card">
                    <h2>Door configuration</h2>
                    <div className="cfg-door-options">
                      {enabledItems(config.options.doorConfig).map((x) => (
                        <button
                          type="button"
                          key={x.id}
                          aria-pressed={state.doorConfig === x.id}
                          className={
                            state.doorConfig === x.id ? "selected" : ""
                          }
                          onClick={() => change("doorConfig", x.id)}
                        >
                          <svg viewBox="0 0 80 65" aria-hidden="true">
                            <rect
                              x="16"
                              y="8"
                              width="48"
                              height="48"
                              rx="3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <line
                              x1="28"
                              x2="52"
                              y1="56"
                              y2="56"
                              stroke="#f19000"
                              strokeWidth="5"
                            />
                            {x.id !== "1" && (
                              <line
                                x1={
                                  x.id === "90"
                                    ? "64"
                                    : x.id === "270"
                                      ? "16"
                                      : "28"
                                }
                                x2={
                                  x.id === "90"
                                    ? "64"
                                    : x.id === "270"
                                      ? "16"
                                      : "52"
                                }
                                y1={x.id === "180" ? "8" : "20"}
                                y2={x.id === "180" ? "8" : "44"}
                                stroke="#f19000"
                                strokeWidth="5"
                              />
                            )}
                          </svg>
                          {x.label}
                        </button>
                      ))}
                    </div>
                    <div className="cfg-grid">
                      {select("door1Opening")}
                      {state.doorConfig !== "1" && select("door2Opening")}
                    </div>
                  </section>
                  <section className="cfg-card">
                    <h2>Usage & shaft materials</h2>
                    <div className="cfg-grid">
                      {[
                        "usageType",
                        "safetySpace",
                        "wallRear",
                        "wallLeft",
                        "wallRight",
                      ].map(select)}
                    </div>
                  </section>
                  <section className="cfg-card">
                    <h2>Regulatory provisions</h2>
                    <p className="cfg-caption">
                      Select the provisions to discuss with your project team.
                    </p>
                    <div className="cfg-checkboxes">
                      {enabledItems(config.regulations).map((x) => (
                        <label key={x.id}>
                          <input
                            type="checkbox"
                            disabled={x.id === "EN81-20"}
                            checked={state.regulations.includes(x.id)}
                            onChange={(e) =>
                              change(
                                "regulations",
                                e.target.checked
                                  ? [...state.regulations, x.id]
                                  : state.regulations.filter(
                                      (id) => id !== x.id,
                                    ),
                              )
                            }
                          />
                          {x.label}
                        </label>
                      ))}
                    </div>
                  </section>
                  <section className="cfg-card">
                    <h2>Cabin specifications</h2>
                    <p className="cfg-caption">
                      Capacity updates the recommended cabin size and speed. You
                      can adjust them below.
                    </p>
                    <span className="cfg-field-label">Capacity (kg)</span>
                    <div className="cfg-capacities">
                      {enabledItems(config.capacities).map((x) => (
                        <button
                          key={x.id}
                          type="button"
                          aria-pressed={state.capacity === x.id}
                          className={state.capacity === x.id ? "selected" : ""}
                          onClick={() => capacity(x.id)}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                    <div className="cfg-grid">
                      <Field
                        name="speed"
                        field={config.fields.speed}
                        value={state.speed}
                        onChange={(v) => change("speed", v)}
                      />
                      {select("cabinDimensions")}
                      {select("cabinHeight")}
                    </div>
                  </section>
                  <button className="cfg-primary cfg-next" type="submit">
                    Next: cabin appearance <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
                <div>
                  <section className="cfg-card cfg-appearance-heading">
                    <Palette size={24} />
                    <div>
                      <h2>Make it yours.</h2>
                      <p>
                        Explore finishes and details for your elevator cabin.
                      </p>
                    </div>
                  </section>
                  {Object.entries(config.catalogs).map(([name, items]) => (
                    <Gallery
                      key={name}
                      name={name}
                      items={items}
                      value={state[name]}
                      onChange={(v) => change(name, v)}
                    />
                  ))}
                  <section className="cfg-card">
                    <label className="cfg-second-panel">
                      <input
                        type="checkbox"
                        checked={state.secondPanel}
                        onChange={(e) =>
                          change("secondPanel", e.target.checked)
                        }
                      />
                      Add a second control panel{" "}
                      <strong>
                        {result.panelCount} panel
                        {result.panelCount === 2 ? "s" : ""}
                      </strong>
                    </label>
                  </section>
                  <div className="cfg-actions">
                    <button
                      className="cfg-secondary"
                      onClick={() => {
                        setStep(1);
                        heading.current?.focus();
                      }}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button className="cfg-primary" onClick={submitDialog}>
                      {config.submitLabel}
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <aside className="cfg-summary">
              <div className="cfg-visualization">
                <div className="cfg-summary-header">
                  <span>
                    {step === 1 ? "SHAFT DIAGRAM" : "CABIN APPEARANCE"}
                  </span>
                </div>
                {step === 1 ? (
                  <div className="cfg-shaft-scroll">
                    <ShaftDiagram state={state} result={result} />
                  </div>
                ) : (
                  <div className="cfg-preview">
                    <img src={selectedCabin.image} alt={selectedCabin.label} />
                    <span>{selectedCabin.label}</span>
                  </div>
                )}
              </div>
              <dl className="cfg-summary-specs">
                {[
                  ["Floors", state.floorCount],
                  ["Total travel", `${format(result.totalTravel)} mm`],
                  ["Capacity", `${state.capacity} kg`],
                  [
                    "Doors",
                    config.options.doorConfig.find(
                      (x) => x.id === state.doorConfig,
                    )?.label,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <dl className="cfg-summary-finishes">
                {[
                  ["Walls", "wallDesign"],
                  ["Ceiling", "ceilingDesign"],
                  ["Floor", "floorDesign"],
                  ["Panel", "controlPanel"],
                  ["Accessories", "accessory"],
                ].map(([label, key]) => {
                  const item = config.catalogs[key].find(
                    (x) => x.id === state[key],
                  );
                  const name =
                    item?.label === "Без аксесоар"
                      ? "No accessory"
                      : item?.label;
                  return (
                    <div key={key}>
                      <dt>{label}</dt>
                      <dd>
                        {name}
                        {key === "controlPanel"
                          ? ` (${result.panelCount} ${result.panelCount === 1 ? "pc." : "pcs."})`
                          : ""}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <div className="cfg-summary-action">
                <button
                  type="button"
                  className="cfg-primary"
                  onClick={submitDialog}
                >
                  <Send size={16} />
                  {config.submitLabel}
                </button>
                {result.warnings.map((w) => (
                  <p key={w} className="cfg-warning">
                    {w}
                  </p>
                ))}
                <details className="cfg-summary-details">
                  <summary>Full specification & tools</summary>
                  <dl>
                    {[
                      ["Shaft width", `${format(state.shaftWidth || 0)} mm`],
                      ["Shaft depth", `${format(state.shaftDepth || 0)} mm`],
                      ["Pit depth", `${format(state.pitDepth || 0)} mm`],
                      ["Headroom", `${format(state.ceilingHeight || 0)} mm`],
                      [
                        "Overall shaft height",
                        `${format(result.shaftHeight)} mm`,
                      ],
                      ["Cabin", `${state.cabinDimensions} mm`],
                      ["Cabin height", `${state.cabinHeight} mm`],
                      ["Speed", `${state.speed} m/s`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="cfg-caption">{config.reviewNote}</p>
                  <button
                    type="button"
                    className="cfg-print cfg-text-button"
                    onClick={() => window.print()}
                  >
                    <Download size={15} />
                    Print / save summary
                  </button>
                  <button
                    type="button"
                    className="cfg-text-button"
                    onClick={() => {
                      if (
                        window.confirm("Clear all selections and start again?")
                      ) {
                        setState(initialConfiguration(config));
                        setStep(1);
                        setError("");
                      }
                    }}
                  >
                    <RotateCcw size={15} />
                    Reset configuration
                  </button>
                </details>
              </div>
            </aside>
          </div>
        </>
      )}
      <dialog
        ref={dialog}
        aria-labelledby="cfg-request-title"
        className="cfg-dialog"
        onCancel={() => setError("")}
      >
        <div className="cfg-dialog-top">
          <span className="cfg-eyebrow">YOUR PROJECT BRIEF</span>
          <button
            type="button"
            aria-label="Close request form"
            onClick={() => dialog.current.close()}
          >
            <X size={22} />
          </button>
        </div>
        <h2 id="cfg-request-title">Let’s bring it to life.</h2>
        <p>
          Send your configuration to BG Elevators for review and a quotation.
        </p>
        <form onSubmit={submit}>
          <div className="cfg-grid">
            {[
              ["name", "Full name", true],
              ["email", "Email address", true],
              ["phone", "Phone", false],
              ["projectName", "Project name", false],
              ["country", "Country", false],
              ["city", "City / locality", false],
              ["district", "District", false],
              ["address", "Address", false],
              ["plot", "Plot", false],
            ].map(([key, label, required]) => (
              <label className="cfg-field" key={key}>
                <span>
                  {label}
                  {required ? " *" : ""}
                </span>
                <input
                  name={key}
                  type={
                    key === "email" ? "email" : key === "phone" ? "tel" : "text"
                  }
                  required={required}
                  maxLength={512}
                />
              </label>
            ))}
          </div>
          <label className="cfg-field cfg-upload">
            <span>Attach a building drawing (optional)</span>
            <input
              type="file"
              name="drawing"
              accept=".pdf,.dwg"
              onChange={(e) => {
                const file = e.target.files[0];
                e.target.setCustomValidity(
                  file && file.size > 10 * 1024 * 1024
                    ? "Choose a file smaller than 10 MB."
                    : "",
                );
              }}
            />
            <small>
              PDF or DWG · maximum 10 MB · private to your project team
            </small>
          </label>
          <div className="cfg-honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="cfg-checkboxes">
            <label>
              <input type="checkbox" name="consent" required />I agree to the{" "}
              <a href="/privacy-policy" target="_blank" rel="noreferrer">
                privacy policy
              </a>
              . *
            </label>
            <label>
              <input type="checkbox" name="marketing" />I would like to receive
              marketing communications.
            </label>
          </div>
          {error && (
            <p className="cfg-error" role="alert">
              {error}
            </p>
          )}
          <button className="cfg-primary" disabled={busy}>
            {busy ? "Saving your configuration…" : config.submitLabel}
            <Send size={16} />
          </button>
        </form>
      </dialog>
    </div>
  );
}
