import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import NewGame, {
  BuildingTile,
  GameType,
  Params,
  Phase,
  PlayerType,
  ScoreLine,
} from "./NewGame";
import {
  BUILDINGS,
  BuildingId,
  BuildingRule,
  BUILDING_QUARRY_CAP,
  GOOD_IDS,
  GOODS_SUPPLY,
  GoodId,
  MAX_CITY_SPACES,
  MAX_ISLAND_SPACES,
  PLANTATION_COUNTS,
  PlantationId,
  ROLE_KIND,
  RoleId,
  SETUP,
  TRADER_PRICES,
  TRADING_HOUSE_SIZE,
  playerCount,
} from "./rules";

const store: StoreType<GameType> = store_;

class Utils extends SharedUtils<GameType, PlayerType> {
  normalizeGame(game: GameType = store.gameW.game): GameType {
    if (!game) return game;
    game.players = this.asArray(game.players).map((player, index) => {
      player.index = player.index ?? index;
      player.doubloons = player.doubloons ?? 0;
      player.victoryPoints = player.victoryPoints ?? 0;
      player.sanJuan = player.sanJuan ?? 0;
      player.goods = this.normalizeGoods(player.goods);
      player.island = this.asArray(player.island).map((tile) => ({
        ...tile,
        colonists: tile.colonists ?? 0,
      }));
      player.city = this.asArray(player.city).map((tile) => ({
        ...tile,
        colonists: tile.colonists ?? 0,
      }));
      return player;
    });

    game.phase = game.phase || "role";
    game.round = game.round || 1;
    game.governor = game.governor || 0;
    game.rolePicker = game.rolePicker || 0;
    game.currentPlayer = game.currentPlayer || 0;
    game.selectedRoles = this.asArray(game.selectedRoles);
    game.actionQueue = this.asArray(game.actionQueue);
    game.producedGoods = this.normalizeProducedGoods(game.producedGoods);
    game.scores = game.scores ? this.asArray(game.scores) : game.scores;

    const count = game.players.length;
    const setup = count === 3 || count === 4 || count === 5 ? SETUP[count] : undefined;
    game.roles = this.asArray(game.roles);
    if (game.roles.length === 0 && setup) {
      game.roles = setup.roles.map((id) => ({ id, doubloons: 0 }));
    }
    game.roles.forEach((role) => {
      role.doubloons = role.doubloons || 0;
    });

    if (!game.bank) {
      // @ts-ignore normalizing Firebase-pruned runtime data
      game.bank = {};
    }
    game.bank.plantationDeck = this.asArray(game.bank.plantationDeck);
    game.bank.plantationDiscard = this.asArray(game.bank.plantationDiscard);
    game.bank.plantationRow = this.asArray(game.bank.plantationRow);
    game.bank.quarrySupply = game.bank.quarrySupply ?? 0;
    game.bank.colonistSupply = game.bank.colonistSupply ?? 0;
    game.bank.colonistShip = game.bank.colonistShip ?? 0;
    game.bank.goodsSupply = this.normalizeGoods(game.bank.goodsSupply);
    game.bank.victoryPoints = game.bank.victoryPoints ?? 0;
    game.bank.cargoShips = this.asArray(game.bank.cargoShips);
    if (game.bank.cargoShips.length === 0 && setup) {
      game.bank.cargoShips = setup.shipSizes.map((capacity) => ({
        capacity,
        count: 0,
      }));
    }
    game.bank.cargoShips.forEach((ship) => {
      ship.count = ship.count ?? 0;
    });
    game.bank.tradingHouse = this.asArray(game.bank.tradingHouse);
    game.bank.buildingSupply = this.normalizeBuildingSupply(
      game.bank.buildingSupply
    );
    return game;
  }

  asArray<T>(value: T[] | { [key: string]: T } | undefined): T[] {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return Object.keys(value)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((key) => value[key]);
  }

  normalizeGoods(value: Partial<Record<GoodId, number>> | undefined): Record<GoodId, number> {
    const goods = { corn: 0, indigo: 0, sugar: 0, tobacco: 0, coffee: 0 };
    GOOD_IDS.forEach((good) => (goods[good] = value?.[good] ?? 0));
    return goods;
  }

