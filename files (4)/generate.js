/**
 * POST /api/ai/generate
 * Universal AI generation: text | image | video | code
 * User keys take priority over system keys
 */

const { generateText, generateImage, getProviderCatalog } = require('../../lib/ai-providers');
const { resolveKeys } = require('../../lib/user-keys');

// Dev/owner emails — always have full access
const DEV_EMAILS = (process.env.DEV_EMAILS || 'volya089@gmail.com,slavikbobnar1981@gmail.com')
  .split(',').map(e => e.trim().toLowerCase());

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET → return provider catalog
  if (req.method === 'GET') {
    return res.json({ providers: getProviderCatalog() });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    type    = 'text',   // text | image | video | code
    prompt,
    email,
    provider,           // optional: force specific provider
    model,              // optional: force specific model
    options = {},       // width, height, steps, maxTokens, etc.
    system,             // system prompt for text
  } = req.body || {};

  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const isDev = DEV_EMAILS.includes((email || '').toLowerCase());

  // Resolve keys: user keys → system env keys
  const { merged: allKeys, hasUserKeys } = await resolveKeys(email);

  try {
    let result;

    if (type === 'image') {
      result = await generateImage(prompt, {}, allKeys, {
        ...options,
        model: model || options.model,
        skipFree: false,
      });

      // If result has b64, convert to data URL
      if (result.b64) {
        result.dataUrl = `data:${result.mimeType || 'image/jpeg'};base64,${result.b64}`;
        delete result.b64; // don't send raw base64 in JSON if URL is available
      }

    } else if (type === 'video') {
      // Video: Luma, Replicate, Kling — async jobs
      const lumaKey = allKeys['LUMA_API_KEY'];
      if (lumaKey) {
        const { FREE_WITH_KEY } = require('../../lib/ai-providers');
        result = await FREE_WITH_KEY.luma.generate(prompt, lumaKey, options);
      } else {
        result = { error: 'Video generation requires LUMA_API_KEY, KLING_API_KEY, or RUNWAY_API_KEY', hint: 'Add in Settings → API Keys' };
      }

    } else {
      // text | code
      const sysPrompt = type === 'code'
        ? 'You are an expert programmer. Provide clean, working code with explanations.'
        : (system || 'You are a helpful AI assistant for CloseFast Omni, an AI business platform.');

      result = await generateText(prompt, {}, allKeys, {
        maxTokens: options.maxTokens || (type === 'code' ? 2048 : 1024),
        system:    sysPrompt,
        model:     model || options.model,
      });
    }

    return res.json({
      success:     true,
      type,
      result,
      provider:    result.provider || 'unknown',
      model:       result.model    || model || 'auto',
      hasUserKeys,
      isDev,
      generated:   new Date().toISOString(),
    });

  } catch (e) {
    console.error('[AI Generate]', e.message);
    return res.status(500).json({
      error:    e.message,
      hint:     'Check your API keys in Settings. Free providers: Groq, Gemini, HuggingFace.',
      providers: getProviderCatalog().filter(p => p.tier !== 'paid').map(p => p.name),
    });
  }
};
