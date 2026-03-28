/**
 * Build script — copies all static assets to /public
 * Runs during Vercel build phase
 */

const fs   = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');
if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC, { recursive: true });

// Files to copy from root to public/
const staticFiles = [
  'index.html', 'register.html', 'pricing.html',
  'PrivacyPolicy.html', 'TermsOfService.html',
  'app.js', 'sitemap.xml',
];

let copied = 0;
for (const file of staticFiles) {
  const src  = path.join(__dirname, file);
  const dest = path.join(PUBLIC, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    const size = Math.round(fs.statSync(dest).size / 1024);
    console.log(`  ✅ ${file} → public/ (${size}KB)`);
    copied++;
  } else {
    console.warn(`  ⚠️  ${file} not found — skipping`);
  }
}

// Create robots.txt
fs.writeFileSync(path.join(PUBLIC, 'robots.txt'),
`User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://closefast.tech/sitemap.xml
`);

// Create _headers for Vercel (security + cache)
fs.writeFileSync(path.join(PUBLIC, '_headers'),
`/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/app.js
  Cache-Control: public, max-age=604800, immutable

/*.html
  Cache-Control: no-cache, no-store, must-revalidate
`);

console.log(`\n✅ Build complete: ${copied} files → public/`);
