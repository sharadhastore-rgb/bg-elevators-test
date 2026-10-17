# Elevator Configurator

Public page: `/configurator`. CMS sidebar: **Elevator Configurator**, at `/admin/configurator`.

Both existing Render services must deploy this commit. Keep the same `MONGODB_URI` and `MONGODB_DB` on the public Express service and Next.js admin service. On the admin service, `NEXT_PUBLIC_WEBSITE_URL` must point to the public website; this is also the origin used for public catalog-image previews. No new environment variables are required.

## CMS operation

Administrators open **Settings & catalog** to change the public heading, introduction, description, button and confirmation messages, measurement guidance, review note, availability, field labels, numeric limits/steps, door/usage/material options, regulatory options, cabin sizes, capacities and recommendations. Catalog entries can be added, removed, disabled, renamed, reordered and given replacement images. Uploads accept JPG, PNG and WebP up to 2 MB, converted to bounded WebP images stored in MongoDB.

**Publish configurator** validates the entire configuration and stores one versioned settings document. The public page loads settings directly from the database with caching disabled. Before the first publication, the supplied default catalog is used; a database failure shows a retry state, rather than silently using old defaults. An off switch makes the public settings API return 404 and rejects new submissions. If settings change while a visitor is configuring, submission asks them to reload and review the current options. Concurrent editors cannot overwrite each other's changes without reloading.

Administrators and staff can review requests and change their status. Viewers can read requests and download drawings, but cannot update statuses or settings. All catalog writes are administrator-only. Requests are in this dedicated CMS section, not duplicated into the existing Leads collection.

Requests preserve the contact/project details, privacy consent, optional marketing consent, settings revision, server-calculated specification, selected catalog labels and private drawing. This snapshot is retained when catalog items are later renamed or removed. PDF and DWG drawings are limited to 10 MB and checked for file signatures. Drawing downloads require a current CMS session and use private, no-store responses; they are never served by the public website.

This new quotation-request flow reports success once the configuration has been saved. It does not depend on SMTP or send automatic emails; requests appear in the CMS. Existing enquiry and career email workflows are unchanged.

## Calculations and reference parity

Reference inspected: https://nec.eu.com/en/configurator and its public `/js/configurator.js`, 17 October 2026.

- Floor count is 2–50 by default. There are `floorCount - 1` independently editable inter-floor heights. Increasing the floor count preserves existing heights and adds empty fields; decreasing it removes the unused gaps.
- Total travel is the sum of all entered inter-floor heights, in mm. Metres are `totalTravel / 1000`. Pit and headroom are excluded from travel.
- Overall shaft height is travel + pit depth + headroom. The new schematic uses these same quantities; its physical suitability is not an engineering certification.
- Recommended capacity → cabin dimensions and speed match the reference's seven defaults: 450 → 850 x 1400 / 1.0; 630 → 1100 x 1400 / 1.0; 1000 → 1450 x 1600 / 1.6; 1250 → 1450 x 1900 / 1.6; 1350 → 1550 x 1900 / 1.75; 1600 → 1800 x 1900 / 2.0; 2000 → 2200 x 1900 / 2.5.
- The speed input defaults to step 0.05 so the reference's 1.75 m/s recommendation remains valid in native form validation.
- Door choices match single entrance and two entrances at 90°, 180°, or 270°. The second door opening is omitted from submitted specifications for a single entrance.
- Control-panel count is one, or two with the second-panel checkbox enabled.
- Progress uses the reference's eleven completeness checks. Existing default selections count as complete, so progress does not start at zero.
- Required technical inputs, enabled catalog IDs, regulatory selections, contact data and privacy consent are validated on the server. Browser-supplied totals are ignored and recalculated using the shared calculation module.
- A warning appears if selected cabin dimensions reach or exceed the entered shaft dimensions. It is advisory: final clearances and suitability require engineering review.
- The reference has no public price formula. This feature requests a quotation and does not invent prices.

## Catalog source

The default catalog retains the requested reference's 58 cabin appearances, 23 control panels, 19 ceilings, 42 floors and 6 accessories. Their 148 images were downloaded from the reference's public `/images/configurator/` catalog into `public/images/configurator/`; they do not hotlink to the reference. Source model identifiers and catalog descriptions are retained. These are reference catalog choices, not verified BG Elevators inventory. The CMS can replace them with the company's actual catalog.

## Endpoints and database collections

- `GET /api/configurator`: published settings and revision, or 404 if disabled / 503 if the database is unavailable.
- `GET /api/configurator/assets/:id`: uploaded public catalog image.
- `POST /api/configurator/requests`: multipart specification/contact form and optional drawing; rate limited.
- Admin `POST /api/configurator/assets`: authenticated image upload.
- Admin `GET /api/configurator/requests/:id/drawing`: authenticated private drawing download.
- Collections: `configuratorsettings`, `configuratorrequests`, `configuratorassets`. No existing collections are migrated or deleted.

## Validation

`npm run build`, `npm run admin:build`, `npm --prefix admin run typecheck`, `npm run check` and `npm run check:configurator`.

For full CMS/database HTTP checks, first build the admin, then run `QA_MONGODB_URI=mongodb://127.0.0.1:27017 node scripts/check-configurator-workflows.mjs` against a dedicated test server. The script creates a randomly named `bg_configurator_qa_*` database, tests the real production Next.js service and public Express API, and drops only that isolated database afterward. Never point it at a production database.

The legacy 404 pre-render filename was also corrected: `/404.html` now generates `dist/404.html`, matching the server's fallback handler.

Validation completed on 17 October 2026: both production builds, the admin TypeScript check, 42 calculation/API checks, 37 real MongoDB/authenticated CMS workflow checks, and the existing 153-route verification passed. The database workflow checks included private drawing byte fidelity, public uploaded-image bytes, concurrent settings conflict protection, admin/staff/viewer restrictions, invalid image rejection, and cross-origin upload rejection. Browser visual/layout testing was unavailable in this environment; no screenshot-based verification is claimed.
