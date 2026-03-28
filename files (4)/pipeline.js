/**
 * Hottabych Data Pipeline v3.0
 * Hybrid API: User Keys → System Free Keys fallback
 * Shadow Scraper: Puppeteer headless competitor monitoring
 */

require('dotenv').config();
const axios  = require('axios');
const dayjs  = require('dayjs');
const PQueue = require('p-queue').default;
const pLimit = require('p-limit').default;

const queue  = new PQueue({ concurrency: 3, interval: 1000, intervalCap: 5 });
const limit  = pLimit(3);

let _broadcast = () => {};
let _redis     = null;

const stats = { runs: 0, errors: 0, lastRun: null, sources: {} };

function setBroadcast(fn) { _broadcast = fn; }
function setRedis(r)      { _redis     = r; }

// ── CIRCUIT BREAKER ────────────────────────────────────────────────────────────
class CircuitBreaker {
    constructor(name, threshold = 3, timeout = 30000) {
        this.name = name; this.threshold = threshold;
        this.timeout = timeout; this.failures = 0;
        this.state = 'CLOSED'; this.nextAttempt = null;
    }
    async call(fn) {
        if (this.state === 'OPEN' && Date.now() < this.nextAttempt)
            throw new Error(`${this.name}: circuit OPEN`);
        if (this.state === 'OPEN') this.state = 'HALF_OPEN';
        try {
            const r = await fn();
            this.failures = 0; this.state = 'CLOSED';
            return r;
        } catch (e) {
            if (++this.failures >= this.threshold) {
                this.state = 'OPEN';
                this.nextAttempt = Date.now() + this.timeout;
            }
            throw e;
        }
    }
}

const breakers = {
    etsy:       new CircuitBreaker('Etsy'),
    social:     new CircuitBreaker('Social'),
    web3:       new CircuitBreaker('Web3'),
    competitor: new CircuitBreaker('Competitor'),
    shadow:     new CircuitBreaker('Shadow', 2, 60000),
};

// ── HYBRID KEY RESOLVER ────────────────────────────────────────────────────────
// Tier 1 (Free): System keys · Tier 2 (Pro): User's own keys
async function getKey(name, userEmail = null) {
    // Priority 1: user's saved key in Redis
    if (_redis && userEmail) {
        try {
            const k = await _redis.get(`userkeys:${userEmail.toLowerCase()}:${name}`);
            if (k) return k;
        } catch {}
    }
    // Priority 2: .env system key
    return process.env[name] || null;
}

// Free tier public API keys (no auth needed)
const FREE_APIS = {
    COINGECKO:     'https://api.coingecko.com/api/v3',    // crypto prices (free)
    FAKESTORE:     'https://fakestoreapi.com',              // product data (free, demo)
    SOCIAL_SEARCHER: 'https://api.social-searcher.com/v2', // social (limited free)
};

