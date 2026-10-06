# BG Elevators — React + Tailwind

Complete source rebuild of the supplied BG Elevators HTML archive using React 19, Tailwind CSS 4, Lucide React, Vite and React Router.

Production domain: `https://www.bgelevators.com/`. Canonical metadata, Open Graph URLs, sitemap entries, robots discovery and bare-domain redirects use this HTTPS `www` address.

## Start locally

Use Node.js 22.12 or newer.

```bash
npm ci
npm run dev:full
```

Open the URL printed by Vite (normally http://localhost:5173). This starts both the website and the enquiry API. `npm run dev` starts just the frontend; `npm run server` starts just the API on port 3001.

## Production

```bash
npm run build
npm run check
npm start
```

The build creates `dist/` with a fully rendered HTML file for every original route and all images/fonts. The Node server serves that directory and APIs on port 3001, and uses `.ssr/` to render CMS articles. Keep both `dist/` and `.ssr/` in production. Use a reverse proxy and HTTPS on your production domain. Set `TRUST_PROXY=1` only when behind one trusted reverse proxy. The archive omits generated `dist/`, `.ssr/` and `node_modules/`; the commands above reproduce them.

For a read-only static copy, upload the contents of `dist/` after building. **The CMS blog feature requires the Node server and MongoDB: static-only hosting is not sufficient.** Public URLs are extensionless, and the included Apache `.htaccess` redirects legacy `.html` requests to their clean equivalents. On static-only hosting, configure a separately hosted form service; static hosting alone cannot send enquiry emails. `npm run preview` previews static output, not the email API.

## Email and career submissions

Copy `.env.example` to `.env` and fill in your provider's SMTP values:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- `SMTP_USER`, `SMTP_PASSWORD` when required by the provider
- `SMTP_FROM`: your provider-approved sending address
- `ENQUIRY_TO` and `CAREERS_TO`: recipient inboxes

Never put SMTP credentials in `VITE_` variables. Those are browser-visible. An optional `VITE_FORM_ENDPOINT` changes the frontend endpoint; rebuild after changing it. Prefer hosting `/api/enquiry` on the same origin. If you host an API elsewhere, explicitly configure that service's CORS policy for your website.

The original HTML referenced missing `elevators.php` and `careers.php` files. The included Node handler replaces these missing handlers. It validates inputs, limits request size/rate, includes a honeypot, accepts PDF/DOC/DOCX resumes up to 5 MB and verifies their file signatures. Valid submissions are saved to MongoDB with an activity record before email is attempted. Both the admin notification and customer confirmation email are required for the form to report success, so SMTP must be configured and available. Resumes remain private and are available only through the authenticated CMS.

## Admin CMS (updated)

The Next.js admin in `admin/` includes Overview, Leads, Careers, Blog studio, Brochure, Activity, and Team & access. This update improves the public responsive UI and CMS styling and adds database-managed articles. See [the update guide](docs/UPDATE-GUIDE.md).

See **[Admin setup and features](docs/admin-guide.md)** for setup, permissions, deployment, and verification details.

```bash
npm ci
npm --prefix admin ci
```

Copy `.env.example` to `.env` and `admin/.env.example` to `admin/.env.local`. Configure the same `MONGODB_URI` in both. Generate a random session secret, fill in the first administrator's credentials, then run:

```bash
npm run admin:create
npm run dev:full
```

In a second terminal:

```bash
npm run admin:dev
```

The admin runs at `http://localhost:3002/admin`. MongoDB is required for saved submissions and admin records; SMTP is required for outgoing email. No credentials or test database are included in this ZIP.

## Project layout

| Location                                  | Purpose                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/pages/`                              | Route-level pages compose section components only                                          |
| `src/components/homepage/`                | Hero, about, USP, products, solutions, statistics, projects and homepage sections          |
| `src/components/<page-name>page/`         | Sections specific to each remaining page                                                   |
| `src/components/shared/`                  | Reusable testimonials, consultation, process, product-detail and enquiry-modal sections    |
| `src/components/layout/`                  | Header, footer and WhatsApp link                                                           |
| `src/components/blogpage/`                | Redesigned listing and blog cards                                                          |
| `src/components/blogdetailpage/`          | Redesigned article header, content, contents navigation and original supplemental sections |
| `src/components/ui/`                      | React links, Lucide icons, accessible carousels, forms and native dialogs                  |
| `src/data/pages/`                         | All editable page copy, image references and section data                                  |
| `src/data/articles/`                      | Every complete article as editable structured blocks                                       |
| `src/data/blogs.json`                     | Original 106 blog-list records, dates, images and descriptions                             |
| `src/data/metadata.json`                  | Original titles, descriptions, canonical URLs and structured data                          |
| `src/data/navigation.json`, `footer.json` | Navigation and footer content                                                              |
| `src/styles/`                             | Brand styling, Tailwind components, responsive adjustments and blog design                 |
| `public/images/`, `public/fonts/`         | All 419 original image/font/brochure files, byte-for-byte preserved                        |
| `server/`                                 | Configurable enquiry and career email API                                                  |
| `scripts/`                                | Development, static pre-rendering and meaningful integration checks                        |
| `docs/`                                   | Route list, migration manifest and verification report                                     |

## Content and design

- All 139 original routes are retained with clean URLs: 37 regular pages and 102 article pages. `/` is the homepage, and legacy `.html` requests redirect to the matching clean URL. The privacy policy stays a regular page.
- The original blog listing contains 106 cards pointing to 101 distinct articles. Its five repeated entries remain as supplied. The additional unlisted article also remains available at its original URL.
- Blog descriptions, article bodies, inline links, tables, images, dates and original per-article related/testimonial/CTA sections are preserved.
- The header, hero, blog listing and CMS layouts were refined for responsive use. Other page layouts retain the supplied branded design and content, with responsive repairs and React interaction components.
- Unused legacy stylesheet rules were removed. Remaining CSS preserves shared typography, original content styling and animation states. New layouts use Tailwind utilities; the public site uses the `tw:` prefix to avoid collisions with original class names.
- No jQuery, Webflow runtime, Font Awesome CDN, Swiper CDN, iframe page wrapper or raw-HTML page injection is required. Page sections are real JSX. Article text uses a small structured-block renderer.
- Hero arrows/dots, touch-friendly carousels, mobile navigation, timed homepage enquiry dialog, career dialogs, brochure download and original external links are wired up in React.
- Original metadata and sitemap are preserved. The build pre-renders complete content for every original URL before hydration, including the long article pages. If your domain changes, update the canonical URLs, structured-data domains, sitemap and robots.txt together.

## Original archive limitations

Six files referenced by the source HTML are not present in the supplied archive. The four benefit icons and one job-type icon use Lucide replacements. The missing career-detail cover uses an existing supplied elevator photograph. Exact filenames are listed in `docs/migration-manifest.json`. No existing image files were altered.

The source also contained three old applicant resumes under `uploads/resumes/`. These are not website assets and are intentionally excluded from the public site and delivery ZIP. They remain in your original uploaded archive. Original PHP credentials and old vendor scripts are not included in the React project.

Original editorial wording, dates, measurements, testimonial claims, inconsistent labels and duplicate cards have not been rewritten. Form feedback and the few new reading/navigation labels are centralized in `src/data/ui.json`.

## Editing

Edit content in `src/data/` and layouts in the matching `src/components/` folder. Route pages import and compose sections. Shared layout templates take a `data` prop so the same structure does not need to be copied across product pages.

For a new regular page, create its page component, section folder and content file, then register it in `src/data/routes.json` and add its metadata. For a new article, add a JSON file under `src/data/articles/`, add its summary to `articleIndex.json`, add its listing record to `blogs.json`, and add metadata. Run a new production build after every content change.

## Verification

`npm run check` validates all rendered routes and exercises form success/error cases using an in-process mail stub. No real email is sent. See `docs/verification.md` for the completed content, asset and responsive checks and their limits.
# bgnew



## Search visibility setup

The production build generates `public/sitemap.xml` from the canonical, indexable records in `src/data/metadata.json`. Pages marked `noindex` are omitted automatically.

Before the production build, configure:

```env
VITE_GOOGLE_SITE_VERIFICATION=verification_token_from_search_console
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
SITE_URL=https://www.bgelevators.com
```

After deployment, add `https://www.bgelevators.com` as a Google Search Console URL-prefix property, verify it using the HTML-tag token above, and submit `https://www.bgelevators.com/sitemap.xml`. Analytics is disabled when no measurement ID is configured and respects the browser's Do Not Track setting.
#   b g c m s f i n a l  
 