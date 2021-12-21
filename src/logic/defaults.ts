import {GameUser, Preferences, Role, RoundStep, State} from "../typings/types";

const mockUser: GameUser = {
	id: -1,
	first_name: 'John',
	is_dead: false,
	language_code: 'en',
	last_name: 'Doe',
	role: Role.Lib,
	username: 'johndoe'
}

const initialState: State = {
	started: false,
	started_at: null,
	round: 0,
	round_step: RoundStep.Election,

	event_history: [],

	lib_policies: 0,
	fas_policies: 0,

	election: {
		votes: {
			yes: [],
			no: [],
		},
		proposed_plate_won: false,
		can_veto: false,
	},

	roles: {
		hit: mockUser,
		fas: [],
		president: {
			actual: null,
			last: null,
		},
		chancellor: {
			actual: null,
			last: null,
		},
	},

	deck: {
		pile: [],
		discarded: [],
	},
}

const defaultPreferences: Preferences = {
	can_flee: true,
	language: 'en',
	player_limit: 12,
	timers: {
		joinLobby: 120000,
		choosePolicy: 80000,
		pickChancellor: 60000,
		executiveAction: 80000,
		electionDiscuss: 120000,
	},
}

export {
	initialState,
	defaultPreferences
}