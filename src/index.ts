import { Bot } from "grammy";
import { config } from "dotenv";
import { Code } from "./typings/errors";
import { manager } from "./logic";

config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", async (ctx) => {
	await ctx.reply("Hello, I'm a bot!");
});

bot.command("new", async (ctx) => {
	const create = manager.createGame(ctx.chat.id);

	if (create === Code.ALREADY_EXISTS) {
		await ctx.reply("There is already a game in progress!");
	} else {
		await ctx.reply("A new game has been created!");
	}
});

manager.on('startRound', async (chat_id, users) => {
	// STEP 1: TODO: Delete all lobby messages
	// STEP 2: Send a message to all users telling their roles
	users.forEach((user) => {
		bot.api.sendMessage(chat_id, `Your role is a ${user.role}!`);
	});

	// STEP 3: TODO: TBD
});

bot.command("join", async (ctx) => {
	const join = manager.joinPlayerIntoGame(ctx.chat.id, ctx.from);

	if (join === Code.ALREADY_EXISTS) {
		await ctx.reply("You are already in a game!");
	} else if (join === Code.LIMIT_REACHED) {
		await ctx.reply("The game is full!");
	} else if (join === Code.STARTED) {
		await ctx.reply("The game has already started!");
	} else if (join === Code.NOT_FOUND) {
		await ctx.reply("There is no game in progress!");
	} else {
		await ctx.api.sendMessage(ctx.from.id, `You have joined the game!`);
	}
});

bot.command("forcestart", async (ctx) => {
	const start = manager.startGame(ctx.chat.id);

	if (start === Code.NOT_FOUND) {
		await ctx.reply("There is no game in progress!");
	} else if (start === Code.STARTED) {
		await ctx.reply("The game has already started!");
	} else if (start === Code.NOT_ENOUGH_PLAYERS) {
		await ctx.reply("There are not enough players to start the game!");
	}
});

bot.api.setMyCommands([
	{ command: "start", description: "Display the start message" },
	{ command: "new", description: "Create a new game" },
	{ command: "join", description: "Join a game" },
	{ command: "forcestart", description: "Force start a game" },
]);

bot.start({
	onStart: (info) => {
		console.log(`Bot started as @${info.username}`);
	}
}).then();