# TaxFlow AI — AI Engineer Candidate Case Study

TaxFlow AI is a hosted-ready, clickable frontend prototype for a greenfield client and CPA tax platform. It intentionally uses mocked data and simulated AI so the work is concentrated on the evaluated areas: visual design, interaction design, information architecture, navigation, permissions, status clarity, and trust in AI.

## What this prototype covers

1. **Source Document Traceability** — Select a return field and trace the displayed number to a source document, exact page/section, highlighted evidence, confidence, and transformation history.
2. **Client & CPA Collaboration** — Conversations are attached to tax fields and issues. Client-visible messages and internal notes have distinct visual treatment and permissions.
3. **Where to Start** — The client role opens to one prominent next action, expected time, urgency, and progress.
4. **Context-Preserving Navigation** — Breadcrumbs, linked-context buttons, deep-link behavior, and persistent return/document/message relationships keep users oriented.
5. **Role-Aware Experiences** — Switch among Tax Preparer, Reviewer, Individual Client, Business Owner, Firm Administrator, and Seasonal Staff from the top-right menu.
6. **Return Status & Progress** — Each status shows what happened, what happens next, who owns the action, and what blocks completion.
7. **Actionable Dashboard** — Work is ranked by deadline pressure, blockage, risk, and whether the current user can act now.
8. **Clickable vs. Editable** — Reusable badges and controls distinguish AI-generated, verified, editable, locked, and approval-required states.
9. **Complexity Made Navigable** — The document library generates 260 records and supports search, filtering, pagination, summary/detail views, and progressive disclosure.
10. **Trustworthy AI** — AI findings show evidence, explanation, uncertainty, confidence, and actions to accept, correct, ask the client, or dismiss.

## What is genuinely wired up

- Role switching and role-aware navigation
- Prioritized dashboard interactions
- Return table search and status filtering
- Return status, issues, activity, and source-trace tabs
- Source-field selection and highlighted source evidence
- AI accept, correct, dismiss, and client-request flows
- Contextual message threads with internal/client visibility
- Sending simulated messages
- Client checklist completion and progress updates
- Search, filtering, and pagination across 260 generated documents
- Responsive desktop/tablet/mobile layout
- Demo guide for a structured walkthrough

## What is simulated

- All clients, tax returns, documents, values, messages, and users
- OCR/document parsing and field extraction
- AI recommendations, confidence scores, and explanations
- Authentication, authorization enforcement, messaging delivery, file storage, tax calculations, e-signature, and filing
- Prioritization scores are deterministic mock values rather than production analytics

## Why this implementation is intentionally simple

The case study explicitly prioritizes a real, testable frontend over production infrastructure. This is a zero-build static web app using HTML, CSS, and JavaScript, so reviewers can run it instantly and the prototype can be deployed without backend configuration.

## Run locally

### Easiest method

1. Open this folder.
2. Double-click `index.html`.
3. The prototype will open in your browser.

### Local server method

```bash
npx serve . -l 4173
```

Then open `http://localhost:4173`.

## Deploy to Vercel

1. Create a free Vercel account.
2. Create a new GitHub repository and upload every file in this folder.
3. In Vercel, select **Add New → Project**.
4. Import the GitHub repository.
5. Keep Framework Preset as **Other**.
6. Leave Build Command empty.
7. Set Output Directory to `.` if Vercel asks for one.
8. Click **Deploy**.
9. Copy the generated public URL into the submission form.

A detailed beginner walkthrough is in `DEPLOYMENT_GUIDE.md`.

## Recommended reviewer path

1. Start on **Work dashboard** and open the top-priority return.
2. Select **Contract labor** in the return-field list.
3. Inspect the highlighted source and transformation history.
4. Use **Correct**, **Ask client**, or **Accept** to demonstrate the AI correction workflow.
5. Open **Collaboration** and compare client-visible messages with internal notes.
6. Switch to **Individual Client** to show the first-run next action.
7. Open **Documents** and search/filter the generated 260-document library.
8. Switch to **Firm Administrator** to explain the role-aware permission model.

## Design principles

- **Action before reporting:** landing pages answer what the user should do next.
- **Context over inboxes:** communication belongs to the object that created it.
- **State with meaning:** every status has an owner and exit criteria.
- **Evidence before confidence:** AI claims are accompanied by source evidence and uncertainty.
- **Progressive disclosure:** occasional users see only immediate decisions; experts can inspect the full evidence chain.
- **One product, multiple contexts:** the shell remains cohesive while navigation and actions adapt by role.

## Important disclaimer

This is a UX prototype only. It does not calculate taxes, provide tax advice, transmit tax returns, or process real personal information.
