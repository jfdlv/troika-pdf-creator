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
state.data.bestiary             // array from Firestore "bestiary" collection
state.data.damageTable          // object from Firestore "util/damageTable"
```

Auth listener lives in `App.js` — `onAuthStateChanged` dispatches `setCurrentUser({ uid, email })`.

## Routes

| Path | Component | Notes |
|---|---|---|
| `/` | `Home/Home` | Landing page |
| `/characterGen/*` | `CharacterGenerator/CharacterGenerator` | Multi-step character creation |
| `/backgrounds` | `BackgroundsList/BackgroundsList` | List + add/edit modals |
| `/bestiary` | `Bestiary/Bestiary` | List + add/edit modals |
| `/initiative` | `Initiative/Initiative` | Initiative tracker |
| `/virtualSheet` | `Characters/VirtualCharacterSheet` | In-session character sheet |
| `/userCharacters` | `Characters/UserCharacters` | Saved characters table |

There are no standalone add/edit routes for backgrounds or beasts — those forms open as MUI Dialogs from within their list pages.

## Components

| Component | Description |
|---|---|
| `Home/Home` | Landing page with navigation cards: Create Character, Backgrounds, Initiative, Bestiary. |
| `Login/Login` | Dialog-based login form with email/password fields and error handling. |
| `Login/LoginMenu` | Topbar profile button showing the logged-in email; opens a menu with links to characters and logout. |
| `Register/Register` | Dialog-based registration form with email, password, and confirmation validation. |
| `BackgroundsList/BackgroundsList` | Searchable list of all backgrounds. Opens a detail dialog per entry. Admin users see an "Add Background" button and an "Edit" button in the detail dialog; both open `Background/Background` as a modal. |
| `Background/Background` | Add/edit form for a background: name, description, possessions, advanced skills, d6 mien table. Rendered inside a `Dialog` — accepts `editId` and `onClose` props. Uses `addBackgroundThunk` or `updateBackgroundThunk` depending on mode. |
| `Bestiary/Bestiary` | Searchable list of all beasts. Opens a detail dialog per entry. Admin users see an "Add Beast" button and an "Edit" button in the detail dialog; both open `Beast/Beast` as a modal. |
| `Beast/Beast` | Add/edit form for a beast entry: name, stats (Skill/Stamina/Initiative/Armour/Damage), d6 mien table, description, special section with optional damage table. Rendered inside a `Dialog` — accepts `editId` and `onClose` props. Uses `react-hook-form`. Uses `addBeastThunk` or `updateBeastThunk` depending on mode. |
| `Characters/UserCharacters` | Table of the current user's saved characters fetched from Firestore. |
| `Characters/VirtualCharacterSheet` | Interactive character sheet for editing skill ranks, weapon damage, and inventory in-session (not yet saved to Firestore). |
| `CharacterGenerator/CharacterGenerator` | Core character creation flow — rolls dice-based stats, lets the user pick a background, and exports a PDF. |
| `CharacterGenerator/EditCharacter` | Sub-form within the generator for editing name, background notes, possessions, and advanced skills. |
| `CharacterGenerator/InventorySorter` | Drag-and-drop reordering of character possessions using `@hello-pangea/dnd`. |
| `Initiative/Initiative` | Combat initiative tracker: setup phase to add characters/enemies, then a token-draw phase with round management and the Delay rule (6.4). |
| `util/Error` | Small utility component for rendering error alerts. |

## Adding a New Component

1. Create `src/components/ComponentName/ComponentName.js`
2. Create `src/components/ComponentName/ComponentName.scss`
3. Use `useSelector` / `useDispatch` for any global state — no prop drilling

## PDF Templates

`generateCharacterSheetPdf(characterInfo, damageTable)` and `generateBackgroundPdf(data)` are plain functions that open the PDF in a new tab via `URL.createObjectURL`. They are not React components.

## Firebase

- **DO NOT modify** `src/config/firebase.js`
- Firestore collections: `backgrounds`, `bestiary`, `util/damageTable`, `userCharacters/{uid}/characters`, `admins`

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    match /backgrounds/{background} {
      allow read;
      allow write: if isAdmin();
    }

    match /bestiary/{beast} {
      allow read;
      allow write: if isAdmin();
    }

    match /util/damageTable {
      allow read;
    }

    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
    }

    match /userCharacters/{userCharacter} {
      allow read, write: if request.auth != null && request.auth.uid == userCharacter;

      match /characters/{character} {
        allow read, write: if request.auth != null && request.auth.uid == userCharacter;
      }
    }
  }
}
```

## Deployment

- Hosted on GitHub Pages at `jfdlv.github.io/troika-pdf-creator`
- `base: '/troika-pdf-creator/'` in `vite.config.js` is required — do not remove it
- CI/CD via `.github/workflows/deploy.yml` — triggers on push to `Refactor_vite_redux_jspdf`
- Firebase config is injected via GitHub Actions secrets (`VITE_FIREBASE_*`)

## Testing

- Write tests for any new feature you add
- If the user manually adds a feature, ask whether they want tests written for it
- No test runner is configured yet — ask the user before setting one up
