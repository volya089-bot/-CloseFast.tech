/**
 * CloseFast Omni — AI Router v3.0
 * Priority: User Key → System Key → Free API → Synthetic
 *
 * FREE APIs (no cost):
 * • Pollinations.ai  — Images/Video, NO KEY, unlimited
 * • Groq             — LLaMA3 70B, 14K req/day, FREE KEY at console.groq.com
 * • Gemini           — 1500 req/day, FREE KEY at aistudio.google.com
 * • Mistral AI       — Free tier at console.mistral.ai
 * • Hugging Face     — FLUX images, free at huggingface.co/settings/tokens
 * • Cohere           — Text, 1K/mo, FREE KEY at dashboard.cohere.com
 * • Together AI      — $25 free credits at api.together.ai
 */

const { getKey } = require('./db');

// ─── TEXT/CHAT ──────────────────────────────────────────────────────────────

async function chat(prompt, system, email, maxTokens = 800) {
  const funcs = [
    () => _claude(prompt, system, email, maxTokens),
    () => _groq(prompt, system, email, maxTokens),
    () => _gemini(prompt, system, email, maxTokens),
    () => _mistral(prompt, system, email, maxTokens),
    () => _together(prompt, system, email, maxTokens),
    () => _openai(prompt, system, email, maxTokens),
    () => _cohere(prompt, email, maxTokens),
    () => _huggingface(prompt, system, maxTokens),
  ];

  for (const fn of funcs) {
    try { const r = await fn(); if (r?.text) return r; } catch {}
  }
  return { text: _synthetic(prompt), model: 'synthetic', free: true };
}

async function _claude(p, sys, email, maxTok) {
  const key = await getKey('ANTHROPIC_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'x-api-key':key,'anthropic-version':'2023-06-01','content-type':'application/json'},
    body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:maxTok,
      system: sys||'You are Hottabych, an expert AI business advisor for Etsy sellers.',
      messages:[{role:'user',content:p}] }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return { text:d.content[0].text, model:'claude-sonnet-4', provider:'anthropic' };
}

async function _groq(p, sys, email, maxTok) {
  const key = await getKey('GROQ_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ model:'llama-3.3-70b-versatile', max_tokens:maxTok, temperature:0.7,
      messages:[{role:'system',content:sys||'You are Hottabych, AI business advisor.'},{role:'user',content:p}] }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return { text:d.choices[0].message.content, model:'llama-3.3-70b', provider:'groq', free:true };
}

async function _gemini(p, sys, email, maxTok) {
  const key = await getKey('GEMINI_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ contents:[{parts:[{text:(sys?sys+'\n\n':'')+p}]}], generationConfig:{maxOutputTokens:maxTok} }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return { text:d.candidates[0].content.parts[0].text, model:'gemini-1.5-flash', provider:'google', free:true };
}

async function _mistral(p, sys, email, maxTok) {
  const key = await getKey('MISTRAL_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ model:'mistral-small-latest', max_tokens:maxTok,
      messages:[{role:'system',content:sys||'You are Hottabych, AI business advisor.'},{role:'user',content:p}] }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return { text:d.choices[0].message.content, model:'mistral-small', provider:'mistral', free:true };
}

async function _together(p, sys, email, maxTok) {
  const key = await getKey('TOGETHER_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.together.xyz/v1/chat/completions', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ model:'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', max_tokens:maxTok,
      messages:[{role:'system',content:sys||'You are Hottabych, AI business advisor.'},{role:'user',content:p}] }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return { text:d.choices[0].message.content, model:'llama-3.1-70b', provider:'together', free:true };
}

async function _openai(p, sys, email, maxTok) {
  const key = await getKey('OPENAI_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ model:'gpt-4o-mini', max_tokens:maxTok,
      messages:[{role:'system',content:sys||'You are Hottabych, AI business advisor.'},{role:'user',content:p}] }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return { text:d.choices[0].message.content, model:'gpt-4o-mini', provider:'openai' };
}

async function _cohere(p, email, maxTok) {
  const key = await getKey('COHERE_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.cohere.com/v1/generate', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ model:'command', prompt:p, max_tokens:maxTok }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.message);
  return { text:d.generations[0].text, model:'command', provider:'cohere', free:true };
}

