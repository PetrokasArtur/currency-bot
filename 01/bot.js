process.loadEnvFile(new URL('../.env', import.meta.url));

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN не задан в env');
  process.exit(1);
}

let offset = 0;

async function getUpdates() {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}`
    );

    const data = await res.json();

    if (!data.ok) {
      console.error(data);
      setTimeout(getUpdates, 3000);
      return;
    }

    for (const update of data.result) {
      console.log(update);

      offset = update.update_id + 1;
    }

    getUpdates();

  } catch (error) {
    console.error(error);
    setTimeout(getUpdates, 3000);
  }
}

getUpdates();