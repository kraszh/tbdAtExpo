'use strict';

const db = require.main.require('./src/database');
const Categories = require.main.require('./src/categories');
const Groups = require.main.require('./src/groups');
const User = require.main.require('./src/user');
const Privileges = require.main.require('./src/privileges/categories');

async function ensureGroup(name, desc) {
  const exists = await Groups.exists(name);
  if (!exists) {
    await Groups.create(name, desc);
    console.log(`👥 Created group: ${name}`);
  }
}

async function createMockUser(username, password, email, group) {
  const uid = await User.create({ username, email });
  await User.setUserField(uid, 'password', password);
  await Groups.join(group, uid);
  console.log(`👤 Created mock user: ${username} (uid: ${uid}) in group: ${group}`);
}

async function setupCategories() {
  const existing = await db.getSortedSetRange('categories:cid', 0, -1);
  if (existing.length > 0) {
    console.log('✅ Categories already exist. Skipping seed.');
    return;
  }

  await ensureGroup('dod-users', 'Verified DoD Users');
  await ensureGroup('solution-providers', 'Solution Providers');

  const categories = [
    {
      name: 'Challenge Submissions',
      description: 'Mission needs from DoD users.',
      icon: 'fa-shield-alt',
      permissions: {
        'registered-users': ['read'],
        'dod-users': ['read', 'topics:create', 'posts:reply'],
      },
    },
    {
      name: 'Concept Posts',
      description: 'Ideas from academia, startups, and industry.',
      icon: 'fa-lightbulb',
      permissions: {
        'registered-users': ['read', 'topics:create', 'posts:reply'],
      },
    },
    {
      name: 'Solutions',
      description: 'Responses to challenges.',
      icon: 'fa-cogs',
      permissions: {
        'solution-providers': ['read', 'topics:create', 'posts:reply'],
        'registered-users': ['read'],
      },
    },
  ];

  for (const cat of categories) {
    const cid = await Categories.create({
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
    });
    for (const [group, perms] of Object.entries(cat.permissions)) {
      await Privileges.set(cid, group, perms);
    }
    console.log(`📂 Created category: ${cat.name} (cid: ${cid})`);
  }
}

async function seed() {
  try {
    await setupCategories();

    await createMockUser('mockdod', 'dodpass', 'mockdod@example.com', 'dod-users');
    await createMockUser('mocksp', 'sppass', 'mocksp@example.com', 'solution-providers');

    console.log('🎉 Seeding complete');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

seed();
