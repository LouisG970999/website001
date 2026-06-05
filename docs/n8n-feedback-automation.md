# n8n Feedback Automation

This is an optional setup for routing TechSpec Scanner beta feedback into tools such as email, Google Sheets, Notion, Airtable, or a task tracker.

The scanner works without this. Leave the webhook variables empty until an automation workflow is ready.

## Recommended Flow

```text
TechSpec Scanner feedback form
-> TechSpec backend
-> optional n8n webhook
-> email, spreadsheet, task board, or weekly summary
```

Do not connect the app frontend directly to n8n. Keep n8n behind the backend so private workflow URLs and secrets are not exposed to testers.

## Environment Variables

Set these on the hosted backend only when the workflow is ready:

```env
AUTOMATION_FEEDBACK_WEBHOOK_URL=https://your-n8n-domain.example/webhook/techspec-feedback
AUTOMATION_WEBHOOK_SECRET=choose_a_private_random_secret
AUTOMATION_WEBHOOK_TIMEOUT_MS=2500
```

Notes:

- `AUTOMATION_FEEDBACK_WEBHOOK_URL` must use HTTPS in production.
- `AUTOMATION_WEBHOOK_SECRET` is sent as the `X-TechSpec-Automation-Secret` header.
- If the webhook fails, tester feedback still saves locally and the user does not see an error.
- The webhook payload does not include Gemini API keys, beta access codes, or feedback admin codes.

## Payload Shape

```json
{
  "event": "beta_feedback_received",
  "sentAt": "2026-06-05T12:00:00.000Z",
  "appName": "TechSpec Scanner",
  "serverVersion": "20260605-5",
  "appMode": "production",
  "publicBaseUrl": "https://techspec-scanner-beta.onrender.com",
  "feedback": {
    "id": "fb-example",
    "createdAt": "2026-06-05T12:00:00.000Z",
    "installId": "anonymous-install-id",
    "category": "bug",
    "rating": 4,
    "page": "scan",
    "message": "Tester message",
    "contact": "tester@example.com",
    "appVersion": "20260605-5",
    "browserOnline": true,
    "screen": "390x844",
    "userAgent": "browser user agent"
  },
  "request": {
    "origin": "https://techspec-scanner-beta.onrender.com",
    "referer": "https://techspec-scanner-beta.onrender.com/support/feedback.html"
  }
}
```

## Minimal n8n Workflow

1. Create a new workflow in n8n.
2. Add a `Webhook` trigger.
3. Set method to `POST`.
4. Copy the production webhook URL.
5. Add an `IF` node that checks the request header `X-TechSpec-Automation-Secret`.
6. If valid, send the feedback into your chosen destination.
7. Activate the workflow.
8. Add the webhook URL and secret to Render environment variables.
9. Redeploy the service.
10. Submit one test feedback item and confirm it appears in n8n.

## Good First Destinations

- Email to `support@techspecscanner.com`
- Google Sheets row for each feedback entry
- Notion/Airtable feedback database
- A weekly digest workflow

Keep the first workflow simple. The goal is to make tester feedback easier to review, not to build a complicated support system too early.
