/**
 * Removes "6 provisions" from character possessions and adds provisionsCount = 6.
 *
 * This script:
 * 1. Iterates through all users in Firestore
 * 2. For each user, reads all their saved characters
 * 3. Removes "6 provisions" item from possessions (if present)
 * 4. Adds provisionsCount = 6 to characterInfo (if not already set)
 * 5. Updates the character in Firestore
 *
 * Usage:
 *   node scripts/migrateCharacterProvisions.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

const migrate = async () => {
  const userCharsCol = db.collection('userCharacters');
  const userSnapshot = await userCharsCol.get();

  let updated = 0;
  let skipped = 0;

  for (const userDoc of userSnapshot.docs) {
    const uid = userDoc.id;
    const charactersCol = userDoc.ref.collection('characters');
    const charSnapshot = await charactersCol.get();

    for (const charDoc of charSnapshot.docs) {
      const character = charDoc.data();
      const characterInfo = character.characterInfo || {};
      const background = characterInfo.background || {};
      const possessions = background.possessions || [];

      // Find and remove "6 provisions" if it exists
      const provisionsIndex = possessions.findIndex((p) =>
        typeof p === 'string' && p.toLowerCase() === '6 provisions'
      );

      const hasProvisions = provisionsIndex !== -1;
      const alreadyHasCount = characterInfo.provisionsCount !== undefined;

      // Skip if no changes needed
      if (!hasProvisions && alreadyHasCount) {
        console.log(`⊘ ${uid}/${charDoc.id}: Already clean`);
        skipped++;
        continue;
      }

      const updates = {};

      // Remove provisions from possessions if found
      if (hasProvisions) {
        const updatedPossessions = possessions.filter((_, i) => i !== provisionsIndex);
        updates.characterInfo = {
          ...characterInfo,
          background: {
            ...background,
            possessions: updatedPossessions,
          },
        };
      } else {
        updates.characterInfo = characterInfo;
      }

      // Add provisionsCount if not present
      if (!alreadyHasCount) {
        updates.characterInfo.provisionsCount = 6;
      }

      // Update in Firestore
      await charDoc.ref.update(updates);

      console.log(`✓ ${uid}/${charDoc.id}: Cleaned provisions`);
      updated++;
    }
  }

  console.log(`\n✓ Migration complete: ${updated} characters updated, ${skipped} skipped`);
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
