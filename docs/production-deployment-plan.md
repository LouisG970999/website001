# TechSpec Scanner Production Deployment Plan

## Goal

Move TechSpec Scanner from a laptop-hosted local test app to a production setup that can be used from anywhere, protects the Gemini API key, controls costs, and is suitable for App Store review.

## Target Architecture

```text
iPhone PWA / future iOS wrapper
        |
        | HTTPS
        v
Hosted TechSpec backend
        |
        | server-side API key
        v
Google Gemini API
```

The frontend should never contain the Gemini API key. All AI requests must go through the backend.

## Minimum Production Requirements

- HTTPS domain, for example `https://app.techspecscanner.com`.
- Hosted backend running `server.js` or a later production server.
- Environment variables stored in the hosting provider, not in frontend files.
- Gemini API key restricted and monitored in Google Cloud.
- Daily/monthly scan limits enabled.
- Billing alerts enabled in Google Cloud.
- Privacy policy URL and support URL.
- App Store screenshots and review notes.

## Current Server Controls Already Added

The local server now supports:

- `GEMINI_FAST_MODEL`
- `GEMINI_STRONG_MODEL`
- `DAILY_SCAN_LIMIT`
- `MONTHLY_SCAN_LIMIT`
- warning thresholds
- request size limits
- per-IP short-term rate limiting
- `/api/health` usage status
- `.data/usage.json` local usage counters

These are good for MVP production testing, but they are not a complete paid-user system yet.

## Recommended Environment Variables

```env
PORT=3000
GEMINI_API_KEY=your_production_key
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

Start with conservative limits and raise them only after measuring real usage.

## Hosting Options

Any Node-compatible hosting provider can work. Good categories:

- Simple app hosting: easy deployment, good for MVP.
- Container hosting: better control, good for scaling.
- Google Cloud Run: natural fit if Gemini/Google Cloud billing is already used.
- VPS: maximum control, more maintenance.

For first public testing, choose the option that gives:

- HTTPS automatically
- environment variables
- logs
- restart on crash
- simple deployment
- spending limits or alerts

## Deployment Steps

1. Create production Google Cloud project.
2. Enable Gemini API.
3. Create a production API key.
4. Restrict and monitor the key as much as the chosen API flow allows.
5. Enable billing alerts.
6. Choose a hosting provider.
7. Add environment variables in the host dashboard.
8. Deploy the backend.
9. Test:
   - `/api/health`
   - `/api/usage`
   - `/api/analyze`
   - request limit behavior
   - large-image rejection
   - Gemini error handling
10. Point a real domain to the backend.
11. Update frontend/backend URL if needed.
12. Test the app from iPhone on mobile data, not only Wi-Fi.
13. Prepare privacy policy and support page URLs.
14. Package the app for App Store submission.

## Cost Control Strategy

- Use `gemini-2.5-flash-lite` for normal scans.
- Route complex scans to `gemini-2.5-flash`.
- Keep image compression active.
- Limit number of images per scan.
- Keep daily/monthly caps.
- Add per-user limits before broad release.
- Add paid scan packs or subscription before marketing publicly.

## Next Engineering Step

Before a real launch, add one of these:

Option A: anonymous installation ID

- Simple and fast.
- Limits are per installed app/device.
- Not secure enough for serious paid plans, but good for beta.
- Implemented in the current app: the frontend stores a random install ID locally and sends it to the backend in `X-TechSpec-Install-Id`.

Option B: real accounts

- Better for paid users and multi-device access.
- Needs authentication, database, passwordless/email login, and privacy updates.

Recommendation: use anonymous installation ID for closed beta, then accounts before paid App Store release.

## Production Data Storage Decision

Currently, local browser storage holds:

- scan history
- known parts
- projects
- test logs
- settings

For production, choose:

1. Keep data local only.
   - Simpler privacy story.
   - No cross-device sync.
   - User can lose data when browser/app storage is cleared.

2. Add cloud accounts and sync.
   - Better product.
   - Requires authentication, database, backups, deletion/export requests, and stronger privacy policy.

Recommendation for MVP: local-first, no cloud sync. Add accounts only when the product need is clear.

## App Store Packaging Route

The current app works as a PWA. For App Store publishing, likely routes:

- Wrap the web app in a native iOS shell.
- Build a React Native / Expo version later.
- Rebuild native Swift UI later.

For speed, a native shell can be fastest, but Apple review still expects the app to feel like a real app and follow privacy/payment rules.

## Open Decisions

- Will users need accounts?
- Will the first release be free, paid, subscription, or scan packs?
- Will scan history stay local only?
- Will uploaded photos ever be stored on the server?
- Who is the legal publisher: individual or company?
- What support email and privacy-policy domain will be used?
