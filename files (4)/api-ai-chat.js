const { verifySession, getKey } = require('../lib/db');
const { chat } = require('../lib/ai');

const HOTTABYCH_SYSTEM = `You are Hottabych — the most powerful AI business advisor for Etsy sellers and digital entrepreneurs.
You are the equivalent of BlackRock's Aladdin system but for independent e-commerce operators.

When analyzing, provide:
1. IMMEDIATE ACTIONS (next 24 hours)
2. TREND INTELLIGENCE (what market signals mean)
3. REVENUE OPTIMIZATION (specific pricing/ad recommendations)
4. RISK MITIGATION (protect against threats)
5. WEB3 ALPHA (Monad/VLY opportunities)

Be direct, specific, and use real numbers. Answer in the language of the question (Ukrainian or English).
Format: senior Goldman Sachs analyst meets Silicon Valley founder.`;

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { question, context, voice } = req.body || {};
    if (!question) return res.status(400).json({ error: 'question required' });

    // Get user email from token (optional — works without login too)
    let email = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const payload = await verifySession(auth.slice(7));
      if (payload) email = payload.email;
    }

    const contextStr = context ? `\n\nBUSINESS CONTEXT:\n${JSON.stringify(context, null, 2)}` : '';
    const prompt = `${question}${contextStr}`;

    const result = await chat(prompt, HOTTABYCH_SYSTEM, email, voice ? 300 : 800);
    res.json({ ...result, generated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
