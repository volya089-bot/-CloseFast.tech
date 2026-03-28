/**
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/auth/confirm?token=&email=
 */

// Simple KV-based user store (Vercel KV or memory)
const memUsers = new Map();

const DEV_EMAILS = (process.env.DEV_EMAILS || 'volya089@gmail.com,slavikbobnar1981@gmail.com')
  .split(',').map(e => e.trim().toLowerCase());

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function getKV() {
  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import('@vercel/kv');
      return kv;
    }
  } catch {}
  return {
    get:  async k => memUsers.get(k) ? JSON.parse(memUsers.get(k)) : null,
    set:  async (k,v,opts) => memUsers.set(k, JSON.stringify(v)),
    del:  async k => memUsers.delete(k),
  };
}

function hashPwd(pwd) {
  // Simple hash — in production use bcrypt via Vercel serverless
  let h = 0;
  const salt = process.env.PWD_SALT || 'cf2025';
  const str  = pwd + salt;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

function genToken() {
  return Array.from(crypto.getRandomValues
    ? crypto.getRandomValues(new Uint8Array(32))
    : new Array(32).fill(0).map(() => Math.floor(Math.random()*256))
  ).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function sendEmail(to, subject, html) {
  // Resend.com (free 100/day) or just log in dev
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(`[Email] To: ${to}\nSubject: ${subject}`);
    return true;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'CloseFast Omni <noreply@closefast.tech>',
      to:   [to], subject, html,
    }),
  });
  return res.ok;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = req.url || '';
  const kv  = await getKV();

  // ── REGISTER ────────────────────────────────────────────────────────────────
  if (url.includes('/register') && req.method === 'POST') {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password min 8 characters' });

    const key = `user:${email.toLowerCase()}`;

    // Dev bypass
    if (DEV_EMAILS.includes(email.toLowerCase())) {
      return res.json({ success: true, owner: true, plan: 'elite', god: true, email, confirmed: true });
    }

    const existing = await kv.get(key);
    if (existing) {
      if (existing.confirmed) return res.status(400).json({ error: 'Email already registered. Sign in instead.' });
      // Resend confirmation
      await sendEmail(email, 'Confirm your CloseFast account',
        `<p>Hi ${existing.name}, click to confirm: <a href="${process.env.VERCEL_URL || 'https://closefast.tech'}/api/auth/confirm?token=${existing.confirmToken}&email=${encodeURIComponent(email)}">Confirm Email</a></p>`
      );
      return res.json({ success: true, message: 'Confirmation email resent.' });
    }

    const confirmToken = genToken();
    const user = { name, email: email.toLowerCase(), password: hashPwd(password),
                   plan: null, god: false, confirmed: false, confirmToken,
                   createdAt: new Date().toISOString() };
    await kv.set(key, user, { ex: 60 * 60 * 24 * 90 }); // 90 days

    const link = `${process.env.VERCEL_URL || 'https://closefast.tech'}/api/auth/confirm?token=${confirmToken}&email=${encodeURIComponent(email)}`;
    await sendEmail(email, 'Confirm your CloseFast Omni account',
      `<p>Hi ${name},</p><p>Click to confirm your account:</p><p><a href="${link}" style="background:#F0A500;color:#000;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold">✅ Confirm Email</a></p><p>After confirming, choose a plan to activate your AI agents.</p>`
    );

    return res.json({ success: true, email, message: 'Confirmation email sent. Check your inbox.' });
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  if (url.includes('/login') && req.method === 'POST') {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const eLower = email.toLowerCase();

    // Dev bypass — any password
    if (DEV_EMAILS.includes(eLower)) {
      return res.json({ success: true, email: eLower, name: eLower.includes('volya') ? 'Yaroslav' : 'Slavik',
                        plan: 'elite', god: true, paid: true, confirmed: true });
    }

    const user = await kv.get(`user:${eLower}`);
    if (!user) return res.status(401).json({ error: 'No account found. Please register first.' });
    if (!user.confirmed) return res.status(401).json({ error: 'Please confirm your email first.', needsConfirm: true });
    if (user.password !== hashPwd(password)) return res.status(401).json({ error: 'Wrong password.' });

    return res.json({ success: true, email: eLower, name: user.name,
                      plan: user.plan, paid: !!user.plan, god: false });
  }

  // ── CONFIRM ──────────────────────────────────────────────────────────────────
  if (url.includes('/confirm') && req.method === 'GET') {
    const { token, email } = req.query;
    const key  = `user:${email?.toLowerCase()}`;
    const user = await kv.get(key);

    if (!user || user.confirmToken !== token) {
      return res.redirect(302, '/register.html?status=error&msg=' + encodeURIComponent('Invalid or expired link.'));
    }

    user.confirmed    = true;
    user.confirmToken = '';
    await kv.set(key, user, { ex: 60 * 60 * 24 * 90 });

    return res.redirect(302, '/register.html?status=ok&msg=' + encodeURIComponent('Email confirmed! Sign in to continue.'));
  }

  return res.status(404).json({ error: 'Not found' });
};
