import defaults from "./configurator-defaults.json" with { type: "json" };
export const defaultConfigurator = defaults;
export const enabledItems = (items) =>
  items.filter((item) => item.enabled !== false);
export const statuses = ["New", "Contacted", "In Progress", "Quoted", "Closed"];
const fail = (message) => {
  throw new Error(message);
};
const finite = (value) =>
  value !== "" &&
  value !== null &&
  value !== undefined &&
  Number.isFinite(Number(value));
export function initialConfiguration(config = defaults) {
  const capacity =
    enabledItems(config.capacities).find((x) => x.id === "630") ||
    enabledItems(config.capacities)[0];
  const state = {
    shaftWidth: "",
    shaftDepth: "",
    pitDepth: "",
    ceilingHeight: "",
    floorCount: config.fields.floorCount.min,
    floorHeights: Array(config.fields.floorCount.min - 1).fill(
      Math.min(
        config.fields.floorHeight.max,
        Math.max(config.fields.floorHeight.min, 3000),
      ),
    ),
    capacity: capacity.id,
    speed: capacity.speed,
    cabinDimensions: capacity.dimensions,
    secondPanel: false,
    regulations: ["EN81-20"],
  };
  for (const [key, items] of Object.entries(config.options))
    state[key] = enabledItems(items)[0].id;
  state.cabinDimensions = capacity.dimensions;
  state.cabinHeight =
    enabledItems(config.options.cabinHeight).find((x) => x.id === "2200")?.id ||
    enabledItems(config.options.cabinHeight)[0].id;
  for (const [key, items] of Object.entries(config.catalogs))
    state[key] = enabledItems(items)[0].id;
  return state;
}
export function calculateConfiguration(state, config = defaults) {
  const heights = Array.isArray(state.floorHeights) ? state.floorHeights : [];
  const totalTravel = heights.reduce(
    (sum, h) => sum + (finite(h) && Number(h) > 0 ? Number(h) : 0),
    0,
  );
  const checks = [
    state.shaftWidth,
    state.shaftDepth,
    state.pitDepth,
    state.ceilingHeight,
  ].map((v) => finite(v) && Number(v) > 0);
  checks.push(
    heights.length === Number(state.floorCount) - 1 &&
      heights.length > 0 &&
      heights.every((h) => finite(h) && Number(h) > 0),
    Number(state.floorCount) >= 2,
    !!state.capacity,
    !!state.cabinDimensions,
    !!state.wallDesign,
    !!state.ceilingDesign,
    !!state.floorDesign,
  );
  const warnings = [];
  const dims = String(state.cabinDimensions)
    .split(/\s*x\s*/)
    .map(Number);
  if (
    dims.length === 2 &&
    ((Number(state.shaftWidth) > 0 && dims[0] >= Number(state.shaftWidth)) ||
      (Number(state.shaftDepth) > 0 && dims[1] >= Number(state.shaftDepth)))
  )
    warnings.push(
      "The cabin dimensions reach or exceed the shaft dimensions. Review the project dimensions with our team.",
    );
  return {
    totalTravel,
    travelMetres: totalTravel / 1000,
    shaftHeight:
      totalTravel +
      (Number(state.pitDepth) || 0) +
      (Number(state.ceilingHeight) || 0),
    panelCount: state.secondPanel === true ? 2 : 1,
    progress: Math.round((checks.filter(Boolean).length / checks.length) * 100),
    warnings,
  };
}
export function validateConfiguration(
  input,
  config = defaults,
  technicalOnly = false,
) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    fail("Invalid configuration.");
  const state = {};
  for (const key of [
    "shaftWidth",
    "shaftDepth",
    "pitDepth",
    "ceilingHeight",
    "floorCount",
    "speed",
  ]) {
    const field = config.fields[key],
      value = Number(input[key]);
    if (
      !finite(input[key]) ||
      value < field.min ||
      value > field.max ||
      (key !== "speed" && !Number.isInteger(value))
    )
      fail(
        `${field.label} must be between ${field.min} and ${field.max} ${field.unit}.`,
      );
    state[key] = value;
  }
  if (
    !Array.isArray(input.floorHeights) ||
    input.floorHeights.length !== state.floorCount - 1
  )
    fail("Enter one height for every inter-floor gap.");
  const h = config.fields.floorHeight;
  state.floorHeights = input.floorHeights.map((value) => {
    if (
      !finite(value) ||
      !Number.isInteger(Number(value)) ||
      Number(value) < h.min ||
      Number(value) > h.max
    )
      fail(`${h.label} must be between ${h.min} and ${h.max} mm.`);
    return Number(value);
  });
  for (const [key, items] of Object.entries({
    ...config.options,
    capacity: config.capacities,
    ...(!technicalOnly ? config.catalogs : {}),
  })) {
    if (key === "door2Opening" && input.doorConfig === "1") {
      state[key] = null;
      continue;
    }
    if (!enabledItems(items).some((item) => item.id === input[key]))
      fail(
        `Choose an available ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`,
      );
    state[key] = input[key];
  }
  if (
    !Array.isArray(input.regulations) ||
    !input.regulations.includes("EN81-20") ||
    input.regulations.some(
      (id) => !enabledItems(config.regulations).some((x) => x.id === id),
    )
  )
    fail("Choose valid regulatory provisions including EN81-20.");
  state.regulations = [...new Set(input.regulations)];
  if (typeof input.secondPanel !== "boolean") fail("Invalid panel count.");
  state.secondPanel = input.secondPanel;
  return { ...state, ...calculateConfiguration(state, config) };
}
export function validateConfiguratorSettings(config) {
  if (!config || typeof config !== "object" || Array.isArray(config))
    fail("Invalid settings.");
  if (typeof config.enabled !== "boolean")
    fail("Choose whether the page is enabled.");
  for (const key of [
    "title",
    "description",
    "intro",
    "submitLabel",
    "successMessage",
    "measurementHelp",
    "reviewNote",
  ])
    if (
      typeof config[key] !== "string" ||
      !config[key].trim() ||
      config[key].length > 1500
    )
      fail(`Enter valid ${key}.`);
  for (const key of Object.keys(defaults.fields)) {
    const f = config.fields?.[key];
    if (
      !f ||
      typeof f.label !== "string" ||
      !f.label.trim() ||
      f.label.length > 100 ||
      f.unit !== defaults.fields[key].unit ||
      ![f.min, f.max, f.step].every(
        (x) => typeof x === "number" && Number.isFinite(x),
      ) ||
      f.min <= 0 ||
      f.max < f.min ||
      f.max > 1000000 ||
      f.step <= 0 ||
      f.step > f.max - f.min
    )
      fail(`Invalid limits for ${key}.`);
  }
  const fc = config.fields.floorCount;
  if (
    !Number.isInteger(fc.min) ||
    !Number.isInteger(fc.max) ||
    fc.min < 2 ||
    fc.max > 50 ||
    fc.step !== 1
  )
    fail("Floors must be whole numbers between 2 and 50, with step 1.");
  for (const group of ["options", "catalogs"]) {
    if (
      !config[group] ||
      Object.keys(config[group]).sort().join() !==
        Object.keys(defaults[group]).sort().join()
    )
      fail(`Keep the supported ${group} groups.`);
  }
  for (const [key, items] of Object.entries({
    ...config.options,
    ...config.catalogs,
    capacities: config.capacities,
    regulations: config.regulations,
  })) {
    if (
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > 200 ||
      !enabledItems(items).length
    )
      fail(`Keep at least one enabled option in ${key}.`);
    const ids = new Set();
    for (const item of items) {
      if (
        typeof item.id !== "string" ||
        !item.id.trim() ||
        item.id.length > 100 ||
        ids.has(item.id) ||
        typeof item.label !== "string" ||
        !item.label.trim() ||
        item.label.length > 200 ||
        typeof item.enabled !== "boolean"
      )
        fail(`Invalid or duplicate option in ${key}.`);
      ids.add(item.id);
      if (
        item.description !== undefined &&
        (typeof item.description !== "string" || item.description.length > 2000)
      )
        fail("Descriptions must be shorter than 2000 characters.");
      if (
        item.image !== undefined &&
        (typeof item.image !== "string" ||
          item.image.length > 1000 ||
          !/^\/images\/[a-zA-Z0-9_./ -]+$|^\/api\/configurator\/assets\/[a-f0-9]{24}$/.test(
            item.image,
          ) ||
          item.image.includes(".."))
      )
        fail("Use a local image path or upload a catalog image.");
    }
  }
  if (
    enabledItems(config.options.doorConfig).some(
      (x) => !["1", "90", "180", "270"].includes(x.id),
    )
  )
    fail("Door arrangements must use 1, 90, 180 or 270.");
  const openings = ["left", "right", "center"];
  for (const key of ["door1Opening", "door2Opening"])
    if (enabledItems(config.options[key]).some((x) => !openings.includes(x.id)))
      fail("Door opening must be left, right or center.");
  for (const item of config.options.cabinDimensions)
    if (!/^\d{3,5} x \d{3,5}$/.test(item.id))
      fail("Cabin dimensions must use W x D, for example 1100 x 1400.");
  for (const item of config.options.cabinHeight)
    if (!/^\d{3,5}$/.test(item.id))
      fail("Cabin heights must be numeric millimetres.");
  for (const item of config.capacities)
    if (
      !/^\d{2,5}$/.test(item.id) ||
      !enabledItems(config.options.cabinDimensions).some(
        (x) => x.id === item.dimensions,
      ) ||
      !finite(item.speed) ||
      Number(item.speed) < config.fields.speed.min ||
      Number(item.speed) > config.fields.speed.max
    )
      fail(
        "Each capacity needs an enabled cabin size and a speed within the configured limits.",
      );
  if (!enabledItems(config.regulations).some((x) => x.id === "EN81-20"))
    fail("EN81-20 must stay enabled.");
  return JSON.parse(JSON.stringify(config));
}