  normalizeBuildingSupply(
    value: Partial<Record<BuildingId, number>> | undefined
  ): Record<BuildingId, number> {
    return (Object.keys(BUILDINGS) as BuildingId[]).reduce(
      (prev, buildingId) => ({
        ...prev,
        [buildingId]: value?.[buildingId] ?? 0,
      }),
      {} as Record<BuildingId, number>
    );
  }

  normalizeProducedGoods(
    value: { [playerIndex: number]: GoodId[] } | undefined
  ): { [playerIndex: number]: GoodId[] } | undefined {
    if (!value) return value;
    return Object.fromEntries(
      Object.entries(value).map(([key, goods]) => [key, this.asArray(goods)])
    );
  }

  newGame(params: Params) {
    return NewGame(params);
  }

  building(id: BuildingId): BuildingRule {
    return BUILDINGS[id];
  }

  hasImplementedPower(buildingId: BuildingId): boolean {
    return !!BUILDINGS[buildingId];
  }

  hasOccupiedBuilding(player: PlayerType, buildingId: BuildingId): boolean {
    return player.city.some((tile) => tile.id === buildingId && tile.colonists > 0);
  }

  goodSupply(good: GoodId): number {
    return GOODS_SUPPLY[good];
  }

  plantationCount(good: GoodId): number {
    return PLANTATION_COUNTS[good];
  }

  isRolePicker(): boolean {
    const game = store.gameW.game;
    return game.phase === "role" && game.players[game.rolePicker]?.userId === store.me.userId;
  }

  chooseRole(roleId: RoleId): void {
    const game = store.gameW.game;
    if (!this.isRolePicker()) return alert("not your role choice");
    const role = game.roles.find((r) => r.id === roleId);
    if (!role || role.takenBy !== undefined) return alert("that role is not available");

    const player = game.players[game.rolePicker];
    player.doubloons += role.doubloons;
    role.doubloons = 0;
    role.takenBy = player.index;
    game.selectedRoles.push(roleId);
    game.activeRole = roleId;
    game.roleOwner = player.index;

    const kind = ROLE_KIND[roleId];
    if (kind === "prospector") {
      player.doubloons += 1;
      this.finishRole(`${player.userName} prospected`);
      return;
    }
    if (kind === "mayor") this.startMayor();
    else if (kind === "craftsman") this.startCraftsman();
    else this.startTurnPhase(kind);
    store.update(`${player.userName} chose ${kind}`);
  }

  startTurnPhase(phase: Exclude<Phase, "role" | "craftsman_bonus" | "game_over">): void {
    const game = store.gameW.game;
    game.phase = phase;
    game.actionQueue = this.turnOrder(game.roleOwner!);
    this.advanceToNextAction();
  }

  startMayor(): void {
    const game = store.gameW.game;
    const owner = game.players[game.roleOwner!];
    this.takeColonists(owner, 1);
    let index = game.roleOwner!;
    while (game.bank.colonistShip > 0) {
      game.players[index].sanJuan += 1;
      game.bank.colonistShip -= 1;
      index = this.playerIndexByIndex(index + 1, game);
    }
    this.startTurnPhase("mayor");
  }

  startCraftsman(): void {
    const game = store.gameW.game;
    game.phase = "craftsman_bonus";
    game.producedGoods = {};
    this.turnOrder(game.roleOwner!).forEach((playerIndex) => {
      const player = game.players[playerIndex];
      game.producedGoods![playerIndex] = this.produceFor(player);
      this.payFactoryBonus(player, game.producedGoods![playerIndex]);
    });
    const ownerProduced = game.producedGoods[game.roleOwner!].filter(
      (good) => game.bank.goodsSupply[good] > 0
    );
    if (ownerProduced.length > 0) {
      game.currentPlayer = game.roleOwner!;
    } else {
      this.finishRole("produced goods");
    }
  }

  turnOrder(start: number): number[] {
    return this.count(store.gameW.game.players.length).map((i) =>
      this.playerIndexByIndex(start + i)
    );
  }

