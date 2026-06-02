# TechSpec Scanner Deployment Runbook

This runbook turns the local project into a public beta deployment. It assumes the current local-first app remains a web/PWA frontend with a Node backend.

## 1. Decide Public Identity

Fill these values before hosting:

- Publisher name:
- Support email:
- Support website URL:
- Privacy policy URL:
- Terms of Use URL:
- Public app/backend URL:
- Production domain:

Update:

- `public/support/support-config.js`
- `docs/privacy-policy-draft.md`
- `docs/app-store-listing-draft.md`

## 2. Prepare Google Cloud

1. Create or choose a production Google Cloud project.
2. Enable Gemini API.
3. Create a production Gemini API key.
4. Set billing alerts.
5. Set budget alerts before inviting testers.
6. Decide first limits:
   - `DAILY_SCAN_LIMIT`
   - `MONTHLY_SCAN_LIMIT`
   - `INSTALL_DAILY_SCAN_LIMIT`
   - `INSTALL_MONTHLY_SCAN_LIMIT`

## 3. Choose Hosting

Recommended first beta path:

- Node-capable backend hosting for `server.js`.
- Static files served from the same backend initially.
- HTTPS domain enabled by the host.

The current project does not need a separate static host yet because `server.js` serves both the app and support website.

## 4. Production Environment Variables

Set these in the hosting dashboard, not inside frontend files:

```env
PORT=3000
APP_MODE=production
PUBLIC_BASE_URL=https://your-production-domain.example
GEMINI_API_KEY=your_production_key
BETA_ACCESS_CODE=private_beta_code_if_beta_is_enabled
FEEDBACK_ADMIN_CODE=private_owner_only_feedback_code
GEMINI_FAST_MODEL=gemini-2.5-flash-lite
GEMINI_STRONG_MODEL=gemini-2.5-flash
DAILY_SCAN_LIMIT=500
MONTHLY_SCAN_LIMIT=10000
DAILY_WARNING_LIMIT=400
MONTHLY_WARNING_LIMIT=8000
INSTALL_DAILY_SCAN_LIMIT=25
INSTALL_MONTHLY_SCAN_LIMIT=250
INSTALL_DAILY_WARNING_LIMIT=20
INSTALL_MONTHLY_WARNING_LIMIT=200
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=12
MAX_ANALYZE_BODY_BYTES=14680064
MAX_IMAGE_BASE64_CHARS=6500000
```

Start conservatively. Raise limits only after checking real usage and cost.

## 5. Pre-Deploy Local Checks

Run:

```powershell
& "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" --check .\server.js
& "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" --check .\public\app.js
& "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" --check .\public\sw.js
```

Then test locally:

- `/`
- `/support/`
- `/support/beta.html`
- `/support/privacy.html`
- `/support/terms.html`
- `/api/health`
- `/api/usage`
- `/api/preflight`
- one real scan
- one PDF export
- one CSV test-log export
- one feedback submission
- feedback export with the owner-only admin code

`/api/preflight` should be treated as the quick release gate. It must not expose secrets. Before public release, the critical checks should pass:

Support URLs in `public/support/support-config.js` may use local paths such as `/support/privacy.html` during beta hosting. When `PUBLIC_BASE_URL` is set to the hosted HTTPS domain, the backend resolves those local paths into full public URLs for preflight checks.

For hosted builds, the backend can also serve `public/support/support-config.js` with environment-specific overrides. Set these in Render when final values are available:

```text
SUPPORT_EMAIL=your-real-support-email@example.com
SUPPORT_WEBSITE=https://your-domain.example/support/
PUBLISHER_NAME=Your legal publisher name
PRIVACY_PUBLICATION_DATE=2026-06-02
```

- Gemini API key configured.
- `APP_MODE=production` so developer-only tools stay hidden in the public app.
- `PUBLIC_BASE_URL` set to the final HTTPS production URL.
- Support email no longer uses a placeholder.
- Support website and privacy URL use public HTTPS URLs.
- Terms of Use URL uses a public HTTPS URL.
- Support, privacy, and terms pages are reachable.
- Rate limits and usage limits are configured.
- Private beta feedback export is protected by `FEEDBACK_ADMIN_CODE`.

## 6. Deploy

1. Upload or connect the project to the chosen host.
2. Add environment variables.
3. Start the backend with `node server.js`.
4. Confirm the public URL loads over HTTPS.
5. Confirm `/api/health` does not expose secrets.
6. Confirm `/api/preflight` reports no critical blockers.
7. Confirm `/support/privacy.html` is public.
8. Confirm `/support/terms.html` is public.
9. Test from an iPhone on mobile data.

## 7. Public Beta Checklist

Before sharing with testers:

- Replace all support placeholders.
- Confirm privacy policy wording.
- Confirm Terms of Use wording.
- Confirm Google Cloud billing alerts.
- Confirm per-device limits appear in Settings.
- Confirm API key is not in frontend files.
- Confirm Settings > Publishing Pack shows no critical release blockers.
- Confirm support page contact works.
- Confirm the app can recover from Gemini errors gracefully.

## 8. App Store Checklist

Before App Store submission:

- Privacy policy URL.
- Terms of Use URL, if required by final business model.
- Support URL.
- App icon.
- Screenshots.
- App description.
- AI disclaimer.
- App privacy labels matching final behavior.
- Demo account if accounts are added.
- Decision on pricing: free, paid, subscription, or scan packs.

## 9. Rollback Plan

If costs spike or Gemini errors occur:

1. Lower `DAILY_SCAN_LIMIT`.
2. Lower `INSTALL_DAILY_SCAN_LIMIT`.
3. Rotate the Gemini API key if needed.
4. Temporarily disable AI scans by removing `GEMINI_API_KEY` to fall back to demo mode.
5. Review server logs and `.data/usage.json`.

## 10. Next Engineering Milestones

1. Add production logging with redaction.
2. Add an admin-only usage dashboard.
3. Add accounts or paid scan packs.
4. Add hosted database if cloud sync becomes necessary.
5. Package as iOS app or native wrapper for App Store.
