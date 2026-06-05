# TechSpec Scanner Beta Hosting Runbook

## Goal

Host TechSpec Scanner so testers can use it from home or external places without being on the same Wi-Fi as the development laptop.

Recommended beta setup:

- Public website: `https://techspecscanner.com`
- App/backend: `https://app.techspecscanner.com`
- Private beta access: `BETA_ACCESS_CODE`
- Feedback export access: `FEEDBACK_ADMIN_CODE`

## Why This Is Needed

The local laptop server only works while:

- the laptop is on
- the server is running
- the tester is on the same network
- the local IP address has not changed

For real beta testing, the app/backend must run on an internet-accessible HTTPS server.

## Recommended First Beta Stack

- Domain: any registrar or Cloudflare Registrar
- DNS: Cloudflare
- Hosting: Render web service
- App type: Node.js web service
- Backend/API: same server as the PWA
- Beta protection: `BETA_ACCESS_CODE`
- AI provider: Gemini via backend-only `GEMINI_API_KEY`

## Step 1: Buy Or Connect Domain

Buy or connect a domain such as:

- `techspecscanner.com`
- `techspec-scanner.com`

Use Cloudflare DNS if possible, because DNS and HTTPS setup are clean and common.

## Step 2: Put Project On GitHub

Create a private GitHub repository and push the project.

Do not commit `.env`.

The repository should include:

- `server.js`
- `package.json`
- `public/`
- `render.yaml`
- `README.md`
- `docs/`

## Step 3: Create Render Web Service

Create a new Render web service from the GitHub repository.

Use:

- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

The included `render.yaml` already describes the intended setup.

## Step 4: Add Environment Variables

Add these environment variables on the hosted service:

```env
APP_MODE=production
PUBLIC_BASE_URL=https://app.techspecscanner.com
SUPPORT_EMAIL=support@techspecscanner.com
SUPPORT_WEBSITE=https://app.techspecscanner.com/support/
SUPPORT_BETA_GUIDE_URL=https://app.techspecscanner.com/support/beta.html
SUPPORT_PRIVACY_URL=https://app.techspecscanner.com/support/privacy.html
SUPPORT_TERMS_URL=https://app.techspecscanner.com/support/terms.html
SUPPORT_LEGAL_URL=https://app.techspecscanner.com/support/legal.html
SUPPORT_FEEDBACK_URL=https://app.techspecscanner.com/support/feedback.html
PUBLISHER_NAME=TechSpec Scanner
PRIVACY_PUBLICATION_DATE=2026-06-05
GEMINI_API_KEY=your_gemini_key
BETA_ACCESS_CODE=private-code-for-testers
FEEDBACK_ADMIN_CODE=private-owner-only-feedback-code
GEMINI_FAST_MODEL=gemini-2.5-flash-lite
GEMINI_STRONG_MODEL=gemini-2.5-flash
DAILY_SCAN_LIMIT=80
MONTHLY_SCAN_LIMIT=800
INSTALL_DAILY_SCAN_LIMIT=25
INSTALL_MONTHLY_SCAN_LIMIT=250
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=12
MAX_ANALYZE_BODY_BYTES=14680064
MAX_FEEDBACK_BODY_BYTES=131072
MAX_IMAGE_BASE64_CHARS=6500000
```

Never put the real Gemini API key in frontend code or public documents.

## Step 5: Connect Custom Domain

In Render, add:

```text
app.techspecscanner.com
```

Render will show DNS records to add at the DNS provider. Add those records in Cloudflare or your registrar DNS panel.

Wait until HTTPS is active.

## Step 6: Update Support Config

Before public sharing, either set the support environment variables above or update:

`public/support/support-config.js`

Use final values:

```js
window.TechSpecSupport = {
  appName: "TechSpec Scanner",
  publisherName: "Final publisher name",
  supportEmail: "support@techspecscanner.com",
  supportWebsite: "https://app.techspecscanner.com/support/",
  betaGuideUrl: "https://app.techspecscanner.com/support/beta.html",
  privacyUrl: "https://app.techspecscanner.com/support/privacy.html",
  termsUrl: "https://app.techspecscanner.com/support/terms.html",
  legalUrl: "https://app.techspecscanner.com/support/legal.html",
  feedbackUrl: "https://app.techspecscanner.com/support/feedback.html",
  publicationDate: "2026-05-29"
};
```

## Step 7: Test Hosted App

Open:

```text
https://app.techspecscanner.com/api/health
https://app.techspecscanner.com/api/preflight
https://app.techspecscanner.com/support/
https://app.techspecscanner.com/support/feedback.html
https://app.techspecscanner.com/
```

Expected:

- `/api/health` returns `ok: true`
- `appMode` is `production`
- `betaAccessRequired` is `true`
- support/legal/privacy/feedback pages load
- developer-only UI is hidden
- first AI scan asks for beta access code

## Step 8: Send Testers

Send only trusted testers:

```text
App link:
https://app.techspecscanner.com

Beta code:
private-code-for-testers

Feedback:
https://app.techspecscanner.com/support/feedback.html
```

## Step 9: Export Beta Feedback

Set `FEEDBACK_ADMIN_CODE` to a private owner-only value. Do not send this code to testers.

To export feedback from the hosted server, make a `GET` request to:

```text
https://app.techspecscanner.com/api/feedback/export
```

with this request header:

```text
X-TechSpec-Admin-Code: private-owner-only-feedback-code
```

The response contains the stored feedback entries as JSON. This file-based storage is only suitable for early beta testing because free hosts can clear local files during redeploys or restarts.

You can also use the owner page:

```text
https://app.techspecscanner.com/support/admin-feedback.html
```

Enter `FEEDBACK_ADMIN_CODE`, load the entries, then download JSON or CSV. Do not share this page/code with testers.

The admin page can also delete individual feedback entries. Use this for test spam, duplicate entries, or a tester deletion request. Deletion is permanent for the file-based beta store.

The admin page also shows beta health, including backend status, Gemini configuration, beta access state, current usage counters, and release preflight warnings.

Before pushing server or feedback changes, run the local smoke test:

```text
npm run smoke
```

## Important Beta Limitation

The current file-based feedback and usage storage is fine for early testing, but production should use persistent storage. If the host has an ephemeral filesystem, `.data/feedback.json` and `.data/usage.json` may not survive redeploys.

Before a broader public launch, use one of:

- Render persistent disk
- Supabase/Postgres
- another managed database

## Launch Blockers To Clear

- Final support email
- Final publisher/legal name
- Final domain
- Production Gemini API billing/alerts
- Persistent data storage decision
- Privacy/terms/legal wording reviewed
- Beta tester instructions written
