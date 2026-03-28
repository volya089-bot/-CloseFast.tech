const { getUser, saveUser } = require('../lib/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { token, email } = req.query;
    // Redirect to register page with token in URL for frontend to handle
    return res.redirect(`https://${req.headers.host}/register?action=reset&token=${token}&email=${encodeURIComponent(email)}`);
  }
  if (req.method !== 'POST') return res.status(405).end();
  const { token, email, password } = req.body || {};
  if (!token || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be 8+ characters' });
  try {
    const user = await getUser(email.toLowerCase().trim());
    if (!user || user.resetToken !== token || Date.now() > user.resetExpires)
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = ''; user.resetExpires = 0;
    await saveUser(user);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
