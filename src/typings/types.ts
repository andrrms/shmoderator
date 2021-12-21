export enum Role {
	Lib = 'roleLib',
	Fas = 'roleFas',
	Hit  = 'roleHit'
}

export enum Policy {
	Lib = 'libPolicy',
	Fas = 'fasPolicy'
}

export interface User {
	/** Unique identifier for this user or bot */
	id: number;
	/** User's or bot's first name */
	first_name: string;
	/** User's or bot's last name */
	last_name?: string;
	/** User's or bot's username */
	username?: string;
	/** IETF language tag of the user's language */
	language_code?: string;
}

export interface GameUser extends User {
	/** User's role in game */
	role: Role | null; // TODO: Make it non-nullable?
	/** `true` if user has died in game */
	is_dead: boolean;
}

export enum EventAction {
	// Election events
	PlayerBecamePresident,
	PresidentPickChancellor,
	ElectionPlateLost,
	ElectionPlateWon,
	ElectionFailedThreeTimes,
	PlayerVoted,
	// Legislative events
	PresidentDiscardedPolicy,
	ChancellorEnactedPolicy,
	// Executive events
	// Presidential powers
	PresidentInspectedSomeone,
	PresidentCalledSpecialElection,
	PresidentPeekedTopPolicy,
	PresidentExecutedSomeone,
	// Chancellor powers
	ChancellorAskedForVeto,
	PresidentConsentedVeto,
	PresidentDeniedVeto,
}

export interface EventData {
	round: number;
	action_type: EventAction;
	data?: Array<GameUser|Policy|Role|boolean>;
}

/** Each round consists of three stages. A round will not
 * necessarily go through all three stages.*/
export enum RoundStep {
	/** The election stage is where the players will decide
	 * which players will be elected. */
	Election,
	/** The legislative stage is where both president and
	 * chancellor will decide which policy will be elected
	 * in the game. */
	Legislative,
	/** The executive stage is where the president will take
	 * a fascist action, if any. */
	Executive
}

export interface State {
	/** `true` if the game started on group */
	started: boolean;
	started_at: number;
	round: number;
	round_step: RoundStep;

	event_history: Array<EventData>; // TODO: Implement event history methods

	lib_policies: number;
	fas_policies: number;

	election: {
		votes: {
			yes: Array<GameUser>;
			no: Array<GameUser>;
		};
		proposed_plate_won: boolean; // TODO: Move this to event history?
		can_veto: boolean;
	};

	roles: {
		hit: GameUser;
		fas: Array<GameUser>;
		president: {
			actual: GameUser | null;
			last: GameUser | null;
		};
		chancellor: {
			actual: GameUser | null;
			last: GameUser | null;
		}
	}

	// TODO: Implement separate deck class?
	deck: {
		pile: Array<Policy>;
		discarded: Array<Policy>;
	}
}

export interface Preferences {
	can_flee: boolean;
	language: string;
	player_limit: number;
	timers: {
		joinLobby: number;
		choosePolicy: number;
		pickChancellor: number;
		electionDiscuss: number;
		executiveAction: number;
	}
}