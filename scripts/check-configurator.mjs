import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createApp } from "../server/app.js";
import {
  defaultConfigurator as config,
  initialConfiguration,
  calculateConfiguration,
  validateConfiguration,
  validateConfiguratorSettings,
} from "../shared/configurator.js";
let checks = 0;
const check = (fn) => {
  fn();
  checks++;
};
check(() =>
  assert.equal(validateConfiguratorSettings(config).capacities.length, 7),
);
const valid = {
  ...initialConfiguration(config),
  shaftWidth: 1700,
  shaftDepth: 1900,
  pitDepth: 1200,
  ceilingHeight: 3500,
  floorCount: 4,
  floorHeights: [2800, 3100, 3200],
};
check(() =>
  assert.equal(validateConfiguration(valid, config).totalTravel, 9100),
);
check(() =>
  assert.equal(validateConfiguration(valid, config).shaftHeight, 13800),
);
check(() =>
  assert.equal(
    calculateConfiguration({ ...valid, secondPanel: true }, config).panelCount,
    2,
  ),
);
check(() =>
  assert.equal(
    validateConfiguration({ ...valid, totalTravel: 999999 }, config)
      .totalTravel,
    9100,
  ),
);
check(() =>
  assert.throws(
    () => validateConfiguration({ ...valid, floorHeights: [3000] }, config),
    /inter-floor/,
  ),
);
check(() =>
  assert.throws(
    () => validateConfiguration({ ...valid, shaftWidth: -1 }, config),
    /Shaft width/,
  ),
);
check(() =>
  assert.throws(
    () => validateConfiguration({ ...valid, floorCount: 4.5 }, config),
    /floors/i,
  ),
);
check(() =>
  assert.throws(
    () => validateConfiguration({ ...valid, capacity: "123" }, config),
    /capacity/,
  ),
);
check(() =>
  assert.throws(
    () => validateConfiguration({ ...valid, regulations: [] }, config),
    /EN81-20/,
  ),
);
check(() =>
  assert.throws(
    () => validateConfiguration({ ...valid, speed: Infinity }, config),
    /Speed/,
  ),
);
check(() =>
  assert.equal(
    validateConfiguration(
      { ...valid, doorConfig: "1", door2Opening: "tampered" },
      config,
    ).door2Opening,
    null,
  ),
);
for (const [capacity, dimensions, speed] of [
  ["450", "850 x 1400", 1],
  ["630", "1100 x 1400", 1],
  ["1000", "1450 x 1600", 1.6],
  ["1250", "1450 x 1900", 1.6],
  ["1350", "1550 x 1900", 1.75],
  ["1600", "1800 x 1900", 2],
  ["2000", "2200 x 1900", 2.5],
])
  check(() =>
    assert.deepEqual(
      [
        config.capacities.find((x) => x.id === capacity).dimensions,
        config.capacities.find((x) => x.id === capacity).speed,
      ],
      [dimensions, speed],
    ),
  );
const changed = structuredClone(config);
changed.capacities[1].speed = 1.2;
changed.title = "CMS edited title";
check(() =>
  assert.equal(validateConfiguratorSettings(changed).title, "CMS edited title"),
);
check(() => assert.equal(initialConfiguration(changed).speed, 1.2));
const bad = structuredClone(config);
bad.options.cabinDimensions = [];
check(() => assert.throws(() => validateConfiguratorSettings(bad)));
const duplicate = structuredClone(config);
duplicate.capacities.push(duplicate.capacities[0]);
check(() =>
  assert.throws(() => validateConfiguratorSettings(duplicate), /duplicate/),
);
const image = structuredClone(config);
image.catalogs.wallDesign[0].image = "javascript:alert(1)";
check(() => assert.throws(() => validateConfiguratorSettings(image), /image/));
for (const items of Object.values(config.catalogs))
  for (const item of items)
    await readFile(new URL(`../public${item.image}`, import.meta.url));
let settings = config,
  revision = 0,
  saved = [];
const store = {
  getConfigurator: async () => ({ settings, revision }),
  getConfiguratorAsset: async () => null,
  saveConfiguratorRequest: async (data) => {
    saved.push(data);
    return { _id: "507f1f77bcf86cd799439011" };
  },
};
const server = createApp({ repository: store, config: {} }).listen(
  0,
  "127.0.0.1",
);
await once(server, "listening");
const base = `http://127.0.0.1:${server.address().port}`;
function body(overrides = {}, drawing) {
  const data = new FormData();
  data.set("configuration", JSON.stringify(valid));
  data.set("revision", "0");
  data.set("name", "Test Customer");
  data.set("email", "customer@example.com");
  data.set("consent", "true");
  for (const [k, v] of Object.entries(overrides)) data.set(k, v);
  if (drawing) data.set("drawing", drawing, "drawing.pdf");
  return data;
}
try {
  let r = await fetch(`${base}/api/configurator`);
  check(() => assert.equal(r.status, 200));
  check(() => assert.equal(r.headers.get("cache-control"), "no-store"));
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body(),
  });
  check(() => assert.equal(r.status, 201));
  check(() => assert.equal(saved[0].specification.totalTravel, 9100));
  check(() => assert.equal(saved[0].selections.capacity.label, "630 kg"));
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body({ consent: "false" }),
  });
  check(() => assert.equal(r.status, 400));
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body({ revision: "1" }),
  });
  check(() => assert.equal(r.status, 409));
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body({}, new Blob(["fake PDF"])),
  });
  check(() => assert.equal(r.status, 400));
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body({}, new Blob(["%PDF-1.7\nTest drawing"])),
  });
  check(() => assert.equal(r.status, 201));
  check(() => assert.equal(saved[1].drawing.contentType, "application/pdf"));
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body({
      configuration: JSON.stringify({ ...valid, capacity: "tampered" }),
    }),
  });
  check(() => assert.equal(r.status, 400));
  settings = { ...config, enabled: false };
  r = await fetch(`${base}/api/configurator`);
  check(() => assert.equal(r.status, 404));
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body(),
  });
  check(() => assert.equal(r.status, 409));
  settings = config;
  await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body(),
  });
  r = await fetch(`${base}/api/configurator/requests`, {
    method: "POST",
    body: body(),
  });
  check(() => assert.equal(r.status, 429));
  r = await fetch(`${base}/api/configurator/assets/invalid`);
  check(() => assert.equal(r.status, 404));
  r = await fetch(`${base}/not-a-real-page`);
  check(() => assert.equal(r.status, 404));
  check(() => assert.match(r.headers.get("content-type"), /text\/html/));
  store.getConfigurator = async () => {
    throw new Error("Database offline");
  };
  r = await fetch(`${base}/api/configurator`);
  check(() => assert.equal(r.status, 503));
} finally {
  server.close();
  server.closeAllConnections();
}
console.log(
  `Configurator: ${checks} checks passed; all 148 local catalog images verified.`,
);
