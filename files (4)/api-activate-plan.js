const { getUser, saveUser, createSession } = require('../lib/db');
const { sendWelcome } = require('../lib/email');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { email, plan, session_id, source } = req.body || {};
    if (!email || !plan) return res.status(400).json({ error: 'email and plan required' });

    const e = email.toLowerCase().trim();
    const validPlans = ['starter','pro','elite','agency','lifetime'];
    const cleanPlan = validPlans.includes(plan) ? plan : 'starter';

    let user = await getUser(e);
    if (!user) {
      user = { email:e, name:e.split('@')[0], password:'$stripe$', plan:cleanPlan,
               god:false, confirmed:true, confirmToken:'', resetToken:'', resetExpires:0,
               createdAt:new Date().toISOString(), activatedAt:new Date().toISOString(),
               paymentSource:source, stripeSession:session_id };
    } else {
      user.plan = cleanPlan; user.confirmed = true;
      user.activatedAt = new Date().toISOString();
      user.paymentSource = source; user.stripeSession = session_id;
    }
    await saveUser(user);
    await sendWelcome(user.name, e, cleanPlan).catch(()=>{});

    const token = await createSession(e, cleanPlan, false);
    res.json({ success:true, plan:cleanPlan, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
