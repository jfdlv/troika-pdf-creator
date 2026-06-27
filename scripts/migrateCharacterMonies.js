/**
 * Adds monies to all existing characters.
 *
 * This script:
 * 1. Iterates through all users in Firestore
 * 2. For each user, reads all their saved characters
 * 3. Adds monies: [{"Silver Pence": 6}] to characterInfo (if not already present)
 * 4. Updates the character in Firestore
 *
 * Usage:
 *   node scripts/migrateCharacterMonies.js
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

      // Skip if already has monies
      if (characterInfo.monies !== undefined) {
        console.log(`⊘ ${uid}/${charDoc.id}: Already has monies`);
        skipped++;
        continue;
      }

      // Update in Firestore
      await charDoc.ref.update({
        characterInfo: {
          ...characterInfo,
          monies: [{ "Silver Pence": 6 }],
        },
      });

      console.log(`✓ ${uid}/${charDoc.id}: Added monies`);
      updated++;
    }
  }

  console.log(`\n✓ Migration complete: ${updated} characters updated, ${skipped} skipped`);
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