  advanceToNextAction(): void {
    const game = store.gameW.game;
    while (game.actionQueue.length > 0) {
      const next = game.actionQueue[0];
      game.currentPlayer = next;
      if (this.playerHasAction(next, game.phase)) return;
      game.actionQueue.shift();
    }
    if (game.phase === "trader" && game.bank.tradingHouse.length === TRADING_HOUSE_SIZE) {
      this.emptyTradingHouse();
    }
    if (game.phase === "captain") {
      this.startStorage();
      return;
    }
    if (game.phase === "storage") {
      this.unloadFullShips();
    }
    this.finishRole(`${game.phase} finished`);
  }

  playerHasAction(playerIndex: number, phase: Phase): boolean {
    const player = store.gameW.game.players[playerIndex];
    if (phase === "settler") return this.canSettle(playerIndex);
    if (phase === "mayor") return player.sanJuan > 0 || this.hasAnyColonists(player);
    if (phase === "builder") return this.buildableBuildings(player).length > 0;
    if (phase === "trader") return this.tradeGoods(player).length > 0;
    if (phase === "captain") return this.hasCaptainAction(player);
    if (phase === "storage") return !this.canStoreCurrentGoods(player);
    return false;
  }

  assertMyAction(phase: Phase): boolean {
    if (!this.isMyTurn()) {
      alert("not your turn");
      return false;
    }
    if (store.gameW.game.phase !== phase) {
      alert(`not the ${phase} phase`);
      return false;
    }
    return true;
  }

  canSettle(playerIndex: number): boolean {
    const game = store.gameW.game;
    const player = game.players[playerIndex];
    return (
      player.island.length < MAX_ISLAND_SPACES &&
      (game.bank.plantationRow.length > 0 ||
        this.canSettleQuarry(player))
    );
  }

  canSettleQuarry(player: PlayerType | undefined): boolean {
    if (!player) return false;
    const game = store.gameW.game;
    return (
      player.island.length < MAX_ISLAND_SPACES &&
      game.bank.quarrySupply > 0 &&
      (player.index === game.roleOwner || this.hasOccupiedBuilding(player, "construction_hut"))
    );
  }

  canUseHacienda(player: PlayerType | undefined): boolean {
    if (!player) return false;
    const game = store.gameW.game;
    return (
      game.phase === "settler" &&
      !player.haciendaUsed &&
      player.island.length < MAX_ISLAND_SPACES &&
      this.hasOccupiedBuilding(player, "hacienda") &&
      (game.bank.plantationDeck.length > 0 || game.bank.plantationDiscard.length > 0)
    );
  }

  takeHaciendaPlantation(): void {
    if (!this.assertMyAction("settler")) return;
    const player = this.getCurrent();
    if (!this.canUseHacienda(player)) return alert("hacienda is not available");
    const good = this.drawPlantation();
    if (!good) return alert("no face-down plantations remain");
    player.haciendaUsed = true;
    player.island.push({ id: good, colonists: 0 });
    store.update(`${player.userName} used hacienda for ${good}`);
  }

  settlePlantation(index: number): void {
    if (!this.assertMyAction("settler")) return;
    const game = store.gameW.game;
    const player = this.getCurrent();
    if (player.island.length >= MAX_ISLAND_SPACES) return alert("island is full");
    const good = game.bank.plantationRow[index];
    if (!good) return alert("that plantation is not available");
    game.bank.plantationRow.splice(index, 1);
    this.placeIslandTile(player, good, true);
    this.finishAction(`${player.userName} settled ${good}`);
  }

  settleQuarry(): void {
    if (!this.assertMyAction("settler")) return;
    const game = store.gameW.game;
    const player = this.getCurrent();
    if (!this.canSettleQuarry(player)) return alert("you cannot take a quarry");
    if (player.island.length >= MAX_ISLAND_SPACES) return alert("island is full");
    if (game.bank.quarrySupply <= 0) return alert("no quarries remain");
    game.bank.quarrySupply -= 1;
    this.placeIslandTile(player, "quarry", true);
    this.finishAction(`${player.userName} settled a quarry`);
  }

  skipAction(): void {
    const game = store.gameW.game;
    if (!this.isMyTurn()) return alert("not your turn");
    if (!["settler", "builder", "trader"].includes(game.phase)) return alert("you must act");
    this.finishAction(`${this.getCurrent().userName} passed`);
  }

