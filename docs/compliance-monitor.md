# TechSpec Publishing Compliance Monitor

The project has an active Codex automation named `TechSpec Publishing Compliance Monitor`.

## Purpose

The monitor reviews the project once per day for publishing readiness, safety, privacy, backend security, AI-result disclaimers, accessibility basics, PWA installability, and documentation/support-site gaps.

## Current Scope

The monitor is instructed to check:

- App Store and PWA readiness gaps.
- Privacy and data-handling risks.
- Gemini API key/backend security risks without reading or exposing `.env` secrets.
- AI result safety, acknowledgement, and manual-verification wording.
- WCAG 2.2 AA accessibility basics.
- OWASP-style web/PWA security practices.
- Support website, privacy-policy, and terms placeholders.
- Publishing Pack, release blocker panel, support bundle, Terms of Use page, and backend preflight behavior.
- `/api/health` and `/api/preflight` when the local server is already running.

## Important Limits

The monitor is a release-readiness assistant, not a legal authority. Legal terms, privacy wording, business identity, App Store account settings, billing setup, and final publication decisions still need human review.

The monitor should not make code changes unless explicitly asked from the current project conversation.
