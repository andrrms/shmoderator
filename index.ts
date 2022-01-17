import bot from "./src/bot";

bot.start({
  onStart(me) {
    console.log(`[BOT] Started at @${me.username}`);
  },
});
