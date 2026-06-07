# TechSpec Scanner App Store Privacy Worksheet

Last updated: 2026-06-07

This worksheet is an engineering aid, not legal advice. Answer App Store Connect from the behavior of the exact submitted build and re-check Apple's current definitions before submission.

## Current Build Summary

- No TechSpec Scanner user account.
- No advertising SDK.
- No cross-app or cross-site tracking.
- No contact, location, microphone, health, financial, or payment data.
- Component photos and context are sent to the TechSpec Scanner backend and Google Gemini only when the user starts analysis.
- Scan history, known parts, reports, preferences, and test records are primarily stored locally on the device.
- Anonymous installation ID and scan counters are used for service limits and abuse prevention.
- Optional beta feedback can contain a contact email and user-written message.

## Likely App Store Connect Disclosures

### User Content

Data:

- Photos or videos: component photos selected for analysis.
- Other user content: notes, measurements, project labels, corrections, reports, and feedback text.

Purposes:

- App Functionality.
- Product Personalization only if saved local records are considered personalized behavior in the submitted build.
- Analytics or Product Improvement only for feedback/evaluation data actually used for improvement.

Linked to identity:

- Usually no for scans in the current no-account build.
- Feedback can become linked when the user voluntarily provides an email address.

Tracking:

- No.

### Identifiers

Data:

- Anonymous installation ID used for per-install limits.

Purposes:

- App Functionality.
- Fraud Prevention, Security, and Compliance.

Linked to identity:

- No, unless later combined with an account, payment, or other identifying record.

Tracking:

- No.

### Usage Data

Data:

- Daily/monthly scan counts, request-limit events, selected model/source counters.

Purposes:

- App Functionality.
- Analytics if aggregated usage is used to improve the product.

Linked to identity:

- No for the current no-account build.

Tracking:

- No.

### Diagnostics

Data:

- Request failures and hosting/server logs needed to operate and secure the service.

Purposes:

- App Functionality.
- Analytics or Product Improvement only if diagnostic data is used for those purposes.

Linked to identity:

- Normally no in the current build, but verify the final hosting/logging configuration.

Tracking:

- No.

### Contact Info

Data:

- Email address only when voluntarily entered in beta feedback or sent to support.

Purposes:

- App Functionality and Developer Communications.

Linked to identity:

- Yes when provided.

Tracking:

- No.

## Third Parties To Declare Internally

- Google Gemini / Google Cloud: AI analysis of submitted images and context.
- Render or the final hosting provider: backend hosting and operational logs.
- n8n or another workflow provider only if the feedback webhook is enabled in production.

Each third party's current terms, retention behavior, and data-processing settings must be reviewed before release.

## User-Facing URLs

- Support: `https://techspec-scanner-beta.onrender.com/support/`
- Privacy: `https://techspec-scanner-beta.onrender.com/support/privacy.html`
- Privacy choices: `https://techspec-scanner-beta.onrender.com/support/privacy-choices.html`
- Terms: `https://techspec-scanner-beta.onrender.com/support/terms.html`
- Legal: `https://techspec-scanner-beta.onrender.com/support/legal.html`
- Contact: `support@techspecscanner.com`

Replace the Render beta URLs with the final domain before the public App Store release.

## Final Verification Questions

- Are uploaded photos retained by Google or the hosting provider, and for how long?
- Are server logs configured to record IP addresses or request bodies?
- Is feedback automation enabled in the submitted environment?
- Is crash reporting or analytics added to the native iOS build?
- Are accounts, subscriptions, or cloud sync present?
- Can users request deletion of any server-stored feedback?
- Does the privacy policy describe every affirmative answer above?

Any change to accounts, payments, analytics, advertising, cloud sync, image retention, or support tooling requires another privacy review.
