import { searchVideoGames } from "@util/startgg";
import { Command, ExecuteFunction } from "./Command";
import stringSimilarity from "string-similarity-js";
import {
  ChatInputCommandInteraction,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import GuildPreferences from "Models/GuildPreferences";
import { states } from "@util/locations";
class SetStateCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "setstate",
      slashCommand: new SlashCommandBuilder()
        .setName("setstate")
        .addStringOption((option) =>
          option.setName("state").setDescription("US State").setRequired(true)
        )
        .setDescription("Set State as a tournament location to search for")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    });
  }
  async executeCommand(interaction: ChatInputCommandInteraction) {
    await super.executeCommand(interaction);
    const state = interaction.options.getString("state").toUpperCase();
    if(!states[state]){
      await interaction.editReply(`State not found`)
      return;
    }
    const guildPreferences = await GuildPreferences.findOne({
      guildId: interaction.guildId,
    });
    guildPreferences.state = state;
    await guildPreferences.save()
    await interaction.editReply(`Set state to ${states[state]}`);
    // const
  }
}
export default new SetStateCommand();
