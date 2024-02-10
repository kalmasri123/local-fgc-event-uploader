import * as qrate from "qrate";
import { TournamentRequestBody, getStateTournaments } from "./startgg";
import { ActionRow, Guild,Client } from "discord.js";
import { addTournamentsToGuild } from "./discordUtils";
import { doesNotMatch } from "assert";
import GuildPreferences from "Models/GuildPreferences";
// mark the start time of this script
// worker function that calls back after 100ms

export const manualEventAdd = async ({ guild, state, guildPreferences }) => {
  const today = new Date();
  const tournaments = await getStateTournaments({
    state,
    startDate: new Date(today.getTime()),
    endDate: new Date(
      today.getTime() + guildPreferences.searchWindow * 24 * 60 * 60 * 1000
    ),
  });
  await addTournamentsToGuild(guild, tournaments, guildPreferences);
};

export const automaticEventAdd = async ({ state,client }:{state:string,client:Client}) => {
  const today = new Date();
  const relevantGuilds = await GuildPreferences.find({ states: state });
  if(relevantGuilds.length == 0) return;

  const tournaments = await getStateTournaments({
    state,
    startDate: new Date(today.getTime()),
    endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
  });
  relevantGuilds.forEach(async g=>{
    const guild = await client.guilds.fetch(g.guildId)
    console.log(guild.name)
    if(!guild) return
    await addTournamentsToGuild(guild, tournaments, g);

  })

};
export interface JobParameters {
  args?: { [key: string]: string };
  action: (args: { [key: string]: string }) => Promise<any>;
  callback: () => any;
}
const worker = async function (data: JobParameters) {
  await data.action(data.args);
  data?.callback();
  return { ok: true };
};

// create a queue with default properties (concurrency = 1, rateLimit = null)
// using our 'worker' function to process each item in the queue
export const jobQueue = qrate(worker, 1, 2);

// // add ten things to the queue
// for (let i = 0; i < 600; i++) {
//   jobQueue.push({
//     args: { num: i },
//     action: ({ num },done) => {console.log(`Hello:${num}`);done()},
//   });
// }
