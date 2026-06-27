/**
 * Adds provisionsCount = 6 to all backgrounds.
 *
 * This script:
 * 1. Reads all backgrounds from Firestore
 * 2. Sets provisionsCount = 6 for each (if not already set)
 * 3. Updates the background in Firestore
 *
 * Usage:
 *   node scripts/migrateProvisionsToSeparateField.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

const migrate = async () => {
  const col = db.collection('backgrounds');
  const snapshot = await col.get();

  let updated = 0;

  for (const bgDoc of snapshot.docs) {
    const background = bgDoc.data();

    // Skip if already has provisionsCount
    if (background.provisionsCount !== undefined) {
      console.log(`⊘ ${background.backgroundName || bgDoc.id}: Already has provisionsCount`);
      continue;
    }

    // Add provisionsCount = 6
    await bgDoc.ref.update({
      provisionsCount: 6,
    });

    console.log(`✓ ${background.backgroundName || bgDoc.id}: Added provisionsCount = 6`);
    updated++;
  }

  console.log(`\n✓ Migration complete: ${updated} backgrounds updated`);
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
