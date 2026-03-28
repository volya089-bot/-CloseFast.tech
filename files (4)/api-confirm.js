const { getUser, saveUser } = require('../lib/db');
const { sendWelcome } = require('../lib/email');

module.exports = async (req, res) => {
  const { token, email } = req.query;
  const base = `https://${req.headers.host}`;
  if (!token || !email) return res.redirect(`${base}/register?status=error&msg=Invalid+link`);
  try {
    const user = await getUser(decodeURIComponent(email));
    if (!user) return res.redirect(`${base}/register?status=error&msg=Account+not+found`);
    if (user.confirmed) return res.redirect(`${base}/register?status=ok&msg=Already+confirmed`);
    if (user.confirmToken !== token) return res.redirect(`${base}/register?status=error&msg=Invalid+link`);
    user.confirmed = true; user.confirmToken = '';
    await saveUser(user);
    await sendWelcome(user.name, user.email, 'Free').catch(()=>{});
    res.redirect(`${base}/register?status=ok&msg=Email+confirmed!+Sign+in+below.`);
  } catch (e) {
    res.redirect(`${base}/register?status=error&msg=${encodeURIComponent(e.message)}`);
  }
};
