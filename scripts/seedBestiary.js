/**
 * Seeds the Firestore "bestiary" collection with sample Troika! beasts.
 *
 * Usage:
 *   1. Download your Firebase service account key from the Firebase console
 *      (Project Settings → Service accounts → Generate new private key)
 *   2. Place it at scripts/serviceAccountKey.json  (already in .gitignore below)
 *   3. npm install firebase-admin   (if not already installed)
 *   4. node scripts/seedBestiary.js
 *
 * The script is idempotent: it uses the beast name as a stable document ID,
 * so re-running it will overwrite existing entries rather than duplicate them.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

// const beasts = [
//   {
//     name: 'Dragon',
//     skill: 16,
//     stamina: 32,
//     initiative: 8,
//     armour: 4,
//     damage: 'As Gigantic Beast',
//     mien: ['Sleeping', '"Playful"', 'Hungry', 'Quizzical', 'Aggressive', 'Paranoid'],
//     description: 'Dragons are creatures of hyper-light, unburdened by base matter, able to soar across the dark sea of sky between worlds. Since their spirits are immortal and illuminated by the black-suns they may, and often do, indulge in base activities such as wanton slaughter, accumulating needless wealth, and plumbing the depths of forbidden knowledge. They do this because they know that nothing of these wicked spheres can harm them or their objective spiritual and physical perfection.',
//     special: {
//       description: 'Once per Round they may douse a 24 foot area in beautiful Dragon-Fire. Everyone in the area is automatically hit but may Test their Luck to reduce the Damage Roll by 1.',
//       damageTable: [
//         { label: 'Dragon-Fire', values: [6, 8, 12, 16, 18, 24, 36] },
//       ],
//       notes: 'Dragons are immune to high temperatures, including Dragon-Fire.',
//     },
//   },
// ];

// Troika! Numinous Edition -- Bestiary stat blocks
//
// Stats, names, and Mien tables are mechanical/tabular game data.
// `description` is left blank for every entry -- that's the book's
// narrative flavor text, which is not reproduced here.
// `special`, where a creature has a Special rule, holds a short
// ORIGINAL paraphrase of the mechanical effect (not the book's
// wording); it's '' for creatures with no Special rule.
// Numeric damage tables (Dragon only) are plain data, reproduced exactly.

const beasts = [
  {
    name: 'Bonshad',
    skill: 12,
    stamina: 20,
    initiative: 3,
    armour: 2,
    damage: 'gigantic beast',
    mien: ['Wrathful', 'Virulent', 'Spiteful', 'Nauseated', 'Acquisitive', 'Imperious'],
    description: '',
    special: '',
  },
  {
    name: 'Cyclops',
    skill: 9,
    stamina: 14,
    initiative: 3,
    armour: 2,
    damage: 'large beast',
    mien: ['Tearful', 'Depressed', 'Melancholic', 'Sombre', 'Resigned', 'Mercurial'],
    description: '',
    special: 'When a Cyclops gains the Initiative, it gets to see the next three Initiative draws in advance.',
  },
  {
    name: 'Dolm',
    skill: 7,
    stamina: 21,
    initiative: 2,
    armour: 1,
    damage: 'large beast',
    mien: ['Unperturbed', 'Detached', 'Tranquil', 'Tired', 'Curious', 'Perturbed'],
    description: '',
    special: 'A Dolm can squeeze its whole body through any gap large enough for its eyes, which never grow past ordinary human size.',
  },
  {
    name: 'Donestre',
    skill: 9,
    stamina: 14,
    initiative: 3,
    armour: 0,
    damage: 'modest beast',
    mien: ['Gregarious', 'Urbane', 'Exhilarated', 'Impassioned', 'Shameful', 'Grieving'],
    description: '',
    special: '',
  },
  {
    name: 'Drock',
    skill: 6,
    stamina: 13,
    initiative: 2,
    armour: 0,
    damage: 'small beast',
    mien: ['Happy', 'Contemplative', 'Hungry', 'Tired', 'Unhappy', 'Confused'],
    description: '',
    special: '',
  },
  {
    name: 'Ekodat',
    skill: 8,
    stamina: 43,
    initiative: 3,
    armour: 2,
    damage: 'spear',
    mien: ['Dormant', 'Stationary', 'Unstable', 'Probing', 'Tentative', 'Cautious'],
    description: '',
    special: 'Wounding an Ekodat causes new crystal spurs to grow instantly and strike again right away.',
  },
  {
    name: 'Feathered Folk',
    skill: 7,
    stamina: 6,
    initiative: 2,
    armour: 0,
    damage: 'bow',
    mien: ['Pious', 'Sincere', 'Beatific', 'Rapt', 'Abstracted', 'Doubting'],
    description: '',
    special: '',
  },
  {
    name: 'Goblin',
    skill: 5,
    stamina: 6,
    initiative: 1,
    armour: 1,
    damage: 'weapon',
    mien: ['Curious', 'Dismissive', 'Preoccupied', 'Gossipy', 'Overly Friendly', 'Paranoid'],
    description: '',
    special: '',
  },
  {
    name: 'Gremlin',
    skill: 3,
    stamina: 4,
    initiative: 3,
    armour: 0,
    damage: 'small beast',
    mien: ['Inveigling', 'Fearful', 'Fearful', 'Aggressive', 'Aggressive', 'Fake Inveigling (Aggressive)'],
    description: '',
    special: '',
  },
  {
    name: 'Harpy',
    skill: 8,
    stamina: 12,
    initiative: 3,
    armour: 0,
    damage: 'modest beast',
    mien: ['Spiteful', 'Malicious', 'Cruel', 'Hateful', 'Vicious', 'Barbaric'],
    description: '',
    special: 'Every Harpy knows the Read Entrails spell, plus any other Spells the GM chooses to give it.',
  },
  {
    name: 'Khaibit',
    skill: 9,
    stamina: 10,
    initiative: 3,
    armour: 1,
    damage: 'weapon',
    mien: ['Austere', 'Bemused', 'Ecstatic', 'Bored', 'Impassive', 'Arresting'],
    description: '',
    special: '',
  },
  {
    name: 'Knight of the Road',
    skill: 7,
    stamina: 7,
    initiative: 2,
    armour: 1,
    damage: 'weapon',
    mien: ['Curious', 'Wary', 'Drunk', 'Rowdy', 'Predatory', 'Friendly'],
    description: '',
    special: '',
  },
  {
    name: 'Living Dead',
    skill: 6,
    stamina: 12,
    initiative: 1,
    armour: 0,
    damage: 'weapon or modest beast',
    mien: ['Oblivious', 'Pondering', 'Distracted', 'Hungry', 'Aggressive', 'Distressed'],
    description: '',
    special: 'Takes double Damage from silver weapons.',
  },
  {
    name: 'Lizard-Man',
    skill: 8,
    stamina: 8,
    initiative: 2,
    armour: 2,
    damage: 'weapon or modest beast',
    mien: ['Severe', 'Hostile', 'Suspicious', 'Intolerant', 'Threatening', 'Inquisitive'],
    description: '',
    special: '',
  },
  {
    name: 'Loathsome Wurm That Will Consume The Sun',
    skill: 12,
    stamina: 46,
    initiative: 7,
    armour: 3,
    damage: 'gigantic beast',
    mien: ['Tormented', 'Writhing', 'Envious', 'Phlegmatic', 'Rancorous', 'Malevolent'],
    description: '',
    special: 'If killed, its neck stump becomes an entrance to the Primary Underworld; the Wurm itself regenerates after 5,125 years.',
  },
  {
    name: 'Man-Beast',
    skill: 8,
    stamina: 11,
    initiative: 2,
    armour: 1,
    damage: 'fusil or modest beast',
    mien: ['Heedful', 'Observing', 'Watchful', 'Questioning', 'Challenging', 'Aggressive'],
    description: '',
    special: '',
  },
  {
    name: 'Manticore',
    skill: 12,
    stamina: 18,
    initiative: 5,
    armour: 3,
    damage: 'large beast',
    mien: ['Lazy', 'Bored', 'Hungry', 'Busy', 'Aggressive', 'Bored and Aggressive'],
    description: '',
    special: 'A second hit landed on the same target in one Round comes from its tail; the target must Test their Luck (or Skill, for enemies) or be paralysed for 2d6 minutes.',
  },
  {
    name: 'Notule',
    skill: 9,
    stamina: 3,
    initiative: 3,
    armour: 3,
    damage: 'large beast',
    mien: ['Dormant', 'Probing', 'Flighty', 'Recoiling', 'Aggressive', 'Intent'],
    description: '',
    special: 'A successful hit forces the target to Test their Luck (or Skill, for enemies) or begin Drowning as the Notule smothers their face.',
  },
  {
    name: 'Ogre',
    skill: 9,
    stamina: 18,
    initiative: 3,
    armour: 1,
    damage: 'weapon or large beast',
    mien: ['Smug', 'Generous', 'Covetous', 'Gregarious', 'Duplicitous', 'Offensive'],
    description: '',
    special: '',
  },
  {
    name: 'Orc',
    skill: 7,
    stamina: 8,
    initiative: 2,
    armour: 0,
    damage: 'club',
    mien: ['Industrious', 'Confused', 'Homesick', 'Angry', 'Frustrated', 'Violent'],
    description: '',
    special: '',
  },
  {
    name: 'Owl',
    skill: 4,
    stamina: 4,
    initiative: 1,
    armour: 0,
    damage: 'small beast',
    mien: ['Curious', 'Watchful', 'Aggressive', 'Hungry', 'Guarded', 'Defensive'],
    description: '',
    special: '',
  },
  {
    name: 'Parchment Witch',
    skill: 8,
    stamina: 14,
    initiative: 2,
    armour: 1,
    damage: 'weapon',
    mien: ['Admiring', 'Infatuated', 'Obsessed', 'Paranoid', 'Skulking', 'Violent'],
    description: '',
    special: 'Knows 5 Spells, randomly rolled or pre-chosen; takes double Damage from silver; given time and materials it can fully change its appearance, including wearing another person\'s skin to impersonate them for about a week before it decays.',
  },
  {
    name: 'Piscean',
    skill: 3,
    stamina: 6,
    initiative: 2,
    armour: 0,
    damage: 'modest beast',
    mien: ['Mewling', 'Childish', 'Playful', 'Mischievous', 'Hungry', 'Starving'],
    description: '',
    special: 'Incapacitating a target draws every nearby Piscean in to devour their Provisions, one ration per creature per Turn.',
  },
  {
    name: 'Night Pig',
    skill: 7,
    stamina: 14,
    initiative: 2,
    armour: 0,
    damage: 'modest beast',
    mien: ['Sinister', 'Suspicious', 'Unreal', 'Inquisitive', 'Shameful', 'Cowardly'],
    description: '',
    special: '',
  },
  {
    name: 'Salamander',
    skill: 8,
    stamina: 16,
    initiative: 3,
    armour: 3,
    damage: 'large beast',
    mien: ['Convulsing', 'Expanding', 'Retracting', 'Surging', 'Revolving', 'Blooming'],
    description: '',
    special: '',
  },
  {
    name: 'Separator',
    skill: 9,
    stamina: 12,
    initiative: 2,
    armour: 0,
    damage: 'medium beast',
    mien: ['Uncanny', 'Hagridden', 'Withdrawn', 'Unassuming', 'Ravenous', 'Cruel'],
    description: '',
    special: 'Sleeping victims lose 1d6 Stamina permanently each day unless magically healed. By day it looks entirely human; by night its flying form is invisible except to Second Sight or magic, and destroying its dormant body while it\'s out flying traps it in that form for good.',
  },
  {
    name: 'Sympathy Serpent',
    skill: 5,
    stamina: 6,
    initiative: 2,
    armour: 0,
    damage: 'small beast',
    mien: ['Shy', 'Friendly', 'Sympathetic', 'Fearful', 'Sad', 'Inconsolable'],
    description: '',
    special: 'A sleeping or unaware target must Test their Luck (or Skill, for enemies) or be paralysed by despair and consumed without a fight.',
  },
  {
    name: 'Thinking Engine',
    skill: 8,
    stamina: 14,
    initiative: 2,
    armour: 1,
    damage: 'weapon',
    mien: ['Absent Minded', 'Distracted', 'Enthusiastic', 'Maudlin', 'Sentimental', 'Engrossed'],
    description: '',
    special: '',
  },
  {
    name: 'Tiger',
    skill: 8,
    stamina: 12,
    initiative: 2,
    armour: 0,
    damage: 'large beast',
    mien: ['Playful', 'Stalking', 'Hungry', 'Tired', 'Austere', 'Aggressive'],
    description: '',
    special: '',
  },
  {
    name: 'Tower Wizard',
    skill: 10,
    stamina: 12,
    initiative: 3,
    armour: 0,
    damage: 'weapon',
    mien: ['Offensive', 'Confused', 'Friendly', 'Suspicious', 'Inappropriate', 'Transgressive'],
    description: '',
    special: 'Knows Jolt or Ember plus 4 other Spells, randomly rolled or pre-chosen.',
  },
  {
    name: 'Troll',
    skill: 7,
    stamina: 12,
    initiative: 1,
    armour: 2,
    damage: 'weapon',
    mien: ['Rude', 'Standoffish', 'Spiteful', 'Disrespectful', 'Sarcastic', 'Sullen'],
    description: '',
    special: 'Regenerates 1 Stamina every time it holds the Initiative; only decapitation or fire stop this regeneration.',
  },
  {
    name: 'Ven',
    skill: 8,
    stamina: 8,
    initiative: 2,
    armour: 2,
    damage: 'super weapon',
    mien: ['Frustrated', 'Scared', 'Curious', 'Fascinated', 'Quixotic', 'Depressed'],
    description: '',
    special: '',
  },
  {
    name: 'Zoanthrop',
    skill: 7,
    stamina: 12,
    initiative: 2,
    armour: 0,
    damage: 'modest beast',
    mien: ['Playful', 'Stalking', 'Hungry', 'Tired', 'Plagued by Thought', 'Aggressive'],
    description: '',
    special: '',
  },
];

const toDocId = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const seed = async () => {
  const col = db.collection('bestiary');
  const batch = db.batch();

  for (const beast of beasts) {
    const ref = col.doc(toDocId(beast.name));
    batch.set(ref, beast, { merge: true });
  }

  await batch.commit();
  console.log(`Seeded ${beasts.length} beasts into the "bestiary" collection.`);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
