# Tasks: Advanced Skills Content and Character Display

**Input**: Design documents from `/specs/001-advanced-skills/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the project structure for the new content feature.

- [x] T001 Create the new `src/components/AdvancedSkills` and `src/components/SpecialAbility` component folders with their corresponding stylesheet files
- [x] T002 Add the new Redux data state and async thunks for advanced skills in `src/store/dataSlice.js`
- [x] T003 [P] Register the new route and navigation label in `src/App.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared content plumbing required before story implementation.

- [x] T004 Wire the new advanced skill content fetch to the app startup flow in `src/App.js`
- [x] T005 Create the shared helper logic for matching advanced skills to character background skills in the character views
- [x] T006 Add the necessary loading and empty-state handling for the new content experience

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Browse advanced skills from the home experience (Priority: P1) 🎯 MVP

**Goal**: Provide a new home entry and dedicated screen for reviewing advanced skills.

**Independent Test**: A user can open the app, select the new Advanced Skills option, and view a list of entries and descriptions.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create the new home card entry in `src/components/Home/Home.js`
- [x] T008 [P] [US1] Implement the `AdvancedSkills` list page in `src/components/AdvancedSkills/AdvancedSkills.js`
- [x] T009 [P] [US1] Implement the `AdvancedSkills.scss` styles for the new page in `src/components/AdvancedSkills/AdvancedSkills.scss`
- [x] T010 [US1] Add the route and navigation label for the new page in `src/App.js`
- [x] T011 [US1] Add empty-state and error handling to the new list page

**Checkpoint**: User Story 1 should be independently functional and testable.

---

## Phase 4: User Story 2 - Manage advanced skills as an administrator (Priority: P2)

**Goal**: Allow admins to add and edit advanced skills through the app.

**Independent Test**: An administrator can create or update a advanced skill and see the change reflected in the list.

### Implementation for User Story 2

- [x] T012 [P] [US2] Create the `SpecialAbility` add/edit form component in `src/components/SpecialAbility/SpecialAbility.js`
- [x] T013 [P] [US2] Implement the form styling in `src/components/SpecialAbility/SpecialAbility.scss`
- [x] T014 [US2] Connect the form to the Redux add/update thunks in `src/store/dataSlice.js`
- [x] T015 [US2] Add admin-only add/edit controls to the `AdvancedSkills` page
- [x] T016 [US2] Ensure the list refreshes after save and handle validation errors clearly

**Checkpoint**: User Story 2 should be independently functional and testable.

---

## Phase 5: User Story 3 - See advanced skills from character views (Priority: P2)

**Goal**: Display relevant advanced skill descriptions in the character editing and virtual character sheet experiences.

**Independent Test**: A user can open the character editing and virtual character sheet views and see matching advanced skill descriptions in the same style as spell descriptions.

### Implementation for User Story 3

- [x] T017 [P] [US3] Add advanced skill matching and rendering to `src/components/CharacterGenerator/EditCharacter.js`
- [x] T018 [P] [US3] Add advanced skill matching and rendering to `src/components/Characters/VirtualCharacterSheet.js`
- [x] T019 [US3] Reuse or add minimal shared styling to keep the presentation consistent with the existing spell display
- [x] T020 [US3] Add fallback behavior for when no matching advanced skills are available

**Checkpoint**: User Stories 1, 2, and 3 should now work together and remain independently usable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize quality, consistency, and verification.

- [x] T021 [P] Review the new components for naming consistency and maintainability
- [x] T022 Review UX consistency with the existing spells experience and ensure dialogs, lists, and empty states are aligned
- [x] T023 Review performance impact for the new list and character-view rendering paths
- [x] T024 Run the production build with `npm run build` and resolve any issues
- [x] T025 Smoke-test the new home route, admin add/edit flow, and both character views

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies - can start immediately
- Foundational (Phase 2): Depends on Setup completion
- User Story 1 (Phase 3): Depends on Foundational completion
- User Story 2 (Phase 4): Depends on Foundational completion and can proceed in parallel with User Story 1 if desired
- User Story 3 (Phase 5): Depends on Foundational completion and the matching logic introduced in Phase 2
- Polish (Phase 6): Depends on completion of all desired stories

### Parallel Opportunities

- T001 and T002 can be implemented in parallel
- T008, T009, and T010 can be implemented in parallel once the foundational state is ready
- T012 and T013 can be implemented in parallel
- T017 and T018 can be implemented in parallel
