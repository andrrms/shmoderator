import { User, Chat } from "@grammyjs/types";
import { Router } from "@grammyjs/router";

import bot, { MyContext } from "../bot";
import { NewGameOptions } from "./interfaces";
import GameState, { Code, GameUser } from "../state";

export interface Events {
  //=== Lobby events
  startRound: (chat_id: number, users: Array<GameUser>) => void;
  //=== Player events
  playerJoined: (chat_id: number, user: User) => void;
}

export default class LobbyManager {
  private static instance: LobbyManager;
  private games: Map<number, GameState>;
  readonly routers: Map<string, Router<MyContext>> = new Map();

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
  //* EVENT METHODS */
  //*****************/
  events: Map<keyof Events, (...data: any) => any> = new Map();
  public on(event: keyof Events, callback: Events[keyof Events]) {
    this.events.set(event, callback);
  }

  protected fireEvent<T extends keyof Events>(name: T): Events[T] {
    return this.events.get(name) as Events[T];
  }

  //*****************/
  //* LOBBY METHODS */
  //*****************/
  findGame(game_id: number): GameState | undefined {
    return this.games.get(game_id);
  }

  createGame(chat_id: number, options?: NewGameOptions) {
    if (this.findGame(chat_id)) return Code.ALREADY_EXISTS;

    this.games.set(chat_id, new GameState(chat_id, this.debug));

    if (this.debug) console.log(`[DEBUG] Created game at ${chat_id}`);

    if (!options || options.timer) {
      // TODO: Impl timer
    }

    // TODO: Impl joined interval messaging
    // TODO: Impl advice for infinite lobby
    return true;
  }

  destroyGame(chat_id: number) {
    const game = this.findGame(chat_id);
    if (!game) return Code.NOT_FOUND;

    this.games.delete(chat_id);

    if (this.debug) console.log(`[DEBUG] Ended game at ${chat_id}`);

    // TODO: Impl timer clear
    return game;
  }

  async startGame(chat_id: number) {
    const game = this.findGame(chat_id);
    if (!game)
      return await bot.api.sendMessage(chat_id, "There is no game running");

    const start = game.start();
    if (start === Code.STARTED)
      return await bot.api.sendMessage(chat_id, "Game already started");
    if (start === Code.NOT_ENOUGH_PLAYERS)
      return await bot.api.sendMessage(chat_id, "Not enough players");

    if (this.debug) console.log(`[DEBUG] Started game at ${chat_id}`);

    // Do logic
    game.playersAsArray.forEach(async (player) => {
      await bot.api.sendMessage(
        player.id,
        "Your game started at " + ("title" in (await bot.api.getChat(chat_id)))
      );
    });
    return true;
  }

  //******************/
  //* PLAYER METHODS */
  //******************/
  public joinPlayerIntoGame(chat_id: number, user: User) {
    const game = this.findGame(chat_id);
    if (!game) return Code.NOT_FOUND;

    let has_joined = false;
    this.games.forEach((game) => {
      if (game.players.get(user.id)) has_joined = true;
    });

    if (has_joined) return Code.ALREADY_EXISTS;

    const add = game.addPlayer(user);
    if (add === Code.ALREADY_EXISTS) return Code.ALREADY_EXISTS;
    if (add === Code.LIMIT_REACHED) return Code.LIMIT_REACHED;
    if (add === Code.STARTED) return Code.STARTED;

    // TODO: Implement joined player
    // TODO: Emit joined player event
    this.fireEvent("playerJoined")(chat_id, user);
    return true;
  }
}
