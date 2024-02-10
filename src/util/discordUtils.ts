import {
  Guild,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from "discord.js";
import { Tournament } from "./startgg";
import  { GuildPreferences } from "Models/GuildPreferences";

export const addTournamentsToGuild = async (
  guild: Guild,
  tournaments: Tournament[],
  guildPreferences:GuildPreferences
) => {
  // const guildPreferences = await GuildPreferences.findOne({
  //   guildId: guild.id,
  // });
  const filtered = tournaments.filter((tournament) => {
    return tournament.events?.find((event) =>
      guildPreferences.games.find((game) => game == event.videogame.slug)
    );
  });
  const scheduledEventNames = {}
  const events = (await guild.scheduledEvents.fetch())
  events.forEach((e)=>scheduledEventNames[e.name] = 1)
  filtered.forEach(async (tournament) => {
    if(scheduledEventNames[tournament.name]){
        console.log(`${tournament.name} already found... Skipping`)
        return;
    } 
    const startDate = new Date(tournament.startAt * 1000)

    await guild.scheduledEvents.create({
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      name: tournament.name,
      scheduledStartTime: new Date(Math.max(startDate.getTime(),new Date().getTime())),
      scheduledEndTime: new Date(tournament.endAt * 1000),
      entityMetadata: { location: tournament.venueAddress },
      description: `https://start.gg${tournament.url}`,
    });
  });
};
