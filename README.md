# BG Elevators Website and CMS

Production website and administration system for BG Elevators.

- Public website: React 19, Vite and Express
- Admin CMS: Next.js 15
- Database: MongoDB
- Email: SMTP
- Production URL: `https://www.bgelevators.com`

## Requirements

- Node.js 22.12 or newer
- npm
- MongoDB database
- SMTP account for enquiry, brochure and career emails

## Local setup

```bash
npm ci
npm --prefix admin ci
```

Copy `.env.example` to `.env` and replace every placeholder with a secure value. Never commit `.env`.

Create the first CMS administrator once:

```bash
npm run admin:create
```

Start the website and API:

```bash
npm run dev:full
```

Start the CMS in another terminal:

```bash
npm run admin:dev
```

- Website: `http://localhost:5173`
- Admin: `http://localhost:3002/admin`

## Required environment variables

```env
PORT=5000
SITE_URL=https://www.bgelevators.com
TRUST_PROXY=1

MONGODB_URI=mongodb+srv://...
MONGODB_DB=bg_elevators_cms

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="BG Elevators <email@example.com>"
ENQUIRY_TO=marketing@bgelevators.com
CAREERS_TO=marketing@bgelevators.com

SESSION_SECRET=replace-with-a-long-random-secret
ADMIN_NAME=Primary Administrator
ADMIN_EMAIL=admin@bgelevators.com
ADMIN_PASSWORD=replace-before-creating-admin
NEXT_PUBLIC_WEBSITE_URL=https://www.bgelevators.com

IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

Generate a secure session secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Optional search and analytics variables:

```env
VITE_GOOGLE_SITE_VERIFICATION=
VITE_GA_MEASUREMENT_ID=
```

## Verify before launch

```bash
npm run build
npm run check
npm run check:blogs
npm run check:configurator
npm run admin:build
```

## Production deployment

Deploy the public website/API and the admin CMS as separate Node services from the same repository.

### Website and API

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/api/health`
- Generated folders required at runtime: `dist/` and `.ssr/`

### Admin CMS

- Root directory: `admin`
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Admin path: `/admin`

Both services must use the same MongoDB settings. The public service also needs SMTP settings. Set `TRUST_PROXY=1` only when the public service runs behind one trusted reverse proxy.

## Going-live checklist

- Point the production domain and enable HTTPS.
- Add all production environment variables to the hosting provider.
- Use new MongoDB, SMTP, admin and session credentials; never reuse exposed credentials.
- Allow the production server IP in MongoDB Atlas network access.
- Create the first administrator and remove `ADMIN_PASSWORD` afterward if it is no longer needed.
- Test enquiry, brochure download, career upload, CMS login, blog publishing and estimator submission.
- Confirm `/robots.txt`, `/sitemap.xml`, canonical URLs and legacy `.html` redirects.
- Submit `https://www.bgelevators.com/sitemap.xml` in Google Search Console.
- Configure backups and monitoring for MongoDB and both Node services.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev:full` | Run the local website and API |
| `npm run admin:dev` | Run the local CMS |
| `npm run build` | Build and pre-render the public website |
| `npm start` | Start the production public server |
| `npm run admin:build` | Build the CMS |
| `npm run check` | Run public-site verification |
| `npm run check:blogs` | Validate blog content and links |
| `npm run check:configurator` | Validate estimator data |

For detailed CMS instructions, see [docs/admin-guide.md](docs/admin-guide.md).
