import { Command } from 'commands/Command';
import { Client, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { env } from './env';

export const commands = {};
export const commandNames = readdirSync(join(__dirname, '../commands/')).filter((el) => {
    const extension = '.ts';
    return el != `Command${extension}` && el.endsWith(extension);
});

export async function registerCommands(client: Client) {
    for (let commandName of commandNames) {
        const command: Command = (await import(`../commands/${commandName}`)).default;
        commands[command.commandName] = command;
    }
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    let registeredCommands = Object.values(commands)
        .filter((el: Command) => el.slashCommand)
        .map((el: Command) => {
            return el.slashCommand.toJSON();
        });
    // await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body: [] });

    // await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, guild.id), { body: [] });
    // console.log('cleared');
    await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
        body: registeredCommands,
    });
    // console.log(res);
}