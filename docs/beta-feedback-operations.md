# Beta Feedback Operations

Use this guide while TechSpec Scanner is running as a private beta.

## Owner Links

Hosted beta:

```text
https://techspec-scanner-beta.onrender.com
```

Tester feedback form:

```text
https://techspec-scanner-beta.onrender.com/support/feedback.html
```

Owner-only feedback admin:

```text
https://techspec-scanner-beta.onrender.com/support/admin-feedback.html
```

Do not share the admin page or `FEEDBACK_ADMIN_CODE` with testers.

## Daily Beta Check

1. Open the feedback admin page.
2. Paste `FEEDBACK_ADMIN_CODE`.
3. Check the Beta health panel.
4. Load feedback.
5. Filter for low ratings, wrong identifications, and bug reports.
6. Export CSV before making larger product decisions.
7. Delete only duplicate test entries, spam, or entries a tester asks you to remove.

## Local Release Smoke Test

Before pushing changes that affect the server, support pages, beta access, or feedback flow:

```text
npm run smoke
```

The smoke test starts a temporary local server and checks:

- `/api/health`
- `/api/preflight`
- beta-code protection for feedback
- feedback submission
- owner-only feedback export
- owner-only feedback deletion
- no-index headers on the admin feedback page

The test restores the local feedback file after it runs.

## Feedback Review Pattern

When reviewing feedback, tag each item mentally into one of these buckets:

- `accuracy`: wrong or uncertain component identification
- `usability`: tester could not understand what to do
- `trust`: confidence, uncertainty, or warning language was unclear
- `performance`: slow loading, failed upload, or Render cold start confusion
- `release`: privacy, legal, App Store, or support information issue

For the first beta, prioritize repeated issues over one-off preferences.

## Data Notes

The current beta stores feedback in a file on the server. This is acceptable for early testing, but it is not the final production storage model. Before a larger public launch, move feedback and usage tracking to persistent storage such as Postgres or Supabase.

Private pages use both HTML `noindex` metadata and the `X-Robots-Tag: noindex, nofollow` header, but access control still matters. Only the normal beta access code should be sent to testers.
