
import env from "../env";
import LobbyManager from "./Manager";

const manager = LobbyManager.getInstance();
manager.debug = env.DEBUG;

export default manager;
