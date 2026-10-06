# Verification — 6 October 2026

## Passed

- Public production build: 139 original routes prerendered, plus the 404 page.
- Next.js CMS production build and TypeScript check.
- `npm run check`: rendered routes, saved enquiry/resume input, captured admin/customer email composition, invalid input/uploads, missing-email failure, route aliases and 404 handling.
- `npm run check:blogs`: validation, safe plain-text article blocks, public list/detail/cover, server-rendered article content, structured data, dynamic sitemap and unknown article handling.
- Root dependency lockfile consistency (`npm ci --dry-run`).
- 22 existing CMS integration checks against an isolated MongoDB database. Includes actual login/logout, form persistence, private files, viewer/staff authorization, team session revocation, deletion, activity history and pagination. Full results: `admin-test-results.json`.

## Browser verification

Headless Chromium with an isolated MongoDB database and production public/CMS servers:

- 45 responsive checks: home, about, services, products, features, blogs, contact, careers and a legacy article at 320, 390, 768, 1024 and 1440 pixels.
- No document horizontal overflow in these checks.
- Mobile navigation opens, routes and closes correctly.
- Hero next-slide control changes the active slide.
- Admin login through the real form.
- Create a draft with an uploaded cover image; public endpoint returns 404 for the draft.
- Publish and receive server-rendered content at the new article URL.
- Public article hydrates and appears in the blog listing.
- CMS Blog Studio fits a 390-pixel viewport.
- Unpublish removes the public article (404).
- Delete removes the article and returns to the listing with confirmation.
- No browser JavaScript page errors during the final run.

## Scope and limitations

- Local verification used temporary data, not the user's production database.
- Outgoing email was captured in the regression tests; no real email was sent. Production SMTP still requires the user's credentials and a live delivery check.
- Responsive verification used Chromium emulation; physical iOS/Android device testing was not performed.
- Existing static articles remain available at their old URLs and are source-managed; newly created CMS articles use `/journal/<slug>`.
- The included CMS regression test had a stale 15-record pagination assertion. It now checks the actual existing 10-record page size (records 11–16 on page two).
