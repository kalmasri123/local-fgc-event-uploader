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
class SetSearchWindow extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "setsearchwindow",
      // slashCommand: new SlashCommandBuilder()
        // .setName("setsearchwindow")
        // .addNumberOption((option) =>
        //   option.setName("days").setDescription("Days to look ahead").setMaxValue(30).setMinValue(1).setRequired(true)
        // )
        // .setDescription("Set the search window in days to look for tournaments")
        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    });
  }
  async executeCommand(interaction: ChatInputCommandInteraction) {
    await super.executeCommand(interaction);
    const days = interaction.options.getNumber("days");
    const guildPreferences = await GuildPreferences.findOne({
      guildId: interaction.guildId,
    });
    guildPreferences.searchWindow = days;
    await guildPreferences.save()
    await interaction.editReply(`Set window to ${days} days`);
    // const
  }
}
export default new SetSearchWindow();
