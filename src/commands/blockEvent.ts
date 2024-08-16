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
class BlockEventCommand extends Command {
  constructor() {
    super({
      minArgs: 2,
      commandName: "blockevent",
      slashCommand: new SlashCommandBuilder()
        .setName("blockevent")
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
    const events = (await interaction.guild.scheduledEvents.cache).filter((e) =>
      e.name.startsWith(focusedValue)
    );
    await interaction.respond(
      events.map((e) => ({ name: e.name, value: e.name }))
    );
  }
  async executeCommand(interaction: ChatInputCommandInteraction) {
    await super.executeCommand(interaction);
    const guild = interaction.guild;
    const eventName = interaction.options.getString("eventname");
    const eventNameLower = eventName.toLowerCase();
    const event = (await guild.scheduledEvents.fetch({ cache: true })).find(
      (e) => e.name.toLowerCase() == eventNameLower
    );
    await event?.delete();
    const guildPreferences = await GuildPreferences.findOne({
      guildId: guild.id,
    });
    if (
      guildPreferences.blockList.find(
        (el) => el.toLowerCase() == eventNameLower
      )
    ) {
      await interaction.editReply(`Already blocked.`);
      return;
    }
    guildPreferences.blockList.push(eventName);
    await guildPreferences.save();
    interaction.editReply(
      `Blocked ${eventName}. \nThis won't be added in the future`
    );
  }
}
export default new BlockEventCommand();
