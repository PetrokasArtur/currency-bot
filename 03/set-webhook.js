process.loadEnvFile(new URL('../.env', import.meta.url));

const BOT_TOKEN = process.env.BOT_TOKEN;

const WEBHOOK_URL =
   'https://currency-bot-mu.vercel.app/webhook/telegram';

const response = await fetch(
  `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: WEBHOOK_URL,
    }),
  }
);

const data = await response.json();

console.log(data);