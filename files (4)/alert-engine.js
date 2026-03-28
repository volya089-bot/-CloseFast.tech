/**
 * Hottabych Alert Engine — Jin Alerts
 * Real-time risk and opportunity detection
 */

const THRESHOLDS = {
    revenueDropPct:   -15,
    liquidityMinUSD:   5000,
    trendVelocityMin:  75,
};

async function check(redis, score) {
    const alerts = [];
    const now    = Date.now();
    if (!redis) return alerts;

    try {
        const [prev, curr, social, web3] = await Promise.allSettled([
            redis.get('data:ecommerce:prev'),
            redis.get('data:ecommerce'),
            redis.get('data:social'),
            redis.get('data:web3'),
        ]);
        const p = r => r.status==='fulfilled' && r.value ? JSON.parse(r.value) : null;
        const P=p(prev), E=p(curr), S=p(social), W=p(web3);

        // Revenue drop
        if (P && E && P.revenue30d > 0) {
            const chg = ((E.revenue30d - P.revenue30d) / P.revenue30d) * 100;
            if (chg < THRESHOLDS.revenueDropPct) {
                alerts.push({ id:`rev-${now}`, level:'HIGH', category:'E-Commerce',
                    title:'⚠️ Падіння доходу', ts:now,
                    message:`Дохід Etsy впав на ${chg.toFixed(1)}% відносно попереднього periodу`,
                    action:'Перевірте ціноутворення, SEO лістингів та рекламний бюджет' });
            }
            await redis.setex('data:ecommerce:prev', 3600, JSON.stringify(E));
        } else if (E) {
            await redis.setex('data:ecommerce:prev', 3600, JSON.stringify(E));
        }

        // Trend opportunities
        if (S?.topTrends) {
            const hot = S.topTrends.filter(t => (t.velocity||0) > THRESHOLDS.trendVelocityMin);
            hot.forEach(t => alerts.push({
                id:`trend-${t.tag}-${now}`, level:'OPPORTUNITY', category:'Соцмережі',
                title:`🚀 Тренд: ${t.tag}`, ts:now,
                message:`${t.tag} показує ${t.velocity}% швидкість — відповідає вашій категорії`,
                action:`Збільшіть Etsy PPC на 20% · Опублікуйте TikTok з ${t.tag} зараз`,
            }));
        }

        // VLY liquidity
        if (W?.vly?.liquidity) {
            const liq = W.vly.liquidity.totalUSD || 0;
            if (liq < THRESHOLDS.liquidityMinUSD) {
                alerts.push({ id:`vly-${now}`, level:'HIGH', category:'Web3',
                    title:'🔴 Низька ліквідність VLY', ts:now,
                    message:`Пул VLY/MON: $${liq} — нижче порогу $${THRESHOLDS.liquidityMinUSD}`,
                    action:'Додайте ліквідність до PancakeSwap або сповістіть спільноту VLY' });
            }
        }

        // Jin score drop
        const prevS = await redis.get('jin-score:prev').catch(() => null);
        if (prevS && score?.overall) {
            const drop = JSON.parse(prevS).overall - score.overall;
            if (drop > 10) {
                alerts.push({ id:`score-${now}`, level:'MEDIUM', category:'Сила Джина',
                    title:`📉 Сила Джина -${drop} пт`, ts:now,
                    message:`Здоров'я бізнесу знизилося з ${JSON.parse(prevS).overall} до ${score.overall}`,
                    action:'Перевірте найслабший компонент: ' + getLowest(score.components) });
            }
        }
        if (score?.overall) await redis.setex('jin-score:prev', 3600, JSON.stringify(score));

    } catch (e) { console.error('[Alerts]', e.message); }

    return alerts.slice(0, 20);
}

function getLowest(c) {
    if (!c) return '—';
    return Object.entries(c).sort(([,a],[,b]) => a-b)[0]?.[0] || '—';
}

module.exports = { check };
