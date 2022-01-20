import { Bot, Context } from "grammy";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";
import { I18nContextFlavor } from "@grammyjs/i18n";

import env from "./env";
import i18n from "./locales";

import { standardCommands, lobbyCommands, callbackListener } from "./handlers";

export type MyContext = Context & EmojiFlavor & I18nContextFlavor;
const bot = new Bot<MyContext>(env.TOKEN);

// Install plugins
bot.use(emojiParser());
bot.use(i18n.middleware());

// Install commands
bot.use(standardCommands);
bot.use(lobbyCommands);

// Install handlers
bot.use(callbackListener);

// Set commands
bot.api.setMyCommands(
  [
    { command: "start", description: "Starts this bot" },
    { command: "help", description: "Show help message" },
    { command: "settings", description: "Change bot settings" },
  ],
  {
    scope: { type: "default" },
  }
);

bot.api.setMyCommands(
  [
    { command: "start", description: "Starts this bot" },
    { command: "help", description: "Show help message" },
    { command: "settings", description: "Change bot settings" },
    { command: "new", description: "Starts a new game lobby" },
    { command: "join", description: "Join a game lobby" },
    { command: "forcestart", description: "Force a lobby to start" },
  ],
  {
    scope: { type: "all_group_chats" },
  }
);

export default bot;
