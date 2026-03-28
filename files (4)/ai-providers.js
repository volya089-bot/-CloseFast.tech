/**
 * CloseFast Omni — AI Providers Registry
 * Free + Paid tiers, Image / Video / Text / Code
 * Priority: User Key → System Free Key → No-key Free APIs
 */

// ── FREE APIs (no key needed) ─────────────────────────────────────────────────
const FREE_NO_KEY = {

  // Images — completely free, no signup
  pollinations: {
    name: 'Pollinations AI',
    type: 'image',
    free: true,
    noKey: true,
    generate: async (prompt, opts = {}) => {
      const w = opts.width  || 1024;
      const h = opts.height || 1024;
      const enc = encodeURIComponent(prompt);
      const seed = opts.seed || Math.floor(Math.random() * 99999);
      const model = opts.model || 'flux';  // flux | turbo | dreamshaper
      const url = `https://image.pollinations.ai/prompt/${enc}?width=${w}&height=${h}&seed=${seed}&model=${model}&nologo=true`;
      // Returns a direct image URL
      return { url, type: 'image_url', model: `pollinations-${model}`, free: true };
    },
  },

  // Text — Groq free tier (very fast LLaMA 3)
  groq_free: {
    name: 'Groq (Free)',
    type: 'text',
    free: true,
    noKey: false, // needs key but free signup
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
};

// ── FREE WITH SIGNUP (key from free account) ───────────────────────────────────
const FREE_WITH_KEY = {

  // ── TEXT / CODE ──────────────────────────────────────────────────────────────
  groq: {
    name: 'Groq',
    type: 'text',
    envKey: 'GROQ_API_KEY',
    signupUrl: 'https://console.groq.com',
    freeMonthly: 'Unlimited (rate limited)',
    models: {
      fast:    'llama-3.1-8b-instant',
      smart:   'llama-3.3-70b-versatile',
      code:    'llama-3.1-70b-versatile',
      default: 'llama-3.3-70b-versatile',
    },
    generate: async (prompt, key, opts = {}) => {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model:       opts.model || 'llama-3.3-70b-versatile',
          max_tokens:  opts.maxTokens || 1024,
          messages:    opts.messages  || [{ role: 'user', content: prompt }],
          temperature: opts.temperature || 0.7,
        }),
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      return { text: d.choices[0].message.content, model: d.model, provider: 'groq' };
    },
  },

  gemini: {
    name: 'Google Gemini',
    type: 'text',
    envKey: 'GEMINI_API_KEY',
    signupUrl: 'https://aistudio.google.com/apikey',
    freeMonthly: '15 RPM, 1M tokens/day free',
    models: { default: 'gemini-2.0-flash', vision: 'gemini-2.0-flash', pro: 'gemini-1.5-pro' },
    generate: async (prompt, key, opts = {}) => {
      const model = opts.model || 'gemini-2.0-flash';
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: opts.maxTokens || 1024, temperature: opts.temperature || 0.7 },
          }),
        }
      );
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      return { text: d.candidates[0].content.parts[0].text, model, provider: 'gemini' };
    },
  },

  cohere: {
    name: 'Cohere',
    type: 'text',
    envKey: 'COHERE_API_KEY',
    signupUrl: 'https://dashboard.cohere.com',
    freeMonthly: '1000 calls/month free',
    generate: async (prompt, key, opts = {}) => {
      const res = await fetch('https://api.cohere.com/v2/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: opts.model || 'command-r-plus',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: opts.maxTokens || 800,
        }),
      });
      const d = await res.json();
      return { text: d.message?.content?.[0]?.text || '', model: 'command-r-plus', provider: 'cohere' };
    },
  },

  mistral: {
    name: 'Mistral AI',
    type: 'text',
    envKey: 'MISTRAL_API_KEY',
    signupUrl: 'https://console.mistral.ai',
    freeMonthly: 'Free tier available',
    generate: async (prompt, key, opts = {}) => {
      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model:    opts.model || 'mistral-small-latest',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: opts.maxTokens || 1024,
        }),
      });
      const d = await res.json();
      return { text: d.choices[0].message.content, model: d.model, provider: 'mistral' };
    },
  },

  together: {
    name: 'Together AI',
    type: 'text+image',
    envKey: 'TOGETHER_API_KEY',
    signupUrl: 'https://together.ai',
    freeMonthly: '$25 free credits on signup',
    generate: async (prompt, key, opts = {}) => {
      const res = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model:    opts.model || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: opts.maxTokens || 1024,
        }),
      });
      const d = await res.json();
      return { text: d.choices[0].message.content, model: d.model, provider: 'together' };
    },
  },

  openrouter: {
    name: 'OpenRouter',
    type: 'text',
    envKey: 'OPENROUTER_API_KEY',
    signupUrl: 'https://openrouter.ai',
    freeMonthly: 'Free models: DeepSeek R1, Qwen, Gemma, Phi',
    freeModels: ['deepseek/deepseek-r1:free','google/gemma-3-27b-it:free','meta-llama/llama-4-maverick:free'],
    generate: async (prompt, key, opts = {}) => {
      const model = opts.model || 'deepseek/deepseek-r1:free';
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'HTTP-Referer': 'https://closefast.tech',
          'X-Title': 'CloseFast Omni',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: opts.maxTokens || 1024,
        }),
      });
      const d = await res.json();
      return { text: d.choices[0].message.content, model: d.model, provider: 'openrouter' };
    },
  },

  // ── IMAGES ───────────────────────────────────────────────────────────────────
  huggingface: {
    name: 'Hugging Face',
    type: 'image',
    envKey: 'HF_API_KEY',
    signupUrl: 'https://huggingface.co/settings/tokens',
    freeMonthly: 'Free inference API (rate limited)',
    models: {
      flux:      'black-forest-labs/FLUX.1-schnell',
      fluxDev:   'black-forest-labs/FLUX.1-dev',
      sdxl:      'stabilityai/stable-diffusion-xl-base-1.0',
      anime:     'hakurei/waifu-diffusion',
      realistic: 'SG161222/Realistic_Vision_V6.0_B1_noVAE',
    },
    generate: async (prompt, key, opts = {}) => {
      const model = opts.model || 'black-forest-labs/FLUX.1-schnell';
      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width:               opts.width  || 1024,
            height:              opts.height || 1024,
            num_inference_steps: opts.steps  || 4,
            guidance_scale:      opts.cfg    || 3.5,
          },
        }),
      });
      if (!res.ok) throw new Error(`HF error: ${res.status}`);
      const blob = await res.arrayBuffer();
      const b64  = Buffer.from(blob).toString('base64');
      return { b64, mimeType: 'image/jpeg', model, provider: 'huggingface' };
    },
  },

  stabilityai: {
    name: 'Stability AI',
    type: 'image',
    envKey: 'STABILITY_API_KEY',
    signupUrl: 'https://platform.stability.ai',
    freeMonthly: '25 free credits on signup',
    generate: async (prompt, key, opts = {}) => {
      const res = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: 'application/json',
        },
        body: (() => {
          const form = new FormData();
          form.append('prompt', prompt);
          form.append('output_format', 'jpeg');
          if (opts.width)  form.append('width',  String(opts.width));
          if (opts.height) form.append('height', String(opts.height));
          return form;
        })(),
      });
      const d = await res.json();
      if (d.errors) throw new Error(d.errors.join(', '));
      return { b64: d.image, mimeType: 'image/jpeg', model: 'stable-image-core', provider: 'stability' };
    },
  },

  replicate: {
    name: 'Replicate',
    type: 'image+video',
    envKey: 'REPLICATE_API_TOKEN',
    signupUrl: 'https://replicate.com',
    freeMonthly: 'Pay per use (~$0.003/image)',
    models: {
      flux:    'black-forest-labs/flux-schnell',
      video:   'minimax/video-01',
      animate: 'lucataco/animate-diff',
    },
    generate: async (prompt, key, opts = {}) => {
      const model = opts.model || 'black-forest-labs/flux-schnell';
      const initRes = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: { prompt, width: opts.width||1024, height: opts.height||1024, num_outputs: 1 } }),
      });
      const init = await initRes.json();
      // Poll for result
      let prediction = init;
      for (let i = 0; i < 30; i++) {
        if (['succeeded','failed','canceled'].includes(prediction.status)) break;
        await new Promise(r => setTimeout(r, 1000));
        const poll = await fetch(prediction.urls.get, { headers: { Authorization: `Bearer ${key}` } });
        prediction = await poll.json();
      }
      if (prediction.status !== 'succeeded') throw new Error('Replicate generation failed');
      return { url: prediction.output?.[0] || prediction.output, model, provider: 'replicate' };
    },
  },

  // ── VIDEO ─────────────────────────────────────────────────────────────────────
  runway: {
    name: 'Runway ML',
    type: 'video',
    envKey: 'RUNWAY_API_KEY',
    signupUrl: 'https://app.runwayml.com',
    freeMonthly: '125 credits/month free',
  },

  kling: {
    name: 'Kling AI',
    type: 'video',
    envKey: 'KLING_API_KEY',
    signupUrl: 'https://klingai.com',
    freeMonthly: '66 free credits/day',
  },

  luma: {
    name: 'Luma AI (Dream Machine)',
    type: 'video',
    envKey: 'LUMA_API_KEY',
    signupUrl: 'https://lumalabs.ai',
    freeMonthly: '30 free generations/month',
    generate: async (prompt, key, opts = {}) => {
      const res = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspect_ratio: opts.aspectRatio || '16:9', loop: false }),
      });
      const d = await res.json();
      return { generationId: d.id, provider: 'luma', status: 'pending' };
    },
  },
};

