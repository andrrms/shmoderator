import { Composer } from "grammy";

const composer = new Composer();

composer.on("message").command("start", async (ctx) => {
  await ctx.reply("Start text");
});

composer.on("message").command("help", async (ctx) => {
  await ctx.reply("Help text");
});

composer.on("message").command("settings", async (ctx) => {
  await ctx.reply("Settings text");
});

export default composer;
