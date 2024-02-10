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
class AddStateCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "addstate",
      slashCommand: new SlashCommandBuilder()
        .setName("addstate")
        .addStringOption((option) =>
          option.setName("state").setDescription("US State").setRequired(true)
        )
        .setDescription("Add State as a tournament location to search for")
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
    guildPreferences.states.push(state);
    await guildPreferences.save()
    await interaction.editReply(`Added state ${states[state]}`);
    // const
  }
}
export default new AddStateCommand();
