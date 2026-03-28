/**
 * /api/keys — User API Key Management
 * GET    ?email=  → key status
 * POST            → save keys
 * DELETE          → remove keys
 */

const { saveKeys, getKeyStatus, deleteKeys, ALL_KEY_NAMES } = require('../../lib/user-keys');
const { getProviderCatalog } = require('../../lib/ai-providers');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Provider metadata with descriptions and signup links
const PROVIDER_INFO = {
  ANTHROPIC_API_KEY:   { label:'Claude AI',         type:'text',  tier:'paid',       signup:'https://console.anthropic.com',       note:'Best quality. $5 free credit.' },
  OPENAI_API_KEY:      { label:'OpenAI (GPT+DALL·E)',type:'text+image',tier:'paid',   signup:'https://platform.openai.com/api-keys', note:'$5 free credit on signup.' },
  GROQ_API_KEY:        { label:'Groq (LLaMA 3 Fast)',type:'text',  tier:'free',       signup:'https://console.groq.com',            note:'FREE — unlimited with rate limit.' },
  GEMINI_API_KEY:      { label:'Google Gemini',      type:'text',  tier:'free',       signup:'https://aistudio.google.com/apikey',  note:'FREE — 1M tokens/day.' },
  MISTRAL_API_KEY:     { label:'Mistral AI',         type:'text',  tier:'free',       signup:'https://console.mistral.ai',          note:'FREE tier available.' },
  COHERE_API_KEY:      { label:'Cohere',             type:'text',  tier:'free',       signup:'https://dashboard.cohere.com',        note:'FREE — 1000 calls/month.' },
  TOGETHER_API_KEY:    { label:'Together AI',        type:'text+image',tier:'free',   signup:'https://together.ai',                 note:'$25 FREE credits on signup.' },
  OPENROUTER_API_KEY:  { label:'OpenRouter',         type:'text',  tier:'free',       signup:'https://openrouter.ai',               note:'FREE models: DeepSeek R1, Gemma.' },
  HF_API_KEY:          { label:'HuggingFace (FLUX)', type:'image', tier:'free',       signup:'https://huggingface.co/settings/tokens',note:'FREE — FLUX, SDXL, Stable Diffusion.' },
  STABILITY_API_KEY:   { label:'Stability AI',       type:'image', tier:'free',       signup:'https://platform.stability.ai',       note:'25 FREE credits on signup.' },
  IDEOGRAM_API_KEY:    { label:'Ideogram',           type:'image', tier:'paid',       signup:'https://ideogram.ai',                 note:'Best for text-in-images. Free trial.' },
  REPLICATE_API_TOKEN: { label:'Replicate',          type:'image+video',tier:'paid',  signup:'https://replicate.com',               note:'$0.003/image. Video models available.' },
  RUNWAY_API_KEY:      { label:'Runway Gen-3',       type:'video', tier:'free',       signup:'https://app.runwayml.com',            note:'125 FREE credits/month.' },
  KLING_API_KEY:       { label:'Kling AI',           type:'video', tier:'free',       signup:'https://klingai.com',                 note:'66 FREE credits/day.' },
  LUMA_API_KEY:        { label:'Luma Dream Machine', type:'video', tier:'free',       signup:'https://lumalabs.ai',                 note:'30 FREE video generations/month.' },
  PIKA_API_KEY:        { label:'Pika Labs',          type:'video', tier:'paid',       signup:'https://pika.art',                    note:'Fast video generation.' },
  ETSY_API_KEY:        { label:'Etsy API',           type:'ecommerce',tier:'free',    signup:'https://www.etsy.com/developers',      note:'FREE. Required for shop automation.' },
  SHOPIFY_API:         { label:'Shopify Admin API',  type:'ecommerce',tier:'paid',    signup:'https://shopify.com/admin/settings/apps',note:'Shopify Partner account needed.' },
  PRINTIFY_API_TOKEN:  { label:'Printify',           type:'ecommerce',tier:'free',    signup:'https://printify.com/app/settings',    note:'FREE with account.' },
  X_BEARER_TOKEN:      { label:'X/Twitter Bearer',  type:'social', tier:'free',      signup:'https://developer.x.com',             note:'FREE Basic tier.' },
  TIKTOK_CLIENT_KEY:   { label:'TikTok Research API',type:'social', tier:'free',     signup:'https://developers.tiktok.com',        note:'FREE — requires app approval.' },
  STRIPE_SECRET_KEY:   { label:'Stripe Secret Key',  type:'payment',tier:'free',     signup:'https://dashboard.stripe.com/apikeys', note:'FREE — live payments require verification.' },
  SERP_API:            { label:'SERP API',           type:'seo',   tier:'free',       signup:'https://serpapi.com',                  note:'100 FREE searches/month.' },
  ALCHEMY_WEB3:        { label:'Alchemy (Web3)',     type:'web3',  tier:'free',       signup:'https://alchemy.com',                  note:'FREE tier for blockchain data.' },
};

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET — key status for user
  if (req.method === 'GET') {
    const email = req.query.email;
    if (!email) {
      // Return full provider catalog with signup info
      return res.json({
        providers: Object.entries(PROVIDER_INFO).map(([k, v]) => ({ envKey: k, ...v })),
        freeProviders: Object.entries(PROVIDER_INFO).filter(([,v]) => v.tier === 'free').map(([k,v]) => ({ envKey:k, ...v })),
      });
    }

    const status = await getKeyStatus(email);
    const enriched = Object.entries(status).map(([k, state]) => ({
      envKey: k,
      ...PROVIDER_INFO[k],
      status: state,    // 'user' | 'system' | 'none'
    }));

    return res.json({
      email,
      keys: enriched,
      summary: {
        user:   enriched.filter(k => k.status === 'user').length,
        system: enriched.filter(k => k.status === 'system').length,
        none:   enriched.filter(k => k.status === 'none').length,
      },
    });
  }

  // POST — save user keys
  if (req.method === 'POST') {
    const { email, keys } = req.body || {};
    if (!email || !keys) return res.status(400).json({ error: 'email and keys required' });

    const result = await saveKeys(email, keys);
    return res.json({ success: true, ...result, email });
  }

  // DELETE — remove keys
  if (req.method === 'DELETE') {
    const { email, keyNames } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email required' });
    await deleteKeys(email, keyNames);
    return res.json({ success: true, deleted: keyNames || 'all', email });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