  clearColonists(): void {
    if (!this.assertMyAction("mayor")) return;
    const player = this.getCurrent();
    player.island.forEach((tile) => {
      player.sanJuan += tile.colonists;
      tile.colonists = 0;
    });
    player.city.forEach((tile) => {
      player.sanJuan += tile.colonists;
      tile.colonists = 0;
    });
    store.update(`${player.userName} recalled colonists`);
  }

  assignColonist(target: "island" | "city", index: number): void {
    if (!this.assertMyAction("mayor")) return;
    const player = this.getCurrent();
    if (player.sanJuan <= 0) return alert("no colonists in San Juan");
    const tile = target === "island" ? player.island[index] : player.city[index];
    if (!tile) return;
    if (tile.colonists >= this.tileCapacity(tile)) return alert("that tile is full");
    tile.colonists += 1;
    player.sanJuan -= 1;
    store.update(`${player.userName} placed a colonist`);
  }

  removeColonist(target: "island" | "city", index: number): void {
    if (!this.assertMyAction("mayor")) return;
    const player = this.getCurrent();
    const tile = target === "island" ? player.island[index] : player.city[index];
    if (!tile || tile.colonists <= 0) return;
    tile.colonists -= 1;
    player.sanJuan += 1;
    store.update(`${player.userName} moved a colonist to San Juan`);
  }

  finishMayor(): void {
    if (!this.assertMyAction("mayor")) return;
    const player = this.getCurrent();
    if (player.sanJuan > 0 && this.emptyColonistSpaces(player) > 0) {
      return alert("place all available colonists first");
    }
    this.finishAction(`${player.userName} finished placing colonists`);
  }

  buildBuilding(buildingId: BuildingId): void {
    if (!this.assertMyAction("builder")) return;
    const game = store.gameW.game;
    const player = this.getCurrent();
    const error = this.buildError(player, buildingId);
    if (error) return alert(error);
    const cost = this.buildingCost(player, buildingId, player.index === game.roleOwner);
    player.doubloons -= cost;
    const building: BuildingTile = { id: buildingId, colonists: 0 };
    player.city.push(building);
    game.bank.buildingSupply[buildingId] -= 1;
    if (this.hasOccupiedBuilding(player, "university")) this.takeColonistForTile(building);
    if (this.citySpaces(player) >= MAX_CITY_SPACES) {
      game.endTriggered = `${player.userName} filled all city spaces`;
    }
    this.finishAction(`${player.userName} built ${buildingId}`);
  }

  buildError(player: PlayerType, buildingId: BuildingId): string | null {
    const rule = this.building(buildingId);
    if ((store.gameW.game.bank.buildingSupply[buildingId] || 0) <= 0) return "none remain";
    if (player.city.some((building) => building.id === buildingId)) return "already built";
    if (this.citySpaces(player) + rule.size > MAX_CITY_SPACES) return "not enough city space";
    if (player.doubloons < this.buildingCost(player, buildingId, player.index === store.gameW.game.roleOwner)) {
      return "not enough doubloons";
    }
    return null;
  }

  buildableBuildings(player: PlayerType): BuildingId[] {
    return (Object.keys(BUILDINGS) as BuildingId[]).filter(
      (buildingId) => this.buildError(player, buildingId) === null
    );
  }

  buildingCost(player: PlayerType, buildingId: BuildingId, hasBuilderPrivilege: boolean): number {
    const rule = this.building(buildingId);
    const quarryDiscount = Math.min(this.occupiedQuarries(player), this.quarryCap(buildingId));
    const builderDiscount = hasBuilderPrivilege ? 1 : 0;
    return Math.max(0, rule.cost - quarryDiscount - builderDiscount);
  }

  quarryCap(buildingId: BuildingId): number {
    return BUILDING_QUARRY_CAP[buildingId];
  }

  chooseCraftsmanBonus(good: GoodId): void {
    if (!this.assertMyAction("craftsman_bonus")) return;
    const game = store.gameW.game;
    const produced = game.producedGoods?.[game.roleOwner!] || [];
    if (!produced.includes(good)) return alert("choose a good you produced");
    if (game.bank.goodsSupply[good] <= 0) return alert("that supply is empty");
    this.getCurrent().goods[good] += 1;
    game.bank.goodsSupply[good] -= 1;
    this.finishRole(`${this.getCurrent().userName} took an extra ${good}`);
  }

