// Unified proxy for Claude, Etsy, Printify etc.
const { verifySession, getKey } = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  const { service } = req.query;

  let email = null;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    const p = await verifySession(auth.slice(7));
    if (p) email = p.email;
  }

  const configs = {
    claude: {
      url: 'https://api.anthropic.com/v1/messages',
      keyName: 'ANTHROPIC_API_KEY',
      headers: k => ({ 'x-api-key':k, 'anthropic-version':'2023-06-01', 'content-type':'application/json' }),
    },
    etsy: {
      url: `https://openapi.etsy.com/v3/application/${req.body?.path || 'openapi-ping'}`,
      keyName: 'ETSY_API_KEY',
      headers: k => ({ 'x-api-key':k, 'content-type':'application/json' }),
    },
    printify: {
      url: `https://api.printify.com/v1/${req.body?.path || 'shops.json'}`,
      keyName: 'PRINTIFY_API_TOKEN',
      headers: k => ({ 'Authorization':`Bearer ${k}`, 'content-type':'application/json' }),
    },
  };

  const cfg = configs[service];
  if (!cfg) return res.status(400).json({ error: `Unknown service: ${service}` });

  const key = await getKey(cfg.keyName, email);
  if (!key) return res.status(403).json({ error: `No ${cfg.keyName} configured. Add it in Settings → API Keys.` });

  try {
    const r = await fetch(cfg.url, {
      method: req.method,
      headers: cfg.headers(key),
      body: req.method !== 'GET' ? JSON.stringify(req.body?.data || req.body) : undefined,
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
