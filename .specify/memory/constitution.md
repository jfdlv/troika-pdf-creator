# Troika PDF Creator Constitution

<!--
Sync Impact Report
- Version change: 0.1.0 → 1.0.0
- Modified principles: None → Code Quality and Maintainability, Testing Discipline, User Experience Consistency, Performance and Responsiveness, Architectural Alignment
- Added sections: Additional Constraints, Development Workflow
- Removed sections: None
- Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->

## Core Principles

### I. Code Quality and Maintainability
Production code MUST be clear, small, and aligned with the repository’s existing React 19, Redux Toolkit, Vite 7, and Firebase patterns. Components, reducers, utilities, and templates MUST have a single purpose, use descriptive names, and avoid duplicated logic. Non-obvious behavior MUST be documented in code or adjacent design notes when the reasoning is not obvious.

### II. Testing Discipline
Every change that affects user-visible behavior, state transitions, PDF output, or data persistence MUST be covered by automated tests when practical. For bug fixes and feature work, the implementation MUST include a regression test or a documented manual verification path before merge. Tests MUST exercise the real behavior being changed and MUST fail before the fix is considered complete.

### III. User Experience Consistency
User-facing changes MUST preserve the application’s established interaction patterns, visual language, and accessibility expectations. New UI MUST follow existing MUI v5 and SCSS conventions, use clear labels and error states, and keep navigation, dialogs, forms, and loading feedback consistent across the app.

### IV. Performance and Responsiveness
Features MUST remain responsive for expected character creation, browsing, and PDF generation workflows. Rendering and data-fetching paths MUST avoid unnecessary recomputation, expensive work in render, and redundant state updates. Operations that take noticeable time MUST expose loading or progress feedback and MUST avoid blocking the main interaction flow.

### V. Architectural Alignment
Changes MUST respect the project’s stack and deployment constraints, including HashRouter for GitHub Pages, Vite base path configuration, and the existing Firebase-backed data model. New dependencies or architectural patterns MUST be introduced only when they clearly improve maintainability or user value and MUST not contradict the established project conventions.

## Additional Constraints
- The app MUST remain a React 19 + Vite 7 application with functional components only.
- Global state MUST remain in Redux Toolkit; no new Context API usage is introduced for shared state.
- New UI MUST use SCSS files rather than CSS-in-JS.
- Firebase configuration in src/config/firebase.js MUST remain unchanged unless the change is explicitly approved as a platform-level infrastructure update.
- PDF generation and data-heavy flows MUST preserve the current GitHub Pages deployment expectations and avoid introducing server-side requirements.

## Development Workflow
- Every implementation plan MUST include a clear validation step for code quality, tests, UX consistency, and performance impact.
- Pull requests MUST include evidence of local verification, including relevant tests or manual checks for affected flows.
- Changes that alter user experience or data behavior MUST be reviewed for accessibility, clarity, and regression risk before merge.
- When a change introduces a new dependency or a significant pattern shift, the implementation plan MUST document the trade-off and the maintenance expectation.

## Governance
This constitution supersedes informal project practices for planning, implementation, and review. Any amendment MUST update this document, explain the rationale, and preserve the project’s existing technical constraints.
Amendments MUST be reviewed for impact on quality, testing, UX, and performance expectations before approval. The version number MUST follow semantic versioning: MAJOR for incompatible governance changes, MINOR for new principles or materially expanded guidance, and PATCH for clarifications or non-semantic refinements.
Compliance review MUST confirm that planned or delivered work satisfies the principles above before a feature is considered complete. The project lead or designated reviewer MUST verify that the implementation, tests, and user-facing behavior all align with this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-07-29 | **Last Amended**: 2026-07-29
