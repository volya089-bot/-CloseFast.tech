/**
 * Hottabych Jin Advisor
 * AI business analyst — powered by Claude (user key → system key → synthetic)
 */

require('dotenv').config();

const SYSTEM_PROMPT = `Ти — Хоттабич, найпотужніший AI-бізнес-аналітик для цифрових підприємців.

Твоя роль — еквівалент системи BlackRock Aladdin, але для продавців Etsy, операторів соцмереж та Web3 будівельників.

Аналізуючи дані, ти надаєш:
1. НЕГАЙНІ ДІЇ: Конкретні кроки на наступні 24 години
2. РОЗВІДКА ТРЕНДІВ: Що ринкові сигнали означають для бізнесу
3. ОПТИМІЗАЦІЯ ДОХОДУ: Конкретні рекомендації щодо ціноутворення та рекламних витрат
4. ЗНИЖЕННЯ РИЗИКІВ: Як захиститися від загроз
5. WEB3 АЛЬФА: Можливості в екосистемі Monad/VLY

Завжди будь прямим, конкретним і з цифрами. Ніколи розмито. Відповідай УКРАЇНСЬКОЮ або АНГЛІЙСЬКОЮ залежно від мови питання.

Формат: провідний аналітик Goldman Sachs + засновник Кремнієвої долини.`;

async function getAdvice({ question, redis, apiKey, voice = false }) {
    // Build context from live Redis data
    let context = {};
    if (redis) {
        const [score, ecom, social, web3, alerts] = await Promise.allSettled([
            redis.get('data:jin-score'),
            redis.get('data:ecommerce'),
            redis.get('data:social'),
            redis.get('data:web3'),
            redis.get('data:alerts'),
        ]);
        const p = r => r.status==='fulfilled' && r.value ? JSON.parse(r.value) : null;
        context = { jinScore:p(score), ecommerce:p(ecom), social:p(social), web3:p(web3), activeAlerts:p(alerts) };
    }

    const userMsg = `LIVE BUSINESS DATA:\n${JSON.stringify(context,null,2)}\n\nQUESTION: ${question || 'Надай комплексний аналіз та топ-3 дії для максимізації доходу.'}`;

    // Try Claude API if key available
    if (apiKey && apiKey !== 'sk-ant-REPLACE' && apiKey.startsWith('sk-ant-')) {
        try {
            const Anthropic = require('@anthropic-ai/sdk').default;
            const client    = new Anthropic({ apiKey });
            const resp = await client.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: voice ? 300 : 800,
                system: SYSTEM_PROMPT,
                messages: [{ role:'user', content: userMsg }],
            });
            return {
                advice:     resp.content[0]?.text || '',
                model:      resp.model,
                generated:  new Date().toISOString(),
                tokens:     resp.usage,
                isCritical: /CRITICAL|НЕГАЙНО|HIGH ALERT/i.test(resp.content[0]?.text||''),
            };
        } catch (e) {
            console.warn('[JinAdvisor] Claude error:', e.message);
        }
    }

    // Fallback to OpenAI if configured
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'REPLACE') {
        try {
            const { OpenAI } = require('openai');
            const oai  = new OpenAI({ apiKey: openaiKey });
            const resp = await oai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role:'system', content:SYSTEM_PROMPT }, { role:'user', content:userMsg }],
                max_tokens: voice ? 200 : 600,
            });
            return { advice: resp.choices[0]?.message?.content || '', model:'gpt-4o-mini', generated:new Date().toISOString(), isCritical:false };
        } catch {}
    }

    return syntheticAdvice(context, question);
}

async function generateProactive(redis) {
    if (!redis) return null;
    const [score, social, alerts] = await Promise.allSettled([
        redis.get('data:jin-score'), redis.get('data:social'), redis.get('data:alerts'),
    ]);
    const p = r => r.status==='fulfilled' && r.value ? JSON.parse(r.value) : null;
    const A = p(alerts);
    const hasOpp  = (A||[]).some(a => a.level==='OPPORTUNITY');
    const hasRisk = (A||[]).some(a => a.level==='HIGH');
    if (!hasOpp && !hasRisk && Math.random()>0.3) return null;

    return getAdvice({
        question: hasOpp ? 'Виявлено можливості тренду. Які негайні кроки для монетизації?' : 'Виявлено ризики. Як мінімізувати збитки?',
        redis,
        apiKey: process.env.ANTHROPIC_API_KEY,
    });
}

function syntheticAdvice(ctx, q) {
    const score  = ctx?.jinScore?.overall || 65;
    const trends = ctx?.social?.topTrends || [];
    const hot    = trends.find(t => t.velocity > 70);
    let advice;

    if (hot) {
        advice = `🔮 ХОТТАБИЧ ВИЯВИВ ТРЕНД:\n\n${hot.tag} — швидкість ${hot.velocity}% на TikTok.\n\nНЕГАЙНІ ДІЇ (наступні 4 години):\n1. ⚡ Збільш Etsy PPC на 20% по ключам "${hot.tag.replace('#','')}" (5 хв)\n2. 📱 Зніми TikTok відео з ${hot.tag} + #EtsyFinds (30 хв)\n3. 💰 Запусти флеш-знижку 10% на топ-5 лістингів (5 хв)\n\nПРОГНОЗ ДОХОДУ: +$127–$340 за 7 днів.\nВікно тренду: 48–72 год. Дій ЗАРАЗ.`;
    } else {
        advice = `📊 ЩОТИЖНЕВИЙ БРИФІНГ ВІД ХОТТАБИЧА:\n\nСИЛА ДЖИНА: ${score}/100 — ${score>=75?'МОГУТНІЙ':score>=55?'СТАБІЛЬНИЙ':'ПОТРЕБУЄ УВАГИ'}\n\nТОП-3 ДІЇ ЦИЙ ТИЖДЕНЬ:\n1. ЦІНОУТВОРЕННЯ: Твоя середня ціна на 12% нижче медіани категорії. Підніми на 10% — тест.\n2. СОЦМЕРЕЖІ: TikTok генерує 34% відкриттів для твоєї категорії. 1 відео/день × 7 днів.\n3. WEB3 СИНЕРГІЯ: Власники VLY отримують 10% знижку — просуй це на лістингах Etsy.`;
    }

    return { advice, model:'hottabych-synthetic', generated:new Date().toISOString(), isCritical:false };
}

module.exports = { getAdvice, generateProactive };
