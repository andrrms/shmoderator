import { Bot, Context } from "grammy";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";
import env from "./env";
import manager from "./manager";

export interface MyContext extends EmojiFlavor, Context {}
const bot = new Bot<MyContext>(env.TOKEN);

bot.use(emojiParser());

bot.command("start", async (ctx) => {
  await ctx.replyWithEmoji`Hello, world! ${"grinning_face_with_smiling_eyes"}`;
});

bot.command("forcestart", async (ctx) => {
  await manager.startGame(ctx.chat.id);
});

export default bot;