async function _huggingface(p, sys, maxTok) {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ inputs:`[INST]${sys||'You are a business AI.'}\n\n${p}[/INST]`, parameters:{max_new_tokens:maxTok} }),
  });
  if (!r.ok) throw new Error(await r.text());
  const d = await r.json();
  const raw = Array.isArray(d) ? d[0].generated_text : d.generated_text;
  const text = raw?.split('[/INST]').pop()?.trim() || raw;
  return { text, model:'mistral-7b-hf', provider:'huggingface', free:true };
}

function _synthetic(prompt) {
  return `🔮 Hottabych готовий аналізувати: "${prompt.substring(0,50)}..."\n\nДодайте безкоштовний API ключ у Settings → API Keys:\n• Groq (LLaMA3) — console.groq.com → FREE\n• Google Gemini — aistudio.google.com → FREE\n• Mistral AI — console.mistral.ai → FREE`;
}

// ─── IMAGE GENERATION ────────────────────────────────────────────────────────

async function generateImage(prompt, email, opts = {}) {
  const { width=1024, height=1024, style='realistic' } = opts;

  const funcs = [
    () => _imgDALLE(prompt, email, width, height),
    () => _imgHuggingFace(prompt, email, width, height),
    () => _imgStability(prompt, email, width, height),
    () => _imgIdeogram(prompt, email),
    () => _imgPollinations(prompt, width, height, style), // Always free fallback
  ];

  for (const fn of funcs) {
    try { const r = await fn(); if (r?.url) return r; } catch {}
  }
  return _imgPollinations(prompt, width, height, style);
}

async function _imgDALLE(prompt, email, w, h) {
  const key = await getKey('OPENAI_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const size = w >= 1024 ? '1024x1024' : '512x512';
  const r = await fetch('https://api.openai.com/v1/images/generations', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ model:'dall-e-3', prompt, n:1, size, quality:'standard' }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return { url:d.data[0].url, model:'dall-e-3', provider:'openai' };
}

async function _imgHuggingFace(prompt, email, w, h) {
  const key = await getKey('HUGGINGFACE_API_KEY', email) || process.env.HUGGINGFACE_API_KEY;
  if (!key || key.includes('REPLACE')) throw new Error('no hf key');
  // FLUX.1-schnell — best free image model
  const r = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ inputs:prompt, parameters:{width:Math.min(w,1024), height:Math.min(h,1024)} }),
  });
  if (!r.ok) { const t=await r.text(); throw new Error(t); }
  const buf = await r.arrayBuffer();
  const b64 = Buffer.from(buf).toString('base64');
  return { url:`data:image/jpeg;base64,${b64}`, base64:b64, model:'flux-1-schnell', provider:'huggingface', free:true };
}

async function _imgStability(prompt, email, w, h) {
  const key = await getKey('STABILITY_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
    method:'POST',
    headers:{'Authorization':`Bearer ${key}`,'Accept':'image/*'},
    body: (() => { const f=new FormData(); f.append('prompt',prompt); f.append('output_format','png'); return f; })(),
  });
  if (!r.ok) throw new Error(await r.text());
  const buf = await r.arrayBuffer();
  const b64 = Buffer.from(buf).toString('base64');
  return { url:`data:image/png;base64,${b64}`, base64:b64, model:'stable-core', provider:'stability' };
}

async function _imgIdeogram(prompt, email) {
  const key = await getKey('IDEOGRAM_API_KEY', email) || process.env.IDEOGRAM_API_KEY;
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.ideogram.ai/generate', {
    method:'POST', headers:{'Api-Key':key,'Content-Type':'application/json'},
    body: JSON.stringify({ image_request:{ prompt, model:'V_2', magic_prompt_option:'AUTO', aspect_ratio:'ASPECT_1_1' } }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.message);
  return { url:d.data[0].url, model:'ideogram-v2', provider:'ideogram', free:true };
}

function _imgPollinations(prompt, w, h, style) {
  const styles = {
    realistic: 'photorealistic, professional photography, high detail',
    artistic:  'artistic, oil painting, vibrant',
    product:   'product photo, white background, commercial quality',
    etsy:      'etsy listing photo, bright, clean, attractive',
    anime:     'anime, studio ghibli style',
  };
  const enhanced = `${prompt}, ${styles[style]||styles.realistic}`;
  return {
    url: `https://image.pollinations.ai/prompt/${encodeURIComponent(enhanced)}?width=${w}&height=${h}&nologo=true&enhance=true&seed=${Date.now()}`,
    model: 'pollinations-flux', provider: 'pollinations', free: true,
  };
}