// ── PAID PROVIDERS ─────────────────────────────────────────────────────────────
const PAID = {
  anthropic: { name: 'Anthropic Claude', type: 'text', envKey: 'ANTHROPIC_API_KEY' },
  openai:    { name: 'OpenAI GPT-4',     type: 'text+image', envKey: 'OPENAI_API_KEY' },
  ideogram:  { name: 'Ideogram',         type: 'image', envKey: 'IDEOGRAM_API_KEY', note: 'Best for text-in-image' },
  pika:      { name: 'Pika Labs',        type: 'video', envKey: 'PIKA_API_KEY' },
};

// ── SMART ROUTER ──────────────────────────────────────────────────────────────
// Tries providers in priority order, falls back gracefully
async function generateText(prompt, userKeys = {}, systemKeys = {}, opts = {}) {
  const order = ['anthropic','groq','gemini','mistral','cohere','openrouter','together'];
  
  for (const provider of order) {
    const key = userKeys[PAID.anthropic?.envKey] ||
                userKeys[FREE_WITH_KEY[provider]?.envKey] ||
                systemKeys[FREE_WITH_KEY[provider]?.envKey] ||
                systemKeys[PAID[provider]?.envKey];
    
    if (!key) continue;
    
    try {
      if (provider === 'anthropic' && key.startsWith('sk-ant-')) {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const client = new Anthropic({ apiKey: key });
        const r = await client.messages.create({
          model: 'claude-sonnet-4-20250514', max_tokens: opts.maxTokens || 1024,
          system: opts.system || 'You are a helpful AI assistant for CloseFast Omni.',
          messages: [{ role: 'user', content: prompt }],
        });
        return { text: r.content[0].text, model: r.model, provider: 'anthropic' };
      }
      
      if (FREE_WITH_KEY[provider]?.generate) {
        return await FREE_WITH_KEY[provider].generate(prompt, key, opts);
      }
    } catch (e) {
      console.warn(`[AI Router] ${provider} failed:`, e.message);
      continue;
    }
  }
  
  // Last resort: Pollinations (no key needed) for short text via image
  return { text: 'AI service unavailable. Please add an API key in Settings.', provider: 'fallback' };
}

