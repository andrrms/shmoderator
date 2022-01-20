import { Composer } from "grammy";
import manager from "../manager";

const composer = new Composer();

composer
  .on("message")
  .filter(({ chat }) => chat.type !== "private")
  .command("new", async (ctx) => {
    const flags = ctx.match.trim().split(" ");

    try {
      await manager.createGame(ctx.chat.id, {
        language: ctx.from.language_code || "en",
        timer: flags.find((flag) => flag.toLocaleLowerCase() === "notimer")
          ? false
          : true,
      });
    } catch (e: any) {
      if (!e.skipReply) await ctx.reply(e.message);
    }
  });

composer
  .on("message")
  .filter(({ chat }) => chat.type !== "private")
  .command("join", async (ctx) => {
    try {
      await manager.joinPlayerIntoGame(ctx.chat.id, ctx.from);
    } catch (e: any) {
      if (!e.skipReply) await ctx.reply(e.message);
    }
  });

composer
  .on("message")
  .filter(({ chat }) => chat.type !== "private")
  .command("forcestart", async (ctx) => {
    try {
      await manager.startGame(ctx.chat.id);
    } catch (e: any) {
      await ctx.reply(e.message);
    }
  });

export default composer;
