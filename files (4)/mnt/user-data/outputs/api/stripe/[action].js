/**
 * POST /api/stripe/webhook — Stripe payment webhook
 * POST /api/stripe/activate — Manual plan activation
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,stripe-signature');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = req.url || '';

  // ── WEBHOOK ────────────────────────────────────────────────────────────────
  if (url.includes('/webhook')) {
    const sig     = req.headers['stripe-signature'];
    const secret  = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      if (secret && sig) {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, secret);
      } else {
        event = req.body;
      }
    } catch (e) {
      return res.status(400).json({ error: 'Webhook signature failed' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email   = session.customer_email || session.metadata?.email;
      const plan    = session.metadata?.plan || 'starter';

      if (email) await activatePlan(email, plan, session.id, 'stripe');
    }

    return res.json({ received: true });
  }

  // ── MANUAL ACTIVATE ────────────────────────────────────────────────────────
  if (url.includes('/activate') && req.method === 'POST') {
    const { email, plan, sessionId, source = 'manual' } = req.body || {};
    if (!email || !plan) return res.status(400).json({ error: 'email and plan required' });

    await activatePlan(email, plan, sessionId, source);
    return res.json({ success: true, email, plan, activated: new Date().toISOString() });
  }

  return res.status(404).end();
};

async function activatePlan(email, plan, sessionId, source) {
  try {
    const memStore = global._cfUsers || (global._cfUsers = new Map());

    let user = memStore.get(email.toLowerCase()) || { email: email.toLowerCase() };
    user.plan      = plan;
    user.confirmed = true;
    user.paidAt    = new Date().toISOString();
    user.source    = source;
    user.sessionId = sessionId;
    memStore.set(email.toLowerCase(), user);

    // Also try Vercel KV
    try {
      if (process.env.KV_REST_API_URL) {
        const { kv } = await import('@vercel/kv');
        const existing = await kv.get(`user:${email.toLowerCase()}`);
        const updated  = { ...(existing || {}), ...user };
        await kv.set(`user:${email.toLowerCase()}`, updated, { ex: 60 * 60 * 24 * 365 });
      }
    } catch {}

    // Send activation email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const planNames = { starter:'Starter ($19/mo)', pro:'Pro ($49/mo)', elite:'Elite ($99/mo)', agency:'Agency ($199/mo)', lifetime:'Lifetime ($499)' };
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'CloseFast Omni <noreply@closefast.tech>',
          to:   [email],
          subject: `⚡ ${planNames[plan] || plan} activated!`,
          html: `<p>Your <b>${planNames[plan]||plan}</b> plan is now active.</p><p><a href="https://closefast.tech">Open Dashboard →</a></p>`,
        }),
      });

      // Notify owner
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'CloseFast Omni <noreply@closefast.tech>',
          to:   ['volya089@gmail.com'],
          subject: `💰 New subscriber: ${plan} — ${email}`,
          html: `<p><b>Plan:</b> ${plan}<br><b>Email:</b> ${email}<br><b>Source:</b> ${source}<br><b>Session:</b> ${sessionId}</p>`,
        }),
      });
    }
  } catch (e) {
    console.error('[Activate]', e.message);
  }
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
