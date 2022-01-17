import { User } from "@grammyjs/types";

import bot, { MyContext } from "../bot";
import { NewGameOptions } from "./interfaces";
import GameState from "../state";
import { GameError } from "../utils";
import { Default } from "../state/interfaces";
import i18n from "../locales";

export default class LobbyManager {
  private static instance: LobbyManager;
  private games: Map<number, GameState>;

  readonly started_at: Date;
  debug: boolean;

  /**
   * @constructor
   */
  constructor(debug_mode: boolean = false) {
    this.games = new Map();
    this.started_at = new Date();
    this.debug = debug_mode;
  }

  /**
   * Get the singleton instance of the LobbyManager
   * @returns {LobbyManager}
   */
  public static getInstance(): LobbyManager {
    if (!LobbyManager.instance) {
      LobbyManager.instance = new LobbyManager();
    }
    return LobbyManager.instance;
  }

  //*****************/
  //* LOBBY METHODS */
  //*****************/
  findGame(game_id: number, lang?: string): GameState | undefined;
  findGame(game_id: number, lang: string, throwError: boolean): GameState;
  findGame(game_id: number, lang: string = "en", throwError?: boolean) {
    const game = this.games.get(game_id);
    if (throwError && !game) throw new GameError("GameNotFound", lang);
    return game;
  }

  async createGame(chat_id: number, options?: NewGameOptions) {
    const lang = options?.language || Default.Preferences.language;

    if (this.findGame(chat_id)) throw new GameError("GameNotFound", lang);

    this.games.set(
      chat_id,
      new GameState(chat_id, this.debug, {
        language: lang,
        can_flee: Default.Preferences.can_flee,
        player_limit: Default.Preferences.player_limit,
        timers: Default.Preferences.timers,
      })
    );

    if (this.debug) console.log(`[DEBUG] Created game at ${chat_id}`);

    if (!options || options.timer) {
      // TODO: Impl timer
    }

    // TODO: Impl joined interval messaging
    // TODO: Impl advice for infinite lobby
    await bot.api.sendMessage(chat_id, i18n.t(lang, "messages.GameCreated"));
  }

  destroyGame(chat_id: number) {
    // TODO: Remove unused var
    const game = this.findGame(chat_id);
    if (!game) throw new GameError("GameNotFound");

    this.games.delete(chat_id);

    if (this.debug) console.log(`[DEBUG] Ended game at ${chat_id}`);

    // TODO: Impl timer clear
  }

  async startGame(chat_id: number): Promise<void> {
    const game = this.findGame(chat_id);
    if (!game) throw new GameError("GameNotFound");

    game.start();

    if (this.debug) console.log(`[DEBUG] Started game at ${chat_id}`);

    // Do logic
    game.playersAsArray.forEach(async (player) => {
      await bot.api.sendMessage(
        player.id,
        "Your game started at " + ("title" in (await bot.api.getChat(chat_id)))
      );
    });
  }

  //******************/
  //* PLAYER METHODS */
  //******************/
  public async joinPlayerIntoGame(chat_id: number, user: User) {
    const game = this.findGame(chat_id);
    if (!game) throw new GameError("GameNotFound");

    let has_joined = false;
    this.games.forEach((game) => {
      if (game.players.get(user.id) && game.group_id !== chat_id)
        has_joined = true;
    });

    if (has_joined) throw new GameError("PlayerInAnotherGame");

    game.addPlayer(user);

    if (this.debug)
      console.log(`[DEBUG] Adding player ${user.id} to game ${chat_id}`);

    // TODO: Implement joined player
    // TODO: Emit joined player event
    await bot.api.sendMessage(
      chat_id,
      i18n.t(game.lang, "messages.PlayerJoined", { user })
    );
  }
}
