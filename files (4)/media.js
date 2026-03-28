/**
 * POST /api/proxy/media
 * Unified media generation: image | video
 * Routes to best available provider automatically
 */

const { generateImage } = require('../../lib/ai-providers');
const { resolveKeys }   = require('../../lib/user-keys');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const {
    prompt, type = 'image', email,
    model, width = 1024, height = 1024,
    style, negativePrompt, steps,
  } = req.body || {};

  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const { merged: allKeys } = await resolveKeys(email);

  try {
    if (type === 'image') {
      // Enhance prompt for product/Etsy context
      const enhancedPrompt = style
        ? `${prompt}, ${style} style, professional product photography, clean background, high quality`
        : prompt;

      const result = await generateImage(enhancedPrompt, {}, allKeys, {
        width, height, steps: steps || 4, model,
        negativePrompt: negativePrompt || 'blurry, low quality, watermark',
      });

      // If b64, send as data URL
      if (result.b64) {
        result.dataUrl = `data:${result.mimeType || 'image/jpeg'};base64,${result.b64}`;
      }

      return res.json({ success: true, type: 'image', ...result });

    } else if (type === 'video') {
      // Async video — return job ID to poll
      const lumaKey = allKeys['LUMA_API_KEY'];
      const klingKey = allKeys['KLING_API_KEY'];

      if (lumaKey) {
        const res2 = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
          method: 'POST',
          headers: { Authorization: `Bearer ${lumaKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspect_ratio: '16:9', loop: false }),
        });
        const d = await res2.json();
        return res.json({ success: true, type: 'video', provider: 'luma', jobId: d.id, status: 'processing', message: 'Video is generating. Poll /api/proxy/media/status?id='+d.id });
      }

      return res.json({ 
        success: false, 
        error: 'Video requires Luma, Kling, or Runway API key.',
        hint: 'Add LUMA_API_KEY in Settings — 30 free videos/month',
        freeSignup: 'https://lumalabs.ai'
      });
    }

  } catch (e) {
    // Always fallback to Pollinations for images
    if (type === 'image') {
      const enc   = encodeURIComponent(prompt);
      const seed  = Math.floor(Math.random() * 99999);
      const url   = `https://image.pollinations.ai/prompt/${enc}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;
      return res.json({ success: true, type: 'image', url, provider: 'pollinations', free: true, note: 'Using free Pollinations.ai fallback' });
    }
    return res.status(500).json({ error: e.message });
  }
};
