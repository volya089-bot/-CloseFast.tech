const { getUser, isOwner, createSession } = require('../lib/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const e = email.toLowerCase().trim();

    if (await isOwner(e)) {
      const token = await createSession(e, 'elite', true);
      return res.json({ success:true, email:e, name:e.split('@')[0], plan:'elite', god:true, paid:true, token });
    }

    const user = await getUser(e);
    if (!user) return res.status(401).json({ error: 'No account found. Please register.' });
    if (!user.confirmed) return res.status(401).json({ error:'Please confirm your email first.', needsConfirm:true });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error:'Wrong password.' });

    const token = await createSession(e, user.plan, false);
    res.json({ success:true, email:e, name:user.name, plan:user.plan, god:false, paid:!!user.plan, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