  skipCraftsmanBonus(): void {
    if (!this.assertMyAction("craftsman_bonus")) return;
    this.finishRole(`${this.getCurrent().userName} skipped the extra good`);
  }

  produceFor(player: PlayerType): GoodId[] {
    const produced: GoodId[] = [];
    GOOD_IDS.forEach((good) => {
      const amount = Math.min(this.productionCapacity(player, good), store.gameW.game.bank.goodsSupply[good]);
      if (amount <= 0) return;
      player.goods[good] += amount;
      store.gameW.game.bank.goodsSupply[good] -= amount;
      produced.push(good);
    });
    return produced;
  }

  payFactoryBonus(player: PlayerType, produced: GoodId[]): void {
    if (!this.hasOccupiedBuilding(player, "factory")) return;
    const bonusByKindCount = [0, 0, 1, 2, 3, 5];
    player.doubloons += bonusByKindCount[produced.length] || 0;
  }

  productionCapacity(player: PlayerType, good: GoodId): number {
    const plantations = player.island.filter((tile) => tile.id === good && tile.colonists > 0).length;
    if (good === "corn") return plantations;
    const buildingCapacity = player.city
      .filter((tile) => this.building(tile.id).good === good)
      .map((tile) => Math.min(tile.colonists, this.building(tile.id).capacity || 0))
      .sum();
    return Math.min(plantations, buildingCapacity);
  }

  tradeGoods(player: PlayerType): GoodId[] {
    const game = store.gameW.game;
    if (game.bank.tradingHouse.length >= TRADING_HOUSE_SIZE) return [];
    const hasOffice = this.hasOccupiedBuilding(player, "office");
    return GOOD_IDS.filter(
      (good) => player.goods[good] > 0 && (hasOffice || !game.bank.tradingHouse.includes(good))
    );
  }

  sellGood(good: GoodId): void {
    if (!this.assertMyAction("trader")) return;
    const game = store.gameW.game;
    const player = this.getCurrent();
    if (!this.tradeGoods(player).includes(good)) return alert("that good cannot be sold");
    player.goods[good] -= 1;
    player.doubloons +=
      TRADER_PRICES[good] +
      (player.index === game.roleOwner ? 1 : 0) +
      this.marketBonus(player);
    game.bank.tradingHouse.push(good);
    this.finishAction(`${player.userName} sold ${good}`);
  }

  marketBonus(player: PlayerType): number {
    return (
      (this.hasOccupiedBuilding(player, "small_market") ? 1 : 0) +
      (this.hasOccupiedBuilding(player, "large_market") ? 2 : 0)
    );
  }

  hasCaptainAction(player: PlayerType): boolean {
    return this.shipOptions(player).length > 0 || this.wharfOptions(player).length > 0;
  }

  shipOptions(player: PlayerType): { good: GoodId; shipIndex: number; amount: number }[] {
    const options = GOOD_IDS.flatMap((good) => this.shipOptionsForGood(player, good));
    const byGood = new Map<GoodId, number>();
    options.forEach((option) => {
      byGood.set(option.good, Math.max(byGood.get(option.good) || 0, option.amount));
    });
    return options.filter((option) => option.amount === byGood.get(option.good));
  }

  shipOptionsForGood(player: PlayerType, good: GoodId): { good: GoodId; shipIndex: number; amount: number }[] {
    const game = store.gameW.game;
    if (player.goods[good] <= 0) return [];
    const matching = game.bank.cargoShips
      .map((ship, shipIndex) => ({ ship, shipIndex }))
      .filter(({ ship }) => ship.good === good && ship.count < ship.capacity);
    if (matching.length > 0) {
      return matching.map(({ ship, shipIndex }) => ({
        good,
        shipIndex,
        amount: Math.min(player.goods[good], ship.capacity - ship.count),
      }));
    }
    if (game.bank.cargoShips.some((ship) => ship.good === good)) return [];
    return game.bank.cargoShips
      .map((ship, shipIndex) => ({ ship, shipIndex }))
      .filter(({ ship }) => ship.good === undefined)
      .map(({ ship, shipIndex }) => ({
        good,
        shipIndex,
        amount: Math.min(player.goods[good], ship.capacity),
      }));
  }

