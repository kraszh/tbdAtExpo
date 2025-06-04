const axios = require('axios');

const API_BASE = 'http://localhost:4567/api/v3'; // Replace with your NodeBB instance
const API_TOKEN = 'your_master_token_here';

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`
};

const mockUsers = [
  { username: 'dod_user_1', email: 'user1@dod.mil', password: 'secure123' },
  { username: 'startup_guy', email: 'founder@startup.com', password: 'buildit' },
  { username: 'academic_hero', email: 'prof@university.edu', password: 'research42' },
  { username: 'opsec_moderator', email: 'mod@forum.com', password: 'modpower' },
  { username: 'industry_pro', email: 'pro@defensecorp.com', password: 'defense789' },
];

async function createUser(user) {
  try {
    const res = await axios.post(`${API_BASE}/users`, user, { headers });
    console.log(`✅ Created user: ${user.username}`);
  } catch (err) {
    if (err.response?.status === 400 && err.response.data?.message?.includes("already exists")) {
      console.log(`⚠️ User already exists: ${user.username}`);
    } else {
      console.error(`❌ Error creating user ${user.username}:`, err.response?.data || err.message);
    }
  }
}

(async () => {
  for (const user of mockUsers) {
    await createUser(user);
  }
})();
