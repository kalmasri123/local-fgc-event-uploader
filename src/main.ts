import { getStateTournaments, searchVideoGames } from "./util/startgg";
import { env } from "@util/env";
import { commands, registerCommands } from "@util/commandManager";
import { Command } from "commands/Command";
import { Client, VoiceChannel, GatewayIntentBits, Events } from "discord.js";
import mongoose from "mongoose";
import GuildPreferences from "Models/GuildPreferences";
import { states } from "@util/locations";
import { automaticEventAdd, jobQueue } from "@util/jobs";

mongoose.connect(env.MONGOURI);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  const client: Client = new Client({
    intents: [GatewayIntentBits.GuildMessages,GatewayIntentBits.Guilds],
    // retryLimit: Infinity,
    presence: {
      status: "idle",
    },
  });
  client.on("guildCreate", async (guild) => {
    (await GuildPreferences.findOne({ guildId: guild.id })) ??
      (await GuildPreferences.create({ guildId: guild.id }));
  });

  client.on("ready", async () => {
    console.log("BOT IS READY");

    await client.user.setPresence({ status: "online" });
    //Add if not exists
    const guilds = await client.guilds.fetch();
    guilds.forEach(async (guild) => {
      (await GuildPreferences.findOne({ guildId: guild.id })) ??
        (await GuildPreferences.create({ guildId: guild.id }));
    });

    await registerCommands(client);

    //Load automatic Jobs
    const locations = Object.keys(states);
    locations.forEach((state) =>{
      function pushToQueue(){
        jobQueue.push({
          args: { state,client },
          action: automaticEventAdd,
          callback:()=>setTimeout(pushToQueue,1000*60*60)
        })
      }
      pushToQueue()

    });

    //Create Scheduled events
  });
  client.login(env.BOT_TOKEN);

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    // if(interaction.member.permissions)
    const commandName = interaction.commandName;
    console.log(commandName);
    try {
      const command: Command = commands[commandName];
      command.executeCommand(interaction);
    } catch (error) {
      console.error(error);
      console.error(`Error executing ${interaction.commandName}`);
    }
  });
} catch (err) {
  console.log(err);
}

/**
 * TODO
 * 1. Add game Command
 * 2. Set state command
 * 2. Manual command to populate events tab
 * 3. Toggle daily populate Command
 *
 */