  shipGood(good: GoodId, shipIndex: number): void {
    if (!this.assertMyAction("captain")) return;
    const player = this.getCurrent();
    const option = this.shipOptions(player).find(
      (candidate) => candidate.good === good && candidate.shipIndex === shipIndex
    );
    if (!option) return alert("that shipment is not legal");
    const ship = store.gameW.game.bank.cargoShips[shipIndex];
    ship.good = good;
    ship.count += option.amount;
    player.goods[good] -= option.amount;
    const bonus = player.index === store.gameW.game.roleOwner && !player.captainBonusTaken ? 1 : 0;
    player.captainBonusTaken = player.captainBonusTaken || bonus > 0;
    this.gainVictoryPoints(player, option.amount + bonus + this.harborBonus(player));
    this.finishCaptainTurn(`${player.userName} shipped ${option.amount} ${good}`);
  }

  wharfOptions(player: PlayerType): { good: GoodId; amount: number }[] {
    if (player.wharfUsed || !this.hasOccupiedBuilding(player, "wharf")) return [];
    return GOOD_IDS.filter((good) => player.goods[good] > 0).map((good) => ({
      good,
      amount: player.goods[good],
    }));
  }

  useWharf(good: GoodId): void {
    if (!this.assertMyAction("captain")) return;
    const player = this.getCurrent();
    const option = this.wharfOptions(player).find((candidate) => candidate.good === good);
    if (!option) return alert("that wharf shipment is not legal");
    player.goods[good] = 0;
    player.wharfUsed = true;
    store.gameW.game.bank.goodsSupply[good] += option.amount;
    const bonus = player.index === store.gameW.game.roleOwner && !player.captainBonusTaken ? 1 : 0;
    player.captainBonusTaken = player.captainBonusTaken || bonus > 0;
    this.gainVictoryPoints(player, option.amount + bonus + this.harborBonus(player));
    this.finishCaptainTurn(`${player.userName} used wharf for ${option.amount} ${good}`);
  }

  harborBonus(player: PlayerType): number {
    return this.hasOccupiedBuilding(player, "harbor") ? 1 : 0;
  }

  finishCaptainTurn(message: string): void {
    const game = store.gameW.game;
    game.actionQueue.shift();
    const order = this.turnOrder(this.playerIndexByIndex(game.currentPlayer + 1));
    const next = order.find((playerIndex) => this.hasCaptainAction(game.players[playerIndex]));
    if (next === undefined) {
      this.startStorage();
    } else {
      game.actionQueue = [next];
      game.currentPlayer = next;
      store.update(message);
    }
  }

  startStorage(): void {
    const game = store.gameW.game;
    game.phase = "storage";
    game.actionQueue = this.turnOrder(game.roleOwner!);
    this.advanceToNextAction();
  }

  discardGood(good: GoodId): void {
    if (!this.assertMyAction("storage")) return;
    const player = this.getCurrent();
    if (player.goods[good] <= 0) return;
    player.goods[good] -= 1;
    store.gameW.game.bank.goodsSupply[good] += 1;
    store.update(`${player.userName} discarded ${good}`);
  }

  finishStorage(): void {
    if (!this.assertMyAction("storage")) return;
    const player = this.getCurrent();
    if (!this.canStoreCurrentGoods(player)) return alert("discard goods until your warehouses can store them");
    this.finishAction(`${player.userName} stored goods`);
  }

  finishAction(message: string): void {
    store.gameW.game.actionQueue.shift();
    this.advanceToNextAction();
    store.update(message);
  }

  finishRole(message: string): void {
    const game = store.gameW.game;
    game.players.forEach((player) => {
      delete player.captainBonusTaken;
      delete player.haciendaUsed;
      delete player.wharfUsed;
    });
    delete game.activeRole;
    delete game.roleOwner;
    delete game.producedGoods;
    game.actionQueue = [];

    if (game.selectedRoles.length >= game.players.length) {
      this.finishRound();
    } else {
      game.phase = "role";
      game.rolePicker = this.playerIndexByIndex(game.governor + game.selectedRoles.length);
      game.currentPlayer = game.rolePicker;
    }
    store.update(message);
  }

