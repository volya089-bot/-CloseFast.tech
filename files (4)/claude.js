/**
 * POST /api/proxy/claude
 * Proxies requests to Anthropic Claude API
 * Falls back to Groq → Gemini if no Claude key
 */

const { generateText } = require('../../lib/ai-providers');
const { resolveKeys }  = require('../../lib/user-keys');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-api-key');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { model, max_tokens, system, messages, email } = req.body || {};
  const { merged: allKeys } = await resolveKeys(email);

  // Build prompt from messages
  const lastMsg = messages?.slice(-1)?.[0]?.content || '';

  try {
    const result = await generateText(lastMsg, {}, allKeys, {
      system:    system,
      maxTokens: max_tokens || 1024,
      model:     model,
      messages:  messages,
    });

    // Return in Anthropic-compatible format
    return res.json({
      id:    `cf-${Date.now()}`,
      type:  'message',
      role:  'assistant',
      model: result.model || 'auto',
      content: [{ type: 'text', text: result.text }],
      usage: result.tokens || { input_tokens: 0, output_tokens: 0 },
      provider: result.provider,
    });

  } catch (e) {
    return res.status(500).json({ error: { type: 'api_error', message: e.message } });
  }
};
