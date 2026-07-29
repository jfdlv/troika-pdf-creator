# Implementation Plan: Advanced Skills Content and Character Display

**Branch**: `001-advanced-skills` | **Date**: 2026-07-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-advanced-skills/spec.md`

## Summary

Add a new Advanced Skills experience to the home navigation, introduce an admin-managed content catalogue, and surface related descriptions in the character editing and virtual character sheet views using the same pattern already used for spells.

## Technical Context

**Language/Version**: JavaScript with React 19 and Vite 7

**Primary Dependencies**: React 19, Redux Toolkit, MUI v5, Firebase Firestore, react-hook-form

**Storage**: Firebase Firestore collections for application content plus existing user character state in Redux/Firestore

**Testing**: No dedicated test runner is configured yet; verification will rely on `npm run build` plus targeted manual smoke tests for the new routes and admin flows

**Target Platform**: Web application deployed to GitHub Pages

**Project Type**: Web application

**Performance Goals**: Keep content browsing and character view rendering responsive; avoid extra re-renders and unnecessary data fetches

**Constraints**: Must preserve HashRouter/GitHub Pages behavior, existing Firebase patterns, and current component styling conventions

**Scale/Scope**: One new content collection, one new browsing route, two character-facing display surfaces, and admin add/edit forms

## Constitution Check

*GATE: Must pass before implementation begins. Re-check before merge.*

- Code quality and maintainability: The plan uses existing component, state, and Firestore patterns rather than introducing a new architecture.
- Testing discipline: The implementation will include manual regression verification for the new UI flows and build validation; automated tests can be added later if a test runner is approved.
- User experience consistency: The plan reuses the current MUI/dialog/list patterns and keeps the new content experience consistent with the existing spells experience.
- Performance and responsiveness: The plan limits the change to lightweight list rendering and reuse of existing Redux-derived data.
- Architectural alignment: The plan fits the current React/Redux/Firebase/Vite structure and GitHub Pages deployment model.

## Project Structure

### Documentation (this feature)

```text
specs/001-advanced-skills/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Home/
│   ├── AdvancedSkills/
│   ├── SpecialAbility/
│   ├── CharacterGenerator/
│   ├── Characters/
│   └── Spell/
├── store/
│   └── dataSlice.js
└── App.js
```

**Structure Decision**: Implement the feature as a new content route plus a pair of UI components that mirror the existing spells experience, then extend the character views that already display spell-related information.

## Complexity Tracking

No constitution violations require special justification.