  finishRound(): void {
    const game = store.gameW.game;
    if (game.endTriggered) {
      this.scoreGame();
      return;
    }
    game.roles.forEach((role) => {
      if (role.takenBy === undefined) role.doubloons += 1;
      delete role.takenBy;
    });
    game.selectedRoles = [];
    game.round += 1;
    game.phase = "role";
    game.governor = this.playerIndexByIndex(game.governor + 1);
    game.rolePicker = game.governor;
    game.currentPlayer = game.rolePicker;
  }

  refillColonistShip(): void {
    const game = store.gameW.game;
    const target = Math.max(
      game.players.length,
      game.players.map((player) => this.emptyBuildingSpaces(player)).sum()
    );
    const loaded = Math.min(target, game.bank.colonistSupply);
    game.bank.colonistSupply -= loaded;
    game.bank.colonistShip = loaded;
    if (loaded < target) game.endTriggered = "not enough colonists to refill the ship";
  }

  refillPlantations(): void {
    const game = store.gameW.game;
    game.bank.plantationDiscard.push(...game.bank.plantationRow.splice(0));
    game.bank.plantationRow = [];
    while (
      game.bank.plantationRow.length < game.players.length + 1 &&
      (game.bank.plantationDeck.length > 0 || game.bank.plantationDiscard.length > 0)
    ) {
      if (game.bank.plantationDeck.length === 0) {
        game.bank.plantationDeck = this.shuffle(game.bank.plantationDiscard.splice(0));
      }
      game.bank.plantationRow.push(game.bank.plantationDeck.shift()!);
    }
  }

  drawPlantation(): GoodId | undefined {
    const game = store.gameW.game;
    if (game.bank.plantationDeck.length === 0 && game.bank.plantationDiscard.length > 0) {
      game.bank.plantationDeck = this.shuffle(game.bank.plantationDiscard.splice(0));
    }
    return game.bank.plantationDeck.shift();
  }

  placeIslandTile(player: PlayerType, id: PlantationId, mayUseHospice: boolean): void {
    const tile = { id, colonists: 0 };
    player.island.push(tile);
    if (mayUseHospice && this.hasOccupiedBuilding(player, "hospice")) {
      this.takeColonistForTile(tile);
    }
  }

  takeColonistForTile(tile: BuildingTile | { id: PlantationId; colonists: number }): boolean {
    const game = store.gameW.game;
    if (game.bank.colonistSupply > 0) {
      game.bank.colonistSupply -= 1;
      tile.colonists += 1;
      return true;
    }
    if (game.bank.colonistShip > 0) {
      game.bank.colonistShip -= 1;
      tile.colonists += 1;
      return true;
    }
    return false;
  }

  unloadFullShips(): void {
    const game = store.gameW.game;
    game.bank.cargoShips.forEach((ship) => {
      if (ship.good && ship.count === ship.capacity) {
        game.bank.goodsSupply[ship.good] += ship.count;
        delete ship.good;
        ship.count = 0;
      }
    });
  }

  emptyTradingHouse(): void {
    const game = store.gameW.game;
    game.bank.tradingHouse.forEach((good) => (game.bank.goodsSupply[good] += 1));
    game.bank.tradingHouse = [];
  }

  gainVictoryPoints(player: PlayerType, amount: number): void {
    const game = store.gameW.game;
    player.victoryPoints += amount;
    if (game.bank.victoryPoints > 0 && amount >= game.bank.victoryPoints) {
      game.endTriggered = "the victory point supply was exhausted";
    }
    game.bank.victoryPoints = Math.max(0, game.bank.victoryPoints - amount);
  }

  scoreGame(): void {
    const game = store.gameW.game;
    game.phase = "game_over";
    game.scores = game.players
      .map((player): ScoreLine => {
        const buildings = player.city.map((tile) => this.building(tile.id).victoryPoints).sum();
        const largeBuildings = this.largeBuildingBonus(player);
        const tieBreaker = player.doubloons + Object.values(player.goods).sum();
        return {
          playerIndex: player.index,
          shipped: player.victoryPoints,
          buildings,
          largeBuildings,
          tieBreaker,
          total: player.victoryPoints + buildings + largeBuildings,
        };
      })
      .sort((a, b) => b.total - a.total || b.tieBreaker - a.tieBreaker);
    game.currentPlayer = game.scores[0].playerIndex;
  }

