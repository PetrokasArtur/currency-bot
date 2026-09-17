import "@supabase/functions-js/edge-runtime.d.ts";

const BOT_TOKEN = Deno.env.get("bot_token") ?? Deno.env.get("BOT_TOKEN");

async function sendMessage(chatId, text) {
  if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not configured");
  }

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram API returned ${response.status}: ${details}`);
  }
}

export default {
  async fetch(req) {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          message: "hello, it incubator",
          studentId: "2666",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const update = await req.json();
      const chatId = update.message?.chat?.id;
      const text = update.message?.text?.trim().toUpperCase();

      if (!chatId || !text) {
        return new Response("OK", { status: 200 });
      }

      const ratesResponse = await fetch(
        `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${text}`
      );
      const data = await ratesResponse.json();

      if (!ratesResponse.ok || !data.rates?.[text]) {
        await sendMessage(
          chatId,
          "❌ Не знаю такую валюту. Попробуй, например: EUR, GBP, JPY или PLN."
        );
        return new Response("OK", { status: 200 });
      }

      const rate = data.rates[text];
      await sendMessage(
        chatId,
        `💵 1 USD = ${rate} ${text}\n📅 Дата курса: ${data.date}`
      );

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
