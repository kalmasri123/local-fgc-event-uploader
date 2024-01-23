import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../../.env") });
interface Env {
  BOT_TOKEN?: string;
  CLIENT_ID?: string;
  STARTGG_API_KEY?: string;
  MONGOURI?:string;
}
export const env: Env = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  STARTGG_API_KEY: process.env.STARTGG_API_KEY,
  MONGOURI:process.env.MONGOURI
};
