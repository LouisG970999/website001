# TechSpec Scanner

## iPhone install

Open the local app URL in Safari, tap Share, then choose Add to Home Screen. The app uses the TechSpec icon and runs in standalone display mode when launched from the home screen.

A zero-dependency MVP web app for taking or uploading a mechanical component photo from an iPhone browser, sending it to a backend, and displaying Gemini-ready structured identification results.

## Features

- iPhone camera/photo upload from Safari.
- Guided scan slots for overview, markings, side view, and scale photos.
- Navigation pages for Scan, Projects, Library, Reports, and Settings.
- AI focus modes for auto-detect, fasteners, bearings, gears, shafts, conveyor parts, fluid power parts, sensors, seals, springs, brackets, and linear guides.
- Manual measurement fields for dimensions, weight, material confirmation, and measured-by notes.
- Gemini structured JSON analysis.
- Local scan history in the browser.
- Editable analysis results with verification status and technician notes.
- Local projects and known-parts database with match suggestions.
- Known-parts library import/export and per-part delete/edit actions.
- Copy result, JSON export, and print-to-PDF report export actions.
- Screenshot demo loader for App Store screenshots without spending Gemini credits.
- Screenshot mode in Settings to hide local IP/install ID details.

## Run

```powershell
node server.js
```

If `node` is blocked on your Windows PATH, use the bundled Codex Node runtime:

```powershell
& "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
```

Open:

```text
http://localhost:3000
```

To test from your iPhone, connect the iPhone to the same Wi-Fi and open:

```text
http://YOUR_LAPTOP_IP:3000
```

You can also start the server from PowerShell with:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```

Keep that PowerShell window open while testing.

## Gemini API Key

Create a `.env` file:

```env
GEMINI_API_KEY=your_key_here
PORT=3000
APP_MODE=development
BETA_ACCESS_CODE=
FEEDBACK_ADMIN_CODE=
PUBLIC_BASE_URL=
SUPPORT_EMAIL=
SUPPORT_WEBSITE=
SUPPORT_BETA_GUIDE_URL=
SUPPORT_PRIVACY_URL=
SUPPORT_TERMS_URL=
SUPPORT_LEGAL_URL=
SUPPORT_FEEDBACK_URL=
PUBLISHER_NAME=
PRIVACY_PUBLICATION_DATE=
GEMINI_FAST_MODEL=gemini-2.5-flash-lite
GEMINI_STRONG_MODEL=gemini-2.5-flash
DAILY_SCAN_LIMIT=80
MONTHLY_SCAN_LIMIT=800
INSTALL_DAILY_SCAN_LIMIT=25
INSTALL_MONTHLY_SCAN_LIMIT=250
AUTOMATION_FEEDBACK_WEBHOOK_URL=
AUTOMATION_WEBHOOK_SECRET=
```

Without a key, the app returns a demo result so the UI can be tested immediately.

Never paste the key into frontend files, screenshots, commits, or chat. Keep it only in `.env`.

The app generates an anonymous install ID in local browser storage and sends it to the backend with scan requests. This lets the server enforce per-device scan limits without requiring accounts.

## Production Planning

Draft publishing and deployment materials live in `docs/`:

- `docs/privacy-policy-draft.md`
- `docs/app-store-listing-draft.md`
- `docs/app-store-submission-checklist.md`
- `docs/production-deployment-plan.md`
- `docs/deployment-runbook.md`

These are drafts and should be checked before a real App Store submission.

The project also includes a static support/privacy website in `public/support/`.
Update `public/support/support-config.js` before publishing:

- `/support/`
- `/support/beta.html`
- `/support/privacy.html`
- `/support/terms.html`
- `/support/legal.html`
- `/support/feedback.html`

Before publishing, replace the placeholder support email, company/name, support URL, privacy URL, terms URL, publication date, and final hosted domain.

Hosted deployments can override support metadata without code edits by setting `PUBLIC_BASE_URL`, `SUPPORT_EMAIL`, `SUPPORT_WEBSITE`, `SUPPORT_BETA_GUIDE_URL`, `SUPPORT_PRIVACY_URL`, `SUPPORT_TERMS_URL`, `SUPPORT_LEGAL_URL`, `SUPPORT_FEEDBACK_URL`, `PUBLISHER_NAME`, and `PRIVACY_PUBLICATION_DATE` in the backend environment.

Commercial app assets should stay all rights reserved. If school or project documentation needs a Creative Commons notice, use `CC BY-NC-ND 4.0` only on that separate documentation, not on the app, source code, logo, brand, website design, or App Store material.

Settings includes a Publishing Pack with reviewer notes, privacy summary, App Store listing copy, production environment template, support config template, release checklist, and backend preflight checks. The preflight endpoint is:

```text
http://localhost:3000/api/preflight
```

For public builds, set `APP_MODE=production` on the backend. The frontend uses that health value to hide developer-only tools such as screenshot demo loading, App Store readiness controls, and Publishing Pack utilities.

For a private beta, set `BETA_ACCESS_CODE` on the backend before sharing the hosted app link. When this value is present, AI scan requests and beta feedback submissions must include the code, which helps prevent casual link sharing from burning API credits.

Set `FEEDBACK_ADMIN_CODE` to an owner-only value before relying on hosted beta feedback. It protects the feedback export endpoint at `/api/feedback/export`. Do not share that admin code with testers.

The owner feedback dashboard is available at `/support/admin-feedback.html`. It can load feedback, filter entries, export JSON/CSV, delete individual entries, and show hosted beta health.

Optional feedback automation can be connected later with `AUTOMATION_FEEDBACK_WEBHOOK_URL`. This is designed for n8n, Make, Zapier, or a custom webhook receiver. If it is empty, feedback still works normally and is stored on the server. If it is set, the server sends a copy of each beta feedback entry to the webhook without exposing API keys or beta codes.

For a local server/support/feedback smoke test, run:

```text
npm run smoke
```

See `docs/beta-feedback-operations.md` for the operating routine during private beta testing.

## Quick Checks

Check that the backend is running:

```text
http://localhost:3000/api/health
```

If the iPhone cannot open the app:

1. Confirm the laptop and iPhone are on the same Wi-Fi.
2. Run `ipconfig` and use the current IPv4 address.
3. Keep the PowerShell server window open.
4. If needed, allow Node.js through Windows Firewall for private networks.

If the app returns demo results, the server did not read `GEMINI_API_KEY`. Restart the server after saving `.env`.

If Gemini returns an API key error, create a fresh key in Google Cloud and replace only the value after `GEMINI_API_KEY=`.

## Workflow

1. Add at least an overview photo.
2. Add marking, side-view, and scale photos when available.
3. Choose `Auto detect` unless you already know the component family.
4. Select or create a project.
5. Enter any measurements you already know.
6. Analyze the part.
7. Edit/correct the result if needed.
8. Set verification status and technician notes.
9. Save confirmed components to `Known parts`.
10. Export a PDF report or JSON record when needed.

The known-parts database is currently stored in browser local storage on the device that saved it.
