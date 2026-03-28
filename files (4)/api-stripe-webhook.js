// Raw body needed for Stripe signature verification
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const sig = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    if (secret && sig) {
      const crypto = require('crypto');
      const payload = JSON.stringify(req.body);
      const timestamp = sig.split(',')[0].split('=')[1];
      const signed = sig.split(',').find(s => s.startsWith('v1=')).split('=')[1];
      const computed = crypto.createHmac('sha256', secret)
        .update(`${timestamp}.${payload}`).digest('hex');
      if (computed !== signed) return res.status(400).json({ error: 'Invalid signature' });
      event = req.body;
    } else {
      event = req.body;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_email || session.metadata?.email;
      const plan  = session.metadata?.plan || 'starter';

      if (email) {
        await fetch(`https://${req.headers.host}/api/activate-plan`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ email, plan, session_id:session.id, source:'stripe' }),
        });
      }
    }

    res.json({ received: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
