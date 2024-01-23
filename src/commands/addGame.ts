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
class AddGameCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "addgame",
      slashCommand: new SlashCommandBuilder()
        .setName("addgame")
        .addStringOption((option) =>
          option.setName("name").setDescription("Game to add").setRequired(true)
        )
        .setDescription("Adds a game to search for")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    });
  }
  async executeCommand(interaction: ChatInputCommandInteraction) {
    await super.executeCommand(interaction);
    const game = interaction.options.getString("name");
    const inputSlug = game.replace(/ /g, "-");
    const searchResult = await searchVideoGames(game);
    const bestResults = searchResult.sort(
      (a, b) =>
        stringSimilarity(b.name, inputSlug) -
        stringSimilarity(a.name, inputSlug)
    );
    const guildPreferences = await GuildPreferences.findOne({
      guildId: interaction.guildId,
    });
    guildPreferences.games.push(bestResults[0].slug);
    await guildPreferences.save()
    await interaction.editReply(`Added ${bestResults[0].name}`);
    console.log(bestResults);
    // const
  }
}
export default new AddGameCommand();
