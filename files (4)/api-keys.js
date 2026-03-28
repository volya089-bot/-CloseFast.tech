// GET /api/keys?email=... — check which keys are set
// POST /api/keys — save user API keys
// DELETE /api/keys — clear user keys
const { verifySession, getUserKeys, saveUserKeys, getKey, isOwner } = require('../lib/db');

const ALL_KEYS = [
  // Free AI — text
  { key:'GROQ_API_KEY',         label:'Groq (LLaMA3 70B)',     category:'ai-text',  free:true,  url:'https://console.groq.com',             desc:'14K req/day free — best free LLM' },
  { key:'GEMINI_API_KEY',       label:'Google Gemini',          category:'ai-text',  free:true,  url:'https://aistudio.google.com',          desc:'1500 req/day free — multimodal' },
  { key:'MISTRAL_API_KEY',      label:'Mistral AI',             category:'ai-text',  free:true,  url:'https://console.mistral.ai',           desc:'Free tier — European AI' },
  { key:'TOGETHER_API_KEY',     label:'Together AI',            category:'ai-text',  free:true,  url:'https://api.together.ai',              desc:'$25 free credits on signup' },
  { key:'COHERE_API_KEY',       label:'Cohere',                 category:'ai-text',  free:true,  url:'https://dashboard.cohere.com',         desc:'1000 req/mo free' },
  { key:'HUGGINGFACE_API_KEY',  label:'Hugging Face',           category:'ai-image', free:true,  url:'https://huggingface.co/settings/tokens',desc:'FLUX images + LLMs free' },
  // Premium AI — text
  { key:'ANTHROPIC_API_KEY',    label:'Claude (Anthropic)',     category:'ai-text',  free:false, url:'https://console.anthropic.com',        desc:'Best quality — $5 free credits' },
  { key:'OPENAI_API_KEY',       label:'OpenAI (GPT-4o + DALL-E)',category:'ai-text', free:false, url:'https://platform.openai.com',          desc:'GPT-4o-mini + DALL-E 3 images' },
  // Images
  { key:'STABILITY_API_KEY',    label:'Stability AI (SDXL)',    category:'ai-image', free:false, url:'https://platform.stability.ai',        desc:'Stable Diffusion XL — $10 credits' },
  { key:'IDEOGRAM_API_KEY',     label:'Ideogram v2',            category:'ai-image', free:true,  url:'https://ideogram.ai/api',              desc:'Text-in-images — free credits' },
  // Video
  { key:'RUNWAY_API_KEY',       label:'Runway Gen-3',           category:'ai-video', free:false, url:'https://runwayml.com',                 desc:'Best AI video — $15/mo' },
  { key:'LUMA_API_KEY',         label:'Luma Dream Machine',     category:'ai-video', free:false, url:'https://lumalabs.ai',                  desc:'Realistic video — $30/mo' },
  { key:'KLING_API_KEY',        label:'Kling AI',               category:'ai-video', free:false, url:'https://klingai.com',                  desc:'Chinese video AI — competitive pricing' },
  { key:'REPLICATE_API_TOKEN',  label:'Replicate (MiniMax)',    category:'ai-video', free:true,  url:'https://replicate.com',               desc:'Pay-per-use video models' },
  { key:'PIKA_API_KEY',         label:'Pika 2.0',               category:'ai-video', free:false, url:'https://pika.art',                    desc:'Fast video generation' },
  // Business
  { key:'ETSY_API_KEY',         label:'Etsy API',               category:'business', free:true,  url:'https://www.etsy.com/developers',      desc:'Shop data + listings' },
  { key:'STRIPE_SECRET_KEY',    label:'Stripe',                 category:'business', free:false, url:'https://dashboard.stripe.com',         desc:'Payment processing' },
];

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Verify session
  let email = null;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    const { verifySession: vs } = require('../lib/db');
    const p = await vs(auth.slice(7));
    if (p) email = p.email;
  }
  const queryEmail = req.query.email;
  const targetEmail = email || queryEmail;

  if (!targetEmail) return res.status(401).json({ error: 'Authentication required' });

  if (req.method === 'GET') {
    const userKeys = await getUserKeys(targetEmail);
    const devMode = await isOwner(targetEmail);
    const status = {};
    for (const k of ALL_KEYS) {
      const hasUser = !!userKeys[k.key];
      const hasSystem = !!process.env[k.key];
      status[k.key] = {
        ...k,
        set:      hasUser,
        system:   hasSystem && !hasUser,
        source:   hasUser ? 'user' : hasSystem ? 'system' : 'none',
        value:    hasUser ? '••••••••' + (userKeys[k.key]||'').slice(-4) : '',
      };
    }
    return res.json({ keys: status, allKeys: ALL_KEYS, devMode, email: targetEmail });
  }

  if (req.method === 'POST') {
    const { keys } = req.body || {};
    if (!keys || typeof keys !== 'object') return res.status(400).json({ error: 'keys object required' });
    const saved = await saveUserKeys(targetEmail, keys);
    return res.json({ success: true, saved: Object.keys(saved).length });
  }

  if (req.method === 'DELETE') {
    const { key } = req.body || req.query;
    if (key) {
      const existing = await getUserKeys(targetEmail);
      delete existing[key];
      await saveUserKeys(targetEmail, existing);
    }
    return res.json({ success: true });
  }

  res.status(405).end();
};