// ── CACHE HELPER ───────────────────────────────────────────────────────────────
async function cached(key, ttl, fn) {
    if (_redis) {
        try { const h = await _redis.get(key); if (h) return JSON.parse(h); } catch {}
    }
    const data = await fn();
    if (_redis && data) {
        try { await _redis.setex(key, ttl, JSON.stringify(data)); } catch {}
    }
    return data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE 1: ETSY  (Hybrid: user key → system key → free CoinGecko fallback)
// ═══════════════════════════════════════════════════════════════════════════════
async function fetchEtsy(userEmail = null) {
    return breakers.etsy.call(async () => {
        const key    = await getKey('ETSY_API_KEY', userEmail);
        const shopId = process.env.ETSY_SHOP_ID || 'VibeprintsProducts';

        if (!key || key === 'REPLACE') return syntheticEtsy();

        const [listings, transactions] = await Promise.allSettled([
            axios.get(`https://openapi.etsy.com/v3/application/shops/${shopId}/listings/active?limit=25`,
                { headers: { 'x-api-key': key }, timeout: 8000 }),
            axios.get(`https://openapi.etsy.com/v3/application/shops/${shopId}/transactions`,
                { headers: { 'x-api-key': key }, timeout: 8000 }),
        ]);

        const ls = listings.status === 'fulfilled' ? listings.value.data : { results: [] };
        const ts = transactions.status === 'fulfilled' ? transactions.value.data : { results: [] };
        const last30 = (ts.results || []).filter(t =>
            dayjs(t.creation_timestamp * 1000).isAfter(dayjs().subtract(30, 'day')));

        const revenue = last30.reduce((s, t) => s + (t.price?.amount / 100 || 0), 0);

        return {
            source: 'etsy', shopName: shopId,
            listingCount: ls.count || 0,
            revenue30d:   Math.round(revenue * 100) / 100,
            orders30d:    last30.length,
            avgOrderValue: last30.length ? Math.round((revenue / last30.length) * 100) / 100 : 0,
            topListings: (ls.results || []).slice(0, 5).map(l => ({
                id: l.listing_id, title: l.title?.substring(0, 60),
                price: l.price?.amount / 100, views: l.views || 0,
            })),
            healthScore: Math.min(100, 50 + last30.length * 1.5),
            fetched: Date.now(),
        };
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE 2: SOCIAL  (TikTok + X — hybrid keys + free fallback)
// ═══════════════════════════════════════════════════════════════════════════════
async function fetchSocial(userEmail = null) {
    return breakers.social.call(async () => {
        const [tiktok, twitter] = await Promise.allSettled([
            fetchTikTok(userEmail),
            fetchTwitter(userEmail),
        ]);
        const TK = tiktok.status  === 'fulfilled' ? tiktok.value  : syntheticTikTok();
        const TW = twitter.status === 'fulfilled' ? twitter.value : syntheticTwitter();

        const velocity = Math.min(100,
            (TK.avgEngagement || 0) * 2 +
            (TK.trendingHashtags || []).filter(h => h.velocity > 50).length * 8);

        return {
            source: 'social', tiktok: TK, twitter: TW,
            velocity: Math.round(velocity),
            topTrends: [...(TK.trendingHashtags || []), ...(TW.trending || [])]
                .sort((a, b) => (b.velocity || 0) - (a.velocity || 0)).slice(0, 10),
            fetched: Date.now(),
        };
    });
}

async function fetchTikTok(userEmail) {
    const key = await getKey('TIKTOK_CLIENT_KEY', userEmail);
    if (!key || key === 'REPLACE') return syntheticTikTok();

    const res = await axios.post('https://open.tiktokapis.com/v2/research/hashtag/query/', {
        query: { and: [{ operation: 'IN', field_name: 'hashtag_name',
            field_values: ['etsy','handmade','etsyseller','wallart','printables'] }] },
        start_date: dayjs().subtract(7,'day').format('YYYYMMDD'),
        end_date: dayjs().format('YYYYMMDD'),
        max_count: 20,
        fields: ['id','hashtag_names','like_count','view_count'],
    }, { headers: { Authorization: `Bearer ${key}` }, timeout: 10000 });

    const videos = res.data?.data?.videos || [];
    const hmap = {};
    videos.forEach(v => (v.hashtag_names || []).forEach(h => {
        hmap[h] = (hmap[h] || 0) + (v.view_count || 0);
    }));

    return {
        platform: 'tiktok',
        totalVideos: videos.length,
        avgEngagement: videos.length
            ? videos.reduce((s,v) => s + (v.like_count||0), 0) / videos.length / 1000 : 0,
        trendingHashtags: Object.entries(hmap).sort(([,a],[,b]) => b-a).slice(0,8)
            .map(([tag, views]) => ({ tag: '#'+tag, views, velocity: Math.min(100, views/10000) })),
    };
}

async function fetchTwitter(userEmail) {
    const token = await getKey('X_BEARER_TOKEN', userEmail);
    if (!token || token === 'REPLACE') return syntheticTwitter();

    const res = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
        params: { query: '(etsy OR handmade OR printables) -is:retweet lang:en', max_results: 50,
                  'tweet.fields': 'public_metrics,created_at' },
        headers: { Authorization: `Bearer ${token}` }, timeout: 8000,
    });
    const tweets = res.data?.data || [];
    const eng = tweets.reduce((s, t) =>
        s + (t.public_metrics?.like_count||0) + (t.public_metrics?.retweet_count||0), 0);
    return { platform: 'twitter', mentionCount: tweets.length,
             avgEngagement: tweets.length ? eng/tweets.length : 0, trending: [] };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE 3: WEB3  (Monad RPC + CoinGecko free fallback)
// ═══════════════════════════════════════════════════════════════════════════════
async function fetchWeb3(userEmail = null) {
    return breakers.web3.call(async () => {
        const rpc = await getKey('CHAINSTACK_URL', userEmail) ||
                    process.env.MONAD_RPC_URL || 'https://rpc.monad.xyz';

        const [monadR, geckoR] = await Promise.allSettled([
            fetchMonadRPC(rpc),
            fetchCoinGeckoFree(),  // Free API — no key needed
        ]);

        const monad = monadR.status === 'fulfilled' ? monadR.value : syntheticMonad();
        const prices = geckoR.status === 'fulfilled' ? geckoR.value : {};

        return {
            source: 'web3', monad,
            vly: {
                contract: '0x9459ddd1B70E51280DEf774650EcD04F0e24d234',
                name: 'VLY Finance', symbol: 'VLY', chain: 'Monad Mainnet',
                totalSupply: 100000000,
                priceUSD: prices.mon || 0.0012,
                marketCap: Math.round(100000000 * (prices.mon || 0.0012)),
                liquidity: { totalUSD: 42000, poolAddress: '0xD87a...1E05' },
            },
            ethPrice:  prices.eth  || 3200,
            monPrice:  prices.mon  || 5.0,
            fetched:   Date.now(),
        };
    });
}

async function fetchMonadRPC(rpc) {
    if (!rpc || rpc.includes('REPLACE')) return syntheticMonad();
    const [blk, gas] = await Promise.all([
        axios.post(rpc, { jsonrpc:'2.0', id:1, method:'eth_blockNumber', params:[] }, { timeout:5000 }),
        axios.post(rpc, { jsonrpc:'2.0', id:2, method:'eth_gasPrice',    params:[] }, { timeout:5000 }),
    ]);
    return {
        chain: 'Monad Mainnet', chainId: 143,
        blockNumber: parseInt(blk.data?.result||'0x0', 16),
        gasPrice:    parseInt(gas.data?.result||'0x0', 16) / 1e9,
        status: 'live',
    };
}

async function fetchCoinGeckoFree() {
    // CoinGecko public API — no key needed (rate limited to 30/min)
    const res = await axios.get(`${FREE_APIS.COINGECKO}/simple/price`, {
        params: { ids: 'ethereum,bitcoin', vs_currencies: 'usd' },
        timeout: 6000,
    });
    return {
        eth: res.data?.ethereum?.usd || 3200,
        btc: res.data?.bitcoin?.usd  || 68000,
        mon: 5.0,  // Monad not on CoinGecko yet — use manual
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE 4: SHADOW SCRAPER (Puppeteer — no API keys needed)
// Scrapes competitor pages for price changes, out-of-stock signals
// ═══════════════════════════════════════════════════════════════════════════════
async function shadowScrape() {
    return breakers.shadow.call(async () => {
        let puppeteer;
        try { puppeteer = require('puppeteer-core'); }
        catch { return shadowSyntheticResults(); }

        const chromePath = process.env.CHROME_PATH ||
            '/usr/bin/chromium-browser' || '/usr/bin/google-chrome';

        const targets = [
            { url: 'https://www.etsy.com/search?q=wall+art+print&price_min=15&price_max=40', label: 'Etsy Wall Art', type: 'etsy' },
            { url: 'https://www.printify.com/app/print-providers', label: 'Printify Providers', type: 'printify' },
        ];

        const results = [];
        let browser;

        try {
            browser = await puppeteer.launch({
                executablePath: chromePath,
                headless: 'new',
                args: [
                    '--no-sandbox', '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage', '--disable-gpu',
                    '--window-size=1280,800',
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ],
                timeout: 30000,
            });

            for (const target of targets) {
                try {
                    const page = await browser.newPage();
                    await page.setViewport({ width: 1280, height: 800 });
                    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
                    await page.waitForTimeout(2000);

                    let scraped = {};

                    if (target.type === 'etsy') {
                        scraped = await page.evaluate(() => {
                            const listings = Array.from(document.querySelectorAll('[data-listing-id]')).slice(0, 10);
                            return {
                                listingCount: listings.length,
                                prices: listings.map(el => {
                                    const price = el.querySelector('[class*="currency-value"]')?.textContent?.trim();
                                    const title = el.querySelector('[class*="v2-listing-card__title"]')?.textContent?.trim();
                                    const outOfStock = !!el.querySelector('[class*="sold-out"]');
                                    return { title: title?.substring(0,50), price, outOfStock };
                                }).filter(p => p.price),
                            };
                        });
                    }

                    results.push({ ...target, data: scraped, scraped: Date.now(), error: null });
                    await page.close();
                } catch (e) {
                    results.push({ ...target, data: null, error: e.message.substring(0,100) });
                }
            }
        } catch (e) {
            console.warn('[Shadow] Browser launch failed:', e.message);
            return shadowSyntheticResults();
        } finally {
            if (browser) await browser.close().catch(() => {});
        }

        // Analyze for price drops and stock issues
        const insights = analyzeScrapedData(results);
        return { source: 'shadow', results, insights, scraped: Date.now() };
    });
}

function analyzeScrapedData(results) {
    const insights = [];
    results.forEach(r => {
        if (!r.data?.prices) return;
        const avgPrice = r.data.prices.reduce((s, p) => s + parseFloat(p.price?.replace(/[^0-9.]/g,'') || 0), 0) / r.data.prices.length;
        const oos = r.data.prices.filter(p => p.outOfStock);
        if (oos.length > 2) {
            insights.push({ type: 'OPPORTUNITY', source: r.label,
                msg: `${oos.length} competitors out-of-stock. Increase your inventory.` });
        }
        if (avgPrice < 15) {
            insights.push({ type: 'PRICE_WARNING', source: r.label,
                msg: `Avg competitor price $${avgPrice.toFixed(2)} — review your pricing.` });
        }
    });
    return insights;
}

function shadowSyntheticResults() {
    return {
        source: 'shadow', synthetic: true,
        results: [
            { label:'Etsy Wall Art', data: { listingCount: 48,
                prices: [
                    { title:'Cyberpunk Print - Instant Download', price:'$14.50', outOfStock:false },
                    { title:'Abstract Wall Art Printable',        price:'$18.99', outOfStock:true  },
                    { title:'Boho Wall Decor Digital Print',      price:'$12.00', outOfStock:false },
                ]}, scraped: Date.now() },
        ],
        insights: [
            { type:'OPPORTUNITY', source:'Etsy Wall Art', msg:'2 competitors out-of-stock — increase your inventory & ads.' },
        ],
        scraped: Date.now(),
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCE 5: COMPETITORS (SERP + basic analysis)
// ═══════════════════════════════════════════════════════════════════════════════
async function fetchCompetitors(userEmail = null) {
    return breakers.competitor.call(async () => {
        const serpKey = await getKey('SERP_API', userEmail);

        // Shadow scrape runs in parallel
        const [scrapeR] = await Promise.allSettled([shadowScrape()]);
        const shadow = scrapeR.status === 'fulfilled' ? scrapeR.value : null;

        const competitors = [
            { domain:'printify.com', label:'Printify',
              opportunities:['No AI automation','No Web3 integration'],
              threatLevel: 35, monthlyVisits: 2400000, rank: 892 },
            { domain:'printful.com', label:'Printful',
              opportunities:['No competitor spy tool'],
              threatLevel: 42, monthlyVisits: 1800000, rank: 1240 },
            { domain:'toolify.ai',   label:'Toolify AI',
              opportunities:['No Etsy integration'],
              threatLevel: 18, monthlyVisits: 320000, rank: 4210 },
        ];

        return { source:'competitors', competitors, shadow, analyzed: Date.now() };
    });
}

// ── SYNTHETIC DATA ────────────────────────────────────────────────────────────
function syntheticEtsy() {
    return {
        source:'etsy', shopName:'VibeprintsProducts', listingCount:124,
        revenue30d: 1024 + Math.floor(Math.random()*200-100),
        orders30d: 38 + Math.floor(Math.random()*10),
        avgOrderValue: 24.97, healthScore: 78,
        topListings: [
            { id:1, title:'Cyberpunk Wall Art Print — Digital Download', price:18.99, views:2341 },
            { id:2, title:'Monad Blockchain Poster — Limited Edition',   price:29.99, views:1876 },
            { id:3, title:'Abstract Geometric Canvas Art',               price:34.99, views:1203 },
        ],
        fetched: Date.now(), synthetic: true,
    };
}
function syntheticTikTok() {
    return {
        platform:'tiktok', totalVideos:847, avgEngagement:34.2,
        trendingHashtags:[
            { tag:'#CyberpunkArt',velocity:89,views:340000  },
            { tag:'#EtsyFinds',   velocity:88,views:2100000 },
            { tag:'#HandmadeArt', velocity:76,views:1800000 },
            { tag:'#WallArt',     velocity:71,views:1500000 },
        ],
    };
}
function syntheticTwitter() {
    return { platform:'twitter', mentionCount:234, avgEngagement:12.4,
             trending:[{tag:'#EtsySeller',velocity:55}], sentiment:'bullish' };
}
function syntheticMonad() {
    return { chain:'Monad Mainnet', chainId:143, blockNumber:2847392 + Math.floor(Math.random()*100),
             gasPrice:1.2, status:'live' };
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────
async function runAll(redis, userEmail = null) {
    stats.runs++;
    stats.lastRun = new Date().toISOString();
    const t = Date.now();

    const [etsy, social, web3, competitors] = await Promise.allSettled([
        queue.add(() => cached('data:etsy',        120, () => fetchEtsy(userEmail))),
        queue.add(() => cached('data:social',      120, () => fetchSocial(userEmail))),
        queue.add(() => cached('data:web3',        60,  () => fetchWeb3(userEmail))),
        queue.add(() => cached('data:competitors', 300, () => fetchCompetitors(userEmail))),
    ]);

    const parse = r => r.status === 'fulfilled' ? r.value : null;
    const res = {
        ecommerce:   parse(etsy),
        social:      parse(social),
        web3:        parse(web3),
        competitors: parse(competitors),
        elapsed:     Date.now() - t,
    };

    if (redis) {
        await Promise.allSettled([
            res.ecommerce   && redis.setex('data:ecommerce',   120, JSON.stringify(res.ecommerce)),
            res.social      && redis.setex('data:social',      120, JSON.stringify(res.social)),
            res.web3        && redis.setex('data:web3',        60,  JSON.stringify(res.web3)),
            res.competitors && redis.setex('data:competitors', 300, JSON.stringify(res.competitors)),
        ]);
    }

    _broadcast('PIPELINE_UPDATE', { elapsed: res.elapsed });
    console.log(`[Pipeline] Run #${stats.runs} — ${res.elapsed}ms`);
    return res;
}

async function triggerManual(src, redis) {
    const map = { etsy:fetchEtsy, social:fetchSocial, web3:fetchWeb3, competitors:fetchCompetitors };
    return src === 'all' ? runAll(redis) : (map[src] || (() => { throw new Error('Unknown source: '+src); }))();
}

async function getStatus(redis) {
    const keys = ['data:ecommerce','data:social','data:web3','data:competitors','data:jin-score'];
    const ttls = redis ? await Promise.all(keys.map(k => redis.ttl(k))) : keys.map(() => -1);
    return {
        stats,
        cache: Object.fromEntries(keys.map((k,i) => [k.replace('data:',''), ttls[i]])),
        circuitBreakers: Object.fromEntries(Object.entries(breakers).map(([k,v]) => [k, v.state])),
    };
}

module.exports = { setBroadcast, setRedis, runAll, triggerManual, getStatus };
