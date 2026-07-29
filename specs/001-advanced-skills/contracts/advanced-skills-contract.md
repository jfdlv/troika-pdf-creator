# Internal Contract: Advanced Skills Content

## Firestore collection

**Collection name**: `advancedSkills`

**Document shape**:

```json
{
  "id": "string",
  "name": "string",
  "description": "string"
}
```

## Redux integration

The data slice should expose the following async actions:
- `getAdvancedSkillsThunk`
- `addSpecialAbilityThunk`
- `updateSpecialAbilityThunk`

These actions should mirror the existing spell content flow and update the `state.data.advancedSkills` array after successful persistence.

## UI contract

- Home route: `/advancedSkills`
- Navigation label: `Advanced Skills`
- Admin-only add/edit actions should be available on the content page.
- Character views should render matching descriptions based on the current character’s background skill metadata.
