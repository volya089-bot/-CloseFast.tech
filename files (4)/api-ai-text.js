const { verifySession } = require('../lib/db');
const { translate, rewrite, generateCode, generateEtsyListing } = require('../lib/ai');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { action, text, targetLang, style, language, product } = req.body || {};
    if (!action) return res.status(400).json({ error: 'action required' });

    let email = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const p = await verifySession(auth.slice(7));
      if (p) email = p.email;
    }

    let result;
    switch (action) {
      case 'translate':  result = await translate(text, targetLang || 'Ukrainian', email); break;
      case 'rewrite':    result = await rewrite(text, style || 'professional', email); break;
      case 'code':       result = await generateCode(text, language || 'JavaScript', email); break;
      case 'etsy':       result = await generateEtsyListing(product || text, email); break;
      default: return res.status(400).json({ error: 'Unknown action' });
    }
    res.json({ ...result, action, generated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
