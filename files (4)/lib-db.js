/**
 * CloseFast Omni — Database (Upstash Redis / in-memory fallback)
 * Vercel KV compatible
 */

let _redis = null;

function getRedis() {
  if (_redis) return _redis;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require('@upstash/redis');
    _redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
  } else {
    // In-memory fallback for local dev
    const m = new Map();
    _redis = {
      get:    async k     => m.get(k) ?? null,
      set:    async (k,v) => { m.set(k,v); return 'OK'; },
      setex:  async (k,t,v) => { m.set(k,v); return 'OK'; },
      del:    async k     => { m.delete(k); return 1; },
      exists: async k     => m.has(k) ? 1 : 0,
    };
  }
  return _redis;
}

const OWNERS = {
  'volya089@gmail.com':         { plan:'elite', name:'Yaroslav', god:true, confirmed:true },
  'slavikbobnar1981@gmail.com': { plan:'elite', name:'Slavik',   god:true, confirmed:true },
};

async function getUser(email) {
  const e = (email||'').toLowerCase().trim();
  if (OWNERS[e]) return { email:e, ...OWNERS[e], password:'$owner$', createdAt:'2024-01-01' };
  const raw = await getRedis().get(`user:${e}`);
  return raw ? (typeof raw==='string' ? JSON.parse(raw) : raw) : null;
}

async function saveUser(user) {
  const e = user.email.toLowerCase().trim();
  await getRedis().set(`user:${e}`, JSON.stringify(user));
  return user;
}

async function isOwner(email) { return !!(OWNERS[(email||'').toLowerCase().trim()]); }

async function getUserKeys(email) {
  const raw = await getRedis().get(`keys:${(email||'').toLowerCase()}`);
  return raw ? (typeof raw==='string' ? JSON.parse(raw) : raw) : {};
}

async function saveUserKeys(email, keys) {
  const clean = Object.fromEntries(Object.entries(keys).filter(([,v])=>v&&v.length>3));
  await getRedis().setex(`keys:${(email||'').toLowerCase()}`, 86400*30, JSON.stringify(clean));
  return clean;
}

async function getKey(name, email=null) {
  if (email) { const uk = await getUserKeys(email); if (uk[name]) return uk[name]; }
  return process.env[name] || null;
}

async function createSession(email, plan, god) {
  const { SignJWT } = require('jose');
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'closefast-secret-min32chars-here!!');
  return new SignJWT({ email, plan, god }).setProtectedHeader({ alg:'HS256' }).setExpirationTime('30d').sign(secret);
}

async function verifySession(token) {
  try {
    const { jwtVerify } = require('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'closefast-secret-min32chars-here!!');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch { return null; }
}

module.exports = { getUser, saveUser, isOwner, getUserKeys, saveUserKeys, getKey, createSession, verifySession, OWNERS };
