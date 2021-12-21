import LobbyManager from "./LobbyManager";
import {playerJoined} from "../events/test";

const manager = new LobbyManager(true);

manager.on('playerJoined', playerJoined);

export {
	manager,
};