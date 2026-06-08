# TechSpec Scanner TestFlight Submission Packet

Last updated: 2026-06-08

Use this text when the first native iOS build is uploaded to App Store Connect. Re-check the build number, URLs, access code, and contact details immediately before submission.

## Beta App Description

TechSpec Scanner is an AI-assisted tool for documenting and identifying mechanical components from photos. Testers can capture guided component views, add context and measurements, review visible evidence and uncertainty, save known parts locally, and export structured reports.

## What To Test

1. Scan one clearly identifiable component and one difficult, worn, or poorly marked component.
2. Review the suggested name, category, function, material clues, visible features, uncertainty, and recommended next photo.
3. Confirm that camera capture and photo-library selection work.
4. Add a technician note or correction and export a report.
5. Change language and appearance, then confirm the layout remains readable.
6. Check that privacy, data choices, terms, legal, and support pages are reachable.

AI results are suggestions. Verify results against physical measurements, markings, manufacturer documentation, and engineering judgment.

## Support Contact

`support@techspecscanner.com`

## Public URLs

- Support: https://techspec-scanner-beta.onrender.com/support/
- Privacy: https://techspec-scanner-beta.onrender.com/support/privacy.html
- Data choices: https://techspec-scanner-beta.onrender.com/support/privacy-choices.html
- Terms: https://techspec-scanner-beta.onrender.com/support/terms.html
- Legal: https://techspec-scanner-beta.onrender.com/support/legal.html

Replace these Render beta URLs with the final domain when it is available.

## Beta Access

The hosted beta currently uses a private access code. Enter the active code in the App Review information field and send it only through private tester or App Store Connect channels. Do not include it in public release notes, screenshots, source files, or this document.

## Review Notes

TechSpec Scanner sends only user-selected mechanical component photos and user-entered scan context to its backend when the user starts an analysis. The backend stores the Google Gemini API key in a server environment variable and forwards the scan request to Google Gemini. The API key is not included in the frontend or native application.

The current version has no TechSpec Scanner account, advertising SDK, cross-app tracking, contacts access, location access, or microphone access. Scan history, known parts, reports, preferences, and testing records are stored locally on the device. The backend uses an anonymous installation ID and usage counters for scan limits and abuse prevention. Optional beta feedback can contain an email address only when the tester voluntarily enters one.

AI results can be incomplete or incorrect. The app presents confidence, uncertainty, missing evidence, and verification guidance. It is not a certified engineering verification tool and must not be used as the sole basis for safety-critical, purchasing, repair, or design decisions.

## Native Permission Text

Camera:

`TechSpec Scanner uses the camera to photograph mechanical components that you choose to analyze.`

Photo library:

`TechSpec Scanner uses selected photos to analyze and document mechanical components.`

No tracking permission is required for the current product behavior.

## Final Submission Check

Run:

```powershell
npm run smoke
npm run release:audit
npm run release:audit:remote
```

The release audit must report zero failures. Resolve or consciously review every warning before uploading the build.
