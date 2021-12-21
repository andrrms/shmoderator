import {manager} from "../logic";
import {Events} from "../logic/LobbyManager";

// Shouldn't be implemented
const playerJoined: Events['playerJoined'] = (chat_id, user) => {
		console.log(`${user.first_name} ${user.last_name} joined the game`);
};

export {
	playerJoined
};