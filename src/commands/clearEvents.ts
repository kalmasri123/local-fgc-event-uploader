import { getStateTournaments, searchVideoGames } from "@util/startgg";
import { Command, ExecuteFunction } from "./Command";
import stringSimilarity from "string-similarity-js";
import {
  ChatInputCommandInteraction,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
class ClearEventsCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "clearevents",
      slashCommand: new SlashCommandBuilder()
        .setName("clearevents")
        .setDescription("Clears ALL events in your server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    });
  }
  async executeCommand(interaction: ChatInputCommandInteraction) {
    await super.executeCommand(interaction);
    const guild = interaction.guild
    await interaction.editReply(`Clearing events...`);
    await Promise.all((await guild.scheduledEvents.fetch()).map(event=>event.delete()));
    await interaction.editReply(`Events cleared`)

    
    // const
  }
}
export default new ClearEventsCommand();
