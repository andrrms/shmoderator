import { cleanEnv, num, str, bool } from "envalid";
import { config } from "dotenv";

config();

export default cleanEnv(process.env, {
  TOKEN: str(),
  ADMIN_ID: num(),
  DEBUG: bool(),
});
