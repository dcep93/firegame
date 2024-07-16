import { LobbyType } from "../../../../shared/store";

export interface CardType {
  name: string;
  age: Age;
  color: Color;
  cost: Resource[];
  upgradesTo?: Upgrade;
  upgradesFrom?: Upgrade;
  extra: {
    resource?: Resource[];
    resourceOptions?: Resource[];
    points?: number;
    military?: number;
    science?: ScienceEnum;
    discount?: Resource[];
    f?: () => void;
    guild?: (player: PlayerType) => number;
    godUpgrade?: God;
  };
  message?: string;
}

export enum Age {
  one = 1,
  two,
  three,
  guild,
  temple,
}

export enum Resource {
  money = "$",
  clay = "🧱",
  stone = "⽯",
  wood = "🌲",
  paper = "🧻",
  glass = "🔹",
}

export enum Color {
  brown,
  grey,
  yellow,
  red,
  blue,
  green,
  purple,
}

export enum ScienceEnum {
  wheel,
  a,
  writing,
  bowl,
  astrolabe,
  tablet,
  law,
}

export enum Upgrade {
  lamp,
  target,
  water,
  crescent,
  mask,
  horseshoe,
  vase,
  barrel,
  helmet,
  sword,
  pillar,
  sun,
  crown,
  book,
  gear,
  capital,
  harp,
}

export enum God {
  egyptian,
  mesopotamian,
  greek,
  roman,
  phoenician,
}

export enum ScienceToken {
  agriculture = "$6 + 4 points",
  mathematics = "3 points / science token",
  urbanism = "$6 + $4 when upgrading",
  polioretics = "siege $1 / military",
  architecture = "free wonders",
  law = "extra science symbol",
  economy = "opponents pay you when buying",
  masonry = "free blue cards",
  mysticism = "2 points per god token",
  engineering = "upgrades cost $1",
  philosophy = "7 points",
  theology = "go again when building wonder",
  strategy = "military moves extra",
}

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  age: Age;
  structure: StructureCardType[][];
  trash?: number[];
  commercials?: CommercialType[];
  sciences: { taken?: boolean; token: ScienceToken }[];
  wentFirst: number;
  wondersToChoose: number[];
  military: number;

  discounts: number[];
  godTokens: God[];
  gods: { [g in God]: number[] };
  pantheon: number[];
  minerva?: number;
  astarte?: number;
  enki?: ScienceToken[];
};

export type Params = {
  lobby: LobbyType;
  godExpansion: boolean;
  randomStarting: boolean;
};

export type StructureCardType = {
  cardIndex: number;
  offset: number;
  revealed: boolean;
  taken: boolean;
};

export type PlayerType = {
  userId: string;
  userName: string;
  cards?: number[];
  wonders: PlayerWonder[];
  money: number;
  militaryBonuses: { [x: number]: number };
  index: number;
  scienceTokens?: ScienceToken[];
  tokens?: TokenType[];
  gods?: number[];
  scienceIcons?: { [x in ScienceEnum]?: number };
};

export type PlayerWonder = { built: boolean; wonderIndex: number };

export type TokenType = {
  value: God | number;
  isGod: boolean;
};

export type CommercialType = {
  commercial: CommercialEnum;
  playerIndex: number;
  library?: ScienceToken[];
};

export enum CommercialEnum {
  science = "select a science token",
  chooseWonder = "choose a wonder",
  destroyGrey = "destroy a grey card",
  destroyBrown = "destroy a brown card",
  revive = "construct a card from discard",
  library = "choose a science token",
  destroyWonder = "destroy one of your wonders",
  pickGod = "choose a god to add to the pantheon",
  anubis = "unbuild a wonder",
  ra = "steal an unbuilt wonder",
  isis = "use a card from the trash to build a wonder",
  zeus = "destoy a card from the strucutre",
  nisaba = "copy a science card",
  enki = "select 1 / 2 science tokens",
  baal = "steal a brown/grey card",
  theater = "pick a god",
  gate = "pick a top god",
  minerva = "place Minerva",
}

export type WonderType = {
  name: string;
  cost: Resource[];
  message: string;
  f: () => void;
  goAgain?: boolean;
  points?: number;
  expansion?: boolean;
  resourceOptions?: Resource[];
};

export type GodType = {
  name: string;
  source?: God;
  message: string;
  f: () => void;
  points?: () => number;
};
