# TechSpec Scanner iOS Packaging Handoff

Last updated: 2026-06-07

This document describes the shortest responsible route from the hosted TechSpec Scanner beta to a TestFlight build. The web app and backend can continue to be developed on Windows. Creating, signing, and uploading the final iOS build requires macOS with Xcode.

## Recommended Route

Use a small native iOS container with Capacitor after the beta experience is stable. The native project should load packaged frontend assets and call the hosted HTTPS backend. Do not submit a container that only opens the public website in a browser view.

The iOS version should preserve native-value features:

- Camera and photo-library selection.
- Native share sheet for reports and exported files.
- Safe-area-aware navigation and reliable back behavior.
- App launch screen and offline/error states.
- Local app storage and explicit data deletion controls.
- Native status bar, appearance, and accessibility behavior.

Apple may reject apps that provide too little lasting value beyond a website. The App Store build must feel and behave like an installed iPhone app.

## What Is Ready

- Hosted HTTPS app and backend.
- Backend-only Gemini API key.
- Beta access and usage limits.
- Privacy, terms, legal, support, and privacy-choice pages.
- PWA manifest and service worker.
- 192 px, 512 px, and 1024 px app icons.
- AI acknowledgement and verification wording.
- App Store listing and TestFlight drafts.
- Release preflight endpoint at `/api/preflight`.

## What Still Requires a Mac

1. Install the current stable Xcode from the Mac App Store.
2. Sign in with the Apple ID enrolled in the Apple Developer Program.
3. Create the native iOS project and bundle identifier.
4. Add the 1024 px App Store icon and generated iOS icon assets.
5. Set camera and photo-library permission descriptions.
6. Configure signing, team, version, and build number.
7. Test on a physical iPhone.
8. Archive the app in Xcode.
9. Upload the archive to App Store Connect.
10. Distribute the first build through TestFlight.

## Proposed App Identity

- Product name: `TechSpec Scanner`
- Suggested bundle identifier: `com.techspecscanner.app`
- Initial marketing version: `1.0.0`
- Initial build number: `1`
- Primary category: Productivity
- Alternative category: Utilities
- Support email: `support@techspecscanner.com`
- Current hosted beta: `https://techspec-scanner-beta.onrender.com`

Confirm the bundle identifier is available before creating App Store Connect records. Bundle identifiers cannot be casually changed after publication.

## Required iOS Permission Text

Use plain language and only request access when the user starts the related action.

Camera:

```text
TechSpec Scanner uses the camera to photograph mechanical components that you choose to analyze.
```

Photo library:

```text
TechSpec Scanner uses selected photos to analyze and document mechanical components.
```

Do not request microphone, location, contacts, or tracking permission for the current product.

## Backend Configuration for TestFlight

The native build must use the hosted HTTPS backend. Never include `GEMINI_API_KEY`, admin codes, automation secrets, or Render credentials in the iOS project.

Before uploading:

1. Set the final `PUBLIC_BASE_URL`.
2. Keep `APP_MODE=production`.
3. Confirm `/api/preflight` has no critical blockers.
4. Confirm scan limits and billing alerts.
5. Confirm support and legal pages are public without the beta code.
6. Decide whether TestFlight still requires `BETA_ACCESS_CODE`.

## TestFlight Test Matrix

- One current iPhone and one older supported iPhone.
- Wi-Fi and mobile data.
- Fresh install and update over an older build.
- Camera capture, photo-library selection, and pasted image.
- Successful scan, uncertain scan, invalid image, offline state, and sleeping-host delay.
- PDF/JSON export, share sheet, and return navigation.
- Light, dark, and system appearance.
- English, German, French, and Spanish.
- Large text, VoiceOver labels, and reduced motion.
- Local data deletion and reinstall behavior.

## Stop Conditions Before Submission

Do not submit if:

- The app depends on a laptop or local Wi-Fi.
- The API key is present in frontend/native files.
- Privacy or support URLs contain placeholders.
- The app cannot recover from backend or network errors.
- Export/share leaves the user trapped outside the app.
- App privacy answers do not match the submitted build.
- The publisher identity or rights to the logo/assets are uncertain.

## Practical Next Decision

Continue the hosted beta until scan quality, navigation, and cost behavior are understood. Then obtain temporary or permanent access to a Mac, create the Capacitor/Xcode project, and use this repository as the audited source for the first TestFlight build.
