import GuildPreferences from "Models/GuildPreferences";
import { Command, ExecuteFunction } from "./Command";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildScheduledEvent,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
class UnblockEventCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "unblockevent",
      slashCommand: new SlashCommandBuilder()
        .setName("unblockevent")
        .addStringOption((option) =>
          option
            .setName("eventname")
            .setAutocomplete(true)
            .setRequired(true)
            .setDescription("Event name to block")
        )
        .setDescription("Prevents event from being added in the future")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    });
  }
  async autoComplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    const events = (
      await GuildPreferences.findOne({ guildId: interaction.guild.id })
    ).blockList.filter((e) =>
      e.toLowerCase().startsWith(focusedValue.toLowerCase())
    );
    console.log(events)
    await interaction.respond(events.map((e) => ({ name: e, value: e })));
  }
  async executeCommand(interaction: ChatInputCommandInteraction) {
    await super.executeCommand(interaction);
    const guild = interaction.guild;
    const eventName = interaction.options.getString("eventname");
    const guildPreferences = await GuildPreferences.findOne({
      guildId: guild.id,
    });
    guildPreferences.blockList = guildPreferences.blockList.filter((e) => e.toLowerCase() != eventName.toLowerCase());
    await guildPreferences.save();
    interaction.editReply(`Unblocked ${eventName}`);

    // const
  }
}
export default new UnblockEventCommand();
