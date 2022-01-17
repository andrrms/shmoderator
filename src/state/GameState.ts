import { GameError } from "../utils";
import {
  GameUser,
  User,
  State,
  Preferences,
  Default,
  Role,
  Code,
} from "./interfaces";

export default class GameState {
  /** Map of GameUser representing players */
  readonly players: Map<number, GameUser>;

  /** This represents the state of game */
  readonly state: State = Default.State;
  /** This represents the preferences of the
   * group where game is running */
  readonly preferences: Preferences;
  /** Shortcut to `this.preferences.language` */
  readonly lang: string;

  // TODO: Implement timers
  // TODO: Implement messages queue
  // TODO: Implement greeter queue

  constructor(
    public readonly group_id: number,
    public debug: boolean = false,
    preferences?: Preferences
  ) {
    this.preferences = preferences || Default.Preferences;
    this.players = new Map();
    this.lang = this.preferences.language;
    // TODO: implement serialization for saving this.state
  }

  //******************/
  //* PLAYER METHODS */
  //******************/
  /** Returns the user object in game */
  public findPlayer(user_id: number): GameUser | undefined;
  public findPlayer(user_id: number, throwError: boolean): GameUser;
  public findPlayer(user_id: number, throwError?: boolean) {
    const player = this.players.get(user_id);

    if (throwError && !player) throw new GameError("PlayerNotFound", this.lang);
    return player;
  }

  public get playersAsArray(): GameUser[] {
    return Array.from(this.players.values());
  }

  /** Adds a player in game */
  public addPlayer(user: User) {
    if (this.findPlayer(user.id))
      throw new GameError("AlreadyJoined", this.lang);
    if (this.state.started)
      throw new GameError("CantJoinStartedGame", this.lang);
    if (this.players.size >= this.preferences.player_limit)
      throw new GameError("LobbyIsFull", this.lang);

    const usr: GameUser = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || undefined,
      username: user.username,
      language_code: user.language_code,
      role: Role.Lib,
      is_dead: false,
    };

    this.players.set(user.id, usr);
  }

  /** Removes a player from game */
  public removePlayer(user_id: number) {
    if (this.state.started && !this.preferences.can_flee)
      throw new GameError("CantFleeRunningGame", this.lang);
    if (!this.findPlayer(user_id))
      throw new GameError("PlayerNotFound", this.lang);

    this.players.delete(user_id);
  }

  /** Kills a player in game */
  public killPlayer(user_id: number) {
    const find = this.findPlayer(user_id, true);
    if (find.is_dead) throw new GameError("AlreadyDead", this.lang);

    find.is_dead = true;
  }

  //******************/
  //*  GAME METHODS  */
  //******************/
  /** Sort roles on game */
  public sortRoles() {
    if (!this.state.started) throw new GameError("NotStarted", this.lang);

    let fas = 0;
    if (this.players.size >= 5) fas = 1;
    if (this.players.size >= 7) fas = 2;
    if (this.players.size >= 9) fas = 3;
    if (this.players.size >= 12) fas = 4;
    if (this.players.size >= 15) fas = 5;

    while (fas !== 0) {
      const player =
        this.playersAsArray[
          Math.floor(Math.random() * this.playersAsArray.length)
        ];
      if (player.role === Role.Fas) continue;

      if (this.debug)
        console.log(`[DEBUG] ${player.first_name} is now a ${Role.Fas}`);

      player.role = Role.Fas;
      this.state.roles.fas.push(player);
      fas--;
    }

    do {
      const player =
        this.playersAsArray[
          Math.floor(Math.random() * this.playersAsArray.length)
        ];
      if (player.role === Role.Fas) continue;

      if (this.debug)
        console.log(`[DEBUG] ${player.first_name} is now a ${Role.Hit}`);

      player.role = Role.Hit;
      this.state.roles.hit = player;
      break;
    } while (true);

    // If it is the first round, then sort the president too
    if (this.state.round === 0) {
      this.state.roles.president.actual =
        this.playersAsArray[
          Math.floor(Math.random() * this.playersAsArray.length)
        ];
    }
  }

  public start() {
    if (this.state.started) throw new GameError("AlreadyRunning", this.lang);
    if (this.players.size < 5)
      throw new GameError("NotEnoughPlayers", this.lang);

    this.state.started = true;
    this.sortRoles();
  }
}
