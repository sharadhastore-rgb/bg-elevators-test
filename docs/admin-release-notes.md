# Admin update — September 28, 2026

- Rebuilt the admin UI using a shared navy, blue and orange design system; improved forms, tables, detail screens, statuses, feedback, mobile navigation and login.
- Added Activity to the sidebar with persistent website, lead, career and team events; actor names; IST timestamps; before-and-after changes; filters; and pagination.
- Added lead and candidate detail editing. Preserved manual lead creation, status changes, notes, deletion, private resumes and team management.
- Preserved location and source-page fields submitted by existing public forms.
- Applied role restrictions consistently and invalidated active sessions after account deactivation or password reset.
- Added server validation, graceful missing-record handling, connection recovery, safe CV links and authenticated resume logging.
- Retained the public website byte-for-byte: 682 public source/asset/entry files matched the uploaded archive. No browser preview was opened.
- Repaired missing optional lockfile entries without changing any existing dependency versions.

The admin production build and TypeScript validation pass. See `admin-test-results.json` for the actual database/HTTP workflow result and `admin-guide.md` for setup. Checks use isolated test records and captured emails. Production SMTP inbox delivery still requires your own provider configuration.
