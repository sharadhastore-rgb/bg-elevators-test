import express from "express";
import multer from "multer";
import {
  defaultConfigurator,
  resolveConfiguratorSettings,
  validateConfiguration,
} from "../shared/configurator.js";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fields: 16,
    fieldSize: 20000,
  },
});
const text = (value, max = 256) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
export function configuratorRouter(store, limit) {
  const router = express.Router();
  router.get("/", async (req, res, next) => {
    try {
      const record = await store.getConfigurator();
      const settings = resolveConfiguratorSettings(record?.settings || defaultConfigurator);
      res.set("Cache-Control", "no-store");
      if (!settings.enabled)
        return res
          .status(404)
          .json({ message: "The estimator is currently unavailable." });
      res.json({ settings, revision: record?.revision || 0 });
    } catch (error) {
      res
        .status(503)
        .json({
          message: "Unable to load the estimator. Please try again.",
        });
    }
  });
  router.get("/assets/:id", async (req, res, next) => {
    try {
      if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.sendStatus(404);
      const image = await store.getConfiguratorAsset(req.params.id);
      if (!image) return res.sendStatus(404);
      res
        .type(image.contentType)
        .set("Cache-Control", "public,max-age=604800,immutable")
        .send(image.data);
    } catch (error) {
      next(error);
    }
  });
  router.post(
    "/requests",
    limit,
    upload.single("drawing"),
    async (req, res, next) => {
      try {
        if (req.body.website)
          return res
            .status(400)
            .json({ message: "Unable to submit this request." });
        const record = await store.getConfigurator();
        const settings = resolveConfiguratorSettings(record?.settings || defaultConfigurator);
        if (!settings.enabled)
          return res
            .status(409)
            .json({ message: "The estimator is currently unavailable." });
        if (Number(req.body.revision) !== (record?.revision || 0))
          return res
            .status(409)
            .json({
              message:
                "The available specifications changed. Reload the page and review your selections.",
            });
        const specification = validateConfiguration(
          JSON.parse(req.body.configuration || "null"),
          settings,
        );
        const customer = {};
        for (const k of [
          "name",
          "email",
          "phone",
          "projectName",
          "country",
          "city",
          "district",
          "address",
          "plot",
        ]) {
          if (typeof req.body[k] === "string" && req.body[k].length > 512)
            throw new Error("Contact information is too long.");
          customer[k] = text(req.body[k], 512);
        }
        if (
          !customer.name ||
          !/^\S+@\S+\.\S+$/.test(customer.email) ||
          req.body.consent !== "true"
        )
          return res
            .status(400)
            .json({
              message: "Enter your name, a valid email and privacy consent.",
            });
        let drawing;
        if (req.file) {
          const b = req.file.buffer;
          const pdf = b.subarray(0, 5).toString() === "%PDF-",
            dwg = /^AC10\d{2}$/.test(b.subarray(0, 6).toString());
          if (!pdf && !dwg)
            return res
              .status(400)
              .json({ message: "Upload a valid PDF or DWG building drawing." });
          drawing = {
            data: b,
            contentType: pdf ? "application/pdf" : "application/acad",
            filename: text(
              req.file.originalname.replace(/[\r\n"\\/]/g, "_"),
              150,
            ),
          };
        }
        const selections = {};
        for (const [key, items] of Object.entries({
          ...settings.options,
          ...settings.catalogs,
          capacity: settings.capacities,
        }))
          selections[key] =
            items.find((x) => x.id === specification[key]) || null;
        const inquiry = await store.saveConfiguratorRequest({
          customer,
          specification,
          selections,
          revision: record?.revision || 0,
          status: "New",
          consent: true,
          marketing: req.body.marketing === "true",
          ...(drawing ? { drawing } : {}),
        });
        res
          .status(201)
          .json({
            message: settings.successMessage,
            reference: String(inquiry._id),
          });
      } catch (error) {
        if (error.name === "MongooseServerSelectionError")
          return res
            .status(503)
            .json({
              message: "Unable to save your request. Please try again.",
            });
        next(error);
      }
    },
  );
  return router;
}
