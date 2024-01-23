import { env } from "./env";
import fetch from "node-fetch";
export interface StartGGApiResponse {}

export interface Tournament {
  id: number;
  name: string;
  slug: string;
  startAt: number;
  endAt: number;
  url: string;
  venueAddress: string;
  addrState: string;
  timezone: string;
  owner: Owner;
  images: Image[];
  events: Event[];
}

export interface Event {
  id: number;
  videogame: Videogame;
}

export interface Videogame {
  slug: string;
  name: string;
}

export interface Image {
  url: string;
  type: Type;
}

export enum Type {
  Banner = "banner",
  Profile = "profile",
}

export interface Owner {
  name: null | string;
  id: number;
  player: Player;
}

export interface Player {
  id: number;
  gamerTag: string;
}

const TOURNAMENTSTATEQUERY = `query TournamentsByOwner($page: Int!, $state: String!, $startTime: Timestamp!, $endTime: Timestamp!, $perPage: Int!) {
    tournaments(query: {
      perPage: $perPage
      page: $page
      sortBy: "startAt asc"
      filter: {
        addrState : $state
        afterDate: $startTime
        beforeDate: $endTime
      }
    }) {
    nodes {
      id
      name
      slug
      startAt
      endAt
      url
      venueAddress
      addrState
      timezone
      owner{
        name
        id
        player{
          id
          gamerTag
        }
      }
      images{
        url
        type
      }
      events{
        id
        videogame{
          slug
        }
      }
    }
  }
}`;
const VIDEOGAMEQUERY = `query VideoGamesByName($name: String!) {
    videogames(query: {
      filter: {
        name : $name
      }
    }) {
    nodes {
      name
      slug
    }
  }
}`;

const startGGRequest = async (
  query: string,
  variables: { [k: string]: any }
) => {
  const headers = { Authorization: "Bearer " + env.STARTGG_API_KEY };
  const response = await fetch("https://api.start.gg/gql/alpha", {
    headers,
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });
  const json:any = await response.json()
  console.log(json)
  return json.data;
};
export const getStateTournaments = async (
  state: string,
  start_date: Date = new Date(),
  end_date: Date = new Date(start_date.getTime() + 30 * 24 * 60 * 60 * 1000)
) => {
  const page_length = 500;
  const variables = {
    state,
    page: 1,
    startTime: Math.floor(start_date.getTime() / 1000),
    endTime: Math.floor(end_date.getTime() / 1000),
    perPage: page_length,
  };
  const response = await startGGRequest(TOURNAMENTSTATEQUERY, variables);
  console.log(response);
  const tournaments = response.tournaments.nodes as Tournament[];
  console.log(tournaments.map(t=>t.name));
  return tournaments;
};
export const searchVideoGames = async (name: string) => {
  const page_length = 500;
  const variables = {
    page: 1,
    perPage: page_length,
    name,
  };
  const response: Videogame[] = (
    await startGGRequest(VIDEOGAMEQUERY, variables)
  ).videogames.nodes as Videogame[];
  return response;
  //   return tournaments;
};
