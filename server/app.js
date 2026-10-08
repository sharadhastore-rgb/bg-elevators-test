import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { publicBlog, publicBlogSummary } from "../shared/blog.js";
import { pageHead, escapeHtml } from "./pageHead.js";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createMongoRepository } from "./repository.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const maxBytes = 5 * 1024 * 1024;
const allowedExtensions = new Set([".pdf", ".doc", ".docx"]);

function brochureDownloadPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>BG Elevators Brochure</title><style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(145deg,#eef7fb,#fff 55%,#eaf3f8);font-family:Arial,sans-serif;color:#012034}.card{width:min(440px,100%);padding:38px 32px;text-align:center;background:#fff;border:1px solid #dce8ef;border-radius:18px;box-shadow:0 24px 70px rgba(1,32,52,.13)}.mark{width:68px;height:68px;margin:0 auto 22px;display:grid;place-items:center;border-radius:50%;background:#006699;color:#fff}.spinner{width:30px;height:30px;border:3px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}.check{display:none;font-size:34px}h1{margin:0;font-size:25px;letter-spacing:-.03em}p{margin:10px auto 0;max-width:330px;color:#607686;font-size:14px;line-height:1.6}.progress{height:5px;margin:24px 0 0;overflow:hidden;border-radius:5px;background:#e5eef3}.progress span{display:block;width:35%;height:100%;border-radius:5px;background:#3396d6;animation:progress 1.2s ease-in-out infinite}.retry,.home{display:none;margin-top:22px;padding:11px 18px;border:0;border-radius:7px;background:#006699;color:#fff;font-weight:700;cursor:pointer;text-decoration:none}.ready .spinner{display:none}.ready .check{display:block}.ready .home{display:inline-flex}.ready .progress span{width:100%;animation:none;background:#299466}.error .spinner{display:none}.error .mark{background:#b53a3a}.error .progress{display:none}.error .retry{display:inline-flex}@keyframes spin{to{transform:rotate(360deg)}}@keyframes progress{0%{transform:translateX(-110%)}100%{transform:translateX(300%)}}
  </style></head><body><main class="card" id="card"><div class="mark"><span class="spinner"></span><span class="check">✓</span></div><h1 id="title">Downloading your brochure</h1><p id="message">Please wait while we prepare the latest BG Elevators brochure.</p><div class="progress"><span></span></div><a class="home" href="/">← Back to home</a><button class="retry" id="retry">Try again</button></main><script>
  const card=document.getElementById('card'),title=document.getElementById('title'),message=document.getElementById('message'),retry=document.getElementById('retry');
  async function start(){card.className='card';title.textContent='Downloading your brochure';message.textContent='Please wait while we prepare the latest BG Elevators brochure.';try{const response=await fetch('/download-brochure/file',{cache:'no-store'});if(!response.ok)throw new Error();const blob=await response.blob();const disposition=response.headers.get('content-disposition')||'';const match=disposition.match(/filename="?([^";]+)"?/i);const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=match?match[1]:'BG-Elevators-Brochure.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);card.className='card ready';title.textContent='Download started';message.textContent='Your latest BG Elevators brochure is ready. Check your downloads folder.'}catch(e){card.className='card error';title.textContent='Download unavailable';message.textContent='We could not prepare the brochure. Please check your connection and try again.'}}
  retry.addEventListener('click',start);start();
  </script></body></html>`;
}

/** The transport option supports local integration checks without sending mail. */
export function createApp({
  transport,
  repository,
  config = process.env,
} = {}) {
  const app = express();
  const store =
    repository || createMongoRepository(config.MONGODB_URI, config.MONGODB_DB);
  const mailer =
    transport ||
    (config.SMTP_HOST && config.SMTP_FROM && config.ENQUIRY_TO
      ? nodemailer.createTransport({
          pool: true,
          maxConnections: 2,
          maxMessages: 100,
          host: config.SMTP_HOST,
          port: Number(config.SMTP_PORT || 587),
          secure: config.SMTP_SECURE === "true",
          auth: config.SMTP_USER
            ? { user: config.SMTP_USER, pass: config.SMTP_PASSWORD }
            : undefined,
          connectionTimeout: 15000,
          socketTimeout: 20000,
        })
      : null);
  app.disable("x-powered-by");
  if (config.TRUST_PROXY === "1") app.set("trust proxy", 1);
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.set("X-Frame-Options", "SAMEORIGIN");
    if (req.hostname === "bgelevators.com")
      return res.redirect(301, `https://www.bgelevators.com${req.originalUrl}`);
    next();
  });
  app.use(express.json({ limit: "32kb" }));
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1, fields: 16, fieldSize: 10000 },
    fileFilter(req, file, cb) {
      const valid = allowedExtensions.has(
        path.extname(file.originalname).toLowerCase(),
      );
      cb(
        valid
          ? null
          : Object.assign(new Error("Please upload a PDF, DOC or DOCX file."), {
              status: 400,
            }),
        valid,
      );
    },
  });
  const buckets = new Map();
  function limit(req, res, next) {
    const now = Date.now();
    for (const [key, value] of buckets)
      if (value.reset < now) buckets.delete(key);
    const key = req.ip;
    const bucket = buckets.get(key) || {
      count: 0,
      reset: now + 15 * 60 * 1000,
    };
    if (++bucket.count > 8)
      return res.status(429).json({
        status: "error",
        message: "Too many attempts. Please try again in 15 minutes.",
      });
    buckets.set(key, bucket);
    next();
  }
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const base = await readFile(
        path.join(root, "public/sitemap.xml"),
        "utf8",
      );
      const posts = await store.listBlogs();
      const origin = (config.SITE_URL || "https://www.bgelevators.com").replace(
        /\/$/,
        "",
      );
      const entries = posts
        .filter((post) => !post.routePath)
        .map(
          (post) =>
            `<url><loc>${escapeHtml(`${origin}/journal/${post.slug}`)}</loc><lastmod>${new Date(post.updatedAt || post.publishedAt).toISOString()}</lastmod></url>`,
        )
        .join("");
      res
        .type("application/xml")
        .set("Cache-Control", "no-store")
        .send(base.replace("</urlset>", () => entries + "</urlset>"));
    } catch {
      res.sendFile(path.join(root, "public/sitemap.xml"));
    }
  });
  app.get("/api/blogs", async (_req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      res.json({ articles: (await store.listBlogs()).map(publicBlogSummary) });
    } catch {
      res
        .status(503)
        .json({ message: "Articles are temporarily unavailable." });
    }
  });
  app.get("/api/blogs/:slug", async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(req.params.slug))
      return res.status(404).json({ message: "Article not found." });
    try {
      const post = await store.getBlog(req.params.slug);
      return post
        ? res.json(publicBlog(post))
        : res.status(404).json({ message: "Article not found." });
    } catch {
      res.status(503).json({ message: "Article is temporarily unavailable." });
    }
  });
  app.get("/api/blogs/:slug/cover", async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const post = await store.getBlog(req.params.slug, true);
      if (!post?.cover?.data) return res.status(404).end();
      const data = post.cover.data;
      const bytes = Buffer.isBuffer(data)
        ? data
        : Buffer.from(data.buffer).subarray(0, data.position);
      res.type(post.cover.contentType).send(bytes);
    } catch {
      res.status(503).end();
    }
  });
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.get("/index", (req, res) =>
    res.redirect(301, `/${req.url.slice(req.path.length)}`),
  );
  app.get("/download-brochure/file", async (req, res, next) => {
    try {
      res.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      const brochure = await store.getActiveBrochure?.();
      res.set("Cache-Control", "no-store, max-age=0");
      if (brochure?.data) {
        const filename = String(
          brochure.filename || "BG-Elevators-Brochure.pdf",
        ).replace(/[^\w. -]/g, "_");
        res.attachment(filename);
        res.type(brochure.contentType || "application/pdf");
        const source = brochure.data.buffer || brochure.data;
        const bytes = Buffer.from(source);
        const length = Number(
          brochure.data.position || brochure.size || bytes.length,
        );
        return res.send(bytes.subarray(0, length));
      }
      return res.download(
        path.join(root, "public", "images", "brochure.pdf"),
        "BG-Elevators-Brochure.pdf",
      );
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/enquiry", limit, upload.single("Resume"), async (req, res) => {
    const body = req.body || {};
    const value = (...names) =>
      String(
        names.map((key) => body[key]).find((v) => typeof v === "string") || "",
      ).trim();
    if (value("website"))
      return res.status(400).json({
        status: "error",
        message: "Unable to accept this submission.",
      });
    const name = value("Name", "name");
    const email = value("Email", "email");
    const phone = value("Phone", "phone");
    const location = value("Location", "location");
    const message = value("Message", "message");
    const submittedKind = value("kind");
    const kind =
      submittedKind === "career"
        ? "career"
        : submittedKind === "brochure"
          ? "brochure"
          : "contact";
    const cvUrl = value("CV-URL");
    const page = value("page").slice(0, 512);
    let validCvUrl = false;
    try {
      validCvUrl = ["https:", "http:"].includes(new URL(cvUrl).protocol);
    } catch {}
    if (name.length < 2 || name.length > 256)
      return res
        .status(400)
        .json({ status: "error", message: "Please enter your name." });
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 256 ||
      /[\r\n]/.test(email)
    )
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid email address.",
      });
    if (
      !/^[+\d() .-]{7,25}$/.test(phone) ||
      phone.replace(/\D/g, "").length < 7
    )
      return res.status(400).json({
        status: "error",
        message: "Please enter a valid phone number.",
      });
    if (
      location.length > 256 ||
      value("Position", "position").length > 256 ||
      value("Experience", "experience").length > 256 ||
      cvUrl.length > 2048
    )
      return res.status(400).json({
        status: "error",
        message: "Please keep your details within the allowed length.",
      });
    if (message.length > 5000)
      return res.status(400).json({
        status: "error",
        message: "Please keep your message below 5,000 characters.",
      });
    if (kind === "career" && !req.file && !validCvUrl)
      return res.status(400).json({
        status: "error",
        message: "Please attach your resume or provide a valid CV URL.",
      });
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const bytes = req.file.buffer;
      const validSignature =
        ext === ".pdf"
          ? bytes.subarray(0, 5).toString() === "%PDF-"
          : ext === ".docx"
            ? bytes.subarray(0, 2).toString() === "PK"
            : bytes
                .subarray(0, 8)
                .equals(Buffer.from("d0cf11e0a1b11ae1", "hex"));
      if (!validSignature)
        return res.status(400).json({
          status: "error",
          message: "The uploaded file is not a valid PDF, DOC or DOCX.",
        });
    }
    let recordSaved = false;
    try {
      const common = {
        name,
        email,
        phone,
        location,
        page,
        message,
        source: kind === "brochure" ? "Brochure" : "Website",
        position: value("Position", "position") || "General Application",
        experience: value("Experience", "experience"),
      };
      if (kind === "career") {
        await store.saveCareer({
          ...common,
          resume: req.file
            ? {
                filename: path
                  .basename(req.file.originalname)
                  .replace(/[^\w. -]/g, "_"),
                contentType: {
                  ".pdf": "application/pdf",
                  ".doc": "application/msword",
                  ".docx":
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                }[path.extname(req.file.originalname).toLowerCase()],
                data: req.file.buffer,
              }
            : { externalUrl: cvUrl },
        });
        recordSaved = true;
      } else {
        await store.saveLead(common);
        recordSaved = true;
      }

      if (!mailer)
        throw Object.assign(new Error("Email delivery is not configured."), {
          status: 503,
        });
      {
        const adminSubject =
          kind === "career"
            ? "New Career Application - BG Elevators"
            : kind === "brochure"
              ? "New Brochure Request - BG Elevators"
              : "New Website Lead - BG Elevators";
        const adminText = [
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Email: ${email}`,
          location ? `Location: ${location}` : "",
          page ? `Submitted from: ${page}` : "",
          kind === "career" ? `Position: ${common.position}` : "",
          kind === "career" && common.experience
            ? `Experience: ${common.experience}`
            : "",
          `Message: ${message}`,
          `Date: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
          "",
          "The complete record is available inside the BG Elevators CMS.",
        ]
          .filter(Boolean)
          .join("\n");
        const customerSubject =
          kind === "career"
            ? "Application Received - BG Elevators"
            : kind === "brochure"
              ? "Your BG Elevators Brochure"
              : "Thank You for Contacting BG Elevators";
        const customerText =
          kind === "career"
            ? `Hi ${name},\n\nThank you for applying to BG Elevators. We have received your application and our team will review it shortly.\n\nRegards,\nBG Elevators Team`
            : kind === "brochure"
              ? `Hi ${name},\n\nThank you for requesting the BG Elevators brochure. Your download is ready on the website.\n\nRegards,\nBG Elevators Team`
              : `Hi ${name},\n\nThank you for contacting BG Elevators.\n\nWe have successfully received your enquiry. Our team will review your requirement and contact you shortly.\n\nRegards,\nBG Elevators Team`;
        await Promise.all([
          mailer.sendMail({
            from: config.SMTP_FROM,
            to:
              kind === "career"
                ? config.CAREERS_TO || config.ENQUIRY_TO
                : config.ENQUIRY_TO,
            replyTo: email,
            subject: adminSubject,
            text: adminText,
            attachments: req.file
              ? [
                  {
                    filename: path
                      .basename(req.file.originalname)
                      .replace(/[^\w. -]/g, "_"),
                    content: req.file.buffer,
                  },
                ]
              : [],
          }),
          mailer.sendMail({
            from: config.SMTP_FROM,
            to: email,
            subject: customerSubject,
            text: customerText,
          }),
        ]);
      }
      return res.json({
        status: "success",
        message: "Form submitted successfully!",
      });
    } catch (error) {
      if (recordSaved) {
        console.error(
          `${kind} email notification failed after the record was saved:`,
          error.message,
        );
        return res.json({
          status: "success",
          message: "Form submitted successfully!",
          warning:
            "Your details were saved successfully; email notifications are temporarily unavailable.",
        });
      }
      return res.status(error.status || 503).json({
        status: "error",
        message:
          "We could not complete your submission or send the confirmation emails. Please try again or contact info@bgelevators.com.",
      });
    }
  });
  app.use("/api", (req, res) =>
    res.status(404).json({ status: "error", message: "Endpoint not found." }),
  );
  const dist = path.join(root, "dist");
  if (existsSync(path.join(dist, "index.html"))) {
    // Keep the brochure QR code and previously shared legacy URL working.
    app.get("/brochure.html", (req, res) =>
      res.redirect(301, `/download-brochure${req.url.slice(req.path.length)}`),
    );
    app.get(/.*\.html$/, (req, res, next) => {
      if (req.path === "/404.html") return next();
      return res.status(404).sendFile(path.join(dist, "404.html"));
    });
    // Render the listing with current CMS data so hydration never reorders it.
    app.get("/blogs", async (req, res) => {
      res.set("Cache-Control", "no-store");
      try {
        const articles = (await store.listBlogs()).map(publicBlogSummary);
        const { renderPage } = await import("../.ssr/entry-server.js");
        const page = await renderPage(req.path, undefined, articles);
        const shell = await readFile(
          path.join(root, ".ssr/shell.html"),
          "utf8",
        );
        const html = shell
          .replace(
            /<title>.*?<\/title>/s,
            () => `<title>${escapeHtml(page.meta.title)}</title>`,
          )
          .replace("<!--page-head-->", () => pageHead(page.meta))
          .replace("<!--page-html-->", () => page.html)
          .replace(
            "</head>",
            () =>
              `<script id="cms-blogs" type="application/json">${JSON.stringify(articles).replaceAll("<", "\\u003c")}</script></head>`,
          );
        res.type("html").send(html);
      } catch (error) {
        console.error("Blog listing render failed:", error.message);
        res.sendFile(path.join(dist, "blogs.html"));
      }
    });
    // Render new CMS URLs on demand: publishing never requires a frontend rebuild.
    app.get("/journal/:slug", async (req, res) => {
      res.set("Cache-Control", "no-store");
      try {
        const post = await store.getBlog(req.params.slug);
        if (!post) return res.status(404).sendFile(path.join(dist, "404.html"));
        const article = publicBlog(post);
        const { renderPage } = await import("../.ssr/entry-server.js");
        const page = await renderPage(req.path, article);
        const shell = await readFile(
          path.join(root, ".ssr/shell.html"),
          "utf8",
        );
        const html = shell
          .replace(
            /<title>.*?<\/title>/s,
            () => `<title>${escapeHtml(page.meta.title)}</title>`,
          )
          .replace("<!--page-head-->", () => pageHead(page.meta))
          .replace("<!--page-html-->", () => page.html)
          .replace(
            "</head>",
            () =>
              `<script id="cms-article" type="application/json">${JSON.stringify(article).replaceAll("<", "\\u003c")}</script></head>`,
          );
        res.type("html").send(html);
      } catch (error) {
        console.error("Article render failed:", error.message);
        res
          .status(503)
          .type("html")
          .send(
            '<h1>Article temporarily unavailable</h1><p>Please try again shortly.</p><a href="/blogs">Back to articles</a>',
          );
      }
    });
    // Imported legacy articles keep their established extensionless root URLs.
    app.get("/:slug", async (req, res, next) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(req.params.slug)) return next();
      try {
        const post = await store.getBlogByRoute?.(`/${req.params.slug}`);
        if (!post) return next();
        if (post.status !== "published")
          return res.status(404).sendFile(path.join(dist, "404.html"));
        const article = publicBlog(post);
        const { renderPage } = await import("../.ssr/entry-server.js");
        const page = await renderPage(req.path, article);
        const shell = await readFile(
          path.join(root, ".ssr/shell.html"),
          "utf8",
        );
        const html = shell
          .replace(
            /<title>.*?<\/title>/s,
            () => `<title>${escapeHtml(page.meta.title)}</title>`,
          )
          .replace("<!--page-head-->", () => pageHead(page.meta))
          .replace("<!--page-html-->", () => page.html)
          .replace(
            "</head>",
            () =>
              `<script id="cms-article" type="application/json">${JSON.stringify(article).replaceAll("<", "\\u003c")}</script></head>`,
          );
        res.set("Cache-Control", "no-store").type("html").send(html);
      } catch (error) {
        console.error("Legacy article render failed:", error.message);
        res
          .status(503)
          .type("html")
          .send(
            "<h1>Article temporarily unavailable</h1><p>Please try again shortly.</p>",
          );
      }
    });
    app.use(
      express.static(dist, {
        extensions: ["html"],
        setHeaders(res, file) {
          if (file.includes(`${path.sep}assets${path.sep}`))
            res.set("Cache-Control", "public, max-age=31536000, immutable");
        },
      }),
    );
    app.use((req, res) =>
      res.status(404).sendFile(path.join(dist, "404.html")),
    );
  }
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const tooLarge = error.code === "LIMIT_FILE_SIZE";
    res.status(error.status || 400).json({
      status: "error",
      message: tooLarge
        ? "Please upload a file smaller than 5 MB."
        : error.message || "Invalid request.",
    });
  });
  return app;
}
