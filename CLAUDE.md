# Troika PDF Creator — Claude Instructions

A React 19 + Vite 5 app for generating Troika! tabletop RPG character sheets and backgrounds. Deployed on GitHub Pages.

## Commands

```bash
npm start       # Vite dev server (localhost:5173)
npm run build   # Production build → dist/
npm run preview # Preview production build locally
```

## Tech Stack

- **React 19** — functional components only, no class components
- **Vite 5** — bundler. JSX lives in `.js` files (not `.jsx`); handled by `esbuild.loader='jsx'` in `vite.config.js`
- **Redux Toolkit** — all global state. No Context API
- **React Router v6** — `HashRouter` (required for GitHub Pages). Use `useNavigate`, `Routes`, `Route`. No `Switch`, no `useHistory`
- **@mui/material v5** — only MUI v5. Never import from `@material-ui/core`
- **jsPDF + jspdf-autotable** — PDF generation. Templates are plain functions in `src/pdf-templates/`
- **@hello-pangea/dnd** — drag and drop. No `RootRef` (MUI v4 only)
- **Firebase 9** — Auth + Firestore. Modular API only (`import { getAuth } from 'firebase/auth'`)
- **SCSS** — styling. No CSS-in-JS (no `sx` prop for layout, no `styled()` for new components)

## Code Style

- **Arrow functions** over `function` declarations everywhere
- **Functional components** only
- **SCSS files** over CSS-in-JS. Each new component gets its own SCSS file
- No comments unless the WHY is non-obvious
- No `console.log` left in committed code

## Project Structure

```
src/
  store/              # Redux — characterSlice, authSlice, dataSlice
  components/         # One folder per component, each with its own .scss
  pdf-templates/      # CharacterSheetTemplate.js, BackgroundTemplate.js
  config/firebase.js  # DO NOT MODIFY
```

## Redux Store Shape

```js
state.character.characterInfo   // current character being built/viewed
state.auth.currentUser          // { uid, email } or null (not full Firebase user)
state.data.backgrounds          // array from Firestore "backgrounds" collection
state.data.damageTable          // object from Firestore "util/damageTable"
```

Auth listener lives in `App.js` — `onAuthStateChanged` dispatches `setCurrentUser({ uid, email })`.

## Adding a New Component

1. Create `src/components/ComponentName/ComponentName.js`
2. Create `src/components/ComponentName/ComponentName.scss`
3. Use `useSelector` / `useDispatch` for any global state — no prop drilling

## PDF Templates

`generateCharacterSheetPdf(characterInfo, damageTable)` and `generateBackgroundPdf(data)` are plain functions that open the PDF in a new tab via `URL.createObjectURL`. They are not React components.

## Firebase

- **DO NOT modify** `src/config/firebase.js`
- No Firestore security rules complexity at this stage — keep reads/writes simple
- Firestore collections: `backgrounds`, `util/damageTable`, `userCharacters/{uid}/characters`

## Deployment

- Hosted on GitHub Pages at `jfdlv.github.io/troika-pdf-creator`
- `base: '/troika-pdf-creator/'` in `vite.config.js` is required — do not remove it
- CI/CD via `.github/workflows/deploy.yml` — triggers on push to `Refactor_vite_redux_jspdf`
- Firebase config is injected via GitHub Actions secrets (`VITE_FIREBASE_*`)

## Testing

- Write tests for any new feature you add
- If the user manually adds a feature, ask whether they want tests written for it
- No test runner is configured yet — ask the user before setting one up
