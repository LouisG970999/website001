# TechSpec Scanner Privacy Policy Draft

Last updated: 2026-06-07

This is a draft for publication review. It is not legal advice. Before App Store release, replace all placeholders and have the final wording checked for your region and business setup.

## Overview

TechSpec Scanner helps users identify mechanical components from photos, notes, measurements, and related scan information. The app uses an AI backend to analyze submitted component images and return a structured technical result.

## Data We Process

TechSpec Scanner may process the following data when you use the app:

- Photos of mechanical components that you choose to submit for analysis.
- Context notes, measurements, project names, technician notes, corrections, and evaluation labels that you enter.
- Beta feedback messages, optional contact email, app version, browser/device details, and the page or feature you report.
- Technical request information such as request time, anonymous installation ID, basic usage counters, and server-side scan limits.
- App settings stored locally on your device, such as language, theme, recent scans, known parts, and testing entries.

TechSpec Scanner is not intended for uploading photos containing people, personal documents, confidential customer data, or sensitive personal information.

## How We Use Data

We use submitted data to:

- Analyze mechanical components and generate scan results.
- Display scan history, reports, known-parts matches, and testing statistics.
- Maintain usage limits, prevent abuse, and control API costs.
- Improve product reliability based on scan evaluations and corrections.

## AI Processing

When AI analysis is enabled, submitted component images and related scan context are sent to our backend and then to Google Gemini for processing. The AI response is returned to the app as a structured component identification result.

AI results may be incomplete or incorrect. Users should verify the output using physical measurements, markings, manufacturer documentation, and engineering judgment before using the result for maintenance, purchasing, safety, or design decisions.

## Local Storage

The app stores scan history, known parts, projects, reports, testing entries, language, theme, and readiness checklist data in local browser storage on your device. This local data remains on the device/browser unless you export it, delete it, clear browser data, or later use a future cloud-sync feature.

## Server Storage

The current backend stores usage counters such as daily and monthly scan counts. In a production deployment, server logs may also include timestamps, request status, approximate technical request metadata, and error information needed to operate and secure the service.

The app may generate a random anonymous installation ID stored locally on the device. This ID is used to apply per-device scan limits and prevent abuse. It is not intended to identify a person by name.

The production version should define retention periods before release. Suggested starting point:

- Usage counters: retained while needed for billing, abuse prevention, and diagnostics.
- Error logs: retained for a limited operational period, for example 30 to 90 days.
- Uploaded images: do not store by default unless the user explicitly saves, exports, or enables a future cloud account feature.

## Sharing With Third Parties

We may share submitted scan data with service providers needed to operate the app, including:

- Google Gemini / Google Cloud for AI analysis.
- Hosting, logging, storage, and infrastructure providers.
- Automation/workflow providers such as n8n, if optional feedback automation is enabled.
- Payment providers if paid plans, subscriptions, or scan packs are added later.

We do not sell personal data.

## App Store Privacy Notes

Before release, App Store privacy answers must match the final production behavior. Apple requires developers to provide privacy practice details for the App Store product page and a privacy policy URL in App Store Connect.

Likely data categories for the first production version may include:

- User Content: component photos, notes, project names, scan reports, and saved known parts.
- Usage Data: scan counts, rate-limit events, and basic app usage needed to operate the service.
- Diagnostics: crash reports, error logs, and performance data if enabled.
- Identifiers: anonymous installation ID, account ID, or device ID if used for per-user or per-device limits.

Tracking should be set to "No" unless advertising or cross-app tracking is intentionally added.

## User Choices

Users can:

- Choose whether to submit images for analysis.
- Delete local scan history and known-parts data from the app.
- Export reports, JSON records, CSV test logs, or known-parts libraries.
- Contact support to request help with account or server-side data, if accounts are added.

## Security

The Gemini API key is stored only on the backend and is not included in the app frontend. Production deployments should use HTTPS, server-side API protection, request size limits, usage limits, billing alerts, and secure environment variables.

## Children

TechSpec Scanner is intended for technical and professional use and is not directed at children.

## Contact

For privacy questions, contact:

TechSpec Scanner<br>
support@techspecscanner.com<br>
https://techspec-scanner-beta.onrender.com/support/

## Sources To Review Before Publishing

- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- App Store Connect privacy policy URL guidance: https://developer.apple.com/help/app-store-connect/reference/app-privacy/
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
