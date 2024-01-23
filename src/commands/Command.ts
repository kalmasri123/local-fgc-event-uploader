import { CacheType, ChatInputCommandInteraction, Guild, Interaction, Message } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
export type ExecuteFunction = (message: Message) => void;

interface CommandParameters {
    minArgs: number;
    maxArgs?: number;
    commandName: string;
    notEnoughArgumentsMessage?: string;
    slashCommand?: SlashCommandBuilder;
}
export abstract class Command {
    minArgs: number;
    maxArgs?: number;
    notEnoughArgumentsMessage?: string;
    commandName: string;
    message: Message;
    args: string[];
    guild: Guild;
    slashCommand?: SlashCommandBuilder;
    constructor({
        minArgs,
        maxArgs,
        commandName,
        notEnoughArgumentsMessage = 'Not enough Arguments!',
        slashCommand,
    }: CommandParameters) {
        this.minArgs = minArgs;
        this.maxArgs = maxArgs;
        this.commandName = commandName;
        this.notEnoughArgumentsMessage = notEnoughArgumentsMessage;
        this.slashCommand = slashCommand;
    }

    async executeCommand(interaction: ChatInputCommandInteraction) {
        // console.log(interaction.options.data)
        // this.message = message;
        await interaction.deferReply()
  
        return;
    }
}