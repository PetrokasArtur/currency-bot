import Fastify from 'fastify';

if (!process.env.BOT_TOKEN) {
  process.loadEnvFile(new URL('../.env', import.meta.url));
}

const server = Fastify({
  logger: true
});

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;

server.post('/webhook/telegram', async (request, reply) => {
  const update = request.body;

  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.trim().toUpperCase();

  // Если сообщение не содержит текста
  if (!chatId || !text) {
    return { ok: true };
  }

  try {
    // Запрашиваем курс USD -> нужная валюта
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${text}`
    );

    const data = await response.json();

    if (!response.ok || !data.rates?.[text]) {
      await sendMessage(
        chatId,
        '❌ Не знаю такую валюту. Попробуй, например: EUR, GBP, JPY или PLN.'
      );

      return { ok: true };
    }

    const rate = data.rates[text];

    await sendMessage(
      chatId,
      `💵 1 USD = ${rate} ${text}\n📅 Дата курса: ${data.date}`
    );

    return { ok: true };

  } catch (error) {
    console.error(error);

    await sendMessage(
      chatId,
      '❌ Не удалось получить курс валюты.'
    );

    return { ok: true };
  }
});

async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text
    })
  });
}

server.listen({ port: PORT }, (error, address) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  }

  console.log(`Server started at ${address}`);
});