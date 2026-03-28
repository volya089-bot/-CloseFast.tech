/**
 * LAMPA BOT — Telegram Jin Alerts
 * Sends critical business alerts to owner's Telegram
 * Uses Telegraf.js
 */

require('dotenv').config();

let bot = null;
let chatId = null;

function init() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const cid   = process.env.TELEGRAM_CHAT_ID;

    if (!token || token === 'REPLACE' || !cid) {
        console.warn('[Lampa] Telegram not configured — alerts disabled');
        return;
    }

    try {
        const { Telegraf } = require('telegraf');
        bot    = new Telegraf(token);
        chatId = cid;

        // Handle /start command
        bot.command('start', ctx => {
            ctx.reply(
                '🔮 *Хоттабич активний* — Лампа підключена!\n\n' +
                'Команди:\n' +
                '/status — поточна Сила Джина\n' +
                '/alerts — активні алерти\n' +
                '/ask [питання] — запитати Хоттабича',
                { parse_mode: 'Markdown' }
            );
        });

        // /status
        bot.command('status', async ctx => {
            try {
                const res = await fetch('http://localhost:4000/jin-score');
                const d   = await res.json();
                ctx.reply(
                    `🔮 *Сила Джина: ${d.overall}/100 (${d.grade})*\n\n` +
                    `📊 Компоненти:\n` +
                    `• E-Commerce: ${d.components?.ecommerce || 0}\n` +
                    `• Соцмережі:  ${d.components?.social || 0}\n` +
                    `• Web3:       ${d.components?.web3 || 0}\n` +
                    `• Конкуренти: ${d.components?.competitors || 0}\n\n` +
                    `${d.label || ''} · ${new Date().toLocaleString('uk-UA')}`,
                    { parse_mode: 'Markdown' }
                );
            } catch (e) {
                ctx.reply('⚠️ Не вдалося отримати статус: ' + e.message);
            }
        });

        // /alerts
        bot.command('alerts', async ctx => {
            try {
                const res = await fetch('http://localhost:4000/alerts');
                const d   = await res.json();
                if (!d.alerts?.length) return ctx.reply('✅ Немає активних алертів');
                const msg = d.alerts.slice(0,3).map(a =>
                    `${a.level==='HIGH'?'🔴':a.level==='OPPORTUNITY'?'🟢':'🟡'} *${a.title}*\n${a.message}`
                ).join('\n\n');
                ctx.reply(msg, { parse_mode:'Markdown' });
            } catch (e) { ctx.reply('Помилка: ' + e.message); }
        });

        // /ask
        bot.command('ask', async ctx => {
            const question = ctx.message.text.replace('/ask', '').trim();
            if (!question) return ctx.reply('Введи питання після /ask');

            ctx.reply('🔮 Хоттабич думає...');

            try {
                const res = await fetch('http://localhost:4000/hottabych/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, voice: true }),
                });
                const d = await res.json();
                ctx.reply(`🔮 *Хоттабич:*\n\n${d.advice}`, { parse_mode:'Markdown' });
            } catch (e) { ctx.reply('Помилка: ' + e.message); }
        });

        bot.launch().catch(e => console.error('[Lampa] Launch error:', e.message));
        console.log('[Lampa] ✅ Telegram bot started');
    } catch (e) {
        console.warn('[Lampa] Init failed:', e.message);
    }
}

async function sendAlert(message, level = 'HIGH') {
    if (!bot || !chatId) return;
    const icon = level === 'HIGH' ? '🔴' : level === 'OPPORTUNITY' ? '🟢' : '🟡';
    try {
        await bot.telegram.sendMessage(
            chatId,
            `${icon} *АЛЕРТ ХОТТАБИЧА*\n\n${message}\n\n_${new Date().toLocaleString('uk-UA')}_`,
            { parse_mode: 'Markdown' }
        );
    } catch (e) {
        console.warn('[Lampa] sendAlert error:', e.message);
    }
}

async function sendCustom(msg) {
    if (!bot || !chatId) return;
    try { await bot.telegram.sendMessage(chatId, msg, { parse_mode: 'Markdown' }); } catch {}
}

// Init on require
init();

module.exports = { sendAlert, sendCustom };
