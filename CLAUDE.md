# Larcher & Fahrion — Project Guide for Claude

## Project Overview

This is the website for **Larcher & Fahrion**, a vacation rental business in Oberammergau, Bavaria, Germany. The owners are Verena Larcher and Matthias Fahrion. The site showcases two apartments (**Appartement Louis** and **Bergliebe**) and lets guests send inquiries via a contact form.

The person working on this project is a beginner. Always:
- Explain what you changed and why, in plain language
- Avoid technical jargon unless you explain it
- Keep solutions simple — do not over-engineer
- Make the smallest change that solves the problem

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript (no framework) |
| Hosting | Vercel (deployed automatically from GitHub) |
| Email | Resend API via direct `fetch` (no SDK) |
| Fonts | Self-hosted Cormorant Garamond (in `/fonts`) |
| Local dev | Vercel CLI (`vercel dev`) |

There is **no build step** — what you see in the files is exactly what runs in production.

---

## File Structure

```
index.html          — The entire website (single HTML file, SPA)
css/style.css       — All styles
js/main.js          — All JavaScript (page navigation, forms, gallery, etc.)
api/contact.js      — Serverless function: handles contact form, sends email via Resend
images/             — All photos and the logo (logo.svg, logo.png)
fonts/              — Self-hosted Cormorant Garamond (.woff2 files)
package.json        — Node.js version (24.x), no npm dependencies needed
.env.local          — Local environment variables (NEVER commit this file)
```

### How the SPA works

The site is a **single-page app** — all pages live inside `index.html` as `<div class="page">` elements. Only one page is visible at a time. The `showPage('name')` function in `main.js` switches between them by toggling a CSS class.

---

## Local Development Workflow

**Always start the local server before making changes.**

```bash
vercel dev
```

This starts the site at **http://localhost:3000** — including the contact form API.

### Workflow for every change

1. Make sure `vercel dev` is running
2. Make the code change
3. Check it at http://localhost:3000
4. **Wait for the user to review and approve**
5. Only after approval: commit and push to GitHub

**Never push to GitHub automatically.** The user always reviews changes on localhost first.

---

## Coding Standards

### General
- Keep all JavaScript in `js/main.js`
- Keep all styles in `css/style.css`
- Keep all page content in `index.html`
- Do not create new files unless absolutely necessary
- Follow the existing code style — if the existing code uses `var`, keep using `var`

### JavaScript
- Use ES5-compatible style (`var`, `function` declarations, `.then()/.catch()`)
- Do not use arrow functions, `const`/`let`, or modern syntax in `main.js` (for browser compatibility)
- The serverless function `api/contact.js` can use modern Node.js syntax

### CSS
- Follow existing class naming patterns (e.g. `nav-logo`, `footer-brand`, `detail-section`)
- Mobile styles go inside the existing `@media(max-width:760px)` and `@media(max-width:480px)` blocks
- Use CSS variables already defined in `:root` (e.g. `var(--brand)`, `var(--brand-dark)`)

### HTML
- The site is in German — keep all user-facing text in German
- Always use `&amp;` for `&` in HTML attributes and content

---

## Security Rules

These rules must always be followed. Never skip them.

### Environment variables
- The `RESEND_API_KEY` must **never** appear in any committed file
- It lives in `.env.local` locally and in Vercel's environment variable settings in production
- `.env.local` is in `.gitignore` — never remove it from there

### User input
- All user input displayed in HTML must be escaped using the `escHtml()` function in `api/contact.js`
- Never use `innerHTML` with unescaped user content
- Never use `eval()`
- Validate all form inputs both client-side (in `main.js`) and server-side (in `api/contact.js`)

### API security
- The contact form API (`api/contact.js`) validates request method, required fields, and email format before sending anything
- Never expose internal error details to the user — log them with `console.error` but return a generic message

### Dependencies
- Keep dependencies minimal — the project currently has zero npm dependencies at runtime
- Before adding any new npm package, consider whether the same thing can be done with built-in browser or Node.js features

---

## Key Features & How They Work

### Contact form
- Two tabs: **Gäste** (guests) and **Eigentümer** (property owners)
- Submitting calls `POST /api/contact` (the Vercel serverless function)
- The function sends an email to `verena.larcher@gmail.com` via the Resend API
- A confirmation email is also sent to the person who submitted the form
- The Resend API is called using native `fetch` — no SDK installed

### Page navigation
- `showPage('home')`, `showPage('rentals')`, `showPage('detail-louis')`, etc.
- Pages: `home`, `rentals`, `detail-louis`, `detail-bergliebe`, `impressum`, `datenschutz`

### Photo lightbox
- Two lightbox systems exist:
  - `#gallery-lightbox` — scrollable grid of all photos for an apartment
  - `#lightbox` — single image fullscreen view with arrow navigation

---

## Legal Pages

The site has German legal pages required by law:
- **Impressum** — required by § 5 TMG (German law)
- **Datenschutzerklärung** — required by DSGVO (GDPR)

When updating these pages, be careful to maintain legal accuracy. Do not remove or simplify legal text without confirming it is safe to do so.

---

## Deployment

Pushing to the `main` branch on GitHub automatically triggers a Vercel deployment.

- **Do not push** until the user has reviewed and approved changes on localhost
- After pushing, Vercel typically deploys within 1–2 minutes
- The live site URL is: `project-if6oq.vercel.app` (custom domain to be added later)

---

## Coding Behavior Guidelines (Karpathy)

These four principles apply to every task, no matter how small.

### 1. Think Before Coding
- State assumptions explicitly — if something is unclear, ask rather than guess
- If multiple interpretations exist, present them instead of picking silently
- If a simpler approach exists, say so and push back
- Stop when confused — name what's unclear and ask

### 2. Simplicity First
- Write the minimum code that solves the problem — nothing speculative
- No features beyond what was asked
- No abstractions for single-use code
- No error handling for scenarios that can't happen
- If 200 lines could be 50, rewrite it

### 3. Surgical Changes
- Touch only what the request requires
- Don't "improve" adjacent code, comments, or formatting
- Don't refactor things that aren't broken
- Match existing style, even when you'd do it differently
- If you notice unrelated dead code, mention it — don't delete it
- Remove imports/variables/functions only if YOUR changes made them unused

### 4. Goal-Driven Execution
- Before starting a multi-step task, state a brief plan with verifiable steps
- Define what success looks like before implementing
- Loop until the success criteria are met
