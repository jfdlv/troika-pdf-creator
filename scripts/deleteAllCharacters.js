/**
 * Deletes all user characters from Firestore.
 *
 * This script:
 * 1. Iterates through all users in userCharacters collection
 * 2. Deletes all characters for each user
 * 3. Logs deletion progress
 *
 * WARNING: This is a destructive operation and cannot be undone!
 *
 * Usage:
 *   node scripts/deleteAllCharacters.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

const deleteAllCharacters = async () => {
  const userCharsCol = db.collection('userCharacters');
  const userSnapshot = await userCharsCol.get();

  let totalDeleted = 0;

  for (const userDoc of userSnapshot.docs) {
    const uid = userDoc.id;
    const charactersCol = userDoc.ref.collection('characters');
    const charSnapshot = await charactersCol.get();

    for (const charDoc of charSnapshot.docs) {
      await charDoc.ref.delete();
      totalDeleted++;
    }

    console.log(`✓ ${uid}: Deleted ${charSnapshot.size} characters`);
  }

  console.log(`\n✓ Deletion complete: ${totalDeleted} total characters deleted`);
};

deleteAllCharacters().catch((err) => {
  console.error(err);
  process.exit(1);
});
