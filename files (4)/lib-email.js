const T=(body)=>`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;background:#F5F0E8;margin:0;padding:20px}.w{max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}.top{background:#0F172A;padding:24px 32px;text-align:center;color:#F5F5F0;font-size:20px;font-weight:700}.s{color:#F0A500}.b{padding:28px 32px;color:#374151;font-size:15px;line-height:1.7}.btn{display:inline-block;background:#F0A500;color:#000;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:14px;margin:8px 0}.f{background:#F9FAFB;padding:14px 32px;font-size:11px;color:#9CA3AF;border-top:1px solid #E5E7EB}</style></head><body><div class="w"><div class="top">⚡ CloseFast <span class="s">Omni</span></div><div class="b">${body}</div><div class="f">CloseFast Omni · closefast.tech</div></div></body></html>`;

const DOMAIN = process.env.DOMAIN || 'closefast.tech';

async function send(to, name, subject, body) {
  const html = T(body);

  // 1. Resend — recommended (free 3K/month) resend.com
  if (process.env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify({ from:`CloseFast Omni <noreply@${DOMAIN}>`, to:[to], subject, html }),
    });
    if (r.ok) return true;
  }

  // 2. Brevo (free 300/day) brevo.com
  if (process.env.BREVO_API_KEY) {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method:'POST',
      headers:{'api-key':process.env.BREVO_API_KEY,'Content-Type':'application/json'},
      body: JSON.stringify({ sender:{name:'CloseFast Omni',email:`noreply@${DOMAIN}`}, to:[{email:to,name}], subject, htmlContent:html }),
    });
    if (r.ok) return true;
  }

  // 3. Nodemailer SMTP
  if (process.env.SMTP_HOST) {
    const nodemailer = require('nodemailer');
    const t = nodemailer.createTransport({ host:process.env.SMTP_HOST, port:Number(process.env.SMTP_PORT||587), secure:process.env.SMTP_SECURE==='true', auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS} });
    await t.sendMail({ from:`CloseFast Omni <${process.env.SMTP_USER}>`, to, subject, html });
    return true;
  }

  console.log(`[EMAIL DEV] To: ${to} | ${subject}`);
  return true;
}

const BASE = `https://${process.env.VERCEL_URL || DOMAIN}`;

module.exports = {
  sendConfirmation: (name, email, token) =>
    send(email, name, 'Confirm your CloseFast Omni account',
      `<p>Hi ${name},</p><p>Click below to confirm your email:</p><p style="text-align:center"><a href="${BASE}/api/confirm?token=${token}&email=${encodeURIComponent(email)}" class="btn">✅ Confirm Account</a></p>`),

  sendWelcome: (name, email, plan) =>
    send(email, name, `⚡ ${plan} activated — CloseFast Omni`,
      `<p>Hi ${name},</p><p>🎉 Your <strong>${plan}</strong> plan is active!</p><p style="text-align:center"><a href="${BASE}" class="btn">⚡ Open Dashboard</a></p>`),

  sendPasswordReset: (name, email, token) =>
    send(email, name, 'Reset your CloseFast Omni password',
      `<p>Hi ${name},</p><p style="text-align:center"><a href="${BASE}/api/reset-password?token=${token}&email=${encodeURIComponent(email)}" class="btn">🔑 Reset Password</a></p><p style="font-size:12px;color:#9CA3AF">Expires in 1 hour.</p>`),
};
