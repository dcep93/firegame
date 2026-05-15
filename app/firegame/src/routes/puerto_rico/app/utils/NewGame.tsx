import { LobbyType } from "../../../../shared/store";
import {
  BUILDING_IDS,
  BuildingId,
  GOOD_IDS,
  GoodId,
  MAX_ISLAND_SPACES,
  PlantationId,
  QUARRY_COUNT,
  RoleId,
  SETUP,
  emptyGoods,
  playerCount,
} from "./rules";
import utils, { store } from "./utils";

export type Phase =
  | "role"
  | "settler"
  | "mayor"
  | "builder"
  | "craftsman_bonus"
  | "trader"
  | "captain"
  | "storage"
  | "game_over";

export type Params = {
  lobby: LobbyType;
};

export type PlantationTile = {
  id: PlantationId;
  colonists: number;
};

export type BuildingTile = {
  id: BuildingId;
  colonists: number;
};

export type CargoShip = {
  capacity: number;
  good?: GoodId;
  count: number;
};

export type RoleCard = {
  id: RoleId;
  doubloons: number;
  takenBy?: number;
};

export type PlayerType = {
  userId: string;
  userName: string;
  index: number;
  doubloons: number;
  victoryPoints: number;
  goods: Record<GoodId, number>;
  island: PlantationTile[];
  city: BuildingTile[];
  sanJuan: number;
  captainBonusTaken?: boolean;
};

export type ScoreLine = {
  playerIndex: number;
  shipped: number;
  buildings: number;
  largeBuildings: number;
  total: number;
  tieBreaker: number;
};

export type GameType = {
  params: Params;
  currentPlayer: number;
  players: PlayerType[];
  phase: Phase;
  round: number;
  governor: number;
  rolePicker: number;
  activeRole?: RoleId;
  roleOwner?: number;
  selectedRoles: RoleId[];
  actionQueue: number[];
  roles: RoleCard[];
  bank: {
    plantationDeck: GoodId[];
    plantationDiscard: GoodId[];
    plantationRow: GoodId[];
    quarrySupply: number;
    colonistSupply: number;
    colonistShip: number;
    goodsSupply: Record<GoodId, number>;
    victoryPoints: number;
    cargoShips: CargoShip[];
    tradingHouse: GoodId[];
    buildingSupply: Record<BuildingId, number>;
  };
  producedGoods?: { [playerIndex: number]: GoodId[] };
  endTriggered?: string;
  scores?: ScoreLine[];
};

function NewGame(params: Params): PromiseLike<GameType> {
  const count = playerCount(Object.keys(params.lobby).length);
  const setup = SETUP[count];
  const game: GameType = {
    params,
    currentPlayer: 0,
    players: [],
    phase: "role",
    round: 1,
    governor: 0,
    rolePicker: 0,
    selectedRoles: [],
    actionQueue: [],
    roles: setup.roles.map((id) => ({ id, doubloons: 0 })),
    bank: {
      plantationDeck: buildPlantationDeck(),
      plantationDiscard: [],
      plantationRow: [],
      quarrySupply: QUARRY_COUNT,
      colonistSupply: setup.colonists - count,
      colonistShip: count,
      goodsSupply: emptyGoods(),
      victoryPoints: setup.victoryPoints,
      cargoShips: setup.shipSizes.map((capacity) => ({ capacity, count: 0 })),
      tradingHouse: [],
      buildingSupply: BUILDING_IDS.reduce(
        (prev, id) => ({ ...prev, [id]: utils.building(id).supply }),
        {} as Record<BuildingId, number>
      ),
    },
  };
  GOOD_IDS.forEach((good) => (game.bank.goodsSupply[good] = utils.goodSupply(good)));
  return Promise.resolve(game).then(setPlayers).then(setStartingPlantations).then(refillPlantations);
}

function buildPlantationDeck(): GoodId[] {
  return utils.shuffle(
    GOOD_IDS.flatMap((good) => utils.repeat(good, utils.plantationCount(good)))
  );
}

function setPlayers(game: GameType): GameType {
  const count = playerCount(Object.keys(store.lobby).length);
  const setup = SETUP[count];
  game.players = utils
    .shuffle(Object.entries(store.lobby))
    .sort((a, b) => (b[0] === store.me.userId ? 1 : -1))
    .map(([userId, userName], index) => ({
      userId,
      userName,
      index,
      doubloons: setup.startingDoubloons,
      victoryPoints: 0,
      goods: emptyGoods(),
      island: [],
      city: [],
      sanJuan: 0,
    }));
  game.currentPlayer = 0;
  game.governor = 0;
  game.rolePicker = 0;
  return game;
}

function setStartingPlantations(game: GameType): GameType {
  const setup = SETUP[playerCount(game.players.length)];
  setup.startingPlantations.forEach((good, index) => {
    const player = game.players[index];
    player.island.push({ id: good, colonists: 0 });
    removeOne(game.bank.plantationDeck, good);
  });
  return game;
}

function refillPlantations(game: GameType): GameType {
  game.bank.plantationRow = [];
  while (
    game.bank.plantationRow.length < game.players.length + 1 &&
    (game.bank.plantationDeck.length > 0 || game.bank.plantationDiscard.length > 0)
  ) {
    if (game.bank.plantationDeck.length === 0) {
      game.bank.plantationDeck = utils.shuffle(game.bank.plantationDiscard.splice(0));
    }
    game.bank.plantationRow.push(game.bank.plantationDeck.shift()!);
  }
  return game;
}

function removeOne<T>(items: T[], value: T): void {
  const index = items.indexOf(value);
  if (index >= 0) items.splice(index, 1);
}

export function hasIslandSpace(player: PlayerType): boolean {
  return player.island.length < MAX_ISLAND_SPACES;
}

export default NewGame;
