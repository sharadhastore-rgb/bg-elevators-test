# BG Elevators admin — setup and features

## Scope

This update changes the admin application and its form-storage handler. Public website components, pages, styling, content, images, and routes remain unchanged. No browser preview was opened. The admin uses the existing navy, blue and orange brand palette with shared tables, forms, buttons, status controls, feedback and responsive navigation.

## Setup

Requirements: Node.js 22.12 or newer and a running MongoDB database. Install the public and admin dependencies separately with `npm ci` and `npm --prefix admin ci`.

1. Copy root `.env.example` to `.env` and `admin/.env.example` to `admin/.env.local`.
2. Put the same MongoDB URI in both. Existing collections and documents are preserved. New optional fields do not require destructive migration.
3. Set a random `SESSION_SECRET` of at least 32 characters; the placeholder is rejected. Generate it with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`.
4. Set `ADMIN_NAME`, `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 10 characters (maximum 72 UTF-8 bytes). Run `npm run admin:create` from the root. Remove `ADMIN_PASSWORD` from the environment afterwards. Running this command again resets that account and revokes its previous sessions.
5. Start the public site and enquiry API with `npm run dev:full`. In another terminal, start the admin with `npm run admin:dev`.
6. Sign in at `http://localhost:3002/admin`.

SMTP settings remain in the root `.env`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `ENQUIRY_TO` and `CAREERS_TO`. `SMTP_USER` is the sending mailbox; use the provider's app password/token in `SMTP_PASSWORD`; `SMTP_FROM` must be a sender address approved by that provider. `ENQUIRY_TO` is the monitored inbox that receives lead and brochure-request notifications (the visitor's submitted email is used for the customer confirmation). `CAREERS_TO` is the career-application inbox and falls back to `ENQUIRY_TO` when empty. The `MONGODB_URI` in the root `.env` and `admin/.env.local` must point to the same database for public brochure requests to appear in the CMS Leads list; they are marked with source **Brochure**. Records are saved before notification email is sent, so an SMTP failure does not remove a saved lead. Configure and verify your provider separately before going live. No real emails are sent by the automated checks.

## Workflows

| Area           | Working features                                                                                                                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview       | Live record counts, lead pipeline, recent enquiries/applications and Activity links                                                                                                                                         |
| Leads          | Public form and brochure-request intake; manual creation; search; status/source filters; pagination; detail view; editing contact information/location/requirement/source; status changes; internal notes; administrator-only confirmed deletion |
| Careers        | Public applications with resume upload or CV URL; search/status filter; pagination; private resume access; editing candidate data; status changes; notes; administrator-only confirmed deletion                             |
| Activity       | Dedicated sidebar page; automatic website and admin history; record name, actor, timestamp in IST; before/after field changes; filters by record, action, date and text; pagination; deletion history retained              |
| Team & access  | Administrator-only account creation; staff/viewer/admin roles; activation/deactivation; password resets; access events in Activity; session revocation on reset or deactivation                                             |
| Authentication | Email/password sign-in; signed HTTP-only sessions; eight-hour expiry; account/role checked against database on each protected request; sign-out; basic per-process login throttling                                         |

Status choices remain: Leads — New, Contacted, In Progress, Converted, Closed. Careers — New, Reviewing, Shortlisted, Selected, Rejected. Unchanged status/note saves do not create duplicate change entries. Invalid/missing IDs receive a controlled not-found response. Saved historical entries remain available after deleting a record. Older activity rows created by earlier code are preserved; prior values that were never recorded cannot be reconstructed.

## Permissions

| Action                                       | Administrator | Staff | Viewer |
| -------------------------------------------- | ------------- | ----- | ------ |
| Read leads and applications; open resumes    | Yes           | Yes   | Yes    |
| Create leads; edit details, status and notes | Yes           | Yes   | No     |
| Delete leads/applications                    | Yes           | No    | No     |
| View lead/career Activity                    | Yes           | Yes   | Yes    |
| Manage team and see team Activity            | Yes           | No    | No     |

You cannot deactivate your own account from Team. Resetting your own password signs you out. Passwords never appear in Activity. Resume bytes are excluded from normal queries and returned only by the authenticated endpoint. External CV links are limited to HTTP/HTTPS and opening them is logged.

## Production

Build the public site as before with `npm run build`; build the admin with `npm run admin:build`. Start the API/public site with `npm start` and the admin with `npm --prefix admin start`.

A separate HTTPS admin subdomain is simplest: proxy all its paths to the Next.js service on port 3002. The public site/API stays on its existing domain and port 3001. Both services must use the same MongoDB database. Next.js needs its `/_next/*`, `/fonts/*`, `/admin*`, and `/api/careers/*/resume` paths routed to the admin service if sharing a hostname. Preserve Host/forwarded-host headers correctly for Server Actions. Production cookies require HTTPS. Do not use static export for the admin.

For multiple instances, use shared edge/proxy rate limiting in addition to the included single-process login protection. Take database backups through your hosting provider. Runtime environment files, private resumes, dependencies, build caches and test data are intentionally excluded from the source ZIP.

## Verification

Run the TypeScript check and admin build:

```bash
npm --prefix admin run typecheck
npm run admin:build
```

Run the isolated database and HTTP workflow checks against a local or dedicated test MongoDB server:

```bash
QA_MONGODB_URI=mongodb://127.0.0.1:27017 npm --prefix admin run check:workflows
```

For PowerShell, set `$env:QA_MONGODB_URI='mongodb://127.0.0.1:27017'`, then run `npm --prefix admin run check:workflows`.

The check creates a new uniquely named `bg_admin_qa_*` database, exercises real form HTTP submissions, records, edits, notes, logs, roles, resumes and deletions, then removes only that test database. It starts the built admin locally on port 3102; keep this port free. It captures outgoing emails instead of sending them. It never opens the public website or a browser. Results are written to `docs/admin-test-results.json`.
