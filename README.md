# Troika Toolkit

A web app for the [Troika!](https://troika.uk.com/) tabletop RPG. Lets you create and print character sheets, browse backgrounds and beasts, run a combat initiative tracker, and manage content as an admin.

Deployed at **[jfdlv.github.io/troika-pdf-creator](https://jfdlv.github.io/troika-pdf-creator)**.

## Features

- **Character Generator** — rolls dice-based stats and randomly assigns a background, then lets you edit possessions and skills before exporting a PDF character sheet.
- **Backgrounds** — searchable list of all backgrounds with full stats and a Print PDF option. Admins can add and edit entries via modal form.
- **Bestiary** — searchable list of all beasts with stats, mien table, and special rules. Admins can add and edit entries via modal form.
- **Initiative Tracker** — setup phase for adding characters and enemies, then a token-draw phase with round management and the Delay rule (6.4).
- **Saved Characters** — logged-in users can save characters to their account and view or resume them later.

## Tech Stack

- React 19 + Vite 5
- Redux Toolkit (global state)
- React Router v6 with HashRouter (required for GitHub Pages)
- MUI v5 (dark theme)
- Firebase 9 — Auth + Firestore
- jsPDF + jspdf-autotable — PDF generation
- @hello-pangea/dnd — drag-and-drop inventory sorting
- SCSS modules per component

## Commands

```bash
npm start        # dev server → localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Deployment

Hosted on GitHub Pages. CI/CD via `.github/workflows/deploy.yml` — triggers on push to `Refactor_vite_redux_jspdf`. Firebase config is injected via GitHub Actions secrets (`VITE_FIREBASE_*`).
