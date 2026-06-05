# TechSpec Scanner App Store Submission Checklist

Last updated: 2026-06-01

This checklist is a practical release-preparation aid, not legal advice. Re-check Apple documentation and final business/legal details before submitting.

## Official Apple Sources To Re-Check

- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App privacy details: https://developer.apple.com/app-store/app-privacy-details/
- App Store Connect app privacy reference: https://developer.apple.com/help/app-store-connect/reference/app-information/app-privacy
- TestFlight overview: https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/
- TestFlight test information: https://developer.apple.com/help/app-store-connect/test-a-beta-version/provide-test-information

## Current Product Position

TechSpec Scanner is an AI-assisted technical documentation and component identification app. It analyzes user-submitted mechanical component photos and context through a backend-protected Gemini API key. It is not a certified engineering verification tool.

This positioning should stay consistent across:

- App Store name, subtitle, description, keywords, screenshots, and preview media.
- In-app AI/privacy acknowledgement.
- Privacy policy, terms, legal notice, and support pages.
- TestFlight beta description and review notes.

## App Review Guideline Risks To Control

### App completeness

- [ ] Final app loads without local laptop dependency.
- [ ] Backend is running and stable during review.
- [ ] Support URL, privacy URL, and terms/legal pages load over HTTPS.
- [ ] No placeholder text remains in user-facing production pages.
- [ ] No developer-only test tools are visible in production.
- [ ] If login/accounts are added, provide Apple with a demo account.

### Accurate metadata

- [ ] App Store description clearly says AI-assisted, not guaranteed identification.
- [ ] Screenshots show the real app experience.
- [ ] The app does not imply certified safety, repair, or purchasing decisions.
- [ ] Privacy labels match final behavior, including Google Gemini processing.
- [ ] Any paid plan, subscription, or scan pack is fully functional and visible if included.

### Privacy and consent

- [ ] Privacy policy is linked in App Store Connect and easily accessible inside the app.
- [ ] Privacy policy explains photos, notes, measurements, anonymous install ID, usage counters, feedback, and third-party AI processing.
- [ ] Data retention/deletion wording is finalized.
- [ ] User can understand that images/context may be sent to Google Gemini through the backend.
- [ ] No tracking is declared unless cross-app/site tracking or advertising is intentionally added.

### AI and safety

- [ ] AI acknowledgement appears before first use.
- [ ] Results include confidence/uncertainty and missing evidence.
- [ ] Result exports keep AI/verification wording.
- [ ] Terms/disclaimer say users must verify with measurements, markings, documentation, and professional judgment.
- [ ] The app is not marketed for safety-critical decisions as a sole source.

### Intellectual property and licensing

- [ ] App source code, backend, logo, app icon, brand name, app UI, website design, App Store screenshots, and marketing assets are treated as all rights reserved.
- [ ] Creative Commons is not used as the app/source-code/logo license.
- [ ] Any separate school, demonstration, or project documentation that uses Creative Commons states: `CC BY-NC-ND 4.0 Attribution-NonCommercial-NoDerivatives 4.0 International`.
- [ ] CC BY-NC-ND or other NonCommercial/NoDerivatives third-party material is not included in the commercial app UI, source code, logo, editable assets, screenshots, or paid marketing material without separate permission.
- [ ] Third-party services, images, fonts, datasets, libraries, and examples are listed in the legal notice before public release.

## Likely App Privacy Answers

These must be verified against the final production build.

### Data categories likely collected

- User Content: component photos, notes, measurements, project names, scan reports, saved known parts, feedback messages.
- Usage Data: scan counts, rate-limit events, basic backend request/usage counters.
- Identifiers: anonymous installation ID for per-device limits.
- Diagnostics: errors, server logs, support bundle data if collected/submitted.

### Likely purposes

- App Functionality: scan analysis, reports, local library, feedback submission.
- Analytics/Product Improvement: beta feedback, evaluation logs, usage counters if used for improvement.
- Fraud Prevention/Security: rate limits, abuse prevention, cost control.

### Data linked to user?

For the current no-account beta, most data is not directly linked to a named account unless the user enters contact email in feedback or includes personal data in notes/photos. If accounts, payments, or cloud sync are added, this answer changes.

### Tracking?

Set tracking to "No" unless advertising identifiers, third-party ad networks, or cross-app/site tracking are added.

## TestFlight Preparation

Apple notes that TestFlight can distribute beta builds and collect feedback, including external testers, but external beta builds may require review.

Prepare:

- [ ] Beta app description.
- [ ] What to test instructions.
- [ ] Support/feedback email.
- [ ] Review notes explaining backend/Gemini/API-key architecture.
- [ ] Demo access instructions or beta access code if still required.
- [ ] Privacy URL and support URL.

Suggested TestFlight beta description:

```text
TechSpec Scanner is an AI-assisted tool for documenting and identifying mechanical components from photos. Testers can scan parts, review suggested identification details, export reports, and send feedback about accuracy, usability, and unclear results.
```

Suggested "What to Test":

```text
Please scan 2-3 mechanical components, including one easy part and one difficult or poorly marked part. Check whether the component name, material clues, confidence, visible features, uncertainty, and recommended next photo are understandable. Send feedback from the result screen or beta feedback page.
```

Suggested Review Notes:

```text
The app sends user-selected mechanical component photos and context to a backend service. The backend stores the Gemini API key as an environment variable and forwards scan requests to Google Gemini. The frontend does not contain the API key. AI results are suggestions only and the app repeatedly tells users to verify with measurements, markings, manufacturer documentation, and engineering judgment.
```

## Pre-Submission Blockers

- [ ] Final legal publisher name.
- [ ] Final support email.
- [ ] Final public domain.
- [ ] Final privacy policy, terms, and legal notice reviewed.
- [ ] Persistent storage decision for feedback/usage if beta grows.
- [ ] Billing alerts and Gemini quota strategy.
- [ ] App Store screenshots from the final production build.
- [ ] Native iOS packaging route decided.
- [ ] Device testing on at least one current iPhone and one older supported iPhone.
