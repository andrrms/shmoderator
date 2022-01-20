import { Composer } from "grammy";

const composer = new Composer();

composer.on("message").command("start", async (ctx) => {
  const [intention, ...data] = decodeURIComponent(ctx.match).toLocaleLowerCase().split(":");
  console.log(intention, data);
  
  if (intention) {
    // Handle payload
    switch (intention) {
      case "join":
        // Join player into game
        await ctx.reply("You're trying to join game at " + data[0]);
        break;
    }
  } else {
    // Welcome text
    await ctx.reply("Start text");
  }
});

composer.on("message").command("help", async (ctx) => {
  await ctx.reply("Help text");
});

composer.on("message").command("settings", async (ctx) => {
  await ctx.reply("Settings text");
});

export default composer;
