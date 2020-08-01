import { Params } from "./NewGame";

export type Player = {
  pool: Resources;
  prod: Resources;
  actionQueue?: Action[];

  userId: string;
  userName: string;

  increasedTFThisTurn: boolean;
};

export type Game = {
  params: Params;
  currentPlayer: number;
  players: Player[];
};

export type Resources = {
  money: number;
  steel: number;
  titanium: number;
  plants: number;
  energy: number;
  heat: number;
};

export enum Icon {
  animal = "🐾",
  plant = "🌱",
  science = "⚛️",
  earth = "🌎",
  building = "🏠",
  energy = "⚡",
  jovian = "🪐",
}

export enum Token {
  animal = "🐾",
  floater = "☁️",
}

export enum Trigger {
  getDiscount,
  checkRequirements,
  playCard,
  receivePlacementBonus,
  standardProjectDiscount,
}

export enum StandardProject {
  sell = "Sell Project Cards",
  powerplant = "Power Plant",
  asteroid = "Increase Temperature",
  aquifer = "Play an Ocean",
  greenery = "Play a Greenergy",
  city = "$1 prod; Play a city",
}

export enum Action {
  inventrix,
  robinsonIndustries,
  stormcraftIncorporated,
}

export type Effect = { trigger: Trigger; params: any };
export type CardPlay = () => void;
export type CardEffect = (effect: Effect) => any;
export type CardPoints = (c: Card) => number;

export type Card = {
  name: string;
  text: string;
  icons?: Icon[];
  play?: CardPlay;
  effect?: CardEffect;
  action?: () => void;
  points?: CardPoints;
  tokenType?: Token;
  numTokens?: number;
  isEvent?: boolean;
};

export type Tile = {
  bonus?: Resources;
  cards?: number;
  isOcean?: boolean;
};
