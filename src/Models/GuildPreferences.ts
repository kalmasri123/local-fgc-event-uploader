import mongoose, { Schema } from "mongoose";
export interface GuildPreferences {
  guildId: string;
  games: string[];
  states: string[];
  searchWindow: number;

}
const GuildPreferences = new Schema<GuildPreferences>({
  guildId: { required: true, type: String },
  games: { type: [String], default: [] },
  states: { type: [String], required: false },
  searchWindow: { type: Number, default: 30 },
});
export default mongoose.model("guildpreferences", GuildPreferences);
