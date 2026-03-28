/**
 * JIN SCORING ENGINE — "Сила Джина" (Jin Power)
 * Replaces OmniScore · Hottabych-branded metric
 */

const WEIGHTS = { ecommerce:0.35, social:0.25, web3:0.20, competitors:0.20 };

async function compute(redis) {
    const [e,s,w,c] = await Promise.allSettled([
        redis?.get('data:ecommerce'),  redis?.get('data:social'),
        redis?.get('data:web3'),       redis?.get('data:competitors'),
    ]);
    const p = r => r.status==='fulfilled' && r.value ? JSON.parse(r.value) : null;
    const E=p(e), S=p(s), W=p(w), C=p(c);

    let eScore=50, sScore=50, wScore=50, cScore=50;
    if(E){ eScore = Math.min(100, (E.revenue30d||0)/20 * 0.4 + (E.orders30d||0)*2.5 * 0.3 + (E.healthScore||50) * 0.3); }
    if(S){ sScore = Math.min(100, (S.velocity||50)*0.6 + (S.topTrends||[]).filter(t=>(t.velocity||0)>60).length*8); }
    if(W?.vly){ wScore = Math.min(100, ((W.vly.liquidity?.totalUSD||0)/1000)*0.5 + (W.vly.priceUSD>0.001?60:40)*0.5); }
    if(C?.competitors){ const avg=C.competitors.reduce((s,c)=>s+(c.threatLevel||30),0)/C.competitors.length; cScore=Math.max(0,100-avg); }

    const overall = Math.round(eScore*WEIGHTS.ecommerce + sScore*WEIGHTS.social + wScore*WEIGHTS.web3 + cScore*WEIGHTS.competitors);

    const risks=[];
    if(eScore<40)  risks.push({level:'HIGH',    area:'E-Commerce', msg:'Дохід нижче цільового — перегляньте цінову стратегію'});
    if(sScore>75)  risks.push({level:'OPPORTUNITY',area:'Social',  msg:'Висока активність тренду — збільшіть рекламний бюджет'});
    if(wScore<30)  risks.push({level:'HIGH',    area:'Web3',       msg:'Низька ліквідність VLY — ризик прослизання ціни'});
    if(overall>75) risks.push({level:'POSITIVE',area:'Загальне',   msg:'Сильна Сила Джина — можна масштабувати операції'});

    const trendMul = sScore>70 ? 1.15 : sScore>50 ? 1.05 : 0.97;
    return {
        overall,
        jinPower: overall, // alias for "Сила Джина"
        grade: overall>=80?'A':overall>=65?'B':overall>=50?'C':overall>=35?'D':'F',
        label: overall>=80?'МОГУТНІЙ':overall>=65?'СИЛЬНИЙ':overall>=50?'СТАБІЛЬНИЙ':'СЛАБКИЙ',
        components: { ecommerce:Math.round(eScore), social:Math.round(sScore), web3:Math.round(wScore), competitors:Math.round(cScore) },
        weights: WEIGHTS,
        risks,
        forecast: { revenue30d: E ? Math.round(E.revenue30d*trendMul*1.1) : null, confidence: sScore>60?'HIGH':'MEDIUM', trendFactor: trendMul },
        computed: new Date().toISOString(),
    };
}

module.exports = { compute };
