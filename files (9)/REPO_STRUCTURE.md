# CloseFast Omni — GitHub Repository Structure

Точна структура файлів у репозиторії:

```
closefast-omni/          ← ROOT репозиторію
│
├── vercel.json          ← тільки rewrites + headers
├── package.json         ← залежності, БЕЗ engines
│
├── api/                 ← Vercel serverless functions (автодетект)
│   ├── register.js
│   ├── login.js
│   ├── confirm.js
│   ├── forgot-password.js
│   ├── reset-password.js
│   ├── activate-plan.js
│   ├── ai.js
│   ├── keys.js
│   ├── stripe-webhook.js
│   ├── vly-check.js
│   ├── resend-confirmation.js
│   └── status.js
│
├── lib/                 ← shared modules
│   ├── db.js
│   ├── ai.js
│   └── email.js
│
├── index.html           ← КОРІНЬ (не в public/)
├── register.html
├── pricing.html
├── PrivacyPolicy.html
├── TermsOfService.html
├── app.js               ← 582KB React
└── sitemap.xml
```

## ⚠️ Важливо

Всі HTML та JS файли — в КОРЕНІ репозиторію, НЕ в папці `public/`.
Vercel автоматично сервує файли з кореня.
