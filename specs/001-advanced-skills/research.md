# Research: Advanced Skills Feature

## Decision: Store advanced skills in a dedicated Firestore collection

**Decision**: Create a new Firestore collection named `advancedSkills` and load it into Redux state alongside the existing content collections.

**Rationale**: This matches the repository’s existing content-management pattern for backgrounds, beasts, and spells and keeps the new feature consistent with the current architecture.

**Alternatives considered**:
- Reusing the existing `spells` collection for advanced skills: rejected because it would blur two distinct content types and make future maintenance harder.
- Storing the data directly inside character records: rejected because it would duplicate content and make admin updates harder.

## Decision: Reuse the existing spells list/detail UX pattern

**Decision**: Build a new `AdvancedSkills` page and a `SpecialAbility` add/edit form that mirror the current `SpellsList` and `Spell` components.

**Rationale**: This keeps the UI predictable, reduces custom styling, and preserves the app’s established interaction model.

**Alternatives considered**:
- Creating a completely bespoke UI: rejected because it would increase implementation and maintenance cost without clear benefit.
- Reusing the spell component directly with modified labels: rejected because it would make the code less explicit and harder to evolve independently.

## Decision: Display matching advanced skills in character views using the existing background skill metadata

**Decision**: Derive which advanced skills to show in the character editing and virtual character sheet views by matching the character’s background advanced skills to advanced skill names using the same normalization approach already used for spells.

**Rationale**: The existing character data already contains the relevant skill names, so this avoids adding new persisted fields to characters and keeps the display logic lightweight.

**Alternatives considered**:
- Adding a new character field for advanced skills: rejected because it would require deeper data migration and would duplicate information already available in the background definition.
- Showing all advanced skills for every character: rejected because it would be noisy and not tied to the character’s meaningful skill choices.
