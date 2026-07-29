# Data Model: Advanced Skills Feature

## Entity: SpecialAbility

**Purpose**: Represents a single advanced skill entry that can be browsed by users and managed by admins.

**Fields**:
- `id`: Firestore document ID
- `name`: required string, human-readable title
- `description`: required string, detailed explanation shown to users

**Validation rules**:
- `name` must be present and trimmed before save
- `description` must be present and trimmed before save
- Empty values should be rejected in the add/edit form

**Relationships**:
- A advanced skill is independent from a specific character and is selected for display based on character context.

## Entity: CharacterContext (derived view model)

**Purpose**: Represents the information needed to show relevant advanced skills in the character-focused views.

**Fields**:
- `background.advancedSkills`: existing map of skill keys and ranks already present on the character
- `advancedSkills`: derived list of matching entries from the content store

**Behavior**:
- This model is computed at render time rather than stored separately.
- It should stay in sync with the current character and selected content collection.