async function generateImage(prompt, userKeys = {}, systemKeys = {}, opts = {}) {
  // Always try Pollinations first (free, no key)
  if (!opts.skipFree) {
    try {
      return await FREE_NO_KEY.pollinations.generate(prompt, opts);
    } catch (e) {}
  }

  const order = ['openai','huggingface','stabilityai','replicate','together'];
  
  for (const provider of order) {
    const envKey = FREE_WITH_KEY[provider]?.envKey || PAID[provider]?.envKey;
    const key = userKeys[envKey] || systemKeys[envKey];
    if (!key) continue;
    
    try {
      if (FREE_WITH_KEY[provider]?.generate) {
        return await FREE_WITH_KEY[provider].generate(prompt, key, opts);
      }
      // OpenAI DALL-E 3
      if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: opts.size || '1024x1024', quality: 'standard' }),
        });
        const d = await res.json();
        return { url: d.data[0].url, model: 'dall-e-3', provider: 'openai' };
      }
    } catch (e) {
      console.warn(`[Image Router] ${provider} failed:`, e.message);
    }
  }
  
  // Final fallback
  return await FREE_NO_KEY.pollinations.generate(prompt, opts);
}

// Get all available providers with their status
function getProviderCatalog() {
  const catalog = [];
  
  Object.entries(FREE_WITH_KEY).forEach(([id, p]) => {
    catalog.push({ id, ...p, tier: 'free', category: p.type });
  });
  Object.entries(PAID).forEach(([id, p]) => {
    catalog.push({ id, ...p, tier: 'paid', category: p.type });
  });
  catalog.push({ id: 'pollinations', ...FREE_NO_KEY.pollinations, tier: 'free_no_key', category: 'image' });
  
  return catalog;
}

module.exports = { generateText, generateImage, getProviderCatalog, FREE_WITH_KEY, FREE_NO_KEY, PAID };
