# Website Build Brief for Claude

Please build a professional company/support website for **TechSpec Scanner**.

## Company / Product

**TechSpec Scanner** is an AI-assisted app for identifying mechanical and industrial components from iPhone photos. Users can capture or upload photos of parts, add notes and measurements, receive structured AI-assisted identification results, save known parts locally, evaluate scan accuracy, and export technical reports.

The app is intended for technicians, engineers, students, makers, maintenance teams, and workshop users who need a faster first-pass understanding of mechanical components.

Important: TechSpec Scanner does **not** replace professional engineering verification. The website must clearly state that AI results can be incomplete or wrong and must be verified with physical measurements, markings, manufacturer documentation, and qualified technical judgment before use.

## Main Goal

Create a polished public-facing website that can support:

- Company/product presentation.
- App Store review support URL.
- Public privacy policy URL.
- User support/contact page.
- Clear explanation of AI limitations and data handling.
- Future beta/testing signups.

The website should feel modern, technical, trustworthy, and simple. Avoid a generic SaaS look. It should feel like a precise tool for workshops and engineering contexts.

## Brand

App name:

**TechSpec Scanner**

Tone:

- Clear.
- Technical.
- Trustworthy.
- Modern.
- Not too playful.
- Not overly corporate.

Suggested tagline options:

- “AI-assisted mechanical component identification.”
- “Scan parts. Review evidence. Export technical reports.”
- “A smarter first look at mechanical components.”

Visual direction:

- Clean engineering feel.
- Light/dark mode support if feasible.
- Blue tone background, calm and easy on the eye.
- Use the existing TechSpec logo/icon if available.
- Rounded, modern UI elements.
- Avoid excessive gradients, oversized marketing fluff, or decorative visuals that do not help explain the product.

Logo asset:

Use the existing TechSpec hexagon icon if provided by the project owner. Do not redesign the logo unless asked.

## Suggested Site Structure

Build the website with these pages:

1. **Home**
   - First viewport should clearly show the product name: TechSpec Scanner.
   - Short value proposition.
   - Visual preview/mockup area for the app.
   - Primary CTA: “Coming soon” or “Join beta” depending on implementation.
   - Secondary CTA: “View privacy policy” or “Contact support”.

2. **Product**
   - Explain what the app does.
   - Key workflows:
     - Take or upload component photos.
     - Add measurements and context.
     - Receive AI-assisted component analysis.
     - Review visible evidence, uncertainty, and recommended checks.
     - Save known parts locally.
     - Export PDF/JSON/CSV reports.
   - Mention English/German interface if useful.

3. **Safety / AI Disclaimer**
   - Clearly explain AI limitations.
   - State that results must be verified.
   - State that the app should not be used as the sole basis for safety-critical, purchasing, repair, or engineering design decisions.

4. **Privacy**
   - Public privacy-policy style page.
   - Explain that user-submitted photos and scan context may be sent through the backend to Google Gemini for analysis.
   - Explain that the Gemini API key is stored only on the backend.
   - Explain local-first storage: scan history, known parts, projects, preferences, and test logs are stored locally unless exported/deleted.
   - Mention anonymous install ID and usage counters if production keeps them.
   - Do not claim accounts, cloud sync, subscriptions, analytics, ads, or tracking unless those are actually implemented.

5. **Support**
   - Contact section.
   - Support email placeholder.
   - “When contacting support” checklist:
     - App version.
     - Device model.
     - What happened.
     - Whether issue happened during scanning, analysis, PDF export, install, or settings.
     - Do not send API keys, passwords, or unrelated personal documents.

6. **Release Notes / Status**
   - Optional but useful.
   - Current status: “Coming soon” or “Private beta”.
   - Known scope and limitations.

## Home Page Copy Draft

Headline:

**TechSpec Scanner**

Subheadline:

AI-assisted mechanical component identification for workshops, maintenance, and technical documentation.

Supporting copy:

Take or upload photos of mechanical parts, add measurements and context, and receive structured identification suggestions with visible evidence, uncertainty warnings, recommended checks, and exportable reports.

CTA text:

**Coming soon**

Secondary CTA:

**View privacy policy**

Feature bullets:

- Guided photo capture for overview, markings, side view, and scale reference.
- AI-assisted identification with confidence and uncertainty notes.
- Technician notes, manual corrections, and local known-parts library.
- Export PDF, JSON, CSV, and local backup files.
- Built with backend-protected Gemini processing and local-first records.

Disclaimer block:

TechSpec Scanner provides AI-assisted suggestions, not certified engineering verification. Always confirm results with physical measurements, markings, manufacturer documentation, and qualified technical judgment before using them for safety-critical, purchasing, repair, or design decisions.

## Technical Requirements

Please build the site as a modern, responsive website.

Preferred implementation options:

- Static HTML/CSS/JS, or
- React/Next/Vite if the developer prefers.

Must be:

- Responsive on mobile and desktop.
- Fast loading.
- Accessible basics:
  - Semantic HTML.
  - Good color contrast.
  - Keyboard navigable.
  - Descriptive alt text.
  - Visible focus states.
- SEO basics:
  - Title and meta description.
  - Open Graph tags.
  - Structured headings.
- App Store compatible:
  - Public support URL.
  - Public privacy policy URL.
  - Clear AI disclaimer.

Do not include:

- Real API keys.
- Private `.env` values.
- Fake claims about certification or guaranteed accuracy.
- Claims about cloud accounts, payments, analytics, or subscriptions unless those are explicitly added later.

## Suggested Design Sections for Home

1. Hero:
   - Product name.
   - Value proposition.
   - CTA.
   - App mockup/preview.

2. Workflow:
   - Capture.
   - Analyze.
   - Verify.
   - Export.

3. Feature Grid:
   - Guided scan slots.
   - Evidence-based results.
   - Known parts library.
   - Report export.
   - Local-first storage.
   - Usage/cost controls.

4. Safety and Trust:
   - AI limitation statement.
   - Backend-protected API key.
   - Local-first records.
   - No unrelated personal data should be uploaded.

5. Coming Soon / Beta:
   - Simple signup/contact placeholder.

6. Footer:
   - Privacy.
   - Support.
   - Contact.
   - App status.

## Deliverables

Please provide:

- Full website source code.
- Clear folder structure.
- Instructions to run locally.
- Instructions to deploy.
- Placeholder areas for:
  - Final support email.
  - Final privacy URL.
  - Final production domain.
  - App Store link once available.

## Final Notes

The website should help TechSpec Scanner look credible before App Store submission, but it should stay honest about the current product state. The app is coming soon / beta-stage, and the website must not overpromise exact identification or certified engineering decisions.
