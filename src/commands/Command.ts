import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Guild,
  Interaction,
  Message,
  PermissionFlagsBits,
  PermissionsBitField,
  SharedSlashCommand,
} from "discord.js";
import { SlashCommandBuilder } from "discord.js";
export type ExecuteFunction = (message: Message) => void;

interface CommandParameters {
  minArgs: number;
  maxArgs?: number;
  commandName: string;
  notEnoughArgumentsMessage?: string;
  slashCommand?: SharedSlashCommand;
}
export abstract class Command {
  minArgs: number;
  maxArgs?: number;
  notEnoughArgumentsMessage?: string;
  commandName: string;
  message: Message;
  args: string[];
  guild: Guild;
  slashCommand?: SharedSlashCommand;
  constructor({
    minArgs,
    maxArgs,
    commandName,
    notEnoughArgumentsMessage = "Not enough Arguments!",
    slashCommand,
  }: CommandParameters) {
    this.minArgs = minArgs;
    this.maxArgs = maxArgs;
    this.commandName = commandName;
    this.notEnoughArgumentsMessage = notEnoughArgumentsMessage;
    this.slashCommand = slashCommand;
  }
  async autoComplete(interaction: AutocompleteInteraction) {};
  async executeCommand(interaction: ChatInputCommandInteraction) {
    // console.log(interaction.options.data)
    // this.message = message;
    const me = await interaction.guild.members.fetchMe();

    await interaction.deferReply();
    if (!me.permissions.has([PermissionsBitField.Flags.ManageEvents])) {
      await interaction.editReply("Missing Permissions");
      throw new Error("Missing Permissions for Interaction");
    }
    return;
  }
}
