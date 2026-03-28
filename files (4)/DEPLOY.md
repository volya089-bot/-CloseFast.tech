# CloseFast Omni — Vercel Deployment Guide

## 5-Minute Deploy

### 1. Upload to GitHub
```bash
cd closefast-vercel/
git init
git add .
git commit -m "CloseFast Omni v3.0"
git remote add origin https://github.com/YOUR_USERNAME/closefast-omni.git
git push -u origin main
```

### 2. Connect to Vercel
- Go to vercel.com → New Project → Import from GitHub
- Select your repository
- Framework: **Other** (not Next.js)
- Root Directory: `./` (default)
- Click **Deploy**

### 3. Add Environment Variables
Vercel Dashboard → Project → Settings → Environment Variables
Copy all values from `.env.example` and fill in your keys.

**Minimum required for basic function:**
- `JWT_SECRET` — random 32+ char string
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (free at upstash.com)
- `RESEND_API_KEY` (free at resend.com — for emails)

**For AI features (at least one):**
- `GROQ_API_KEY` — FREE at console.groq.com (best free LLM)
- `GEMINI_API_KEY` — FREE at aistudio.google.com
- `HUGGINGFACE_API_KEY` — FREE at huggingface.co (FLUX images)

### 4. Set Custom Domain
Vercel Dashboard → Project → Settings → Domains → Add `closefast.tech`
Update your DNS: CNAME `closefast.tech` → `cname.vercel-dns.com`

### 5. Add Stripe Webhook
Stripe Dashboard → Webhooks → Add endpoint:
`https://closefast.tech/api/stripe-webhook`
Events: `checkout.session.completed`

## File Structure
```
closefast-vercel/
├── vercel.json          ← Routing config
├── package.json         ← Dependencies
├── .env.example         ← All env variables template
├── api/                 ← Serverless functions
│   ├── register.js      ← POST /api/register
│   ├── login.js         ← POST /api/login
│   ├── confirm.js       ← GET  /api/confirm?token=...
│   ├── forgot-password.js
│   ├── reset-password.js
│   ├── keys.js          ← GET/POST/DELETE /api/keys
│   ├── ai.js            ← POST /api/ai (chat/image/video/code)
│   ├── dashboard.js     ← GET  /api/dashboard
│   ├── activate-plan.js ← POST /api/activate-plan
│   └── stripe-webhook.js
├── lib/
│   ├── db.js            ← Upstash Redis + user operations
│   ├── ai.js            ← AI router (all providers)
│   └── email.js         ← Email (Resend/Brevo/SMTP)
└── public/              ← Static files served directly
    ├── index.html       ← Main app (React SPA)
    ├── register.html
    ├── pricing.html
    ├── app.js           ← Compiled React (582KB)
    ├── PrivacyPolicy.html
    ├── TermsOfService.html
    ├── sitemap.xml
    └── robots.txt
```

## Free AI Stack (Zero Cost)
| Capability | Provider | Free Tier |
|---|---|---|
| Text/Chat | Groq (LLaMA3 70B) | 14,400 req/day |
| Text/Chat | Google Gemini 1.5 Flash | 1,500 req/day |
| Text/Chat | Mistral Small | Free tier |
| Images | Pollinations.ai | Unlimited, no key |
| Images | HuggingFace FLUX | Free with account |
| Images | Ideogram AI | Free tier |
| Database | Upstash Redis | 10K req/day |
| Email | Resend | 3,000/month |

## Owner Access
`volya089@gmail.com` and `slavikbobnar1981@gmail.com` → instant Elite access,
no email confirmation, no payment — any password works.
