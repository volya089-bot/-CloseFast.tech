const { verifySession } = require('../lib/db');
const { generateVideo } = require('../lib/ai');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { prompt, duration, ratio } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    let email = null;
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const payload = await verifySession(auth.slice(7));
      if (payload) email = payload.email;
    }

    const result = await generateVideo(prompt, email, { duration: duration || 5, ratio: ratio || '16:9' });
    res.json({ ...result, generated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
