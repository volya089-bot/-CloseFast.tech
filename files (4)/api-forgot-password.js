const { getUser, saveUser, isOwner } = require('../lib/db');
const { sendPasswordReset } = require('../lib/email');
const { v4: uuid } = require('uuid');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const e = email.toLowerCase().trim();
    const user = await getUser(e);
    if (user && user.confirmed && !await isOwner(e)) {
      const token = uuid();
      user.resetToken = token; user.resetExpires = Date.now() + 3600000;
      await saveUser(user);
      await sendPasswordReset(user.name, e, token).catch(()=>{});
    }
    res.json({ success: true, message: 'If account exists, reset link was sent.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
