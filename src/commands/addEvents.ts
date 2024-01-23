import { getStateTournaments, searchVideoGames } from "@util/startgg";
import { Command, ExecuteFunction } from "./Command";
import stringSimilarity from "string-similarity-js";
import {
  ChatInputCommandInteraction,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import GuildPreferences from "Models/GuildPreferences";
import { addTournamentsToGuild } from "@util/discordUtils";
class AddEventsCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "addevents",
      slashCommand: new SlashCommandBuilder()
        .setName("addevents")
        .setDescription("Adds a game to search for")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    });
  }
  async executeCommand(interaction: ChatInputCommandInteraction) {
    await super.executeCommand(interaction);
    const guildPreferences = await GuildPreferences.findOne({
      guildId: interaction.guildId,
    });
    if (guildPreferences.games.length == 0) {
      await interaction.editReply(
        `No Games are added. Add games using the /addgame command`
      );
      return;
    }
    if (!guildPreferences.state) {
      await interaction.editReply(
        `USA State is not selected. Set state using the /setstate command`
      );
      return;
    }
    await interaction.editReply(`Searching Tournaments in your Area...`);
    const today = new Date();
    const tournaments = await getStateTournaments(
      guildPreferences.state,
      new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      ),
      new Date(
        today.getTime() + guildPreferences.searchWindow * 24 * 60 * 60 * 1000
      )
    );
    await addTournamentsToGuild(
      interaction.guild,
      tournaments,
      guildPreferences
    );
    await interaction.editReply(`Events queued`);
    // const
  }
}
export default new AddEventsCommand();
