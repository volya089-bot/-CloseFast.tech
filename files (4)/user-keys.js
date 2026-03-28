/**
 * User Key Storage — Vercel KV / Memory fallback
 * Stores user's own API keys encrypted
 */

// In-memory store (replaced by Vercel KV in production)
const memStore = new Map();

// All known key names (across all providers)
const ALL_KEY_NAMES = [
  // Text / LLM
  'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GROQ_API_KEY',
  'GEMINI_API_KEY', 'MISTRAL_API_KEY', 'COHERE_API_KEY',
  'TOGETHER_API_KEY', 'OPENROUTER_API_KEY',
  // Images
  'HF_API_KEY', 'STABILITY_API_KEY', 'IDEOGRAM_API_KEY', 'REPLICATE_API_TOKEN',
  // Video
  'RUNWAY_API_KEY', 'KLING_API_KEY', 'LUMA_API_KEY', 'PIKA_API_KEY',
  // E-commerce
  'ETSY_API_KEY', 'SHOPIFY_API', 'PRINTIFY_API_TOKEN',
  // Social
  'X_BEARER_TOKEN', 'X_API_KEY', 'TIKTOK_CLIENT_KEY',
  // Analytics
  'SERP_API', 'ALCHEMY_WEB3',
  // Payments
  'STRIPE_SECRET_KEY',
];

// Simple XOR obfuscation (not encryption — keys in KV are access-controlled)
function obfuscate(str) {
  const salt = process.env.KEY_SALT || 'cf-omni-2025';
  return Buffer.from(str.split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ salt.charCodeAt(i % salt.length))
  ).join('')).toString('base64');
}
function deobfuscate(b64) {
  try {
    const salt = process.env.KEY_SALT || 'cf-omni-2025';
    const str = Buffer.from(b64, 'base64').toString();
    return str.split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ salt.charCodeAt(i % salt.length))
    ).join('');
  } catch { return ''; }
}

async function getKV() {
  try {
    // Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import('@vercel/kv');
      return kv;
    }
  } catch {}
  // Fallback: in-memory Map
  return {
    hset: async (k, v)  => { memStore.set(k, JSON.stringify(v)); },
    hgetall: async (k)  => { const v = memStore.get(k); return v ? JSON.parse(v) : null; },
    hdel: async (k, f)  => { const v = memStore.get(k); if(v){ const o=JSON.parse(v); delete o[f]; memStore.set(k,JSON.stringify(o)); }},
    del:  async (k)     => { memStore.delete(k); },
    expire: async ()    => {},
  };
}

// Store user's API keys
async function saveKeys(email, keys) {
  const kv   = await getKV();
  const safeEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  const storeKey  = `userkeys:${safeEmail}`;

  // Filter + obfuscate valid keys
  const toStore = {};
  for (const [k, v] of Object.entries(keys)) {
    if (ALL_KEY_NAMES.includes(k) && v && v.length > 5) {
      toStore[k] = obfuscate(v);
    }
  }

  await kv.hset(storeKey, toStore);
  // 30 day TTL
  await kv.expire(storeKey, 60 * 60 * 24 * 30);

  return { saved: Object.keys(toStore).length };
}

// Get user's API keys (deobfuscated)
async function getKeys(email) {
  const kv   = await getKV();
  const safeEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  const raw  = await kv.hgetall(`userkeys:${safeEmail}`);
  if (!raw) return {};

  const result = {};
  for (const [k, v] of Object.entries(raw)) {
    result[k] = deobfuscate(v);
  }
  return result;
}

// Get key status (which keys are saved, which use system)
async function getKeyStatus(email) {
  const userKeys = await getKeys(email);

  return ALL_KEY_NAMES.reduce((acc, k) => {
    const hasUser   = !!(userKeys[k]   && userKeys[k].length > 4);
    const hasSystem = !!(process.env[k] && process.env[k] !== 'REPLACE' && process.env[k].length > 4);
    acc[k] = hasUser ? 'user' : hasSystem ? 'system' : 'none';
    return acc;
  }, {});
}

// Delete user's keys
async function deleteKeys(email, keyNames = null) {
  const kv = await getKV();
  const safeEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  if (keyNames) {
    for (const k of keyNames) await kv.hdel(`userkeys:${safeEmail}`, k);
  } else {
    await kv.del(`userkeys:${safeEmail}`);
  }
}

// Merge user keys with system keys (user takes priority)
async function resolveKeys(email) {
  const userKeys = email ? await getKeys(email) : {};
  const merged   = {};

  for (const k of ALL_KEY_NAMES) {
    const u = userKeys[k];
    const s = process.env[k];
    merged[k] = (u && u.length > 4) ? u : (s && s !== 'REPLACE' ? s : null);
  }

  return { merged, userKeys, hasUserKeys: Object.values(userKeys).some(v => v?.length > 4) };
}

module.exports = { saveKeys, getKeys, getKeyStatus, deleteKeys, resolveKeys, ALL_KEY_NAMES };
