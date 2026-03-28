/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   HOTTABYCH INTELLIGENCE ENGINE v3.0                        ║
 * ║   CloseFast Omni · Real-time Business Terminal              ║
 * ║   Express + WebSocket + Redis + PM2                         ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

require('dotenv').config();
const express     = require('express');
const http        = require('http');
const WebSocket   = require('ws');
const Redis       = require('ioredis');
const cors        = require('cors');
const helmet      = require('helmet');
const compression = require('compression');
const morgan      = require('morgan');
const cron        = require('node-cron');
const { v4: uuid} = require('uuid');

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 4000;

// ── DEV / OWNER BYPASS ────────────────────────────────────────────────────────
const DEV_EMAILS = (process.env.DEV_EMAILS || 'volya089@gmail.com,slavikbobnar1981@gmail.com')
    .split(',').map(e => e.trim().toLowerCase());

function isDev(email) {
    return DEV_EMAILS.includes((email || '').trim().toLowerCase());
}

// ── REDIS ─────────────────────────────────────────────────────────────────────
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy: t => Math.min(t * 100, 3000),
});
redis.on('connect', () => console.log('[Redis] ✅ Connected'));
redis.on('error',   e  => console.warn('[Redis] ⚠', e.message));

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({ origin: ['https://closefast.tech', 'http://localhost:3000', 'http://localhost:4000'] }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// ── WEBSOCKET ─────────────────────────────────────────────────────────────────
const wss = new WebSocket.Server({ server, path: '/ws' });
const clients = new Map();

wss.on('connection', (ws, req) => {
    const clientId = uuid();
    clients.set(clientId, { ws, subs: new Set(['*']), userId: null });

    ws.send(JSON.stringify({
        type: 'CONNECTED', clientId,
        message: '⚡ Hottabych Engine online — Джин у мережі',
        ts: Date.now(),
    }));

    ws.on('message', raw => {
        try {
            const m = JSON.parse(raw.toString());
            if (m.type === 'SUBSCRIBE') {
                const c = clients.get(clientId);
                if (c) m.channels.forEach(ch => c.subs.add(ch));
            }
            if (m.type === 'PING') ws.send(JSON.stringify({ type: 'PONG', ts: Date.now() }));
        } catch {}
    });

    ws.on('close', () => clients.delete(clientId));
});

function broadcast(channel, data) {
    const payload = JSON.stringify({ channel, data, ts: Date.now() });
    clients.forEach(({ ws, subs }) => {
        if ((subs.has(channel) || subs.has('*')) && ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
        }
    });
}

// ── MODULES ───────────────────────────────────────────────────────────────────
const pipeline    = require('./workers/pipeline');
const jinScoring  = require('./lib/jin-scoring');
const alertEngine = require('./lib/alert-engine');
const jinAdvisor  = require('./lib/jin-advisor');
const lampaBot    = require('./bot/lampa');

pipeline.setBroadcast(broadcast);
pipeline.setRedis(redis);

// ── HYBRID API KEY RESOLVER ───────────────────────────────────────────────────
// Priority: user's own keys → system free keys
async function resolveKey(userEmail, keyName) {
    if (!redis || !userEmail) return process.env[keyName] || null;
    try {
        const userKey = await redis.get(`userkeys:${userEmail.toLowerCase()}:${keyName}`);
        if (userKey) return userKey;
    } catch {}
    return process.env[keyName] || null;
}

// ── CACHE MIDDLEWARE ──────────────────────────────────────────────────────────
const cache = (ttl = 60) => async (req, res, next) => {
    try {
        const key = `route:${req.originalUrl}`;
        const hit = await redis.get(key).catch(() => null);
        if (hit) { res.setHeader('X-Cache', 'HIT'); return res.json(JSON.parse(hit)); }
        res.cacheJSON = async (data) => {
            await redis.setex(key, ttl, JSON.stringify(data)).catch(() => {});
            res.setHeader('X-Cache', 'MISS');
            res.json(data);
        };
        next();
    } catch { next(); }
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /health
app.get('/health', (req, res) => res.json({
    status: 'operational', engine: 'Hottabych', version: '3.0',
    clients: clients.size, uptime: Math.round(process.uptime()), ts: Date.now(),
}));

// GET /dashboard
app.get('/dashboard', cache(30), async (req, res) => {
    const keys = ['data:ecommerce','data:social','data:web3','data:competitors','data:alerts','data:jin-score'];
    const vals = await Promise.allSettled(keys.map(k => redis.get(k)));
    const parse = r => r.status === 'fulfilled' && r.value ? JSON.parse(r.value) : null;
    const data = {
        ecommerce: parse(vals[0]), social: parse(vals[1]),
        web3: parse(vals[2]),      competitors: parse(vals[3]),
        alerts: parse(vals[4]),    jinScore: parse(vals[5]),
        generated: new Date().toISOString(),
    };
    if (res.cacheJSON) await res.cacheJSON(data);
    else res.json(data);
});

// GET /jin-score  (replaces /omni-score)
app.get('/jin-score', cache(120), async (req, res) => {
    try {
        const score = await jinScoring.compute(redis);
        if (res.cacheJSON) await res.cacheJSON(score);
        else res.json(score);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /hottabych/ask  (Voice + Text AI endpoint)
app.post('/hottabych/ask', async (req, res) => {
    try {
        const { question, voice, email, userKeys } = req.body;
        const isFree = !email || (!isDev(email));
        const apiKey = await resolveKey(email, 'ANTHROPIC_API_KEY');

        const advice = await jinAdvisor.getAdvice({
            question: question || 'Give me a business health summary',
            redis,
            apiKey,
            voice: !!voice,
        });

        broadcast('JIN_ADVICE', { advice: advice.advice, ts: Date.now() });

        // Send critical alerts via Telegram Lampa
        if (advice.isCritical) {
            lampaBot.sendAlert(advice.advice).catch(() => {});
        }

        res.json({ ...advice, tier: isFree ? 'free' : 'pro' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /settings/keys  — save user's own API keys to Redis (encrypted)
app.post('/settings/keys', async (req, res) => {
    const { email, keys } = req.body;
    if (!email || !keys) return res.status(400).json({ error: 'email and keys required' });

    try {
        const pipe = redis.pipeline();
        Object.entries(keys).forEach(([k, v]) => {
            if (v && v.length > 4) {
                pipe.setex(`userkeys:${email.toLowerCase()}:${k}`, 86400 * 30, v);
            }
        });
        await pipe.exec();
        res.json({ saved: Object.keys(keys).length, email });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /settings/keys/status — which keys are saved for user
app.get('/settings/keys/status', async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'email required' });

    const keyNames = ['ANTHROPIC_API_KEY','ETSY_API_KEY','X_BEARER_TOKEN',
                      'TIKTOK_CLIENT_KEY','SHOPIFY_API','ALCHEMY_WEB3','SERP_API'];
    const results = {};
    for (const k of keyNames) {
        const val = await redis.get(`userkeys:${email.toLowerCase()}:${k}`).catch(() => null);
        results[k] = val ? '✅ Saved' : (process.env[k] ? '🔑 System' : '—');
    }
    const devAccess = isDev(email);
    res.json({ email, keys: results, devAccess, tier: devAccess ? 'developer' : 'user' });
});

// DELETE /settings/keys — clear user keys
app.delete('/settings/keys', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    const keyNames = ['ANTHROPIC_API_KEY','ETSY_API_KEY','X_BEARER_TOKEN','TIKTOK_CLIENT_KEY'];
    for (const k of keyNames) {
        await redis.del(`userkeys:${email.toLowerCase()}:${k}`).catch(() => {});
    }
    res.json({ deleted: true, email });
});

// GET /alerts
app.get('/alerts', cache(15), async (req, res) => {
    const raw = await redis.get('data:alerts').catch(() => null);
    const alerts = raw ? JSON.parse(raw) : [];
    if (res.cacheJSON) await res.cacheJSON({ alerts, count: alerts.length });
    else res.json({ alerts, count: alerts.length });
});

// GET /pipeline/status
app.get('/pipeline/status', async (req, res) => {
    res.json(await pipeline.getStatus(redis));
});

// POST /pipeline/trigger
app.post('/pipeline/trigger', async (req, res) => {
    try {
        await pipeline.triggerManual(req.body.source || 'all', redis);
        res.json({ triggered: req.body.source || 'all', ts: Date.now() });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /stream/events (SSE fallback)
app.get('/stream/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const hb = setInterval(() => res.write(':ping\n\n'), 15000);
    const id  = uuid();
    clients.set(id, {
        ws: { readyState: WebSocket.OPEN, send: d => {
            try { const p = JSON.parse(d); res.write(`event:${p.channel}\ndata:${JSON.stringify(p.data)}\n\n`); } catch {}
        }},
        subs: new Set(['*']),
    });
    req.on('close', () => { clearInterval(hb); clients.delete(id); });
});

// ── SCHEDULED JOBS ────────────────────────────────────────────────────────────
cron.schedule('* * * * *', async () => {
    try {
        await pipeline.runAll(redis);
        const score  = await jinScoring.compute(redis);
        const alerts = await alertEngine.check(redis, score);
        await redis.setex('data:jin-score', 300, JSON.stringify(score));
        await redis.setex('data:alerts',    60,  JSON.stringify(alerts));
        broadcast('PIPELINE_COMPLETE', { ts: Date.now(), jinScore: score.overall });
        broadcast('JIN_SCORE', score);
        if (alerts.length) {
            broadcast('ALERTS', alerts);
            const critical = alerts.filter(a => a.level === 'HIGH');
            if (critical.length) lampaBot.sendAlert(critical[0].message).catch(() => {});
        }
    } catch (e) { console.error('[Cron] Error:', e.message); }
});

cron.schedule('*/5 * * * *', async () => {
    try {
        const advice = await jinAdvisor.generateProactive(redis);
        if (advice) {
            await redis.setex('data:jin-advice', 360, JSON.stringify(advice));
            broadcast('JIN_ADVICE', advice);
        }
    } catch {}
});

// ── START ─────────────────────────────────────────────────────────────────────
server.listen(PORT, async () => {
    await redis.connect().catch(() => {});
    console.log(`\n🔮 Hottabych Engine v3.0 running on :${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}/ws`);
    console.log(`   Health:    http://localhost:${PORT}/health`);
    console.log(`   Dev emails: ${DEV_EMAILS.join(', ')}\n`);
    setTimeout(() => pipeline.runAll(redis).catch(() => {}), 2000);
});

module.exports = { broadcast, redis, isDev };
