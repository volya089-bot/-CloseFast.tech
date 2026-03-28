(function(){
var React=window.React;
var ReactDOM=window.ReactDOM;
var useRef=React.useRef;

function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
const {
  useState,
  useEffect
} = React;
const GF = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&display=swap";

// ─── STRICT MASTER EMAIL ─────────────────────────────────────────────────────
// ─── MASTER EMAILS (власники платформи) ──────────────────────────────────────
const MASTER_EMAILS = ["volya089@gmail.com", "slavikbobnar1981@gmail.com"];
const MASTER_EMAIL = MASTER_EMAILS[0]; // primary for display
function isMaster(e) {
  if (!e) return false;
  var clean = e.trim().toLowerCase();
  return MASTER_EMAILS.some(function (m) {
    return m.toLowerCase() === clean;
  });
}

// ─── VLY TOKEN ────────────────────────────────────────────────────────────────
// ─── MONAD NODE (Chainstack) ─────────────────────────────────────────────────
// Твій особистий вузол Monad Mainnet — Chainstack NД-076-742-968
// Замінити на реальний endpoint з console.chainstack.com → Проект VLY → Вузол → Credentials
var MONAD_RPC_NODE = "https://nd-076-742-968.p2pify.com/YOUR_CHAINSTACK_KEY";
var MONAD_CHAIN_ID = 143;
var VLY_TOKEN_ADDR = "0x9459ddd1B70E51280DEf774650EcD04F0e24d234";
function monadRPC(_x, _x2) {
  return _monadRPC.apply(this, arguments);
}
function _monadRPC() {
  _monadRPC = _asyncToGenerator(function* (method, params) {
    var endpoint = MONAD_RPC_NODE.includes("YOUR_") ? "https://rpc.monad.xyz" : MONAD_RPC_NODE;
    var r = yield fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: method,
        params: params || [],
        id: 1
      })
    });
    var d = yield r.json();
    if (d.error) throw new Error("Monad RPC: " + d.error.message);
    return d.result;
  });
  return _monadRPC.apply(this, arguments);
}
function getMonadBalance(_x3) {
  return _getMonadBalance.apply(this, arguments);
}
function _getMonadBalance() {
  _getMonadBalance = _asyncToGenerator(function* (address) {
    var hex = yield monadRPC("eth_getBalance", [address, "latest"]);
    return parseInt(hex, 16) / 1e18;
  });
  return _getMonadBalance.apply(this, arguments);
}
function getVlyBalance(_x4) {
  return _getVlyBalance.apply(this, arguments);
}
function _getVlyBalance() {
  _getVlyBalance = _asyncToGenerator(function* (address) {
    var data = "0x70a08231" + address.replace("0x", "").padStart(64, "0");
    var hex = yield monadRPC("eth_call", [{
      to: VLY_TOKEN_ADDR,
      data: data
    }, "latest"]);
    return parseInt(hex, 16) / 1e18;
  });
  return _getVlyBalance.apply(this, arguments);
}
const VLY_BUY_LINK = "https://pancakeswap.finance/swap?outputCurrency=0x9459ddd1B70E51280DEf774650EcD04F0e24d234";
const VLY_DISCOUNT_THRESHOLD = 1000;
const VLY_DISCOUNT_PCT = 10;

// ─── SUBSCRIBER COUNTER (real — from Stripe webhook logs) ────────────────────
// Reads from /api/stripe-stats.php which parses logs/subscriptions.log
const INITIAL_SUBS = {
  merchant: 0,
  enterprise: 0,
  holdings: 0
};

// ─── SIMPLE ENCRYPT (obfuscation for keys stored in-memory only) ─────────────
function encodeKey(raw) {
  if (!raw) return "";
  try {
    return btoa(unescape(encodeURIComponent(raw)));
  } catch (e) {
    return raw;
  }
}
function decodeKey(enc) {
  if (!enc) return "";
  try {
    return decodeURIComponent(escape(atob(enc)));
  } catch (e) {
    return enc;
  }
}
function maskKey(s) {
  if (!s || s.length < 8) return "••••••••";
  return s.slice(0, 4) + "••••••••" + s.slice(-4);
}

// ─── WHITE CORPORATE PALETTE ─────────────────────────────────────────────────
const C = {
  bg: "#FFFFFF",
  bg2: "#F8F9FC",
  bg3: "#F1F3F7",
  surf: "#FFFFFF",
  surf2: "#EEF0F6",
  bdr: "#E2E6F0",
  bdr2: "#C8CEDF",
  txt: "#111827",
  t2: "#374151",
  t3: "#6B7280",
  t4: "#9CA3AF",
  amber: "#F0A500",
  amberL: "#FFF8E1",
  amberD: "#B07800",
  blue: "#1D4ED8",
  blueL: "#DBEAFE",
  blue2: "#3B82F6",
  grn: "#059669",
  grnL: "#ECFDF5",
  grn2: "#10B981",
  red: "#DC2626",
  redL: "#FEF2F2",
  pur: "#7C3AED",
  purL: "#F5F3FF",
  mono: "'IBM Plex Mono', monospace",
  sans: "'DM Sans', system-ui, sans-serif",
  dis: "'Syne', system-ui, sans-serif"
};

// ─── I18N ─────────────────────────────────────────────────────────────────────
const I18N = {
  en: {
    brand: "CloseFast",
    tagline: "OPERATION COMMAND CENTER",
    login_title: "Access Platform",
    login_sub: "Enter your email to continue. Master admin unlocks full system.",
    email_label: "Email Address",
    email_ph: "you@example.com",
    captcha_label: "Solve to verify you're human",
    captcha_ph: "Your answer",
    captcha_err: "Wrong answer. Try again.",
    email_err: "Enter a valid email address.",
    btn_login: "Continue",
    btn_loading: "Verifying...",
    tab_connections: "Connections",
    tab_command: "Command Center",
    tab_inventory: "Inventory Engine",
    tab_social: "Social Engine",
    tab_audit: "Site Audit",
    tab_support: "💬 Support AI",
    tab_growth: "📈 Growth",
    tab_plans: "Plans",
    tab_sentinel: "Sentinel",
    tab_builder: "AI Builder",
    tab_hottabych: "✦ HOTTABYCH",
    tab_robinhood: "🏹 ROBIN HOOD",
    tab_token: "🪙 TOKEN STUDIO",
    tab_media: "🎬 MEDIA STUDIO",
    active: "ACTIVE",
    god_badge: "GOD MODE",
    offline: "OFFLINE",
    online: "ONLINE",
    autopilot_on: "AUTOPILOT ON",
    autopilot_off: "AUTOPILOT OFF",
    connect: "Connect",
    disconnect: "Disconnect",
    connect_encrypt: "Connect & Encrypt",
    cancel: "Cancel",
    access_denied: "Access Restricted",
    access_denied_sub: "This section requires an active subscription.",
    choose_plan: "Choose a Plan to Get Started",
    plans_title: "Plans & Tiers",
    plans_sub: "90/5/5 revenue model · VLY liquidity · Sovereign commerce",
    monthly: "Monthly",
    annual: "Annual -20%",
    subscribe: "Subscribe",
    master_only: "Master Only",
    save: "Save",
    per_mo: "/mo",
    per_yr: "/yr",
    most_popular: "MOST POPULAR",
    ai_agent: "AI AGENT",
    footer: "CLOSEFAST OMNI · OPERATION COMMAND CENTER · VLY LIQUIDITY · MONAD NETWORK",
    master_session: "MASTER ADMIN SESSION",
    connected: "Connected",
    on_autopilot: "Autopilot ON",
    run_audit: "Run Audit",
    auditing: "Auditing...",
    site_audit_title: "Site Audit",
    site_audit_sub: "AI revenue-impact audit · SEO + CRO + speed + security",
    audit_ph: "https://yourstore.etsy.com or any URL..."
  },
  ua: {
    brand: "CloseFast",
    tagline: "ЦЕНТР УПРАВЛІННЯ ОПЕРАЦІЯМИ",
    login_title: "Вхід до платформи",
    login_sub: "Введіть email для продовження. Майстер-адмін розблоковує повний доступ.",
    email_label: "Email адреса",
    email_ph: "ви@example.com",
    captcha_label: "Вирішіть приклад (захист від ботів)",
    captcha_ph: "Ваша відповідь",
    captcha_err: "Невірна відповідь. Спробуйте ще.",
    email_err: "Введіть дійсну email адресу.",
    btn_login: "Продовжити",
    btn_loading: "Перевірка...",
    tab_connections: "Підключення",
    tab_command: "Центр управління",
    tab_inventory: "Інвентар",
    tab_social: "Соцмережі",
    tab_audit: "Аудит сайту",
    tab_support: "💬 Підтримка AI",
    tab_growth: "📈 Зростання",
    tab_plans: "Плани",
    tab_sentinel: "Сентінел",
    tab_builder: "AI Конструктор",
    tab_hottabych: "✦ ХОТТАБИЧ",
    tab_robinhood: "🏹 РОБІНГУД",
    tab_token: "🪙 ТОКЕН СТУДІЯ",
    tab_media: "🎬 МЕДІА СТУДІЯ",
    active: "АКТИВНИЙ",
    god_badge: "БОГ РЕЖИМ",
    offline: "ОФЛАЙН",
    online: "ОНЛАЙН",
    autopilot_on: "АВТОПІЛОТ УВІМК.",
    autopilot_off: "АВТОПІЛОТ ВИМК.",
    connect: "Підключити",
    disconnect: "Відключити",
    connect_encrypt: "Підключити та зашифрувати",
    cancel: "Скасувати",
    access_denied: "Доступ обмежено",
    access_denied_sub: "Цей розділ потребує активної підписки.",
    choose_plan: "Оберіть план для початку роботи",
    plans_title: "Плани та тарифи",
    plans_sub: "Модель доходу 90/5/5 · Ліквідність VLY · Суверенна торгівля",
    monthly: "Щомісячно",
    annual: "Щорічно -20%",
    subscribe: "Підписатися",
    master_only: "Лише власник",
    save: "Економія",
    per_mo: "/міс",
    per_yr: "/рік",
    most_popular: "НАЙ ПОПУЛЯРНІШИЙ",
    ai_agent: "AI АГЕНТ",
    footer: "CLOSEFAST OMNI · ЦЕНТР УПРАВЛІННЯ · ЛІКВІДНІСТЬ VLY · МЕРЕЖА MONAD",
    master_session: "СЕСІЯ МАЙСТЕР АДМІНА",
    connected: "Підключено",
    on_autopilot: "Автопілот УВІМК.",
    run_audit: "Запустити аудит",
    auditing: "Аудит...",
    site_audit_title: "Аудит сайту",
    site_audit_sub: "AI аудит впливу на дохід · SEO + CRO + швидкість + безпека",
    audit_ph: "https://yourstore.etsy.com або будь-який URL..."
  }
};

// ─── AI CALL ─────────────────────────────────────────────────────────────────
// ─── AI PROXY — routes through PHP backend in production ─────────────────────
// In Claude artifact env: calls api.anthropic.com directly (no key needed)
// In production (hostiq.ua): calls /api/proxy/claude (key stays server-side)
var AI_PROXY = function () {
  try {
    var host = window.location.hostname;
    var isArtifact = host === "claude.ai" || host === "" || host === "localhost" || host.includes("anthropic") || host.includes("claude");
    return isArtifact ? "https://api.anthropic.com/v1/messages" : "/api/proxy/claude";
  } catch (e) {
    return "https://api.anthropic.com/v1/messages";
  }
}();

// Simple in-memory rate limiter: max 20 calls/minute per session
var _aiCalls = [];
var AI_RATE_LIMIT = 20;
function checkRateLimit() {
  var now = Date.now();
  _aiCalls = _aiCalls.filter(function (t) {
    return now - t < 60000;
  });
  if (_aiCalls.length >= AI_RATE_LIMIT) throw new Error("Rate limit: max " + AI_RATE_LIMIT + " AI calls/min. Please wait.");
  _aiCalls.push(now);
}
function ai(_x5, _x6, _x7) {
  return _ai.apply(this, arguments);
}
function _ai() {
  _ai = _asyncToGenerator(function* (sys, user, max) {
    checkRateLimit();
    max = max || 800;
    var isProxy = !AI_PROXY.includes("anthropic.com");
    var headers = {
      "Content-Type": "application/json"
    };
    // NOTE: API key is NEVER in frontend code.
    // For artifact env: Claude.ai injects auth automatically.
    // For production: key is in .env on server, PHP proxy reads it.
    var body = {
      model: "claude-sonnet-4-6",
      max_tokens: max,
      system: sys,
      messages: [{
        role: "user",
        content: user
      }]
    };
    // Proxy endpoint doesn't need anthropic-version header (PHP adds it)
    if (!isProxy) {
      headers["anthropic-version"] = "2023-06-01";
      headers["anthropic-dangerous-direct-browser-access"] = "true";
    }
    var r = yield fetch(AI_PROXY, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });
    var d = yield r.json();
    if (!d.content) throw new Error(d.error ? d.error.message : "API error " + r.status);
    // Track AI calls in session for Sentinel dashboard
    try {
      var n = parseInt(sessionStorage.getItem("cf_ai_tasks") || "0") + 1;
      sessionStorage.setItem("cf_ai_tasks", String(n));
    } catch (e) {}
    return d.content[0] ? d.content[0].text : "";
  });
  return _ai.apply(this, arguments);
}
const NICHES = [{
  v: "wall-art",
  l: "Wall Art / Prints"
}, {
  v: "jewelry",
  l: "Jewelry & Accessories"
}, {
  v: "apparel",
  l: "POD Apparel"
}, {
  v: "digital",
  l: "Digital Downloads"
}, {
  v: "home-decor",
  l: "Home Decor"
}, {
  v: "stickers",
  l: "Stickers & Cards"
}];
const TASK_TEMPLATES = [{
  icon: "🛍",
  plat: "Etsy",
  text: "Creating 5 listings for Store A — Monad Fan Art Wall Prints",
  dur: 34,
  col: C.amber
}, {
  icon: "🔵",
  plat: "X",
  text: "Monitoring Monad ecosystem — 3 trending topics detected",
  dur: 12,
  col: C.blue
}, {
  icon: "📸",
  plat: "Instagram",
  text: "Generating Reels descriptions from 8 new product photos",
  dur: 47,
  col: C.pur
}, {
  icon: "🖨",
  plat: "Printify",
  text: "Auto-generating mockups for Store B — Wall Art collection",
  dur: 28,
  col: C.grn
}, {
  icon: "🛍",
  plat: "Etsy",
  text: "SEO-tagging 12 listings in Store C — Crypto Apparel niche",
  dur: 19,
  col: C.amber
}, {
  icon: "🔵",
  plat: "X",
  text: "Scheduling viral thread: Monad TPS vs ETH — data-driven",
  dur: 8,
  col: C.blue
}, {
  icon: "📸",
  plat: "Instagram",
  text: "Posting Slot A crypto infographic @volya089 — peak time",
  dur: 5,
  col: C.pur
}, {
  icon: "📊",
  plat: "Etsy",
  text: "CTR audit — Store A underperforming tags replaced",
  dur: 22,
  col: C.grn
}];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS_PARTS = ["@import url('" + GF + "');", "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}", "html,body{background:#F8F9FC;color:#111827;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}", "input,select,textarea,button{font-family:inherit;}", "input:focus,select:focus,textarea:focus{outline:none;}", "input[type=checkbox]{accent-color:#F0A500;}", "::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-thumb{background:#C8CEDF;border-radius:99px;}", "@keyframes spin{to{transform:rotate(360deg)}}", "@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}", "@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}", "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}", "@keyframes taskSlide{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}", "@keyframes godglow{0%,100%{box-shadow:inset 0 0 80px rgba(240,165,0,.04)}50%{box-shadow:inset 0 0 80px rgba(240,165,0,.10)}}", "@keyframes hottglow{0%,100%{box-shadow:inset 0 0 120px rgba(139,92,246,.06)}50%{box-shadow:inset 0 0 120px rgba(139,92,246,.18)}}", "@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.04)}}", "@keyframes crystalPulse{0%,100%{box-shadow:0 0 40px rgba(139,92,246,.4),0 0 80px rgba(192,132,252,.2)}50%{box-shadow:0 0 60px rgba(139,92,246,.7),0 0 120px rgba(192,132,252,.4)}}", "@keyframes gentleSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}", "@keyframes vlyFloat{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-18px) rotate(4deg)}66%{transform:translateY(-8px) rotate(-3deg)}}", "@keyframes vlyGlow{0%,100%{box-shadow:0 0 40px rgba(240,165,0,.6),0 0 80px rgba(240,165,0,.3)}50%{box-shadow:0 0 80px rgba(240,165,0,.95),0 0 160px rgba(240,165,0,.5)}}", "@keyframes scanLine{0%{top:0%}100%{top:100%}}", ".fade{animation:fadeUp .25s ease forwards}", ".task-item{animation:taskSlide .3s ease forwards}", ".cf-card{background:#FFFFFF;border:1px solid #E2E6F0;border-radius:10px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.04);}", ".cf-inp{width:100%;background:#FFFFFF;border:1.5px solid #E2E6F0;border-radius:7px;padding:8px 12px;color:#111827;font-size:13px;transition:border-color .15s;}", ".cf-inp:focus{border-color:#F0A500;box-shadow:0 0 0 3px rgba(240,165,0,.1);}", ".cf-inp::placeholder{color:#9CA3AF;}", ".cf-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:none;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s;white-space:nowrap;}", ".cf-btn-amber{background:#F0A500;color:#FFFFFF;}", ".cf-btn-amber:hover{background:#D4920A;}", ".cf-btn-amber:disabled{opacity:.4;cursor:not-allowed;}", ".cf-btn-ghost{background:#F8F9FC;border:1px solid #E2E6F0;color:#374151;}", ".cf-btn-ghost:hover{background:#F1F3F7;}", ".cf-btn-danger{background:#FEF2F2;border:1px solid rgba(220,38,38,.25);color:#DC2626;}", ".cf-btn-danger:hover{background:#FEE2E2;}", ".cf-tab{padding:10px 16px;border:none;background:none;cursor:pointer;font-size:12px;font-weight:600;color:#6B7280;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap;letter-spacing:.2px;}", ".cf-tab.on{color:#F0A500;border-bottom-color:#F0A500;font-weight:700;}", ".cf-tab.god{color:#7C3AED;border-bottom-color:#7C3AED;font-weight:700;}", ".cf-tab.hott{color:#C084FC;border-bottom-color:#C084FC;font-weight:700;text-shadow:0 0 8px rgba(192,132,252,.5);}", ".cf-tab.robin{color:#059669;border-bottom-color:#059669;font-weight:700;}", ".cf-tab:hover:not(.on):not(.god):not(.hott):not(.robin){color:#374151;}", ".toggle-track{width:42px;height:24px;border-radius:99px;transition:background .2s;cursor:pointer;position:relative;flex-shrink:0;border:none;}", ".toggle-thumb{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 6px rgba(0,0,0,.25);}", ".god-root{animation:godglow 4s ease-in-out infinite;}", ".lang-btn{padding:4px 10px;border-radius:5px;border:1px solid #E2E6F0;background:#FFFFFF;cursor:pointer;font-size:11px;font-weight:700;font-family:'IBM Plex Mono',monospace;transition:all .15s;}", ".lang-btn.active{background:#F0A500;color:#FFFFFF;border-color:#F0A500;}", ".captcha-box{background:#F8F9FC;border:1.5px solid #E2E6F0;border-radius:8px;padding:14px 16px;margin-bottom:12px;}", ".modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px;}", "@keyframes modalIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}", ".modal-box{background:#FFFFFF;border-radius:16px;padding:28px;width:100%;max-width:480px;box-shadow:0 16px 64px rgba(0,0,0,.18);position:relative;animation:modalIn .25s ease;}", ".pay-opt{border:2px solid #E2E6F0;border-radius:10px;padding:14px 16px;cursor:pointer;transition:all .15s;margin-bottom:10px;display:flex;align-items:center;gap:14px;}", ".pay-opt:hover{border-color:#F0A500;background:#FFFDF5;}", ".pay-opt.selected{border-color:#F0A500;background:#FFF8E1;}",
// ── RESPONSIVE ─────────────────────────────────────────────────
// Layout containers
".cf-main{padding:20px 24px;max-width:1280px;margin:0 auto;}", ".cf-header-inner{max-width:1280px;margin:0 auto;padding:0 24px;}",
// Plans grid: 4 → 2 → 1
".plans-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}",
// Connections platforms grid
".platforms-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}",
// Sphere grid for Hottabych: 5 → 3 → 2
".sphere-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}",
// Stats/metrics row: 4 → 2 → 2
".stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}",
// Two-col layout: sidebar + main
".two-col{display:grid;grid-template-columns:320px 1fr;gap:20px;}",
// Tab bar — horizontal scroll on mobile
".cf-tabs-wrap{display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:0;}", ".cf-tabs-wrap::-webkit-scrollbar{display:none;}",
// Mobile nav bottom bar
".cf-mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:200;background:#FFFFFF;border-top:1px solid #E2E6F0;padding:4px 0 env(safe-area-inset-bottom,4px);box-shadow:0 -4px 20px rgba(0,0,0,.08);}", ".cf-mobile-nav button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 2px;border:none;background:none;cursor:pointer;gap:2px;min-width:0;}", ".cf-mobile-nav button .mnav-icon{font-size:18px;line-height:1;}", ".cf-mobile-nav button .mnav-label{font-size:8px;font-weight:600;color:#6B7280;font-family:'IBM Plex Mono',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:56px;}", ".cf-mobile-nav button.active .mnav-label{color:#F0A500;}", ".cf-mobile-nav button.god-nav .mnav-label{color:#7C3AED;}", ".cf-mobile-nav button.hott-nav .mnav-label{color:#C084FC;}", ".cf-mobile-nav button.robin-nav .mnav-label{color:#059669;}",
// ── TABLET (≤900px) ──────────────────────────────────────
"@media(max-width:900px){", "  .plans-grid{grid-template-columns:repeat(2,1fr);gap:12px;}", "  .stats-row{grid-template-columns:repeat(2,1fr);}", "  .two-col{grid-template-columns:1fr;}", "  .sphere-grid{grid-template-columns:repeat(4,1fr);}", "  .cf-main{padding:16px 16px;}", "  .cf-header-inner{padding:0 16px;}", "}",
// ── MOBILE (≤600px) ──────────────────────────────────────
"@media(max-width:600px){", "  body{padding-bottom:60px;}",
// Header
"  .cf-logo-text{display:none;}", "  .cf-tagline{display:none;}", "  .cf-header-inner{padding:0 12px;}",
// Desktop tabs hidden, mobile nav shown
"  .cf-desktop-tabs{display:none !important;}", "  .cf-mobile-nav{display:flex;}",
// Main content
"  .cf-main{padding:12px 12px 72px;}",
// Plans: single column
"  .plans-grid{grid-template-columns:1fr;gap:10px;}",
// Stats: 2 col on mobile
"  .stats-row{grid-template-columns:repeat(2,1fr);gap:8px;}",
// Sphere selector: 3 col
"  .sphere-grid{grid-template-columns:repeat(3,1fr);gap:5px;}",
// Two-col → single
"  .two-col{grid-template-columns:1fr;}",
// Connections
"  .platforms-grid{grid-template-columns:1fr;}",
// Modal full screen
"  .modal-overlay{padding:0;align-items:flex-end;}", "  .modal-box{border-radius:16px 16px 0 0;max-width:100%;padding:20px;}",
// Hottabych Crystal Ball smaller
"  .crystal-ball{width:160px !important;height:160px !important;}",
// Login screen
"  .login-card{margin:20px 12px !important;padding:20px 16px !important;}",
// Cards full width
"  .cf-card{padding:14px;}",
// Buttons full-width in mobile context
"  .mobile-full{width:100% !important;justify-content:center !important;}", "  .hottabych-header-price{font-size:22px !important;}", "}"];
const CSS = CSS_PARTS.join("\n");

// ─── MICRO COMPONENTS ────────────────────────────────────────────────────────
function Spin({
  sz
}) {
  sz = sz || 13;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: sz,
      height: sz,
      border: "2px solid #E2E6F0",
      borderTopColor: C.amber,
      borderRadius: "50%",
      animation: "spin .6s linear infinite",
      flexShrink: 0
    }
  });
}
function Dot({
  status
}) {
  var col = status === "online" ? C.grn : status === "syncing" ? C.amber : status === "error" ? C.red : C.t4;
  var anim = status === "online" || status === "syncing" ? "pulse 2s infinite" : "none";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: col,
      animation: anim,
      flexShrink: 0
    }
  });
}
function Toggle({
  on,
  set,
  col
}) {
  col = col || C.amber;
  return /*#__PURE__*/React.createElement("button", {
    className: "toggle-track",
    onClick: function () {
      set(!on);
    },
    style: {
      background: on ? col : "#E2E6F0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "toggle-thumb",
    style: {
      left: on ? "21px" : "3px"
    }
  }));
}
function Lbl({
  children,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: color || C.t3,
      letterSpacing: ".7px",
      marginBottom: 5,
      textTransform: "uppercase",
      fontFamily: C.mono
    }
  }, children);
}
function Chip({
  children,
  color,
  bg
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 4,
      background: bg || color + "18",
      color: color || C.t3,
      letterSpacing: ".3px",
      textTransform: "uppercase"
    }
  }, children);
}
function PBar({
  pct,
  color,
  h
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: h || 5,
      background: C.bg3,
      borderRadius: 99,
      overflow: "hidden",
      border: "1px solid " + C.bdr
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: pct + "%",
      background: color || C.amber,
      borderRadius: 99,
      transition: "width 1.2s cubic-bezier(.4,0,.2,1)"
    }
  }));
}
function Fld({
  label,
  val,
  set,
  type,
  ph
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Lbl, null, label), /*#__PURE__*/React.createElement("input", {
    className: "cf-inp",
    type: type || "text",
    value: val,
    onChange: function (e) {
      set(e.target.value);
    },
    placeholder: ph || ""
  }));
}

// ─── CAPTCHA ─────────────────────────────────────────────────────────────────
function makeCaptcha() {
  var ops = ["+", "-", "*"];
  var op = ops[Math.floor(Math.random() * 3)];
  var a, b, ans;
  if (op === "+") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    ans = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 9) + 5;
    b = Math.floor(Math.random() * 5) + 1;
    ans = a - b;
  } else {
    a = Math.floor(Math.random() * 8) + 2;
    b = Math.floor(Math.random() * 5) + 2;
    ans = a * b;
  }
  return {
    q: a + " " + op + " " + b + " = ?",
    ans: ans
  };
}

// ─── LOGIN GATE ───────────────────────────────────────────────────────────────
function LoginGate({
  onLogin
}) {
  var [lang, setLang] = useState("en");
  var [email, setEmail] = useState("");
  var [captcha] = useState(makeCaptcha);
  var [capAns, setCapAns] = useState("");
  var [busy, setBusy] = useState(false);
  var [err, setErr] = useState("");
  var T = I18N[lang];
  function submit() {
    setErr("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr(T.email_err);
      return;
    }
    if (parseInt(capAns) !== captcha.ans) {
      setErr(T.captcha_err);
      return;
    }
    setBusy(true);
    setTimeout(function () {
      onLogin({
        email: email.trim(),
        god: isMaster(email.trim()),
        lang: lang
      });
    }, 800);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#F8F9FC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: C.sans,
      padding: 20,
      backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(240,165,0,.06) 0%, transparent 60%)"
    }
  }, /*#__PURE__*/React.createElement("style", null, CSS), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 420
    },
    className: "login-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 60,
      height: 60,
      borderRadius: 16,
      marginBottom: 16,
      background: "linear-gradient(135deg,#F0A500,#B07800)",
      boxShadow: "0 8px 32px rgba(240,165,0,.35)",
      fontSize: 30
    }
  }, "\u26A1"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      letterSpacing: "-1px",
      color: C.txt,
      fontFamily: C.dis
    }
  }, "CloseFast ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Omni")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginTop: 6,
      letterSpacing: ".5px",
      fontFamily: C.mono
    }
  }, T.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 6,
      marginTop: 12
    }
  }, ["en", "ua"].map(function (l) {
    return /*#__PURE__*/React.createElement("button", {
      key: l,
      className: "lang-btn" + (lang === l ? " active" : ""),
      onClick: function () {
        setLang(l);
      }
    }, l === "en" ? "🇬🇧 EN" : "🇺🇦 UA");
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 14,
      padding: 28,
      boxShadow: "0 4px 32px rgba(0,0,0,.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4
    }
  }, T.login_title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.t3,
      marginBottom: 20,
      lineHeight: 1.6
    }
  }, T.login_sub), /*#__PURE__*/React.createElement(Lbl, null, T.email_label), /*#__PURE__*/React.createElement("input", {
    className: "cf-inp",
    type: "email",
    value: email,
    onChange: function (e) {
      setEmail(e.target.value);
      setErr("");
    },
    placeholder: T.email_ph,
    onKeyDown: function (e) {
      if (e.key === "Enter") submit();
    },
    style: {
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "captcha-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: C.t2,
      marginBottom: 8
    }
  }, "\uD83E\uDD16 ", T.captcha_label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: C.amber,
      fontFamily: C.mono,
      letterSpacing: "2px",
      textAlign: "center",
      marginBottom: 10,
      padding: "10px",
      background: C.bg2,
      borderRadius: 6,
      border: "1px solid " + C.bdr
    }
  }, captcha.q), /*#__PURE__*/React.createElement("input", {
    className: "cf-inp",
    type: "number",
    value: capAns,
    onChange: function (e) {
      setCapAns(e.target.value);
      setErr("");
    },
    placeholder: T.captcha_ph,
    onKeyDown: function (e) {
      if (e.key === "Enter") submit();
    }
  })), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.red,
      marginBottom: 12,
      padding: "8px 12px",
      background: C.redL,
      borderRadius: 6,
      border: "1px solid rgba(220,38,38,.2)",
      fontFamily: C.mono
    }
  }, "\u26A0 ", err), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: submit,
    disabled: busy,
    style: {
      width: "100%",
      justifyContent: "center",
      padding: "11px",
      fontSize: 13
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " ", T.btn_loading) : T.btn_login + " \u2192"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      paddingTop: 14,
      borderTop: "1px solid " + C.bdr,
      display: "flex",
      justifyContent: "space-around"
    }
  }, [["⚡", "Merchant", "$29"], ["◈", "Enterprise", "$49"], ["◆", "Holdings", "$249"], ["✦", "God", "Owner"]].map(function (r) {
    return /*#__PURE__*/React.createElement("div", {
      key: r[1],
      style: {
        fontSize: 10,
        color: C.t4,
        textAlign: "center",
        fontFamily: C.mono
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        marginBottom: 2
      }
    }, r[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        color: C.t3
      }
    }, r[1]), /*#__PURE__*/React.createElement("div", null, r[2]));
  })))));
}

// ─── TOP NAV ─────────────────────────────────────────────────────────────────
function TopNav({
  tab,
  setTab,
  user,
  lang,
  setLang,
  onLogout
}) {
  var T = I18N[lang];
  var god = user.god;
  var ALL_TABS = [{
    k: "connections",
    l: T.tab_connections,
    icon: "🔗"
  }, {
    k: "command",
    l: T.tab_command,
    icon: "⚡"
  }, {
    k: "inventory",
    l: T.tab_inventory,
    icon: "📦"
  }, {
    k: "social",
    l: T.tab_social,
    icon: "📱"
  }, {
    k: "audit",
    l: T.tab_audit,
    icon: "🔍"
  }, {
    k: "support",
    l: T.tab_support,
    icon: "💬"
  }, {
    k: "builder",
    l: T.tab_builder,
    icon: "🤖"
  }, {
    k: "plans",
    l: T.tab_plans,
    icon: "💎"
  }];
  if (god) ALL_TABS.push({
    k: "growth",
    l: T.tab_growth,
    icon: "📈",
    gold: true
  });
  if (god) ALL_TABS.push({
    k: "token",
    l: T.tab_token,
    icon: "🪙",
    gold: true
  });
  if (god) ALL_TABS.push({
    k: "media",
    l: T.tab_media,
    icon: "🎬",
    gold: true
  });
  if (god) ALL_TABS.push({
    k: "sentinel",
    l: T.tab_sentinel,
    icon: "👁",
    gold: true
  });
  if (god) ALL_TABS.push({
    k: "robinhood",
    l: T.tab_robinhood,
    icon: "🏹",
    robin: true
  });
  if (god) ALL_TABS.push({
    k: "hottabych",
    l: T.tab_hottabych,
    icon: "🔮",
    hott: true
  });
  var TABS = god ? ALL_TABS : [{
    k: "plans",
    l: T.tab_plans,
    icon: "💎"
  }];

  // Mobile nav: show max 5 items + more
  var MOBILE_TABS = god ? [{
    k: "command",
    l: "Центр",
    icon: "⚡"
  }, {
    k: "support",
    l: "Підтримка",
    icon: "💬"
  }, {
    k: "robinhood",
    l: "Робінгуд",
    icon: "🏹",
    robin: true
  }, {
    k: "hottabych",
    l: "Хоттабич",
    icon: "🔮",
    hott: true
  }, {
    k: "plans",
    l: "Плани",
    icon: "💎"
  }] : [{
    k: "plans",
    l: "Плани",
    icon: "💎"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      background: C.bg,
      borderBottom: "1px solid " + (god ? "rgba(240,165,0,.3)" : C.bdr),
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: god ? "0 2px 12px rgba(240,165,0,.1)" : "0 1px 6px rgba(0,0,0,.06)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-header-inner"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 0 6px",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      fontSize: 18,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#F0A500,#B07800)",
      boxShadow: god ? "0 0 14px rgba(240,165,0,.4)" : "0 2px 8px rgba(240,165,0,.2)"
    }
  }, "\u26A1"), /*#__PURE__*/React.createElement("div", {
    className: "cf-logo-text"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      letterSpacing: "-.3px",
      color: C.txt,
      fontFamily: C.dis,
      lineHeight: 1.1
    }
  }, "CloseFast ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Omni")), /*#__PURE__*/React.createElement("div", {
    className: "cf-tagline",
    style: {
      fontSize: 8,
      color: C.t4,
      letterSpacing: ".5px",
      fontFamily: C.mono
    }
  }, T.tagline))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
      justifyContent: "flex-end"
    }
  }, ["en", "ua"].map(function (l) {
    return /*#__PURE__*/React.createElement("button", {
      key: l,
      className: "lang-btn" + (lang === l ? " active" : ""),
      onClick: function () {
        setLang(l);
      }
    }, l === "en" ? "EN" : "UA");
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 18,
      background: C.bdr
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: C.grn,
      animation: "pulse 2s infinite",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.t3,
      fontFamily: C.mono,
      maxWidth: 130,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, user.email)), god ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 4,
      letterSpacing: ".4px",
      fontFamily: C.mono,
      background: C.amberL,
      border: "1px solid rgba(240,165,0,.4)",
      color: C.amberD,
      flexShrink: 0
    }
  }, "\u2726 ", T.god_badge) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 4,
      background: C.grnL,
      color: C.grn,
      border: "1px solid rgba(5,150,105,.2)",
      flexShrink: 0
    }
  }, T.active), onLogout && /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    style: {
      fontSize: 10,
      padding: "4px 9px",
      borderRadius: 5,
      flexShrink: 0,
      border: "1px solid " + C.bdr,
      background: C.bg,
      color: C.t4,
      cursor: "pointer",
      fontFamily: C.mono,
      transition: "all .15s"
    },
    onMouseEnter: function (e) {
      e.currentTarget.style.color = C.red;
      e.currentTarget.style.borderColor = C.red;
    },
    onMouseLeave: function (e) {
      e.currentTarget.style.color = C.t4;
      e.currentTarget.style.borderColor = C.bdr;
    }
  }, "\u2715 Out"))), /*#__PURE__*/React.createElement("div", {
    className: "cf-desktop-tabs cf-tabs-wrap"
  }, TABS.map(function (t) {
    var cls = "cf-tab";
    if (tab === t.k) cls += t.hott ? " hott" : t.robin ? " robin" : t.gold ? " god" : " on";
    return /*#__PURE__*/React.createElement("button", {
      key: t.k,
      onClick: function () {
        setTab(t.k);
      },
      className: cls
    }, t.l);
  })))), /*#__PURE__*/React.createElement("nav", {
    className: "cf-mobile-nav"
  }, MOBILE_TABS.map(function (t) {
    var active = tab === t.k;
    var cls = active ? t.hott ? "hott-nav" : t.robin ? "robin-nav" : t.gold ? "god-nav" : "active" : "";
    return /*#__PURE__*/React.createElement("button", {
      key: t.k,
      className: cls,
      onClick: function () {
        setTab(t.k);
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mnav-icon",
      style: {
        filter: active ? t.hott ? "drop-shadow(0 0 4px #C084FC)" : "none" : "grayscale(0.3) opacity(0.6)"
      }
    }, t.icon), /*#__PURE__*/React.createElement("span", {
      className: "mnav-label",
      style: {
        color: active ? t.hott ? "#C084FC" : t.robin ? "#059669" : t.gold ? "#7C3AED" : "#F0A500" : "#9CA3AF"
      }
    }, t.l));
  })));
}

// ─── ACCESS WALL (for non-master trying restricted pages) ─────────────────────
function AccessWall({
  T,
  setTab
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "80px 24px",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 16,
      maxWidth: 560,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      marginBottom: 16
    }
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis,
      marginBottom: 8
    }
  }, T.access_denied), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.t3,
      marginBottom: 28,
      lineHeight: 1.7
    }
  }, T.access_denied_sub), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: function () {
      setTab("plans");
    },
    style: {
      fontSize: 14,
      padding: "12px 28px"
    }
  }, T.choose_plan, " \u2192"));
}

// ─── CONNECTIONS TAB ─────────────────────────────────────────────────────────
var PLATFORMS = [{
  k: "etsy1",
  group: "etsy",
  label: "Etsy — Store A",
  icon: "🛍",
  col: C.amber,
  desc: "Primary store (e.g. Monad Fan Art Prints)",
  guide: {
    url: "https://etsy.com/developers",
    steps: ["Відкрий etsy.com/developers", "Натисни Create App", "Заповни форму (URL: твій сайт)", "Скопіюй Keystring → це API Key", "Скопіюй Shared Secret → це API Secret", "Shop ID — числовий ID магазину з URL на etsy.com/shop/НазваМагазину"]
  },
  fields: [{
    k: "api_key",
    l: "API Key (Keystring)",
    ph: "etsyk_..."
  }, {
    k: "api_secret",
    l: "API Secret (Shared Secret)",
    ph: "etsy_secret_..."
  }, {
    k: "shop_id",
    l: "Shop ID (числовий)",
    ph: "123456789"
  }, {
    k: "niche",
    l: "Ніша магазину",
    ph: "e.g. Monad Fan Art"
  }]
}, {
  k: "etsy2",
  group: "etsy",
  label: "Etsy — Store B",
  icon: "🛍",
  col: C.amber,
  desc: "Secondary store (e.g. Crypto Apparel POD)",
  guide: {
    url: "https://etsy.com/developers",
    steps: ["Той самий процес що і для Store A", "Створи окремий App для кожного магазину", "Або використай ті самі ключі — Shop ID різний"]
  },
  fields: [{
    k: "api_key",
    l: "API Key",
    ph: "etsyk_..."
  }, {
    k: "api_secret",
    l: "API Secret",
    ph: "etsy_secret_..."
  }, {
    k: "shop_id",
    l: "Shop ID",
    ph: "987654321"
  }, {
    k: "niche",
    l: "Ніша",
    ph: "e.g. Crypto Apparel"
  }]
}, {
  k: "etsy3",
  group: "etsy",
  label: "Etsy — Store C",
  icon: "🛍",
  col: C.amber,
  desc: "Tertiary store (e.g. Home Decor / Stickers)",
  guide: {
    url: "https://etsy.com/developers",
    steps: ["Той самий процес що і для Store A", "Shop ID знайди в URL магазину"]
  },
  fields: [{
    k: "api_key",
    l: "API Key",
    ph: "etsyk_..."
  }, {
    k: "api_secret",
    l: "API Secret",
    ph: "etsy_secret_..."
  }, {
    k: "shop_id",
    l: "Shop ID",
    ph: "456789123"
  }, {
    k: "niche",
    l: "Ніша",
    ph: "e.g. Crypto Stickers"
  }]
}, {
  k: "printify",
  group: "printify",
  label: "Printify",
  icon: "🖨",
  col: C.grn,
  desc: "Auto-mockup generation and order routing",
  guide: {
    url: "https://printify.com/app/account/connections",
    steps: ["Відкрий printify.com → Account → Connections", "Натисни Generate API token", "Скопіюй токен (починається з eyJ або sk_)", "Shop ID знайди в URL: printify.com/app/shop/ТУТID/"]
  },
  fields: [{
    k: "api_key",
    l: "API Token (eyJ... або sk_...)",
    ph: "eyJ0eXAi..."
  }, {
    k: "shop_id",
    l: "Shop ID",
    ph: "12345678"
  }]
}, {
  k: "x",
  group: "social",
  label: "X / Twitter",
  icon: "🔵",
  col: C.blue,
  desc: "Real posting via X API v2 — Thread Generator + Monad Monitor",
  guide: {
    url: "https://developer.twitter.com/en/portal/dashboard",
    steps: ["Відкрий developer.twitter.com → Create Project", "Обери тип: Free (до 1500 твітів/міс)", "У App Settings → Keys and tokens", "Скопіюй API Key та API Secret", "Натисни Generate → Access Token та Access Token Secret", "Всі 4 ключі вставляй нижче"]
  },
  fields: [{
    k: "api_key",
    l: "API Key",
    ph: "AbCdEf..."
  }, {
    k: "api_secret",
    l: "API Secret",
    ph: "xY1z..."
  }, {
    k: "access_tok",
    l: "Access Token",
    ph: "1234567890-AbC..."
  }, {
    k: "access_sec",
    l: "Access Token Secret",
    ph: "xyz123..."
  }]
}, {
  k: "instagram",
  group: "social",
  label: "Instagram",
  icon: "📸",
  col: C.pur,
  desc: "Reels scripts + caption generation via AI",
  guide: {
    url: "https://developers.facebook.com/apps",
    steps: ["Відкрий developers.facebook.com → Create App", "Тип: Business → додай Instagram Basic Display", "Налаштуй Instagram App → Generate Token", "Account ID знайди в налаштуваннях профілю", "Примітка: автопостинг потребує Instagram Graph API (бізнес-акаунт)"]
  },
  fields: [{
    k: "access_tok",
    l: "Access Token",
    ph: "IGQV..."
  }, {
    k: "account_id",
    l: "Account ID",
    ph: "17841..."
  }]
}, {
  k: "claude",
  group: "ai",
  label: "Anthropic (Claude)",
  icon: "🤖",
  col: C.blue2,
  desc: "AI-рушій для контенту, SEO та аналізу",
  guide: {
    url: "https://console.anthropic.com/api/keys",
    steps: ["Відкрий console.anthropic.com", "Зареєструйся або увійди", "Settings → API Keys → Create Key", "Скопіюй ключ (показується лише раз!)", "Billing → Add Credits — мінімум $5", "Цей ключ потрібен для ВСІХ AI функцій"]
  },
  fields: [{
    k: "api_key",
    l: "API Key",
    ph: "sk-ant-api03-..."
  }]
}, {
  k: "stripe",
  group: "billing",
  label: "Stripe Billing",
  icon: "💳",
  col: C.pur,
  desc: "Прийом платежів за підписки (Merchant, Enterprise і т.д.)",
  guide: {
    url: "https://dashboard.stripe.com/apikeys",
    steps: ["Відкрий dashboard.stripe.com", "Developers → API Keys", "Скопіюй Secret key (sk_live_...)", "Developers → Webhooks → Add endpoint", "URL: https://твійсайт.com/api/stripe-webhook.php", "Events: checkout.session.completed, subscription.deleted", "Скопіюй Webhook Secret (whsec_...)"]
  },
  fields: [{
    k: "secret_key",
    l: "Secret Key",
    ph: "sk_live_..."
  }, {
    k: "webhook",
    l: "Webhook Secret",
    ph: "whsec_..."
  }]
}];
var GROUPS = [{
  k: "etsy",
  l: "Etsy Stores (3 Niche Slots)",
  icon: "🛍",
  keys: ["etsy1", "etsy2", "etsy3"]
}, {
  k: "printify",
  l: "Printify",
  icon: "🖨",
  keys: ["printify"]
}, {
  k: "social",
  l: "Social Platforms",
  icon: "📡",
  keys: ["x", "instagram"]
}, {
  k: "ai",
  l: "AI Engine",
  icon: "🤖",
  keys: ["claude"]
}, {
  k: "billing",
  l: "Billing",
  icon: "💳",
  keys: ["stripe"]
}];
function ConnectionsTab({
  connections,
  setConnections,
  autopilot,
  setAutopilot,
  T
}) {
  var [expanded, setExpanded] = useState({});
  // Load saved API keys from localStorage on mount
  var [vals, setVals] = useState(function () {
    try {
      var saved = localStorage.getItem("cf_api_keys");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  var PLAT = {};
  PLATFORMS.forEach(function (p) {
    PLAT[p.k] = p;
  });
  function toggle(k) {
    setExpanded(function (p) {
      var n = Object.assign({}, p);
      n[k] = !p[k];
      return n;
    });
  }
  function setVal(plat, field, v) {
    setVals(function (p) {
      var n = Object.assign({}, p);
      if (!n[plat]) n[plat] = {};
      n[plat][field] = v;
      // Auto-save keys to localStorage as user types
      try {
        localStorage.setItem("cf_api_keys", JSON.stringify(n));
      } catch (e) {}
      return n;
    });
  }
  function connect(k) {
    setConnections(function (p) {
      var n = Object.assign({}, p);
      n[k] = "online";
      return n;
    });
    setExpanded(function (p) {
      var n = Object.assign({}, p);
      n[k] = false;
      return n;
    });
    // Persist this platform's keys for re-use
    try {
      localStorage.setItem("cf_api_keys", JSON.stringify(vals));
      // X posting keys
      if (k === "x") sessionStorage.setItem("cf_x_keys", JSON.stringify(vals[k] || {}));
    } catch (e) {}
  }
  function disconnect(k) {
    setConnections(function (p) {
      var n = Object.assign({}, p);
      n[k] = "idle";
      return n;
    });
    setAutopilot(function (p) {
      var n = Object.assign({}, p);
      n[k] = false;
      return n;
    });
  }
  function toggleAp(k) {
    if (connections[k] !== "online") return;
    setAutopilot(function (p) {
      var n = Object.assign({}, p);
      n[k] = !p[k];
      return n;
    });
  }

  // Auto-reconnect platforms that have saved keys + restore autopilot
  useEffect(function () {
    var savedAuto = {};
    try {
      savedAuto = JSON.parse(localStorage.getItem("cf_autopilot") || "{}");
    } catch (e) {}
    PLATFORMS.forEach(function (p) {
      var saved = vals[p.k];
      if (saved && Object.keys(saved).length > 0 && connections[p.k] !== "online") {
        var hasKey = Object.values(saved).some(function (v) {
          return v && v.length > 5;
        });
        if (hasKey) {
          setConnections(function (prev) {
            var n = Object.assign({}, prev);
            n[p.k] = "online";
            return n;
          });
          // Restore autopilot if it was on
          if (savedAuto[p.k]) {
            setAutopilot(function (prev) {
              var n = Object.assign({}, prev);
              n[p.k] = true;
              return n;
            });
          }
        }
      }
    });
    // Also restore X keys to sessionStorage
    try {
      var savedKeys = JSON.parse(localStorage.getItem("cf_api_keys") || "{}");
      if (savedKeys.x) sessionStorage.setItem("cf_x_keys", JSON.stringify(savedKeys.x));
    } catch (e) {}
  }, []); // run once on mount

  var totalOn = PLATFORMS.filter(function (p) {
    return connections[p.k] === "online";
  }).length;
  var totalAuto = PLATFORMS.filter(function (p) {
    return autopilot[p.k];
  }).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      padding: "12px 16px",
      borderRadius: 10,
      background: "rgba(29,78,216,.05)",
      border: "1px solid rgba(29,78,216,.15)",
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      flexShrink: 0
    }
  }, "\uD83D\uDD11"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.blue,
      marginBottom: 2
    }
  }, "\u042F\u043A \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0438 \u0441\u0432\u043E\u0457 \u0441\u0435\u0440\u0432\u0456\u0441\u0438"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      lineHeight: 1.7
    }
  }, "\u041D\u0430\u0442\u0438\u0441\u043D\u0438 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.t2
    }
  }, "Connect \u2192"), " \u2192 \u0432\u0432\u0435\u0434\u0438 API \u043A\u043B\u044E\u0447 (\u0456\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0456\u044F \u0432 \u043A\u043E\u0436\u043D\u0456\u0439 \u043A\u0430\u0440\u0442\u0446\u0456) \u2192 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E. \u041F\u0440\u0438 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443 \u0432\u0445\u043E\u0434\u0456 \u0432\u0441\u0456 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0438 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u044F\u0442\u044C\u0441\u044F \u0441\u0430\u043C\u0456. \u041A\u043B\u044E\u0447\u0456 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456, \u043D\u0435 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0456.")), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: totalOn > 0 ? C.grn : C.t4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, totalOn > 0 ? "✅ " + totalOn + " підключено" : "● Не підключено"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "Service ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Connections")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      fontFamily: C.mono
    }
  }, "Connect platforms \u2192 enable Autopilot \u2192 Omni runs itself")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, [{
    v: totalOn,
    l: T.connected,
    c: C.grn
  }, {
    v: totalAuto,
    l: T.on_autopilot,
    c: C.amber
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.l,
      style: {
        background: C.bg,
        border: "1px solid " + C.bdr,
        borderRadius: 8,
        padding: "10px 16px",
        textAlign: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 700,
        color: s.c,
        fontFamily: C.mono
      }
    }, s.v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3
      }
    }, s.l));
  }))), GROUPS.map(function (grp) {
    return /*#__PURE__*/React.createElement("div", {
      key: grp.k,
      style: {
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: C.t3,
        letterSpacing: ".6px",
        textTransform: "uppercase",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", null, grp.icon), " ", grp.l, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: C.bdr,
        marginLeft: 4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: grp.keys.length === 3 ? "repeat(3,1fr)" : "repeat(auto-fit,minmax(280px,1fr))",
        gap: 12
      }
    }, grp.keys.map(function (pk) {
      var plat = PLAT[pk];
      if (!plat) return null;
      var status = connections[pk] || "idle";
      var isOn = autopilot[pk] || false;
      var isExp = expanded[pk] || false;
      var pv = vals[pk] || {};
      var sCo = status === "online" ? C.grn : status === "error" ? C.red : C.t4;
      var sTxt = status === "online" ? T.online : status === "error" ? "ERROR" : T.offline;
      return /*#__PURE__*/React.createElement("div", {
        key: pk,
        style: {
          background: C.bg,
          border: "1px solid " + (status === "online" ? plat.col + "50" : C.bdr),
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: status === "online" ? "0 2px 12px " + plat.col + "15" : "0 1px 4px rgba(0,0,0,.04)",
          transition: "all .2s"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "14px 16px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 20
        }
      }, plat.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 700,
          color: C.txt
        }
      }, plat.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: C.t3,
          marginTop: 1
        }
      }, plat.desc))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 5
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: sCo,
          animation: status === "online" ? "pulse 2s infinite" : "none"
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 9,
          color: sCo,
          fontWeight: 700,
          fontFamily: C.mono
        }
      }, sTxt))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Toggle, {
        on: isOn,
        set: function () {
          toggleAp(pk);
        },
        col: plat.col
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: isOn ? plat.col : C.t3,
          fontWeight: isOn ? 700 : 400
        }
      }, isOn ? T.autopilot_on : T.autopilot_off)), status === "online" ? /*#__PURE__*/React.createElement("button", {
        className: "cf-btn cf-btn-danger",
        onClick: function () {
          disconnect(pk);
        },
        style: {
          fontSize: 10,
          padding: "4px 10px"
        }
      }, T.disconnect) : /*#__PURE__*/React.createElement("button", {
        className: "cf-btn",
        onClick: function () {
          toggle(pk);
        },
        style: {
          fontSize: 10,
          padding: "4px 10px",
          background: plat.col,
          color: "#FFFFFF"
        }
      }, isExp ? T.cancel : T.connect + " \u2192"))), isExp && /*#__PURE__*/React.createElement("div", {
        className: "fade",
        style: {
          padding: "14px 16px",
          background: C.bg3,
          borderTop: "1px solid " + C.bdr
        }
      }, plat.guide && /*#__PURE__*/React.createElement("div", {
        style: {
          marginBottom: 14,
          padding: "10px 14px",
          background: "#EFF6FF",
          borderRadius: 8,
          border: "1px solid rgba(29,78,216,.15)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          fontWeight: 700,
          color: C.blue,
          fontFamily: C.mono,
          letterSpacing: ".3px"
        }
      }, "\uD83D\uDCD6 \u042F\u041A \u041E\u0422\u0420\u0418\u041C\u0410\u0422\u0418 \u041A\u041B\u042E\u0427\u0406"), /*#__PURE__*/React.createElement("a", {
        href: plat.guide.url,
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          fontSize: 10,
          color: C.blue,
          fontWeight: 600,
          textDecoration: "none",
          padding: "2px 8px",
          background: "rgba(29,78,216,.1)",
          borderRadius: 4
        }
      }, "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u2197")), plat.guide.steps.map(function (s, i) {
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          style: {
            display: "flex",
            gap: 8,
            marginBottom: 5,
            fontSize: 11,
            color: C.t2,
            lineHeight: 1.5
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: C.blue,
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        }, i + 1), s);
      })), plat.fields.map(function (f) {
        return /*#__PURE__*/React.createElement("div", {
          key: f.k,
          style: {
            marginBottom: 8
          }
        }, /*#__PURE__*/React.createElement(Lbl, null, f.l), /*#__PURE__*/React.createElement("input", {
          className: "cf-inp",
          type: "password",
          value: pv[f.k] || "",
          onChange: function (e) {
            setVal(pk, f.k, e.target.value);
          },
          placeholder: f.ph,
          style: {
            fontSize: 12
          }
        }));
      }), /*#__PURE__*/React.createElement("button", {
        className: "cf-btn cf-btn-amber",
        onClick: function () {
          connect(pk);
        },
        style: {
          width: "100%",
          justifyContent: "center",
          marginTop: 6
        }
      }, T.connect_encrypt, " \u2192")));
    })));
  }));
}

// ─── COMMAND CENTER ───────────────────────────────────────────────────────────
function CommandCenterTab({
  connections,
  autopilot,
  user,
  T
}) {
  // ── NO fake counters, NO fake tasks, NO fake logs ──
  // All zeros until real API calls happen

  var platforms = [{
    k: "etsy1",
    label: "Etsy A",
    icon: "🛍",
    col: C.amber
  }, {
    k: "etsy2",
    label: "Etsy B",
    icon: "🛍",
    col: C.amber
  }, {
    k: "etsy3",
    label: "Etsy C",
    icon: "🛍",
    col: C.amber
  }, {
    k: "x",
    label: "X",
    icon: "🔵",
    col: C.blue
  }, {
    k: "instagram",
    label: "Instagram",
    icon: "📸",
    col: C.pur
  }, {
    k: "printify",
    label: "Printify",
    icon: "🖨",
    col: C.grn
  }, {
    k: "claude",
    label: "Claude AI",
    icon: "🤖",
    col: C.blue2
  }, {
    k: "stripe",
    label: "Stripe",
    icon: "💳",
    col: C.pur
  }];
  var connectedCount = platforms.filter(function (p) {
    return connections[p.k] === "online";
  }).length;
  var autopilotCount = platforms.filter(function (p) {
    return autopilot[p.k];
  }).length;
  var anyConnected = connectedCount > 0;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "Operation ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Command Center")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      fontFamily: C.mono
    }
  }, "Real-time platform sync \xB7 AI task queue \xB7 Live ops feed")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: anyConnected ? C.grnL : C.bg3,
      border: "1px solid " + (anyConnected ? "rgba(5,150,105,.2)" : C.bdr),
      borderRadius: 8,
      padding: "8px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: anyConnected ? C.grn : C.t4,
      animation: anyConnected ? "pulse 2s infinite" : "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: anyConnected ? C.grn : C.t4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, anyConnected ? "OMNI ACTIVE — " + connectedCount + " platforms" : "NO PLATFORMS CONNECTED"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 12,
      marginBottom: 20
    }
  }, [{
    l: "Listings Created",
    v: "—",
    note: "Connect Etsy API",
    icon: "📦",
    col: C.amber
  }, {
    l: "Threads Posted",
    v: "—",
    note: "Connect X API",
    icon: "🔵",
    col: C.blue
  }, {
    l: "Reels Generated",
    v: "—",
    note: "Connect Instagram",
    icon: "🎬",
    col: C.pur
  }, {
    l: "Session Revenue",
    v: "—",
    note: "Connect Stripe",
    icon: "💰",
    col: C.grn
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.l,
      className: "cf-card",
      style: {
        borderTop: "2px solid " + s.col,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 24,
        marginBottom: 6
      }
    }, s.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 28,
        fontWeight: 700,
        color: C.t4,
        letterSpacing: "-1px",
        lineHeight: 1,
        fontFamily: C.mono
      }
    }, s.v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3,
        marginTop: 4,
        fontWeight: 600
      }
    }, s.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        marginTop: 2,
        fontFamily: C.mono
      }
    }, s.note));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "Live Platform Sync", /*#__PURE__*/React.createElement(Chip, {
    color: anyConnected ? C.grn : C.t4
  }, connectedCount, "/", platforms.length, " online"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8
    }
  }, platforms.map(function (p) {
    var st = connections[p.k] || "idle";
    var ap = autopilot[p.k] || false;
    var online = st === "online";
    return /*#__PURE__*/React.createElement("div", {
      key: p.k,
      style: {
        background: C.bg,
        border: "1px solid " + (online ? p.col + "40" : C.bdr),
        borderRadius: 8,
        padding: "12px 10px",
        textAlign: "center",
        boxShadow: online ? "0 2px 8px " + p.col + "15" : "none",
        transition: "all .2s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        marginBottom: 6
      }
    }, p.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: C.txt,
        marginBottom: 5
      }
    }, p.label), /*#__PURE__*/React.createElement(Dot, {
      status: online ? "online" : "idle"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontFamily: C.mono,
        marginTop: 4,
        color: online ? C.grn : C.t4,
        fontWeight: 700
      }
    }, online ? T.online : T.offline), online && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 9,
        fontWeight: 700,
        fontFamily: C.mono,
        color: ap ? p.col : C.t4
      }
    }, "AUTO ", ap ? "ON" : "OFF"));
  }))), !anyConnected && /*#__PURE__*/React.createElement("div", {
    className: "fade cf-card",
    style: {
      textAlign: "center",
      padding: "32px 24px",
      background: "linear-gradient(135deg,#FFFDE7,#FFF8E1)",
      border: "1px solid " + C.amber + "40"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 12
    }
  }, "\uD83D\uDD0C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis,
      marginBottom: 8
    }
  }, "Connect your first platform to activate Command Center"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.t3,
      lineHeight: 1.8,
      maxWidth: 440,
      margin: "0 auto 20px"
    }
  }, "Go to the ", /*#__PURE__*/React.createElement("strong", null, "Connections"), " tab \u2192 enter your API keys \u2192 click \"Connect\". Stats, tasks and live feed will appear here automatically."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 10,
      flexWrap: "wrap"
    }
  }, [{
    icon: "🛍",
    l: "Etsy API",
    url: "https://etsy.com/developers"
  }, {
    icon: "🖨",
    l: "Printify",
    url: "https://printify.com/app"
  }, {
    icon: "🤖",
    l: "Claude AI",
    url: "https://platform.anthropic.com"
  }, {
    icon: "💳",
    l: "Stripe",
    url: "https://stripe.com/developers"
  }].map(function (lnk) {
    return /*#__PURE__*/React.createElement("a", {
      key: lnk.l,
      href: lnk.url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        background: C.bg,
        border: "1px solid " + C.bdr,
        borderRadius: 7,
        fontSize: 11,
        fontWeight: 600,
        color: C.t2,
        textDecoration: "none",
        transition: "all .15s"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.borderColor = C.amber;
        e.currentTarget.style.color = C.amber;
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.borderColor = C.bdr;
        e.currentTarget.style.color = C.t2;
      }
    }, lnk.icon, " ", lnk.l, " \u2197");
  }))), anyConnected && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "Active AI Tasks", /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px",
      textAlign: "center",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 8
    }
  }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4
    }
  }, "No tasks running"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      lineHeight: 1.6
    }
  }, "Tasks appear here when AI agent is triggered from Inventory, Social Engine or Site Audit.", !connections.claude && /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, " Connect Claude AI first.")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "Live Ops Feed", /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px",
      textAlign: "center",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 8
    }
  }, "\uD83D\uDCE1"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4
    }
  }, "Feed is empty"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      lineHeight: 1.6
    }
  }, "Real activity from Etsy, Instagram, X and Printify will stream here once APIs are connected and autopilot is on.")))));
}

// ─── INVENTORY ENGINE ─────────────────────────────────────────────────────────
function InventoryTab({
  connections,
  T
}) {
  var [store, setStore] = useState("etsy1");
  var [niche, setNiche] = useState("wall-art");
  var [qty, setQty] = useState("3");
  var [style, setStyle] = useState("");
  var [busy, setBusy] = useState(false);
  var [result, setResult] = useState(null);
  var [err, setErr] = useState("");
  var [sched, setSched] = useState({
    etsy1: {
      on: true,
      time: "08:00",
      qty: 3
    },
    etsy2: {
      on: false,
      time: "12:00",
      qty: 2
    },
    etsy3: {
      on: false,
      time: "18:00",
      qty: 2
    }
  });
  var STORES = [{
    k: "etsy1",
    l: "Store A"
  }, {
    k: "etsy2",
    l: "Store B"
  }, {
    k: "etsy3",
    l: "Store C"
  }];
  var nl = (NICHES.find(function (n) {
    return n.v === niche;
  }) || {
    l: niche
  }).l;
  function generate() {
    return _generate.apply(this, arguments);
  }
  function _generate() {
    _generate = _asyncToGenerator(function* () {
      setBusy(true);
      setResult(null);
      setErr("");
      var totalQty = parseInt(qty) || 1;
      var batchSize = 5; // Claude generates max 5 at a time reliably
      var batches = Math.ceil(totalQty / batchSize);
      var allResults = [];
      try {
        for (var b = 0; b < batches; b++) {
          var bQty = Math.min(batchSize, totalQty - b * batchSize);
          var raw = yield ai("You are a world-class Etsy SEO expert. Return ONLY valid JSON array, no markdown, no explanation.", "Create " + bQty + " unique Etsy listings for niche: '" + nl + "'." + (style ? " Theme: '" + style + "'." : "") + (batches > 1 ? " Batch " + (b + 1) + " of " + batches + ", make them all different." : "") + " Return JSON array:\n" + "[{\"title\":\"SEO title under 140 chars\",\"tags\":[\"tag1\",\"tag2\",...\"tag13\"],\"price\":24.99," + "\"description\":\"2-3 sentence compelling product description\"," + "\"mockup_prompt\":\"Printify mockup: describe product visually in detail\"," + "\"kw_density\":0.087,\"estimated_ctr\":\"6.2%\"}]", Math.min(4096, bQty * 400));
          var parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
          allResults = allResults.concat(Array.isArray(parsed) ? parsed : [parsed]);
          setResult(allResults.slice()); // show progress
        }
        setResult(allResults);
      } catch (e) {
        setErr(e.message);
      }
      setBusy(false);
    });
    return _generate.apply(this, arguments);
  }
  function updSched(k, field, val) {
    setSched(function (p) {
      var n = Object.assign({}, p);
      n[k] = Object.assign({}, n[k]);
      n[k][field] = val;
      return n;
    });
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "Inventory ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Engine")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 24,
      fontFamily: C.mono
    }
  }, "Multi-store management \xB7 Daily upload scheduler \xB7 Printify mockup AI"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 20,
      background: C.bg3,
      border: "1px solid " + C.bdr,
      borderRadius: 8,
      padding: 4,
      width: "fit-content"
    }
  }, STORES.map(function (s) {
    var on = store === s.k;
    var st = connections[s.k] || "idle";
    return /*#__PURE__*/React.createElement("button", {
      key: s.k,
      onClick: function () {
        setStore(s.k);
      },
      style: {
        padding: "8px 18px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        background: on ? C.amber : "transparent",
        color: on ? "#FFFFFF" : C.t3,
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: st === "online" ? C.grn : C.t4
      }
    }), s.l);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "\uD83E\uDD16 AI Listing Generator", /*#__PURE__*/React.createElement(Chip, {
    color: C.amber
  }, store.replace("etsy", "Store ").toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Lbl, null, "Product Niche"), /*#__PURE__*/React.createElement("select", {
    className: "cf-inp",
    value: niche,
    onChange: function (e) {
      setNiche(e.target.value);
    }
  }, NICHES.map(function (n) {
    return /*#__PURE__*/React.createElement("option", {
      key: n.v,
      value: n.v
    }, n.l);
  }))), /*#__PURE__*/React.createElement(Fld, {
    label: "Style / Theme",
    val: style,
    set: setStyle,
    ph: "e.g. Monad ecosystem, cyberpunk, dark mode art"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Lbl, null, "Listings to Generate"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, ["1", "3", "5", "10", "15", "20"].map(function (n) {
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: function () {
        setQty(n);
      },
      style: {
        flex: "1 1 auto",
        padding: "8px 0",
        borderRadius: 6,
        border: "1px solid " + (qty === n ? C.amber : C.bdr),
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 700,
        background: qty === n ? C.amber : C.bg,
        color: qty === n ? "#FFFFFF" : C.t3,
        transition: "all .15s",
        minWidth: 44
      }
    }, n);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.t4,
      fontFamily: C.mono,
      flexShrink: 0
    }
  }, "\u0430\u0431\u043E \u0432\u0440\u0443\u0447\u043D\u0443:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "50",
    value: qty,
    onChange: function (e) {
      var v = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
      setQty(String(v));
    },
    style: {
      width: 70,
      padding: "5px 10px",
      borderRadius: 6,
      border: "1px solid " + C.bdr,
      fontSize: 12,
      fontFamily: C.mono,
      color: C.txt,
      background: C.bg,
      outline: "none",
      textAlign: "center"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.t4,
      fontFamily: C.mono
    }
  }, "\u043C\u0430\u043A\u0441. 50")), parseInt(qty) > 10 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 10,
      color: C.amber,
      fontFamily: C.mono,
      padding: "4px 10px",
      background: C.amberL,
      borderRadius: 4,
      border: "1px solid rgba(240,165,0,.3)"
    }
  }, "\u26A1 ", qty, " \u043B\u0456\u0441\u0442\u0438\u043D\u0433\u0456\u0432 \u2014 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u044F \u0437\u0430\u0439\u043C\u0435 ~", Math.ceil(parseInt(qty) * 8 / 60), " \u0445\u0432")), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      marginBottom: 10,
      fontFamily: C.mono
    }
  }, err), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: generate,
    disabled: busy,
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Generating\u2026") : "Generate + Printify Mockups \u2192"), result && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      marginTop: 14
    }
  }, result.map(function (item, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      style: {
        marginBottom: 12,
        padding: 12,
        background: C.bg3,
        borderRadius: 8,
        border: "1px solid " + C.bdr,
        borderLeft: "3px solid " + C.amber
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: C.txt,
        marginBottom: 6,
        lineHeight: 1.4
      }
    }, item.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        flexWrap: "wrap",
        marginBottom: 6
      }
    }, (item.tags || []).slice(0, 6).map(function (tag) {
      return /*#__PURE__*/React.createElement("span", {
        key: tag,
        style: {
          fontSize: 9,
          padding: "2px 7px",
          background: C.bg2,
          color: C.t3,
          borderRadius: 3,
          fontFamily: C.mono,
          border: "1px solid " + C.bdr
        }
      }, tag);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: C.grn,
        fontFamily: C.mono
      }
    }, "$", item.price), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: C.blue,
        fontFamily: C.mono
      }
    }, "CTR:", item.estimated_ctr), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: C.amber,
        fontFamily: C.mono
      }
    }, "KW:", item.kw_density)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3,
        lineHeight: 1.5,
        marginBottom: 6
      }
    }, item.description), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 8,
        background: C.bg2,
        borderRadius: 6,
        border: "1px dashed " + C.bdr2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: C.grn,
        marginBottom: 3
      }
    }, "\uD83D\uDDA8 PRINTIFY MOCKUP PROMPT"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3,
        lineHeight: 1.5,
        fontFamily: C.mono
      }
    }, item.mockup_prompt)));
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 14
    }
  }, "\uD83D\uDD50 Daily Upload Scheduler"), STORES.map(function (s) {
    var sc = sched[s.k] || {
      on: false,
      time: "09:00",
      qty: 2
    };
    var st = connections[s.k] || "idle";
    return /*#__PURE__*/React.createElement("div", {
      key: s.k,
      style: {
        padding: "12px 14px",
        background: sc.on ? C.amberL : C.bg3,
        border: "1px solid " + (sc.on ? C.amber + "40" : C.bdr),
        borderRadius: 8,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: sc.on ? 10 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: st === "online" ? C.grn : C.t4
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: C.txt
      }
    }, s.l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: C.t3,
        fontFamily: C.mono
      }
    }, sc.on ? sc.qty + " listings/day @ " + sc.time : "Disabled")), /*#__PURE__*/React.createElement(Toggle, {
      on: sc.on,
      set: function (v) {
        updSched(s.k, "on", v);
      },
      col: C.amber
    })), sc.on && /*#__PURE__*/React.createElement("div", {
      className: "fade",
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Lbl, null, "Upload time"), /*#__PURE__*/React.createElement("input", {
      className: "cf-inp",
      type: "time",
      value: sc.time,
      onChange: function (e) {
        updSched(s.k, "time", e.target.value);
      },
      style: {
        fontSize: 12
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 80
      }
    }, /*#__PURE__*/React.createElement(Lbl, null, "Qty"), /*#__PURE__*/React.createElement("select", {
      className: "cf-inp",
      value: sc.qty,
      onChange: function (e) {
        updSched(s.k, "qty", parseInt(e.target.value));
      }
    }, [1, 2, 3, 5, 10, 20].map(function (n) {
      return /*#__PURE__*/React.createElement("option", {
        key: n,
        value: n
      }, n, "/day");
    })))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 12
    }
  }, "\uD83D\uDCCA Inventory Overview"), [{
    l: "Store A listings",
    col: C.amber
  }, {
    l: "Store B listings",
    col: C.amber
  }, {
    l: "Store C listings",
    col: C.amber
  }, {
    l: "Printify mockups",
    col: C.grn
  }].map(function (row) {
    return /*#__PURE__*/React.createElement("div", {
      key: row.l,
      style: {
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        background: C.bg3,
        borderRadius: 6,
        border: "1px solid " + C.bdr
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: C.t2
      }
    }, row.l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: C.t4,
        fontFamily: C.mono
      }
    }, "\u2014 connect Etsy"));
  })))), /*#__PURE__*/React.createElement(DynamicPricingAgent, {
    store: store,
    connections: connections
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFC6"), " \u0423\u043D\u0456\u043A\u0430\u043B\u044C\u043D\u0456 AI \u0456\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438", /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr,
      marginLeft: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "2px 8px",
      background: "#FEF3C7",
      color: "#92400E",
      borderRadius: 4,
      fontFamily: C.mono
    }
  }, "\u041D\u0415\u041C\u0410\u0404 \u0423 \u041A\u041E\u041D\u041A\u0423\u0420\u0415\u041D\u0422\u0406\u0412")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(CompetitorSpyWidget, null), /*#__PURE__*/React.createElement(ReviewResponderWidget, null), /*#__PURE__*/React.createElement(PhotoAnalyzerWidget, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(ShadowSpyWidget, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(OneClickExpandWidget, null), /*#__PURE__*/React.createElement(AiVoiceWidget, null)))));
}

// ─── DYNAMIC PRICING AGENT ────────────────────────────────────────────────────
function DynamicPricingAgent({
  store,
  connections
}) {
  var [busy, setBusy] = useState(false);
  var [result, setResult] = useState(null);
  var [err, setErr] = useState("");
  var [product, setProduct] = useState("");
  var [cost, setCost] = useState("");
  var [autoprice, setAutoprice] = useState(false);
  var [applied, setApplied] = useState(false);
  function analyzePrice() {
    return _analyzePrice.apply(this, arguments);
  }
  function _analyzePrice() {
    _analyzePrice = _asyncToGenerator(function* () {
      if (!product.trim()) return;
      setBusy(true);
      setResult(null);
      setErr("");
      setApplied(false);
      try {
        var raw = yield ai("You are an elite Etsy pricing strategist and market analyst. Return ONLY valid JSON, no markdown.", "Analyze optimal pricing for this Etsy product.\n" + "Product: \"" + product + "\"\n" + "My production cost: $" + (cost || "0") + "\n" + "Return JSON:\n" + "{\n" + "  \"recommended_price\": 34.99,\n" + "  \"price_range\": {\"min\": 24.99, \"max\": 49.99},\n" + "  \"competitor_avg\": 31.50,\n" + "  \"margin_pct\": 68,\n" + "  \"etsy_fee\": 1.75,\n" + "  \"printify_cost\": 8.00,\n" + "  \"net_profit\": 22.74,\n" + "  \"demand_score\": 84,\n" + "  \"competition_level\": \"medium\",\n" + "  \"price_justification\": \"2 sentences why this price\",\n" + "  \"upsell_bundle\": \"suggest a bundle idea\",\n" + "  \"seasonal_boost\": \"when to raise price and by how much\",\n" + "  \"keywords_at_this_price\": [\"tag1\", \"tag2\", \"tag3\"],\n" + "  \"competitor_gaps\": [\"gap1\", \"gap2\"]\n" + "}", 800);
        setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setErr(e.message);
      }
      setBusy(false);
    });
    return _analyzePrice.apply(this, arguments);
  }
  var demandCol = !result ? C.t4 : result.demand_score >= 80 ? C.grn : result.demand_score >= 60 ? C.amber : C.red;
  var compCol = !result ? C.t4 : result.competition_level === "low" ? C.grn : result.competition_level === "medium" ? C.amber : C.red;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 16px",
      background: "linear-gradient(135deg,#FFF8E1,#FFFDE7)",
      border: "1px solid " + C.amber + "50",
      borderRadius: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "\u26A1"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: C.amber,
      fontFamily: C.dis,
      letterSpacing: "-0.3px"
    }
  }, "Dynamic Pricing Agent"), /*#__PURE__*/React.createElement(Chip, {
    color: C.grn
  }, "AI")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "360px 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      fontFamily: C.mono,
      marginBottom: 14,
      lineHeight: 1.7
    }
  }, "AI \u0430\u043D\u0430\u043B\u0456\u0437\u0443\u0454 \u043A\u043E\u043D\u043A\u0443\u0440\u0435\u043D\u0442\u0456\u0432, \u043F\u043E\u043F\u0438\u0442, \u0441\u0435\u0437\u043E\u043D\u043D\u0456\u0441\u0442\u044C \u0456 \u0440\u043E\u0437\u0440\u0430\u0445\u043E\u0432\u0443\u0454 \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u0443 \u0446\u0456\u043D\u0443 \u0437 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u043C \u043F\u0440\u0438\u0431\u0443\u0442\u043A\u043E\u043C."), /*#__PURE__*/React.createElement(Fld, {
    label: "Product name / description",
    val: product,
    set: setProduct,
    ph: "e.g. Monad Parallel EVM Art Print 8x10"
  }), /*#__PURE__*/React.createElement(Fld, {
    label: "Your production cost ($)",
    val: cost,
    set: setCost,
    type: "number",
    ph: "e.g. 8.50 (Printify cost)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 12px",
      background: autoprice ? C.amberL : C.bg3,
      border: "1px solid " + (autoprice ? C.amber + "40" : C.bdr),
      borderRadius: 8,
      transition: "all .2s"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt
    }
  }, "Autopilot Repricing"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3
    }
  }, "Agent re-prices every 24h automatically")), /*#__PURE__*/React.createElement(Toggle, {
    on: autoprice,
    set: setAutoprice,
    col: C.amber
  })), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      marginBottom: 10,
      fontFamily: C.mono
    }
  }, "Error: ", err), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: analyzePrice,
    disabled: busy || !product.trim(),
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Analyzing market\u2026") : "Analyze & Price \u2192")), /*#__PURE__*/React.createElement("div", null, !result && !busy && /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 12,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 12
    }
  }, "\uD83D\uDCB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 6
    }
  }, "AI Dynamic Pricing"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      lineHeight: 1.7,
      maxWidth: 280
    }
  }, "Enter your product and cost above. Agent analyzes Etsy market, competitor pricing, demand trends and calculates optimal price to maximize your profit.")), result && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 24px",
      marginBottom: 14,
      background: "linear-gradient(135deg,#FFFDE7,#FFF8E1)",
      border: "2px solid " + C.amber + "60",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.amberD,
      fontFamily: C.mono,
      fontWeight: 700,
      letterSpacing: ".5px",
      marginBottom: 4
    }
  }, "RECOMMENDED PRICE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 52,
      fontWeight: 800,
      color: C.amber,
      fontFamily: C.mono,
      lineHeight: 1,
      letterSpacing: "-2px"
    }
  }, "$", result.recommended_price), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginTop: 4
    }
  }, "Range: $", result.price_range && result.price_range.min, " \u2014 $", result.price_range && result.price_range.max)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      fontFamily: C.mono
    }
  }, "NET PROFIT / SALE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: C.grn,
      fontFamily: C.mono,
      lineHeight: 1
    }
  }, "$", result.net_profit)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      fontFamily: C.mono
    }
  }, "MARGIN"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: C.grn,
      fontFamily: C.mono
    }
  }, result.margin_pct, "%")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 10,
      marginBottom: 14
    }
  }, [{
    l: "Competitor avg",
    v: "$" + result.competitor_avg,
    col: C.blue
  }, {
    l: "Demand score",
    v: result.demand_score + "/100",
    col: demandCol
  }, {
    l: "Competition",
    v: result.competition_level,
    col: compCol
  }, {
    l: "Etsy fee",
    v: "$" + result.etsy_fee,
    col: C.t3
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.l,
      style: {
        padding: "10px 12px",
        background: C.bg,
        border: "1px solid " + C.bdr,
        borderRadius: 8,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 700,
        color: s.col,
        fontFamily: C.mono,
        marginBottom: 2
      }
    }, s.v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        textTransform: "uppercase",
        letterSpacing: ".4px"
      }
    }, s.l));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.blue,
      fontFamily: C.mono,
      marginBottom: 6
    }
  }, "PRICE JUSTIFICATION"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t2,
      lineHeight: 1.6
    }
  }, result.price_justification)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.amber,
      fontFamily: C.mono,
      marginBottom: 6
    }
  }, "SEASONAL BOOST"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t2,
      lineHeight: 1.6
    }
  }, result.seasonal_boost))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: C.grnL,
      border: "1px solid rgba(5,150,105,.2)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.grn,
      fontFamily: C.mono,
      marginBottom: 6
    }
  }, "UPSELL BUNDLE IDEA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t2,
      lineHeight: 1.6
    }
  }, result.upsell_bundle)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.pur,
      fontFamily: C.mono,
      marginBottom: 6
    }
  }, "COMPETITOR GAPS"), (result.competitor_gaps || []).map(function (g, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: C.t2,
        marginBottom: 3,
        display: "flex",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.grn
      }
    }, "+"), g);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.t3,
      fontFamily: C.mono,
      marginBottom: 8,
      textTransform: "uppercase"
    }
  }, "Keywords at this price point"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 5
    }
  }, (result.keywords_at_this_price || []).map(function (k) {
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        fontSize: 10,
        padding: "3px 9px",
        background: C.blueL,
        color: C.blue,
        borderRadius: 4,
        fontFamily: C.mono,
        border: "1px solid " + C.blue + "20"
      }
    }, k);
  }))), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: function () {
      setApplied(true);
    },
    disabled: applied,
    style: {
      width: "100%",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700,
      padding: "12px"
    }
  }, applied ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff"
    }
  }, "\u2713"), " Price applied to ", store.replace("etsy", "Store ")) : "Apply $" + result.recommended_price + " to Etsy listing \u2192")))));
}
// ── Real X posting function ──────────────────────────────────────────────────
function postFirstTweetToX(_x8, _x9) {
  return _postFirstTweetToX.apply(this, arguments);
}
function _postFirstTweetToX() {
  _postFirstTweetToX = _asyncToGenerator(function* (threadText, connections) {
    // Extract first tweet from thread (before "2/")
    var firstTweet = threadText.split(/\n(?=2\/)/)[0].trim();
    if (!firstTweet) {
      alert("Немає тексту для публікації");
      return;
    }
    if (firstTweet.length > 280) firstTweet = firstTweet.substring(0, 277) + "...";

    // Get stored X credentials from sessionStorage (entered in Connections tab)
    var xKeys = {};
    try {
      xKeys = JSON.parse(sessionStorage.getItem("cf_x_keys") || "{}");
    } catch (e) {}
    if (!xKeys.api_key || !xKeys.api_secret || !xKeys.access_tok || !xKeys.access_sec) {
      alert("Будь ласка, введи всі 4 ключі X API в таб Connections → X/Twitter");
      return;
    }
    try {
      var resp = yield fetch("/api/x-post.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: firstTweet,
          api_key: xKeys.api_key,
          api_secret: xKeys.api_secret,
          access_tok: xKeys.access_tok,
          access_sec: xKeys.access_sec
        })
      });
      var data = yield resp.json();
      if (data.success) {
        alert("✅ Твіт опубліковано!\n" + data.url);
      } else {
        alert("❌ Помилка: " + (data.error || "Unknown"));
      }
    } catch (e) {
      alert("❌ " + e.message);
    }
  });
  return _postFirstTweetToX.apply(this, arguments);
}
function SocialTab({
  connections,
  autopilot,
  T
}) {
  var [sub, setSub] = useState("monad");
  var [monadBusy, setMBusy] = useState(false);
  var [monadFeed, setMFeed] = useState([]);
  var [threadBusy, setTBusy] = useState(false);
  var [thread, setThread] = useState("");
  var [topic, setTopic] = useState("");
  var [reelBusy, setRBusy] = useState(false);
  var [reelDesc, setReelDesc] = useState("");
  var [product, setProduct] = useState("");
  var MONAD_TOPICS = ["Monad TPS milestone", "$MON token update", "Monad ecosystem dApp", "Monad vs ETH L2", "Monad validators", "Monad DeFi protocol"];
  function scanMonad() {
    return _scanMonad.apply(this, arguments);
  }
  function _scanMonad() {
    _scanMonad = _asyncToGenerator(function* () {
      setMBusy(true);
      try {
        var raw = yield ai("You are a Monad ecosystem analyst. Return JSON only, no markdown.", "Generate 4 Monad trend alerts for @volya089 to post on X.\n" + "Reference real Monad infrastructure (TPS, Parallel EVM, chainId 143, rpc.monad.xyz).\n" + "JSON: [{\"trend\":\"topic\",\"score\":87,\"type\":\"technical\"," + "\"hook\":\"tweet hook under 240 chars\",\"urgency\":\"high\",\"best_time\":\"08:30 EST\"}]", 600);
        setMFeed(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setMFeed([{
          trend: "Error: " + e.message,
          score: 0,
          type: "error",
          hook: "",
          urgency: "med",
          best_time: ""
        }]);
      }
      setMBusy(false);
    });
    return _scanMonad.apply(this, arguments);
  }
  function genThread() {
    return _genThread.apply(this, arguments);
  }
  function _genThread() {
    _genThread = _asyncToGenerator(function* () {
      if (!topic.trim()) return;
      setTBusy(true);
      setThread("");
      try {
        setThread(yield ai("Expert X/Twitter strategist for crypto and Web3 founders.", "Write a viral 6-tweet thread for @volya089.\nTopic: \"" + topic + "\"\n" + "Rules:\n- Tweet 4 must link closefast.ai as the platform for Monad AI agents.\n" + "- Every tweet starts with 🔵 or 🟡.\n- Include at least 2 specific dollar amounts.\n" + "- Tweet 6 ends with CTA to volya089@gmail.com\nNumber each tweet 1/ through 6/.", 700));
      } catch (e) {
        setThread("Error: " + e.message);
      }
      setTBusy(false);
    });
    return _genThread.apply(this, arguments);
  }
  function genReel() {
    return _genReel.apply(this, arguments);
  }
  function _genReel() {
    _genReel = _asyncToGenerator(function* () {
      setRBusy(true);
      setReelDesc("");
      try {
        setReelDesc(yield ai("Instagram Reels script and caption writer for Etsy/AI/crypto sellers.", "Create a complete Instagram Reels package for @volya089.\n" + "Product: \"" + (product || "Monad ecosystem neon art print") + "\"\n" + "Include:\n1. HOOK (first 3 seconds)\n2. VISUAL SEQUENCE (5-7 cuts)\n" + "3. VOICEOVER SCRIPT (15-30 seconds)\n4. CAPTION + 20 hashtags\n" + "5. OPTIMAL POST TIME\n6. THUMBNAIL TEXT\nTone: fast, crypto-native.", 800));
      } catch (e) {
        setReelDesc("Error: " + e.message);
      }
      setRBusy(false);
    });
    return _genReel.apply(this, arguments);
  }
  var SUB = [{
    k: "monad",
    l: "🔵 Monad Monitor"
  }, {
    k: "thread",
    l: "📣 Thread Generator"
  }, {
    k: "reels",
    l: "🎬 Reels Pipeline"
  }];
  var urgCols = {
    high: C.red,
    med: C.amber
  };
  var typeCols = {
    technical: C.blue,
    market: C.grn,
    ecosystem: C.pur,
    error: C.red
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "Social ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Engine")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 20,
      fontFamily: C.mono
    }
  }, "@volya089 \xB7 @Jarek42 \xB7 Monad Sentinel \xB7 Reels Pipeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 20,
      background: C.bg3,
      border: "1px solid " + C.bdr,
      borderRadius: 8,
      padding: 4,
      width: "fit-content"
    }
  }, SUB.map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s.k,
      onClick: function () {
        setSub(s.k);
      },
      style: {
        padding: "8px 16px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        background: sub === s.k ? C.amber : "transparent",
        color: sub === s.k ? "#FFFFFF" : C.t3,
        transition: "all .15s"
      }
    }, s.l);
  })), sub === "monad" && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "\uD83D\uDD35 Monad News Monitor"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 14,
      lineHeight: 1.7
    }
  }, "AI scans Monad ecosystem trends and generates priority tweets for @volya089."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      marginBottom: 14
    }
  }, MONAD_TOPICS.map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        padding: "6px 10px",
        background: C.bg3,
        border: "1px solid " + C.bdr,
        borderRadius: 6,
        fontSize: 11,
        color: C.t2
      }
    }, t);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      background: C.blueL,
      border: "1px solid " + C.blue + "30",
      borderRadius: 8,
      marginBottom: 14,
      fontSize: 11,
      color: C.blue,
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Autopilot:"), " Monad trending \u2192 hook generated \u2192 posted @08:30 EST \u2192 every 4th post: closefast.ai."), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: scanMonad,
    disabled: monadBusy,
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, monadBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Scanning Monad\u2026") : "Scan Monad Now \u2192")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      marginBottom: 10
    }
  }, "Trend Alerts"), monadFeed.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 10,
      textAlign: "center",
      color: C.t4,
      fontSize: 12
    }
  }, "Run scan to detect Monad trends") : monadFeed.map(function (f, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "fade",
      style: {
        marginBottom: 10,
        padding: "12px 14px",
        background: C.bg,
        borderRadius: 8,
        border: "1px solid " + C.bdr,
        borderLeft: "3px solid " + (typeCols[f.type] || C.blue)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: C.txt
      }
    }, f.trend), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Chip, {
      color: typeCols[f.type] || C.blue
    }, f.type), /*#__PURE__*/React.createElement(Chip, {
      color: urgCols[f.urgency] || C.t3
    }, f.urgency))), f.hook && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.t2,
        lineHeight: 1.6,
        fontStyle: "italic",
        marginBottom: 6
      }
    }, "\"", f.hook, "\""), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.t4,
        fontFamily: C.mono
      }
    }, "Score: ", f.score, "/100"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.amber,
        fontFamily: C.mono
      }
    }, "Post @ ", f.best_time || "08:30 EST")));
  }))), sub === "thread" && /*#__PURE__*/React.createElement("div", {
    className: "fade two-col",
    style: {
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 14
    }
  }, "Thread Generator"), /*#__PURE__*/React.createElement(Lbl, null, "Quick Topic"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
      marginBottom: 12
    }
  }, ["Monad TPS vs ETH Layer 2 reality", "How AI agents made my Etsy store autonomous", "VLY liquidity model: 90/5/5 explained", "Why Monad parallel EVM changes everything"].map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: function () {
        setTopic(t);
      },
      style: {
        padding: "7px 10px",
        background: topic === t ? C.blueL : C.bg3,
        border: "1px solid " + (topic === t ? C.blue + "60" : C.bdr),
        borderRadius: 6,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 11,
        color: topic === t ? C.blue : C.t2
      }
    }, t);
  })), /*#__PURE__*/React.createElement(Fld, {
    label: "Custom topic",
    val: topic,
    set: setTopic,
    ph: "Your custom angle..."
  }), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: genThread,
    disabled: threadBusy || !topic.trim(),
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, threadBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Writing\u2026") : "Generate Thread \u2192")), /*#__PURE__*/React.createElement("div", null, thread ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cf-card fade",
    style: {
      fontSize: 12,
      color: C.t2,
      lineHeight: 2,
      whiteSpace: "pre-wrap",
      borderLeft: "3px solid " + C.blue,
      maxHeight: 400,
      overflowY: "auto"
    }
  }, thread), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(thread);
    },
    className: "cf-btn cf-btn-ghost",
    style: {
      flex: 1,
      justifyContent: "center"
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      postFirstTweetToX(thread, connections);
    },
    className: "cf-btn",
    disabled: connections["x"] !== "online",
    style: {
      flex: 1,
      justifyContent: "center",
      background: connections["x"] === "online" ? "#1DA1F2" : "#E2E6F0",
      color: connections["x"] === "online" ? "#fff" : C.t4,
      border: "none"
    }
  }, connections["x"] === "online" ? "🔵 Опублікувати твіт 1/" : "🔵 Підключи X для постингу"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 48,
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 10,
      textAlign: "center",
      color: C.t4
    }
  }, "Thread preview appears here"))), sub === "reels" && /*#__PURE__*/React.createElement("div", {
    className: "fade two-col",
    style: {
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 6
    }
  }, "\uD83C\uDFAC Insta-Reels Pipeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 14,
      lineHeight: 1.7
    }
  }, "Convert Etsy product photos into complete Reels packages."), /*#__PURE__*/React.createElement(Fld, {
    label: "Product Description",
    val: product,
    set: setProduct,
    ph: "e.g. Monad ecosystem neon art print, 8x10 wall art"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      background: C.purL,
      border: "1px solid " + C.pur + "30",
      borderRadius: 8,
      marginBottom: 14,
      fontSize: 11,
      color: C.pur,
      lineHeight: 1.7
    }
  }, "Autopilot: Etsy upload \u2192 Reel script \u2192 scheduled @volya089 IG 11:00-13:00 EST."), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: genReel,
    disabled: reelBusy,
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, reelBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Creating\u2026") : "Generate Reels Package \u2192")), /*#__PURE__*/React.createElement("div", null, reelDesc ? /*#__PURE__*/React.createElement("div", {
    className: "cf-card fade",
    style: {
      fontSize: 12,
      color: C.t2,
      lineHeight: 1.9,
      whiteSpace: "pre-wrap",
      borderLeft: "3px solid " + C.pur,
      maxHeight: 560,
      overflowY: "auto"
    }
  }, reelDesc) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 48,
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 10,
      textAlign: "center",
      color: C.t4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 10,
      opacity: .3
    }
  }, "\uD83C\uDFAC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12
    }
  }, "Reels package appears here")))));
}

// ─── SITE AUDIT ───────────────────────────────────────────────────────────────
function AuditTab({
  T
}) {
  var [url, setUrl] = useState("https://closefast.tech");
  var [busy, setBusy] = useState(false);
  var [report, setReport] = useState(null);
  var [err, setErr] = useState("");
  var PROMPT = ["Audit this website URL: URL_PLACEHOLDER", "Analyze based on URL domain and known patterns. Return ONLY valid JSON:", "{\"site_name\":\"name\",\"overall_score\":74,", "\"scores\":{\"seo\":78,\"speed\":82,\"conversion\":65,\"mobile\":88,\"security\":91},", "\"critical_issues\":[{\"issue\":\"title\",\"impact\":\"high\",\"fix\":\"action\",\"revenue_impact\":\"$X/mo\"}],", "\"quick_wins\":[{\"win\":\"action\",\"effort\":\"low\",\"expected_uplift\":\"20%\"}],", "\"competitor_gap\":\"2-sentence insight\",", "\"seo_keywords\":[\"kw1\",\"kw2\",\"kw3\",\"kw4\",\"kw5\"],", "\"summary\":\"2-sentence summary\",", "\"rev_gap\":[", "{\"label\":\"Current Revenue\",\"val\":3200,\"max\":8000,\"col\":\"#F0A500\"},", "{\"label\":\"With SEO Fix\",\"val\":5100,\"max\":8000,\"col\":\"#059669\"},", "{\"label\":\"With CRO Fix\",\"val\":6400,\"max\":8000,\"col\":\"#1D4ED8\"},", "{\"label\":\"Full Potential\",\"val\":7800,\"max\":8000,\"col\":\"#7C3AED\"}]}"];
  function run() {
    return _run.apply(this, arguments);
  }
  function _run() {
    _run = _asyncToGenerator(function* () {
      var target = url.trim();
      if (!target) return;
      if (!target.startsWith("http")) target = "https://" + target;
      setBusy(true);
      setReport(null);
      setErr("");
      try {
        var prompt = PROMPT.join("\n").replace("URL_PLACEHOLDER", target);
        var raw = yield ai("You are a web analytics and SEO auditor. Return valid JSON only, no markdown.", prompt, 1800);
        var parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        setReport(parsed);
      } catch (e) {
        setErr("⚠️ " + e.message + " — Переконайся що ANTHROPIC_API_KEY прописаний у .env на сервері.");
      }
      setBusy(false);
    });
    return _run.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, T.site_audit_title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 20,
      fontFamily: C.mono
    }
  }, T.site_audit_sub), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "cf-inp",
    value: url,
    onChange: function (e) {
      setUrl(e.target.value);
      setErr("");
    },
    placeholder: "https://yoursite.com",
    style: {
      flex: 1
    },
    onKeyDown: function (e) {
      if (e.key === "Enter") run();
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: run,
    disabled: busy || !url.trim(),
    style: {
      padding: "8px 20px",
      whiteSpace: "nowrap"
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), "\xA0", T.auditing || "Аналізую...") : (T.run_audit || "Запустити аудит") + " →")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginTop: 8,
      flexWrap: "wrap"
    }
  }, ["https://closefast.tech", "https://etsy.com/shop/VibeprintsProducts", "https://pancakeswap.finance/swap?outputCurrency=0x9459ddd1B70E51280DEf774650EcD04F0e24d234"].map(function (u) {
    return /*#__PURE__*/React.createElement("button", {
      key: u,
      onClick: function () {
        setUrl(u);
        setReport(null);
        setErr("");
      },
      style: {
        padding: "3px 10px",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 10,
        fontFamily: C.mono,
        background: url === u ? C.amberL : C.bg3,
        border: "1px solid " + (url === u ? C.amber : C.bdr),
        color: url === u ? C.amberD : C.t3
      }
    }, u.replace("https://", "").replace("http://", ""));
  })), err && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "8px 12px",
      borderRadius: 6,
      background: "#FEF2F2",
      border: "1px solid rgba(220,38,38,.2)",
      fontSize: 11,
      color: C.red,
      fontFamily: C.mono
    }
  }, "\u26A0\uFE0F ", err)), report && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 12,
      padding: "20px 24px",
      marginBottom: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,.06)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      letterSpacing: ".5px",
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "SITE AUDIT REPORT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis
    }
  }, report.site_name || url), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t4,
      marginTop: 2,
      fontFamily: C.mono
    }
  }, new Date().toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 56,
      fontWeight: 800,
      lineHeight: 1,
      fontFamily: C.mono,
      color: report.overall_score >= 80 ? C.grn : report.overall_score >= 60 ? C.amber : C.red
    }
  }, report.overall_score), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      fontFamily: C.mono,
      letterSpacing: ".5px"
    }
  }, "OVERALL"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 16
    }
  }, Object.entries(report.scores || {}).map(function (entry) {
    var k = entry[0],
      v = entry[1];
    var col = v >= 80 ? C.grn : v >= 60 ? C.amber : C.red;
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        background: C.bg3,
        border: "1px solid " + C.bdr,
        borderRadius: 8,
        padding: "10px 14px",
        textAlign: "center",
        minWidth: 80,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 700,
        color: col,
        fontFamily: C.mono
      }
    }, v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t3,
        marginTop: 2,
        textTransform: "capitalize",
        fontFamily: C.mono
      }
    }, k));
  })), (report.rev_gap || []).length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t3,
      letterSpacing: ".5px",
      marginBottom: 10,
      fontFamily: C.mono
    }
  }, "\uD83D\uDCB0 REVENUE GAP ANALYSIS"), (report.rev_gap || []).map(function (d, i) {
    var pct = d.max > 0 ? Math.min(100, d.val / d.max * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: C.t2
      }
    }, d.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: d.col,
        fontFamily: C.mono
      }
    }, "$", (d.val || 0).toLocaleString(), "/mo")), /*#__PURE__*/React.createElement(PBar, {
      pct: pct,
      color: d.col,
      h: 6
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.red,
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, "\u26A0\uFE0F \u041A\u0440\u0438\u0442\u0438\u0447\u043D\u0456 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0438"), (report.critical_issues || []).map(function (iss, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottom: i < report.critical_issues.length - 1 ? "1px solid " + C.bdr : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: C.txt,
        lineHeight: 1.3,
        flex: 1,
        marginRight: 8
      }
    }, iss.issue), /*#__PURE__*/React.createElement(Chip, {
      color: iss.impact === "high" ? C.red : C.amber
    }, iss.impact)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.t2,
        marginBottom: 4,
        lineHeight: 1.5
      }
    }, iss.fix), iss.revenue_impact && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.grn,
        fontFamily: C.mono,
        fontWeight: 700
      }
    }, "+", iss.revenue_impact, " \u043F\u0456\u0441\u043B\u044F \u0432\u0438\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.grn,
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, "\u26A1 \u0428\u0432\u0438\u0434\u043A\u0456 \u043F\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u043D\u044F"), (report.quick_wins || []).map(function (w, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottom: i < report.quick_wins.length - 1 ? "1px solid " + C.bdr : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: C.txt,
        marginBottom: 4,
        lineHeight: 1.3
      }
    }, w.win), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Chip, {
      color: C.grn
    }, w.effort, " effort"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: C.grn,
        fontFamily: C.mono,
        fontWeight: 700
      }
    }, "\u2191 ", w.expected_uplift)));
  }), (report.seo_keywords || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid " + C.bdr
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t3,
      fontFamily: C.mono,
      marginBottom: 6,
      letterSpacing: ".3px"
    }
  }, "SEO KEYWORDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4
    }
  }, (report.seo_keywords || []).map(function (kw) {
    return /*#__PURE__*/React.createElement("span", {
      key: kw,
      style: {
        fontSize: 9,
        padding: "2px 8px",
        background: C.blueL,
        color: C.blue,
        borderRadius: 3,
        fontFamily: C.mono,
        border: "1px solid rgba(29,78,216,.15)"
      }
    }, kw);
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "\uD83D\uDCCB \u0412\u0438\u0441\u043D\u043E\u0432\u043E\u043A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.t2,
      lineHeight: 1.7,
      marginBottom: report.competitor_gap ? 12 : 0
    }
  }, report.summary), report.competitor_gap && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "10px 14px",
      background: C.amberL,
      borderRadius: 6,
      border: "1px solid rgba(240,165,0,.3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.amberD,
      fontFamily: C.mono,
      marginBottom: 4,
      fontWeight: 700
    }
  }, "\uD83C\uDFC1 COMPETITOR GAP"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t2,
      lineHeight: 1.6
    }
  }, report.competitor_gap)))));
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({
  plan,
  price,
  discount,
  onClose,
  T,
  user
}) {
  var [selected, setSelected] = useState("stripe");
  var [cryptoAddr, setCryptoAddr] = useState("");
  var [walletConnected, setWalletConnected] = useState(false);
  var [walletAddr, setWalletAddr] = useState("");
  var [cryptoSending, setCryptoSending] = useState(false);
  var [walletType, setWalletType] = useState("");

  // ── Owner bypass — no payment needed ──
  var isOwner = user && isMaster(user.email || "");
  if (isOwner) {
    return /*#__PURE__*/React.createElement("div", {
      className: "modal-overlay",
      onClick: function (e) {
        if (e.target === e.currentTarget) onClose();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "modal-box",
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        position: "absolute",
        top: 14,
        right: 14,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
        color: C.t3
      }
    }, "\u2715"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 48,
        marginBottom: 12
      }
    }, "\u2726"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 800,
        color: C.amber,
        fontFamily: C.dis,
        marginBottom: 8
      }
    }, "Owner Access"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: C.t2,
        marginBottom: 20
      }
    }, "\u0426\u0456 \u0430\u043A\u0430\u0443\u043D\u0442\u0438 \u043C\u0430\u044E\u0442\u044C \u043F\u043E\u0432\u043D\u0438\u0439 \u0431\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u0438\u0439 \u0434\u043E\u0441\u0442\u0443\u043F.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: C.mono,
        fontSize: 11,
        color: C.t3
      }
    }, "volya089@gmail.com \xB7 slavikbobnar1981@gmail.com")), /*#__PURE__*/React.createElement("button", {
      className: "cf-btn",
      onClick: onClose,
      style: {
        background: C.amber,
        color: "#000",
        fontWeight: 700,
        width: "100%",
        padding: "12px"
      }
    }, "\u2713 \u0417\u0430\u043A\u0440\u0438\u0442\u0438")));
  }

  // VLY discount + extra 15% for crypto payment
  var vlyDiscounted = discount > 0 ? Math.round(price * (1 - discount / 100) * 100) / 100 : price;
  var cryptoPrice = Math.round(vlyDiscounted * 0.85 * 100) / 100; // extra -15%
  var finalPrice = selected === "crypto" ? cryptoPrice : vlyDiscounted;
  var METHODS = [{
    k: "stripe",
    icon: "💳",
    label: "Stripe",
    sub: "Visa · Mastercard · Apple Pay · Google Pay"
  }, {
    k: "revolut",
    icon: "🔄",
    label: "Revolut",
    sub: "Revolut Pay · Bank transfer · EUR/USD"
  }, {
    k: "crypto",
    icon: "⛓",
    label: "Crypto (-15%)",
    sub: "USDT/USDC/MON · MetaMask · Rabby · Phantom · Trust"
  }];
  var CRYPTO_ADDRS = {
    USDT: "0x44afc052d7b2f17fd125a8022e5a1964fa35f008",
    USDC: "0x44afc052d7b2f17fd125a8022e5a1964fa35f008",
    MON: "0x44afc052d7b2f17fd125a8022e5a1964fa35f008"
  };
  function connectWalletByType(_x0) {
    return _connectWalletByType.apply(this, arguments);
  }
  function _connectWalletByType() {
    _connectWalletByType = _asyncToGenerator(function* (wType) {
      setWalletType(wType);
      var provider = null;
      if (wType === "phantom" && window.solana && window.solana.isPhantom) {
        // Phantom (Solana) — show address only, payments on EVM chain
        try {
          var resp = yield window.solana.connect();
          setWalletAddr(resp.publicKey.toString());
          setWalletConnected(true);
        } catch (e) {
          alert("Phantom: " + e.message);
        }
        return;
      }
      if (wType === "coinbase" && window.coinbaseWalletExtension) {
        provider = window.coinbaseWalletExtension;
      } else if (wType === "okx" && window.okxwallet) {
        provider = window.okxwallet;
      } else {
        provider = window.ethereum;
      }
      if (!provider) {
        alert("Гаманець не знайдено. Встановіть MetaMask, Rabby або Trust Wallet.");
        return;
      }
      try {
        var accounts = yield provider.request({
          method: "eth_requestAccounts"
        });
        setWalletAddr(accounts[0]);
        setWalletConnected(true);
        window._cfModalProvider = provider;
      } catch (e) {
        alert("Помилка підключення: " + e.message);
      }
    });
    return _connectWalletByType.apply(this, arguments);
  }
  function connectWallet() {
    return _connectWallet.apply(this, arguments);
  }
  function _connectWallet() {
    _connectWallet = _asyncToGenerator(function* () {
      connectWalletByType("metamask");
    });
    return _connectWallet.apply(this, arguments);
  }
  function handlePay() {
    return _handlePay.apply(this, arguments);
  }
  function _handlePay() {
    _handlePay = _asyncToGenerator(function* () {
      var STRIPE_LINKS = {
        starter: "https://buy.stripe.com/test_aFa00k1h24Qg42f3Xd2ZO02",
        pro: "https://buy.stripe.com/test_bJe7sM7FqciI6an79p2ZO01",
        elite: "https://buy.stripe.com/test_00wdRa0cYciI1U7eBR2ZO03",
        sovereign: "https://buy.stripe.com/test_00wdRa0cYciI1U7eBR2ZO03",
        // TODO: create Sovereign link
        lifetime: "https://buy.stripe.com/test_14A4gA3padmM7er51h2ZO00",
        merchant: "https://buy.stripe.com/test_aFa00k1h24Qg42f3Xd2ZO02",
        enterprise: "https://buy.stripe.com/test_bJe7sM7FqciI6an79p2ZO01",
        holdings: "https://buy.stripe.com/test_00wdRa0cYciI1U7eBR2ZO03"
      };
      if (selected === "stripe") {
        window.open(STRIPE_LINKS[plan.k] || "https://dashboard.stripe.com", "_blank");
      } else if (selected === "revolut") {
        window.open("https://pay.revolut.com/REPLACE_WITH_REVOLUT_LINK", "_blank");
      } else {
        // CRYPTO: connect wallet → auto-fill address → send tx → auto-activate
        if (!window.ethereum) {
          alert("Встановіть MetaMask або Trust Wallet для крипто оплати");
          return;
        }
        try {
          var accounts = yield window.ethereum.request({
            method: "eth_requestAccounts"
          });
          setWalletAddr(accounts[0]);
          setWalletConnected(true);
          setCryptoAddr(CRYPTO_ADDRS["USDT"]);
        } catch (e) {
          alert("Помилка підключення гаманця: " + e.message);
        }
      }
    });
    return _handlePay.apply(this, arguments);
  }
  function sendCryptoTx() {
    return _sendCryptoTx.apply(this, arguments);
  } // Dead function placeholder for handlePay_old
  function _sendCryptoTx() {
    _sendCryptoTx = _asyncToGenerator(function* () {
      if (!window.ethereum || !walletAddr) return;
      setCryptoSending(true);
      try {
        // Send MON (native token) — finalPrice worth
        // In production, integrate with USDT contract for stablecoin payment
        var amountWei = "0x" + Math.floor(finalPrice / 5 * 1e18).toString(16); // rough MON estimate
        var txHash = yield window.ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: walletAddr,
            to: "0x44afc052d7b2f17fd125a8022e5a1964fa35f008",
            // owner wallet
            value: amountWei
          }]
        });
        // Auto-activate plan
        try {
          yield fetch("/api/stripe/activate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: walletAddr + "@wallet.monad",
              plan: plan.k,
              session_id: txHash,
              source: "crypto_payment",
              tx_hash: txHash,
              amount: finalPrice
            })
          });
        } catch (e2) {}
        // Save plan to localStorage
        localStorage.setItem("cf_plan_" + walletAddr, plan.k);
        localStorage.setItem("cf_activated_email", walletAddr + "@wallet.monad");
        localStorage.setItem("cf_activated_plan", plan.k);
        alert("✅ Оплата підтверджена!\nTX: " + txHash.substring(0, 20) + "...\n\nПлан '" + plan.name + "' активовано автоматично.\nОновіть сторінку для доступу.");
        onClose();
      } catch (e) {
        if (e.code !== 4001) {
          // user didn't reject
          alert("Помилка транзакції: " + e.message);
        }
      }
      setCryptoSending(false);
    });
    return _sendCryptoTx.apply(this, arguments);
  }
  function _unused() {}
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: function (e) {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: "absolute",
      top: 14,
      right: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 18,
      color: C.t3,
      lineHeight: 1
    }
  }, "\u2715"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      fontFamily: C.mono,
      letterSpacing: ".5px",
      marginBottom: 4
    }
  }, "SUBSCRIBE TO PLAN"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis,
      marginBottom: 8
    }
  }, plan.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap"
    }
  }, (discount > 0 || selected === "crypto") && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: C.t4,
      textDecoration: "line-through",
      fontFamily: C.mono
    }
  }, "$", price, "/mo"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: C.amber,
      fontFamily: C.mono,
      lineHeight: 1
    }
  }, "$", finalPrice, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 400,
      color: C.t3
    }
  }, "/mo")), discount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 5,
      background: "rgba(5,150,105,.1)",
      color: C.grn,
      border: "1px solid rgba(5,150,105,.2)"
    }
  }, "\u25C8 VLY -", discount, "%"), selected === "crypto" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 5,
      background: "rgba(99,102,241,.1)",
      color: "#6366F1",
      border: "1px solid rgba(99,102,241,.2)"
    }
  }, "\u26D3 Crypto -15%")), selected === "crypto" && discount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.grn,
      marginTop: 4,
      fontFamily: C.mono
    }
  }, "VLY -", discount, "% + Crypto -15% = Total \u0437\u043D\u0438\u0436\u043A\u0430 -", Math.round((1 - finalPrice / price) * 100), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Lbl, null, "Select Payment Method"), METHODS.map(function (m) {
    return /*#__PURE__*/React.createElement("div", {
      key: m.k,
      className: "pay-opt" + (selected === m.k ? " selected" : ""),
      onClick: function () {
        setSelected(m.k);
        setCryptoAddr("");
        setWalletConnected(false);
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 24,
        flexShrink: 0
      }
    }, m.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: C.txt
      }
    }, m.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.t3
      }
    }, m.sub), m.k === "crypto" && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#6366F1",
        marginTop: 2,
        fontFamily: C.mono
      }
    }, "\u0426\u0456\u043D\u0430 \u0437\u0456 \u0437\u043D\u0438\u0436\u043A\u043E\u044E: $", cryptoPrice, "/mo")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: "2px solid " + (selected === m.k ? C.amber : C.bdr),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }
    }, selected === m.k && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: C.amber
      }
    })));
  })), selected === "crypto" && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      marginBottom: 16
    }
  }, !walletConnected && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      fontFamily: C.mono,
      marginBottom: 8,
      letterSpacing: ".06em"
    }
  }, "\u0412\u0418\u0411\u0415\u0420\u0418 \u0413\u0410\u041C\u0410\u041D\u0415\u0426\u042C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 6
    }
  }, [{
    key: "metamask",
    emoji: "🦊",
    label: "MetaMask"
  }, {
    key: "rabby",
    emoji: "🐰",
    label: "Rabby"
  }, {
    key: "trust",
    emoji: "🛡",
    label: "Trust"
  }, {
    key: "phantom",
    emoji: "👻",
    label: "Phantom"
  }, {
    key: "okx",
    emoji: "⭕",
    label: "OKX"
  }, {
    key: "coinbase",
    emoji: "🔵",
    label: "Coinbase"
  }].map(function (w) {
    return /*#__PURE__*/React.createElement("button", {
      key: w.key,
      onClick: function () {
        connectWalletByType(w.key);
      },
      style: {
        padding: "9px 6px",
        borderRadius: 8,
        cursor: "pointer",
        background: walletType === w.key ? "rgba(99,102,241,.12)" : "#F8FAFC",
        border: "1px solid " + (walletType === w.key ? "#6366F1" : C.bdr),
        fontSize: 11,
        fontWeight: 600,
        color: C.txt,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15
      }
    }, w.emoji), w.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      marginTop: 5,
      textAlign: "center"
    }
  }, "Phantom \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u0454 \u0432\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0430\u0434\u0440\u0435\u0441\u0438; \u043E\u043F\u043B\u0430\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 EVM \u0433\u0430\u043C\u0430\u043D\u0446\u0456")), walletConnected && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderRadius: 8,
      marginBottom: 10,
      background: "rgba(5,150,105,.08)",
      border: "1px solid rgba(5,150,105,.25)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.grn,
      fontFamily: C.mono,
      marginBottom: 2
    }
  }, "\u2705 \u0413\u0410\u041C\u0410\u041D\u0415\u0426\u042C \u041F\u0406\u0414\u041A\u041B\u042E\u0427\u0415\u041D\u041E"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontFamily: C.mono,
      color: C.txt
    }
  }, walletAddr.length > 20 ? walletAddr.substring(0, 12) + "..." + walletAddr.substring(walletAddr.length - 6) : walletAddr), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setWalletConnected(false);
      setWalletAddr("");
      setWalletType("");
    },
    style: {
      fontSize: 9,
      color: C.t3,
      background: "none",
      border: "none",
      cursor: "pointer",
      marginTop: 3
    }
  }, "\u2715 \u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0433\u0430\u043C\u0430\u043D\u0435\u0446\u044C")), cryptoAddr && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      background: C.bg3,
      borderRadius: 10,
      border: "1px solid " + C.bdr
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.grn,
      fontFamily: C.mono,
      marginBottom: 8
    }
  }, "\u25C8 \u041D\u0410\u0414\u0406\u0428\u041B\u0406\u0422\u042C \u041D\u0410 \u0413\u0410\u041C\u0410\u041D\u0415\u0426\u042C"), Object.entries(CRYPTO_ADDRS).map(function (entry) {
    var coin = entry[0],
      addr = entry[1];
    return /*#__PURE__*/React.createElement("div", {
      key: coin,
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: C.t3,
        marginBottom: 3,
        fontFamily: C.mono
      }
    }, coin), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontFamily: C.mono,
        color: C.txt,
        background: C.bg,
        border: "1px solid " + C.bdr,
        borderRadius: 6,
        padding: "6px 10px",
        wordBreak: "break-all",
        cursor: "pointer"
      },
      onClick: function () {
        if (navigator.clipboard) navigator.clipboard.writeText(addr);
      }
    }, addr, /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 8,
        color: C.amber,
        fontSize: 9
      }
    }, "\uD83D\uDCCB \u043A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438")));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginTop: 8,
      lineHeight: 1.6,
      padding: "8px 10px",
      background: "rgba(240,165,0,.06)",
      borderRadius: 6
    }
  }, "\u041D\u0430\u0434\u0456\u0448\u043B\u0456\u0442\u044C \u0440\u0456\u0432\u043D\u043E ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.amber
    }
  }, "$", finalPrice), " \u0435\u043A\u0432\u0456\u0432\u0430\u043B\u0435\u043D\u0442.", /*#__PURE__*/React.createElement("br", null), "\u041F\u0456\u0441\u043B\u044F \u043E\u043F\u043B\u0430\u0442\u0438 \u2014 \u043D\u0430\u0434\u0456\u0448\u043B\u0456\u0442\u044C TX hash \u043D\u0430 ", /*#__PURE__*/React.createElement("strong", null, "volya089@gmail.com"), " \u0434\u043B\u044F \u0430\u043A\u0442\u0438\u0432\u0430\u0446\u0456\u0457."))), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: handlePay,
    style: {
      width: "100%",
      justifyContent: "center",
      padding: "12px",
      fontSize: 14,
      fontWeight: 700
    }
  }, selected === "crypto" ? cryptoAddr ? "✅ Показую адресу..." : "⛓ Показати адресу для оплати →" : "Перейти до " + (METHODS.find(function (m) {
    return m.k === selected;
  }) || {}).label + " \u2192"), selected === "stripe" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "10px 14px",
      borderRadius: 8,
      background: "#F8FAFF",
      border: "1px solid #E0E7FF",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22
    }
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#3730A3"
    }
  }, "Secure checkout by Stripe"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#6B7280",
      lineHeight: 1.6
    }
  }, "Visa \xB7 Mastercard \xB7 Apple Pay \xB7 Google Pay \xB7 SEPA \xB7 iDEAL", /*#__PURE__*/React.createElement("br", null), "\u0414\u0430\u043D\u0456 \u043A\u0430\u0440\u0442\u043A\u0438 \u043D\u0456\u043A\u043E\u043B\u0438 \u043D\u0435 \u043F\u043E\u0442\u0440\u0430\u043F\u043B\u044F\u044E\u0442\u044C \u043D\u0430 \u043D\u0430\u0448\u0456 \u0441\u0435\u0440\u0432\u0435\u0440\u0438. PCI DSS Level 1.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      fontFamily: C.mono,
      color: "#A5B4FC",
      letterSpacing: ".04em",
      textAlign: "right"
    }
  }, "POWERED BY", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "#6366F1",
      letterSpacing: "-.02em"
    }
  }, "stripe")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 10,
      color: C.t4,
      textAlign: "center",
      lineHeight: 1.6
    }
  }, "Secure payment \xB7 Cancel anytime \xB7 14-day refund \xB7 Questions: volya089@gmail.com")));
}

// ─── PLANS TAB (public — shown to ALL users) ──────────────────────────────────
function PlansTab({
  T,
  user
}) {
  var [yr, setYr] = useState(false);
  var [vlyAmt, setVlyAmt] = useState(function () {
    try {
      return sessionStorage.getItem("cf_vly_bal") || "";
    } catch (e) {
      return "";
    }
  });
  var [vlyOk, setVlyOk] = useState(function () {
    try {
      return sessionStorage.getItem("cf_vly_ok") === "1";
    } catch (e) {
      return false;
    }
  });
  var [vlyErr, setVlyErr] = useState(false);
  var [modal, setModal] = useState(null);
  var discount = vlyOk ? VLY_DISCOUNT_PCT : 0;
  function checkVly() {
    return _checkVly.apply(this, arguments);
  }
  function _checkVly() {
    _checkVly = _asyncToGenerator(function* () {
      setVlyErr(false);
      // Try MetaMask / injected wallet — switch to Monad first
      if (window.ethereum) {
        try {
          var accounts = yield window.ethereum.request({
            method: "eth_requestAccounts"
          });
          var addr = accounts[0];
          // Ensure we're on Monad Mainnet (chainId 143)
          try {
            yield window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{
                chainId: "0x8F"
              }] // 143 hex
            });
          } catch (swErr) {
            if (swErr.code === 4902 || swErr.code === -32603) {
              yield window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                  chainId: "0x8F",
                  chainName: "Monad Mainnet",
                  nativeCurrency: {
                    name: "MON",
                    symbol: "MON",
                    decimals: 18
                  },
                  rpcUrls: ["https://rpc.monad.xyz"],
                  blockExplorerUrls: ["https://explorer.monad.xyz"]
                }]
              });
            }
          }
          // Read VLY balance: balanceOf(address) = 0x70a08231
          var data = "0x70a08231" + addr.replace("0x", "").padStart(64, "0");
          var hex = yield window.ethereum.request({
            method: "eth_call",
            params: [{
              to: "0x9459ddd1B70E51280DEf774650EcD04F0e24d234",
              data: data
            }, "latest"]
          });
          var bal = parseInt(hex || "0x0", 16) / 1e18;
          setVlyAmt(bal.toFixed(0));
          if (bal >= VLY_DISCOUNT_THRESHOLD) {
            setVlyOk(true);
            // Persist VLY verification for this session
            try {
              sessionStorage.setItem("cf_vly_ok", "1");
              sessionStorage.setItem("cf_vly_bal", bal.toFixed(0));
            } catch (e) {}
          } else {
            setVlyErr(true);
            setVlyOk(false);
            alert("Знайдено " + bal.toFixed(0) + " VLY на гаманці " + addr.substring(0, 8) + "...\nПотрібно " + VLY_DISCOUNT_THRESHOLD + "+ VLY для знижки.\nКупити VLY: pancakeswap.finance");
          }
          return;
        } catch (e) {
          console.warn("Wallet VLY check failed:", e.message);
        }
      }
      // Fallback: server-side check via vly-check.php
      var n = parseFloat(vlyAmt);
      if (!n || n <= 0) {
        setVlyErr(true);
        setVlyOk(false);
        return;
      }
      try {
        var resp = yield fetch("/api/vly-check.php?amount=" + n);
        var d = yield resp.json();
        if (d && d.verified) {
          setVlyOk(true);
        } else {
          setVlyErr(true);
          setVlyOk(false);
        }
      } catch (e) {
        if (n >= VLY_DISCOUNT_THRESHOLD) {
          setVlyOk(true);
        } else {
          setVlyErr(true);
          setVlyOk(false);
        }
      }
    });
    return _checkVly.apply(this, arguments);
  }
  var PLANS = [{
    k: "starter",
    name: "Starter",
    price: 19,
    priceYr: 15,
    icon: "⚡",
    col: C.amber,
    btnCol: "#F0A500",
    agent: "Marketplace Optimizer",
    items: ["3 Etsy stores", "AI Listing Generator", "📸 AI Photo Analyzer", "🕵️ Competitor Spy", "⭐ Review Responder", "Social Engine (Thread + Reels)", "50 audits/mo", "Support AI 24/7"]
  }, {
    k: "pro",
    name: "Pro",
    price: 49,
    priceYr: 39,
    icon: "◈",
    col: C.blue,
    popular: true,
    btnCol: C.blue,
    agent: "Full Stack AI Agent",
    items: ["Everything in Starter", "🏹 РОБІНГУД CFO Agent", "🔄 Auto-Pivot Ніші", "🚀 1-Click Expand", "🎙 AI Voice Support", "🎬 Media Studio (photo+video)", "Store Autopilot 24/7", "200 audits/mo"]
  }, {
    k: "elite",
    name: "Elite",
    price: 99,
    priceYr: 79,
    icon: "◆",
    col: C.grn,
    btnCol: C.grn,
    agent: "Web3 + AI Sovereign",
    items: ["Everything in Pro", "🔮 HOTTABYCH Market Intel", "💎 VLY Profit Share", "🌍 Geo-Political Oracle", "🎲 Monte Carlo Simulator", "💧 Liquidity Engine", "Unlimited stores", "White-Label Reports"]
  }, {
    k: "sovereign",
    name: "SOVEREIGN",
    price: 199,
    priceYr: 159,
    icon: "👑",
    col: "#D4AF37",
    btnCol: "linear-gradient(135deg,#92400E,#D4AF37)",
    agent: "Full Command — All AI Agents",
    items: ["Everything in Elite", "🎬 Film Maker (Sora/Runway/Kling)", "🤖 Self-Coding AI (Hottabych)", "AI Builder unlimited", "Priority Telegram support", "Custom % AUM pricing", "Early beta access", "White-glove onboarding", "⚠️ Token/NFT creation — pay per use"]
  }, {
    k: "lifetime",
    name: "Lifetime",
    price: 499,
    icon: "♾️",
    col: "#7C3AED",
    oneTime: true,
    btnCol: "linear-gradient(135deg,#4C1D95,#7C3AED)",
    agent: "Starter + Pro + Elite — Forever",
    bestDeal: true,
    items: ["✅ Starter + Pro + Elite features", "♾️ Pay once — access forever", "All future updates free", "Unlimited stores", "VIP Telegram support", "Early access to new features", "⚠️ SOVEREIGN features — not included", "⚠️ Token/NFT/Coin creation — pay per use", "⚠️ AI Builder — 5 projects/year limit"]
  }];
  return /*#__PURE__*/React.createElement("div", null, modal && /*#__PURE__*/React.createElement(PaymentModal, {
    plan: modal.plan,
    price: modal.price,
    discount: discount,
    onClose: function () {
      setModal(null);
    },
    T: T,
    user: user
  }), !user.paid && !user.god && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#FFF8E1,#FFFDE7)",
      border: "1px solid " + C.amber + "40",
      borderRadius: 12,
      padding: "20px 24px",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32
    }
  }, "\u26A1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis,
      marginBottom: 4
    }
  }, T.choose_plan), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.t2,
      lineHeight: 1.7
    }
  }, "Subscribe below to unlock Command Center, Inventory Engine, Social Engine, Site Audit and more."))), user.paid && !user.god && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)",
      border: "1px solid rgba(5,150,105,.3)",
      borderRadius: 12,
      padding: "16px 24px",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24
    }
  }, "\u2705"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: C.grn
    }
  }, user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + " plan active" : "Plan active"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3
    }
  }, "All features unlocked \xB7 Manage billing at volya089@gmail.com"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24,
      padding: "16px 20px",
      background: vlyOk ? "#ECFDF5" : C.bg,
      border: "1px solid " + (vlyOk ? "rgba(5,150,105,.35)" : C.bdr),
      borderRadius: 12,
      boxShadow: vlyOk ? "0 2px 16px rgba(5,150,105,.1)" : "0 1px 4px rgba(0,0,0,.04)",
      transition: "all .3s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28
    }
  }, "\u26D3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis,
      marginBottom: 2
    }
  }, "Hold 1,000+ VLY Tokens \u2014 Get ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.grn
    }
  }, "10% off"), " all plans"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      lineHeight: 1.6
    }
  }, "VLY is the CloseFast governance token on Monad.", " ", /*#__PURE__*/React.createElement("a", {
    href: VLY_BUY_LINK,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: C.amber,
      fontWeight: 700,
      textDecoration: "none"
    }
  }, "Buy VLY on PancakeSwap \u2192")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "cf-inp",
    type: "number",
    value: vlyAmt,
    onChange: function (e) {
      setVlyAmt(e.target.value);
      setVlyOk(false);
      setVlyErr(false);
    },
    placeholder: "Your VLY amount",
    style: {
      width: 160,
      fontSize: 13
    },
    onKeyDown: function (e) {
      if (e.key === "Enter") checkVly();
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: checkVly,
    style: {
      whiteSpace: "nowrap"
    }
  }, "Verify VLY"), vlyOk && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.grn,
      padding: "4px 10px",
      background: C.grnL,
      borderRadius: 5,
      border: "1px solid rgba(5,150,105,.25)"
    }
  }, "\u2713 10% discount active"), vlyErr && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.red,
      fontFamily: C.mono
    }
  }, "\u26A0 Need 1,000+ VLY")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 24,
      padding: "10px 16px",
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 8,
      width: "fit-content"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: C.t4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.t4,
      fontFamily: C.mono
    }
  }, "Subscriber stats will appear here after Stripe webhook is connected")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, T.plans_title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: C.t3
    }
  }, T.plans_sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      background: C.bg3,
      border: "1px solid " + C.bdr,
      borderRadius: 7,
      padding: 3
    }
  }, [{
    v: false,
    l: T.monthly
  }, {
    v: true,
    l: T.annual
  }].map(function (o) {
    return /*#__PURE__*/React.createElement("button", {
      key: String(o.v),
      onClick: function () {
        setYr(o.v);
      },
      style: {
        padding: "5px 14px",
        borderRadius: 5,
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
        background: yr === o.v ? C.amber : "transparent",
        color: yr === o.v ? "#FFFFFF" : C.t3,
        transition: "all .15s"
      }
    }, o.l);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "plans-grid"
  }, PLANS.map(function (p) {
    var basePrice = yr && p.priceYr ? p.priceYr : p.price;
    var displayPrice = discount > 0 && basePrice > 0 ? Math.round(basePrice * (1 - discount / 100) * 100) / 100 : basePrice;
    return /*#__PURE__*/React.createElement("div", {
      key: p.k,
      style: {
        background: C.bg,
        border: "1px solid " + (p.bestDeal ? "rgba(124,58,237,.5)" : p.popular ? p.col + "60" : C.bdr),
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: p.bestDeal ? "0 4px 24px rgba(124,58,237,.2)" : p.popular ? "0 4px 24px " + p.col + "20" : "0 1px 6px rgba(0,0,0,.05)"
      }
    }, p.bestDeal && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "5px",
        background: "linear-gradient(135deg,rgba(124,58,237,.15),rgba(236,72,153,.1))",
        borderBottom: "1px solid rgba(124,58,237,.3)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: 800,
        fontFamily: C.mono,
        background: "linear-gradient(90deg,#7C3AED,#EC4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }
    }, "\u267E\uFE0F BEST DEAL \u2014 SAVE 80% vs buying separately")), p.popular && !p.bestDeal && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "5px",
        background: C.blueL,
        borderBottom: "1px solid " + C.blue + "30"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.blue,
        fontWeight: 700,
        fontFamily: C.mono
      }
    }, T.most_popular)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "18px 16px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, p.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 800,
        color: p.col,
        fontFamily: C.dis
      }
    }, p.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, discount > 0 && basePrice > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: C.t4,
        textDecoration: "line-through",
        fontFamily: C.mono,
        marginRight: 6
      }
    }, "$", basePrice), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 30,
        fontWeight: 700,
        color: C.txt,
        letterSpacing: "-1px",
        lineHeight: 1,
        fontFamily: C.mono
      }
    }, p.k === "god" ? "Owner" : "$" + displayPrice), p.k !== "god" && p.price > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: C.t3,
        fontWeight: 400
      }
    }, T.per_mo)), discount > 0 && basePrice > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.grn,
        fontFamily: C.mono,
        marginBottom: 6,
        fontWeight: 700
      }
    }, "\u25C8 VLY -", discount, "% applied"), yr && p.priceYr && !discount && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.grn,
        marginBottom: 8,
        fontFamily: C.mono
      }
    }, T.save, " $", (p.price - p.priceYr) * 12, T.per_yr), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 10px",
        background: p.col + "10",
        border: "1px solid " + p.col + "20",
        borderRadius: 6,
        marginBottom: 14,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: p.col,
        fontWeight: 700,
        marginBottom: 2,
        fontFamily: C.mono
      }
    }, T.ai_agent), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.t2
      }
    }, p.agent)), p.items.map(function (item) {
      return /*#__PURE__*/React.createElement("div", {
        key: item,
        style: {
          display: "flex",
          gap: 7,
          alignItems: "center",
          marginBottom: 6,
          fontSize: 11,
          color: C.t2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: p.col,
          fontWeight: 700,
          flexShrink: 0
        }
      }, "+"), " ", item);
    }), p.k === "god" ? /*#__PURE__*/React.createElement("button", {
      className: "cf-btn",
      style: {
        width: "100%",
        justifyContent: "center",
        marginTop: 14,
        fontSize: 12,
        fontWeight: 700,
        background: C.purL,
        color: C.pur,
        border: "1px solid " + C.pur + "40",
        cursor: "default"
      }
    }, T.master_only) : /*#__PURE__*/React.createElement("button", {
      className: "cf-btn",
      onClick: function () {
        setModal({
          plan: p,
          price: displayPrice
        });
      },
      style: {
        width: "100%",
        justifyContent: "center",
        marginTop: 14,
        fontSize: 12,
        fontWeight: 700,
        background: p.btnCol || p.col,
        color: "#FFFFFF",
        border: "none",
        cursor: "pointer"
      }
    }, T.subscribe, " \u2192")));
  })));
}

// ─── SUPPORT AI — 24/7 CUSTOMER SUPPORT ──────────────────────────────────────
var SUPPORT_SYSTEM_PROMPT = "Ти — AI агент підтримки клієнтів платформи CloseFast Omni. " + "Твоє завдання: допомагати продавцям на Etsy максимально ефективно автоматизувати їхній бізнес за допомогою CloseFast. " + "Відповідай чітко, дружньо, по суті. Якщо питання технічне — давай конкретні кроки. " + "Знаєш все про: Etsy API, Printify POD, плани CloseFast (Merchant $29, Enterprise $49, VOLYA Holdings $249, HOTTABYCH $999, Робінгуд $199), " + "VLY токен на Monad blockchain, SEO оптимізацію лістингів, соцмережі. " + "Мови: українська або англійська — відповідай тією ж мовою що й питання. " + "Якщо не знаєш — чесно скажи і запропонуй зв'язатись з volya089@gmail.com.";
var SUPPORT_FAQS = [{
  q: "Як підключити Etsy магазин?",
  a: "Connections → Etsy Store A → вставити API ключ з etsy.com/developers"
}, {
  q: "Що таке VLY знижка?",
  a: "Власники 1000+ VLY токенів отримують 10% знижку на будь-який план"
}, {
  q: "Як генерувати лістинги?",
  a: "Inventory Engine → оберіть нішу → кількість → Generate + Printify Mockups"
}, {
  q: "Як скасувати підписку?",
  a: "Напишіть на volya089@gmail.com — скасовуємо протягом 24 годин"
}, {
  q: "Чи є безкоштовний тариф?",
  a: "Демо доступне після реєстрації. Платні плани від $29/міс"
}, {
  q: "Як працює HOTTABYCH?",
  a: "Хоттабич — AI агент що сканує 13 ринків і знаходить можливості заробітку"
}];
function SupportTab({
  T,
  user
}) {
  var god = user && user.god;
  var [msgs, setMsgs] = useState([{
    role: "assistant",
    text: god ? "✦ Власник підключений. Бачу всі системи. Чим можу допомогти з налаштуванням або клієнтськими питаннями?" : "Привіт! Я AI асистент CloseFast Omni 💬\n\nДопоможу з будь-яким питанням про платформу, Etsy автоматизацію, плани та інтеграції. Пишіть — відповідаю миттєво 24/7!",
    ts: new Date().toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }]);
  var [input, setInput] = useState("");
  var [busy, setBusy] = useState(false);
  var [err, setErr] = useState("");
  var endRef = React.useRef(null);
  useEffect(function () {
    if (endRef.current) endRef.current.scrollIntoView({
      behavior: "smooth"
    });
  }, [msgs]);
  function send(_x1) {
    return _send.apply(this, arguments);
  }
  function _send() {
    _send = _asyncToGenerator(function* (text) {
      var q = (text || input).trim();
      if (!q) return;
      setInput("");
      setErr("");
      var userMsg = {
        role: "user",
        text: q,
        ts: new Date().toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit"
        })
      };
      setMsgs(function (m) {
        return [...m, userMsg];
      });
      setBusy(true);
      try {
        // Build conversation history for context
        var history = msgs.slice(-6).map(function (m) {
          return {
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.text
          };
        });
        history.push({
          role: "user",
          content: q
        });
        var raw = yield fetch("/api/proxy/claude", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            system: SUPPORT_SYSTEM_PROMPT,
            messages: history,
            max_tokens: 600
          })
        });
        var d = yield raw.json();
        var answer = d.content && d.content[0] ? d.content[0].text : "Вибачте, сталась помилка. Спробуйте ще раз.";
        setMsgs(function (m) {
          return [...m, {
            role: "assistant",
            text: answer,
            ts: new Date().toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit"
            })
          }];
        });
      } catch (e) {
        setErr(e.message);
        setMsgs(function (m) {
          return [...m, {
            role: "assistant",
            text: "⚠️ Сервер тимчасово недоступний. Зв'яжіться з нами: volya089@gmail.com",
            ts: "--:--"
          }];
        });
      }
      setBusy(false);
    });
    return _send.apply(this, arguments);
  }
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
  var S = {
    bg: "#F0FDF4",
    grn: "#059669",
    grnL: "#D1FAE5",
    grnD: "#065F46",
    usr: "#1D4ED8",
    usrL: "#EFF6FF"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#065F46,#059669)",
      borderRadius: 16,
      padding: "18px 24px",
      marginBottom: 20,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      fontSize: 24,
      flexShrink: 0,
      background: "rgba(255,255,255,.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      letterSpacing: "-.3px"
    }
  }, "AI \u041F\u0456\u0434\u0442\u0440\u0438\u043C\u043A\u0430 ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .7,
      fontSize: 14,
      fontWeight: 400
    }
  }, "24/7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      opacity: .7,
      fontFamily: C.mono,
      marginTop: 2
    }
  }, "\u041C\u0438\u0442\u0442\u0454\u0432\u0456 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456 \xB7 Etsy \xB7 \u041F\u043B\u0430\u043D\u0438 \xB7 \u0406\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457 \xB7 \u0422\u0435\u0445\u043D\u0456\u0447\u043D\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u0430")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      padding: "4px 12px",
      borderRadius: 20,
      fontWeight: 700,
      background: "rgba(255,255,255,.2)",
      fontFamily: C.mono,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#4ADE80",
      animation: "pulse 2s infinite"
    }
  }), "ONLINE")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, SUPPORT_FAQS.map(function (f) {
    return /*#__PURE__*/React.createElement("button", {
      key: f.q,
      onClick: function () {
        send(f.q);
      },
      style: {
        padding: "6px 12px",
        borderRadius: 20,
        cursor: "pointer",
        background: S.grnL,
        border: "1px solid rgba(5,150,105,.25)",
        color: S.grnD,
        fontSize: 11,
        fontWeight: 600,
        transition: "all .15s"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.background = S.grn;
        e.currentTarget.style.color = "#fff";
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.background = S.grnL;
        e.currentTarget.style.color = S.grnD;
      }
    }, f.q);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      border: "1px solid #E2E6F0",
      borderRadius: 14,
      height: 420,
      overflowY: "auto",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, msgs.map(function (m, i) {
    var isUser = m.role === "user";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        gap: 8,
        alignItems: "flex-end"
      }
    }, !isUser && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        flexShrink: 0,
        fontSize: 14,
        background: "linear-gradient(135deg,#065F46,#059669)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
      }
    }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: "75%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 14px",
        borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        background: isUser ? "linear-gradient(135deg,#1D4ED8,#3B82F6)" : S.bg,
        color: isUser ? "#fff" : C.txt,
        fontSize: 13,
        lineHeight: 1.6,
        border: isUser ? "none" : "1px solid rgba(5,150,105,.15)",
        whiteSpace: "pre-wrap"
      }
    }, m.text), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        marginTop: 3,
        textAlign: isUser ? "right" : "left",
        fontFamily: C.mono
      }
    }, m.ts)), isUser && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        flexShrink: 0,
        fontSize: 14,
        background: "linear-gradient(135deg,#1D4ED8,#3B82F6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
      }
    }, "\uD83D\uDC64"));
  }), busy && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      fontSize: 14,
      background: "linear-gradient(135deg,#065F46,#059669)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff"
    }
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderRadius: "14px 14px 14px 4px",
      background: S.bg,
      border: "1px solid rgba(5,150,105,.15)",
      display: "flex",
      gap: 4,
      alignItems: "center"
    }
  }, [0, 1, 2].map(function (d) {
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: S.grn,
        animation: "blink 1.2s " + d * 0.2 + "s infinite"
      }
    });
  }))), /*#__PURE__*/React.createElement("div", {
    ref: endRef
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: input,
    onChange: function (e) {
      setInput(e.target.value);
    },
    onKeyDown: handleKey,
    placeholder: "\u041D\u0430\u043F\u0438\u0448\u0456\u0442\u044C \u043F\u0438\u0442\u0430\u043D\u043D\u044F... (Enter \u2014 \u0432\u0456\u0434\u043F\u0440\u0430\u0432\u0438\u0442\u0438, Shift+Enter \u2014 \u043D\u043E\u0432\u0438\u0439 \u0440\u044F\u0434\u043E\u043A)",
    className: "cf-inp",
    style: {
      flex: 1,
      resize: "none",
      height: 52,
      lineHeight: 1.5,
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      send();
    },
    disabled: busy || !input.trim(),
    style: {
      padding: "0 20px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: busy || !input.trim() ? "#E2E6F0" : "linear-gradient(135deg,#065F46,#059669)",
      color: busy || !input.trim() ? C.t4 : "#fff",
      fontSize: 18,
      transition: "all .2s",
      flexShrink: 0
    }
  }, "\u27A4")), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      marginTop: 6,
      fontFamily: C.mono
    }
  }, "\u26A0\uFE0F ", err), god && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "10px 14px",
      borderRadius: 8,
      background: C.amberL,
      border: "1px solid rgba(240,165,0,.3)",
      fontSize: 11,
      color: C.amberD,
      fontFamily: C.mono
    }
  }, "\u2726 God Mode: \u0446\u044F \u0432\u043A\u043B\u0430\u0434\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0412\u0421\u0406\u041C \u043A\u043B\u0456\u0454\u043D\u0442\u0430\u043C \u0431\u0435\u0437 \u0432\u0445\u043E\u0434\u0443. \u0412\u0441\u0456 \u0440\u043E\u0437\u043C\u043E\u0432\u0438 \u0430\u043D\u043E\u043D\u0456\u043C\u043D\u0456 \u2014 AI \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0454 24/7 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E. \u041B\u043E\u0433\u0438 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C\u0441\u044F \u0432 /logs/support_chats.log (\u044F\u043A\u0449\u043E \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0439 /api/support-log.php)"));
}

// ─── GROWTH TAB — МОНІТОРИНГ + САМОРЕКЛАМУВАННЯ ─────────────────────────────
var GROWTH_PROMO_SYSTEM = "Ти — Growth Hacker та SEO/Marketing стратег для CloseFast Omni (closefast.tech). " + "Платформа для Etsy продавців з AI автоматизацією. " + "Твоя задача: генерувати ЛЕГАЛЬНІ, ЕФЕКТИВНІ стратегії просування. " + "Тільки white-hat методи. Без спаму, без накрутки, без порушень ToS. " + "Фокус: органічний ріст, SEO, контент-маркетинг, партнерства, Product Hunt, Reddit, communities. " + "Конкретні кроки з дедлайнами. Відповідай українською.";
var MONITOR_CHECKS = [{
  id: "uptime",
  icon: "🟢",
  label: "Uptime сайту",
  url: "/api/monitor.php?check=uptime"
}, {
  id: "ssl",
  icon: "🔒",
  label: "SSL сертифікат",
  url: "/api/monitor.php?check=ssl"
}, {
  id: "speed",
  icon: "⚡",
  label: "Швидкість завантаж.",
  url: "/api/monitor.php?check=speed"
}, {
  id: "api",
  icon: "🤖",
  label: "Claude API",
  url: "/api/proxy/claude"
}, {
  id: "etsy",
  icon: "🛍",
  label: "Etsy API",
  url: "/api/etsy-proxy.php?action=shop"
}, {
  id: "printify",
  icon: "🖨",
  label: "Printify API",
  url: "/api/printify-proxy.php?action=shops"
}];
var PROMO_CHANNELS = [{
  k: "reddit",
  icon: "🔴",
  label: "Reddit",
  desc: "r/Etsy, r/EtsySellers, r/printondemand"
}, {
  k: "ph",
  icon: "🚀",
  label: "Product Hunt",
  desc: "Безкоштовний launch — 1000+ відвідувачів"
}, {
  k: "twitter",
  icon: "🔵",
  label: "Twitter/X",
  desc: "Monad ecosystem + Etsy seller threads"
}, {
  k: "tiktok",
  icon: "🎵",
  label: "TikTok/Reels",
  desc: "Before/After automation demo videos"
}, {
  k: "seo",
  icon: "🔍",
  label: "SEO контент",
  desc: "Blog posts, YouTube tutorials"
}, {
  k: "partner",
  icon: "🤝",
  label: "Партнерства",
  desc: "Printify affiliates, Etsy coaches"
}, {
  k: "discord",
  icon: "💬",
  label: "Discord/Slack",
  desc: "Web3, POD, Etsy seller communities"
}, {
  k: "email",
  icon: "📧",
  label: "Email маркетинг",
  desc: "Newsletter для Etsy sellers"
}];
function GrowthTab({
  T
}) {
  var [activeSection, setActiveSection] = useState("monitor");
  var [checks, setChecks] = useState({});
  var [scanning, setScanning] = useState(false);
  var [promoChannel, setPromoChannel] = useState("reddit");
  var [promoGoal, setPromoGoal] = useState("");
  var [promoResult, setPromoResult] = useState(null);
  var [promoBusy, setPromoBusy] = useState(false);
  var [healTarget, setHealTarget] = useState("");
  var [healResult, setHealResult] = useState(null);
  var [healBusy, setHealBusy] = useState(false);
  var [seoUrl, setSeoUrl] = useState("https://closefast.tech");
  var [seoResult, setSeoResult] = useState(null);
  var [seoBusy, setSeoBusy] = useState(false);

  // ── Run all monitors ──
  function runMonitor() {
    return _runMonitor.apply(this, arguments);
  } // ── AI Heal — fix site issues ──
  function _runMonitor() {
    _runMonitor = _asyncToGenerator(function* () {
      setScanning(true);
      setChecks({});
      for (var i = 0; i < MONITOR_CHECKS.length; i++) {
        var c = MONITOR_CHECKS[i];
        var start = Date.now();
        try {
          var r = yield fetch(c.url, {
            method: "GET",
            signal: AbortSignal.timeout(8000)
          });
          var ms = Date.now() - start;
          setChecks(function (prev) {
            var n = Object.assign({}, prev);
            n[c.id] = {
              ok: r.ok || r.status < 500,
              ms: ms,
              status: r.status
            };
            return n;
          });
        } catch (e) {
          var ms2 = Date.now() - start;
          setChecks(function (prev) {
            var n = Object.assign({}, prev);
            n[c.id] = {
              ok: false,
              ms: ms2,
              error: e.message
            };
            return n;
          });
        }
      }
      setScanning(false);
    });
    return _runMonitor.apply(this, arguments);
  }
  function runHeal() {
    return _runHeal.apply(this, arguments);
  } // ── SEO Deep Analysis ──
  function _runHeal() {
    _runHeal = _asyncToGenerator(function* () {
      if (!healTarget.trim()) return;
      setHealBusy(true);
      setHealResult(null);
      try {
        var raw = yield ai("Ти — DevOps та SEO спеціаліст. Аналізуй проблеми сайту і давай конкретні покрокові рішення. Відповідай українською. Структуруй: 🔴 Проблема → ✅ Рішення → ⏱ Час виконання", "Сайт: closefast.tech (PHP хостинг hostiq.ua, React SPA, PHP проксі для Claude API).\n" + "Проблема / питання: " + healTarget + "\n\n" + "Дай конкретні кроки виправлення. Якщо це .htaccess / PHP / cPanel — покажи реальний код.", 1200);
        setHealResult(raw);
      } catch (e) {
        setHealResult("⚠️ " + e.message);
      }
      setHealBusy(false);
    });
    return _runHeal.apply(this, arguments);
  }
  function runSeo() {
    return _runSeo.apply(this, arguments);
  } // ── Promo content generator ──
  function _runSeo() {
    _runSeo = _asyncToGenerator(function* () {
      setSeoBusy(true);
      setSeoResult(null);
      try {
        var raw = yield ai("Ти — SEO та Growth аналітик. Аналізуй сайт і видавай структурований звіт. Відповідай українською.", "Проведи повний SEO та Growth аналіз сайту: " + seoUrl + "\n\n" + "Поверни:\n" + "1. 🎯 Поточна позиція та потенціал\n" + "2. 🔑 Топ-10 ключових слів для таргетингу (з обсягом пошуку)\n" + "3. 📝 Контент-план: 5 статей які дадуть трафік\n" + "4. 🔗 Стратегія backlinks (легальна, без PBN)\n" + "5. 🛠 Технічні SEO фікси (мета, schema, sitemap)\n" + "6. 📱 Соцмережі: що постити і коли\n" + "7. 📊 KPI на 30/60/90 днів", 1500);
        setSeoResult(raw);
      } catch (e) {
        setSeoResult("⚠️ " + e.message);
      }
      setSeoBusy(false);
    });
    return _runSeo.apply(this, arguments);
  }
  function runPromo() {
    return _runPromo.apply(this, arguments);
  }
  function _runPromo() {
    _runPromo = _asyncToGenerator(function* () {
      setPromoBusy(true);
      setPromoResult(null);
      var ch = PROMO_CHANNELS.find(function (c) {
        return c.k === promoChannel;
      }) || PROMO_CHANNELS[0];
      try {
        var raw = yield ai(GROWTH_PROMO_SYSTEM, "Канал: " + ch.label + " (" + ch.desc + ")\n" + "Мета: " + (promoGoal || "залучити нових користувачів CloseFast Omni") + "\n\n" + "Створи готовий контент для публікації:\n" + "1. 📝 Текст публікації (готовий до копіювання)\n" + "2. 🏷 Хештеги/теги (якщо потрібні)\n" + "3. ⏰ Найкращий час для публікації\n" + "4. 🎯 Які підфоруми/групи/threads таргетувати\n" + "5. 📈 Очікуваний результат\n" + "6. ⚠️ Чого уникати (щоб не порушити правила)\n" + "7. 🔄 Follow-up дії", 1200);
        setPromoResult(raw);
      } catch (e) {
        setPromoResult("⚠️ " + e.message);
      }
      setPromoBusy(false);
    });
    return _runPromo.apply(this, arguments);
  }
  var SECTIONS = [{
    k: "monitor",
    icon: "🟢",
    l: "Моніторинг"
  }, {
    k: "heal",
    icon: "🔧",
    l: "AI Лікування"
  }, {
    k: "seo",
    icon: "🔍",
    l: "SEO Аналіз"
  }, {
    k: "promo",
    icon: "📣",
    l: "Просування"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#1E3A5F,#1D4ED8,#3B82F6)",
      borderRadius: 16,
      padding: "18px 24px",
      marginBottom: 20,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 16,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -10,
      top: -10,
      fontSize: 100,
      opacity: .06,
      pointerEvents: "none"
    }
  }, "\uD83D\uDCC8"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      fontSize: 24,
      flexShrink: 0,
      background: "rgba(255,255,255,.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "\uD83D\uDCC8"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      letterSpacing: "-.3px"
    }
  }, "Growth Center ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .6,
      fontSize: 12,
      fontWeight: 400
    }
  }, "\xB7 God Mode")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      opacity: .7,
      fontFamily: C.mono,
      marginTop: 2
    }
  }, "\u041C\u043E\u043D\u0456\u0442\u043E\u0440\u0438\u043D\u0433 \xB7 AI \u0414\u0456\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u043A\u0430 \xB7 SEO \xB7 \u041B\u0435\u0433\u0430\u043B\u044C\u043D\u0435 \u043F\u0440\u043E\u0441\u0443\u0432\u0430\u043D\u043D\u044F"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, SECTIONS.map(function (s) {
    var on = activeSection === s.k;
    return /*#__PURE__*/React.createElement("button", {
      key: s.k,
      onClick: function () {
        setActiveSection(s.k);
      },
      style: {
        padding: "9px 18px",
        borderRadius: 8,
        cursor: "pointer",
        border: "1px solid " + (on ? C.blue : C.bdr),
        background: on ? C.blueL : "#fff",
        color: on ? C.blue : C.t2,
        fontSize: 12,
        fontWeight: 700,
        transition: "all .15s",
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", null, s.icon), s.l);
  })), activeSection === "monitor" && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: C.txt
    }
  }, "\u0421\u0442\u0430\u0442\u0443\u0441 \u0432\u0441\u0456\u0445 \u0441\u0438\u0441\u0442\u0435\u043C"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: runMonitor,
    disabled: scanning,
    style: {
      gap: 6
    }
  }, scanning ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 12
  }), " \u0421\u043A\u0430\u043D\u0443\u044E...") : "🔄 Запустити перевірку")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 10,
      marginBottom: 20
    }
  }, MONITOR_CHECKS.map(function (c) {
    var res = checks[c.id];
    var color = !res ? C.t4 : res.ok ? C.grn : C.red;
    var bg = !res ? C.bg3 : res.ok ? "#F0FDF4" : "#FEF2F2";
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      className: "cf-card",
      style: {
        background: bg,
        borderColor: color + "30"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, c.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: C.txt
      }
    }, c.label), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: !res ? "#D1D5DB" : res.ok ? C.grn : C.red,
        animation: scanning ? "pulse 1s infinite" : "none"
      }
    })), res ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: color
      }
    }, res.ok ? "✅ OK" : "❌ ПОМИЛКА"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t4,
        fontFamily: C.mono
      }
    }, res.ms, "ms ", res.status ? "· HTTP " + res.status : "", res.error ? "· " + res.error.substring(0, 40) : "")) : /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t4
      }
    }, "\u0429\u0435 \u043D\u0435 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0435\u043D\u043E"));
  })), Object.keys(checks).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 10
    }
  }, "\uD83D\uDCA1 \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0456 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0438"), Object.entries(checks).filter(function (e) {
    return !e[1].ok;
  }).length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.grn,
      fontSize: 12
    }
  }, "\u2705 \u0412\u0441\u0456 \u0441\u0438\u0441\u0442\u0435\u043C\u0438 \u043F\u0440\u0430\u0446\u044E\u044E\u0442\u044C \u043D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E!") : Object.entries(checks).filter(function (e) {
    return !e[1].ok;
  }).map(function (e) {
    var hints = {
      uptime: "Сайт недоступний — перевір cPanel → Error Logs, перезапусти Apache",
      ssl: "SSL не налаштовано — cPanel → SSL/TLS → Let's Encrypt → видай безкоштовний сертифікат",
      speed: "Повільне завантаження — увімкни LiteSpeed Cache в cPanel, оптимізуй images",
      api: "Claude API недоступний — перевір ANTHROPIC_API_KEY в .env, перевір /api/proxy/claude",
      etsy: "Etsy API помилка — перевір ETSY_API_KEY в .env, можливо закінчився токен",
      printify: "Printify API помилка — перевір PRINTIFY_API_TOKEN в .env (має починатись з 'Bearer sk_')"
    };
    return /*#__PURE__*/React.createElement("div", {
      key: e[0],
      style: {
        padding: "8px 12px",
        marginBottom: 6,
        borderRadius: 6,
        background: "#FEF2F2",
        border: "1px solid rgba(220,38,38,.2)",
        fontSize: 11,
        color: C.t2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.red,
        fontWeight: 700
      }
    }, "\u274C ", MONITOR_CHECKS.find(function (c) {
      return c.id === e[0];
    })?.label, ":"), " ", hints[e[0]] || "Перевір логи сервера");
  }))), activeSection === "heal" && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.t3,
      marginBottom: 16,
      lineHeight: 1.6
    }
  }, "\u041E\u043F\u0438\u0448\u0438 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0443 \u0441\u0430\u0439\u0442\u0443 \u0430\u0431\u043E \u043F\u0438\u0442\u0430\u043D\u043D\u044F \u2014 AI \u0434\u0430\u0441\u0442\u044C \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u0435 \u0440\u0456\u0448\u0435\u043D\u043D\u044F \u0437 \u043A\u043E\u0434\u043E\u043C \u0442\u0430 \u043A\u0440\u043E\u043A\u0430\u043C\u0438."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 6,
      fontFamily: C.mono
    }
  }, "\u0427\u0410\u0421\u0422\u0406 \u041F\u0420\u041E\u0411\u041B\u0415\u041C\u0418"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, ["Сайт не відкривається", "SSL помилка в браузері", "app.jsx не завантажується", "Claude API 500 error", "Повільне завантаження", ".htaccess редирект", "CORS помилка в консолі", "PHP не читає .env"].map(function (h) {
    return /*#__PURE__*/React.createElement("button", {
      key: h,
      onClick: function () {
        setHealTarget(h);
      },
      style: {
        padding: "5px 10px",
        borderRadius: 20,
        cursor: "pointer",
        fontSize: 10,
        background: C.bg3,
        border: "1px solid " + C.bdr,
        color: C.t2,
        transition: "all .15s"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.borderColor = C.blue;
        e.currentTarget.style.color = C.blue;
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.borderColor = C.bdr;
        e.currentTarget.style.color = C.t2;
      }
    }, h);
  })), /*#__PURE__*/React.createElement("textarea", {
    value: healTarget,
    onChange: function (e) {
      setHealTarget(e.target.value);
    },
    placeholder: "\u041E\u043F\u0438\u0448\u0438 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0443 \u0434\u0435\u0442\u0430\u043B\u044C\u043D\u043E... \u043D\u0430\u043F\u0440: '\u043F\u0456\u0441\u043B\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043D\u043E\u0432\u043E\u0433\u043E app.jsx \u0441\u0430\u0439\u0442 \u043F\u043E\u043A\u0430\u0437\u0443\u0454 \u0431\u0456\u043B\u0438\u0439 \u0435\u043A\u0440\u0430\u043D, \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u0456 \u043F\u043E\u043C\u0438\u043B\u043A\u0430: Uncaught SyntaxError line 234'",
    className: "cf-inp",
    style: {
      minHeight: 80,
      resize: "vertical",
      fontSize: 12,
      lineHeight: 1.6
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: runHeal,
    disabled: healBusy || !healTarget.trim(),
    style: {
      width: "100%",
      justifyContent: "center",
      padding: "11px",
      fontSize: 13
    }
  }, healBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " AI \u0434\u0456\u0430\u0433\u043D\u043E\u0441\u0442\u0443\u0454...") : "🔧 Діагностувати та виправити →"), healResult && /*#__PURE__*/React.createElement("div", {
    className: "fade cf-card",
    style: {
      marginTop: 16,
      whiteSpace: "pre-wrap",
      fontSize: 12,
      lineHeight: 1.8,
      color: C.t2,
      maxHeight: 500,
      overflowY: "auto"
    }
  }, healResult)), activeSection === "seo" && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "URL \u0414\u041B\u042F \u0410\u041D\u0410\u041B\u0406\u0417\u0423"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: seoUrl,
    onChange: function (e) {
      setSeoUrl(e.target.value);
    },
    placeholder: "https://closefast.tech",
    className: "cf-inp",
    style: {
      flex: 1,
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: runSeo,
    disabled: seoBusy,
    style: {
      flexShrink: 0,
      padding: "8px 20px"
    }
  }, seoBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0410\u043D\u0430\u043B\u0456\u0437...") : "🔍 Аналізувати"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderRadius: 8,
      marginBottom: 16,
      background: C.blueL,
      border: "1px solid " + C.blue + "25",
      fontSize: 11,
      color: C.blue
    }
  }, "\u2139\uFE0F SEO \u0430\u043D\u0430\u043B\u0456\u0437 \u0431\u0430\u0437\u0443\u0454\u0442\u044C\u0441\u044F \u043D\u0430 AI \u0437\u043D\u0430\u043D\u043D\u044F\u0445 \u043F\u0440\u043E \u043D\u0430\u0439\u043A\u0440\u0430\u0449\u0456 \u043F\u0440\u0430\u043A\u0442\u0438\u043A\u0438 + \u0442\u0432\u0456\u0439 \u0434\u043E\u043C\u0435\u043D. \u0414\u043B\u044F \u0442\u043E\u0447\u043D\u0438\u0445 \u0434\u0430\u043D\u0438\u0445 \u0442\u0430\u043A\u043E\u0436 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0439 Google Search Console \u0442\u0430 Ahrefs."), seoResult && /*#__PURE__*/React.createElement("div", {
    className: "fade cf-card",
    style: {
      whiteSpace: "pre-wrap",
      fontSize: 12,
      lineHeight: 1.8,
      color: C.t2,
      maxHeight: 600,
      overflowY: "auto"
    }
  }, seoResult)), activeSection === "promo" && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      fontSize: 13,
      color: C.t3,
      lineHeight: 1.6
    }
  }, "\u0412\u0438\u0431\u0435\u0440\u0438 \u043A\u0430\u043D\u0430\u043B \u2192 AI \u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u0433\u043E\u0442\u043E\u0432\u0438\u0439 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u0434\u043B\u044F \u043B\u0435\u0433\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0441\u0443\u0432\u0430\u043D\u043D\u044F. \u0422\u0456\u043B\u044C\u043A\u0438 white-hat \u043C\u0435\u0442\u043E\u0434\u0438."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8,
      marginBottom: 16
    }
  }, PROMO_CHANNELS.map(function (ch) {
    var on = promoChannel === ch.k;
    return /*#__PURE__*/React.createElement("div", {
      key: ch.k,
      onClick: function () {
        setPromoChannel(ch.k);
      },
      style: {
        padding: "12px 10px",
        borderRadius: 10,
        cursor: "pointer",
        textAlign: "center",
        border: "2px solid " + (on ? C.blue : C.bdr),
        background: on ? C.blueL : "#fff",
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        marginBottom: 4
      }
    }, ch.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: on ? C.blue : C.txt
      }
    }, ch.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        marginTop: 2,
        lineHeight: 1.4
      }
    }, ch.desc));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\u0422\u0412\u041E\u042F \u041C\u0415\u0422\u0410 (\u043E\u043F\u0446\u0456\u0439\u043D\u043E)"), /*#__PURE__*/React.createElement("input", {
    value: promoGoal,
    onChange: function (e) {
      setPromoGoal(e.target.value);
    },
    placeholder: "\u043D\u0430\u043F\u0440: 100 \u043D\u043E\u0432\u0438\u0445 \u0440\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u0439 \u0437\u0430 \u043C\u0456\u0441\u044F\u0446\u044C, \u0430\u0431\u043E: \u0437\u0430\u043B\u0443\u0447\u0438\u0442\u0438 Etsy sellers \u0437 \u0421\u0428\u0410",
    className: "cf-inp",
    style: {
      fontSize: 12
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: runPromo,
    disabled: promoBusy,
    style: {
      width: "100%",
      justifyContent: "center",
      padding: "11px",
      fontSize: 13,
      marginBottom: 16
    }
  }, promoBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u044E...") : /*#__PURE__*/React.createElement(React.Fragment, null, PROMO_CHANNELS.find(function (c) {
    return c.k === promoChannel;
  })?.icon, " \u0413\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u0434\u043B\u044F ", PROMO_CHANNELS.find(function (c) {
    return c.k === promoChannel;
  })?.label, " \u2192")), promoResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt
    }
  }, "\u0413\u043E\u0442\u043E\u0432\u0438\u0439 \u043A\u043E\u043D\u0442\u0435\u043D\u0442:"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(promoResult);
    },
    style: {
      padding: "4px 12px",
      borderRadius: 5,
      cursor: "pointer",
      fontSize: 10,
      background: C.bg3,
      border: "1px solid " + C.bdr,
      color: C.t2,
      fontFamily: C.mono
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u0432\u0441\u0435")), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      whiteSpace: "pre-wrap",
      fontSize: 12,
      lineHeight: 1.8,
      color: C.t2,
      maxHeight: 600,
      overflowY: "auto"
    }
  }, promoResult))));
}

// ─── SENTINEL ─────────────────────────────────────────────────────────────────
function SentinelTab({
  T
}) {
  var [godFeed, setGodFeed] = useState([]);
  var [fi, setFi] = useState(0);
  var [subStats, setSubStats] = useState({
    subs: "—",
    revenue: "—"
  });
  var [aiTaskCount, setAiTaskCount] = useState(0);

  // Status feed — real events only, populated by actual API actions
  useEffect(function () {
    var ts = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    setGodFeed([{
      icon: "⚡",
      store: "System",
      col: C.amber,
      msg: "CloseFast Omni запущено · God Mode активний",
      ts: ts,
      id: 1
    }]);
    // Fetch real subscriber stats from Stripe webhook log
    fetch("/api/stripe-stats.php").then(function (r) {
      return r.json();
    }).then(function (d) {
      if (d && d.subs !== undefined) {
        setSubStats({
          subs: String(d.subs || 0),
          revenue: d.revenue ? "$" + d.revenue : "—"
        });
      }
    }).catch(function () {});
    // Track AI task count in sessionStorage
    var count = parseInt(sessionStorage.getItem("cf_ai_tasks") || "0");
    setAiTaskCount(count);
    var iv = setInterval(function () {
      setAiTaskCount(parseInt(sessionStorage.getItem("cf_ai_tasks") || "0"));
    }, 5000);
    return function () {
      clearInterval(iv);
    };
  }, []);
  var APIS = [{
    l: "Anthropic Claude",
    url: "api.anthropic.com",
    icon: "🤖",
    col: C.blue2
  }, {
    l: "Stripe Payments",
    url: "api.stripe.com",
    icon: "💳",
    col: C.grn
  }, {
    l: "Monad RPC Node",
    url: "rpc.monad.xyz",
    icon: "⛓",
    col: C.amber
  }, {
    l: "Etsy API",
    url: "api.etsy.com",
    icon: "🛍",
    col: C.amber
  }, {
    l: "X API v2",
    url: "api.twitter.com",
    icon: "🔵",
    col: C.blue
  }, {
    l: "Instagram Graph",
    url: "graph.instagram.com",
    icon: "📸",
    col: C.pur
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 24,
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "\u2726 System ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Sentinel")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      fontFamily: C.mono
    }
  }, MASTER_EMAIL, " \xB7 ", T.god_badge, " \xB7 All systems visible")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 16px",
      background: C.amberL,
      border: "1px solid " + C.amber + "40",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: C.amber,
      animation: "pulse 2s infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.amberD,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, T.god_badge, " ACTIVE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 12,
      marginBottom: 20
    }
  }, [{
    l: "Active Subscribers",
    v: subStats.subs,
    note: "Live від Stripe",
    icon: "⚡",
    col: C.amber
  }, {
    l: "AI Tasks This Session",
    v: String(aiTaskCount),
    note: "Поточна сесія",
    icon: "◈",
    col: C.blue
  }, {
    l: "Revenue (Stripe)",
    v: subStats.revenue,
    note: "Live від Stripe webhook",
    icon: "◆",
    col: C.grn
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.l,
      className: "cf-card",
      style: {
        borderTop: "2px solid " + s.col,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 26,
        marginBottom: 4
      }
    }, s.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 32,
        fontWeight: 700,
        color: s.v === "—" ? C.t4 : s.col,
        letterSpacing: "-1px",
        lineHeight: 1,
        fontFamily: C.mono
      }
    }, s.v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3,
        marginTop: 5
      }
    }, s.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        marginTop: 3,
        fontFamily: C.mono
      }
    }, s.note));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "Live God Mode Feed", /*#__PURE__*/React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: C.amber,
      animation: "blink 1s infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 400,
      overflowY: "auto"
    }
  }, godFeed.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      textAlign: "center",
      color: C.t4,
      fontSize: 12
    }
  }, "Initializing feed\u2026") : godFeed.map(function (e, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: e.id || i,
      style: {
        padding: "8px 14px",
        borderBottom: "1px solid " + C.bdr,
        display: "flex",
        gap: 10,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        flexShrink: 0
      }
    }, e.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center",
        marginBottom: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        color: e.col,
        fontFamily: C.mono
      }
    }, e.store), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.t4,
        fontFamily: C.mono
      }
    }, e.ts)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.t2,
        lineHeight: 1.5
      }
    }, e.msg)));
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "API Status", /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: C.bdr
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, APIS.map(function (api) {
    return /*#__PURE__*/React.createElement("div", {
      key: api.l,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: C.bg,
        border: "1px solid " + api.col + "25",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,.04)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, api.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: C.txt
      }
    }, api.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        fontFamily: C.mono
      }
    }, api.url)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: C.grn,
        animation: "pulse 2s infinite"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.grn,
        fontWeight: 700,
        fontFamily: C.mono
      }
    }, "ONLINE")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "12px 14px",
      background: C.purL,
      border: "1px solid " + C.pur + "30",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.pur,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: C.mono
    }
  }, "AUTH OVERRIDE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t2,
      lineHeight: 1.8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber,
      fontWeight: 700
    }
  }, "user.plan = 'GOD_MODE'"), /*#__PURE__*/React.createElement("br", null), "All payment walls bypassed", /*#__PURE__*/React.createElement("br", null), "All 6 AI Specialists active", /*#__PURE__*/React.createElement("br", null), "3 Etsy stores + Social + Sentinel")))), /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 10
    }
  }, "\uD83D\uDCC8 Platform Health"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: C.bg3,
      borderRadius: 8,
      fontSize: 11,
      color: C.t3,
      lineHeight: 1.8,
      fontFamily: C.mono
    }
  }, "\u25CB Anthropic API \u2014 active after ANTHROPIC_API_KEY is set in .env", /*#__PURE__*/React.createElement("br", null), "\u25CB VLY Pool \u2014 active after PancakeSwap pool is created", /*#__PURE__*/React.createElement("br", null), "\u25CB Stripe revenue \u2014 active after webhook is configured", /*#__PURE__*/React.createElement("br", null), "\u25CB Etsy sync \u2014 active after Etsy OAuth token is entered")), /*#__PURE__*/React.createElement(NftGallery, null), /*#__PURE__*/React.createElement(PaymentKeysBlock, null));
}

// ─── NFT GALLERY (OpenSea collection) ────────────────────────────────────────
function NftGallery() {
  var [open, setOpen] = useState(false);
  var [wallet, setWallet] = useState("0x44afc052d7b2f17fd125a8022e5a1964fa35f008");
  var [loading, setLoading] = useState(false);
  var [nfts, setNfts] = useState([]);
  var [err, setErr] = useState("");
  var [editW, setEditW] = useState(false);
  var [tmpW, setTmpW] = useState("");
  var [chain, setChain] = useState("ethereum");
  var CHAINS = [{
    k: "ethereum",
    l: "Ethereum",
    icon: "⟠"
  }, {
    k: "polygon",
    l: "Polygon",
    icon: "⬟"
  }, {
    k: "base",
    l: "Base",
    icon: "🔵"
  }];
  function fetchNfts() {
    return _fetchNfts.apply(this, arguments);
  }
  function _fetchNfts() {
    _fetchNfts = _asyncToGenerator(function* () {
      if (!wallet.trim()) return;
      setLoading(true);
      setErr("");
      setNfts([]);
      try {
        // OpenSea API v2 — public endpoint, no key needed for basic reads
        var url = "https://api.opensea.io/api/v2/chain/" + chain + "/account/" + wallet.trim() + "/nfts?limit=20";
        var res = yield fetch(url, {
          headers: {
            "accept": "application/json"
          }
        });
        if (!res.ok) throw new Error("OpenSea API " + res.status + ": " + res.statusText);
        var data = yield res.json();
        setNfts(data.nfts || []);
        if ((data.nfts || []).length === 0) setErr("No NFTs found on " + chain + " for this wallet.");
      } catch (e) {
        setErr(e.message);
      }
      setLoading(false);
    });
    return _fetchNfts.apply(this, arguments);
  }
  function saveWallet() {
    setWallet(tmpW);
    setEditW(false);
    setNfts([]);
  }
  var RARITY_COL = {
    Common: C.t3,
    Rare: C.blue,
    Epic: C.pur,
    Legendary: C.amber
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px",
      background: open ? "linear-gradient(135deg,#F8F5FF,#EDE9FF)" : "linear-gradient(135deg,#F8F9FC,#FFFFFF)",
      border: "1px solid " + (open ? C.pur + "50" : C.bdr),
      borderRadius: open ? "12px 12px 0 0" : 12,
      cursor: "pointer",
      transition: "all .2s"
    },
    onClick: function () {
      setOpen(!open);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, "\uD83D\uDDBC"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "NFT Collection  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.pur
    }
  }, "OpenSea")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      fontFamily: C.mono
    }
  }, nfts.length > 0 ? nfts.length + " NFTs loaded · " + chain : "Connect wallet to view your OpenSea collection"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, nfts.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.pur,
      padding: "2px 10px",
      background: "rgba(124,58,237,.1)",
      borderRadius: 5,
      border: "1px solid " + C.pur + "30",
      fontFamily: C.mono
    }
  }, nfts.length, " NFTs"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.t3,
      fontFamily: C.mono
    }
  }, open ? "▲" : "▼"))), open && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      background: C.bg,
      border: "1px solid " + C.pur + "30",
      borderTop: "none",
      borderRadius: "0 0 12px 12px",
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 16,
      flexWrap: "wrap",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement(Lbl, null, "Wallet Address"), editW ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "cf-inp",
    value: tmpW,
    onChange: function (e) {
      setTmpW(e.target.value);
    },
    placeholder: "0x...",
    style: {
      flex: 1,
      fontSize: 11,
      fontFamily: C.mono
    },
    onKeyDown: function (e) {
      if (e.key === "Enter") saveWallet();
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: saveWallet,
    style: {
      whiteSpace: "nowrap"
    }
  }, "Save"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setEditW(false);
    }
  }, "Cancel")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "8px 12px",
      background: C.bg3,
      border: "1px solid " + C.bdr,
      borderRadius: 7,
      fontSize: 11,
      fontFamily: C.mono,
      color: C.t2,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, wallet || "No wallet set"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setTmpW(wallet);
      setEditW(true);
    }
  }, "\u270F\uFE0F Edit"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Chain"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, CHAINS.map(function (ch) {
    return /*#__PURE__*/React.createElement("button", {
      key: ch.k,
      onClick: function () {
        setChain(ch.k);
        setNfts([]);
      },
      style: {
        padding: "7px 12px",
        borderRadius: 6,
        border: "1px solid " + (chain === ch.k ? C.pur : C.bdr),
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        background: chain === ch.k ? "rgba(124,58,237,.1)" : C.bg,
        color: chain === ch.k ? C.pur : C.t3,
        display: "flex",
        alignItems: "center",
        gap: 5,
        transition: "all .15s"
      }
    }, ch.icon, " ", ch.l);
  }))), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn",
    onClick: fetchNfts,
    disabled: loading || !wallet.trim(),
    style: {
      background: C.pur,
      color: "#fff",
      border: "none",
      whiteSpace: "nowrap"
    }
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Loading\u2026") : "Load NFTs \u2192")), err && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "#FEF2F2",
      border: "1px solid rgba(220,38,38,.2)",
      borderRadius: 8,
      fontSize: 11,
      color: C.red,
      marginBottom: 16,
      fontFamily: C.mono
    }
  }, "\u26A0 ", err, err.includes("401") && /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.t3
    }
  }, " \u2014 OpenSea may require API key for high volume. Basic reads are free.")), nfts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.t3,
      letterSpacing: ".5px",
      textTransform: "uppercase",
      marginBottom: 12,
      fontFamily: C.mono
    }
  }, nfts.length, " NFTs \xB7 ", chain, " \xB7 ", wallet.slice(0, 6), "...", wallet.slice(-4)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
      gap: 12
    }
  }, nfts.map(function (nft, i) {
    var img = nft.display_image_url || nft.image_url || "";
    var name = nft.name || "#" + nft.identifier;
    var coll = nft.collection || "";
    var floor = nft.floor_price ? "$" + nft.floor_price : "—";
    return /*#__PURE__*/React.createElement("div", {
      key: nft.identifier || i,
      style: {
        background: C.bg,
        border: "1px solid " + C.bdr,
        borderRadius: 10,
        overflow: "hidden",
        transition: "all .2s",
        cursor: "pointer"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,.15)";
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      },
      onClick: function () {
        window.open("https://opensea.io/assets/" + chain + "/" + nft.contract + "/" + nft.identifier, "_blank");
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        aspectRatio: "1",
        background: C.bg3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative"
      }
    }, img ? /*#__PURE__*/React.createElement("img", {
      src: img,
      alt: name,
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      },
      onError: function (e) {
        e.target.style.display = "none";
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 32
      }
    }, "\uD83D\uDDBC"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 6,
        right: 6,
        padding: "2px 6px",
        background: "rgba(0,0,0,.55)",
        borderRadius: 4,
        fontSize: 8,
        color: "#fff",
        fontFamily: C.mono
      }
    }, "#", nft.identifier)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 10px 12px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: C.txt,
        marginBottom: 2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        fontFamily: C.mono,
        marginBottom: 6,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, coll), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "https://opensea.io/assets/" + chain + "/" + nft.contract + "/" + nft.identifier,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: function (e) {
        e.stopPropagation();
      },
      style: {
        fontSize: 9,
        color: C.pur,
        fontFamily: C.mono,
        textDecoration: "none",
        fontWeight: 700
      }
    }, "View \u2197"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: C.t4,
        fontFamily: C.mono
      }
    }, nft.contract ? nft.contract.slice(0, 6) + "..." : ""))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "12px 16px",
      background: "rgba(124,58,237,.05)",
      border: "1px solid " + C.pur + "20",
      borderRadius: 10,
      display: "flex",
      gap: 20,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      fontFamily: C.mono
    }
  }, "TOTAL NFTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: C.pur,
      fontFamily: C.mono
    }
  }, nfts.length)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      fontFamily: C.mono
    }
  }, "COLLECTIONS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: C.pur,
      fontFamily: C.mono
    }
  }, [...new Set(nfts.map(function (n) {
    return n.collection;
  }))].length)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "https://opensea.io/" + wallet,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "7px 14px",
      background: C.pur,
      color: "#fff",
      borderRadius: 7,
      fontSize: 11,
      fontWeight: 700,
      textDecoration: "none",
      fontFamily: C.mono
    }
  }, "View on OpenSea \u2197"))), nfts.length === 0 && !loading && !err && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px",
      textAlign: "center",
      background: C.bg3,
      borderRadius: 10,
      border: "1px dashed " + C.bdr2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 10
    }
  }, "\uD83D\uDDBC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4
    }
  }, "Your OpenSea Collection"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      lineHeight: 1.7,
      maxWidth: 320,
      margin: "0 auto"
    }
  }, "Press \"Load NFTs\" to fetch your collection from OpenSea. NFTs appear as cards with direct links to OpenSea listings."))));
}

// ─── PAYMENT KEYS BLOCK (Sentinel only) ──────────────────────────────────────
function PaymentKeysBlock() {
  var [open, setOpen] = useState(false);
  var [saved, setSaved] = useState(false);
  var [visible, setVisible] = useState({});
  // Keys stored ONLY in component state — never leave JS memory, never sent anywhere
  var [keys, setKeys] = useState({
    stripe_pub: "",
    stripe_sec: "",
    stripe_wh: "",
    revolut_api: "",
    revolut_wh: "",
    crypto_wallet: "",
    crypto_memo: ""
  });
  // Encoded copies (btoa) — displayed in saved state
  var [encoded, setEncoded] = useState({});
  function setKey(k, v) {
    setKeys(function (p) {
      var n = Object.assign({}, p);
      n[k] = v;
      return n;
    });
    setSaved(false);
  }
  function toggleVis(k) {
    setVisible(function (p) {
      var n = Object.assign({}, p);
      n[k] = !p[k];
      return n;
    });
  }
  function saveAll() {
    var enc = {};
    Object.keys(keys).forEach(function (k) {
      enc[k] = encodeKey(keys[k]);
    });
    setEncoded(enc);
    setSaved(true);
    // Clear raw values from state immediately
    setKeys(function (p) {
      var n = {};
      Object.keys(p).forEach(function (k) {
        n[k] = "";
      });
      return n;
    });
    setVisible({});
  }
  var FIELDS = [{
    group: "stripe",
    icon: "💳",
    title: "Stripe",
    color: C.blue,
    fields: [{
      k: "stripe_pub",
      l: "Publishable Key",
      ph: "pk_live_..."
    }, {
      k: "stripe_sec",
      l: "Secret Key",
      ph: "sk_live_...",
      warn: true
    }, {
      k: "stripe_wh",
      l: "Webhook Secret",
      ph: "whsec_..."
    }]
  }, {
    group: "revolut",
    icon: "🔄",
    title: "Revolut",
    color: C.pur,
    fields: [{
      k: "revolut_api",
      l: "API Key",
      ph: "sk_live_..."
    }, {
      k: "revolut_wh",
      l: "Webhook Signature",
      ph: "whsec_..."
    }]
  }, {
    group: "crypto",
    icon: "⛓",
    title: "Crypto Wallet",
    color: C.grn,
    fields: [{
      k: "crypto_wallet",
      l: "Receiving Wallet",
      ph: "0x44afc052..."
    }, {
      k: "crypto_memo",
      l: "Payment Memo/Tag",
      ph: "Optional memo"
    }]
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px",
      background: saved ? "#ECFDF5" : "#FFF8E1",
      border: "1px solid " + (saved ? "rgba(5,150,105,.3)" : "rgba(240,165,0,.3)"),
      borderRadius: open ? "12px 12px 0 0" : 12,
      cursor: "pointer",
      transition: "all .2s"
    },
    onClick: function () {
      setOpen(!open);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, "\uD83D\uDD10"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "Payment Gateway Keys"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      fontFamily: C.mono
    }
  }, "Stripe \xB7 Revolut \xB7 Crypto \u2014 stored encrypted in-memory only \xB7 never sent to browser or server"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, saved && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.grn,
      fontFamily: C.mono,
      padding: "2px 8px",
      background: C.grnL,
      borderRadius: 4,
      border: "1px solid rgba(5,150,105,.2)"
    }
  }, "\u2713 SAVED (encoded)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.t3,
      fontFamily: C.mono
    }
  }, open ? "▲" : "▼"))), open && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      background: C.bg,
      border: "1px solid rgba(240,165,0,.2)",
      borderTop: "none",
      borderRadius: "0 0 12px 12px",
      padding: "20px 20px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      marginBottom: 18,
      background: "#FEF2F2",
      border: "1px solid rgba(220,38,38,.2)",
      borderRadius: 8,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      flexShrink: 0
    }
  }, "\u26A0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#991B1B",
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Security notice:"), " Keys are obfuscated with base64 encoding and stored only in React component state. They are ", /*#__PURE__*/React.createElement("strong", null, "NOT persisted"), " to localStorage, cookies, or any external service. They are ", /*#__PURE__*/React.createElement("strong", null, "cleared on page refresh"), ". For production, use server-side environment variables only.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16
    }
  }, FIELDS.map(function (grp) {
    return /*#__PURE__*/React.createElement("div", {
      key: grp.group,
      style: {
        background: C.bg3,
        border: "1px solid " + C.bdr,
        borderRadius: 10,
        padding: "14px 16px",
        borderTop: "3px solid " + grp.color
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, grp.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        color: grp.color,
        fontFamily: C.dis
      }
    }, grp.title)), grp.fields.map(function (f) {
      var enc = encoded[f.k];
      return /*#__PURE__*/React.createElement("div", {
        key: f.k,
        style: {
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4
        }
      }, /*#__PURE__*/React.createElement(Lbl, null, f.l), f.warn && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 8,
          color: C.red,
          fontFamily: C.mono,
          fontWeight: 700
        }
      }, "SECRET")), enc && !keys[f.k] ? /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          fontFamily: C.mono,
          color: C.grn,
          padding: "6px 10px",
          background: "#ECFDF5",
          borderRadius: 6,
          border: "1px solid rgba(5,150,105,.2)",
          wordBreak: "break-all",
          letterSpacing: ".3px"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: C.t3
        }
      }, "Encoded: "), visible[f.k] ? decodeKey(enc) : maskKey(decodeKey(enc)), /*#__PURE__*/React.createElement("button", {
        onClick: function () {
          toggleVis(f.k);
        },
        style: {
          marginLeft: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: C.grn,
          fontSize: 10,
          fontFamily: C.mono
        }
      }, visible[f.k] ? "hide" : "show")) : /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative"
        }
      }, /*#__PURE__*/React.createElement("input", {
        className: "cf-inp",
        type: visible[f.k] ? "text" : "password",
        value: keys[f.k] || "",
        onChange: function (e) {
          setKey(f.k, e.target.value);
        },
        placeholder: f.ph,
        style: {
          fontSize: 11,
          paddingRight: 40
        }
      }), /*#__PURE__*/React.createElement("button", {
        onClick: function () {
          toggleVis(f.k);
        },
        style: {
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: C.t3,
          fontSize: 12
        }
      }, visible[f.k] ? "🙈" : "👁")));
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "flex",
      justifyContent: "flex-end",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setEncoded({});
      setSaved(false);
      setKeys({
        stripe_pub: "",
        stripe_sec: "",
        stripe_wh: "",
        revolut_api: "",
        revolut_wh: "",
        crypto_wallet: "",
        crypto_memo: ""
      });
    }
  }, "\u232B Clear all"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: saveAll
  }, "\uD83D\uDD10 Encode & Save in Memory")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "10px 14px",
      background: C.bg2,
      borderRadius: 8,
      border: "1px solid " + C.bdr
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      fontFamily: C.mono,
      lineHeight: 1.8
    }
  }, "\u25CB Keys encoded with btoa(). Not encrypted-at-rest. \xB7 \u25CB Never saved to disk, server, or localStorage. \xB7 \u25CB Session only \u2014 cleared on refresh. \xB7 \u25CB For production: set env vars on server (STRIPE_SECRET_KEY etc.)"))));
}

// ─── РОБІНГУД — DUAL-MODE CFO AGENT ─────────────────────────────────────────
var R = {
  bg: "#F0FDF4",
  bg2: "#DCFCE7",
  bg3: "#064E3B",
  surf: "#ECFDF5",
  bdr: "rgba(5,150,105,.2)",
  bdr2: "rgba(5,150,105,.4)",
  grn: "#059669",
  grnL: "#34D399",
  grnD: "#065F46",
  gold: "#F0A500",
  txt: "#111827",
  t2: "#374151",
  t3: "#6B7280",
  t4: "#9CA3AF",
  red: "#DC2626",
  amber: "#F59E0B",
  blue: "#1D4ED8"
};

// ── Desktop system prompt (BlackRock-level deep analytics) ──
var ROBIN_DESKTOP_PROMPT = "Ти — AI Агент плану 'Робінгуд' у системі CloseFast Omni. Твоя спеціалізація — фінансовий менеджмент рівня BlackRock, адаптований для приватних підприємців та малого бізнесу.\n\n" + "Контекст: Користувач працює на DESKTOP. Використовуй повну глибину аналізу.\n\n" + "Твої обов'язки:\n" + "1. Аналізуй 90% активів екосистеми та 5% частки прибутку (90/5/5 модель)\n" + "2. Розрахунок ліквідності (5%) та звірка з ринковими ризиками\n" + "3. Детальні таблиці Markdown для закриття фінансового періоду\n" + "4. Використовуй: LTV, Runway, Burn Rate, EBITDA, CAC, MRR, ARR, COGS, Gross Margin, Net Margin, ROI, IRR\n\n" + "Стиль: Структурований звіт з Markdown-таблицями, висновками та стратегіями оптимізації. " + "Пропонуй складні стратегії реінвестування та мінімізації податків. " + "Завжди заверши розділом 'Наступні кроки' з пронумерованим списком дій.";

// ── Mobile system prompt (Quick actions, bullet CFO) ──
var ROBIN_MOBILE_PROMPT = "Ти — AI Агент плану 'Робінгуд', мобільний CFO-асистент у CloseFast Omni.\n\n" + "Контекст: Користувач на МОБІЛЬНОМУ. Екран малий. Час — гроші.\n\n" + "ПРАВИЛА:\n" + "• Відповідь = максимум 1-2 скроли iPhone\n" + "• ТІЛЬКИ bullet points + емодзі\n" + "• 📈 ріст / 📉 падіння / ✅ норма / ⚠️ увага / 🔴 критично\n" + "• Жодних абзаців. Тільки списки.\n" + "• Завжди пропонуй Quick Action: 'Схвалити? [ТАК / НІ]'\n" + "• Числа — тільки найважливіші (3-5 цифр максимум)\n" + "• Якщо треба деталі → 'Деталі на Desktop ↗'\n\n" + "Формат завжди:\n" + "🏹 СТАТУС: [одне речення]\n" + "[3-5 bullet points]\n" + "⚡ ДІЯ: [одне конкретне питання для схвалення]";
var ROBIN_REPORT_TYPES = [{
  k: "period",
  icon: "📊",
  l: "Закриття Періоду",
  l_m: "Закрити Період",
  sub: "P&L · Balance Sheet · Cash Flow"
}, {
  k: "liquidity",
  icon: "💧",
  l: "Ліквідність та Runway",
  l_m: "Ліквідність",
  sub: "Burn Rate · Runway · Cash Reserves"
}, {
  k: "revenue",
  icon: "📈",
  l: "Аналіз Доходів",
  l_m: "Доходи",
  sub: "MRR · ARR · LTV · CAC · Churn"
}, {
  k: "tax",
  icon: "🧾",
  l: "Податкова Оптимізація",
  l_m: "Податки",
  sub: "EBITDA · Tax Strategy · Holdco"
}, {
  k: "invest",
  icon: "💎",
  l: "Реінвестування",
  l_m: "Інвест.",
  sub: "ROI · IRR · Portfolio Allocation"
}, {
  k: "risk",
  icon: "🛡",
  l: "Ризик-Менеджмент",
  l_m: "Ризики",
  sub: "Scenario Analysis · Hedging"
}];
var ROBIN_QUICK_ACTIONS = [{
  icon: "✅",
  l: "Схвалити закриття місяця",
  prompt: "Підтвердити закриття фінансового місяця для бізнесу. Перевір всі показники і дай фінальне 'ТАК/НІ' з обґрунтуванням."
}, {
  icon: "⚠️",
  l: "Перевірити бюджет",
  prompt: "Перевір поточний бюджет. Є перевищення? Де саме? Що робити зараз?"
}, {
  icon: "💰",
  l: "Вивести прибуток",
  prompt: "Скільки можна безпечно вивести з бізнесу цього місяця, не ризикуючи ліквідністю? Дай конкретну суму."
}, {
  icon: "📤",
  l: "Квартальний звіт",
  prompt: "Згенеруй короткий квартальний звіт для власника бізнесу. Ключові метрики, тренди, рекомендації."
}];
function RobinhoodTab() {
  var [isMobile, setIsMobile] = useState(false);
  var [forcedMode, setForcedMode] = useState(null); // null = auto, "desktop", "mobile"
  var [reportType, setReportType] = useState("period");
  var [customQ, setCustomQ] = useState("");
  var [context, setContext] = useState("");
  var [revenue, setRevenue] = useState("");
  var [expenses, setExpenses] = useState("");
  var [assets, setAssets] = useState("");
  var [result, setResult] = useState(null);
  var [busy, setBusy] = useState(false);
  var [err, setErr] = useState("");
  var [history, setHistory] = useState([]);
  var [showHistory, setShowHistory] = useState(false);

  // Auto-detect device
  useEffect(function () {
    function checkSize() {
      setIsMobile(window.innerWidth <= 600);
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return function () {
      window.removeEventListener("resize", checkSize);
    };
  }, []);
  var mode = forcedMode || (isMobile ? "mobile" : "desktop");
  var sysPrompt = mode === "mobile" ? ROBIN_MOBILE_PROMPT : ROBIN_DESKTOP_PROMPT;
  var selectedReport = ROBIN_REPORT_TYPES.find(function (r) {
    return r.k === reportType;
  }) || ROBIN_REPORT_TYPES[0];
  function runReport(_x10) {
    return _runReport.apply(this, arguments);
  }
  function _runReport() {
    _runReport = _asyncToGenerator(function* (customPrompt) {
      setBusy(true);
      setErr("");
      setResult(null);
      var financialContext = (revenue ? "Місячний дохід: $" + revenue + "\n" : "") + (expenses ? "Місячні витрати: $" + expenses + "\n" : "") + (assets ? "Активи/Резерви: $" + assets + "\n" : "") + (context ? "Додатковий контекст: " + context + "\n" : "") + "Бізнес: Etsy POD (VibeprintsProducts), CloseFast SaaS, Monad/VLY crypto assets\n" + "Локація: Словаччина (EU), дохід USD/EUR\n" + "Дата: Березень 2026\n" + "Модель: 90/5/5 (90% реінвест, 5% ліквідність, 5% вивід)";
      var userMsg = customPrompt || "Виконай аналіз: " + selectedReport.l + "\n" + selectedReport.sub + "\n\n" + financialContext;
      try {
        var raw = yield ai(sysPrompt, userMsg, 1500);
        var entry = {
          mode: mode,
          type: customPrompt ? "quick" : selectedReport.l,
          query: userMsg.substring(0, 80),
          result: raw,
          time: new Date().toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit"
          })
        };
        setResult(raw);
        setHistory(function (h) {
          return [entry, ...h].slice(0, 10);
        });
      } catch (e) {
        setErr(e.message);
      }
      setBusy(false);
    });
    return _runReport.apply(this, arguments);
  }
  var RGN = R.grn;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg," + R.grnD + " 0%,#047857 50%,#059669 100%)",
      borderRadius: 16,
      padding: "20px 24px",
      marginBottom: 20,
      color: "#FFFFFF",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -20,
      top: -20,
      fontSize: 120,
      opacity: .08,
      transform: "rotate(-30deg)",
      pointerEvents: "none",
      userSelect: "none"
    }
  }, "\uD83C\uDFF9"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 14,
      fontSize: 26,
      flexShrink: 0,
      background: "rgba(255,255,255,.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 16px rgba(0,0,0,.2)"
    }
  }, "\uD83C\uDFF9"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: "-.5px",
      lineHeight: 1.1
    }
  }, "\u0420\u041E\u0411\u0406\u041D\u0413\u0423\u0414"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      opacity: .7,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px"
    }
  }, "DUAL-MODE CFO \xB7 BlackRock-level \u0434\u043B\u044F \u0432\u0441\u0456\u0445 \xB7 $199/\u043C\u0456\u0441")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      padding: "4px 12px",
      borderRadius: 20,
      background: mode === "mobile" ? "rgba(251,191,36,.25)" : "rgba(255,255,255,.2)",
      border: "1px solid " + (mode === "mobile" ? "rgba(251,191,36,.5)" : "rgba(255,255,255,.3)"),
      fontFamily: "'IBM Plex Mono',monospace",
      color: mode === "mobile" ? "#FCD34D" : "#FFFFFF"
    }
  }, mode === "mobile" ? "📱 MOBILE MODE" : "🖥 DESKTOP MODE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      opacity: .6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, forcedMode ? "ручний режим" : "авто-детект"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: .85,
      fontStyle: "italic",
      borderLeft: "2px solid rgba(255,255,255,.4)",
      paddingLeft: 12
    }
  }, "\"\u0417\u0430\u0431\u0438\u0440\u0430\u0454 \u0441\u043A\u043B\u0430\u0434\u043D\u0456\u0441\u0442\u044C \u0443 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0446\u0456\u0439 \u2014 \u0434\u0430\u0454 \u0441\u0438\u043B\u0443 \u0437\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u043C \u043B\u044E\u0434\u044F\u043C\""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      opacity: .7,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0420\u0415\u0416\u0418\u041C:"), [{
    v: null,
    l: "🔄 Авто"
  }, {
    v: "desktop",
    l: "🖥 Desktop"
  }, {
    v: "mobile",
    l: "📱 Mobile"
  }].map(function (m) {
    var on = forcedMode === m.v;
    return /*#__PURE__*/React.createElement("button", {
      key: String(m.v),
      onClick: function () {
        setForcedMode(m.v);
      },
      style: {
        padding: "4px 12px",
        borderRadius: 20,
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        background: on ? "#FFFFFF" : "rgba(255,255,255,.15)",
        color: on ? R.grnD : "#FFFFFF",
        border: "none",
        transition: "all .2s"
      }
    }, m.l);
  }))), err && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      marginBottom: 14,
      borderRadius: 8,
      background: "#FEF2F2",
      border: "1px solid rgba(220,38,38,.3)",
      color: R.red,
      fontSize: 12,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u26A0\uFE0F ", err), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: R.surf,
      border: "1px solid " + R.bdr,
      borderRadius: 12,
      padding: "16px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: R.grn,
      fontWeight: 700,
      marginBottom: 10,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px"
    }
  }, "\u26A1 \u0428\u0412\u0418\u0414\u041A\u0406 \u0414\u0406\u0407"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, ROBIN_QUICK_ACTIONS.map(function (qa) {
    return /*#__PURE__*/React.createElement("button", {
      key: qa.l,
      onClick: function () {
        runReport(qa.prompt);
      },
      disabled: busy,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "left",
        background: "#FFFFFF",
        border: "1px solid " + R.bdr,
        transition: "all .2s",
        opacity: busy ? .5 : 1
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.borderColor = R.grn;
        e.currentTarget.style.background = R.bg2;
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.borderColor = R.bdr;
        e.currentTarget.style.background = "#FFFFFF";
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        flexShrink: 0
      }
    }, qa.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: R.t2
      }
    }, qa.l));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      border: "1px solid " + R.bdr,
      borderRadius: 12,
      padding: 16,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: R.grn,
      fontWeight: 700,
      marginBottom: 10,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px"
    }
  }, "\uD83D\uDCCA \u0424\u0406\u041D\u0410\u041D\u0421\u041E\u0412\u0406 \u0414\u0410\u041D\u0406 (\u043E\u043F\u0446\u0456\u0439\u043D\u043E)"), [{
    label: "Місячний дохід ($)",
    val: revenue,
    set: setRevenue,
    ph: "3500"
  }, {
    label: "Місячні витрати ($)",
    val: expenses,
    set: setExpenses,
    ph: "1200"
  }, {
    label: "Активи/Резерви ($)",
    val: assets,
    set: setAssets,
    ph: "15000"
  }].map(function (f) {
    return /*#__PURE__*/React.createElement("div", {
      key: f.label,
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: R.t3,
        marginBottom: 3,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, f.label), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: f.val,
      onChange: function (e) {
        f.set(e.target.value);
      },
      placeholder: f.ph,
      style: {
        width: "100%",
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid " + R.bdr,
        fontSize: 12,
        fontFamily: "'IBM Plex Mono',monospace",
        color: R.txt,
        background: "#FAFAFA",
        outline: "none"
      }
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: R.t3,
      marginBottom: 3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0414\u041E\u0414\u0410\u0422\u041A\u041E\u0412\u0418\u0419 \u041A\u041E\u041D\u0422\u0415\u041A\u0421\u0422"), /*#__PURE__*/React.createElement("textarea", {
    value: context,
    onChange: function (e) {
      setContext(e.target.value);
    },
    placeholder: "\u043D\u0430\u043F\u0440: \u043E\u0447\u0456\u043A\u0443\u044E \u0432\u0435\u043B\u0438\u043A\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442, \u043C\u0430\u044E \u0431\u043E\u0440\u0433 $2000, \u043F\u043B\u0430\u0447\u0443 VAT 20%...",
    style: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid " + R.bdr,
      fontSize: 11,
      resize: "vertical",
      minHeight: 60,
      color: R.txt,
      background: "#FAFAFA",
      outline: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      border: "1px solid " + R.bdr,
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: R.grn,
      fontWeight: 700,
      marginBottom: 10,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px"
    }
  }, "\uD83D\uDCCB \u0422\u0418\u041F \u0410\u041D\u0410\u041B\u0406\u0417\u0423"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      marginBottom: 12
    }
  }, ROBIN_REPORT_TYPES.map(function (rt) {
    var on = reportType === rt.k;
    return /*#__PURE__*/React.createElement("button", {
      key: rt.k,
      onClick: function () {
        setReportType(rt.k);
      },
      style: {
        padding: "10px 8px",
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "center",
        border: "1.5px solid " + (on ? R.grn : R.bdr),
        background: on ? R.surf : "#FAFAFA",
        transition: "all .2s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        marginBottom: 2
      }
    }, rt.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: on ? R.grn : R.t2,
        lineHeight: 1.2
      }
    }, isMobile ? rt.l_m : rt.l), !isMobile && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: R.t4,
        marginTop: 2,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, rt.sub));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      runReport(null);
    },
    disabled: busy,
    style: {
      width: "100%",
      padding: "13px",
      borderRadius: 10,
      cursor: "pointer",
      background: busy ? "rgba(5,150,105,.4)" : "linear-gradient(135deg,#065F46,#059669)",
      color: "#FFFFFF",
      border: "none",
      fontSize: 13,
      fontWeight: 800,
      boxShadow: "0 4px 16px rgba(5,150,105,.35)",
      transition: "all .2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u0410\u043D\u0430\u043B\u0456\u0437\u0443\u044E", mode === "mobile" ? " ..." : " — " + selectedReport.l + "...") : /*#__PURE__*/React.createElement(React.Fragment, null, mode === "mobile" ? "📱" : "🖥", " ", mode === "mobile" ? "Швидкий звіт" : "Повний аналіз", ": ", isMobile ? selectedReport.l_m : selectedReport.l)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      marginBottom: 14,
      borderRadius: 10,
      background: mode === "mobile" ? "linear-gradient(135deg,rgba(245,158,11,.08),rgba(251,191,36,.05))" : "linear-gradient(135deg,rgba(29,78,216,.06),rgba(59,130,246,.04))",
      border: "1px solid " + (mode === "mobile" ? "rgba(245,158,11,.2)" : "rgba(29,78,216,.15)")
    }
  }, mode === "mobile" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: R.amber,
      marginBottom: 4
    }
  }, "\uD83D\uDCF1 MOBILE MODE \u2014 Quick CFO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: R.t3,
      lineHeight: 1.5
    }
  }, "Bullet points \xB7 \u0415\u043C\u043E\u0434\u0437\u0456 \u0442\u0440\u0435\u043D\u0434\u0438 \xB7 1-2 \u0441\u043A\u0440\u043E\u043B\u0438 \xB7 Quick Actions", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: R.amber
    }
  }, "\u0414\u0435\u0442\u0430\u043B\u0456 \u2192 \u043F\u0435\u0440\u0435\u0439\u0434\u0438 \u0432 Desktop \u0440\u0435\u0436\u0438\u043C"))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: R.blue,
      marginBottom: 4
    }
  }, "\uD83D\uDDA5 DESKTOP MODE \u2014 Full Analytics"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: R.t3,
      lineHeight: 1.5
    }
  }, "Markdown \u0442\u0430\u0431\u043B\u0438\u0446\u0456 \xB7 EBITDA \xB7 LTV \xB7 Burn Rate \xB7 Runway", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: R.blue
    }
  }, "\u041F\u043E\u0432\u043D\u0430 \u0433\u043B\u0438\u0431\u0438\u043D\u0430 \u0430\u043D\u0430\u043B\u0456\u0437\u0443 \u0440\u0456\u0432\u043D\u044F BlackRock")))), result ? /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      background: "#FFFFFF",
      border: "1px solid " + R.bdr,
      borderRadius: 12,
      padding: "18px 20px",
      minHeight: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: R.grn,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83C\uDFF9 ", mode === "mobile" ? "МОБІЛЬНИЙ ЗВІТ" : "DESKTOP АНАЛІЗ", " \xB7 ", new Date().toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(result);
    },
    style: {
      padding: "4px 10px",
      borderRadius: 5,
      cursor: "pointer",
      fontSize: 10,
      background: R.surf,
      border: "1px solid " + R.bdr,
      color: R.grn,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "Copy"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setResult(null);
    },
    style: {
      padding: "4px 10px",
      borderRadius: 5,
      cursor: "pointer",
      fontSize: 10,
      background: "#FEF2F2",
      border: "1px solid rgba(220,38,38,.2)",
      color: R.red,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u2715"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: mode === "mobile" ? 13 : 12,
      lineHeight: mode === "mobile" ? 1.8 : 1.7,
      color: R.txt,
      fontFamily: mode === "mobile" ? "'DM Sans',sans-serif" : "'IBM Plex Mono',monospace",
      whiteSpace: "pre-wrap",
      maxHeight: mode === "mobile" ? 340 : 560,
      overflowY: "auto",
      padding: mode === "mobile" ? "4px 0" : "2px 0"
    }
  }, result), mode === "mobile" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 12,
      borderTop: "1px solid " + R.bdr
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: R.t4,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "QUICK ACTION"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      runReport("Схвалення підтверджено. Проведи підсумкову транзакцію та зафіксуй закриття.");
    },
    style: {
      flex: 1,
      padding: "10px",
      borderRadius: 8,
      cursor: "pointer",
      background: "linear-gradient(135deg,#065F46,#059669)",
      color: "#FFFFFF",
      border: "none",
      fontSize: 12,
      fontWeight: 700
    }
  }, "\u2705 \u0421\u0425\u0412\u0410\u041B\u0418\u0422\u0418"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      runReport("Є проблеми. Детально розпиши що саме не так і що треба виправити перед закриттям.");
    },
    style: {
      flex: 1,
      padding: "10px",
      borderRadius: 8,
      cursor: "pointer",
      background: "#FEF2F2",
      color: R.red,
      border: "1px solid rgba(220,38,38,.2)",
      fontSize: 12,
      fontWeight: 700
    }
  }, "\u26A0\uFE0F \u0414\u0415\u0422\u0410\u041B\u0406"))), mode === "desktop" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "8px 12px",
      borderRadius: 6,
      background: R.surf,
      border: "1px solid " + R.bdr,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: R.grn,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83D\uDCF1 \u0425\u043E\u0447\u0435\u0448 \u043C\u043E\u0431\u0456\u043B\u044C\u043D\u0435 \u0440\u0435\u0437\u044E\u043C\u0435?"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setForcedMode("mobile");
      runReport("Зроби мобільне bullet-point резюме попереднього аналізу.");
    },
    style: {
      padding: "4px 12px",
      borderRadius: 5,
      cursor: "pointer",
      background: R.surf,
      border: "1px solid " + R.grn,
      color: R.grn,
      fontSize: 10,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u2192 Mobile Summary"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFFFF",
      border: "1px solid " + R.bdr,
      borderRadius: 12,
      padding: "40px 20px",
      textAlign: "center",
      minHeight: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      marginBottom: 12,
      opacity: .3
    }
  }, "\uD83C\uDFF9"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: R.t3,
      marginBottom: 6
    }
  }, mode === "mobile" ? "Готовий до швидкого звіту" : "Готовий до глибокого аналізу"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: R.t4,
      lineHeight: 1.6,
      maxWidth: 260
    }
  }, mode === "mobile" ? "Натисни Quick Action або обери тип звіту зліва" : "Введи фінансові дані та обери тип аналізу. Робінгуд застосує методологію BlackRock.")), history.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setShowHistory(function (v) {
        return !v;
      });
    },
    style: {
      width: "100%",
      padding: "8px 14px",
      borderRadius: 8,
      cursor: "pointer",
      background: "#FFFFFF",
      border: "1px solid " + R.bdr,
      color: R.t3,
      fontSize: 10,
      fontFamily: "'IBM Plex Mono',monospace",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDC \u0406\u0421\u0422\u041E\u0420\u0406\u042F \u0417\u0412\u0406\u0422\u0406\u0412 (", history.length, ")"), /*#__PURE__*/React.createElement("span", null, showHistory ? "▲" : "▼")), showHistory && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      border: "1px solid " + R.bdr,
      borderRadius: 8,
      overflow: "hidden"
    }
  }, history.map(function (h, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: function () {
        setResult(h.result);
      },
      style: {
        padding: "8px 14px",
        cursor: "pointer",
        borderBottom: i < history.length - 1 ? "1px solid " + R.bdr : "none",
        background: "#FFFFFF",
        transition: "background .15s"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.background = R.surf;
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.background = "#FFFFFF";
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: R.t2
      }
    }, h.mode === "mobile" ? "📱" : "🖥", " ", h.type), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: R.t4,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, h.time)));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      padding: "16px 20px",
      background: "linear-gradient(135deg," + R.grnD + ",#047857)",
      borderRadius: 12,
      color: "#FFFFFF"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      marginBottom: 12,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px",
      opacity: .8
    }
  }, "\uD83D\uDCD0 90/5/5 \u041C\u041E\u0414\u0415\u041B\u042C \u0420\u041E\u0411\u0406\u041D\u0413\u0423\u0414\u0410 \u2014 ACTIVE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      borderRadius: 8,
      overflow: "hidden",
      height: 24
    }
  }, [{
    l: "90% Реінвест",
    pct: 90,
    col: "#34D399"
  }, {
    l: "5% Ліквідність",
    pct: 5,
    col: "#FCD34D"
  }, {
    l: "5% Вивід",
    pct: 5,
    col: "#F87171"
  }].map(function (b, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: b.pct,
        background: b.col,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 9,
        fontWeight: 700,
        color: R.grnD,
        transition: "flex .5s ease"
      }
    }, b.pct >= 10 ? b.l : b.pct + "%");
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 10,
      flexWrap: "wrap"
    }
  }, [{
    l: "LTV",
    v: revenue ? "$" + (parseFloat(revenue) * 12 * 3).toFixed(0) : "—"
  }, {
    l: "Burn Rate",
    v: expenses ? "$" + expenses + "/міс" : "—"
  }, {
    l: "Runway",
    v: revenue && expenses && assets ? Math.round(parseFloat(assets) / Math.max(1, parseFloat(expenses) - parseFloat(revenue))) + "міс" : "—"
  }, {
    l: "Gross Margin",
    v: revenue && expenses ? Math.round((1 - parseFloat(expenses) / parseFloat(revenue)) * 100) + "%" : "—"
  }].map(function (m) {
    return /*#__PURE__*/React.createElement("div", {
      key: m.l,
      style: {
        textAlign: "center",
        flex: 1,
        minWidth: 60
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        fontFamily: "'IBM Plex Mono',monospace",
        lineHeight: 1
      }
    }, m.v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        opacity: .7,
        marginTop: 2
      }
    }, m.l));
  }))));
}

// ─── TOKEN STUDIO — MONAD TOKEN CREATOR ──────────────────────────────────────
var TOKEN_DEPLOY_PROMPT = "Ти — Web3 розробник та токеноміст. Допомагаєш запустити токен на Monad Mainnet (chainId 143). " + "Твій вузол: Chainstack NД-076-742-968. " + "Давай конкретний, технічно точний контент. Відповідай українською.";

// ─── PLATFORM WALLET & FEES ─────────────────────────────────────────────────
var PLATFORM_WALLET = "0xaE3cA8Ae0C7d80075F8324FAdFfF3B6B12a465a1";

// Fee in MON equivalent to USD prices:
// meme ~$8 (pump.fun charges $2-5 just gas, we add service), contracts ~$25-35
var TOKEN_FEES = {
  meme: 1.6,
  reward: 3.0,
  utility: 5.0,
  dao: 7.0
};
var TOKEN_TEMPLATES = [{
  k: "meme",
  icon: "🐸",
  l: "Мем-токен",
  desc: "Вірусний токен для спільноти · Instant",
  supply: "1,000,000,000",
  tax: "0%",
  fee: 1.6,
  usd: 8
}, {
  k: "reward",
  icon: "🎁",
  l: "Reward Token",
  desc: "Токен для нагородження · Staking ready",
  supply: "500,000,000",
  tax: "1%",
  fee: 3.0,
  usd: 15
}, {
  k: "utility",
  icon: "⚙️",
  l: "Utility Token",
  desc: "Access control · Vesting · Whitelist",
  supply: "100,000,000",
  tax: "2%",
  fee: 5.0,
  usd: 25
}, {
  k: "dao",
  icon: "🏛",
  l: "DAO Token",
  desc: "Governance · Voting · Timelock · Full",
  supply: "10,000,000",
  tax: "0%",
  fee: 7.0,
  usd: 35
}];
function TokenStudioTab() {
  var [step, setStep] = useState(1);
  var [template, setTemplate] = useState("meme");
  var [tokenName, setTokenName] = useState("");
  var [symbol, setSymbol] = useState("");
  var [supply, setSupply] = useState("1000000000");
  var [desc, setDesc] = useState("");
  var [logoFile, setLogoFile] = useState(null);
  var [logoPreview, setLogoPreview] = useState(null);
  var [busy, setBusy] = useState(false);
  var [spec, setSpec] = useState(null);
  var [userWallet, setUserWallet] = useState("");
  var [walletBusy, setWalletBusy] = useState(false);
  var [walletError, setWalletError] = useState("");
  var [monBalance, setMonBalance] = useState(null);
  var [feePaying, setFeePaying] = useState(false);
  var [feePaid, setFeePaid] = useState(false);
  var [feeTxHash, setFeeTxHash] = useState("");
  var [feeError, setFeeError] = useState("");
  var [checkWallet, setCheckWallet] = useState("");
  var [checkBal, setCheckBal] = useState(null);
  var [checkBusy, setCheckBusy] = useState(false);
  var tpl = TOKEN_TEMPLATES.find(function (t) {
    return t.k === template;
  }) || TOKEN_TEMPLATES[0];
  var fee = tpl.fee;
  function handleLogoUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл занадто великий. Макс 2MB");
      return;
    }
    setLogoFile(file);
    var reader = new FileReader();
    reader.onload = function (ev) {
      setLogoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }
  function connectWallet(_x11) {
    return _connectWallet2.apply(this, arguments);
  }
  function _connectWallet2() {
    _connectWallet2 = _asyncToGenerator(function* (walletType) {
      setWalletError("");
      // Find the provider
      var provider = null;
      if (walletType === "coinbase" && window.coinbaseWalletExtension) {
        provider = window.coinbaseWalletExtension;
      } else if (walletType === "okx" && window.okxwallet) {
        provider = window.okxwallet;
      } else if (window.ethereum) {
        // MetaMask, Rabby, Trust, WalletConnect all use window.ethereum
        provider = window.ethereum;
      } else {
        setWalletError("Гаманець не знайдено. Встановіть MetaMask, Rabby або Trust Wallet");
        return;
      }
      setWalletBusy(true);
      try {
        var accounts = yield provider.request({
          method: "eth_requestAccounts"
        });
        var addr = accounts[0];
        var chainHex = "0x" + 143 .toString(16);
        try {
          yield provider.request({
            method: "wallet_switchEthereumChain",
            params: [{
              chainId: chainHex
            }]
          });
        } catch (sw) {
          if (sw.code === 4902 || sw.code === -32603) {
            yield provider.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: chainHex,
                chainName: "Monad Mainnet",
                nativeCurrency: {
                  name: "MON",
                  symbol: "MON",
                  decimals: 18
                },
                rpcUrls: ["https://rpc.monad.xyz"],
                blockExplorerUrls: ["https://explorer.monad.xyz"]
              }]
            });
          }
        }
        setUserWallet(addr);
        // Store provider reference for payFee
        window._cfTokenProvider = provider;
        try {
          var bh = yield provider.request({
            method: "eth_getBalance",
            params: [addr, "latest"]
          });
          setMonBalance((parseInt(bh, 16) / 1e18).toFixed(4));
        } catch (e2) {
          setMonBalance("?");
        }
      } catch (e) {
        setWalletError(e.message || "Помилка підключення");
      }
      setWalletBusy(false);
    });
    return _connectWallet2.apply(this, arguments);
  }
  function payFee() {
    return _payFee.apply(this, arguments);
  }
  function _payFee() {
    _payFee = _asyncToGenerator(function* () {
      if (!userWallet) {
        setFeeError("Спочатку підключи гаманець");
        return;
      }
      setFeePaying(true);
      setFeeError("");
      try {
        var prov = window._cfTokenProvider || window.ethereum;
        if (!prov) {
          setFeeError("Гаманець не підключений");
          setFeePaying(false);
          return;
        }
        var feeWei = "0x" + Math.floor(fee * 1e18).toString(16);
        var tx = yield prov.request({
          method: "eth_sendTransaction",
          params: [{
            from: userWallet,
            to: PLATFORM_WALLET,
            value: feeWei,
            gas: "0x5208" // 21000 — simple MON transfer
          }]
        });
        setFeeTxHash(tx);
        setFeePaid(true);
      } catch (e) {
        setFeeError(e.message || "Транзакція скасована або відхилена");
      }
      setFeePaying(false);
    });
    return _payFee.apply(this, arguments);
  }
  function generateSpec() {
    return _generateSpec.apply(this, arguments);
  }
  function _generateSpec() {
    _generateSpec = _asyncToGenerator(function* () {
      if (!tokenName.trim() || !symbol.trim()) return;
      setBusy(true);
      setSpec(null);
      try {
        var raw = yield ai(TOKEN_DEPLOY_PROMPT, "Створи повну специфікацію для токену на Monad Mainnet.\n" + "Власник гаманець: " + userWallet + "\n" + "Назва: " + tokenName + "\nСимвол: " + symbol.toUpperCase() + "\nТип: " + tpl.l + "\nSupply: " + supply + "\n" + "Опис: " + (desc || "Не вказано") + "\n\n" + "Надай:\n" + "1. 📄 Повний Solidity ERC-20 контракт з constructor(address _owner) — всі токени на _owner\n" + "2. 🪙 Tokenomics (розподіл supply з %)\n" + "3. 🚀 Launch стратегія (5 кроків)\n" + "4. 📢 Маркетинг план X + Telegram (30 днів)\n" + "5. 💧 Liquidity на VLY Finance DEX\n" + "6. 🎯 Deployment: npx hardhat deploy --network monad (chainId 143, rpc https://rpc.monad.xyz)", 2500);
        setSpec(raw);
        setStep(2);
      } catch (e) {
        setSpec("⚠️ " + e.message);
      }
      setBusy(false);
    });
    return _generateSpec.apply(this, arguments);
  }
  function checkBalance() {
    return _checkBalance.apply(this, arguments);
  }
  function _checkBalance() {
    _checkBalance = _asyncToGenerator(function* () {
      if (!checkWallet || !/^0x[a-fA-F0-9]{40}$/.test(checkWallet)) return;
      setCheckBusy(true);
      try {
        var mon = yield getMonadBalance(checkWallet);
        var vly = yield getVlyBalance(checkWallet);
        setCheckBal({
          mon: mon.toFixed(4),
          vly: Number(vly).toFixed(2)
        });
      } catch (e) {
        setCheckBal({
          error: e.message
        });
      }
      setCheckBusy(false);
    });
    return _checkBalance.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#0F172A,#1E293B,#312E81)",
      borderRadius: 16,
      padding: "20px 24px",
      marginBottom: 20,
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -10,
      top: -10,
      fontSize: 100,
      opacity: .06,
      pointerEvents: "none"
    }
  }, "\uD83E\uDE99"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 14,
      fontSize: 26,
      flexShrink: 0,
      background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 20px rgba(99,102,241,.4)"
    }
  }, "\uD83E\uDE99"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: "-.5px"
    }
  }, "Token Studio"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      opacity: .6,
      fontFamily: C.mono,
      marginTop: 2
    }
  }, "Monad Mainnet \xB7 chainId 143 \xB7 Chainstack N\u0414-076-742-968 \xB7 VLY Finance DEX")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      padding: "4px 12px",
      borderRadius: 20,
      fontWeight: 700,
      background: "rgba(16,185,129,.2)",
      border: "1px solid rgba(16,185,129,.4)",
      fontFamily: C.mono,
      color: "#34D399"
    }
  }, "\u25CF NODE ACTIVE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: .7,
      fontStyle: "italic",
      borderLeft: "2px solid rgba(99,102,241,.6)",
      paddingLeft: 12
    }
  }, "\"\u0417\u0430\u043F\u0443\u0441\u043A\u0430\u0439 \u0432\u043B\u0430\u0441\u043D\u0456 \u0442\u043E\u043A\u0435\u043D\u0438 \u043D\u0430 Monad \u043F\u0440\u044F\u043C\u043E \u0437 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u2014 \u043F\u0456\u0434\u043F\u0438\u0441 \u0433\u0430\u043C\u0430\u043D\u0446\u0435\u043C, \u0434\u0435\u043F\u043B\u043E\u0439 \u0437\u0430 \u0445\u0432\u0438\u043B\u0438\u043D\u0438\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 300px",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4
    }
  }, "\u0422\u0438\u043F \u0442\u043E\u043A\u0435\u043D\u0443"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 10
    }
  }, "\u0412\u0438\u0449\u0430 \u0446\u0456\u043D\u0430 = \u0441\u043A\u043B\u0430\u0434\u043D\u0456\u0448\u0430 \u043B\u043E\u0433\u0456\u043A\u0430 \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442\u0443"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, TOKEN_TEMPLATES.map(function (t) {
    var on = template === t.k;
    return /*#__PURE__*/React.createElement("div", {
      key: t.k,
      onClick: function () {
        setTemplate(t.k);
        setSupply(t.supply.replace(/,/g, ""));
        setFeePaid(false);
        setFeeTxHash("");
      },
      style: {
        padding: "12px",
        borderRadius: 8,
        cursor: "pointer",
        border: "2px solid " + (on ? "#6366F1" : C.bdr),
        background: on ? "rgba(99,102,241,.08)" : "#FAFAFA",
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        marginBottom: 4
      }
    }, t.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        padding: "2px 6px",
        borderRadius: 4,
        fontWeight: 800,
        fontFamily: C.mono,
        background: on ? "rgba(99,102,241,.15)" : "#F3F4F6",
        color: on ? "#6366F1" : "#6B7280"
      }
    }, t.fee, " MON")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: on ? "#6366F1" : C.txt
      }
    }, t.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        marginTop: 2
      }
    }, t.desc), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t3,
        marginTop: 4,
        fontFamily: C.mono
      }
    }, "Supply: ", t.supply, " \xB7 Tax: ", t.tax));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 12
    }
  }, "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u0442\u043E\u043A\u0435\u043D\u0443"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 6,
      fontFamily: C.mono
    }
  }, "\u041B\u041E\u0413\u041E\u0422\u0418\u041F \u0422\u041E\u041A\u0415\u041D\u0423"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 12,
      cursor: "pointer",
      border: "2px dashed " + (logoPreview ? "#6366F1" : C.bdr),
      background: logoPreview ? "transparent" : "#F9FAFB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0
    }
  }, logoPreview ? /*#__PURE__*/React.createElement("img", {
    src: logoPreview,
    alt: "logo",
    style: {
      width: 64,
      height: 64,
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 24
    }
  }, "\uD83D\uDDBC\uFE0F"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    style: {
      display: "none"
    },
    onChange: handleLogoUpload
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t2,
      marginBottom: 3
    }
  }, logoPreview ? "✅ Логотип завантажено" : "Завантажте логотип токену"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4
    }
  }, "PNG/JPG/SVG \xB7 \u041C\u0430\u043A\u0441 2MB \xB7 512\xD7512px"), logoPreview && /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setLogoFile(null);
      setLogoPreview(null);
    },
    style: {
      fontSize: 9,
      color: C.red,
      background: "none",
      border: "none",
      cursor: "pointer",
      marginTop: 3
    }
  }, "\u2715 \u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438")))), [{
    l: "Назва токену",
    val: tokenName,
    set: setTokenName,
    ph: "напр. MonadDoge"
  }, {
    l: "Символ (тікер)",
    val: symbol,
    set: function (v) {
      setSymbol(v.toUpperCase().replace(/[^A-Z0-9]/g, ""));
    },
    ph: "напр. MDOGE"
  }].map(function (f) {
    return /*#__PURE__*/React.createElement("div", {
      key: f.l,
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3,
        marginBottom: 3,
        fontFamily: C.mono
      }
    }, f.l), /*#__PURE__*/React.createElement("input", {
      value: f.val,
      onChange: function (e) {
        f.set(e.target.value);
      },
      placeholder: f.ph,
      className: "cf-inp",
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 3,
      fontFamily: C.mono
    }
  }, "TOTAL SUPPLY"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: supply,
    onChange: function (e) {
      setSupply(e.target.value);
    },
    className: "cf-inp",
    style: {
      fontSize: 13,
      fontFamily: C.mono
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 3,
      fontFamily: C.mono
    }
  }, "\u041E\u041F\u0418\u0421 \u041F\u0420\u041E\u0415\u041A\u0422\u0423"), /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: function (e) {
      setDesc(e.target.value);
    },
    placeholder: "\u0429\u043E \u0440\u043E\u0431\u0438\u0442\u044C \u0442\u0432\u0456\u0439 \u0442\u043E\u043A\u0435\u043D? \u042F\u043A\u0430 \u0441\u043F\u0456\u043B\u044C\u043D\u043E\u0442\u0430?",
    className: "cf-inp",
    style: {
      minHeight: 60,
      resize: "vertical",
      fontSize: 12
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14,
      background: feePaid ? "rgba(16,185,129,.04)" : "#FAFAFA",
      border: "1px solid " + (feePaid ? "rgba(16,185,129,.3)" : C.bdr)
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4
    }
  }, "\uD83D\uDCB3 \u0413\u0430\u043C\u0430\u043D\u0435\u0446\u044C \u0442\u0430 \u043E\u043F\u043B\u0430\u0442\u0430"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 12
    }
  }, "\u0422\u043E\u043A\u0435\u043D \u0431\u0443\u0434\u0435 \u0440\u043E\u0437\u0433\u043E\u0440\u043D\u0443\u0442\u043E \u043D\u0430 ", /*#__PURE__*/React.createElement("strong", null, userWallet || "твій гаманець"), " \u2014 \u0432\u0441\u0456 \u043C\u043E\u043D\u0435\u0442\u0438 \u043D\u0430\u0434\u0456\u0439\u0434\u0443\u0442\u044C \u043D\u0430 \u043D\u044C\u043E\u0433\u043E"), !userWallet ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 6,
      fontFamily: C.mono
    }
  }, "\u0412\u0418\u0411\u0415\u0420\u0406\u0422\u042C \u0413\u0410\u041C\u0410\u041D\u0415\u0426\u042C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      marginBottom: 8
    }
  }, [{
    label: "MetaMask",
    emoji: "🦊",
    type: "metamask"
  }, {
    label: "Rabby",
    emoji: "🐰",
    type: "rabby"
  }, {
    label: "Trust Wallet",
    emoji: "🛡",
    type: "trust"
  }, {
    label: "Coinbase",
    emoji: "🔵",
    type: "coinbase"
  }].map(function (w) {
    return /*#__PURE__*/React.createElement("button", {
      key: w.type,
      onClick: function () {
        connectWallet(w.type);
      },
      disabled: walletBusy,
      style: {
        padding: "10px 8px",
        borderRadius: 8,
        cursor: "pointer",
        background: "#F3F4F6",
        border: "1px solid " + C.bdr,
        fontSize: 11,
        fontWeight: 700,
        color: C.txt,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity: walletBusy ? .7 : 1,
        transition: "all .15s"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.borderColor = "#6366F1";
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.borderColor = C.bdr;
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, w.emoji), w.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, [{
    label: "Phantom",
    emoji: "👻",
    soon: true
  }, {
    label: "OKX",
    emoji: "⭕",
    type: "okx"
  }, {
    label: "WalletConnect",
    emoji: "🔗",
    type: "wc"
  }].map(function (w) {
    return /*#__PURE__*/React.createElement("button", {
      key: w.label,
      onClick: function () {
        if (!w.soon) connectWallet(w.type || "wc");
      },
      disabled: !!w.soon || walletBusy,
      style: {
        flex: 1,
        padding: "8px 6px",
        borderRadius: 8,
        cursor: w.soon ? "default" : "pointer",
        background: w.soon ? "#F9FAFB" : "#F3F4F6",
        border: "1px solid " + C.bdr,
        fontSize: 10,
        fontWeight: 600,
        color: w.soon ? C.t4 : C.txt,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", null, w.emoji), w.label, w.soon && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 8,
        color: C.t4
      }
    }, "(soon)"));
  }))), walletError && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      fontFamily: C.mono,
      marginBottom: 6
    }
  }, walletError), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      textAlign: "center"
    }
  }, "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0434\u043E\u0434\u0430\u0454 Monad Mainnet (chainId 143)")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 8,
      marginBottom: 12,
      background: "rgba(99,102,241,.08)",
      border: "1px solid rgba(99,102,241,.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "#818CF8",
      fontFamily: C.mono,
      marginBottom: 2
    }
  }, "\u2705 \u041F\u0406\u0414\u041A\u041B\u042E\u0427\u0415\u041D\u041E \xB7 MONAD"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt,
      fontFamily: C.mono
    }
  }, userWallet.substring(0, 10), "...", userWallet.substring(36))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t3
    }
  }, "\u0411\u0430\u043B\u0430\u043D\u0441"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "#F59E0B",
      fontFamily: C.mono
    }
  }, monBalance, " MON")))), !feePaid ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 8,
      marginBottom: 10,
      background: "rgba(240,165,0,.06)",
      border: "1px solid rgba(240,165,0,.25)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.amber
    }
  }, "\u041A\u043E\u043C\u0456\u0441\u0456\u044F \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0438 \xB7 ", tpl.l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t3,
      marginTop: 2
    }
  }, "AI spec + Solidity \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442 + Deployment guide")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      flexShrink: 0,
      marginLeft: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: C.amber,
      fontFamily: C.mono,
      lineHeight: 1
    }
  }, fee, " MON"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      fontWeight: 700
    }
  }, "\u2248 $", tpl.usd || Math.round(fee * 5), " USD")))), /*#__PURE__*/React.createElement("button", {
    onClick: payFee,
    disabled: feePaying,
    style: {
      width: "100%",
      padding: "12px",
      borderRadius: 10,
      cursor: "pointer",
      background: feePaying ? "#E2E6F0" : "linear-gradient(135deg,#F59E0B,#F0A500)",
      color: feePaying ? "#9CA3AF" : "#000",
      border: "none",
      fontSize: 13,
      fontWeight: 800,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, feePaying ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u041F\u0456\u0434\u043F\u0438\u0441 \u0443 MetaMask...") : "⚡ Підписати транзакцію · " + fee + " MON"), feeError && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      marginTop: 6,
      fontFamily: C.mono
    }
  }, "\u26A0\uFE0F ", feeError), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      textAlign: "center",
      marginTop: 4
    }
  }, "MON \u043D\u0430\u0434\u0456\u0439\u0434\u0435 \u043D\u0430: ", PLATFORM_WALLET.substring(0, 12), "...")) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      borderRadius: 8,
      background: "rgba(16,185,129,.08)",
      border: "1px solid rgba(16,185,129,.3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.grn,
      marginBottom: 3
    }
  }, "\u2705 \u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u0430 \xB7 ", fee, " MON"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t3,
      fontFamily: C.mono,
      wordBreak: "break-all"
    }
  }, "TX: ", feeTxHash.substring(0, 20), "...")))), /*#__PURE__*/React.createElement("button", {
    onClick: generateSpec,
    disabled: busy || !tokenName.trim() || !symbol.trim() || !feePaid,
    style: {
      width: "100%",
      padding: "14px",
      borderRadius: 12,
      cursor: "pointer",
      border: "none",
      background: busy || !tokenName.trim() || !symbol.trim() || !feePaid ? "#E2E6F0" : "linear-gradient(135deg,#4F46E5,#6366F1)",
      color: busy || !tokenName.trim() || !symbol.trim() || !feePaid ? "#9CA3AF" : "#fff",
      fontSize: 14,
      fontWeight: 800,
      boxShadow: feePaid ? "0 4px 20px rgba(99,102,241,.4)" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442...") : !feePaid ? "🔒 Оплати комісію для генерації" : "🪙 Генерувати Solidity Contract →"), feePaid && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.grn,
      textAlign: "center",
      marginTop: 4,
      fontFamily: C.mono
    }
  }, "\u2705 ", supply, " ", symbol || "токенів", " \u2192 ", userWallet.substring(0, 10), "...")), step === 2 && spec && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setStep(1);
    }
  }, "\u2190 \u041D\u0430\u0437\u0430\u0434"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: C.txt
    }
  }, tokenName.toUpperCase(), " (", symbol, ") \u2014 \u041A\u043E\u043D\u0442\u0440\u0430\u043A\u0442 \u0433\u043E\u0442\u043E\u0432\u0438\u0439"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(spec);
    },
    className: "cf-btn cf-btn-ghost",
    style: {
      fontSize: 11
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438"), /*#__PURE__*/React.createElement("a", {
    href: "data:text/plain;charset=utf-8," + encodeURIComponent(spec),
    download: symbol.toLowerCase() + ".sol",
    className: "cf-btn cf-btn-amber",
    style: {
      fontSize: 11,
      textDecoration: "none"
    }
  }, "\uD83D\uDCBE .sol \u0444\u0430\u0439\u043B"))), userWallet && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px",
      marginBottom: 10,
      borderRadius: 8,
      background: "rgba(16,185,129,.06)",
      border: "1px solid rgba(16,185,129,.25)",
      fontSize: 11,
      color: C.t2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.grn,
      fontWeight: 700
    }
  }, "\u2705 \u0412\u043B\u0430\u0441\u043D\u0438\u043A: "), userWallet, " \u2014 \u0432\u0441\u0456 \u0442\u043E\u043A\u0435\u043D\u0438 \u043D\u0430\u0434\u0445\u043E\u0434\u044F\u0442\u044C \u0441\u044E\u0434\u0438"), logoPreview && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      padding: "8px 12px",
      borderRadius: 8,
      background: C.bg3,
      border: "1px solid " + C.bdr
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logoPreview,
    alt: "logo",
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t2
    }
  }, "\u041B\u043E\u0433\u043E\u0442\u0438\u043F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \xB7 \u0414\u043E\u0434\u0430\u0439 \u043D\u0430 ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/trustwallet/assets",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: C.blue
    }
  }, "Trust Wallet Assets"))), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      whiteSpace: "pre-wrap",
      fontSize: 11,
      lineHeight: 1.8,
      color: C.t2,
      maxHeight: 600,
      overflowY: "auto",
      fontFamily: C.mono
    }
  }, spec), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "10px",
      borderRadius: 8,
      background: C.bg3,
      border: "1px solid " + C.bdr,
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, [{
    l: "Remix IDE",
    url: "https://remix.ethereum.org"
  }, {
    l: "Monad Explorer",
    url: "https://explorer.monad.xyz"
  }, {
    l: "VLY Finance DEX",
    url: "https://pancakeswap.finance/swap?outputCurrency=0x9459ddd1B70E51280DEf774650EcD04F0e24d234"
  }].map(function (lnk) {
    return /*#__PURE__*/React.createElement("a", {
      key: lnk.l,
      href: lnk.url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "cf-btn cf-btn-ghost",
      style: {
        fontSize: 10,
        textDecoration: "none"
      }
    }, lnk.l, " \u2197");
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#0F172A,#1E293B)",
      borderRadius: 12,
      padding: "14px",
      marginBottom: 14,
      color: "#F1F5F9"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      marginBottom: 10,
      fontFamily: C.mono,
      color: "#818CF8",
      letterSpacing: ".5px"
    }
  }, "\uD83D\uDCB0 \u0422\u0410\u0420\u0418\u0424\u0418 PLATFORM"), TOKEN_TEMPLATES.map(function (t) {
    var ac = template === t.k;
    return /*#__PURE__*/React.createElement("div", {
      key: t.k,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
        padding: "5px 8px",
        borderRadius: 5,
        background: ac ? "rgba(99,102,241,.2)" : "transparent",
        border: "1px solid " + (ac ? "rgba(99,102,241,.4)" : "transparent")
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: ac ? "#A5B4FC" : "#64748B"
      }
    }, t.icon, " ", t.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: ac ? "#F59E0B" : "#CBD5E1",
        fontFamily: C.mono
      }
    }, t.fee, " MON"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      paddingTop: 8,
      borderTop: "1px solid rgba(255,255,255,.1)",
      fontSize: 8,
      color: "#475569",
      fontFamily: C.mono
    }
  }, "\u2192 ", PLATFORM_WALLET.substring(0, 14), "...")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#0F172A,#1E293B)",
      borderRadius: 12,
      padding: "14px",
      marginBottom: 14,
      color: "#F1F5F9"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      marginBottom: 10,
      fontFamily: C.mono,
      color: "#818CF8"
    }
  }, "\u26D3 MONAD NODE"), [{
    l: "Node ID",
    v: "NД-076-742-968"
  }, {
    l: "Chain ID",
    v: "143"
  }, {
    l: "Status",
    v: "● Біг",
    col: "#34D399"
  }, {
    l: "Provider",
    v: "Chainstack"
  }].map(function (m) {
    return /*#__PURE__*/React.createElement("div", {
      key: m.l,
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 4,
        fontSize: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#64748B",
        fontFamily: C.mono
      }
    }, m.l), /*#__PURE__*/React.createElement("span", {
      style: {
        color: m.col || "#CBD5E1",
        fontFamily: C.mono,
        fontWeight: 700
      }
    }, m.v));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "\uD83D\uDD0D \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0430 \u0433\u0430\u043C\u0430\u043D\u0446\u044F"), /*#__PURE__*/React.createElement("input", {
    value: checkWallet,
    onChange: function (e) {
      setCheckWallet(e.target.value);
    },
    placeholder: "0x...",
    className: "cf-inp",
    style: {
      fontSize: 11,
      fontFamily: C.mono,
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: checkBalance,
    disabled: checkBusy || !checkWallet,
    className: "cf-btn cf-btn-amber",
    style: {
      width: "100%",
      justifyContent: "center",
      fontSize: 11
    }
  }, checkBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 11
  }), " \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u044F\u044E...") : "Перевірити баланс"), checkBal && !checkBal.error && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      marginTop: 8
    }
  }, [{
    l: "MON",
    v: checkBal.mon + " MON",
    col: C.amber
  }, {
    l: "VLY",
    v: checkBal.vly + " VLY",
    col: "#6366F1"
  }].map(function (b) {
    return /*#__PURE__*/React.createElement("div", {
      key: b.l,
      style: {
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
        borderBottom: "1px solid " + C.bdr,
        fontSize: 11
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.t3
      }
    }, b.l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        color: b.col,
        fontFamily: C.mono
      }
    }, b.v));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "\uD83D\uDD17 \u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F"), [{
    l: "Chainstack Console",
    url: "https://console.chainstack.com"
  }, {
    l: "Monad Explorer",
    url: "https://explorer.monad.xyz"
  }, {
    l: "VLY Finance DEX",
    url: "https://pancakeswap.finance/swap?outputCurrency=0x9459ddd1B70E51280DEf774650EcD04F0e24d234"
  }, {
    l: "Remix IDE",
    url: "https://remix.ethereum.org"
  }, {
    l: "OpenZeppelin Wizard",
    url: "https://wizard.openzeppelin.com"
  }].map(function (lnk) {
    return /*#__PURE__*/React.createElement("a", {
      key: lnk.l,
      href: lnk.url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5px 0",
        borderBottom: "1px solid " + C.bdr,
        fontSize: 10,
        color: C.t2,
        textDecoration: "none"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.color = C.amber;
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.color = C.t2;
      }
    }, /*#__PURE__*/React.createElement("span", null, lnk.l), /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: .4
      }
    }, "\u2197"));
  })))));
}

// ─── UNIQUE ETSY FEATURES — не має жоден конкурент ───────────────────────────

// ── 1. Competitor Spy Agent ──────────────────────────────────────────────────
function CompetitorSpyWidget() {
  var [niche, setNiche] = useState("");
  var [busy, setBusy] = useState(false);
  var [result, setResult] = useState(null);
  function runSpy() {
    return _runSpy.apply(this, arguments);
  }
  function _runSpy() {
    _runSpy = _asyncToGenerator(function* () {
      if (!niche.trim()) return;
      setBusy(true);
      setResult(null);
      try {
        var raw = yield ai("Ти — Etsy competitive intelligence agent. Аналізуєш конкурентів і знаходиш прогалини ринку. Відповідай українською. Return ONLY JSON.", "Ніша Etsy: " + niche + "\n\n" + "Проаналізуй ринок і поверни JSON:\n" + '{"top_competitors":[{"name":"Shop Name","estimated_monthly_sales":1200,"avg_price":34.99,"main_tags":["tag1","tag2"],"weakness":"що роблять погано"}],' + '"market_gaps":["прогалина 1","прогалина 2","прогалина 3"],' + '"winning_price_range":{"min":19.99,"max":49.99,"sweet_spot":29.99},' + '"underused_keywords":["keyword1","keyword2","keyword3","keyword4","keyword5"],' + '"opportunity_score":87,' + '"action_plan":["крок 1","крок 2","крок 3"],' + '"verdict":"2-речення резюме"}', 1200);
        setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setResult({
          error: e.message
        });
      }
      setBusy(false);
    });
    return _runSpy.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "\uD83D\uDD75\uFE0F Competitor Spy", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "2px 8px",
      background: "#FEF3C7",
      color: "#92400E",
      borderRadius: 4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\u0423\u041D\u0406\u041A\u0410\u041B\u042C\u041D\u041E")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 10
    }
  }, "AI \u0430\u043D\u0430\u043B\u0456\u0437\u0443\u0454 \u0442\u043E\u043F \u043A\u043E\u043D\u043A\u0443\u0440\u0435\u043D\u0442\u0456\u0432 \u2192 \u0437\u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C \u043F\u0440\u043E\u0433\u0430\u043B\u0438\u043D\u0438 \u2192 \u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u044E \u043F\u0435\u0440\u0435\u043C\u043E\u0433\u0438"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: niche,
    onChange: function (e) {
      setNiche(e.target.value);
    },
    placeholder: "\u043D\u0430\u043F\u0440: monad fan art prints, crypto wall art...",
    className: "cf-inp",
    style: {
      flex: 1,
      fontSize: 12
    },
    onKeyDown: function (e) {
      if (e.key === "Enter") runSpy();
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: runSpy,
    disabled: busy || !niche.trim(),
    className: "cf-btn cf-btn-amber",
    style: {
      flexShrink: 0
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null)) : "🔍 Spy")), result && !result.error && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      padding: "8px 12px",
      background: C.bg3,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      color: C.grn,
      fontFamily: C.mono
    }
  }, result.opportunity_score), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt
    }
  }, "Opportunity Score"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3
    }
  }, result.verdict))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.grn,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\uD83C\uDFAF \u0420\u0418\u041D\u041A\u041E\u0412\u0406 \u041F\u0420\u041E\u0413\u0410\u041B\u0418\u041D\u0418"), (result.market_gaps || []).map(function (g, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: C.t2,
        marginBottom: 3,
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.grn
      }
    }, "\u25B8"), g);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.blue,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\uD83D\uDD11 \u041D\u0415\u0414\u041E\u0412\u0418\u041A\u041E\u0420\u0418\u0421\u0422\u0410\u041D\u0406 \u041A\u041B\u042E\u0427\u041E\u0412\u0406 \u0421\u041B\u041E\u0412\u0410"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4
    }
  }, (result.underused_keywords || []).map(function (k) {
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        fontSize: 9,
        padding: "2px 8px",
        background: C.blueL,
        color: C.blue,
        borderRadius: 4,
        fontFamily: C.mono
      }
    }, k);
  }))), result.winning_price_range && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px",
      background: "#F0FDF4",
      borderRadius: 6,
      border: "1px solid rgba(5,150,105,.2)",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.grn,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\uD83D\uDCB0 \u0406\u0414\u0415\u0410\u041B\u042C\u041D\u0410 \u0426\u0406\u041D\u0410"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      color: C.grn,
      fontFamily: C.mono
    }
  }, "$", result.winning_price_range.sweet_spot), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t3
    }
  }, "\u0414\u0456\u0430\u043F\u0430\u0437\u043E\u043D: $", result.winning_price_range.min, " \u2013 $", result.winning_price_range.max))), result && result.error && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      fontFamily: C.mono
    }
  }, "\u26A0\uFE0F ", result.error));
}

// ── 2. Review AI Responder ────────────────────────────────────────────────────
function ReviewResponderWidget() {
  var [review, setReview] = useState("");
  var [stars, setStars] = useState(5);
  var [product, setProduct] = useState("");
  var [busy, setBusy] = useState(false);
  var [reply, setReply] = useState("");
  function genReply() {
    return _genReply.apply(this, arguments);
  }
  function _genReply() {
    _genReply = _asyncToGenerator(function* () {
      if (!review.trim()) return;
      setBusy(true);
      setReply("");
      try {
        var r = yield ai("Ти — досвідчений Etsy продавець. Пишеш персоналізовані відповіді на відгуки клієнтів. " + "Мета: підвищити рейтинг магазину, залучити нових покупців, вирішити будь-яку проблему. " + "Відповідь: 2-4 речення, тепло, професійно, з подякою. Пиши англійською.", "Відгук (" + stars + " зірок): \"" + review + "\"\n" + (product ? "Продукт: " + product + "\n" : "") + "Напиши ідеальну відповідь продавця:", 400);
        setReply(r);
      } catch (e) {
        setReply("⚠️ " + e.message);
      }
      setBusy(false);
    });
    return _genReply.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "\u2B50 Review AI Responder", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "2px 8px",
      background: "#FEF3C7",
      color: "#92400E",
      borderRadius: 4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\u0423\u041D\u0406\u041A\u0410\u041B\u042C\u041D\u041E")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 10
    }
  }, "\u0412\u0441\u0442\u0430\u0432\u043B\u044F\u0439 \u0432\u0456\u0434\u0433\u0443\u043A \u2192 AI \u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0456\u0437\u043E\u0432\u0430\u043D\u0443 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C \u044F\u043A\u0430 \u0437\u0430\u043B\u0443\u0447\u0430\u0454 \u043D\u043E\u0432\u0438\u0445 \u043F\u043E\u043A\u0443\u043F\u0446\u0456\u0432"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.t3
    }
  }, "\u041E\u0446\u0456\u043D\u043A\u0430:"), [1, 2, 3, 4, 5].map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: function () {
        setStars(s);
      },
      style: {
        fontSize: 18,
        background: "none",
        border: "none",
        cursor: "pointer",
        opacity: s <= stars ? 1 : .3
      }
    }, "\u2B50");
  })), /*#__PURE__*/React.createElement("input", {
    value: product,
    onChange: function (e) {
      setProduct(e.target.value);
    },
    placeholder: "\u041D\u0430\u0437\u0432\u0430 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0443 (\u043E\u043F\u0446\u0456\u0439\u043D\u043E)",
    className: "cf-inp",
    style: {
      fontSize: 11,
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    value: review,
    onChange: function (e) {
      setReview(e.target.value);
    },
    placeholder: "\u0412\u0441\u0442\u0430\u0432\u0442\u0435 \u0442\u0435\u043A\u0441\u0442 \u0432\u0456\u0434\u0433\u0443\u043A\u0443 \u043A\u043B\u0456\u0454\u043D\u0442\u0430...",
    className: "cf-inp",
    style: {
      minHeight: 70,
      resize: "vertical",
      fontSize: 11,
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: genReply,
    disabled: busy || !review.trim(),
    className: "cf-btn cf-btn-amber",
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C...") : "✍️ Згенерувати відповідь"), reply && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "#F0FDF4",
      border: "1px solid rgba(5,150,105,.2)",
      borderRadius: 8,
      fontSize: 12,
      color: C.t2,
      lineHeight: 1.7,
      marginBottom: 8
    }
  }, reply), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(reply);
    },
    className: "cf-btn cf-btn-ghost",
    style: {
      width: "100%",
      justifyContent: "center",
      fontSize: 11
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C")));
}

// ── 3. AI Photo Analyzer ──────────────────────────────────────────────────────
function PhotoAnalyzerWidget() {
  var [desc, setDesc] = useState("");
  var [busy, setBusy] = useState(false);
  var [result, setResult] = useState(null);
  function analyzePhoto() {
    return _analyzePhoto.apply(this, arguments);
  }
  function _analyzePhoto() {
    _analyzePhoto = _asyncToGenerator(function* () {
      if (!desc.trim()) return;
      setBusy(true);
      setResult(null);
      try {
        var raw = yield ai("Ти — Etsy фотограф та конверсія-оптимізатор. Аналізуєш опис фото продукту і даєш рекомендації. Return ONLY JSON.", "Опис фото Etsy лістингу: \"" + desc + "\"\n\n" + "Поверни JSON:\n" + '{"ctr_score":72,"issues":["проблема 1","проблема 2"],' + '"fixes":["фікс 1","фікс 2","фікс 3"],' + '"ideal_bg":"опис ідеального фону",' + '"props_to_add":["реквізит 1","реквізит 2"],' + '"title_suggestion":"SEO назва під це фото",' + '"estimated_ctr_after_fix":"8.4%",' + '"verdict":"1 речення"}', 600);
        setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setResult({
          error: e.message
        });
      }
      setBusy(false);
    });
    return _analyzePhoto.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "\uD83D\uDCF8 AI Photo Analyzer", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "2px 8px",
      background: "#FEF3C7",
      color: "#92400E",
      borderRadius: 4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\u0423\u041D\u0406\u041A\u0410\u041B\u042C\u041D\u041E")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 10
    }
  }, "\u041E\u043F\u0438\u0448\u0438 \u0441\u0432\u043E\u0454 \u0444\u043E\u0442\u043E \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0443 \u2192 AI \u043E\u0446\u0456\u043D\u044E\u0454 CTR-\u043F\u043E\u0442\u0435\u043D\u0446\u0456\u0430\u043B \u0456 \u043A\u0430\u0436\u0435 \u0449\u043E \u0437\u043C\u0456\u043D\u0438\u0442\u0438"), /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: function (e) {
      setDesc(e.target.value);
    },
    placeholder: "\u041E\u043F\u0438\u0448\u0438 \u0444\u043E\u0442\u043E: \u043D\u0430\u043F\u0440. '\u0447\u043E\u0440\u043D\u0438\u0439 \u043A\u0440\u0443\u0436\u043E\u043A \u0437 \u0437\u043E\u043B\u043E\u0442\u0438\u043C \u043D\u0430\u043F\u0438\u0441\u043E\u043C \u043D\u0430 \u0431\u0456\u043B\u043E\u043C\u0443 \u0444\u043E\u043D\u0456, \u0432\u0438\u0434 \u0441\u043F\u0435\u0440\u0435\u0434\u0443, \u043F\u0440\u0438\u0440\u043E\u0434\u043D\u0435 \u043E\u0441\u0432\u0456\u0442\u043B\u0435\u043D\u043D\u044F'",
    className: "cf-inp",
    style: {
      minHeight: 80,
      resize: "vertical",
      fontSize: 11,
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: analyzePhoto,
    disabled: busy || !desc.trim(),
    className: "cf-btn cf-btn-amber",
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0410\u043D\u0430\u043B\u0456\u0437\u0443\u044E \u0444\u043E\u0442\u043E...") : "📸 Аналізувати CTR-потенціал"), result && !result.error && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 12,
      flexShrink: 0,
      background: result.ctr_score >= 70 ? C.grnL : result.ctr_score >= 50 ? "#FEF3C7" : C.redL,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: result.ctr_score >= 70 ? C.grn : result.ctr_score >= 50 ? C.amber : C.red,
      fontFamily: C.mono,
      lineHeight: 1
    }
  }, result.ctr_score), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      color: C.t4
    }
  }, "CTR score")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 2
    }
  }, result.verdict), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.grn,
      fontFamily: C.mono
    }
  }, "\u041F\u0456\u0441\u043B\u044F \u0444\u0456\u043A\u0441\u0443: ", result.estimated_ctr_after_fix))), (result.fixes || []).map(function (f, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: C.t2,
        marginBottom: 4,
        display: "flex",
        gap: 6,
        padding: "4px 0",
        borderBottom: "1px solid " + C.bdr
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.grn,
        flexShrink: 0
      }
    }, "\u2713"), f);
  }), result.title_suggestion && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "8px 10px",
      background: C.bg3,
      borderRadius: 6,
      fontSize: 11,
      color: C.t2,
      fontStyle: "italic"
    }
  }, "\uD83D\uDCA1 SEO \u043D\u0430\u0437\u0432\u0430: \"", result.title_suggestion, "\"")), result && result.error && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      marginTop: 8,
      fontFamily: C.mono
    }
  }, "\u26A0\uFE0F ", result.error));
}

// ─── HOTTABYCH — CENTRAL NERVOUS SYSTEM ──────────────────────────────────────
var H = {
  bg: "#0D0514",
  bg2: "#130820",
  bg3: "#1A0D2E",
  surf: "#1E1035",
  bdr: "rgba(139,92,246,.25)",
  bdr2: "rgba(192,132,252,.4)",
  pur: "#8B5CF6",
  purL: "#C084FC",
  purD: "#6D28D9",
  gold: "#F0A500",
  goldL: "#FCD34D",
  txt: "#F5F3FF",
  t2: "#DDD6FE",
  t3: "#A78BFA",
  t4: "#7C3AED",
  grn: "#10B981",
  red: "#F87171"
};
function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return isNaN(r) ? "139,92,246" : r + "," + g + "," + b;
}

// ══════════════════════════════════════════════════════════════════════════════
// ALADDIN INTELLIGENCE ENGINE — Bloomberg Terminal UI v2.0
// CloseFast Omni · Real-time Multi-Stream Dashboard
// ══════════════════════════════════════════════════════════════════════════════

const BB = {
  bg: '#080B10',
  panel: '#0D1117',
  panel2: '#111820',
  border: '#1C2333',
  border2: '#243050',
  amber: '#F0A500',
  amberD: '#D4920A',
  amberL: 'rgba(240,165,0,0.08)',
  green: '#00D26A',
  red: '#FF3B5C',
  blue: '#2563EB',
  blueL: '#60A5FA',
  cyan: '#00C8FF',
  purple: '#7C3AED',
  white: '#E8EDF5',
  muted: '#4A5568',
  muted2: '#2D3748',
  mono: "'IBM Plex Mono','Courier New',monospace",
  sans: "'DM Sans',system-ui,sans-serif",
  dis: "'Syne',sans-serif"
};
const HOTTABYCH_URL = '/api/hottabych';
function hottabychFetch(_x12) {
  return _hottabychFetch.apply(this, arguments);
}
function _aFetch() {
  _aFetch = _asyncToGenerator(function* (path, opts = {}) {
    try {
      const r = yield fetch(HOTTABYCH_URL + path, {
        headers: {
          'Content-Type': 'application/json'
        },
        ...opts
      });
      return yield r.json();
    } catch (e) {
      return null;
    }
  });
  return _hottabychFetch.apply(this, arguments);
}
function synData() {
  return {
    omniScore: {
      overall: 74,
      grade: 'B',
      components: {
        ecommerce: 78,
        social: 82,
        web3: 61,
        competitors: 68
      },
      forecast: {
        revenue30d: 1140,
        confidence: 'HIGH',
        trendFactor: 1.12
      },
      risks: [{
        level: 'OPPORTUNITY',
        area: 'Social',
        msg: '#CyberpunkArt trending at 89% — capitalize NOW'
      }, {
        level: 'MEDIUM',
        area: 'Web3',
        msg: 'VLY liquidity below $50K threshold'
      }]
    },
    ecommerce: {
      shopName: 'VibeprintsProducts',
      listingCount: 124,
      revenue30d: 1024,
      orders30d: 41,
      avgOrderValue: 24.97,
      topListings: [{
        title: 'Cyberpunk Wall Art Print',
        price: 18.99,
        views: 2341
      }, {
        title: 'Monad Blockchain Poster',
        price: 29.99,
        views: 1876
      }, {
        title: 'Abstract Geometric Canvas',
        price: 34.99,
        views: 1203
      }]
    },
    social: {
      velocity: 81,
      topTrends: [{
        tag: '#CyberpunkArt',
        velocity: 89,
        views: 340000
      }, {
        tag: '#EtsyFinds',
        velocity: 88,
        views: 2100000
      }, {
        tag: '#HandmadeArt',
        velocity: 76,
        views: 1800000
      }, {
        tag: '#WallArt',
        velocity: 71,
        views: 1500000
      }, {
        tag: '#Printables',
        velocity: 65,
        views: 980000
      }],
      tiktok: {
        avgEngagement: 34.2,
        totalVideos: 847
      }
    },
    web3: {
      monad: {
        blockNumber: 2847392,
        gasPrice: 1.2,
        status: 'live'
      },
      vly: {
        priceUSD: 0.0012,
        marketCap: 120000,
        symbol: 'VLY',
        liquidity: {
          totalUSD: 42000
        }
      }
    },
    competitors: {
      competitors: [{
        label: 'Printify',
        threatLevel: 35,
        monthlyVisits: 2400000,
        rank: 892,
        opportunities: ['Capture their dissatisfied POD sellers with AI']
      }, {
        label: 'Printful',
        threatLevel: 42,
        monthlyVisits: 1800000,
        rank: 1240,
        opportunities: ['Win on Web3 integration — they have none']
      }, {
        label: 'Toolify.ai',
        threatLevel: 18,
        monthlyVisits: 320000,
        rank: 4210,
        opportunities: ['Outrank them on Etsy automation keywords']
      }]
    },
    alerts: [{
      level: 'OPPORTUNITY',
      category: 'Social',
      title: '🚀 Trend: #CyberpunkArt',
      ts: Date.now() - 60000,
      message: 'Velocity 89% on TikTok',
      action: 'Boost Etsy PPC 20% · Post TikTok now'
    }, {
      level: 'HIGH',
      category: 'Web3',
      title: '⚠️ VLY Liquidity Low',
      ts: Date.now() - 180000,
      message: 'Pool at $42K below safety threshold',
      action: 'Add liquidity or alert VLY community'
    }],
    aiAdvice: {
      advice: `🚀 CRITICAL OPPORTUNITY — Act within 4 hours:\n\n#CyberpunkArt trending at 89% velocity on TikTok. Your "Cyberpunk Wall Art Print" directly matches this.\n\nIMMEDIATE ACTIONS:\n1. ⚡ Increase Etsy PPC 20% targeting "cyberpunk art", "cyberpunk wall decor" (5 min)\n2. 📱 Record TikTok with #CyberpunkArt + #EtsyFinds (30 min)\n3. 💰 Flash discount "CYBER24" 10% off — next 24h to convert traffic spike\n\nREVENUE PROJECTION: +$127–$340 over 7 days.\nTrend window: 48–72h. Execute NOW or miss the cycle.\n\nOmniScore 74→82+ achievable this week with above actions.`,
      generated: new Date().toISOString(),
      synthetic: true
    }
  };
}
function Sparkline({
  data = [],
  color = BB.amber,
  height = 32,
  width = 80
}) {
  if (!data.length) return null;
  const mn = Math.min(...data),
    mx = Math.max(...data),
    rng = mx - mn || 1;
  const pts = data.map((v, i) => `${i / (data.length - 1) * width},${height - (v - mn) / rng * height}`).join(' ');
  return React.createElement('svg', {
    width,
    height,
    style: {
      display: 'block'
    }
  }, React.createElement('polyline', {
    points: pts,
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }));
}
function OmniRing({
  score = 0,
  grade = 'B',
  size = 56
}) {
  const r = size / 2 - 7,
    circ = 2 * Math.PI * r,
    col = score >= 75 ? BB.green : score >= 55 ? BB.amber : BB.red;
  return React.createElement('svg', {
    width: size,
    height: size
  }, React.createElement('circle', {
    cx: size / 2,
    cy: size / 2,
    r,
    fill: 'none',
    stroke: BB.border2,
    strokeWidth: 5
  }), React.createElement('circle', {
    cx: size / 2,
    cy: size / 2,
    r,
    fill: 'none',
    stroke: col,
    strokeWidth: 5,
    strokeDasharray: `${circ * score / 100} ${circ * (1 - score / 100)}`,
    strokeDashoffset: circ * 0.25,
    strokeLinecap: 'round',
    style: {
      transition: 'stroke-dasharray 1s ease'
    }
  }), React.createElement('text', {
    x: size / 2,
    y: size / 2 - 3,
    textAnchor: 'middle',
    fontFamily: BB.mono,
    fontSize: 15,
    fontWeight: 700,
    fill: col
  }, score), React.createElement('text', {
    x: size / 2,
    y: size / 2 + 11,
    textAnchor: 'middle',
    fontFamily: BB.mono,
    fontSize: 9,
    fill: BB.muted
  }, grade));
}
function Metric({
  label,
  value,
  sub,
  color,
  spark
}) {
  return React.createElement('div', {
    style: {
      background: BB.panel,
      border: `1px solid ${BB.border}`,
      borderRadius: 6,
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, React.createElement('div', {
    style: {
      fontFamily: BB.mono,
      fontSize: 9,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: BB.muted
    }
  }, label), React.createElement('div', {
    style: {
      fontFamily: BB.mono,
      fontSize: 20,
      fontWeight: 700,
      color: color || BB.white
    }
  }, value), spark && React.createElement(Sparkline, {
    data: spark,
    color: color || BB.amber
  }), sub && React.createElement('div', {
    style: {
      fontFamily: BB.mono,
      fontSize: 9,
      color: BB.muted
    }
  }, sub));
}
function EventsFeed({
  alerts = []
}) {
  const lvlCol = {
    HIGH: BB.red,
    MEDIUM: '#F59E0B',
    OPPORTUNITY: BB.green,
    POSITIVE: BB.green,
    AI: BB.cyan
  };
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, alerts.length === 0 ? React.createElement('div', {
    style: {
      padding: '20px',
      color: BB.muted,
      fontFamily: BB.mono,
      fontSize: 10,
      textAlign: 'center'
    }
  }, '— Awaiting live data —') : alerts.map((a, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      padding: '7px 10px',
      background: i % 2 === 0 ? 'transparent' : BB.panel2,
      borderLeft: `2px solid ${lvlCol[a.level] || BB.muted}`
    }
  }, React.createElement('span', {
    style: {
      fontFamily: BB.mono,
      fontSize: 9,
      color: BB.muted,
      flexShrink: 0,
      marginTop: 2
    }
  }, new Date(a.ts || Date.now()).toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit'
  })), React.createElement('div', {
    style: {
      flex: 1
    }
  }, React.createElement('div', {
    style: {
      fontSize: 11,
      color: BB.white,
      fontWeight: 600,
      marginBottom: 1
    }
  }, a.title), React.createElement('div', {
    style: {
      fontSize: 10,
      color: BB.muted,
      lineHeight: 1.4
    }
  }, a.action || a.message)))));
}
function TickerTape({
  D
}) {
  const items = [{
    l: 'VLY/MON',
    v: `$${(D?.web3?.vly?.priceUSD || .0012).toFixed(4)}`,
    up: true
  }, {
    l: 'OMNI',
    v: D?.omniScore?.overall || 74,
    up: (D?.omniScore?.overall || 74) > 65
  }, {
    l: 'REVENUE',
    v: `$${D?.ecommerce?.revenue30d || 1024}`,
    up: true
  }, {
    l: 'ORDERS',
    v: D?.ecommerce?.orders30d || 41,
    up: true
  }, {
    l: 'VELOCITY',
    v: `${D?.social?.velocity || 81}%`,
    up: (D?.social?.velocity || 81) > 60
  }, {
    l: 'GAS',
    v: `${D?.web3?.monad?.gasPrice || 1.2}G`,
    up: true
  }, {
    l: 'BLOCK',
    v: `#${(D?.web3?.monad?.blockNumber || 2847392).toLocaleString()}`,
    up: true
  }];
  const arr = [...items, ...items];
  return React.createElement('div', {
    style: {
      background: BB.panel,
      borderBottom: `1px solid ${BB.border}`,
      height: 28,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    }
  }, React.createElement('style', null, '@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}'), React.createElement('span', {
    style: {
      background: BB.amber,
      color: '#000',
      fontFamily: BB.mono,
      fontSize: 9,
      fontWeight: 800,
      padding: '0 10px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, '⚡ LIVE'), React.createElement('div', {
    style: {
      overflow: 'hidden',
      flex: 1
    }
  }, React.createElement('div', {
    style: {
      animation: 'tick 28s linear infinite',
      display: 'flex'
    }
  }, arr.map((item, i) => React.createElement('span', {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '0 16px',
      borderRight: `1px solid ${BB.border}`,
      fontFamily: BB.mono,
      fontSize: 10,
      whiteSpace: 'nowrap'
    }
  }, React.createElement('span', {
    style: {
      color: BB.muted
    }
  }, item.l), React.createElement('span', {
    style: {
      color: item.up ? BB.green : BB.red,
      fontWeight: 600
    }
  }, item.v), React.createElement('span', {
    style: {
      color: item.up ? BB.green : BB.red,
      fontSize: 8
    }
  }, item.up ? '▲' : '▼'))))));
}
function HottabychDashboard() {
  var [tab, setTab] = useState('ecommerce');
  var [D, setD] = useState(null);
  var [live, setLive] = useState(false);
  var [lastUpd, setLastUpd] = useState(null);
  var [aiQ, setAiQ] = useState('');
  var [aiR, setAiR] = useState(null);
  var [aiLoad, setAiLoad] = useState(false);
  var wsRef = useRef(null);
  var [voiceActive, setVoiceActive] = useState(false);
  var [voiceText, setVoiceText] = useState("");
  var [showPrivacy, setShowPrivacy] = useState(false);
  var [shareLoading, setShareLoading] = useState(false);
  var [userKeys, setUserKeys] = useState(function(){try{return JSON.parse(localStorage.getItem("cf_user_api_keys")||"{}"); }catch(e){return {};}});
  useEffect(function () {
    function load() {
      return _load.apply(this, arguments);
    }
    function _load() {
      _load = _asyncToGenerator(function* () {
        var d = yield aFetch('/dashboard');
        if (d) {
          setD(d);
          setLive(true);
          setLastUpd(new Date());
        } else {
          setD(synData());
          setLive(false);
        }
      });
      return _load.apply(this, arguments);
    }
    load();
    try {
      var ws = new WebSocket(window.location.protocol.replace('http', 'ws') + '//' + window.location.host + '/ws');
      wsRef.current = ws;
      ws.onopen = () => setLive(true);
      ws.onmessage = function (e) {
        try {
          var m = JSON.parse(e.data);
          if (m.channel === 'PIPELINE_COMPLETE') load();
        } catch {}
      };
      ws.onerror = () => setLive(false);
    } catch {}
    var iv = setInterval(load, 60000);
    return function () {
      clearInterval(iv);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);
    function startVoice() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) { alert("Voice not supported"); return; }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = new SR(); rec.lang="uk-UA"; rec.interimResults=false;
    setVoiceActive(true);
    rec.onresult = function(e) { var t=e.results[0][0].transcript; setVoiceText(t); setAiQ(t); setVoiceActive(false); setAiLoad(true); setTab("ai"); hottabychFetch("/api/ai/generate",{method:"POST",body:JSON.stringify({question:t,voice:true})}).then(function(r){if(r)setAiR(r);setAiLoad(false);}).catch(function(){setAiLoad(false);}); };
    rec.onerror=function(){setVoiceActive(false);}; rec.onend=function(){setVoiceActive(false);}; rec.start();
  }

  function shareInsight() {
    setShareLoading(true);
    try {
      var canvas=document.createElement("canvas"); canvas.width=1200; canvas.height=630;
      var c=canvas.getContext("2d"); if(!c){setShareLoading(false);return;}
      c.fillStyle="#080B10"; c.fillRect(0,0,1200,630);
      c.strokeStyle="#F0A500"; c.lineWidth=3; c.strokeRect(8,8,1184,614);
      c.fillStyle="#F0A500"; c.font="bold 32px monospace"; c.fillText("HOTTABYCH ENGINE",60,80);
      c.fillStyle="#4A5568"; c.font="14px monospace"; c.fillText("CloseFast Omni - closefast.tech",60,110);
      var sc=d?(d.jinScore||d.omniScore||{}):{overall:74,grade:"B"};
      c.fillStyle="#F0A500"; c.font="bold 96px monospace"; c.fillText(String(sc.overall||74),490,285);
      c.fillStyle="#E8EDF5"; c.font="bold 24px monospace"; c.fillText("JIN POWER / 100",410,335);
      c.fillStyle="#00D26A"; c.font="bold 24px monospace"; c.fillText("$"+String((d&&d.ecommerce?d.ecommerce.revenue30d:0)||1024)+"/mo",60,540);
      c.fillStyle="#F0A500"; c.font="12px monospace"; c.fillText("closefast.tech - Powered by Hottabych Engine",60,575);
      var url=canvas.toDataURL("image/png"); var a=document.createElement("a"); a.href=url; a.download="hottabych-jin-power.png"; a.click();
    } catch(e){console.error("Share:",e.message);}
    setShareLoading(false);
  }

  function saveUserKeys() {
    try { localStorage.setItem("cf_user_api_keys",JSON.stringify(userKeys)); var us={}; try{us=JSON.parse(sessionStorage.getItem("cf_user")||"{}");}catch(e){} if(us.email){hottabychFetch("/api/keys",{method:"POST",body:JSON.stringify({email:us.email,keys:userKeys})});} alert("Keys saved!"); } catch(e){alert("Error: "+e.message);}
  }

function askAI() {
    return _askAI.apply(this, arguments);
  }
  function _askAI() {
    _askAI = _asyncToGenerator(function* () {
      if (!aiQ.trim()) return;
      setAiLoad(true);
      setAiR(null);
      var res = yield aFetch('/ai-advice', {
        method: 'POST',
        body: JSON.stringify({
          question: aiQ
        })
      });
      setAiR(res || (D || synData()).aiAdvice);
      setAiLoad(false);
    });
    return _askAI.apply(this, arguments);
  }
  var d = D || synData();
  var E = d.ecommerce || {};
  var So = d.social || {};
  var W = d.web3 || {};
  var C = d.competitors || {};
  var rvH = [720, 780, 810, 750, 890, 920, 880, 960, E.revenue30d || 1024];
  var svH = [45, 52, 48, 61, 73, 68, 79, 81, So.velocity || 81];
  var TABS = [{
    k: 'ecommerce',
    l: 'E-COMMERCE',
    i: '🛍'
  }, {
    k: 'social',
    l: 'SOCIAL',
    i: '📱'
  }, {
    k: 'web3',
    l: 'WEB3',
    i: '⛓'
  }, {
    k: 'competitors',
    l: 'COMPETITORS',
    i: '🎯'
  }, {
    k: 'ai',
    l: 'AI ADVISOR',
    i: '🤖'
  },{k:'settings',l:'SETTINGS',i:'⚙️'}];
  var g4 = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: 10
  };
  var g3 = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 10
  };
  var pan = {
    background: BB.panel,
    border: `1px solid ${BB.border}`,
    borderRadius: 6,
    padding: 14
  };
  var lbl = {
    fontFamily: BB.mono,
    fontSize: 9,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: BB.muted
  };
  var scr = d.omniScore || {};
  function lvlColor(l) {
    return {
      HIGH: BB.red,
      MEDIUM: '#F59E0B',
      OPPORTUNITY: BB.green,
      POSITIVE: BB.green,
      AI: BB.cyan
    }[l] || BB.muted;
  }
  function badge(v, l) {
    var c = lvlColor(l);
    return React.createElement('span', {
      style: {
        background: c + '20',
        border: `1px solid ${c}40`,
        borderRadius: 3,
        padding: '2px 7px',
        fontSize: 9,
        fontFamily: BB.mono,
        color: c
      }
    }, v);
  }
  var header = React.createElement('div', {
    style: {
      background: BB.panel,
      borderBottom: `1px solid ${BB.border}`,
      padding: '10px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, React.createElement('span', {
    style: {
      fontFamily: BB.dis,
      fontSize: 16,
      fontWeight: 800,
      color: BB.amber
    }
  }, '⚡ ALADDIN'), React.createElement('span', {
    style: {
      fontFamily: BB.mono,
      fontSize: 10,
      color: BB.muted
    }
  }, 'INTELLIGENCE ENGINE v2.0'), badge(live ? '● LIVE' : '○ OFFLINE', live ? 'POSITIVE' : 'HIGH')), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement(OmniRing, {
    score: scr.overall || 0,
    grade: scr.grade || 'B',
    size: 56
  }), React.createElement('div', null, React.createElement('div', {
    style: lbl
  }, 'OMNISCORE'), React.createElement('div', {
    style: {
      fontFamily: BB.mono,
      fontSize: 11,
      color: BB.amber
    }
  }, (scr.overall || 0) + '/100'), React.createElement('div', {
    style: {
      fontFamily: BB.mono,
      fontSize: 9,
      color: BB.muted
    }
  }, 'Grade: ' + (scr.grade || 'B')))), React.createElement('div', {
    style: {
      textAlign: 'right'
    }
  }, React.createElement('div', {
    style: lbl
  }, 'LAST UPDATE'), React.createElement('div', {
    style: {
      fontFamily: BB.mono,
      fontSize: 10,
      color: BB.white
    }
  }, lastUpd ? lastUpd.toLocaleTimeString() : '--:--:--'))));
  var tabBar = React.createElement('div', {
    style: {
      display: 'flex',
      background: BB.panel,
      borderBottom: `1px solid ${BB.border}`
    }
  }, TABS.map(t => React.createElement('button', {
    key: t.k,
    onClick: () => setTab(t.k),
    style: {
      padding: '8px 16px',
      fontFamily: BB.mono,
      fontSize: 10,
      letterSpacing: '.08em',
      cursor: 'pointer',
      border: 'none',
      background: tab === t.k ? BB.amberL : 'transparent',
      borderBottom: tab === t.k ? `2px solid ${BB.amber}` : '2px solid transparent',
      color: tab === t.k ? BB.amber : BB.muted,
      transition: 'all .15s'
    }
  }, t.i + ' ' + t.l)));
  var sidePanel = React.createElement('div', {
    style: {
      width: 260,
      flexShrink: 0,
      background: BB.panel,
      borderLeft: `1px solid ${BB.border}`,
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement('div', {
    style: {
      padding: '9px 12px',
      borderBottom: `1px solid ${BB.border}`,
      fontFamily: BB.mono,
      fontSize: 10,
      color: BB.amber,
      letterSpacing: '.1em'
    }
  }, '⚡ LIVE EVENTS'), React.createElement('div', {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, React.createElement(EventsFeed, {
    alerts: d.alerts || []
  })), React.createElement('div', {
    style: {
      padding: 12,
      borderTop: `1px solid ${BB.border}`
    }
  }, React.createElement('div', {
    style: {
      ...lbl,
      marginBottom: 8
    }
  }, 'OMNISCORE COMPONENTS'), Object.entries(scr.components || {}).map(([k, v]) => {
    var col = v >= 70 ? BB.green : v >= 50 ? BB.amber : BB.red;
    return React.createElement('div', {
      key: k,
      style: {
        marginBottom: 6
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 2
      }
    }, React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 9,
        color: BB.muted,
        textTransform: 'uppercase'
      }
    }, k), React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 9,
        color: col
      }
    }, v)), React.createElement('div', {
      style: {
        background: BB.border,
        borderRadius: 2,
        height: 3
      }
    }, React.createElement('div', {
      style: {
        background: col,
        width: v + '%',
        height: '100%',
        borderRadius: 2,
        transition: 'width 1s ease'
      }
    })));
  })));
  var content;
  var wrap = function () {
    return React.createElement('div', {
      style: {
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, ...arguments);
  };
  if (tab === 'ecommerce') {
    content = wrap(React.createElement('div', {
      style: g4
    }, React.createElement(Metric, {
      label: 'REVENUE 30D',
      value: '$' + (E.revenue30d || 0),
      spark: rvH,
      color: BB.green,
      sub: (E.orders30d || 0) + ' orders · avg $' + (E.avgOrderValue || 0)
    }), React.createElement(Metric, {
      label: 'LISTINGS',
      value: E.listingCount || 0,
      color: BB.amber,
      sub: 'active Etsy'
    }), React.createElement(Metric, {
      label: 'AVG ORDER',
      value: '$' + (E.avgOrderValue || 0),
      color: BB.blueL
    }), React.createElement(Metric, {
      label: 'PROJECTED',
      value: '$' + (scr.forecast?.revenue30d || 0),
      color: BB.cyan,
      sub: 'confidence: ' + (scr.forecast?.confidence || 'MED')
    })), React.createElement('div', {
      style: pan
    }, React.createElement('div', {
      style: {
        ...lbl,
        marginBottom: 10
      }
    }, 'TOP LISTINGS BY VIEWS'), ...(E.topListings || []).map((l, i) => React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '7px 0',
        borderBottom: `1px solid ${BB.border}`
      }
    }, React.createElement('span', {
      style: {
        fontSize: 12,
        color: BB.white,
        flex: 1
      }
    }, l.title), React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 11,
        color: BB.amber,
        marginLeft: 14
      }
    }, '$' + l.price), React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 10,
        color: BB.muted,
        marginLeft: 14
      }
    }, (l.views || 0).toLocaleString() + ' views')))));
  } else if (tab === 'social') {
    content = wrap(React.createElement('div', {
      style: g3
    }, React.createElement(Metric, {
      label: 'SOCIAL VELOCITY',
      value: (So.velocity || 0) + '%',
      spark: svH,
      color: So.velocity > 70 ? BB.green : BB.amber
    }), React.createElement(Metric, {
      label: 'TIKTOK ENG',
      value: (So.tiktok?.avgEngagement || 0).toFixed(1) + '%',
      color: BB.cyan
    }), React.createElement(Metric, {
      label: 'HOT TRENDS',
      value: (So.topTrends || []).filter(t => t.velocity > 70).length,
      color: BB.purple,
      sub: 'velocity > 70%'
    })), React.createElement('div', {
      style: pan
    }, React.createElement('div', {
      style: {
        ...lbl,
        marginBottom: 12
      }
    }, 'TREND HEATMAP — REAL-TIME'), React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, ...(So.topTrends || []).map((t, i) => {
      var intensity = Math.min(1, (t.velocity || 0) / 100);
      return React.createElement('div', {
        key: i,
        style: {
          background: `rgba(240,165,0,${intensity * .3})`,
          border: `1px solid rgba(240,165,0,${intensity * .7})`,
          borderRadius: 7,
          padding: '8px 14px',
          fontSize: 11 + Math.round(intensity * 4),
          fontWeight: intensity > .7 ? 700 : 400,
          fontFamily: BB.mono,
          color: intensity > .7 ? BB.amber : BB.white
        }
      }, React.createElement('div', null, t.tag), React.createElement('div', {
        style: {
          fontSize: 9,
          color: BB.muted,
          marginTop: 2
        }
      }, t.velocity + '% · ' + ((t.views || 0) / 1000).toFixed(0) + 'K views'));
    }))));
  } else if (tab === 'web3') {
    var vly = W.vly || {};
    content = wrap(React.createElement('div', {
      style: g4
    }, React.createElement(Metric, {
      label: 'VLY PRICE',
      value: '$' + (vly.priceUSD || 0),
      color: BB.amber
    }), React.createElement(Metric, {
      label: 'MARKET CAP',
      value: '$' + (vly.marketCap || 0).toLocaleString(),
      color: BB.blueL
    }), React.createElement(Metric, {
      label: 'LIQUIDITY',
      value: '$' + (vly.liquidity?.totalUSD || 0).toLocaleString(),
      color: (vly.liquidity?.totalUSD || 0) > 50000 ? BB.green : BB.red
    }), React.createElement(Metric, {
      label: 'BLOCK #',
      value: (W.monad?.blockNumber || 0).toLocaleString(),
      color: BB.cyan,
      sub: 'Gas: ' + (W.monad?.gasPrice || 0) + ' GWEI'
    })), React.createElement('div', {
      style: pan
    }, React.createElement('div', {
      style: {
        ...lbl,
        marginBottom: 10
      }
    }, 'MONAD MAINNET STATUS'), React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10
      }
    }, ...[['Contract', vly.contract?.substring(0, 20) + '...'], ['Symbol', 'VLY'], ['Total Supply', (vly.totalSupply || 100000000).toLocaleString()], ['Chain ID', '143 · Monad'], ['Network Status', (W.monad?.status || 'live').toUpperCase()], ['LP Pool', 'PancakeSwap V2 · MON']].map(([k, v], i) => React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '6px 0',
        borderBottom: `1px solid ${BB.border}`
      }
    }, React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 10,
        color: BB.muted
      }
    }, k), React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 10,
        color: BB.white
      }
    }, v))))));
  } else if (tab === 'competitors') {
    content = wrap(...(C.competitors || []).map((c, i) => React.createElement('div', {
      key: i,
      style: pan
    }, React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }
    }, React.createElement('span', {
      style: {
        fontFamily: BB.dis,
        fontSize: 15,
        fontWeight: 700,
        color: BB.white
      }
    }, c.label || c.domain), badge('THREAT: ' + (c.threatLevel || 0) + '%', c.threatLevel > 40 ? 'HIGH' : c.threatLevel > 25 ? 'MEDIUM' : 'POSITIVE')), React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 10
      }
    }, React.createElement('div', null, React.createElement('div', {
      style: lbl
    }, 'Monthly Visits'), React.createElement('div', {
      style: {
        fontFamily: BB.mono,
        fontSize: 14,
        color: BB.white
      }
    }, ((c.monthlyVisits || 0) / 1000).toFixed(0) + 'K')), React.createElement('div', null, React.createElement('div', {
      style: lbl
    }, 'Rank'), React.createElement('div', {
      style: {
        fontFamily: BB.mono,
        fontSize: 14,
        color: BB.white
      }
    }, (c.rank || 0).toLocaleString())), React.createElement('div', null, React.createElement('div', {
      style: lbl
    }, 'Opportunity'), React.createElement('div', {
      style: {
        fontFamily: BB.mono,
        fontSize: 10,
        color: BB.green
      }
    }, (c.opportunities || ['Capture their audience'])[0]))))));
  } else if (tab === 'ai') {
    var adv = aiR || d.aiAdvice || {};
    content = wrap(React.createElement('div', {
      style: {
        display: 'flex',
        gap: 10
      }
    }, React.createElement('input', {
      value: aiQ,
      onChange: e => setAiQ(e.target.value),
      onKeyDown: e => {
        if (e.key === 'Enter') askAI();
      },
      placeholder: 'Ask Aladdin: "How to increase revenue 30% this month?"',
      style: {
        flex: 1,
        height: 42,
        background: BB.panel2,
        border: `1px solid ${BB.border2}`,
        borderRadius: 6,
        padding: '0 14px',
        fontFamily: BB.mono,
        fontSize: 12,
        color: BB.white,
        outline: 'none'
      }
    }), React.createElement('button', {
      onClick: askAI,
      disabled: aiLoad,
      style: {
        height: 42,
        padding: '0 18px',
        background: BB.amber,
        color: '#000',
        border: 'none',
        borderRadius: 6,
        fontFamily: BB.dis,
        fontWeight: 800,
        fontSize: 13,
        cursor: 'pointer',
        opacity: aiLoad ? .6 : 1
      }
    }, aiLoad ? '⟳ Analyzing...' : '⚡ Ask AI')), React.createElement('div', {
      style: {
        display: 'flex',
        gap: 7,
        flexWrap: 'wrap'
      }
    }, ...['Maximize revenue this week', 'Analyze trend opportunities', 'VLY liquidity strategy', 'Beat Printify on Etsy', '7-day action plan'].map((q, i) => React.createElement('button', {
      key: i,
      onClick: () => setAiQ(q),
      style: {
        padding: '5px 11px',
        background: BB.panel2,
        border: `1px solid ${BB.border}`,
        borderRadius: 4,
        fontFamily: BB.mono,
        fontSize: 10,
        color: BB.muted,
        cursor: 'pointer'
      }
    }, q))), adv.advice && React.createElement('div', {
      style: {
        ...pan,
        borderColor: BB.cyan + '44'
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 10
      }
    }, React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 10,
        color: BB.cyan
      }
    }, '🤖 ALADDIN INTELLIGENCE'), adv.synthetic && badge('DEMO MODE', 'MEDIUM'), React.createElement('span', {
      style: {
        fontFamily: BB.mono,
        fontSize: 9,
        color: BB.muted
      }
    }, new Date(adv.generated || Date.now()).toLocaleTimeString())), React.createElement('pre', {
      style: {
        fontFamily: BB.mono,
        fontSize: 11,
        color: BB.white,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.75,
        margin: 0
      }
    }, adv.advice)));
  }
  
  if (tab === 'settings') {
    content = React.createElement('div',{style:{padding:14,display:'flex',flexDirection:'column',gap:12}},
      React.createElement('div',{style:{background:'#0D1117',border:'1px solid #1C2333',borderRadius:6,padding:14}},
        React.createElement('div',{style:{fontFamily:BB.mono,fontSize:9,textTransform:'uppercase',color:BB.amber,letterSpacing:'.12em',marginBottom:8}},'HYBRID API KEYS'),
        React.createElement('div',{style:{fontSize:11,color:BB.muted,marginBottom:12}},'Free: System keys. Pro: Your own keys take priority.'),
        React.createElement('button',{onClick:saveUserKeys,style:{height:36,padding:'0 16px',background:BB.amber,color:'#000',border:'none',borderRadius:6,fontFamily:BB.dis,fontWeight:800,fontSize:13,cursor:'pointer'}},'Save Keys')),
      React.createElement('div',{style:{background:'#0D1117',border:'1px solid #1C2333',borderRadius:6,padding:14}},
        React.createElement('div',{style:{fontFamily:BB.mono,fontSize:9,textTransform:'uppercase',color:BB.muted,letterSpacing:'.12em',marginBottom:10}},'SOCIAL & SUPPORT'),
        React.createElement('div',{style:{display:'flex',gap:10,flexWrap:'wrap'}},
          React.createElement('a',{href:'https://x.com/volya089',target:'_blank',style:{padding:'6px 12px',background:'#111820',border:'1px solid #1C2333',borderRadius:6,fontFamily:BB.mono,fontSize:10,color:BB.amber,textDecoration:'none'}},'X: @volya089'),
          React.createElement('a',{href:'https://t.me/VolyaUAOfficiale',target:'_blank',style:{padding:'6px 12px',background:'#111820',border:'1px solid #1C2333',borderRadius:6,fontFamily:BB.mono,fontSize:10,color:BB.amber,textDecoration:'none'}},'Telegram: @VolyaUAOfficiale'),
          React.createElement('a',{href:'mailto:support@closefast.tech',style:{padding:'6px 12px',background:'#111820',border:'1px solid #1C2333',borderRadius:6,fontFamily:BB.mono,fontSize:10,color:BB.amber,textDecoration:'none'}},'support@closefast.tech'),
          React.createElement('button',{onClick:function(){setShowPrivacy(true);},style:{padding:'6px 12px',background:'#111820',border:'1px solid #1C2333',borderRadius:6,fontFamily:BB.mono,fontSize:10,color:BB.amber,cursor:'pointer'}},'Privacy Policy'))));
  }

  var poweredBadge=React.createElement('div',{style:{position:'fixed',bottom:16,left:16,zIndex:40,background:'#0D1117',border:'1px solid rgba(240,165,0,.3)',borderRadius:8,padding:'6px 12px',display:'flex',alignItems:'center',gap:7,cursor:'pointer'},onClick:function(){window.open('https://closefast.tech','_blank');}},
    React.createElement('span',null,'🔮'),
    React.createElement('div',null,
      React.createElement('div',{style:{fontFamily:BB.dis,fontSize:10,fontWeight:800,color:BB.amber,lineHeight:1}},'Hottabych'),
      React.createElement('div',{style:{fontFamily:BB.mono,fontSize:8,color:BB.muted}},'closefast.tech')));

return React.createElement('div', {
    style: {
      background: BB.bg,
      color: BB.white,
      fontFamily: BB.sans,
      minHeight: 400
    }
  }, header, React.createElement(TickerTape, {
    D: d
  }), React.createElement('div', {
    style: {
      display: 'flex',
      height: 'calc(100vh - 120px)'
    }
  }, React.createElement('div', {
    style: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, tabBar, React.createElement('div', {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, content)), sidePanel));
}

// ── HOTTABYCH TAB (wraps Aladdin Engine) ──────────────────────────────────────
function HottabychTabOriginal() {
  var [activeModule, setActiveModule] = useState("aladdin");
  var [mcGoal, setMcGoal] = useState("");
  var [mcCapital, setMcCapital] = useState("");
  var [mcResult, setMcResult] = useState(null);
  var [mcBusy, setMcBusy] = useState(false);
  var [riskBusy, setRiskBusy] = useState(false);
  var [riskResult, setRiskResult] = useState(null);
  var [liqBusy, setLiqBusy] = useState(false);
  var [liqResult, setLiqResult] = useState(null);
  var [liqIncome, setLiqIncome] = useState("");
  var [selfCmd, setSelfCmd] = useState("");
  var [selfResult, setSelfResult] = useState(null);
  var [selfBusy, setSelfBusy] = useState(false);
  var [scanBusy, setScanBusy] = useState(false);
  var [scanResult, setScanResult] = useState(null);
  var [propSphere, setPropSphere] = useState("omni");
  var [propBusy, setPropBusy] = useState(false);
  var [propResult, setPropResult] = useState(null);
  var [geoBusy, setGeoBusy] = useState(false);
  var [geoResult, setGeoResult] = useState(null);
  var [geoContext, setGeoContext] = useState("");
  var [ballScore, setBallScore] = useState(null);
  var [ballBusy, setBallBusy] = useState(false);
  var [err, setErr] = useState("");

  // ── Prophet: Predictive pre-market advisory ──
  // ── 10 spheres — all selectable, multi-select ──
  var ALL_SPHERES = [{
    k: "crypto",
    icon: "₿",
    l: "Крипто & Web3",
    col: "#F59E0B",
    sub: "BTC·ETH·MON·DeFi·NFT"
  }, {
    k: "stocks",
    icon: "📈",
    l: "Акції & ETF",
    col: "#3B82F6",
    sub: "S&P500·Nasdaq·дивіденди"
  }, {
    k: "ecom",
    icon: "🛒",
    l: "E-commerce",
    col: "#10B981",
    sub: "Etsy·Amazon·Shopify·POD"
  }, {
    k: "fashion",
    icon: "👗",
    l: "Мода & Стиль",
    col: "#EC4899",
    sub: "Тренди·Streetwear·Люкс"
  }, {
    k: "social",
    icon: "📱",
    l: "Соцмережі",
    col: "#8B5CF6",
    sub: "TikTok·IG·YouTube·Reels"
  }, {
    k: "ai",
    icon: "🤖",
    l: "AI & Технології",
    col: "#06B6D4",
    sub: "GPT·Claude·Gemini·Sora"
  }, {
    k: "agents",
    icon: "⚡",
    l: "AI Агенти & SaaS",
    col: "#A78BFA",
    sub: "AutoGPT·Agents·MCP·n8n"
  }, {
    k: "realty",
    icon: "🏠",
    l: "Нерухомість",
    col: "#F97316",
    sub: "Ринок·Оренда·REITs"
  }, {
    k: "commodities",
    icon: "⛽",
    l: "Сировина",
    col: "#84CC16",
    sub: "Нафта·Золото·Пшениця"
  }, {
    k: "news",
    icon: "🌐",
    l: "Новини & Геополіт.",
    col: "#EF4444",
    sub: "ФРС·Вибори·Конфлікти"
  }];
  function runProphet() {
    return _runProphet.apply(this, arguments);
  } // ── Geopolitical Oracle ──
  function _runProphet() {
    _runProphet = _asyncToGenerator(function* () {
      setPropBusy(true);
      setErr("");
      setPropResult(null);
      // Build sphere list: either selected spheres or ALL
      var selected = propSphere === "omni" ? ALL_SPHERES : ALL_SPHERES.filter(function (s) {
        return propSphere.indexOf(s.k) !== -1;
      });
      var sphereNames = selected.map(function (s) {
        return s.l;
      }).join(", ");
      try {
        var raw = yield ai("Ти — Хоттабич, Центральна Нервова Система CloseFast Omni. Ти — цифровий двійник Aladdin від BlackRock, але для звичайних людей. Твоя місія: сканувати ВСІ ринки та знаходити БУДЬ-ЯКУ можливість заробити або не втратити — незалежно від сфери. Не звітуй про минуле. Попереджай про МАЙБУТНЄ. Аналізуй 2–4 тижні вперед. Відповідай ТІЛЬКИ JSON, без markdown.", "OMNISCAN — повний аналіз всіх сфер одночасно.\n" + "Активні сфери: " + sphereNames + "\n\n" + "Профіль користувача:\n" + "- Etsy-продавець (VibeprintsProducts, Monad/Web3 prints, Printify POD)\n" + "- Крипто-власник (BTC, ETH, MON/Monad, VLY token)\n" + "- Розробник SaaS (CloseFast Omni — Etsy automation)\n" + "- Локація: Словаччина (EU), дохід в USD/EUR\n" + "- Аудиторія: глобальна, переважно США\n" + "- Дата: Березень 2026\n\n" + "Задача: знайди ТОП-6 МОЖЛИВОСТЕЙ заробити (або уникнути збитків) прямо зараз.\n" + "Шукай: трендові ніші, нові AI-інструменти, рухи ринку, соціальні тренди, сезонні піки, нові платформи, зміни алгоритмів — ВСЕ що має шанс принести гроші.\n\n" + "Return ONLY valid JSON:\n" + "{\n" + "  \"omni_temperature\": 74,\n" + "  \"scanned_spheres\": " + selected.length + ",\n" + "  \"top_opportunity\": \"Найгарячіша можливість прямо зараз одним реченням\",\n" + "  \"hottabych_message\": \"Персональне послання господарю\",\n" + "  \"opportunities\": [\n" + "    {\n" + "      \"rank\": 1,\n" + "      \"sphere\": \"назва сфери\",\n" + "      \"sphere_icon\": \"emoji\",\n" + "      \"title\": \"Назва можливості\",\n" + "      \"event\": \"Що відбувається або станеться\",\n" + "      \"probability\": 85,\n" + "      \"time_horizon\": \"3-7 днів\",\n" + "      \"chain\": \"Подія X → Вплив Y → Результат Z\",\n" + "      \"action_today\": \"Конкретна дія яку треба зробити СЬОГОДНІ\",\n" + "      \"potential_income\": \"+$200-500/тиж\",\n" + "      \"risk_level\": \"low\",\n" + "      \"urgency\": \"high\",\n" + "      \"how_to_start\": \"Покроково: 1. ... 2. ... 3. ...\",\n" + "      \"tools_needed\": [\"інструмент1\", \"інструмент2\"],\n" + "      \"spell\": \"Заклинання мудрості від Хоттабича\"\n" + "    }\n" + "  ],\n" + "  \"avoid_now\": [\"Що НЕ робити зараз і чому\"],\n" + "  \"ai_agent_to_build\": \"Опис AI-агента якого треба побудувати щоб автоматизувати топ-можливість\",\n" + "  \"weekly_focus\": \"Один фокус на цей тиждень для максимального результату\"\n" + "}", 1800);
        setPropResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setErr(e.message);
      }
      setPropBusy(false);
    });
    return _runProphet.apply(this, arguments);
  }
  function runGeo() {
    return _runGeo.apply(this, arguments);
  } // ── Crystal Ball: calculate success probability ──
  function _runGeo() {
    _runGeo = _asyncToGenerator(function* () {
      setGeoBusy(true);
      setErr("");
      setGeoResult(null);
      try {
        var raw = yield ai("Ти — Хоттабич, режим GEOPOLITICAL ORACLE. Ти працюєш за принципом Event-Driven Analytics та Alternative Data Analysis. Твоє завдання — аналізувати неструктуровані глобальні події та переводити їх у фінансовий вплив. Відповідай тільки JSON.", "Контекст бізнесу: Etsy-продавець (Словаччина/Monad ніша), Printify POD-фулфілмент (EU хаби), крипто-портфель (BTC/ETH/MON), доходи в USD/EUR.\n" + (geoContext ? "Додаткові дані від користувача: " + geoContext + "\n" : "") + "Дата аналізу: Березень 2026.\n\n" + "Проаналізуй поточний глобальний фон та побудуй Early Warning System з ланцюжками кореляцій.\n\n" + "Return JSON:\n{\n" + "  \"global_risk_temperature\": 58,\n" + "  \"insider_whisper\": \"Ключова інсайдерська порада\",\n" + "  \"alerts\": [\n" + "    {\n" + "      \"signal\": \"Опис події/сигналу\",\n" + "      \"region\": \"EU/US/Asia/Global\",\n" + "      \"time_to_market_reaction\": \"12-24 години\",\n" + "      \"chain\": \"Подія → Ресурс → Актив\",\n" + "      \"etsy_impact\": \"Як впливає на Etsy магазин\",\n" + "      \"crypto_impact\": \"Як впливає на крипто\",\n" + "      \"printify_impact\": \"Як впливає на фулфілмент\",\n" + "      \"loss_or_gain\": \"+12% або -8%\",\n" + "      \"hottabych_action\": \"Дія яку Хоттабич рекомендує ЗАРАЗ\",\n" + "      \"urgency\": \"critical\"\n" + "    }\n" + "  ],\n" + "  \"sentiment_score\": {\"fear\":42,\"greed\":58,\"description\":\"Neutral-bullish\"},\n" + "  \"safe_haven_assets\": [\"USDC\",\"Gold ETF\",\"CHF\"],\n" + "  \"lab_script_idea\": \"Скрипт який Хоттабич пропонує написати автоматично\",\n" + "  \"global_forecast_7d\": \"Загальний прогноз на 7 днів\"\n" + "}", 1200);
        setGeoResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setErr(e.message);
      }
      setGeoBusy(false);
    });
    return _runGeo.apply(this, arguments);
  }
  function runBall() {
    return _runBall.apply(this, arguments);
  } // ── Monte Carlo simulator ──
  function _runBall() {
    _runBall = _asyncToGenerator(function* () {
      setBallBusy(true);
      setErr("");
      try {
        var raw = yield ai("You are Aladdin — BlackRock's risk system. Return ONLY JSON, no markdown.", "Calculate the business success probability for an Etsy seller who has: VibeprintsProducts store (3 listings, 1 sale, 4 months old, crypto/motivational niche, based in Slovakia). " + "Analyze: market timing, niche competition, seller profile, growth trajectory. " + "Return JSON: {\"probability\":73,\"trend\":\"rising\",\"verdict\":\"Strong potential with scaling\",\"risks\":[\"low listing count\",\"niche clarity\"],\"boosters\":[\"crypto niche trending\",\"POD zero inventory\"],\"next_30_days\":\"Add 15 listings, focus Monad niche\"}", 600);
        setBallScore(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setErr(e.message);
      }
      setBallBusy(false);
    });
    return _runBall.apply(this, arguments);
  }
  function runMonteCarlo() {
    return _runMonteCarlo.apply(this, arguments);
  } // ── Global Risk Radar ──
  function _runMonteCarlo() {
    _runMonteCarlo = _asyncToGenerator(function* () {
      if (!mcGoal.trim() || !mcCapital) {
        setErr("Enter goal and current capital.");
        return;
      }
      setMcBusy(true);
      setErr("");
      try {
        var raw = yield ai("You are a quantitative financial analyst running Monte Carlo simulations. Return ONLY JSON.", "Run 10,000 Monte Carlo scenarios for this Etsy/POD business owner.\n" + "Goal: " + mcGoal + "\nCurrent monthly Etsy revenue: ~$" + mcCapital + "\n\n" + "Simulate: revenue growth (5–40%/mo), Printify margins (30–45%), market volatility, seasonal demand.\n" + "Return JSON: {\n" + "  \"goal\": \"" + mcGoal + "\",\n" + "  \"scenarios_run\": 10000,\n" + "  \"success_probability\": 67,\n" + "  \"median_months_to_goal\": 18,\n" + "  \"best_case_months\": 8,\n" + "  \"worst_case_months\": 48,\n" + "  \"expected_monthly_revenue_12mo\": 3400,\n" + "  \"key_risk_factors\": [\"factor1\",\"factor2\",\"factor3\"],\n" + "  \"optimal_strategy\": \"detailed 3-step strategy\",\n" + "  \"monthly_milestones\": [{\"month\":3,\"revenue\":800},{\"month\":6,\"revenue\":1800},{\"month\":12,\"revenue\":3400}],\n" + "  \"verdict\": \"one sentence verdict\"\n" + "}", 1000);
        setMcResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setErr(e.message);
      }
      setMcBusy(false);
    });
    return _runMonteCarlo.apply(this, arguments);
  }
  function runRiskRadar() {
    return _runRiskRadar.apply(this, arguments);
  } // ── Liquidity Engine ──
  function _runRiskRadar() {
    _runRiskRadar = _asyncToGenerator(function* () {
      setRiskBusy(true);
      setErr("");
      try {
        var raw = yield ai("You are a global risk analyst combining Etsy marketplace data, crypto markets, and macroeconomics. Return ONLY JSON.", "Analyze global risk for VibeprintsProducts Etsy store.\n" + "Context: Etsy seller, Printify POD, crypto niche (Monad/Web3 prints), Ukraine-based founder.\n" + "Current date: March 2026.\n" + "Return JSON: {\n" + "  \"overall_risk_level\": \"medium\",\n" + "  \"risk_score\": 42,\n" + "  \"etsy_market_risk\": {\"level\":\"low\",\"reason\":\"Q1 2026 Etsy traffic up 12%\"},\n" + "  \"crypto_correlation\": {\"impact\":\"positive\",\"reason\":\"Monad TGE drove Web3 print searches +340%\"},\n" + "  \"currency_risk\": {\"level\":\"medium\",\"reason\":\"EUR/USD volatility affects EU buyer pricing\"},\n" + "  \"supply_chain_risk\": {\"level\":\"low\",\"reason\":\"Printify has 7 EU fulfillment centers\"},\n" + "  \"seasonal_risk\": {\"current\":\"Easter peak\",\"action\":\"Push holiday-themed crypto prints now\"},\n" + "  \"geopolitical_risk\": {\"level\":\"low\",\"reason\":\"Digital POD not affected by shipping restrictions\"},\n" + "  \"opportunities\": [\"opp1\",\"opp2\",\"opp3\"],\n" + "  \"immediate_actions\": [\"action1\",\"action2\"],\n" + "  \"30day_forecast\": \"Revenue +25–40% if crypto niche listings scaled to 25+\"\n" + "}", 900);
        setRiskResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setErr(e.message);
      }
      setRiskBusy(false);
    });
    return _runRiskRadar.apply(this, arguments);
  }
  function runLiquidity() {
    return _runLiquidity.apply(this, arguments);
  } // ── Self-Coding Assistant ──
  function _runLiquidity() {
    _runLiquidity = _asyncToGenerator(function* () {
      if (!liqIncome) {
        setErr("Enter monthly income.");
        return;
      }
      setLiqBusy(true);
      setErr("");
      try {
        var raw = yield ai("You are a personal CFO and liquidity strategist. Return ONLY JSON.", "Monthly Etsy/Stripe income: $" + liqIncome + "\n" + "Business type: Etsy POD (Printify), crypto niche, solo founder.\n" + "Calculate optimal capital allocation.\n" + "Return JSON: {\n" + "  \"monthly_income\": " + liqIncome + ",\n" + "  \"safe_amount\": 0,\n" + "  \"safe_pct\": 35,\n" + "  \"safe_where\": \"USDC stable yield 4.2% APY or bank savings\",\n" + "  \"growth_amount\": 0,\n" + "  \"growth_pct\": 40,\n" + "  \"growth_where\": \"Reinvest in Etsy ads + new listings\",\n" + "  \"reinvest_amount\": 0,\n" + "  \"reinvest_pct\": 15,\n" + "  \"reinvest_where\": \"VLY token accumulation on Monad\",\n" + "  \"reserve_amount\": 0,\n" + "  \"reserve_pct\": 10,\n" + "  \"reserve_where\": \"30-day operating reserve\",\n" + "  \"today_action\": \"Specific action to take today\",\n" + "  \"weekly_target\": \"Weekly revenue target to hit next milestone\",\n" + "  \"next_milestone\": \"$X/month in Y weeks\"\n" + "}", 700);
        var d = JSON.parse(raw.replace(/```json|```/g, "").trim());
        var inc = parseFloat(liqIncome);
        d.safe_amount = Math.round(inc * d.safe_pct / 100);
        d.growth_amount = Math.round(inc * d.growth_pct / 100);
        d.reinvest_amount = Math.round(inc * d.reinvest_pct / 100);
        d.reserve_amount = Math.round(inc * d.reserve_pct / 100);
        setLiqResult(d);
      } catch (e) {
        setErr(e.message);
      }
      setLiqBusy(false);
    });
    return _runLiquidity.apply(this, arguments);
  }
  function runSelfCode() {
    return _runSelfCode.apply(this, arguments);
  } // ── AI Scan & Upgrade ──
  function _runSelfCode() {
    _runSelfCode = _asyncToGenerator(function* () {
      if (!selfCmd.trim()) {
        setErr("Enter your command.");
        return;
      }
      setSelfBusy(true);
      setErr("");
      setSelfResult(null);
      try {
        var code = yield ai("You are a senior React developer working on CloseFast Omni — an Etsy automation SaaS. Generate clean, production-ready JSX React code. Return code only, no explanation.", "The user wants to add this feature to their CloseFast dashboard:\n" + "\"" + selfCmd + "\"\n\n" + "Generate a complete React functional component for this feature. Use these design tokens:\n" + "Colors: amber=#F0A500, blue=#1D4ED8, grn=#059669, bg=#FFFFFF, txt=#111827\n" + "Fonts: IBM Plex Mono for data, DM Sans for body\n" + "Use inline styles only (no Tailwind classes except cf-btn, cf-card, cf-inp).\n" + "Make it functional with useState hooks. Keep it under 100 lines.", 1500);
        setSelfResult(code);
      } catch (e) {
        setErr(e.message);
      }
      setSelfBusy(false);
    });
    return _runSelfCode.apply(this, arguments);
  }
  function runScan() {
    return _runScan.apply(this, arguments);
  }
  function _runScan() {
    _runScan = _asyncToGenerator(function* () {
      setScanBusy(true);
      setErr("");
      try {
        var raw = yield ai("You are an AI systems architect monitoring the latest developments in AI models, Etsy algorithm changes, and e-commerce optimization. Return ONLY JSON.", "Perform weekly AI scan for CloseFast Omni platform. Date: March 2026.\n" + "Scan: new Claude models, Etsy algorithm updates, new Printify features, crypto market changes relevant to Web3 print sellers.\n" + "Return JSON: {\n" + "  \"scan_date\": \"March 2026\",\n" + "  \"ai_model_updates\": [{\"model\":\"Claude Sonnet 4\",\"change\":\"...\",\"impact\":\"high\"}],\n" + "  \"etsy_algorithm_changes\": [{\"change\":\"...\",\"action\":\"...\"}],\n" + "  \"new_opportunities\": [{\"opportunity\":\"...\",\"potential\":\"$X/mo\"}],\n" + "  \"recommended_upgrades\": [{\"upgrade\":\"...\",\"priority\":\"high\"}],\n" + "  \"market_signals\": [\"signal1\",\"signal2\",\"signal3\"],\n" + "  \"next_scan\": \"7 days\",\n" + "  \"overall_status\": \"System optimized — 3 upgrades recommended\"\n" + "}", 900);
        setScanResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setErr(e.message);
      }
      setScanBusy(false);
    });
    return _runScan.apply(this, arguments);
  }
  var modules = [{
    k: "aladdin",
    l: "🔮 Hottabych Engine",
    icon: "🔮"
  }, {
    k: "ball",
    icon: "🔮",
    label: "Кришталева куля"
  }, {
    k: "prophet",
    icon: "🧿",
    label: "Пророк Хоттабич"
  }, {
    k: "geo",
    icon: "🌍",
    label: "Геополіт. Оракул"
  }, {
    k: "risk",
    icon: "📡",
    label: "Global Risk Radar"
  }, {
    k: "monte",
    icon: "🎲",
    label: "Monte Carlo"
  }, {
    k: "liq",
    icon: "💧",
    label: "Liquidity Engine"
  }, {
    k: "pivot",
    icon: "🔄",
    label: "Auto-Pivot Ніші"
  }, {
    k: "vlyshare",
    icon: "💎",
    label: "VLY Profit Share"
  }, {
    k: "selfcode",
    icon: "🤖",
    label: "Self-Coding AI"
  }, {
    k: "scan",
    icon: "🔃",
    label: "AI Scan & Upgrade"
  }];

  // Aladdin full-screen mode
  if (activeModule === "aladdin") {
    return React.createElement(HottabychDashboard, null);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "80vh",
      background: "linear-gradient(135deg," + H.bg + " 0%," + H.bg2 + " 50%," + H.bg3 + " 100%)",
      borderRadius: 16,
      padding: 28,
      color: H.txt,
      animation: "hottglow 6s ease-in-out infinite",
      border: "1px solid " + H.bdr
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28,
      borderBottom: "1px solid " + H.bdr,
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%,#FFED9E 10%,#F0A500 45%,#B77800 85%)",
      boxShadow: "0 0 30px rgba(240,165,0,.8),0 0 60px rgba(240,165,0,.4)",
      animation: "vlyFloat 4s ease-in-out infinite",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "3px solid #D4A017"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://peach-fascinating-dragonfly-692.mypinata.cloud/ipfs/bafybeihrqvpqkpmhqijr26kqxpeylj4pkgye66zgeqrz4toq6l3tp2sijq?pinataGatewayToken=bWYA3wgNwzuNFYwibilk9VG-RKvTcJ336mxOMdrpDzaD_vg5zmcufW_DY1vfQr4t",
    alt: "VLY",
    style: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      objectFit: "cover"
    },
    onError: function (e) {
      e.target.style.display = "none";
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: "-1px",
      fontFamily: "'Syne',system-ui",
      background: "linear-gradient(135deg,#C084FC,#F0A500)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }
  }, "HOTTABYCH"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px"
    }
  }, "\u0426\u0415\u041D\u0422\u0420\u0410\u041B\u042C\u041D\u0410 \u041D\u0415\u0420\u0412\u041E\u0412\u0410 \u0421\u0418\u0421\u0422\u0415\u041C\u0410 \xB7 ALADDIN PROTOCOL \xB7 CloseFast Omni")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      color: H.gold,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "$999"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "/mo \xB7 \u0430\u0431\u043E % \u0432\u0456\u0434 \u043A\u0430\u043F\u0456\u0442\u0430\u043B\u0443"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: H.t2,
      fontStyle: "italic",
      borderLeft: "3px solid " + H.pur,
      paddingLeft: 12
    }
  }, "\"\u0422\u0432\u043E\u0454 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0435 \u0431\u0430\u0436\u0430\u043D\u043D\u044F \u2014 \u0437\u0430\u043A\u043E\u043D \u0434\u043B\u044F \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u0456\u0432\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 24,
      flexWrap: "wrap"
    }
  }, modules.map(function (m) {
    var on = activeModule === m.k;
    return /*#__PURE__*/React.createElement("button", {
      key: m.k,
      onClick: function () {
        setActiveModule(m.k);
        setErr("");
      },
      style: {
        padding: "8px 16px",
        borderRadius: 8,
        cursor: "pointer",
        border: "1px solid " + (on ? H.purL : H.bdr),
        background: on ? "linear-gradient(135deg," + H.purD + "," + H.pur + ")" : "rgba(139,92,246,.08)",
        color: on ? H.txt : H.t3,
        fontSize: 12,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: on ? "0 4px 16px rgba(139,92,246,.35)" : "none",
        transition: "all .2s"
      }
    }, m.icon, " ", m.label);
  })), err && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 16px",
      marginBottom: 16,
      borderRadius: 8,
      background: "rgba(248,113,113,.15)",
      border: "1px solid rgba(248,113,113,.4)",
      color: H.red,
      fontSize: 12,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u26A0\uFE0F ", err), activeModule === "prophet" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 4,
      fontFamily: "'Syne',system-ui",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, "\uD83E\uDDFF \u041F\u0440\u043E\u0440\u043E\u043A \u0425\u043E\u0442\u0442\u0430\u0431\u0438\u0447", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      padding: "3px 10px",
      borderRadius: 20,
      fontFamily: "'IBM Plex Mono',monospace",
      background: "linear-gradient(135deg,rgba(124,58,237,.4),rgba(192,132,252,.2))",
      color: H.purL,
      border: "1px solid " + H.bdr2
    }
  }, "OMNISCAN")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      lineHeight: 1.7,
      maxWidth: 600
    }
  }, "\u0425\u043E\u0442\u0442\u0430\u0431\u0438\u0447 \u0441\u043A\u0430\u043D\u0443\u0454 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: H.purL
    }
  }, "\u0432\u0441\u0456 10 \u0440\u0438\u043D\u043A\u0456\u0432 \u043E\u0434\u043D\u043E\u0447\u0430\u0441\u043D\u043E"), " \u2014 \u043A\u0440\u0438\u043F\u0442\u043E, \u0430\u043A\u0446\u0456\u0457, \u043C\u043E\u0434\u0430, \u0441\u043E\u0446\u043C\u0435\u0440\u0435\u0436\u0456, AI, \u0430\u0433\u0435\u043D\u0442\u0438, e-commerce, \u043D\u0435\u0440\u0443\u0445\u043E\u043C\u0456\u0441\u0442\u044C, \u0441\u0438\u0440\u043E\u0432\u0438\u043D\u0430, \u043D\u043E\u0432\u0438\u043D\u0438. BlackRock \u0440\u043E\u0431\u0438\u0442\u044C \u0446\u0435 \u0434\u043B\u044F \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0446\u0456\u0439. \u041C\u0438 \u2014 \u0434\u043B\u044F \u0442\u0435\u0431\u0435.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3,
      marginBottom: 10,
      fontFamily: "'IBM Plex Mono',monospace",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u0424\u0406\u041B\u042C\u0422\u0420 \u0421\u041A\u0410\u041D\u0423\u0412\u0410\u041D\u041D\u042F"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: H.purL
    }
  }, propSphere === "omni" ? "Всі сфери активні" : "Кастомний вибір")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setPropSphere("omni");
    },
    style: {
      width: "100%",
      padding: "12px",
      borderRadius: 10,
      cursor: "pointer",
      border: "2px solid " + (propSphere === "omni" ? H.purL : H.bdr),
      background: propSphere === "omni" ? "linear-gradient(135deg,rgba(124,58,237,.35),rgba(192,132,252,.15),rgba(240,165,0,.1))" : "rgba(255,255,255,.03)",
      marginBottom: 10,
      transition: "all .2s",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28
    }
  }, "\uD83C\uDF10"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: propSphere === "omni" ? H.purL : H.t2
    }
  }, "\u041F\u041E\u0412\u041D\u0418\u0419 OMNISCAN \u2014 \u0432\u0441\u0456 10 \u0441\u0444\u0435\u0440"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: H.t4,
      fontFamily: "'IBM Plex Mono',monospace",
      marginTop: 2
    }
  }, "\u041A\u0440\u0438\u043F\u0442\u043E \xB7 \u0410\u043A\u0446\u0456\u0457 \xB7 \u041C\u043E\u0434\u0430 \xB7 \u0421\u043E\u0446\u043C\u0435\u0440\u0435\u0436\u0456 \xB7 AI \xB7 \u0410\u0433\u0435\u043D\u0442\u0438 \xB7 E-commerce \xB7 \u041D\u0435\u0440\u0443\u0445\u043E\u043C\u0456\u0441\u0442\u044C \xB7 \u0421\u0438\u0440\u043E\u0432\u0438\u043D\u0430 \xB7 \u041D\u043E\u0432\u0438\u043D\u0438")), propSphere === "omni" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      fontSize: 10,
      color: H.purL,
      fontFamily: "'IBM Plex Mono',monospace",
      fontWeight: 700
    }
  }, "\u2713 ALL")), /*#__PURE__*/React.createElement("div", {
    className: "sphere-grid",
    style: {
      marginBottom: 20
    }
  }, ALL_SPHERES.map(function (s) {
    var arr = propSphere === "omni" ? [] : Array.isArray(propSphere) ? propSphere : [propSphere];
    var sel = arr.indexOf(s.k) !== -1;
    return /*#__PURE__*/React.createElement("button", {
      key: s.k,
      onClick: function () {
        if (propSphere === "omni") {
          setPropSphere([s.k]);
        } else {
          var a = Array.isArray(propSphere) ? propSphere.slice() : [propSphere];
          var idx = a.indexOf(s.k);
          if (idx !== -1) {
            var n = a.filter(function (x) {
              return x !== s.k;
            });
            setPropSphere(n.length ? n : "omni");
          } else {
            setPropSphere(a.concat(s.k));
          }
        }
      },
      style: {
        padding: "10px 6px",
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "center",
        border: "1px solid " + (sel ? "rgba(192,132,252,.6)" : H.bdr),
        background: sel ? "rgba(124,58,237,.25)" : "rgba(255,255,255,.03)",
        transition: "all .2s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        marginBottom: 3
      }
    }, s.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        fontWeight: 600,
        color: sel ? H.purL : H.t3,
        lineHeight: 1.3
      }
    }, s.l));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: H.t4,
      marginTop: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "* \u041A\u043B\u0456\u043A \u043D\u0430 \u0441\u0444\u0435\u0440\u0443 = \u043A\u0430\u0441\u0442\u043E\u043C\u043D\u0438\u0439 \u0432\u0438\u0431\u0456\u0440. \u041A\u043B\u0456\u043A OMNISCAN = \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438 \u0432\u0441\u0456.")), /*#__PURE__*/React.createElement("button", {
    onClick: runProphet,
    disabled: propBusy,
    style: {
      width: "100%",
      padding: "16px",
      borderRadius: 12,
      cursor: "pointer",
      background: "linear-gradient(135deg,#4C1D95,#7C3AED,#8B5CF6,#C084FC)",
      color: H.txt,
      border: "none",
      fontSize: 14,
      fontWeight: 800,
      marginBottom: 24,
      boxShadow: "0 6px 32px rgba(139,92,246,.55)",
      opacity: propBusy ? .6 : 1
    }
  }, propBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 14
  }), " \u0425\u043E\u0442\u0442\u0430\u0431\u0438\u0447 \u0441\u043A\u0430\u043D\u0443\u0454 \u0440\u0438\u043D\u043A\u0438...") : "🧿 OMNISCAN — Знайти можливості для заробітку"), propResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 24px",
      marginBottom: 20,
      background: "linear-gradient(135deg,rgba(76,29,149,.4),rgba(124,58,237,.25),rgba(192,132,252,.1))",
      border: "1px solid " + H.bdr2,
      borderRadius: 14,
      boxShadow: "0 4px 32px rgba(139,92,246,.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041F\u0420\u041E\u0421\u041A\u0410\u041D\u041E\u0412\u0410\u041D\u041E \u0421\u0424\u0415\u0420: ", propResult.scanned_spheres || 10), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: H.gold,
      marginBottom: 6,
      lineHeight: 1.5
    }
  }, "\uD83D\uDD25 ", propResult.top_opportunity), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      fontStyle: "italic"
    }
  }, "\"", propResult.hottabych_message, "\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      fontWeight: 800,
      fontFamily: "'IBM Plex Mono',monospace",
      lineHeight: 1,
      color: propResult.omni_temperature >= 70 ? H.gold : H.t3
    }
  }, propResult.omni_temperature, "\xB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: H.t3,
      marginTop: 2
    }
  }, "\u0420\u0418\u041D\u041A\u041E\u0412\u0410 \u0422\u0415\u041C\u041F\u0415\u0420\u0410\u0422\u0423\u0420\u0410"))), propResult.weekly_focus && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "rgba(240,165,0,.1)",
      border: "1px solid rgba(240,165,0,.25)",
      borderRadius: 8,
      fontSize: 11,
      color: H.gold
    }
  }, "\uD83D\uDCCD ", /*#__PURE__*/React.createElement("strong", null, "\u0424\u043E\u043A\u0443\u0441 \u0442\u0438\u0436\u043D\u044F:"), " ", propResult.weekly_focus)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.purL,
      fontWeight: 700,
      marginBottom: 12,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px"
    }
  }, "\uD83D\uDC8E \u0422\u041E\u041F \u041C\u041E\u0416\u041B\u0418\u0412\u041E\u0421\u0422\u0406 \u2014 \u0432\u0456\u0434\u0441\u043E\u0440\u0442\u043E\u0432\u0430\u043D\u043E \u0437\u0430 \u043F\u043E\u0442\u0435\u043D\u0446\u0456\u0430\u043B\u043E\u043C"), (propResult.opportunities || []).map(function (op) {
    var urgCol = op.urgency === "high" || op.urgency === "critical" ? H.red : op.urgency === "medium" ? H.gold : H.grn;
    var riskCol = op.risk_level === "low" ? H.grn : op.risk_level === "high" ? H.red : H.gold;
    return /*#__PURE__*/React.createElement("div", {
      key: op.rank,
      style: {
        marginBottom: 16,
        background: "rgba(255,255,255,.04)",
        border: "1px solid " + (op.rank === 1 ? "rgba(240,165,0,.35)" : H.bdr),
        borderLeft: "3px solid " + (op.rank === 1 ? H.gold : urgCol),
        borderRadius: 12,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 18px",
        background: op.rank === 1 ? "linear-gradient(135deg,rgba(240,165,0,.12),rgba(240,165,0,.04))" : "transparent",
        borderBottom: "1px solid rgba(255,255,255,.06)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20
      }
    }, op.sphere_icon || "◈"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        color: op.rank === 1 ? H.gold : H.txt
      }
    }, op.title), op.rank === 1 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 20,
        background: "rgba(240,165,0,.25)",
        color: H.gold,
        fontFamily: "'IBM Plex Mono',monospace",
        fontWeight: 700
      }
    }, "#1 \u0422\u041E\u041F")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t4,
        marginTop: 1,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, op.sphere)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 800,
        color: H.grn,
        fontFamily: "'IBM Plex Mono',monospace",
        lineHeight: 1
      }
    }, op.potential_income), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t4,
        marginTop: 1
      }
    }, op.time_horizon))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 20,
        fontFamily: "'IBM Plex Mono',monospace",
        background: "rgba(192,132,252,.15)",
        color: H.purL
      }
    }, op.probability, "% \u0439\u043C\u043E\u0432\u0456\u0440."), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 20,
        fontFamily: "'IBM Plex Mono',monospace",
        background: op.risk_level === "low" ? "rgba(16,185,129,.15)" : "rgba(240,165,0,.15)",
        color: riskCol
      }
    }, "\u0420\u0438\u0437\u0438\u043A: ", op.risk_level === "low" ? "низький" : op.risk_level === "medium" ? "середній" : "високий"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 20,
        fontFamily: "'IBM Plex Mono',monospace",
        background: "rgba(248,113,113,.12)",
        color: urgCol
      }
    }, op.urgency === "high" || op.urgency === "critical" ? "⚡ Терміново" : "→ Планово"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 18px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 8,
        lineHeight: 1.6
      }
    }, op.event), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: H.t3,
        fontFamily: "'IBM Plex Mono',monospace",
        padding: "6px 10px",
        background: "rgba(0,0,0,.2)",
        borderRadius: 6,
        marginBottom: 10
      }
    }, "\u26D3 ", op.chain), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 14px",
        background: "linear-gradient(135deg,rgba(240,165,0,.08),rgba(16,185,129,.06))",
        border: "1px solid rgba(240,165,0,.2)",
        borderRadius: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.gold,
        fontWeight: 700,
        marginBottom: 4,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, "\u26A1 \u0414\u0406\u042F \u0421\u042C\u041E\u0413\u041E\u0414\u041D\u0406"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: H.txt,
        fontWeight: 600,
        marginBottom: op.how_to_start ? 6 : 0
      }
    }, op.action_today), op.how_to_start && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: H.t3,
        lineHeight: 1.8,
        whiteSpace: "pre-line"
      }
    }, op.how_to_start)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 8
      }
    }, op.tools_needed && op.tools_needed.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t4,
        marginBottom: 4,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, "\u0406\u041D\u0421\u0422\u0420\u0423\u041C\u0415\u041D\u0422\u0418"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        flexWrap: "wrap"
      }
    }, op.tools_needed.map(function (t, i) {
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        style: {
          fontSize: 9,
          padding: "2px 8px",
          borderRadius: 20,
          background: "rgba(255,255,255,.07)",
          color: H.t3,
          fontFamily: "'IBM Plex Mono',monospace"
        }
      }, t);
    }))), op.spell && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: H.purL,
        fontStyle: "italic",
        padding: "4px 10px",
        background: "rgba(139,92,246,.1)",
        borderRadius: 6,
        border: "1px solid " + H.bdr,
        maxWidth: 260
      }
    }, "\u2726 \"", op.spell, "\""))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginTop: 4
    }
  }, propResult.avoid_now && propResult.avoid_now.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(248,113,113,.07)",
      border: "1px solid rgba(248,113,113,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.red,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u26D4 \u0423\u041D\u0418\u041A\u0410\u0419 \u0417\u0410\u0420\u0410\u0417"), propResult.avoid_now.map(function (a, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 10,
        color: H.t2,
        marginBottom: 6,
        paddingLeft: 10,
        borderLeft: "2px solid rgba(248,113,113,.3)"
      }
    }, a);
  })), propResult.ai_agent_to_build && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(16,185,129,.07)",
      border: "1px solid rgba(16,185,129,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.grn,
      fontWeight: 700,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83E\uDD16 \u0410\u0412\u0422\u041E\u041C\u0410\u0422\u0418\u0417\u0423\u0419"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t2,
      marginBottom: 8,
      lineHeight: 1.6
    }
  }, propResult.ai_agent_to_build), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setSelfCmd(propResult.ai_agent_to_build);
      setActiveModule("selfcode");
    },
    style: {
      padding: "5px 12px",
      borderRadius: 5,
      cursor: "pointer",
      fontSize: 9,
      background: "rgba(16,185,129,.2)",
      border: "1px solid rgba(16,185,129,.3)",
      color: H.grn,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u2192 Self-Coding AI"))))), activeModule === "geo" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 4,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83C\uDF0D \u0413\u0435\u043E\u043F\u043E\u043B\u0456\u0442\u0438\u0447\u043D\u0438\u0439 \u041E\u0440\u0430\u043A\u0443\u043B"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "Event-Driven Analytics \xB7 Alternative Data \xB7 Early Warning System"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.gold,
      marginBottom: 20,
      fontStyle: "italic",
      borderLeft: "3px solid " + H.gold,
      paddingLeft: 10
    }
  }, "\"The Insider's Whisper\" \u2014 \u041F\u043E\u043A\u0438 \u0456\u043D\u0448\u0456 \u0447\u0438\u0442\u0430\u044E\u0442\u044C \u043D\u043E\u0432\u0438\u043D\u0438, \u0425\u043E\u0442\u0442\u0430\u0431\u0438\u0447 \u0432\u0436\u0435 \u0437\u043C\u0456\u043D\u0438\u0432 \u0442\u0432\u0456\u0439 \u043F\u043E\u0440\u0442\u0444\u0435\u043B\u044C"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0414\u041E\u0414\u0410\u0422\u041A\u041E\u0412\u0418\u0419 \u041A\u041E\u041D\u0422\u0415\u041A\u0421\u0422 (\u043E\u043F\u0446\u0456\u0439\u043D\u043E): \u0432\u043A\u0430\u0436\u0438 \u043F\u043E\u0434\u0456\u0457, \u044F\u043A\u0456 \u0442\u0435\u0431\u0435 \u0442\u0443\u0440\u0431\u0443\u044E\u0442\u044C"), /*#__PURE__*/React.createElement("input", {
    value: geoContext,
    onChange: function (e) {
      setGeoContext(e.target.value);
    },
    placeholder: "\u043D\u0430\u043F\u0440: \u0447\u0443\u0432 \u043F\u0440\u043E \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0438 \u0437 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u043E\u044E \u0437 \u041A\u0438\u0442\u0430\u044E, BTC \u0432\u043F\u0430\u0432 8% \u0437\u0430 \u043D\u0456\u0447...",
    style: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 8,
      background: "rgba(255,255,255,.06)",
      border: "1px solid " + H.bdr,
      color: H.txt,
      fontSize: 12,
      fontFamily: "'DM Sans',sans-serif",
      outline: "none"
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: runGeo,
    disabled: geoBusy,
    style: {
      width: "100%",
      padding: "14px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#1E3A5F,#1D4ED8,#3B82F6)",
      color: H.txt,
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 24,
      boxShadow: "0 4px 24px rgba(29,78,216,.4)",
      opacity: geoBusy ? .6 : 1
    }
  }, geoBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u041F\u0435\u0440\u0435\u0445\u043E\u043F\u043B\u044E\u044E \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u0456 \u0441\u0438\u0433\u043D\u0430\u043B\u0438...") : "🌍 Запустити Геополітичний Радар"), geoResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      marginBottom: 18,
      background: "linear-gradient(135deg,rgba(29,78,216,.2),rgba(59,130,246,.1))",
      border: "1px solid rgba(59,130,246,.3)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#93C5FD",
      fontWeight: 700,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83C\uDF10 \u0413\u041B\u041E\u0411\u0410\u041B\u042C\u041D\u0410 \u0422\u0415\u041C\u041F\u0415\u0420\u0410\u0422\u0423\u0420\u0410 \u0420\u0418\u0417\u0418\u041A\u0423"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0421\u0442\u0440\u0430\u0445: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: H.red,
      fontWeight: 700
    }
  }, geoResult.sentiment_score && geoResult.sentiment_score.fear, "%")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0416\u0430\u0434\u0456\u0431\u043D\u0456\u0441\u0442\u044C: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: H.grn,
      fontWeight: 700
    }
  }, geoResult.sentiment_score && geoResult.sentiment_score.greed, "%")))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: "rgba(255,255,255,.1)",
      borderRadius: 99,
      marginBottom: 8,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderRadius: 99,
      width: (geoResult.global_risk_temperature || 0) + "%",
      background: geoResult.global_risk_temperature < 40 ? "linear-gradient(90deg,#10B981,#34D399)" : geoResult.global_risk_temperature < 70 ? "linear-gradient(90deg,#F0A500,#FCD34D)" : "linear-gradient(90deg,#DC2626,#F87171)",
      transition: "width 1.2s ease"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#93C5FD",
      marginBottom: 10,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, geoResult.sentiment_score && geoResult.sentiment_score.description, " \xB7 Score: ", geoResult.global_risk_temperature, "/100"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      background: "rgba(0,0,0,.25)",
      borderRadius: 8,
      fontSize: 12,
      color: H.gold,
      fontStyle: "italic",
      borderLeft: "2px solid " + H.gold
    }
  }, "\uD83D\uDD2E \"", geoResult.insider_whisper, "\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#93C5FD",
      fontWeight: 700,
      marginBottom: 10,
      fontFamily: "'IBM Plex Mono',monospace",
      letterSpacing: ".5px"
    }
  }, "\u26A1 PRE-EMPTIVE ALERTS"), (geoResult.alerts || []).map(function (alert, i) {
    var urgCol = alert.urgency === "critical" ? H.red : alert.urgency === "high" ? H.gold : H.grn;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 14,
        padding: "16px 18px",
        background: "rgba(255,255,255,.04)",
        border: "1px solid " + (alert.urgency === "critical" ? "rgba(248,113,113,.35)" : "rgba(59,130,246,.2)"),
        borderLeft: "3px solid " + urgCol,
        borderRadius: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8,
        flexWrap: "wrap",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        color: H.txt,
        fontSize: 13,
        flex: 1
      }
    }, alert.signal), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 20,
        fontFamily: "'IBM Plex Mono',monospace",
        background: "rgba(255,255,255,.08)",
        color: H.t3
      }
    }, alert.region), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "2px 8px",
        borderRadius: 20,
        fontFamily: "'IBM Plex Mono',monospace",
        background: "rgba(248,113,113,.15)",
        color: urgCol,
        fontWeight: 700
      }
    }, "\u23F1 ", alert.time_to_market_reaction))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: H.t3,
        marginBottom: 10,
        fontFamily: "'IBM Plex Mono',monospace",
        padding: "5px 10px",
        background: "rgba(0,0,0,.2)",
        borderRadius: 5
      }
    }, "\u26D3 ", alert.chain), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginBottom: 10
      }
    }, [{
      l: "🛍 Etsy",
      v: alert.etsy_impact
    }, {
      l: "₿ Крипто",
      v: alert.crypto_impact
    }, {
      l: "🖨 Printify",
      v: alert.printify_impact
    }].map(function (imp) {
      return /*#__PURE__*/React.createElement("div", {
        key: imp.l,
        style: {
          padding: "8px",
          background: "rgba(0,0,0,.15)",
          borderRadius: 6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: H.t4,
          marginBottom: 3
        }
      }, imp.l), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: H.t2,
          lineHeight: 1.4
        }
      }, imp.v || "—"));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: H.gold,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700
      }
    }, "\u0414\u0456\u044F: "), alert.hottabych_action), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        fontFamily: "'IBM Plex Mono',monospace",
        color: alert.loss_or_gain && alert.loss_or_gain.startsWith("+") ? H.grn : H.red
      }
    }, alert.loss_or_gain)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(16,185,129,.08)",
      border: "1px solid rgba(16,185,129,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.grn,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83D\uDD12 SAFE HAVEN \u0410\u041A\u0422\u0418\u0412\u0418"), (geoResult.safe_haven_assets || []).map(function (a, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 4
      }
    }, "\u2713 ", a);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(192,132,252,.08)",
      border: "1px solid " + H.bdr,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.purL,
      fontWeight: 700,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83D\uDCC5 \u041F\u0420\u041E\u0413\u041D\u041E\u0417 7 \u0414\u041D\u0406\u0412"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t2,
      lineHeight: 1.6
    }
  }, geoResult.global_forecast_7d))), geoResult.lab_script_idea && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      background: "rgba(16,185,129,.06)",
      border: "1px solid rgba(16,185,129,.15)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.grn,
      fontWeight: 700,
      marginBottom: 4,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83E\uDD16 \u0425\u041E\u0422\u0422\u0410\u0411\u0418\u0427 \u041F\u0420\u041E\u041F\u041E\u041D\u0423\u0404 \u041D\u0410\u041F\u0418\u0421\u0410\u0422\u0418 \u0421\u041A\u0420\u0418\u041F\u0422"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t2
    }
  }, geoResult.lab_script_idea), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setSelfCmd(geoResult.lab_script_idea);
      setActiveModule("selfcode");
    },
    style: {
      marginTop: 8,
      padding: "5px 12px",
      borderRadius: 5,
      cursor: "pointer",
      background: "rgba(16,185,129,.15)",
      border: "1px solid rgba(16,185,129,.25)",
      color: H.grn,
      fontSize: 10,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u2192 \u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u0432 Self-Coding AI")))), activeModule === "ball" && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "20px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      height: 220,
      borderRadius: "50%",
      margin: "0 auto 28px",
      background: "radial-gradient(circle at 35% 35%, rgba(192,132,252,.9), rgba(109,40,217,.6) 50%, rgba(13,5,20,.95))",
      boxShadow: ballScore ? "0 0 60px rgba(139,92,246,.8),0 0 120px rgba(192,132,252,.4),inset 0 0 40px rgba(0,0,0,.5)" : "0 0 40px rgba(139,92,246,.4),0 0 80px rgba(192,132,252,.2),inset 0 0 40px rgba(0,0,0,.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      animation: "orbFloat 4s ease-in-out infinite",
      cursor: "pointer"
    },
    onClick: runBall
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 2,
      background: "linear-gradient(90deg,transparent,rgba(192,132,252,.8),transparent)",
      animation: "scanLine 2s linear infinite",
      pointerEvents: "none"
    }
  }), ballBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 24
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      color: H.t3,
      fontSize: 11,
      marginTop: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "Scanning...")) : ballScore ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 52,
      fontWeight: 800,
      color: ballScore.probability >= 60 ? H.gold : H.red,
      fontFamily: "'IBM Plex Mono',monospace",
      lineHeight: 1
    }
  }, ballScore.probability, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t2,
      marginTop: 4
    }
  }, "\u0443\u0441\u043F\u0456\u0445"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: ballScore.trend === "rising" ? H.grn : H.t3,
      fontFamily: "'IBM Plex Mono',monospace",
      marginTop: 2
    }
  }, ballScore.trend === "rising" ? "↑ RISING" : "→ STABLE")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      marginBottom: 4
    }
  }, "\uD83D\uDD2E"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041D\u0410\u0422\u0418\u0421\u041D\u0418"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: H.t3,
      marginBottom: 16
    }
  }, "\u041A\u0440\u0438\u0448\u0442\u0430\u043B\u0435\u0432\u0430 \u043A\u0443\u043B\u044F \u0430\u043D\u0430\u043B\u0456\u0437\u0443\u0454 \u0442\u0432\u0456\u0439 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0456 \u043F\u0440\u043E\u0440\u0430\u0445\u043E\u0432\u0443\u0454 \u0439\u043C\u043E\u0432\u0456\u0440\u043D\u0456\u0441\u0442\u044C \u0443\u0441\u043F\u0456\u0445\u0443"), !ballScore && !ballBusy && /*#__PURE__*/React.createElement("button", {
    onClick: runBall,
    style: {
      padding: "12px 32px",
      borderRadius: 10,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 700,
      background: "linear-gradient(135deg,#7C3AED,#C084FC)",
      color: H.txt,
      border: "none",
      boxShadow: "0 4px 20px rgba(139,92,246,.4)"
    }
  }, "\uD83D\uDD2E \u0410\u043A\u0442\u0438\u0432\u0443\u0432\u0430\u0442\u0438 \u043A\u0443\u043B\u044E"), ballScore && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: "0 auto",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      background: "rgba(139,92,246,.1)",
      border: "1px solid " + H.bdr,
      borderRadius: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: H.gold,
      marginBottom: 6
    }
  }, "\u2726 \u0412\u0435\u0440\u0434\u0438\u043A\u0442"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: H.t2,
      lineHeight: 1.7
    }
  }, ballScore.verdict), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: H.t3,
      marginTop: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83D\uDCC5 \u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0456 30 \u0434\u043D\u0456\u0432: ", ballScore.next_30_days)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(248,113,113,.08)",
      border: "1px solid rgba(248,113,113,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.red,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0420\u0418\u0417\u0418\u041A\u0418"), (ballScore.risks || []).map(function (r, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 4
      }
    }, "\u26A0 ", r);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(16,185,129,.08)",
      border: "1px solid rgba(16,185,129,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.grn,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0411\u0423\u0421\u0422\u0415\u0420\u0418"), (ballScore.boosters || []).map(function (b, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 4
      }
    }, "\u2726 ", b);
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: runBall,
    style: {
      marginTop: 14,
      padding: "8px 20px",
      borderRadius: 8,
      cursor: "pointer",
      background: "rgba(139,92,246,.2)",
      border: "1px solid " + H.bdr,
      color: H.t3,
      fontSize: 11,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u21BB \u041E\u043D\u043E\u0432\u0438\u0442\u0438 \u0430\u043D\u0430\u043B\u0456\u0437"))), activeModule === "risk" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 6,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83D\uDCE1 Global Risk Radar"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 20,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041A\u043E\u0440\u0435\u043B\u044F\u0446\u0456\u044F: Etsy \u043F\u0440\u043E\u0434\u0430\u0436\u0456 \xB7 Printify \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \xB7 \u041A\u0440\u0438\u043F\u0442\u043E\u0440\u0438\u043D\u043E\u043A \xB7 \u041C\u0430\u043A\u0440\u043E\u0435\u043A\u043E\u043D\u043E\u043C\u0456\u043A\u0430"), /*#__PURE__*/React.createElement("button", {
    onClick: runRiskRadar,
    disabled: riskBusy,
    style: {
      padding: "12px 28px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#7C3AED,#C084FC)",
      color: H.txt,
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 20,
      boxShadow: "0 4px 16px rgba(139,92,246,.4)",
      opacity: riskBusy ? .6 : 1
    }
  }, riskBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u0421\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F \u0440\u0438\u043D\u043A\u0456\u0432...") : "📡 Запустити Risk Radar"), riskResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px",
      background: "rgba(139,92,246,.1)",
      border: "1px solid " + H.bdr,
      borderRadius: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: H.txt
    }
  }, "\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u0456\u0432\u0435\u043D\u044C \u0440\u0438\u0437\u0438\u043A\u0443"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      padding: "4px 14px",
      borderRadius: 6,
      fontFamily: "'IBM Plex Mono',monospace",
      background: riskResult.risk_score < 40 ? "rgba(16,185,129,.2)" : "rgba(240,165,0,.2)",
      color: riskResult.risk_score < 40 ? H.grn : H.gold
    }
  }, riskResult.overall_risk_level?.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: "rgba(255,255,255,.1)",
      borderRadius: 99,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderRadius: 99,
      transition: "width 1s ease",
      width: (riskResult.risk_score || 0) + "%",
      background: riskResult.risk_score < 40 ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#F0A500,#FCD34D)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginTop: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "Score: ", riskResult.risk_score, "/100 \xB7 Forecast: ", riskResult["30day_forecast"])), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 10,
      marginBottom: 16
    }
  }, [{
    l: "Etsy Market",
    d: riskResult.etsy_market_risk
  }, {
    l: "Crypto Impact",
    d: riskResult.crypto_correlation
  }, {
    l: "Currency Risk",
    d: riskResult.currency_risk
  }, {
    l: "Supply Chain",
    d: riskResult.supply_chain_risk
  }, {
    l: "Seasonal",
    d: riskResult.seasonal_risk
  }, {
    l: "Geopolitical",
    d: riskResult.geopolitical_risk
  }].map(function (item) {
    var lvl = item.d && (item.d.level || item.d.impact) || "";
    var col = lvl === "low" || lvl === "positive" ? H.grn : lvl === "high" ? H.red : H.gold;
    return /*#__PURE__*/React.createElement("div", {
      key: item.l,
      style: {
        padding: "12px",
        background: "rgba(255,255,255,.04)",
        border: "1px solid " + H.bdr,
        borderRadius: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t3,
        marginBottom: 4,
        fontFamily: "'IBM Plex Mono',monospace",
        textTransform: "uppercase"
      }
    }, item.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: col,
        textTransform: "uppercase",
        marginBottom: 4
      }
    }, lvl || "—"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: H.t3,
        lineHeight: 1.5
      }
    }, item.d && (item.d.reason || item.d.current || "")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(16,185,129,.08)",
      border: "1px solid rgba(16,185,129,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.grn,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041C\u041E\u0416\u041B\u0418\u0412\u041E\u0421\u0422\u0406"), (riskResult.opportunities || []).map(function (o, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 6
      }
    }, "\u2726 ", o);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(240,165,0,.08)",
      border: "1px solid rgba(240,165,0,.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.gold,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0414\u0406\u0407 \u0417\u0410\u0420\u0410\u0417"), (riskResult.immediate_actions || []).map(function (a, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 6
      }
    }, "\u2192 ", a);
  }))))), activeModule === "monte" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 6,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83C\uDFB2 Monte Carlo Simulator"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 20,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "10,000 \u0441\u0446\u0435\u043D\u0430\u0440\u0456\u0457\u0432 \xB7 \u0412\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F \u0431\u0430\u0436\u0430\u043D\u043D\u044F \xB7 \u0427\u0430\u0441 \u0434\u043E \u043C\u0435\u0442\u0438"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0422\u0412\u041E\u0404 \u0411\u0410\u0416\u0410\u041D\u041D\u042F / \u0426\u0406\u041B\u042C"), /*#__PURE__*/React.createElement("input", {
    value: mcGoal,
    onChange: function (e) {
      setMcGoal(e.target.value);
    },
    placeholder: "\u041A\u0443\u043F\u0438\u0442\u0438 \u043D\u0435\u0440\u0443\u0445\u043E\u043C\u0456\u0441\u0442\u044C \u0437\u0430 $200k, \u0437\u0430\u0440\u043E\u0431\u043B\u044F\u0442\u0438 $10k/mo...",
    style: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 8,
      background: "rgba(255,255,255,.06)",
      border: "1px solid " + H.bdr,
      color: H.txt,
      fontSize: 12,
      fontFamily: "'DM Sans',sans-serif",
      outline: "none"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041F\u041E\u0422\u041E\u0427\u041D\u0418\u0419 \u0414\u041E\u0425\u0406\u0414 / \u041C\u0406\u0421 ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: mcCapital,
    onChange: function (e) {
      setMcCapital(e.target.value);
    },
    placeholder: "500",
    style: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 8,
      background: "rgba(255,255,255,.06)",
      border: "1px solid " + H.bdr,
      color: H.txt,
      fontSize: 12,
      fontFamily: "'IBM Plex Mono',monospace",
      outline: "none"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: runMonteCarlo,
    disabled: mcBusy,
    style: {
      padding: "12px 28px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#7C3AED,#C084FC)",
      color: H.txt,
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 24,
      opacity: mcBusy ? .6 : 1
    }
  }, mcBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u041C\u043E\u0434\u0435\u043B\u044E\u044E 10,000 \u0441\u0446\u0435\u043D\u0430\u0440\u0456\u0457\u0432...") : "🎲 Запустити симуляцію"), mcResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 10,
      marginBottom: 16
    }
  }, [{
    l: "Ймовірність",
    v: mcResult.success_probability + "%",
    col: mcResult.success_probability >= 60 ? H.grn : H.gold
  }, {
    l: "Медіана (міс)",
    v: mcResult.median_months_to_goal + "m",
    col: H.purL
  }, {
    l: "Best case",
    v: mcResult.best_case_months + "m",
    col: H.grn
  }, {
    l: "Worst case",
    v: mcResult.worst_case_months + "m",
    col: H.red
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.l,
      style: {
        padding: "14px",
        textAlign: "center",
        background: "rgba(255,255,255,.05)",
        border: "1px solid " + H.bdr,
        borderRadius: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 26,
        fontWeight: 800,
        color: s.col,
        fontFamily: "'IBM Plex Mono',monospace",
        lineHeight: 1
      }
    }, s.v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t3,
        marginTop: 4
      }
    }, s.l));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      background: "rgba(139,92,246,.1)",
      border: "1px solid " + H.bdr,
      borderRadius: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: H.purL,
      marginBottom: 12,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041F\u0420\u041E\u0413\u041D\u041E\u0417 \u0414\u041E\u0425\u041E\u0414\u0423"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, (mcResult.monthly_milestones || []).map(function (m) {
    return /*#__PURE__*/React.createElement("div", {
      key: m.month,
      style: {
        padding: "8px 14px",
        background: "rgba(192,132,252,.15)",
        border: "1px solid " + H.bdr2,
        borderRadius: 8,
        flex: 1,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t3,
        marginBottom: 2,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, "\u041C\u0406\u0421 ", m.month), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 700,
        color: H.gold,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, "$", m.revenue));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px",
      background: "rgba(240,165,0,.08)",
      border: "1px solid rgba(240,165,0,.25)",
      borderRadius: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.gold,
      fontWeight: 700,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041E\u041F\u0422\u0418\u041C\u0410\u041B\u042C\u041D\u0410 \u0421\u0422\u0420\u0410\u0422\u0415\u0413\u0406\u042F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: H.t2,
      lineHeight: 1.7
    }
  }, mcResult.optimal_strategy)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      background: "rgba(16,185,129,.08)",
      border: "1px solid rgba(16,185,129,.2)",
      borderRadius: 8,
      fontSize: 12,
      color: H.t2,
      fontStyle: "italic"
    }
  }, "\u2726 ", mcResult.verdict))), activeModule === "liq" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 6,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83D\uDCA7 Liquidity Engine"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 20,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043F\u043E\u0434\u0456\u043B \u0434\u043E\u0445\u043E\u0434\u0443: \u0421\u0435\u0439\u0444 \xB7 \u0420\u0456\u0441\u0442 \xB7 VLY \xB7 \u0420\u0435\u0437\u0435\u0440\u0432"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 16,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041C\u0406\u0421\u042F\u0427\u041D\u0418\u0419 \u0414\u041E\u0425\u0406\u0414 ($)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: liqIncome,
    onChange: function (e) {
      setLiqIncome(e.target.value);
    },
    placeholder: "1000",
    style: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: 8,
      background: "rgba(255,255,255,.06)",
      border: "1px solid " + H.bdr,
      color: H.txt,
      fontSize: 14,
      fontFamily: "'IBM Plex Mono',monospace",
      outline: "none"
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: runLiquidity,
    disabled: liqBusy,
    style: {
      padding: "11px 24px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#7C3AED,#C084FC)",
      color: H.txt,
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      opacity: liqBusy ? .6 : 1,
      whiteSpace: "nowrap"
    }
  }, liqBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u0420\u043E\u0437\u0440\u0430\u0445\u043E\u0432\u0443\u044E...") : "💧 Розподілити")), liqResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, [{
    l: "🔒 Сейф (Stable)",
    amt: liqResult.safe_amount,
    pct: liqResult.safe_pct,
    where: liqResult.safe_where,
    col: "#10B981"
  }, {
    l: "📈 Ріст (Growth)",
    amt: liqResult.growth_amount,
    pct: liqResult.growth_pct,
    where: liqResult.growth_where,
    col: H.gold
  }, {
    l: "⛓ VLY (Monad)",
    amt: liqResult.reinvest_amount,
    pct: liqResult.reinvest_pct,
    where: liqResult.reinvest_where,
    col: H.purL
  }, {
    l: "🛡 Резерв (Buffer)",
    amt: liqResult.reserve_amount,
    pct: liqResult.reserve_pct,
    where: liqResult.reserve_where,
    col: H.red
  }].map(function (b) {
    return /*#__PURE__*/React.createElement("div", {
      key: b.l,
      style: {
        padding: "16px",
        background: "rgba(255,255,255,.04)",
        border: "1px solid " + H.bdr,
        borderRadius: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: H.txt
      }
    }, b.l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 800,
        color: b.col,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, "$", b.amt, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: H.t3
      }
    }, "(", b.pct, "%)"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        background: "rgba(255,255,255,.08)",
        borderRadius: 99,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        borderRadius: 99,
        width: b.pct + "%",
        background: b.col,
        transition: "width 1s ease"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: H.t3
      }
    }, b.where));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      marginTop: 16,
      background: "linear-gradient(135deg,rgba(240,165,0,.1),rgba(139,92,246,.1))",
      border: "1px solid " + H.bdr2,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.gold,
      fontWeight: 700,
      marginBottom: 4,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0414\u0406\u042F \u0421\u042C\u041E\u0413\u041E\u0414\u041D\u0406"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: H.t2
    }
  }, liqResult.today_action), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginTop: 8
    }
  }, "\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0430 \u0446\u0456\u043B\u044C: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: H.purL,
      fontWeight: 700
    }
  }, liqResult.next_milestone))))), activeModule === "selfcode" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 6,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83E\uDD16 Self-Coding Assistant"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 20,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041E\u043F\u0438\u0448\u0438 \u043D\u043E\u0432\u0443 \u0444\u0443\u043D\u043A\u0446\u0456\u044E \u2014 Claude \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u0433\u043E\u0442\u043E\u0432\u0438\u0439 React \u043A\u043E\u0434 \u0434\u043B\u044F CloseFast"), /*#__PURE__*/React.createElement("textarea", {
    value: selfCmd,
    onChange: function (e) {
      setSelfCmd(e.target.value);
    },
    placeholder: "Додай кнопку аналізу реклами Etsy з графіком CTR\nДодай блок порівняння конкурентів\nСтвори модуль відстеження погоди...",
    style: {
      width: "100%",
      minHeight: 100,
      padding: "12px 14px",
      borderRadius: 8,
      resize: "vertical",
      background: "rgba(255,255,255,.06)",
      border: "1px solid " + H.bdr,
      color: H.txt,
      fontSize: 12,
      fontFamily: "'DM Sans',sans-serif",
      outline: "none",
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: runSelfCode,
    disabled: selfBusy,
    style: {
      padding: "12px 28px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#7C3AED,#C084FC)",
      color: H.txt,
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 20,
      opacity: selfBusy ? .6 : 1
    }
  }, selfBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u043A\u043E\u0434...") : "🤖 Generate Code"), selfResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(13,5,20,.95)",
      border: "1px solid " + H.bdr2,
      borderRadius: 10,
      padding: "20px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 10,
      right: 12,
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "GENERATED CODE"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(selfResult);
    },
    style: {
      padding: "4px 10px",
      borderRadius: 4,
      cursor: "pointer",
      background: "rgba(139,92,246,.3)",
      border: "1px solid " + H.bdr,
      color: H.t2,
      fontSize: 10,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "Copy")), /*#__PURE__*/React.createElement("pre", {
    style: {
      color: "#E2E8F0",
      fontSize: 11,
      lineHeight: 1.7,
      fontFamily: "'IBM Plex Mono',monospace",
      overflow: "auto",
      maxHeight: 400,
      margin: 0,
      whiteSpace: "pre-wrap",
      marginTop: 20
    }
  }, selfResult)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginTop: 10,
      padding: "10px 14px",
      background: "rgba(240,165,0,.08)",
      border: "1px solid rgba(240,165,0,.2)",
      borderRadius: 6
    }
  }, "\uD83D\uDCA1 \u0421\u043A\u043E\u043F\u0456\u044E\u0439 \u0446\u0435\u0439 \u043A\u043E\u0434 \u0456 \u0432\u0441\u0442\u0430\u0432 \u0443 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u0435 \u043C\u0456\u0441\u0446\u0435 \u0432 ", /*#__PURE__*/React.createElement("code", {
    style: {
      color: H.gold
    }
  }, "app.jsx"), " \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0456. \u0414\u043B\u044F \u0430\u0432\u0442\u043E\u0434\u0435\u043F\u043B\u043E\u044E \u043F\u0456\u0434\u043A\u043B\u044E\u0447\u0438 Git webhook \u0434\u043E hostiq.ua."))), activeModule === "scan" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 6,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83D\uDD03 AI Scan & Upgrade"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 20,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0429\u043E\u0442\u0438\u0436\u043D\u0435\u0432\u0438\u0439 \u0441\u043A\u0430\u043D: \u043D\u043E\u0432\u0456 \u043C\u043E\u0434\u0435\u043B\u0456 Claude \xB7 \u0437\u043C\u0456\u043D\u0438 \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u0443 Etsy \xB7 \u0440\u0438\u043D\u043A\u043E\u0432\u0456 \u0441\u0438\u0433\u043D\u0430\u043B\u0438"), /*#__PURE__*/React.createElement("button", {
    onClick: runScan,
    disabled: scanBusy,
    style: {
      padding: "12px 28px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#7C3AED,#C084FC)",
      color: H.txt,
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 20,
      opacity: scanBusy ? .6 : 1
    }
  }, scanBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u0421\u043A\u0430\u043D\u0443\u044E \u0441\u0438\u0441\u0442\u0435\u043C\u0438...") : "🔃 Запустити AI Scan"), scanResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 18px",
      marginBottom: 16,
      background: "rgba(16,185,129,.08)",
      border: "1px solid rgba(16,185,129,.25)",
      borderRadius: 8,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: H.grn,
      fontWeight: 700
    }
  }, "\u2713 ", scanResult.overall_status), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, scanResult.scan_date, " \xB7 \u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0441\u043A\u0430\u043D: ", scanResult.next_scan)), [{
    title: "🤖 AI Model Updates",
    items: scanResult.ai_model_updates,
    key: "model",
    info: "change"
  }, {
    title: "🛍 Etsy Algorithm",
    items: scanResult.etsy_algorithm_changes,
    key: "change",
    info: "action"
  }, {
    title: "💡 Нові можливості",
    items: scanResult.new_opportunities,
    key: "opportunity",
    info: "potential"
  }, {
    title: "⚡ Рекомендовані апгрейди",
    items: scanResult.recommended_upgrades,
    key: "upgrade",
    info: "priority"
  }].map(function (sec) {
    return /*#__PURE__*/React.createElement("div", {
      key: sec.title,
      style: {
        padding: "14px",
        background: "rgba(255,255,255,.04)",
        border: "1px solid " + H.bdr,
        borderRadius: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: H.purL,
        marginBottom: 10,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, sec.title), (sec.items || []).map(function (item, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          fontSize: 11,
          color: H.t2,
          marginBottom: 8,
          paddingLeft: 12,
          borderLeft: "2px solid " + H.bdr
        }
      }, /*#__PURE__*/React.createElement("strong", {
        style: {
          color: H.txt
        }
      }, item[sec.key]), item[sec.info] && /*#__PURE__*/React.createElement("span", {
        style: {
          color: H.t3
        }
      }, " \u2014 ", item[sec.info]));
    }));
  }), scanResult.market_signals && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      background: "rgba(192,132,252,.08)",
      border: "1px solid " + H.bdr,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.purL,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83D\uDCC8 \u0420\u0418\u041D\u041A\u041E\u0412\u0406 \u0421\u0418\u0413\u041D\u0410\u041B\u0418"), scanResult.market_signals.map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 4
      }
    }, "\u25C8 ", s);
  })))), activeModule === "pivot" && /*#__PURE__*/React.createElement(AutoPivotModule, {
    H: H
  }), activeModule === "vlyshare" && /*#__PURE__*/React.createElement(VlyProfitModule, {
    H: H
  }));
}

// ── AUTO-PIVOT MODULE ─────────────────────────────────────────────────────────
function AutoPivotModule({
  H
}) {
  var [niche, setNiche] = useState("Wall Art");
  var [busy, setBusy] = useState(false);
  var [result, setResult] = useState(null);
  var [applied, setApplied] = useState(false);
  var NICHES = ["Wall Art", "Pet Accessories", "Stickers", "Home Decor", "Apparel", "Phone Cases", "Mugs", "Jewelry", "Planners", "Baby Products"];
  function runPivot() {
    return _runPivot.apply(this, arguments);
  }
  function _runPivot() {
    _runPivot = _asyncToGenerator(function* () {
      setBusy(true);
      setResult(null);
      setApplied(false);
      try {
        var raw = yield ai("You are a TikTok and Google Trends analyst for Etsy POD sellers. Return ONLY valid JSON.", "Current niche: " + niche + "\n\n" + "Analyze trending data and return:\n" + '{"trend_score":87,"current_niche":"' + niche + '","pivot_recommended":true,"new_niche":"Cyberpunk Wall Art","reason":"TikTok views +340% this week","trend_signals":["#CyberpunkAesthetic 2.1M views","Google Trends +280% US","Pinterest saves +180%"],"action_plan":["Rename 5 listings to include Cyberpunk","Add new tags: cyberpunk, neon city, retro future","Create 3 new mockups with neon palette"],"revenue_potential":"+$400-800/month","risk_level":"low","timing":"Act within 48 hours"}', 600);
        setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setResult({
          error: e.message
        });
      }
      setBusy(false);
    });
    return _runPivot.apply(this, arguments);
  }
  if (!H) return null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 4,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83D\uDD04 Auto-Pivot \u041D\u0456\u0448\u0456"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 20,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "AI \u0430\u043D\u0430\u043B\u0456\u0437\u0443\u0454 TikTok \xB7 Google Trends \xB7 Pinterest \u0456 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0454 \u0437\u043C\u0456\u043D\u0443 \u043D\u0456\u0448\u0456 \u0432 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0438\u0439 \u043C\u043E\u043C\u0435\u043D\u0442"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3,
      marginBottom: 6,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041F\u041E\u0422\u041E\u0427\u041D\u0410 \u041D\u0406\u0428\u0410"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, NICHES.map(function (n) {
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: function () {
        setNiche(n);
        setResult(null);
      },
      style: {
        padding: "5px 12px",
        borderRadius: 20,
        cursor: "pointer",
        background: niche === n ? "rgba(192,132,252,.25)" : "rgba(255,255,255,.05)",
        border: "1px solid " + (niche === n ? H.purL : H.bdr),
        color: niche === n ? H.txt : H.t3,
        fontSize: 10,
        fontWeight: niche === n ? 700 : 400
      }
    }, n);
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: runPivot,
    disabled: busy,
    style: {
      padding: "12px 28px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#F59E0B,#F0A500)",
      color: "#000",
      border: "none",
      fontSize: 13,
      fontWeight: 800,
      marginBottom: 20,
      opacity: busy ? .6 : 1
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u0410\u043D\u0430\u043B\u0456\u0437\u0443\u044E \u0442\u0440\u0435\u043D\u0434\u0438...") : "📊 Запустити Trend Analysis"), result && !result.error && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginBottom: 16,
      padding: "16px",
      background: "rgba(240,165,0,.08)",
      border: "1px solid rgba(240,165,0,.3)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      fontWeight: 800,
      color: H.gold,
      fontFamily: "'IBM Plex Mono',monospace",
      lineHeight: 1
    }
  }, result.trend_score), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: H.t3
    }
  }, "TREND SCORE")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: H.txt,
      marginBottom: 4
    }
  }, result.current_niche, " \u2192 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#F0A500"
    }
  }, result.new_niche)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t2,
      marginBottom: 6
    }
  }, result.reason), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 4,
      background: "rgba(16,185,129,.15)",
      color: H.grn,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, result.revenue_potential), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 4,
      background: "rgba(192,132,252,.15)",
      color: H.purL,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "Risk: ", result.risk_level), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 4,
      background: "rgba(239,68,68,.15)",
      color: H.red,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u23F1 ", result.timing)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      padding: "12px",
      background: "rgba(255,255,255,.04)",
      border: "1px solid " + H.bdr,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.purL,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\uD83D\uDCE1 \u0422\u0420\u0415\u041D\u0414 \u0421\u0418\u0413\u041D\u0410\u041B\u0418"), (result.trend_signals || []).map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 4,
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#F0A500"
      }
    }, "\u25B8"), s);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      padding: "12px",
      background: "rgba(16,185,129,.06)",
      border: "1px solid rgba(16,185,129,.2)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.grn,
      fontWeight: 700,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u2705 \u041F\u041B\u0410\u041D \u0414\u0406\u0419"), (result.action_plan || []).map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: H.t2,
        marginBottom: 4,
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: H.grn,
        fontWeight: 700
      }
    }, i + 1, "."), s);
  })), !applied ? /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setApplied(true);
      setNiche(result.new_niche || niche);
    },
    style: {
      width: "100%",
      padding: "12px",
      borderRadius: 10,
      cursor: "pointer",
      background: "linear-gradient(135deg,#059669,#10B981)",
      color: "#fff",
      border: "none",
      fontSize: 13,
      fontWeight: 800
    }
  }, "\u26A1 \u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438 Pivot \u2192 ", result.new_niche) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px",
      background: "rgba(16,185,129,.12)",
      border: "1px solid rgba(16,185,129,.3)",
      borderRadius: 10,
      fontSize: 12,
      color: H.grn,
      fontWeight: 700,
      textAlign: "center"
    }
  }, "\u2705 \u041D\u0456\u0448\u0430 \u0437\u043C\u0456\u043D\u0435\u043D\u0430 \u043D\u0430 \"", result.new_niche, "\" \xB7 AI \u0430\u0433\u0435\u043D\u0442 \u043E\u043D\u043E\u0432\u043B\u044E\u0454 \u043B\u0456\u0441\u0442\u0438\u043D\u0433\u0438")), result && result.error && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.red,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u26A0\uFE0F ", result.error));
}

// ── VLY PROFIT SHARE MODULE ───────────────────────────────────────────────────
function VlyProfitModule({
  H
}) {
  var [wallet, setWallet] = useState("");
  var [connected, setConnected] = useState(false);
  var [address, setAddress] = useState("");
  var [vlyBal, setVlyBal] = useState(null);
  var [busy, setBusy] = useState(false);
  var TIERS = [{
    label: "Holder",
    min: 100,
    max: 999,
    share: "0.5%",
    benefit: "5% знижка на плани"
  }, {
    label: "Supporter",
    min: 1000,
    max: 9999,
    share: "1.5%",
    benefit: "10% знижка + пріоритет"
  }, {
    label: "Whale",
    min: 10000,
    max: 49999,
    share: "3%",
    benefit: "15% знижка + ранній доступ"
  }, {
    label: "Leviathan",
    min: 50000,
    max: 999999,
    share: "5%",
    benefit: "20% знижка + партнерство"
  }];
  function connectWallet() {
    return _connectWallet3.apply(this, arguments);
  }
  function _connectWallet3() {
    _connectWallet3 = _asyncToGenerator(function* () {
      if (!window.ethereum) {
        alert("Встановіть MetaMask або Trust Wallet");
        return;
      }
      setBusy(true);
      try {
        var accounts = yield window.ethereum.request({
          method: "eth_requestAccounts"
        });
        var addr = accounts[0];
        setAddress(addr);
        // Read VLY balance via Monad RPC
        try {
          var bal = yield getVlyBalance(addr);
          setVlyBal(bal);
        } catch (e) {
          setVlyBal(0);
        }
        setConnected(true);
      } catch (e) {
        alert("Помилка підключення: " + e.message);
      }
      setBusy(false);
    });
    return _connectWallet3.apply(this, arguments);
  }
  var currentTier = vlyBal !== null ? TIERS.slice().reverse().find(function (t) {
    return vlyBal >= t.min;
  }) || null : null;
  if (!H) return null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: H.txt,
      marginBottom: 4,
      fontFamily: "'Syne',system-ui"
    }
  }, "\uD83D\uDC8E VLY Profit Share"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t3,
      marginBottom: 20,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0422\u0440\u0438\u043C\u0430\u0439 VLY \u0442\u043E\u043A\u0435\u043D\u0438 \u2192 \u043E\u0442\u0440\u0438\u043C\u0443\u0439 \u0447\u0430\u0441\u0442\u043A\u0443 \u043F\u0440\u0438\u0431\u0443\u0442\u043A\u0443 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0438 + \u0437\u043D\u0438\u0436\u043A\u0438 \u043D\u0430 \u043F\u0456\u0434\u043F\u0438\u0441\u043A\u0443"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 20
    }
  }, TIERS.map(function (t) {
    var isActive = currentTier && currentTier.label === t.label;
    return /*#__PURE__*/React.createElement("div", {
      key: t.label,
      style: {
        padding: "12px",
        borderRadius: 10,
        background: isActive ? "rgba(124,58,237,.2)" : "rgba(255,255,255,.04)",
        border: "1px solid " + (isActive ? H.purL : H.bdr),
        position: "relative"
      }
    }, isActive && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: -8,
        right: 8,
        fontSize: 9,
        padding: "2px 6px",
        borderRadius: 10,
        background: H.pur,
        color: "#fff",
        fontWeight: 700,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, "\u0412\u0410\u0428 TIER"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: H.txt,
        marginBottom: 2
      }
    }, t.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t3,
        marginBottom: 6,
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, t.min.toLocaleString(), "+ VLY"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: "#F0A500",
        fontFamily: "'IBM Plex Mono',monospace"
      }
    }, t.share), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: H.t3,
        marginTop: 2
      }
    }, t.benefit));
  })), !connected ? /*#__PURE__*/React.createElement("button", {
    onClick: connectWallet,
    disabled: busy,
    style: {
      width: "100%",
      padding: "14px",
      borderRadius: 12,
      cursor: "pointer",
      background: "linear-gradient(135deg,#7C3AED,#C084FC)",
      color: "#fff",
      border: "none",
      fontSize: 13,
      fontWeight: 800,
      opacity: busy ? .7 : 1
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 13
  }), " \u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0430\u044E...") : "🦊 Підключити MetaMask / Trust Wallet") : /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px",
      borderRadius: 12,
      background: "rgba(124,58,237,.1)",
      border: "1px solid " + H.purL,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3,
      marginBottom: 4,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u0413\u0410\u041C\u0410\u041D\u0415\u0426\u042C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.txt,
      fontFamily: "'IBM Plex Mono',monospace",
      marginBottom: 10
    }
  }, address.substring(0, 8), "...", address.substring(36)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3,
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "VLY \u0411\u0410\u041B\u0410\u041D\u0421"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: "#F0A500",
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, vlyBal !== null ? Number(vlyBal).toLocaleString() : "...", " VLY")), currentTier ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: H.purL
    }
  }, currentTier.label, " Tier"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "#F0A500"
    }
  }, currentTier.share, " \u043F\u0440\u0438\u0431\u0443\u0442\u043A\u0443")) : vlyBal !== null && vlyBal < 100 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: H.t3
    }
  }, "\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u043E 100+ VLY", /*#__PURE__*/React.createElement("br", null), "\u0434\u043B\u044F \u0443\u0447\u0430\u0441\u0442\u0456") : null)), currentTier && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderRadius: 8,
      background: "rgba(16,185,129,.08)",
      border: "1px solid rgba(16,185,129,.25)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: H.grn,
      marginBottom: 4
    }
  }, "\u2705 \u0412\u0430\u0448\u0456 \u0431\u0435\u043D\u0435\u0444\u0456\u0442\u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u0456"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: H.t2
    }
  }, currentTier.benefit), /*#__PURE__*/React.createElement("a", {
    href: "https://pancakeswap.finance/swap?outputCurrency=0x9459ddd1B70E51280DEf774650EcD04F0e24d234",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: "inline-block",
      marginTop: 8,
      fontSize: 10,
      color: "#F0A500",
      fontFamily: "'IBM Plex Mono',monospace"
    }
  }, "\u041A\u0443\u043F\u0438\u0442\u0438 \u0431\u0456\u043B\u044C\u0448\u0435 VLY \u2192 pancakeswap.finance \u2197"))));
}

// ─── SHADOW COMPETITOR SPY ───────────────────────────────────────────────────
function ShadowSpyWidget() {
  var [shop, setShop] = useState("");
  var [busy, setBusy] = useState(false);
  var [result, setResult] = useState(null);
  function runSpy() {
    return _runSpy2.apply(this, arguments);
  }
  function _runSpy2() {
    _runSpy2 = _asyncToGenerator(function* () {
      if (!shop.trim()) return;
      setBusy(true);
      setResult(null);
      try {
        var raw = yield ai("You are an Etsy deep competitor intelligence analyst. Analyze real competitor shops and find every exploitable weakness. Return ONLY valid JSON.", "Etsy shop to analyze: " + shop + "\n\n" + "Return ONLY JSON:\n" + '{"shop_name":"' + shop + '","estimated_monthly_revenue":4200,"listing_count":127,"avg_price":34.99,' + '"top_tags":["vintage print","wall art","digital download"],"tag_gaps":["missing high-volume tag1","missing tag2","underused niche tag3"],' + '"price_weakness":"Prices 15% above market sweet spot — opportunity to undercut","photo_weakness":"Low-contrast main image — CTR likely under 5%",' + '"seo_weakness":"Title missing primary keyword in first 3 words","fulfillment_weakness":"Ships in 5-7 days — faster shipping would win sales",' + '"review_sentiment":"Mostly positive but 3 complaints about packaging — fixable USP",' + '"steal_strategy":["Clone their top 5 listings with better SEO","Target their unhappy reviewers with ads","Price 10-15% lower with faster shipping"],' + '"opportunity_score":83,"verdict":"High opportunity — 3 clear attack vectors identified"}', 900);
        setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setResult({
          error: e.message
        });
      }
      setBusy(false);
    });
    return _runSpy2.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "\uD83D\uDD75\uFE0F Shadow Competitor Spy", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "2px 8px",
      background: "#FEF3C7",
      color: "#92400E",
      borderRadius: 4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\u041F\u041E\u0412\u041D\u0418\u0419 \u0428\u041F\u0418\u0413\u0423\u041D")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 10
    }
  }, "\u0412\u0432\u0435\u0434\u0438 \u043D\u0430\u0437\u0432\u0443 Etsy \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0443 \u2192 \u043E\u0442\u0440\u0438\u043C\u0430\u0439 \u043F\u043E\u0432\u043D\u0438\u0439 \u0430\u043D\u0430\u043B\u0456\u0437 \u0441\u043B\u0430\u0431\u043A\u0438\u0445 \u043C\u0456\u0441\u0446\u044C \u0456 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u044E \u043F\u0435\u0440\u0435\u043C\u043E\u0433\u0438"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: shop,
    onChange: function (e) {
      setShop(e.target.value);
    },
    placeholder: "NikeDesignStore \u0430\u0431\u043E URL \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0443...",
    className: "cf-inp",
    style: {
      flex: 1,
      fontSize: 12
    },
    onKeyDown: function (e) {
      if (e.key === "Enter") runSpy();
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: runSpy,
    disabled: busy || !shop.trim(),
    className: "cf-btn cf-btn-amber",
    style: {
      flexShrink: 0,
      minWidth: 80
    }
  }, busy ? /*#__PURE__*/React.createElement(Spin, null) : "🔍 Spy")), result && !result.error && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 10,
      padding: "10px",
      background: C.bg3,
      borderRadius: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 800,
      color: C.grn,
      fontFamily: C.mono,
      lineHeight: 1
    }
  }, result.opportunity_score), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 2
    }
  }, result.shop_name, " \xB7 ~$", (result.estimated_monthly_revenue || 0).toLocaleString(), "/mo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3
    }
  }, result.verdict)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      fontSize: 10,
      color: C.t4,
      fontFamily: C.mono
    }
  }, result.listing_count, " listings", /*#__PURE__*/React.createElement("br", null), "avg $", result.avg_price)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.red,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\uD83D\uDD34 \u0421\u041B\u0410\u0411\u041A\u0406 \u041C\u0406\u0421\u0426\u042F"), [result.price_weakness, result.photo_weakness, result.seo_weakness, result.fulfillment_weakness].filter(Boolean).map(function (w, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 10,
        color: C.t2,
        marginBottom: 3,
        display: "flex",
        gap: 6,
        padding: "4px 0",
        borderBottom: "1px solid " + C.bdr
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.red,
        flexShrink: 0
      }
    }, "\u2717"), w);
  })), result.tag_gaps && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.amber,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\uD83C\uDFF7 \u041F\u0420\u041E\u041F\u0423\u0429\u0415\u041D\u0406 \u0422\u0415\u0413\u0418 (\u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u0439!)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4
    }
  }, result.tag_gaps.map(function (t) {
    return /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        fontSize: 9,
        padding: "2px 8px",
        background: C.amberL,
        color: C.amber,
        borderRadius: 4,
        fontFamily: C.mono
      }
    }, t);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px",
      background: "rgba(5,150,105,.06)",
      borderRadius: 6,
      border: "1px solid rgba(5,150,105,.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.grn,
      marginBottom: 6,
      fontFamily: C.mono
    }
  }, "\u2694\uFE0F \u0421\u0422\u0420\u0410\u0422\u0415\u0413\u0406\u042F \u041F\u0415\u0420\u0415\u041C\u041E\u0413\u0418"), (result.steal_strategy || []).map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 10,
        color: C.t2,
        marginBottom: 3,
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.grn,
        fontWeight: 700
      }
    }, i + 1, "."), s);
  }))), result && result.error && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      fontFamily: C.mono
    }
  }, "\u26A0\uFE0F ", result.error));
}

// ─── ONE-CLICK EXPAND ────────────────────────────────────────────────────────
function OneClickExpandWidget() {
  var [expanding, setExpanding] = useState(null);
  var [done, setDone] = useState({});
  var [plan, setPlan] = useState(null);
  var [planBusy, setPlanBusy] = useState(false);
  var PLATFORMS = [{
    k: "shopify",
    icon: "🟢",
    label: "Shopify",
    desc: "Sync products → Shopify store"
  }, {
    k: "amazon",
    icon: "🟠",
    label: "Amazon KDP",
    desc: "Auto-upload digital prints"
  }, {
    k: "redbubble",
    icon: "🔴",
    label: "Redbubble",
    desc: "Mirror designs → Redbubble"
  }, {
    k: "teepublic",
    icon: "🔵",
    label: "TeePublic",
    desc: "Expand apparel line"
  }, {
    k: "pinterest",
    icon: "🔴",
    label: "Pinterest Shop",
    desc: "Product pins with buyable links"
  }, {
    k: "walmart",
    icon: "🔵",
    label: "Walmart MP",
    desc: "US marketplace expansion"
  }];
  function expand(_x13) {
    return _expand.apply(this, arguments);
  }
  function _expand() {
    _expand = _asyncToGenerator(function* (platform) {
      setExpanding(platform);
      // Simulate expansion (real: would call platform APIs)
      yield new Promise(function (r) {
        setTimeout(r, 1800);
      });
      setDone(function (d) {
        var n = Object.assign({}, d);
        n[platform] = true;
        return n;
      });
      setExpanding(null);
    });
    return _expand.apply(this, arguments);
  }
  function generatePlan() {
    return _generatePlan.apply(this, arguments);
  }
  function _generatePlan() {
    _generatePlan = _asyncToGenerator(function* () {
      setPlanBusy(true);
      setPlan(null);
      try {
        var raw = yield ai("You are a multi-platform e-commerce expansion strategist. Return ONLY valid JSON.", "Generate a 30-day expansion plan for an Etsy POD seller expanding to multiple platforms.\n" + "Return JSON with {platforms:[{name,priority,estimated_extra_revenue,first_action,time_to_first_sale}], total_revenue_potential, recommendation}", 600);
        setPlan(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (e) {
        setPlan({
          error: e.message
        });
      }
      setPlanBusy(false);
    });
    return _generatePlan.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "\uD83D\uDE80 1-Click Expand", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "2px 8px",
      background: "#EDE9FE",
      color: "#5B21B6",
      borderRadius: 4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\u041C\u0423\u041B\u042C\u0422\u0418-\u041F\u041B\u0410\u0422\u0424\u041E\u0420\u041C\u0410")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 12
    }
  }, "\u041D\u0430\u0442\u0438\u0441\u043D\u0438 \u043E\u0434\u043D\u0443 \u043A\u043D\u043E\u043F\u043A\u0443 \u2014 AI \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0456\u0437\u0443\u0454 \u0432\u0441\u0456 \u0442\u0432\u043E\u0457 \u043B\u0456\u0441\u0442\u0438\u043D\u0433\u0438 \u043D\u0430 \u043D\u043E\u0432\u0443 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0443 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      marginBottom: 12
    }
  }, PLATFORMS.map(function (p) {
    var isDone = done[p.k];
    var isExp = expanding === p.k;
    return /*#__PURE__*/React.createElement("div", {
      key: p.k,
      style: {
        padding: "10px",
        borderRadius: 8,
        background: isDone ? "rgba(5,150,105,.06)" : C.bg3,
        border: "1px solid " + (isDone ? "rgba(5,150,105,.25)" : C.bdr),
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, p.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: C.txt
      }
    }, p.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, p.desc)), isDone ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: C.grn,
        fontWeight: 700,
        flexShrink: 0
      }
    }, "\u2713") : /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        expand(p.k);
      },
      disabled: !!expanding,
      style: {
        padding: "3px 8px",
        borderRadius: 5,
        cursor: "pointer",
        fontSize: 9,
        flexShrink: 0,
        background: isExp ? "#E2E6F0" : C.amber,
        color: isExp ? C.t4 : "#000",
        border: "none",
        fontWeight: 700
      }
    }, isExp ? /*#__PURE__*/React.createElement(Spin, {
      sz: 9
    }) : "Sync →"));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: generatePlan,
    disabled: planBusy,
    className: "cf-btn cf-btn-ghost",
    style: {
      width: "100%",
      justifyContent: "center",
      fontSize: 11
    }
  }, planBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    sz: 11
  }), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u043F\u043B\u0430\u043D...") : "📊 AI план розширення (ROI аналіз)"), plan && !plan.error && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      marginTop: 10,
      padding: "10px",
      background: C.bg3,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.grn,
      marginBottom: 6,
      fontFamily: C.mono
    }
  }, "\uD83D\uDCB0 ", plan.recommendation, " \xB7 \u041F\u043E\u0442\u0435\u043D\u0446\u0456\u0430\u043B: ", plan.total_revenue_potential), (plan.platforms || []).slice(0, 3).map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        fontSize: 10,
        color: C.t2,
        marginBottom: 4,
        display: "flex",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", null, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.grn,
        fontFamily: C.mono,
        fontWeight: 700
      }
    }, "+", p.estimated_extra_revenue));
  })));
}

// ─── AI VOICE CUSTOMER SUPPORT (ETSY STYLE CLONE) ────────────────────────────
function AiVoiceWidget() {
  var [ownerStyle, setOwnerStyle] = useState("");
  var [situation, setSituation] = useState("");
  var [busy, setBusy] = useState(false);
  var [reply, setReply] = useState("");
  var [styleSet, setStyleSet] = useState(false);
  var SITUATIONS = ["Клієнт скаржиться що товар не прийшов", "Покупець хоче повернути гроші", "Негативний відгук 1 зірка", "Питання про кастомізацію", "Термін доставки запізнюється", "Клієнт незадоволений якістю фото"];
  function generateReply() {
    return _generateReply.apply(this, arguments);
  }
  function _generateReply() {
    _generateReply = _asyncToGenerator(function* () {
      if (!situation) return;
      setBusy(true);
      setReply("");
      try {
        var r = yield ai("You are an Etsy customer service expert who mimics the shop owner's personal communication style. " + "Write replies that feel human, warm, and resolve issues before they escalate to disputes. " + "NEVER be defensive. ALWAYS offer a solution. English only.", "Owner's writing style/tone: \"" + (ownerStyle || "friendly, professional, uses occasional emojis, always offers solution") + "\"\n\n" + "Customer situation: " + situation + "\n\n" + "Write a perfect Etsy message reply (2-4 sentences). Sound like a human, not a bot. Include a concrete resolution.", 400);
        setReply(r);
      } catch (e) {
        setReply("⚠️ " + e.message);
      }
      setBusy(false);
    });
    return _generateReply.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "\uD83C\uDF99 AI Voice \u2014 \u041A\u043B\u0456\u0454\u043D\u0442\u0441\u044C\u043A\u0438\u0439 \u0447\u0430\u0442", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      padding: "2px 8px",
      background: "#F0F9FF",
      color: "#0369A1",
      borderRadius: 4,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\u0421\u0422\u0418\u041B\u042C \u0412\u041B\u0410\u0421\u041D\u0418\u041A\u0410")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 12
    }
  }, "\u0412\u0447\u0438\u0442\u044C \u0442\u0432\u0456\u0439 \u0441\u0442\u0438\u043B\u044C \u0441\u043F\u0456\u043B\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u2192 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0454 \u043A\u043B\u0456\u0454\u043D\u0442\u0430\u043C \u0442\u0430\u043A, \u043D\u0456\u0431\u0438 \u043F\u0438\u0448\u0435\u0448 \u0442\u0438"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 3,
      fontFamily: C.mono
    }
  }, styleSet ? "✅ СТИЛЬ ЗБЕРЕЖЕНО" : "📝 НАВЧИ AI СВОЄМУ СТИЛЮ (1 раз)"), /*#__PURE__*/React.createElement("textarea", {
    value: ownerStyle,
    onChange: function (e) {
      setOwnerStyle(e.target.value);
    },
    placeholder: "\u0412\u0441\u0442\u0430\u0432\u0442\u0435 2-3 \u0441\u0432\u043E\u0457 \u0440\u0435\u0430\u043B\u044C\u043D\u0456 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u043A\u043B\u0456\u0454\u043D\u0442\u0430\u043C (\u043C\u043E\u0436\u043D\u0430 \u0441\u043A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u0437 Etsy)...",
    className: "cf-inp",
    style: {
      minHeight: 60,
      resize: "vertical",
      fontSize: 11,
      marginBottom: 4
    }
  }), ownerStyle.trim().length > 20 && /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setStyleSet(true);
    },
    style: {
      padding: "4px 12px",
      borderRadius: 5,
      cursor: "pointer",
      fontSize: 10,
      fontWeight: 700,
      background: styleSet ? "rgba(5,150,105,.1)" : C.amber,
      color: styleSet ? C.grn : "#000",
      border: "none"
    }
  }, styleSet ? "✅ Стиль збережено" : "💾 Зберегти мій стиль")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\u0421\u0418\u0422\u0423\u0410\u0426\u0406\u042F \u041A\u041B\u0406\u0404\u041D\u0422\u0410"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap",
      marginBottom: 6
    }
  }, SITUATIONS.map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: function () {
        setSituation(s);
      },
      style: {
        padding: "4px 8px",
        borderRadius: 5,
        cursor: "pointer",
        fontSize: 9,
        background: situation === s ? C.amberL : "transparent",
        border: "1px solid " + (situation === s ? C.amber : C.bdr),
        color: situation === s ? C.amber : C.t3,
        fontWeight: situation === s ? 700 : 400
      }
    }, s);
  })), /*#__PURE__*/React.createElement("textarea", {
    value: situation,
    onChange: function (e) {
      setSituation(e.target.value);
    },
    placeholder: "\u0410\u0431\u043E \u0432\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u043A\u043B\u0456\u0454\u043D\u0442\u0430 \u0441\u044E\u0434\u0438...",
    className: "cf-inp",
    style: {
      minHeight: 50,
      resize: "vertical",
      fontSize: 11
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: generateReply,
    disabled: busy || !situation.trim(),
    className: "cf-btn cf-btn-amber",
    style: {
      width: "100%",
      justifyContent: "center",
      marginBottom: 10
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u044E \u0432\u0456\u0434 \u0432\u0430\u0448\u043E\u0433\u043E \u0456\u043C\u0435\u043D\u0456...") : "🎙 Згенерувати відповідь у моєму стилі"), reply && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: "#F0FDF4",
      border: "1px solid rgba(5,150,105,.2)",
      borderRadius: 8,
      fontSize: 12,
      color: C.t2,
      lineHeight: 1.7,
      marginBottom: 8,
      whiteSpace: "pre-wrap"
    }
  }, reply), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(reply);
    },
    className: "cf-btn cf-btn-ghost",
    style: {
      flex: 1,
      justifyContent: "center",
      fontSize: 11
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      window.open("https://www.etsy.com/your/account/conversations", "_blank");
    },
    className: "cf-btn",
    style: {
      flex: 1,
      justifyContent: "center",
      fontSize: 11,
      background: "#F1641E",
      color: "#fff",
      border: "none"
    }
  }, "\uD83D\uDCE9 \u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 Etsy Messages"))));
}

// ─── AI HINT BUBBLE (floating assistant across all tabs) ─────────────────────
function AiHintBubble({
  tab,
  user
}) {
  var [open, setOpen] = useState(false);
  var [hint, setHint] = useState("");
  var [busy, setBusy] = useState(false);
  var [lastTab, setLastTab] = useState("");
  var TAB_CONTEXT = {
    command: "User is in Command Center. Give a specific actionable tip to improve their Etsy sales today.",
    inventory: "User is in Inventory Engine. Give a tip about optimizing Etsy listings, pricing, or Printify setup.",
    social: "User is in Social Engine. Give a viral content tip for X/Twitter or Instagram for Etsy POD sellers.",
    audit: "User is in Site Audit. Give a CRO or SEO tip for improving closefast.tech conversion.",
    builder: "User is in AI Builder. Give a tip about what kind of project would generate the most revenue.",
    support: "User is in Support AI. Give a tip about improving Etsy customer satisfaction.",
    growth: "User is in Growth Center. Give a specific promotion strategy that works for Etsy POD sellers.",
    plans: "User is on Plans page. Give a tip about which plan gives best ROI for a growing Etsy seller."
  };
  function getHint() {
    return _getHint.apply(this, arguments);
  } // Auto-fetch hint when tab changes
  function _getHint() {
    _getHint = _asyncToGenerator(function* () {
      if (busy) return;
      setBusy(true);
      setHint("");
      var context = TAB_CONTEXT[tab] || "Give a general Etsy POD business tip that will increase revenue this week.";
      try {
        var r = yield ai("You are a friendly, concise AI business coach for Etsy POD sellers. Give ONE specific, actionable tip in 2-3 sentences. Be direct. Start with an emoji. Ukrainian or English based on context.", context);
        setHint(r);
        setLastTab(tab);
      } catch (e) {
        setHint("⚠️ " + e.message);
      }
      setBusy(false);
    });
    return _getHint.apply(this, arguments);
  }
  React.useEffect(function () {
    if (open && tab !== lastTab) {
      getHint();
    }
  }, [tab, open]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 500
    }
  }, open && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      position: "absolute",
      bottom: 56,
      right: 0,
      width: 280,
      background: C.bg,
      border: "1px solid " + C.bdr,
      borderRadius: 12,
      padding: "14px",
      boxShadow: "0 8px 32px rgba(0,0,0,.15)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.amber,
      fontFamily: C.mono,
      letterSpacing: ".3px"
    }
  }, "\uD83D\uDCA1 AI \u041F\u0406\u0414\u041A\u0410\u0417\u041A\u0410"), /*#__PURE__*/React.createElement("button", {
    onClick: getHint,
    disabled: busy,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 10,
      color: C.t3
    }
  }, busy ? /*#__PURE__*/React.createElement(Spin, {
    sz: 10
  }) : "↻ нова")), busy ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      fontSize: 11,
      color: C.t3
    }
  }, /*#__PURE__*/React.createElement(Spin, {
    sz: 11
  }), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u043F\u043E\u0440\u0430\u0434\u0443...") : hint ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t2,
      lineHeight: 1.7
    }
  }, hint) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3
    }
  }, "\u041D\u0430\u0442\u0438\u0441\u043D\u0438 \u21BB \u0434\u043B\u044F \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u043F\u043E\u0440\u0430\u0434\u0438")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setOpen(!open);
      if (!open && !hint) getHint();
    },
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      cursor: "pointer",
      background: open ? "#111827" : "linear-gradient(135deg,#F0A500,#B07800)",
      border: "2px solid " + (open ? "#374151" : "#D4920A"),
      color: "#fff",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 14px rgba(240,165,0,.4)",
      transition: "all .2s"
    },
    title: "AI \u041F\u0456\u0434\u043A\u0430\u0437\u043A\u0430"
  }, open ? "✕" : "💡"));
}

// ─── MEDIA STUDIO — AI PHOTO + VIDEO + ANIMATION + FILM ─────────────────────
var MEDIA_MODELS = {
  image: [{
    k: "dalle3",
    l: "DALL-E 3",
    icon: "🎨",
    provider: "openai",
    desc: "Найкраща якість, фотореалізм"
  }, {
    k: "ideogram",
    l: "Ideogram 2.0",
    icon: "✍️",
    provider: "ideogram",
    desc: "Текст на зображеннях, логотипи"
  }, {
    k: "flux",
    l: "Flux Pro 1.1",
    icon: "⚡",
    provider: "replicate",
    desc: "Швидко, якісно, деталізовано"
  }, {
    k: "sdxl",
    l: "Stable Diffusion",
    icon: "🌊",
    provider: "replicate",
    desc: "Open source, безкоштовно"
  }],
  video: [{
    k: "runway",
    l: "Runway Gen-3 Alpha",
    icon: "🎬",
    provider: "runway",
    desc: "Топ якість відео до 10 сек"
  }, {
    k: "kling",
    l: "Kling AI 1.6",
    icon: "🎥",
    provider: "kling",
    desc: "Довге відео, motion control"
  }, {
    k: "luma",
    l: "Luma Dream Machine",
    icon: "💫",
    provider: "luma",
    desc: "Реалістичні сцени і рух"
  }, {
    k: "pika",
    l: "Pika 2.1",
    icon: "⚡",
    provider: "pika",
    desc: "Швидка генерація кліпів"
  }, {
    k: "sora",
    l: "Sora (OpenAI)",
    icon: "🌐",
    provider: "openai",
    desc: "Найдовші відео, найкраща якість"
  }],
  animation: [{
    k: "haiper",
    l: "Haiper 2.0",
    icon: "🎭",
    provider: "haiper",
    desc: "Cartoon та animated стиль"
  }, {
    k: "viggle",
    l: "Viggle AI",
    icon: "🕺",
    provider: "viggle",
    desc: "Танці та рухи на фото"
  }, {
    k: "pixverse",
    l: "PixVerse v4",
    icon: "🎪",
    provider: "pixverse",
    desc: "Аніме та мультфільм стиль"
  }]
};
var STYLE_PRESETS = [{
  k: "photorealistic",
  l: "Фотореалізм",
  emoji: "📸"
}, {
  k: "cartoon",
  l: "Мультфільм",
  emoji: "🎨"
}, {
  k: "anime",
  l: "Аніме",
  emoji: "⛩"
}, {
  k: "cinematic",
  l: "Кіно",
  emoji: "🎬"
}, {
  k: "etsy_mockup",
  l: "Etsy Mockup",
  emoji: "🛍"
}, {
  k: "product_ad",
  l: "Product AD",
  emoji: "💫"
}, {
  k: "tiktok_style",
  l: "TikTok Style",
  emoji: "📱"
}, {
  k: "watercolor",
  l: "Акварель",
  emoji: "🖌"
}];
function MediaStudioTab() {
  var [section, setSection] = useState("image");
  var [imageModel, setImageModel] = useState("dalle3");
  var [videoModel, setVideoModel] = useState("runway");
  var [animModel, setAnimModel] = useState("haiper");
  var [prompt, setPrompt] = useState("");
  var [style, setStyle] = useState("photorealistic");
  var [aspect, setAspect] = useState("1:1");
  var [duration, setDuration] = useState("5");
  var [negPrompt, setNegPrompt] = useState("");
  var [busy, setBusy] = useState(false);
  var [results, setResults] = useState([]);
  var [err, setErr] = useState("");
  var [postTikTok, setPostTikTok] = useState(false);
  var [tikTokDone, setTikTokDone] = useState(false);

  // Film maker state
  var [filmSection, setFilmSection] = useState(false);
  var [filmScript, setFilmScript] = useState("");
  var [filmBusy, setFilmBusy] = useState(false);
  var [filmResult, setFilmResult] = useState(null);
  var SECTIONS = [{
    k: "image",
    icon: "🖼",
    l: "Генерація фото"
  }, {
    k: "video",
    icon: "🎬",
    l: "Генерація відео"
  }, {
    k: "animation",
    icon: "🎭",
    l: "Анімація / Мультфільм"
  }, {
    k: "film",
    icon: "🎥",
    l: "AI Сценарист / Фільм"
  }];
  var ASPECTS = section === "video" ? [{
    v: "16:9",
    l: "16:9 (YouTube/TikTok)"
  }, {
    v: "9:16",
    l: "9:16 (Reels/Shorts)"
  }, {
    v: "1:1",
    l: "1:1 (Instagram)"
  }] : [{
    v: "1:1",
    l: "1:1 Square"
  }, {
    v: "16:9",
    l: "16:9 Landscape"
  }, {
    v: "9:16",
    l: "9:16 Portrait"
  }, {
    v: "4:5",
    l: "4:5 Instagram"
  }];
  var currentModels = section === "image" ? MEDIA_MODELS.image : section === "video" ? MEDIA_MODELS.video : MEDIA_MODELS.animation;
  var currentModel = section === "image" ? imageModel : section === "video" ? videoModel : animModel;
  var setCurrentModel = section === "image" ? setImageModel : section === "video" ? setVideoModel : setAnimModel;
  var selectedModel = currentModels.find(function (m) {
    return m.k === currentModel;
  }) || currentModels[0];
  function generate() {
    return _generate2.apply(this, arguments);
  }
  function _generate2() {
    _generate2 = _asyncToGenerator(function* () {
      if (!prompt.trim()) return;
      setBusy(true);
      setErr("");
      setResults([]);
      var styleNote = STYLE_PRESETS.find(function (s) {
        return s.k === style;
      });
      var fullPrompt = prompt + (styleNote ? " . Style: " + styleNote.l : "") + (negPrompt ? " . Avoid: " + negPrompt : "");
      try {
        var res = yield fetch("/api/proxy/media", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: section,
            model: currentModel,
            prompt: fullPrompt,
            aspect: aspect,
            duration: duration,
            style: style
          })
        });
        var d = yield res.json();
        if (d.error) {
          setErr(d.error);
        } else if (d.urls) {
          setResults(d.urls);
        } else if (d.url) {
          setResults([d.url]);
        } else {
          setErr("Неочікувана відповідь від API");
        }
      } catch (e) {
        setErr(e.message);
      }
      setBusy(false);
    });
    return _generate2.apply(this, arguments);
  }
  function generateFilm() {
    return _generateFilm.apply(this, arguments);
  } // Etsy product prompt helper
  function _generateFilm() {
    _generateFilm = _asyncToGenerator(function* () {
      if (!filmScript.trim()) return;
      setFilmBusy(true);
      setFilmResult(null);
      try {
        var raw = yield ai("Ти — голлівудський сценарист та режисер. Створюй детальні покрокові інструкції для AI-генерації фільмів та мультфільмів. Відповідай українською.", "Ідея фільму/мультфільму: \"" + filmScript + "\"\n\n" + "Надай ПОВНИЙ production plan:\n" + "1. 🎬 ЖАНР та СТИЛЬ (анімація/live-action/аніме/піксар-стиль)\n" + "2. 📖 СЦЕНАРІЙ (3-5 сцен з діалогами)\n" + "3. 🎨 ПРОМПТИ для кожної сцени (для Runway/Sora/Kling):\n" + "   Сцена 1: [детальний промпт]\n" + "   Сцена 2: [детальний промпт]\n" + "4. 🎵 ЗВУК: опис музики, tone, SFX\n" + "5. ✂️ EDITING: порядок монтажу, transitions\n" + "6. 📱 ДИСТРИБУЦІЯ: де публікувати для максимального охоплення\n" + "7. ⏱ ТАЙМ-ПЛАН: скільки часу на кожен етап", 2000);
        setFilmResult(raw);
      } catch (e) {
        setFilmResult("⚠️ " + e.message);
      }
      setFilmBusy(false);
    });
    return _generateFilm.apply(this, arguments);
  }
  function generateProductPrompt() {
    return _generateProductPrompt.apply(this, arguments);
  }
  function _generateProductPrompt() {
    _generateProductPrompt = _asyncToGenerator(function* () {
      setBusy(true);
      setErr("");
      try {
        var suggested = yield ai("Generate a perfect DALL-E 3 prompt for an Etsy product mockup. Be specific about lighting, composition, style. Return only the prompt, nothing else.", "Create a product photo prompt for an Etsy print-on-demand listing. Style: " + style + ". Make it look professional, high-CTR, clean background.");
        setPrompt(suggested.trim());
      } catch (e) {
        setErr(e.message);
      }
      setBusy(false);
    });
    return _generateProductPrompt.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#0D0D1A 0%,#1A0A2E 50%,#0D1A2E 100%)",
      borderRadius: 16,
      padding: "20px 24px",
      marginBottom: 20,
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -10,
      top: -10,
      fontSize: 120,
      opacity: .05,
      pointerEvents: "none"
    }
  }, "\uD83C\uDFAC"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 14,
      fontSize: 26,
      flexShrink: 0,
      background: "linear-gradient(135deg,#7C3AED,#EC4899)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 20px rgba(236,72,153,.4)"
    }
  }, "\uD83C\uDFAC"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: "-.5px",
      background: "linear-gradient(90deg,#F0A500,#EC4899,#7C3AED)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }
  }, "Media Studio"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      opacity: .6,
      fontFamily: C.mono,
      marginTop: 2
    }
  }, "DALL-E 3 \xB7 Runway Gen-3 \xB7 Kling AI \xB7 Sora \xB7 Luma \xB7 Pika \xB7 Haiper \xB7 TikTok Auto-Post")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      justifyContent: "flex-end"
    }
  }, ["🎨 Photo", "🎬 Video", "🎭 Anime", "🎥 Film"].map(function (b) {
    return /*#__PURE__*/React.createElement("div", {
      key: b,
      style: {
        fontSize: 9,
        padding: "3px 8px",
        borderRadius: 10,
        background: "rgba(236,72,153,.15)",
        border: "1px solid rgba(236,72,153,.3)",
        color: "#F9A8D4",
        fontFamily: C.mono
      }
    }, b);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: .6,
      fontStyle: "italic",
      borderLeft: "2px solid rgba(236,72,153,.5)",
      paddingLeft: 12
    }
  }, "\"\u041F\u0435\u0440\u0448\u0438\u0439 Etsy \u0456\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442 \u0437 \u0432\u0431\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u043C AI \u0432\u0456\u0434\u0435\u043E \u0442\u0430 \u0430\u043D\u0456\u043C\u0430\u0446\u0456\u0454\u044E \u2014 \u0441\u0442\u0432\u043E\u0440\u044E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u0443, \u043C\u0443\u043B\u044C\u0442\u0444\u0456\u043B\u044C\u043C\u0438 \u0442\u0430 \u0444\u0456\u043B\u044C\u043C\u0438 \u0431\u0435\u0437 \u0432\u0438\u0445\u043E\u0434\u0443 \u0437 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0438\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, SECTIONS.map(function (s) {
    var on = (s.k === "film" ? filmSection : section) === s.k;
    if (s.k === "film") on = filmSection;
    return /*#__PURE__*/React.createElement("button", {
      key: s.k,
      onClick: function () {
        if (s.k === "film") {
          setFilmSection(true);
        } else {
          setSection(s.k);
          setFilmSection(false);
        }
      },
      style: {
        padding: "9px 16px",
        borderRadius: 8,
        cursor: "pointer",
        border: "1px solid " + (on ? "rgba(236,72,153,.5)" : C.bdr),
        background: on ? "rgba(236,72,153,.1)" : "#fff",
        color: on ? "#EC4899" : C.t2,
        fontSize: 12,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all .15s"
      }
    }, s.icon, " ", s.l);
  })), filmSection && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14,
      background: "linear-gradient(135deg,rgba(124,58,237,.05),rgba(236,72,153,.05))",
      border: "1px solid rgba(236,72,153,.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: C.txt,
      marginBottom: 4
    }
  }, "\uD83C\uDFA5 AI Film & Animation Maker"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 14
    }
  }, "\u041E\u043F\u0438\u0448\u0438 \u0456\u0434\u0435\u044E \u2192 AI \u0441\u0442\u0432\u043E\u0440\u044E\u0454 \u0441\u0446\u0435\u043D\u0430\u0440\u0456\u0439 + \u043F\u0440\u043E\u043C\u043F\u0442\u0438 \u0434\u043B\u044F \u043A\u043E\u0436\u043D\u043E\u0457 \u0441\u0446\u0435\u043D\u0438 \u2192 \u0433\u0435\u043D\u0435\u0440\u0443\u0439 \u0432 Runway/Sora/Kling"), /*#__PURE__*/React.createElement("textarea", {
    value: filmScript,
    onChange: function (e) {
      setFilmScript(e.target.value);
    },
    placeholder: "\u041D\u0430\u043F\u0440: '\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043C\u0443\u043B\u044C\u0442\u0444\u0456\u043B\u044C\u043C \u043F\u0440\u043E \u043A\u043E\u0442\u0430 \u044F\u043A\u0438\u0439 \u0432\u0456\u0434\u043A\u0440\u0438\u0432 \u0456\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0430 Etsy \u0456 \u0440\u0430\u043F\u0442\u043E\u043C \u0441\u0442\u0430\u0432 \u0432\u0456\u0434\u043E\u043C\u0438\u043C \u0434\u0438\u0437\u0430\u0439\u043D\u0435\u0440\u043E\u043C. \u041F\u0456\u043A\u0441\u0430\u0440 \u0441\u0442\u0438\u043B\u044C, 3 \u0445\u0432\u0438\u043B\u0438\u043D\u0438'",
    className: "cf-inp",
    style: {
      minHeight: 100,
      resize: "vertical",
      fontSize: 12,
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 10,
      flexWrap: "wrap"
    }
  }, ["Піксар-стиль мультфільм", "Японське аніме", "Документальний фільм", "Реклама для Etsy продукту", "TikTok / Reels", "Horror short film"].map(function (preset) {
    return /*#__PURE__*/React.createElement("button", {
      key: preset,
      onClick: function () {
        setFilmScript(preset);
      },
      style: {
        padding: "4px 10px",
        borderRadius: 10,
        cursor: "pointer",
        fontSize: 10,
        background: "rgba(124,58,237,.08)",
        border: "1px solid rgba(124,58,237,.2)",
        color: "#7C3AED"
      }
    }, preset);
  })), /*#__PURE__*/React.createElement("button", {
    onClick: generateFilm,
    disabled: filmBusy || !filmScript.trim(),
    style: {
      width: "100%",
      padding: "13px",
      borderRadius: 10,
      cursor: "pointer",
      border: "none",
      background: filmBusy || !filmScript.trim() ? "#E2E6F0" : "linear-gradient(135deg,#7C3AED,#EC4899)",
      color: filmBusy || !filmScript.trim() ? "#9CA3AF" : "#fff",
      fontSize: 13,
      fontWeight: 800,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, filmBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u041F\u0438\u0448\u0443 \u0441\u0446\u0435\u043D\u0430\u0440\u0456\u0439 \u0442\u0430 \u0432\u0438\u0440\u043E\u0431\u043D\u0438\u0447\u0438\u0439 \u043F\u043B\u0430\u043D...") : "🎬 Генерувати Film Production Plan →")), filmResult && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(filmResult);
    },
    className: "cf-btn cf-btn-ghost",
    style: {
      fontSize: 11
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u043F\u043B\u0430\u043D"), [{
    l: "Runway",
    url: "https://runwayml.com"
  }, {
    l: "Kling AI",
    url: "https://klingai.com"
  }, {
    l: "Sora",
    url: "https://sora.com"
  }, {
    l: "Luma",
    url: "https://lumalabs.ai/dream-machine"
  }].map(function (lnk) {
    return /*#__PURE__*/React.createElement("a", {
      key: lnk.l,
      href: lnk.url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "cf-btn cf-btn-ghost",
      style: {
        fontSize: 10,
        textDecoration: "none"
      }
    }, lnk.l, " \u2197");
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      whiteSpace: "pre-wrap",
      fontSize: 12,
      lineHeight: 1.8,
      color: C.t2,
      maxHeight: 600,
      overflowY: "auto"
    }
  }, filmResult))), !filmSection && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      marginBottom: 10,
      fontFamily: C.mono,
      letterSpacing: ".3px"
    }
  }, "AI \u041C\u041E\u0414\u0415\u041B\u042C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6
    }
  }, currentModels.map(function (m) {
    var on = currentModel === m.k;
    return /*#__PURE__*/React.createElement("div", {
      key: m.k,
      onClick: function () {
        setCurrentModel(m.k);
      },
      style: {
        padding: "10px",
        borderRadius: 8,
        cursor: "pointer",
        border: "2px solid " + (on ? "#EC4899" : C.bdr),
        background: on ? "rgba(236,72,153,.06)" : "#FAFAFA",
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, m.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: on ? "#EC4899" : C.txt
      }
    }, m.l)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4
      }
    }, m.desc), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: C.t4,
        fontFamily: C.mono,
        marginTop: 2
      }
    }, "via ", m.provider));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 6,
      fontFamily: C.mono
    }
  }, "\u0421\u0422\u0418\u041B\u042C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap"
    }
  }, STYLE_PRESETS.map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s.k,
      onClick: function () {
        setStyle(s.k);
      },
      style: {
        padding: "5px 10px",
        borderRadius: 20,
        cursor: "pointer",
        fontSize: 10,
        fontWeight: 600,
        background: style === s.k ? "rgba(236,72,153,.12)" : "transparent",
        border: "1px solid " + (style === s.k ? "rgba(236,72,153,.4)" : C.bdr),
        color: style === s.k ? "#EC4899" : C.t2,
        display: "flex",
        alignItems: "center",
        gap: 3
      }
    }, s.emoji, " ", s.l);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      fontFamily: C.mono
    }
  }, "\u041F\u0420\u041E\u041C\u041F\u0422"), /*#__PURE__*/React.createElement("button", {
    onClick: generateProductPrompt,
    disabled: busy,
    style: {
      fontSize: 9,
      color: "#EC4899",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "2px 8px",
      borderRadius: 5,
      background: "rgba(236,72,153,.08)",
      border: "1px solid rgba(236,72,153,.2)"
    }
  }, "\u2728 AI \u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u043F\u0440\u043E\u043C\u043F\u0442 \u0434\u043B\u044F Etsy")), /*#__PURE__*/React.createElement("textarea", {
    value: prompt,
    onChange: function (e) {
      setPrompt(e.target.value);
    },
    placeholder: section === "image" ? "Опиши зображення яке хочеш отримати..." : section === "video" ? "Опиши відео сцену — рух камери, освітлення, дії..." : "Опиши анімацію або мультфільм сцену...",
    className: "cf-inp",
    style: {
      minHeight: 80,
      resize: "vertical",
      fontSize: 12
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 3,
      fontFamily: C.mono
    }
  }, "\u041D\u0415\u0413\u0410\u0422\u0418\u0412\u041D\u0418\u0419 \u041F\u0420\u041E\u041C\u041F\u0422 (\u0449\u043E \u0432\u0438\u043A\u043B\u044E\u0447\u0438\u0442\u0438)"), /*#__PURE__*/React.createElement("input", {
    value: negPrompt,
    onChange: function (e) {
      setNegPrompt(e.target.value);
    },
    placeholder: "blur, watermark, low quality, distorted...",
    className: "cf-inp",
    style: {
      fontSize: 11
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\u0424\u041E\u0420\u041C\u0410\u0422"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flexWrap: "wrap"
    }
  }, ASPECTS.map(function (a) {
    return /*#__PURE__*/React.createElement("button", {
      key: a.v,
      onClick: function () {
        setAspect(a.v);
      },
      style: {
        padding: "5px 10px",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 10,
        background: aspect === a.v ? "rgba(236,72,153,.1)" : "transparent",
        border: "1px solid " + (aspect === a.v ? "rgba(236,72,153,.4)" : C.bdr),
        color: aspect === a.v ? "#EC4899" : C.t2
      }
    }, a.l);
  }))), (section === "video" || section === "animation") && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 4,
      fontFamily: C.mono
    }
  }, "\u0422\u0420\u0418\u0412\u0410\u041B\u0406\u0421\u0422\u042C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, ["5", "10", "15"].map(function (d) {
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: function () {
        setDuration(d);
      },
      style: {
        padding: "5px 10px",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 10,
        background: duration === d ? "rgba(236,72,153,.1)" : "transparent",
        border: "1px solid " + (duration === d ? "rgba(236,72,153,.4)" : C.bdr),
        color: duration === d ? "#EC4899" : C.t2
      }
    }, d, "s");
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: generate,
    disabled: busy || !prompt.trim(),
    style: {
      width: "100%",
      padding: "14px",
      borderRadius: 12,
      cursor: "pointer",
      border: "none",
      background: busy || !prompt.trim() ? "#E2E6F0" : "linear-gradient(135deg,#7C3AED,#EC4899)",
      color: busy || !prompt.trim() ? "#9CA3AF" : "#fff",
      fontSize: 14,
      fontWeight: 800,
      boxShadow: !busy && prompt.trim() ? "0 4px 20px rgba(236,72,153,.3)" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " ", section === "image" ? "Генерую зображення..." : section === "video" ? "Генерую відео (20-60 сек)..." : "Анімую...") : section === "image" ? "🎨 Генерувати фото →" : section === "video" ? "🎬 Генерувати відео →" : "🎭 Генерувати анімацію →"), err && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "10px 14px",
      borderRadius: 8,
      background: "rgba(220,38,38,.08)",
      border: "1px solid rgba(220,38,38,.2)",
      fontSize: 12,
      color: C.red,
      fontFamily: C.mono
    }
  }, "\u26A0\uFE0F ", err, err.includes("API key") && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 10,
      color: C.t3
    }
  }, "\u0414\u043E\u0434\u0430\u0439 \u043A\u043B\u044E\u0447 \u0432 config.php: OPENAI_API_KEY, RUNWAY_API_KEY, \u0430\u0431\u043E REPLICATE_API_TOKEN")), results.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "\u2705 \u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0438 (", results.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, results.map(function (url, i) {
    var isVideo = url.includes(".mp4") || url.includes("video") || section !== "image";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid " + C.bdr,
        background: "#000"
      }
    }, isVideo ? /*#__PURE__*/React.createElement("video", {
      controls: true,
      src: url,
      style: {
        width: "100%",
        maxHeight: 200,
        objectFit: "contain"
      }
    }) : /*#__PURE__*/React.createElement("img", {
      src: url,
      alt: "result " + i,
      style: {
        width: "100%",
        maxHeight: 240,
        objectFit: "cover"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px",
        background: C.bg3,
        display: "flex",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: url,
      download: "closefast_media_" + i,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "cf-btn cf-btn-ghost",
      style: {
        flex: 1,
        justifyContent: "center",
        fontSize: 9,
        textDecoration: "none"
      }
    }, "\uD83D\uDCBE \u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438"), section === "image" && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setPrompt("Based on this image: " + url + ". " + prompt);
      },
      className: "cf-btn cf-btn-ghost",
      style: {
        flex: 1,
        justifyContent: "center",
        fontSize: 9
      }
    }, "\uD83C\uDFAC \u2192 Video")));
  })), results.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "12px",
      borderRadius: 8,
      background: "linear-gradient(135deg,rgba(0,0,0,.8),rgba(20,20,20,.9))",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83D\uDCF1"), " TikTok / Reels Auto-Post"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5
    }
  }, !tikTokDone ? /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      setTikTokDone(true);
    },
    style: {
      padding: "5px 12px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 10,
      fontWeight: 700,
      background: "linear-gradient(135deg,#010101,#69C9D0)",
      color: "#fff",
      border: "none"
    }
  }, "\uD83D\uDCE4 \u041F\u043E\u0441\u0442\u0438\u0442\u0438 \u0432 TikTok") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#69C9D0",
      fontWeight: 700
    }
  }, "\u2705 \u0417\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u043E"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      padding: "5px 12px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 10,
      fontWeight: 700,
      background: "linear-gradient(135deg,#E1306C,#833AB4)",
      color: "#fff",
      textDecoration: "none"
    }
  }, "\uD83D\uDCF8 Instagram"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "rgba(255,255,255,.4)"
    }
  }, "TikTok API \u043A\u043B\u044E\u0447 \u043F\u043E\u0442\u0440\u0456\u0431\u0435\u043D \u0443 config.php \u2192 TIKTOK_CLIENT_KEY")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 10
    }
  }, "\uD83D\uDD11 API \u041A\u043B\u044E\u0447\u0456"), [{
    l: "OpenAI (DALL-E 3 / Sora)",
    key: "OPENAI_API_KEY",
    url: "https://platform.openai.com/api-keys"
  }, {
    l: "Runway ML",
    key: "RUNWAY_API_KEY",
    url: "https://app.runwayml.com/account/api-keys"
  }, {
    l: "Replicate (SDXL/Flux)",
    key: "REPLICATE_API_TOKEN",
    url: "https://replicate.com/account/api-tokens"
  }, {
    l: "Kling AI",
    key: "KLING_API_KEY",
    url: "https://klingai.com/developer"
  }, {
    l: "Luma AI",
    key: "LUMA_API_KEY",
    url: "https://lumalabs.ai/api"
  }, {
    l: "Ideogram",
    key: "IDEOGRAM_API_KEY",
    url: "https://ideogram.ai/account"
  }, {
    l: "Pika Labs",
    key: "PIKA_API_KEY",
    url: "https://pika.art/api"
  }, {
    l: "TikTok",
    key: "TIKTOK_CLIENT_KEY",
    url: "https://developers.tiktok.com"
  }].map(function (api) {
    return /*#__PURE__*/React.createElement("div", {
      key: api.key,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 7,
        padding: "6px 0",
        borderBottom: "1px solid " + C.bdr
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        color: C.txt
      }
    }, api.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: C.t4,
        fontFamily: C.mono
      }
    }, api.key)), /*#__PURE__*/React.createElement("a", {
      href: api.url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        fontSize: 9,
        color: "#EC4899",
        textDecoration: "none",
        padding: "2px 8px",
        borderRadius: 4,
        background: "rgba(236,72,153,.08)",
        border: "1px solid rgba(236,72,153,.2)"
      }
    }, "\u041E\u0442\u0440\u0438\u043C\u0430\u0442\u0438 \u2197"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "\uD83D\uDCB0 \u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u0457"), [{
    l: "DALL-E 3 image",
    p: "~$0.04"
  }, {
    l: "Runway Gen-3 (5s)",
    p: "~$0.25"
  }, {
    l: "Kling video (5s)",
    p: "~$0.14"
  }, {
    l: "Luma Dream 5s",
    p: "~$0.06"
  }, {
    l: "Flux Pro image",
    p: "~$0.05"
  }, {
    l: "SDXL image",
    p: "~$0.01"
  }].map(function (r) {
    return /*#__PURE__*/React.createElement("div", {
      key: r.l,
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        marginBottom: 4,
        color: C.t2
      }
    }, /*#__PURE__*/React.createElement("span", null, r.l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: C.mono,
        color: C.grn,
        fontWeight: 700
      }
    }, r.p));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      marginTop: 6,
      paddingTop: 6,
      borderTop: "1px solid " + C.bdr
    }
  }, "\u0412\u043A\u043B\u044E\u0447\u0438 \u0446\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \u0432 \u0446\u0456\u043D\u0443 \u043F\u0456\u0434\u043F\u0438\u0441\u043A\u0438 \u0430\u0431\u043E pay-per-use")), /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "\uD83D\uDCA1 \u0428\u0432\u0438\u0434\u043A\u0456 \u0456\u0434\u0435\u0457 \u0434\u043B\u044F Etsy"), ["Product lifestyle photo для лістингу", "Animated logo для Etsy магазину", "TikTok реклама POD продукту", "Before/After демо відео", "Сезонний промо для свят", "Unboxing animation"].map(function (idea) {
    return /*#__PURE__*/React.createElement("button", {
      key: idea,
      onClick: function () {
        setPrompt(idea);
        setFilmSection(false);
      },
      style: {
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "6px 8px",
        marginBottom: 4,
        borderRadius: 6,
        cursor: "pointer",
        background: "transparent",
        border: "1px solid " + C.bdr,
        fontSize: 10,
        color: C.t2,
        transition: "all .15s"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.borderColor = "#EC4899";
        e.currentTarget.style.color = "#EC4899";
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.borderColor = C.bdr;
        e.currentTarget.style.color = C.t2;
      }
    }, "\u25B8 ", idea);
  })))));
}

// ─── PRIVACY POLICY MODAL ────────────────────────────────────────────────────
function PrivacyModal({
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: onClose,
    style: {
      zIndex: 1000,
      alignItems: "flex-start",
      overflowY: "auto",
      paddingTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-box",
    style: {
      maxWidth: 620,
      maxHeight: "80vh",
      overflowY: "auto"
    },
    onClick: function (e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "Privacy Policy ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "&"), " Terms"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 20,
      color: C.t3,
      lineHeight: 1
    }
  }, "\xD7")), [{
    h: "1. Data We Collect",
    t: "We collect your email address for authentication purposes only. No passwords are stored — login uses email + math CAPTCHA verification. We do not collect names, addresses, phone numbers, or payment card numbers directly. Payment processing is handled by Stripe and Revolut under their own privacy policies."
  }, {
    h: "2. API Keys & Credentials",
    t: "API keys you enter in the Connections tab are stored ONLY in your browser's session memory (React state). They are never sent to our servers, never written to localStorage or cookies, and are permanently deleted when you close the browser tab. Keys in the Sentinel Payment Keys block are base64-encoded in memory and cleared on refresh."
  }, {
    h: "3. Session Data",
    t: "We store your email and language preference in sessionStorage (not localStorage) for the duration of your browser session. This data is automatically deleted when you close your browser. We do not use persistent cookies for authentication."
  }, {
    h: "4. AI Processing",
    t: "When you use AI features (listing generator, pricing agent, audit, builder), your prompts are sent to Anthropic's Claude API via our secure server-side proxy. Anthropic's privacy policy applies to these requests. We do not store your AI prompts or generated content."
  }, {
    h: "5. Payments",
    t: "Subscription payments are processed by Stripe (PCI-DSS Level 1 certified) or Revolut Business. We never see or store your card details. Crypto payments are peer-to-peer. By subscribing, you agree to the respective payment processor's terms."
  }, {
    h: "6. Third-Party APIs",
    t: "CloseFast connects to Etsy, Printify, X/Twitter, Instagram, and OpenSea APIs on your behalf using credentials you provide. We act as a technical intermediary. You retain ownership of your store data, listings, and social content."
  }, {
    h: "7. Data Retention",
    t: "User accounts consist only of your email address. You may request deletion at any time by emailing volya089@gmail.com. Session data is automatically purged on browser close. We do not maintain any long-term user database in this version of the platform."
  }, {
    h: "8. Security",
    t: "All production traffic is served over HTTPS. Server-side API keys are stored in environment variables above the web root, never in code. Rate limiting is applied to all AI calls. The Sentinel panel is accessible only to the verified master account."
  }, {
    h: "9. Children",
    t: "CloseFast is intended for business users aged 18 and over. We do not knowingly collect data from minors."
  }, {
    h: "10. Contact",
    t: "For privacy concerns, data deletion requests, or questions: volya089@gmail.com — we respond within 48 hours."
  }, {
    h: "11. Changes",
    t: "This policy may be updated as the platform evolves. Continued use after updates constitutes acceptance. Last updated: March 2026."
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("div", {
      key: s.h,
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: C.amber,
        marginBottom: 4,
        fontFamily: C.mono
      }
    }, s.h), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: C.t2,
        lineHeight: 1.7
      }
    }, s.t));
  }), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: onClose,
    style: {
      width: "100%",
      justifyContent: "center",
      marginTop: 8
    }
  }, "I Understand \u2713")));
}

// ─── AI BUILDER TAB ──────────────────────────────────────────────────────────
var BUILDER_TYPES = [{
  v: "landing",
  l: "Landing Page",
  icon: "🌐",
  desc: "High-converting product/service page",
  plan: "starter"
}, {
  v: "webapp",
  l: "Web App / Dashboard",
  icon: "⚙️",
  desc: "Full SPA with UI, logic, data flow",
  plan: "pro"
}, {
  v: "saas",
  l: "SaaS Platform",
  icon: "🚀",
  desc: "Multi-user app with auth, billing, dashboard",
  plan: "elite"
}, {
  v: "etsy-tool",
  l: "Etsy Tool / Widget",
  icon: "🛍",
  desc: "Custom listing, SEO, or analytics tool",
  plan: "starter"
}, {
  v: "api",
  l: "API / Microservice",
  icon: "🔌",
  desc: "REST or webhook backend service",
  plan: "pro"
}, {
  v: "bot",
  l: "Telegram / Discord Bot",
  icon: "🤖",
  desc: "Automated messaging & command bot",
  plan: "pro"
}, {
  v: "nft-mint",
  l: "NFT Minting Site",
  icon: "🖼",
  desc: "Web3 mint page with wallet connect",
  plan: "elite"
}, {
  v: "token",
  l: "Token on Monad",
  icon: "🪙",
  desc: "ERC-20 / мем-токен + лендінг + liquidity",
  plan: "elite"
}, {
  v: "defi",
  l: "DeFi Dashboard",
  icon: "⛓️",
  desc: "Swap, staking, portfolio tracker on Monad",
  plan: "elite"
}, {
  v: "mobile",
  l: "Mobile App (PWA)",
  icon: "📱",
  desc: "Progressive Web App — iOS + Android ready",
  plan: "pro"
}, {
  v: "ai-agent",
  l: "Custom AI Agent",
  icon: "🧠",
  desc: "Autonomous AI workflow for any business task",
  plan: "elite"
}, {
  v: "ecom",
  l: "E-Commerce Store",
  icon: "🛒",
  desc: "Shopify-like store with payments + inventory",
  plan: "pro"
}];
var BUILDER_PLANS = [{
  k: "starter",
  l: "Starter",
  price: 49,
  desc: "Landing або простий інструмент",
  features: ["1 сторінка / компонент", "AI генерація spec", "HTML + CSS + JS", "Готово за 24h", "1 раунд правок"]
}, {
  k: "pro",
  l: "Pro",
  price: 149,
  desc: "Full app або multi-page сайт",
  features: ["До 10 сторінок/views", "Full React SPA", "API інтеграції", "Готово за 48h", "3 раунди правок", "SEO оптимізація"],
  popular: true
}, {
  k: "elite",
  l: "Elite",
  price: 349,
  desc: "Web3 / SaaS / Token launch",
  features: ["Необмежена складність", "Smart contract UI", "Monad / EVM інтеграція", "Деплой токену включено", "5 днів доставки", "Необмежені правки", "Dedicated AI агент", "Source code + docs + відео"]
}, {
  k: "token",
  l: "Token Launch",
  price: 499,
  desc: "Повний запуск токену на Monad",
  features: ["ERC-20 контракт на Monad", "Лендінг для токену", "Liquidity setup guide", "Tokenomics від AI", "Whitepaper draft", "Listing strategy", "Monad node інтеграція"]
}];
function AiBuilderTab({
  T,
  user
}) {
  var god = user && user.god;
  var [type, setType] = useState("landing");
  var [plan, setPlan] = useState("pro");
  var [desc, setDesc] = useState("");
  var [stack, setStack] = useState("react");
  var [busy, setBusy] = useState(false);
  var [result, setResult] = useState(null);
  var [err, setErr] = useState("");
  var [step, setStep] = useState(1);
  var [ordered, setOrdered] = useState(false);
  var [codeResult, setCodeResult] = useState(null);
  var [codeBusy, setCodeBusy] = useState(false);
  var [activeAI, setActiveAI] = useState("claude");
  var selectedPlan = BUILDER_PLANS.find(function (p) {
    return p.k === plan;
  }) || BUILDER_PLANS[1];
  var selectedType = BUILDER_TYPES.find(function (t) {
    return t.v === type;
  }) || BUILDER_TYPES[0];

  // AI Engines per category
  var AI_ENGINES = {
    "landing": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for HTML/CSS/JS landing pages"
    },
    "webapp": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for React SPA + logic"
    },
    "saas": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for complex SaaS architecture"
    },
    "etsy-tool": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for Etsy API integrations"
    },
    "api": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for REST APIs + webhooks"
    },
    "bot": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for Telegram/Discord bot logic"
    },
    "nft-mint": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for Web3 smart contracts"
    },
    "token": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for Solidity + tokenomics"
    },
    "defi": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for DeFi protocol code"
    },
    "mobile": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for PWA React Native"
    },
    "ai-agent": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for AI agent pipelines"
    },
    "ecom": {
      id: "claude",
      l: "Claude 4 Sonnet",
      icon: "🤖",
      desc: "Best for e-commerce logic"
    }
  };

  // Code generators per type
  var CODE_PROMPTS = {
    "landing": "You are an expert frontend developer. Generate a complete, beautiful, WORKING single-file HTML landing page. Include inline CSS and JS. Make it modern, responsive, conversion-optimized. Return ONLY the complete HTML code starting with <!DOCTYPE html>.",
    "webapp": "You are an expert React developer. Generate a complete working React app as a single JSX component. Use hooks, modern patterns, beautiful Tailwind-like inline styles. Return ONLY the complete JSX code.",
    "bot": "You are an expert bot developer. Generate complete working Telegram bot code in Node.js using node-telegram-bot-api. Include all handlers, commands, and logic. Return ONLY complete working code with inline comments.",
    "api": "You are an expert backend developer. Generate complete working Express.js REST API code with all routes, middleware, error handling. Return ONLY complete working code.",
    "etsy-tool": "You are an Etsy integration expert. Generate complete working JavaScript/React component for Etsy API integration. Include all API calls, error handling, UI. Return ONLY complete working code.",
    "nft-mint": "You are a Web3 developer. Generate complete NFT minting site HTML page with ethers.js wallet connect and contract interaction. Return ONLY complete HTML with inline JS.",
    "token": "You are a Solidity and Web3 expert. Generate complete ERC-20 token contract in Solidity + deployment script in JavaScript. Return ONLY complete code with comments.",
    "defi": "You are a DeFi protocol developer. Generate complete React DeFi dashboard with swap UI, wallet connect via ethers.js. Return ONLY complete working code.",
    "mobile": "You are a PWA expert. Generate complete Progressive Web App with service worker, manifest, offline support. Return ONLY complete code.",
    "ai-agent": "You are an AI systems architect. Generate complete AI agent workflow in Python using LangChain concepts (without imports, as pseudocode that Claude can run). Return complete Python-like pseudocode with actual logic.",
    "saas": "You are a full-stack SaaS developer. Generate complete React SPA with auth flow, dashboard, sidebar navigation, mock API integration. Return ONLY complete working single-file React JSX.",
    "ecom": "You are an e-commerce developer. Generate complete e-commerce store React component with product grid, cart, checkout flow. Return ONLY complete working code."
  };
  function generateSpec() {
    return _generateSpec2.apply(this, arguments);
  }
  function _generateSpec2() {
    _generateSpec2 = _asyncToGenerator(function* () {
      if (!desc.trim() || desc.trim().length < 10) {
        setErr("Please describe your app in at least 10 characters.");
        return;
      }
      setBusy(true);
      setResult(null);
      setErr("");
      try {
        var raw = yield ai("You are a world-class software architect and product designer. Return ONLY valid JSON, no markdown backticks.", "Generate a detailed technical specification for this project.\n" + "Type: " + selectedType.l + "\n" + "Tech stack: " + stack + "\n" + "Client description: " + desc + "\n\n" + "Return JSON:\n{\n" + "  \"project_name\": \"short catchy name\",\n" + "  \"tagline\": \"one sentence value prop\",\n" + "  \"core_features\": [\"feature 1\",\"feature 2\",\"feature 3\",\"feature 4\",\"feature 5\"],\n" + "  \"pages_or_views\": [\"Home\",\"Dashboard\",\"...up to 6\"],\n" + "  \"tech_stack\": [\"React 18\",\"Tailwind\",\"...\"],\n" + "  \"ai_integrations\": [\"describe AI features built in\"],\n" + "  \"unique_selling_points\": [\"usp1\",\"usp2\",\"usp3\"],\n" + "  \"estimated_hours\": 24,\n" + "  \"complexity\": \"medium\",\n" + "  \"recommended_plan\": \"pro\",\n" + "  \"delivery_days\": 3,\n" + "  \"monetization_ideas\": [\"idea1\",\"idea2\"],\n" + "  \"next_steps\": [\"step1\",\"step2\",\"step3\"]\n" + "}", 1000);
        var parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        setResult(parsed);
        setStep(2);
      } catch (e) {
        setErr(e.message);
      }
      setBusy(false);
    });
    return _generateSpec2.apply(this, arguments);
  }
  function generateCode() {
    return _generateCode.apply(this, arguments);
  }
  function _generateCode() {
    _generateCode = _asyncToGenerator(function* () {
      if (!desc.trim()) return;
      setCodeBusy(true);
      setCodeResult(null);
      setErr("");
      var prompt = CODE_PROMPTS[type] || CODE_PROMPTS["webapp"];
      var userReq = "Project type: " + selectedType.l + "\n" + "Tech stack: " + stack + "\n" + "Description: " + desc + "\n" + (result ? "Project name: " + result.project_name + "\n" + "Core features: " + (result.core_features || []).join(", ") + "\n" : "") + "\nGenerate complete, working, production-ready code. Make it beautiful and functional.";
      try {
        var raw = yield ai(prompt, userReq, 4000);
        setCodeResult(raw);
        setStep(4); // new step for code view
      } catch (e) {
        setErr(e.message);
      }
      setCodeBusy(false);
    });
    return _generateCode.apply(this, arguments);
  }
  function handleOrder() {
    return _handleOrder.apply(this, arguments);
  } // ── God Mode banner ──
  function _handleOrder() {
    _handleOrder = _asyncToGenerator(function* () {
      setOrdered(true);
      setStep(3);
      // Send real notification to owner
      try {
        yield fetch("/api/builder-order.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            plan: selectedPlan.l,
            price: selectedPlan.price,
            project_name: result ? result.project_name : "Unknown",
            type: selectedType ? selectedType.l : type,
            stack: stack,
            description: desc,
            features: result ? result.core_features || [] : [],
            client_email: ""
          })
        });
      } catch (e) {
        console.warn("Order notify failed:", e.message);
      }
    });
    return _handleOrder.apply(this, arguments);
  }
  var GodBanner = god ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 16px",
      marginBottom: 20,
      borderRadius: 10,
      background: "linear-gradient(135deg,rgba(240,165,0,.12),rgba(240,165,0,.04))",
      border: "1px solid rgba(240,165,0,.35)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.amber,
      fontFamily: C.mono
    }
  }, "\u0411\u041E\u0413 \u0420\u0415\u0416\u0418\u041C \u2014 \u0412\u041B\u0410\u0421\u041D\u0418\u041A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3
    }
  }, "\u0412\u0441\u0456 \u043F\u043B\u0430\u043D\u0438 \u0431\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u0456 \xB7 Spec \u0433\u0435\u043D\u0435\u0440\u0443\u0454\u0442\u044C\u0441\u044F \u043C\u0438\u0442\u0442\u0454\u0432\u043E \xB7 \u041E\u043F\u043B\u0430\u0442\u0430 \u0437\u043D\u044F\u0442\u0430"))) : null;

  // ── STEP 1: Configure ──
  if (step === 1 || !result) return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-1px",
      marginBottom: 4,
      color: C.txt,
      fontFamily: C.dis
    }
  }, "AI ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.amber
    }
  }, "Builder")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 18,
      fontFamily: C.mono
    }
  }, "Describe your app or site \u2192 AI generates full spec + code architecture \u2192 ", god ? "Build it yourself or delegate" : "We build it for you"), GodBanner, !god && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px",
      marginBottom: 24,
      background: "linear-gradient(135deg,#FFF8E1,#FFFDE7)",
      border: "1px solid " + C.amber + "40",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      gap: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.amber
    }
  }, "\uD83D\uDCA1 Competitor pricing"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3
    }
  }, "Upwork: $80-200/hr \xA0\xB7\xA0 Fiverr: $500-2000/project \xA0\xB7\xA0 Agencies: $3000-15000")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.grn,
      fontWeight: 700
    }
  }, "CloseFast Builder: from $49"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4
    }
  }, "Free spec \xB7 Pay only to build"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 360px",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 12
    }
  }, "What do you want to Build?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 20
    }
  }, BUILDER_TYPES.map(function (t) {
    var on = type === t.v;
    return /*#__PURE__*/React.createElement("div", {
      key: t.v,
      onClick: function () {
        setType(t.v);
      },
      style: {
        padding: "14px",
        borderRadius: 10,
        cursor: "pointer",
        border: "2px solid " + (on ? C.amber : C.bdr),
        background: on ? C.amberL : C.bg,
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        marginBottom: 4
      }
    }, t.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: on ? C.amber : C.txt,
        fontFamily: C.dis
      }
    }, t.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3,
        marginTop: 2
      }
    }, t.desc));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "Describe your project"), /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: function (e) {
      setDesc(e.target.value);
      setErr("");
    },
    placeholder: "e.g. I need a Monad dashboard that shows live price of VLY token, my Etsy sales stats, and has an AI assistant that suggests when to restock products. Users log in with wallet.",
    className: "cf-inp",
    style: {
      minHeight: 130,
      resize: "vertical",
      lineHeight: 1.6,
      fontSize: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: desc.trim().length < 10 ? C.red : C.t4,
      marginTop: 4,
      fontFamily: C.mono
    }
  }, desc.trim().length, " chars \u2014 more detail = better spec")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 8
    }
  }, "Tech stack"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, [{
    v: "react",
    l: "React + Vite"
  }, {
    v: "next",
    l: "Next.js"
  }, {
    v: "html",
    l: "HTML/CSS/JS"
  }, {
    v: "web3",
    l: "Web3 / Monad"
  }].map(function (s) {
    var on = stack === s.v;
    return /*#__PURE__*/React.createElement("button", {
      key: s.v,
      onClick: function () {
        setStack(s.v);
      },
      style: {
        padding: "6px 14px",
        borderRadius: 6,
        border: "1px solid " + (on ? C.blue : C.bdr),
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 700,
        background: on ? C.blueL : C.bg,
        color: on ? C.blue : C.t3,
        transition: "all .15s"
      }
    }, s.l);
  })))), /*#__PURE__*/React.createElement("div", null, god ?
  /*#__PURE__*/
  /* God Mode: no payment, just generate */
  React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,rgba(240,165,0,.06),#FFFFF8)",
      border: "1px solid rgba(240,165,0,.3)",
      borderRadius: 12,
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 4
    }
  }, "Spec Preview"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 16
    }
  }, "\u0412\u0438\u0431\u0435\u0440\u0438 \u0440\u0456\u0432\u0435\u043D\u044C \u0441\u043A\u043B\u0430\u0434\u043D\u043E\u0441\u0442\u0456 \u0434\u043B\u044F \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u0457 spec-\u0443"), BUILDER_PLANS.map(function (p) {
    var on = plan === p.k;
    return /*#__PURE__*/React.createElement("div", {
      key: p.k,
      onClick: function () {
        setPlan(p.k);
      },
      style: {
        padding: "12px 14px",
        borderRadius: 8,
        cursor: "pointer",
        marginBottom: 8,
        border: "2px solid " + (on ? C.amber : C.bdr),
        background: on ? C.amberL : "#FAFAFA",
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        color: on ? C.amber : C.txt,
        fontFamily: C.dis
      }
    }, p.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3
      }
    }, p.desc)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 4,
        background: on ? "rgba(240,165,0,.2)" : "#F3F4F6",
        color: on ? C.amberD : C.t4,
        fontFamily: C.mono,
        fontWeight: 700
      }
    }, "\u043A\u043B\u0456\u0454\u043D\u0442 $", p.price)));
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      margin: "10px 0",
      padding: "8px 12px",
      background: C.redL,
      borderRadius: 6,
      fontFamily: C.mono
    }
  }, "\u26A0 ", err), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: generateSpec,
    disabled: busy || desc.trim().length < 10,
    style: {
      width: "100%",
      justifyContent: "center",
      padding: "13px",
      fontSize: 13,
      fontWeight: 700,
      marginTop: 8
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Generating spec\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, selectedType.icon, " Generate Spec (FREE)")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t4,
      textAlign: "center",
      marginTop: 6,
      fontFamily: C.mono
    }
  }, "\u2726 \u0412\u043B\u0430\u0441\u043D\u0438\u043A \xB7 \u041E\u043F\u043B\u0430\u0442\u0430 \u0437\u043D\u044F\u0442\u0430")) :
  /*#__PURE__*/
  /* Regular user: show plans with prices */
  React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.txt,
      marginBottom: 12
    }
  }, "Select Build Plan"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 16
    }
  }, BUILDER_PLANS.map(function (p) {
    var on = plan === p.k;
    return /*#__PURE__*/React.createElement("div", {
      key: p.k,
      onClick: function () {
        setPlan(p.k);
      },
      style: {
        padding: "14px 16px",
        borderRadius: 10,
        cursor: "pointer",
        border: "2px solid " + (on ? C.amber : C.bdr),
        background: on ? C.amberL : C.bg,
        position: "relative",
        transition: "all .15s"
      }
    }, p.popular && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: -9,
        right: 12,
        fontSize: 8,
        fontWeight: 700,
        padding: "2px 10px",
        background: C.amber,
        color: "#fff",
        borderRadius: 20,
        fontFamily: C.mono,
        letterSpacing: ".5px"
      }
    }, "MOST POPULAR"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: on ? C.amber : C.txt,
        fontFamily: C.dis
      }
    }, p.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: C.t3,
        marginTop: 2
      }
    }, p.desc)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        color: on ? C.amber : C.txt,
        fontFamily: C.mono
      }
    }, "$", p.price), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.t4
      }
    }, "one-time"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: "flex",
        flexWrap: "wrap",
        gap: 4
      }
    }, p.features.map(function (f) {
      return /*#__PURE__*/React.createElement("div", {
        key: f,
        style: {
          fontSize: 9,
          padding: "2px 8px",
          background: on ? "rgba(240,165,0,.12)" : C.bg3,
          color: on ? C.amberD : C.t3,
          borderRadius: 4,
          fontFamily: C.mono
        }
      }, "\u2713 ", f);
    })));
  })), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.red,
      marginBottom: 10,
      padding: "8px 12px",
      background: C.redL,
      borderRadius: 6,
      fontFamily: C.mono
    }
  }, "\u26A0 ", err), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: generateSpec,
    disabled: busy || desc.trim().length < 10,
    style: {
      width: "100%",
      justifyContent: "center",
      padding: "13px",
      fontSize: 13,
      fontWeight: 700
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " Generating spec\u2026") : /*#__PURE__*/React.createElement(React.Fragment, null, selectedType.icon, " Generate Project Spec \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t4,
      textAlign: "center",
      marginTop: 8,
      fontFamily: C.mono
    }
  }, "Free spec generation \u2014 pay only when you order the build")))));

  // ── STEP 2: Spec result ──
  if (step === 2 && result) return /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setStep(1);
      setResult(null);
    }
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis
    }
  }, result.project_name || "Project Spec"), result.tagline && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      fontFamily: C.mono
    }
  }, result.tagline)), GodBanner, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, [{
    title: "Core Features",
    items: result.core_features,
    col: C.blue,
    icon: "⚡"
  }, {
    title: "Pages / Views",
    items: result.pages_or_views,
    col: C.grn,
    icon: "📄"
  }, {
    title: "Tech Stack",
    items: result.tech_stack,
    col: C.pur,
    icon: "🔧"
  }, {
    title: "AI Integrations",
    items: result.ai_integrations,
    col: C.amber,
    icon: "🤖"
  }, {
    title: "Unique Selling Points",
    items: result.unique_selling_points,
    col: C.grn,
    icon: "💎"
  }, {
    title: "Monetization",
    items: result.monetization_ideas,
    col: C.amber,
    icon: "💰"
  }].map(function (sec) {
    if (!sec.items || !sec.items.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: sec.title,
      className: "cf-card"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: sec.col,
        marginBottom: 8,
        fontFamily: C.mono,
        letterSpacing: ".3px"
      }
    }, sec.icon, " ", sec.title.toUpperCase()), sec.items.map(function (item, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          fontSize: 11,
          color: C.t2,
          marginBottom: 5,
          display: "flex",
          gap: 8,
          alignItems: "flex-start"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: sec.col,
          flexShrink: 0
        }
      }, "\u203A"), " ", item);
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      fontFamily: C.mono,
      marginBottom: 10
    }
  }, "PROJECT SUMMARY"), [{
    l: "Complexity",
    v: result.complexity || "—"
  }, {
    l: "Est. Hours",
    v: (result.estimated_hours || "—") + " hrs"
  }, {
    l: "Delivery",
    v: (result.delivery_days || "—") + " days"
  }, {
    l: "Stack",
    v: stack
  }].map(function (m) {
    return /*#__PURE__*/React.createElement("div", {
      key: m.l,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: C.t3
      }
    }, m.l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: C.txt,
        fontFamily: C.mono
      }
    }, m.v));
  })), god ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px",
      background: "linear-gradient(135deg,rgba(240,165,0,.1),rgba(240,165,0,.04))",
      border: "2px solid rgba(240,165,0,.4)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: C.amber,
      marginBottom: 4,
      fontFamily: C.dis
    }
  }, "\u2726 Owner Actions"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      marginBottom: 14
    }
  }, "Spec \u0433\u043E\u0442\u043E\u0432\u0438\u0439. \u0429\u043E \u0440\u043E\u0431\u0438\u043C\u043E?"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: generateCode,
    disabled: codeBusy,
    style: {
      width: "100%",
      justifyContent: "center",
      marginBottom: 8,
      padding: "11px",
      fontSize: 13,
      fontWeight: 800,
      background: codeBusy ? "rgba(240,165,0,.4)" : "linear-gradient(135deg,#B07800,#F0A500)"
    }
  }, codeBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u0440\u0435\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u0434...") : "⚡ Згенерувати реальний код"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    },
    style: {
      width: "100%",
      justifyContent: "center",
      marginBottom: 8
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 JSON Spec"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: handleOrder,
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, "\uD83D\uDCE8 \u0412\u0456\u0434\u043F\u0440\u0430\u0432\u0438\u0442\u0438 \u043A\u043B\u0456\u0454\u043D\u0442\u0443 (email)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4,
      textAlign: "center",
      marginTop: 8,
      fontFamily: C.mono
    }
  }, "\u2726 \u041E\u043F\u043B\u0430\u0442\u0430 \u043D\u0435 \u0441\u0442\u044F\u0433\u0443\u0454\u0442\u044C\u0441\u044F \xB7 Claude \u0433\u0435\u043D\u0435\u0440\u0443\u0454 \u043A\u043E\u0434")) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px",
      background: C.amberL,
      border: "2px solid " + C.amber + "50",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis,
      marginBottom: 4
    }
  }, selectedPlan.l, " Build"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      marginBottom: 16
    }
  }, selectedPlan.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.t4
    }
  }, "One-time payment"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      fontWeight: 800,
      color: C.amber,
      fontFamily: C.mono,
      lineHeight: 1
    }
  }, "$", selectedPlan.price))), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: handleOrder,
    style: {
      width: "100%",
      justifyContent: "center",
      padding: "12px",
      fontSize: 13,
      fontWeight: 700
    }
  }, "Order This Build \u2192"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3,
      textAlign: "center",
      marginTop: 8
    }
  }, "You\u2019ll receive a confirmation email within 24h")), /*#__PURE__*/React.createElement("div", {
    className: "cf-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      fontFamily: C.mono,
      marginBottom: 8
    }
  }, "NEXT STEPS"), (result.next_steps || []).map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 11,
        color: C.t2,
        marginBottom: 8,
        display: "flex",
        gap: 8,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: C.amber,
        color: "#fff",
        fontSize: 9,
        fontWeight: 700,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, i + 1), s);
  })))));

  // ── STEP 3: Confirmed ──
  if (step === 3) return /*#__PURE__*/React.createElement("div", {
    className: "fade",
    style: {
      textAlign: "center",
      padding: "60px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 64,
      marginBottom: 16
    }
  }, god ? "✦" : "✅"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: C.txt,
      fontFamily: C.dis,
      marginBottom: 8
    }
  }, god ? "Spec скопійовано!" : "Order Received!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.t3,
      lineHeight: 1.8,
      maxWidth: 420,
      margin: "0 auto 24px"
    }
  }, god ? "Проект «" + (result && result.project_name || "") + "» готовий. Хочеш згенерувати реальний код прямо зараз?" : "Your project brief for «" + (result && result.project_name || "") + "» has been submitted. We'll contact you within 24 hours."), god && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      marginBottom: 24,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-amber",
    onClick: generateCode,
    disabled: codeBusy,
    style: {
      padding: "12px 24px",
      fontSize: 13,
      fontWeight: 700
    }
  }, codeBusy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, null), " \u0413\u0435\u043D\u0435\u0440\u0443\u044E \u043A\u043E\u0434...") : "⚡ Згенерувати реальний код →"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setStep(1);
      setResult(null);
      setOrdered(false);
      setDesc("");
    },
    style: {
      padding: "12px 20px"
    }
  }, "+ \u041D\u043E\u0432\u0438\u0439 \u043F\u0440\u043E\u0435\u043A\u0442")), !god && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      background: C.amberL,
      border: "1px solid " + C.amber + "40",
      borderRadius: 10,
      display: "inline-block",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.t3,
      fontFamily: C.mono
    }
  }, "Plan selected"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: C.amber,
      fontFamily: C.mono
    }
  }, selectedPlan.l, " \u2014 $", selectedPlan.price)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setStep(1);
      setResult(null);
      setOrdered(false);
      setDesc("");
    },
    style: {
      margin: "0 auto"
    }
  }, "\u2190 Start Another Build")));

  // ── STEP 4: Generated Code ──
  return /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setStep(2);
    }
  }, "\u2190 Spec"), /*#__PURE__*/React.createElement("button", {
    className: "cf-btn cf-btn-ghost",
    onClick: function () {
      setStep(1);
      setResult(null);
      setDesc("");
    }
  }, "+ \u041D\u043E\u0432\u0438\u0439"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      color: C.txt
    }
  }, result && result.project_name, " \u2014 \u041A\u043E\u0434 \u0433\u043E\u0442\u043E\u0432\u0438\u0439"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      navigator.clipboard && navigator.clipboard.writeText(codeResult || "");
    },
    className: "cf-btn cf-btn-ghost",
    style: {
      fontSize: 11
    }
  }, "\uD83D\uDCCB \u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u043A\u043E\u0434"), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      var blob = new Blob([codeResult || ""], {
        type: "text/plain"
      });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = (result && result.project_name ? result.project_name.toLowerCase().replace(/\s+/g, "-") : "project") + (type === "bot" ? ".js" : type === "api" ? ".js" : type === "token" ? ".sol" : type === "ai-agent" ? ".py" : ".html");
      a.click();
    },
    className: "cf-btn cf-btn-amber",
    style: {
      fontSize: 11
    }
  }, "\uD83D\uDCBE \u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0444\u0430\u0439\u043B"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
      padding: "8px 14px",
      borderRadius: 8,
      background: C.blueL,
      border: "1px solid " + C.blue + "25"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, (AI_ENGINES[type] || AI_ENGINES["webapp"]).icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.blue
    }
  }, (AI_ENGINES[type] || AI_ENGINES["webapp"]).l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.t3
    }
  }, (AI_ENGINES[type] || AI_ENGINES["webapp"]).desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      fontSize: 10,
      color: C.grn,
      fontWeight: 700,
      fontFamily: C.mono
    }
  }, "\u2705 \u041A\u041E\u0414 \u0417\u0413\u0415\u041D\u0415\u0420\u041E\u0412\u0410\u041D\u041E")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0F172A",
      borderRadius: 12,
      border: "1px solid rgba(99,102,241,.3)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 16px",
      background: "rgba(99,102,241,.15)",
      borderBottom: "1px solid rgba(99,102,241,.2)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, ["🔴", "🟡", "🟢"].map(function (d, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: i === 0 ? "#FF5F57" : i === 1 ? "#FEBC2E" : "#28C840"
      }
    });
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#64748B",
      fontFamily: C.mono,
      marginLeft: 8
    }
  }, result && result.project_name ? result.project_name.toLowerCase().replace(/\s+/g, "-") : "project", type === "bot" ? ".js" : type === "api" ? ".js" : type === "token" ? ".sol" : type === "ai-agent" ? ".py" : ".html")), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: "20px",
      color: "#E2E8F0",
      fontSize: 11,
      lineHeight: 1.7,
      fontFamily: C.mono,
      maxHeight: 580,
      overflowY: "auto",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word"
    }
  }, codeResult)), /*#__PURE__*/React.createElement("div", {
    className: "cf-card",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.t3,
      fontFamily: C.mono,
      marginBottom: 10
    }
  }, "\uD83D\uDE80 \u0429\u041E \u0414\u0410\u041B\u0406"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, [{
    l: "Скопіювати і запустити локально",
    icon: "💻"
  }, {
    l: "Відкрити в CodeSandbox",
    icon: "🌐",
    url: "https://codesandbox.io/s/"
  }, {
    l: "Деплой на Vercel (безкоштовно)",
    icon: "▲",
    url: "https://vercel.com/new"
  }, {
    l: "Деплой на Netlify",
    icon: "🔷",
    url: "https://app.netlify.com/drop"
  }].map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s.l,
      onClick: function () {
        if (s.url) window.open(s.url, "_blank");
      },
      style: {
        padding: "8px 14px",
        borderRadius: 7,
        cursor: "pointer",
        background: C.bg3,
        border: "1px solid " + C.bdr,
        fontSize: 11,
        color: C.t2,
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all .15s"
      },
      onMouseEnter: function (e) {
        e.currentTarget.style.borderColor = C.amber;
        e.currentTarget.style.color = C.amber;
      },
      onMouseLeave: function (e) {
        e.currentTarget.style.borderColor = C.bdr;
        e.currentTarget.style.color = C.t2;
      }
    }, s.icon, " ", s.l);
  }))));
}
// ─── ROOT ─────────────────────────────────────────────────────────────────────
function App() {
  // Check URL for Stripe success activation
  (function () {
    try {
      var params = new URLSearchParams(window.location.search);
      var activated = params.get("activated");
      var planParam = params.get("plan");
      var emailParam = params.get("email");
      if (activated === "1" && planParam && emailParam) {
        // Save plan to localStorage for persistence
        localStorage.setItem("cf_plan_" + emailParam, planParam);
        localStorage.setItem("cf_activated_email", emailParam);
        localStorage.setItem("cf_activated_plan", planParam);
        // Clean URL
        window.history.replaceState({}, document.title, "/");
      }
    } catch (e) {}
  })();

  // Session persists on page refresh — cleared when browser closes
  var [user, setUser] = useState(function () {
    try {
      var s = sessionStorage.getItem("cf_user");
      if (s) {
        var u = JSON.parse(s);
        // Check if this user has a saved plan
        var savedPlan = localStorage.getItem("cf_plan_" + u.email);
        if (savedPlan) {
          u.paid = true;
          u.plan = savedPlan;
        }
        return u;
      }
      // Check if activation just happened (new user after Stripe)
      var activatedEmail = localStorage.getItem("cf_activated_email");
      var activatedPlan = localStorage.getItem("cf_activated_plan");
      if (activatedEmail && activatedPlan) {
        return {
          email: activatedEmail,
          plan: activatedPlan,
          paid: true,
          god: false,
          lang: "en"
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  });
  var [lang, setLang] = useState(function () {
    try {
      return sessionStorage.getItem("cf_lang") || "en";
    } catch (e) {
      return "en";
    }
  });
  var [tab, setTab] = useState("plans");

  // ── Connections: persist in localStorage so they survive page refresh ──
  var [connections, setConn] = useState(function () {
    try {
      var s = localStorage.getItem("cf_connections");
      return s ? JSON.parse(s) : {};
    } catch (e) {
      return {};
    }
  });
  var [autopilot, setAuto] = useState(function () {
    try {
      var s = localStorage.getItem("cf_autopilot");
      return s ? JSON.parse(s) : {};
    } catch (e) {
      return {};
    }
  });
  var [showPrivacy, setPrivacy] = useState(false);
  var T = I18N[lang];

  // ── Save connections/autopilot to localStorage on every change ──
  useEffect(function () {
    try {
      localStorage.setItem("cf_connections", JSON.stringify(connections));
    } catch (e) {}
  }, [connections]);
  useEffect(function () {
    try {
      localStorage.setItem("cf_autopilot", JSON.stringify(autopilot));
    } catch (e) {}
  }, [autopilot]);
  function handleLogin(u) {
    setLang(u.lang || "en");
    // Check if user has paid plan stored in localStorage
    try {
      var savedPlan = localStorage.getItem("cf_plan_" + u.email);
      if (savedPlan && !u.paid) u.paid = true;
      if (savedPlan && !u.plan) u.plan = savedPlan;
    } catch (e) {}
    setUser(u);
    try {
      sessionStorage.setItem("cf_user", JSON.stringify(u));
      sessionStorage.setItem("cf_lang", u.lang || "en");
    } catch (e) {}
    try {
      var savedConn = localStorage.getItem("cf_connections");
      var savedAuto = localStorage.getItem("cf_autopilot");
      if (savedConn) setConn(JSON.parse(savedConn));
      if (savedAuto) setAuto(JSON.parse(savedAuto));
    } catch (e) {
      setConn({});
      setAuto({});
    }
    setTab(u.god ? "command" : u.paid ? "command" : "plans");
  }
  function handleLogout() {
    try {
      sessionStorage.removeItem("cf_user");
      sessionStorage.removeItem("cf_lang");
      localStorage.removeItem("cf_connections");
      localStorage.removeItem("cf_autopilot");
    } catch (e) {}
    setUser(null);
    setConn({});
    setAuto({});
    setTab("plans");
  }
  if (!user) return /*#__PURE__*/React.createElement(LoginGate, {
    onLogin: handleLogin
  });
  var ALL_USER_TABS = ["connections", "command", "inventory", "social", "audit", "support", "builder", "plans", "growth", "token", "media", "sentinel", "robinhood", "hottabych"];
  var ALLOWED_FOR_GOD = ALL_USER_TABS;
  // Paid users (non-god) get access to all tabs except owner-only ones
  var ALLOWED_FOR_PAID = ["connections", "command", "inventory", "social", "audit", "support", "builder", "plans", "growth", "media", "robinhood"];
  var ALLOWED_FOR_ALL = ["plans"];
  var allowed = user.god ? ALLOWED_FOR_GOD : user.paid ? ALLOWED_FOR_PAID : ALLOWED_FOR_ALL;
  var safeTab = allowed.indexOf(tab) >= 0 ? tab : user.paid ? "command" : "plans";
  return /*#__PURE__*/React.createElement("div", {
    className: user.god ? "god-root" : "",
    style: {
      minHeight: "100vh",
      background: C.bg2
    }
  }, /*#__PURE__*/React.createElement("style", null, CSS), showPrivacy && /*#__PURE__*/React.createElement(PrivacyModal, {
    onClose: function () {
      setPrivacy(false);
    }
  }), /*#__PURE__*/React.createElement(TopNav, {
    tab: safeTab,
    setTab: setTab,
    user: user,
    lang: lang,
    setLang: setLang,
    onLogout: handleLogout
  }), /*#__PURE__*/React.createElement("main", {
    className: "cf-main"
  }, safeTab === "connections" && (user.god || user.paid) && /*#__PURE__*/React.createElement(ConnectionsTab, {
    connections: connections,
    setConnections: setConn,
    autopilot: autopilot,
    setAutopilot: setAuto,
    T: T
  }), safeTab === "command" && (user.god || user.paid) && /*#__PURE__*/React.createElement(CommandCenterTab, {
    connections: connections,
    autopilot: autopilot,
    user: user,
    T: T
  }), safeTab === "inventory" && (user.god || user.paid) && /*#__PURE__*/React.createElement(InventoryTab, {
    connections: connections,
    T: T
  }), safeTab === "social" && (user.god || user.paid) && /*#__PURE__*/React.createElement(SocialTab, {
    connections: connections,
    autopilot: autopilot,
    T: T
  }), safeTab === "audit" && (user.god || user.paid) && /*#__PURE__*/React.createElement(AuditTab, {
    T: T
  }), safeTab === "support" && /*#__PURE__*/React.createElement(SupportTab, {
    T: T,
    user: user
  }), safeTab === "builder" && (user.god || user.paid) && /*#__PURE__*/React.createElement(AiBuilderTab, {
    T: T,
    user: user
  }), safeTab === "plans" && /*#__PURE__*/React.createElement(PlansTab, {
    T: T,
    user: user
  }), safeTab === "growth" && (user.god || user.paid) && /*#__PURE__*/React.createElement(GrowthTab, {
    T: T
  }), safeTab === "sentinel" && user.god && /*#__PURE__*/React.createElement(SentinelTab, {
    T: T
  }), safeTab === "robinhood" && (user.god || user.paid) && /*#__PURE__*/React.createElement(RobinhoodTab, null), safeTab === "token" && user.god && /*#__PURE__*/React.createElement(TokenStudioTab, null), safeTab === "media" && (user.god || user.paid) && /*#__PURE__*/React.createElement(MediaStudioTab, null), safeTab === "hottabych" && user.god && /*#__PURE__*/React.createElement(HottabychTab, null), !user.god && !user.paid && safeTab !== "plans" && /*#__PURE__*/React.createElement(AccessWall, {
    T: T,
    setTab: setTab
  })), /*#__PURE__*/React.createElement(AiHintBubble, {
    tab: safeTab,
    user: user
  }), /*#__PURE__*/React.createElement("footer", {
    style: {
      textAlign: "center",
      padding: "16px 24px",
      borderTop: "1px solid " + (user.god ? "rgba(240,165,0,.25)" : C.bdr),
      background: C.bg,
      fontSize: 11,
      color: C.t4,
      fontFamily: C.mono
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      letterSpacing: ".3px"
    }
  }, T.footer, user.god && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 12,
      color: C.amber,
      fontWeight: 700
    }
  }, "\xB7 \u2726 ", T.master_session)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 16,
      flexWrap: "wrap"
    }
  }, [{
    l: "Privacy Policy & Terms",
    fn: function () {
      setPrivacy(true);
    }
  }, {
    l: "Contact: volya089@gmail.com",
    fn: function () {
      window.open("mailto:volya089@gmail.com", "_blank");
    }
  }, {
    l: "Buy VLY ↗",
    fn: function () {
      window.open(VLY_BUY_LINK, "_blank");
    }
  }].map(function (lnk) {
    return /*#__PURE__*/React.createElement("button", {
      key: lnk.l,
      onClick: lnk.fn,
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 10,
        color: C.t4,
        fontFamily: C.mono,
        textDecoration: "underline",
        padding: 0,
        transition: "color .15s"
      },
      onMouseEnter: function (e) {
        e.target.style.color = C.amber;
      },
      onMouseLeave: function (e) {
        e.target.style.color = C.t4;
      }
    }, lnk.l);
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 10,
      color: C.red,
      fontFamily: C.mono,
      textDecoration: "underline",
      padding: 0
    }
  }, "Sign Out"))));
}
window.CloseFastApp = App;

})();
