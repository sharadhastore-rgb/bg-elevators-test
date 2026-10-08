# Responsive website and Blog Studio update

## What changed

- Retained the existing blue/navy palette, site content, original article URLs and all 139 original routes.
- Rebuilt the navigation and hero with Tailwind utilities. Mobile text determines the hero height; desktop keeps the original split image/content presentation.
- Added smooth overlapping hero transitions, swipe controls, pause/play and larger touch targets. Autoplay pauses during interaction and respects reduced-motion settings.
- Preserved the fade/slide section reveals and touch-friendly product/project carousels. Reduced horizontal reveal distances and corrected card navigation measurements.
- Fixed invalid Tailwind v4 prefix ordering, article typography/table utilities, blog pagination overflow and clipped mobile statistics.
- Removed 1,306 unused legacy CSS rule groups (about 77% of the legacy stylesheet bytes). Retained CSS needed by existing content, shared styles and animation states. New header, hero and blog management layouts primarily use Tailwind.
- Refreshed the CMS with the same colors, rounded surfaces, subtle shadows and translucent panels. Removed conflicting compact-desktop overrides and fixed base styles overriding Tailwind utilities.
- Added Blog Studio: create, edit, preview, draft/publish, unpublish, search, status filter, pagination and deletion. Includes cover upload, alt text, category, summary and optional SEO metadata.
- New articles appear on the home page and blog listing. Their `/journal/<slug>` URLs render server-side with article metadata and structured data, without rebuilding. The Node server adds published articles to the sitemap.
- Existing static articles remain preserved and source-managed. They are not imported into Blog Studio automatically.

The site already includes FAQs, process, testimonials, projects, maintenance support and consultation sections. No additional filler sections were added.

## Setup

Use Node.js 22.12+ and MongoDB.

1. Run `npm ci` at the project root and `npm --prefix admin ci`.
2. Copy `.env.example` to `.env`. The public application and CMS share this file.
3. Set `MONGODB_URI` and `MONGODB_DB` in the shared file.
4. Set a random `SESSION_SECRET` and the initial admin credentials in `.env`.
5. Set `NEXT_PUBLIC_WEBSITE_URL` to the public website origin (locally `http://localhost:5173`). Set it before building the admin.
6. Run `npm run admin:create` once. Remove `ADMIN_PASSWORD` from the environment file afterwards.
7. Run `npm run dev:full` for the public site/API and `npm run admin:dev` in another terminal for the CMS.

Public website: `http://localhost:5173`. CMS: `http://localhost:3002/admin`.
SMTP settings are still required for the existing enquiry and career email workflows; blogs only need MongoDB.

## Publish an article

1. Sign in, open **Blog studio**, then **Create article**.
2. Enter a title, URL slug, summary and article body.
3. Separate paragraphs with blank lines. Use `## Heading`, `### Subheading`, or lines beginning with `- ` for lists. Preview to review the layout. HTML input is displayed as text, not executed.
4. Upload a JPG, PNG or WebP cover (maximum 5 MB), and write meaningful alt text.
5. Save as **Draft** to keep it private, or choose **Published** and save to make it public.
6. To unpublish, choose **Draft** and save again. An administrator can permanently delete an article and its stored cover after confirming.

Admin and staff accounts may create/edit/publish. Viewers can browse the CMS listing but cannot edit. Only administrators can delete. Drafts and their images are excluded from public endpoints. URLs become immutable after creation to avoid broken links. Concurrent edits are checked using the document version.

## Production

```bash
npm run build
npm run check
npm run check:blogs
npm run admin:build
npm start
```

Run `npm --prefix admin start` as a separate service. Configure MongoDB and SMTP in the production environments and use HTTPS with a reverse proxy.

Keep **both `dist/` and `.ssr/`**, as well as `server/`, `shared/`, `public/sitemap.xml` and production dependencies. Do not deploy only `dist/` if you want CMS articles: the Express server handles `/api/blogs`, `/journal/*` and the dynamic sitemap. Route those paths to the public Node server. The Next.js CMS handles its own `/admin/*` and `/api/blog-covers/*` paths.

The production metadata retains the supplied `www.bgelevators.com` domain. If the domain changes, update the existing metadata/structured-data configuration too.

## Verification

See `VERIFICATION.md` for checks completed for this delivery. No production database, live SMTP credentials, generated build output or dependency folders are included in the ZIP.