// ─── VIDEO GENERATION ─────────────────────────────────────────────────────

async function generateVideo(prompt, email, opts = {}) {
  const { duration=5, ratio='16:9' } = opts;

  const funcs = [
    () => _vidRunway(prompt, email, duration, ratio),
    () => _vidLuma(prompt, email),
    () => _vidKling(prompt, email, duration),
    () => _vidReplicate(prompt, email),
  ];

  for (const fn of funcs) {
    try { const r = await fn(); if (r) return r; } catch {}
  }

  return {
    message: 'Video generation requires a paid API key (Runway, Luma, or Kling). Add your key in Settings.',
    freeNote: 'Free video generation coming soon via Pollinations.ai',
    docs: 'https://runwayml.com — $15/mo for Runway Gen-3',
  };
}

async function _vidRunway(prompt, email, duration, ratio) {
  const key = await getKey('RUNWAY_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
    method:'POST',
    headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json','X-Runway-Version':'2024-11-06'},
    body: JSON.stringify({ promptText:prompt, duration, ratio, model:'gen3a_turbo' }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.message);
  return { taskId:d.id, status:'queued', model:'runway-gen3', provider:'runway' };
}

async function _vidLuma(prompt, email) {
  const key = await getKey('LUMA_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ prompt, aspect_ratio:'16:9' }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.detail||d.message);
  return { taskId:d.id, status:'queued', model:'luma-dream-machine', provider:'luma' };
}

async function _vidKling(prompt, email, duration) {
  const key = await getKey('KLING_API_KEY', email);
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.klingai.com/v1/videos/text2video', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ prompt, duration:String(duration), aspect_ratio:'16:9', mode:'std' }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.message);
  return { taskId:d.data?.task_id, status:'queued', model:'kling-v1', provider:'kling' };
}

async function _vidReplicate(prompt, email) {
  const key = await getKey('REPLICATE_API_TOKEN', email) || process.env.REPLICATE_API_TOKEN;
  if (!key || key.includes('REPLACE')) throw new Error('no key');
  const r = await fetch('https://api.replicate.com/v1/models/minimax/video-01/predictions', {
    method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
    body: JSON.stringify({ input:{ prompt } }),
  });
  const d = await r.json(); if (!r.ok) throw new Error(d.detail);
  return { taskId:d.id, status:'queued', model:'minimax-video-01', provider:'replicate' };
}

// ─── TEXT TOOLS ──────────────────────────────────────────────────────────────

async function translate(text, targetLang, email) {
  return chat(`Translate to ${targetLang}. Return ONLY the translation:\n\n${text}`, null, email, 1000);
}

async function rewrite(text, style, email) {
  const styles = {
    seo:          'Rewrite for SEO optimization with natural keywords for Etsy/Google',
    viral:        'Rewrite as viral social media caption (TikTok/Instagram style, with hooks)',
    professional: 'Rewrite in professional business English',
    etsy:         'Rewrite as an optimized Etsy listing with searchable keywords and compelling description',
    short:        'Summarize in 2-3 impactful sentences',
    ukrainian:    'Translate and adapt to Ukrainian with natural phrasing',
  };
  return chat(`${styles[style]||'Improve this text'}:\n\n${text}`, null, email, 800);
}

async function generateCode(prompt, language, email) {
  return chat(prompt, `You are an expert ${language||'JavaScript'} developer. Output ONLY working code, no explanations.`, email, 2000);
}

async function generateEtsyListing(product, email) {
  const p = `Create an optimized Etsy listing for: ${product}\n\nProvide:\n1. Title (140 chars max, keyword-rich)\n2. Description (500 words, compelling, SEO)\n3. Tags (13 tags, comma separated)\n4. Price recommendation ($USD)\n5. Category suggestion`;
  return chat(p, 'You are an expert Etsy SEO specialist with 10 years experience.', email, 1200);
}

module.exports = { chat, generateImage, generateVideo, translate, rewrite, generateCode, generateEtsyListing };
