const { getUser, saveUser, isOwner, createSession } = require('../lib/db');
const { sendConfirmation } = require('../lib/email');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be 8+ characters' });
    const e = email.toLowerCase().trim();

    if (await isOwner(e)) {
      const token = await createSession(e, 'elite', true);
      return res.json({ success:true, owner:true, plan:'elite', god:true, token, email:e, name });
    }

    const existing = await getUser(e);
    if (existing) {
      if (existing.confirmed) return res.status(409).json({ error: 'Already registered. Please sign in.' });
      await sendConfirmation(existing.name, e, existing.confirmToken).catch(()=>{});
      return res.json({ success:true, message:'Confirmation email resent.' });
    }

    const confirmToken = uuid();
    await saveUser({ email:e, name, password: await bcrypt.hash(password, 10),
      plan:null, god:false, confirmed:false, confirmToken,
      resetToken:'', resetExpires:0, createdAt:new Date().toISOString() });

    await sendConfirmation(name, e, confirmToken).catch(()=>{});
    res.json({ success:true, email:e });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
