# Quickstart: Advanced Skills Feature

## Prerequisites

- Node.js and npm installed
- Firebase environment configured for the app
- An admin account available for content management testing

## Setup

1. Install dependencies with `npm install`
2. Start the app with `npm start`
3. Open the local Vite URL in the browser

## Validation Scenarios

### Browse the new content page

1. Open the home screen.
2. Select the new Advanced Skills card.
3. Confirm that a list of abilities appears with visible descriptions.

### Admin add/edit flow

1. Sign in as an admin.
2. Open the Advanced Skills page.
3. Add a new ability with a name and description.
4. Confirm the new item appears in the list.
5. Edit an existing ability and confirm the updated description is shown.

### Character view integration

1. Create or open a character that has matching background advanced skills.
2. Open the character editing view.
3. Confirm the relevant advanced skill descriptions appear in the same section style used for spells.
4. Open the virtual character sheet and confirm the same content appears there.

## Expected Outcomes

- The new home card routes to a dedicated Advanced Skills page.
- Admin users can add and edit entries successfully.
- Character-focused views show the relevant advanced skill descriptions without breaking the existing layout.
