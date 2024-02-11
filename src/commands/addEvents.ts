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
import { jobQueue, manualEventAdd } from "@util/jobs";
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
    const guild = interaction.guild;
    const guildPreferences = await GuildPreferences.findOne({
      guildId: interaction.guildId,
    });
    if (guildPreferences.games.length == 0) {
      await interaction.editReply(
        `No Games are added. Add games using the /addgame command`
      );
      return;
    }
    if (guildPreferences.states.length == 0) {
      await interaction.editReply(
        `No states selected. Add states using the /addstate command`
      );
      return;
    }
    await interaction.editReply(`Searching Tournaments in your Area...`);
    let stateCount = 0;
    const cb = async () => {
      if (++stateCount == guildPreferences.states.length) {
        await interaction.editReply(`Events queued`);
      }
    };

    guildPreferences.states.forEach((state) =>
      jobQueue.push({
        args: { guild, state, guildPreferences },
        action: manualEventAdd,
        callback: cb,
      })
    );
    // const
  }
}
export default new AddEventsCommand();