  largeBuildingBonus(player: PlayerType): number {
    return player.city
      .filter((tile) => this.building(tile.id).kind === "large" && tile.colonists > 0)
      .map((tile) => {
        if (tile.id === "guild_hall") {
          return player.city
            .filter((building) => this.building(building.id).kind === "production")
            .map((building) => (this.building(building.id).cost <= 2 ? 1 : 2))
            .sum();
        }
        if (tile.id === "residence") {
          return player.island.length >= 12 ? 7 : player.island.length === 11 ? 6 : player.island.length === 10 ? 5 : 4;
        }
        if (tile.id === "fortress") return Math.floor(this.totalColonists(player) / 3);
        if (tile.id === "customs_house") return Math.floor(player.victoryPoints / 4);
        if (tile.id === "city_hall") {
          return player.city.filter((building) => this.building(building.id).kind !== "production").length;
        }
        return 0;
      })
      .sum();
  }

  afterRoleCleanup(phase: Phase): void {
    if (phase === "settler") this.refillPlantations();
    if (phase === "mayor") this.refillColonistShip();
    if (phase === "trader" && store.gameW.game.bank.tradingHouse.length === TRADING_HOUSE_SIZE) {
      this.emptyTradingHouse();
    }
  }

  tileCapacity(tile: BuildingTile | { id: PlantationId; colonists: number }): number {
    if (this.isBuildingTile(tile)) return this.building(tile.id).capacity || 1;
    return 1;
  }

  isBuildingTile(tile: BuildingTile | { id: PlantationId; colonists: number }): tile is BuildingTile {
    return (BUILDINGS as Record<string, BuildingRule>)[tile.id] !== undefined;
  }

  hasAnyColonists(player: PlayerType): boolean {
    return player.sanJuan > 0 || this.totalColonists(player) > 0;
  }

  totalColonists(player: PlayerType): number {
    return (
      player.sanJuan +
      player.island.map((tile) => tile.colonists).sum() +
      player.city.map((tile) => tile.colonists).sum()
    );
  }

  emptyColonistSpaces(player: PlayerType): number {
    return player.island
      .map((tile) => this.tileCapacity(tile) - tile.colonists)
      .concat(player.city.map((tile) => this.tileCapacity(tile) - tile.colonists))
      .sum();
  }

  emptyBuildingSpaces(player: PlayerType): number {
    return player.city.map((tile) => this.tileCapacity(tile) - tile.colonists).sum();
  }

  occupiedQuarries(player: PlayerType): number {
    return player.island.filter((tile) => tile.id === "quarry" && tile.colonists > 0).length;
  }

  citySpaces(player: PlayerType): number {
    return player.city.map((building) => this.building(building.id).size).sum();
  }

  totalGoods(player: PlayerType): number {
    return Object.values(player.goods).sum();
  }

  canStoreCurrentGoods(player: PlayerType): boolean {
    const warehouseKinds =
      (this.hasOccupiedBuilding(player, "small_warehouse") ? 1 : 0) +
      (this.hasOccupiedBuilding(player, "large_warehouse") ? 2 : 0);
    const protectedGoods = Object.values(player.goods)
      .sort((a, b) => b - a)
      .slice(0, warehouseKinds)
      .sum();
    return this.totalGoods(player) - protectedGoods <= 1;
  }

  takeColonists(player: PlayerType, count: number): number {
    const amount = Math.min(count, store.gameW.game.bank.colonistSupply);
    player.sanJuan += amount;
    store.gameW.game.bank.colonistSupply -= amount;
    return amount;
  }

  getPhaseLabel(): string {
    const game = store.gameW.game;
    if (game.phase === "role") return "Choose role";
    return game.phase.replace("_", " ");
  }

  setupForCurrentPlayerCount() {
    return SETUP[playerCount(store.gameW.game.players.length)];
  }
}

const utils = new Utils();

const originalFinishRole = utils.finishRole.bind(utils);
utils.finishRole = (message: string) => {
  const phase = store.gameW.game.phase;
  utils.afterRoleCleanup(phase);
  originalFinishRole(message);
};

export default utils;
export { store };
