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
class RemoveStateCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "removestate",
      slashCommand: new SlashCommandBuilder()
        .setName("removestate")
        .addStringOption((option) =>
          option.setName("state").setDescription("US State").setRequired(true)
        )
        .setDescription("Remove State from events tab")
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
    guildPreferences.states.splice(guildPreferences.states.indexOf(state),1);
    await guildPreferences.save()
    await interaction.editReply(`Removed state ${states[state]}`);
    // const
  }
}
export default new RemoveStateCommand();
