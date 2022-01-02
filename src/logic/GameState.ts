import { User } from "@grammyjs/types";
import { GameUser, Preferences, Role, State } from "../typings/types";
import { defaultPreferences, initialState } from "./defaults";
import { Code } from "../typings/errors";

export default class GameState {
	/** Map of GameUser representing players */
	readonly players: Map<number, GameUser>;

	/** This represents the state of game */
	readonly state: State = initialState;
	/** This represents the preferences of the
	 * group where game is running */
	readonly preferences: Preferences;

	// TODO: Implement timers
	// TODO: Implement messages queue
	// TODO: Implement greeter queue

	constructor(
		public readonly group_id: number,
		public debug: boolean = false,
		preferences?: Preferences
	) {
		this.preferences = preferences || defaultPreferences;
		this.players = new Map();
		// TODO: implement serialization for saving this.state
	}

	//******************/
	//* PLAYER METHODS */
	//******************/
	/** Returns the user object in game */
	public findPlayer(user_id: number): GameUser | undefined {
		return this.players.get(user_id);
	}

	public get playersAsArray(): GameUser[] {
		return Array.from(this.players.values());
	}

	/** Adds a player in game */
	public addPlayer(user: User) { // TODO: Implement VIP system
		const find = this.findPlayer(user.id);
		if (find) return Code.ALREADY_EXISTS;
		if (this.state.started) return Code.STARTED;
		if (this.players.size >= this.preferences.player_limit) return Code.LIMIT_REACHED;

		if (this.debug) console.log(`[DEBUG] Adding player ${user.id} to game ${this.group_id}`);

		const usr: GameUser = {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name || undefined,
			username: user.username,
			language_code: user.language_code,
			role: Role.Lib,
			is_dead: false,
		}

		this.players.set(user.id, usr);

		return usr;
	}

	/** Removes a player from game */
	public removePlayer(user_id: number) {
		if (
			this.state.started &&
			!this.preferences.can_flee
		) return Code.STARTED;

		const find = this.findPlayer(user_id);
		if (!find) return Code.NOT_FOUND;

		if (this.debug) console.log(`[DEBUG] ${find.first_name} left game at ${this.group_id}`);

		return this.players.delete(user_id);
	}

	/** Kills a player in game */
	public killPlayer(user_id: number) {
		const find = this.findPlayer(user_id);
		if (!find) return Code.NOT_FOUND;
		if (find.is_dead) return Code.ALREADY_DEAD;

		if (this.debug) console.log(`[DEBUG] Killing player ${user_id} in game ${this.group_id}`);

		find.is_dead = true;
		return true;
	}

	//******************/
	//*  GAME METHODS  */
	//******************/
	/** Sort roles on game */
	public sortRoles() {
		if (!this.state.started) return Code.NOT_STARTED;

		let fas = 0;
		if (this.players.size >= 5) fas = 1;
		if (this.players.size >= 7) fas = 2;
		if (this.players.size >= 9) fas = 3;
		if (this.players.size >= 12) fas = 4;
		if (this.players.size >= 15) fas = 5;

		while (fas !== 0) {
			const player = this.playersAsArray[Math.floor(Math.random() * this.playersAsArray.length)];
			if (player.role === Role.Fas) continue;

			if (this.debug) console.log(`[DEBUG] ${player.first_name} is now a ${Role.Fas}`);

			player.role = Role.Fas;
			this.state.roles.fas.push(player);
			fas--;
		}

		do {
			const player = this.playersAsArray[Math.floor(Math.random() * this.playersAsArray.length)];
			if (player.role === Role.Fas) continue;

			if (this.debug) console.log(`[DEBUG] ${player.first_name} is now a ${Role.Hit}`);

			player.role = Role.Hit;
			this.state.roles.hit = player;
			break;
		} while (true);

		// If it is the first round, then sort the president too
		if (this.state.round === 0) {
			this.state.roles.president.actual =
				this.playersAsArray[Math.floor(Math.random() * this.playersAsArray.length)];
		}
	}

	public start() {
		if (this.state.started) return Code.STARTED;
		if (this.players.size < 5) return Code.NOT_ENOUGH_PLAYERS;

		if (this.debug) console.log(`[DEBUG] Starting game at ${this.group_id}`);

		this.state.started = true;
		this.sortRoles();

		return true;
	}
}