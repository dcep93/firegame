import SharedUtils from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { theme, workerText } from "../theme/base";
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
const MAYOR_DRAFT_EVENT = "puerto-rico-mayor-draft";
const PENDING_ACTION_EVENT = "puerto-rico-pending-action";

type PendingAction =
  | { phase: "settler"; kind: "hacienda" }
  | { phase: "settler"; kind: "plantation"; index: number; good: GoodId }
  | { phase: "settler"; kind: "quarry" }
  | { phase: "builder"; buildingId: BuildingId }
  | { phase: "trader"; good: GoodId }
  | { phase: "captain"; kind: "ship"; good: GoodId; shipIndex: number }
  | { phase: "captain"; kind: "shipGood"; good: GoodId }
  | { phase: "captain"; kind: "wharf"; good: GoodId }
  | { phase: "storage"; good: GoodId };

class Utils extends SharedUtils<GameType, PlayerType> {
  mayorDrafts: Record<string, PlayerType> = {};
  pendingAction?: PendingAction & { userId: string };

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
    game.autoPlayerIds = game.autoPlayerIds || {};
    game.playerTimers = game.playerTimers || {};
    game.players.forEach((player) => {
      game.playerTimers[player.userId] = game.playerTimers[player.userId] || 0;
    });
    game.turnStartedAt = game.turnStartedAt || store.gameW.info.timestamp || Date.now();
    game.selectedRoles = this.asArray(game.selectedRoles);
    game.actionQueue = this.asArray(game.actionQueue);
    const producedGoods = this.normalizeProducedGoods(game.producedGoods);
    if (producedGoods) game.producedGoods = producedGoods;
    else delete game.producedGoods;
    if (game.scores) game.scores = this.asArray(game.scores);
    else delete game.scores;

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
    if (!this.isRolePicker()) return alert("not your role choice");
    const message = this.chooseRoleForCurrent(roleId, true);
    if (message) store.update(message);
  }

  chooseRoleForCurrent(roleId: RoleId, shouldUpdateFinishedRole: boolean): string {
    const game = store.gameW.game;
    const role = game.roles.find((r) => r.id === roleId);
    if (!role || role.takenBy !== undefined) {
      if (shouldUpdateFinishedRole) alert("that role is not available");
      return "";
    }

    const player = game.players[game.rolePicker];
    const roleMoney = role.doubloons;
    player.doubloons += role.doubloons;
    role.doubloons = 0;
    role.takenBy = player.index;
    game.selectedRoles.push(roleId);
    game.activeRole = roleId;
    game.roleOwner = player.index;

    const kind = ROLE_KIND[roleId];
    if (kind === "prospector") {
      player.doubloons += 1;
      const message = theme.messages.prospected(player.userName, roleMoney + 1, theme.labels.doubloons);
      this.finishRole(message, [], shouldUpdateFinishedRole);
      return message;
    }
    const rewards = roleMoney > 0 ? [`${roleMoney} ${theme.labels.doubloons}`] : [];
    let autoMessages: string[] = [];
    if (kind === "mayor") {
      const workersTaken = this.startMayor(autoMessages, shouldUpdateFinishedRole);
      if (workersTaken > 0) rewards.push(workerText(workersTaken));
    } else if (kind === "craftsman") autoMessages = this.startCraftsman(autoMessages, shouldUpdateFinishedRole);
    else autoMessages = this.startTurnPhase(kind, autoMessages, shouldUpdateFinishedRole);
    const message = theme.messages.choseRole(player.userName, theme.roles[roleId], this.rewardText(rewards));
    return this.withAutoMessages(message, autoMessages);
  }

  startTurnPhase(
    phase: Exclude<Phase, "role" | "craftsman_bonus" | "game_over">,
    autoMessages: string[] = [],
    shouldUpdateFinishedRole = true
  ): string[] {
    const game = store.gameW.game;
    game.phase = phase;
    game.actionQueue = this.turnOrder(game.roleOwner!);
    return this.advanceToNextAction(autoMessages, shouldUpdateFinishedRole);
  }

  startMayor(autoMessages: string[] = [], shouldUpdateFinishedRole = true): number {
    const game = store.gameW.game;
    const owner = game.players[game.roleOwner!];
    const beforeSanJuan = owner.sanJuan;
    this.takeColonists(owner, 1);
    let index = game.roleOwner!;
    while (game.bank.colonistShip > 0) {
      game.players[index].sanJuan += 1;
      game.bank.colonistShip -= 1;
      index = this.playerIndexByIndex(index + 1, game);
    }
    this.startTurnPhase("mayor", autoMessages, shouldUpdateFinishedRole);
    return owner.sanJuan - beforeSanJuan;
  }

  startCraftsman(autoMessages: string[] = [], shouldUpdateFinishedRole = true): string[] {
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
      return this.advanceAutoCurrent(autoMessages, shouldUpdateFinishedRole);
    } else {
      this.finishRole(theme.messages.producedGoods(this.totalProducedKinds()), autoMessages, shouldUpdateFinishedRole);
      return autoMessages;
    }
  }

  turnOrder(start: number): number[] {
    return this.count(store.gameW.game.players.length).map((i) =>
      this.playerIndexByIndex(start + i)
    );
  }

  rewardText(rewards: string[]): string {
    if (rewards.length === 0) return "";
    if (rewards.length === 1) return ` and took ${rewards[0]}`;
    return ` and took ${rewards.slice(0, -1).join(", ")} and ${rewards[rewards.length - 1]}`;
  }

  advanceToNextAction(autoMessages: string[] = [], shouldUpdateFinishedRole = true): string[] {
    const game = store.gameW.game;
    while (game.actionQueue.length > 0) {
      const next = game.actionQueue[0];
      game.currentPlayer = next;
      if (this.playerHasAction(next, game.phase)) {
        if (this.isAutoPlayer(next)) {
          const autoMessage = this.autoPlayQueuedAction(game.players[next], [], shouldUpdateFinishedRole);
          if (autoMessage) autoMessages.push(this.fastForwardMessage(theme.phase[game.phase], autoMessage));
          continue;
        }
        if (game.phase === "captain") {
          const autoMessage = this.autoTakeForcedCaptainAction(game.players[next]);
          if (autoMessage) {
            autoMessages.push(this.fastForwardMessage(theme.phase.captain, autoMessage));
            this.rotateCaptainQueue();
            continue;
          }
        }
        if (game.phase === "storage") {
          let autoMessage = this.autoDiscardForcedStorageGood(game.players[next]);
          while (autoMessage) {
            autoMessages.push(this.fastForwardMessage(theme.phase.storage, autoMessage));
            autoMessage = this.autoDiscardForcedStorageGood(game.players[next]);
          }
          if (!this.playerHasAction(next, game.phase)) {
            game.actionQueue.shift();
            continue;
          }
        }
        return autoMessages;
      }
      game.actionQueue.shift();
    }
    if (game.phase === "trader" && game.bank.tradingHouse.length === TRADING_HOUSE_SIZE) {
      this.emptyTradingHouse();
    }
    if (game.phase === "captain") {
      autoMessages.push(this.fastForwardMessage(theme.phase.captain, theme.messages.phaseFinished(theme.phase.captain)));
      return this.startStorage(autoMessages, shouldUpdateFinishedRole);
    }
    if (game.phase === "storage") {
      this.unloadFullShips();
    }
    const phaseFinishedMessage = theme.messages.phaseFinished(theme.phase[game.phase]);
    if (!shouldUpdateFinishedRole) {
      autoMessages.push(this.fastForwardMessage(theme.phase[game.phase], phaseFinishedMessage));
    }
    this.finishRole(phaseFinishedMessage, autoMessages, shouldUpdateFinishedRole);
    return autoMessages;
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

  markAutoPlayer(playerIndex: number): void {
    const game = store.gameW.game;
    const player = game.players[playerIndex];
    if (!player) return;
    game.autoPlayerIds = game.autoPlayerIds || {};
    game.autoPlayerIds[player.userId] = true;
    const autoMessages = this.advanceAutoCurrent([], false);
    store.update(this.withAutoMessages(`${player.userName} marked for auto-play`, autoMessages));
  }

  isAutoPlayer(playerIndex: number): boolean {
    const game = store.gameW.game;
    const player = game.players[playerIndex];
    return !!player && !!game.autoPlayerIds?.[player.userId];
  }

  advanceAutoCurrent(autoMessages: string[] = [], shouldUpdateFinishedRole = true): string[] {
    const game = store.gameW.game;
    let guard = 0;
    while (guard++ < 200 && game.phase !== "game_over" && this.isAutoPlayer(game.currentPlayer)) {
      if (game.phase === "role") {
        const role = game.roles.find((candidate) => candidate.takenBy === undefined);
        if (!role) return autoMessages;
        autoMessages.push(this.fastForwardMessage(theme.phase.role, this.chooseRoleForCurrent(role.id, shouldUpdateFinishedRole)));
        continue;
      }
      if (game.phase === "craftsman_bonus") {
        autoMessages.push(this.fastForwardMessage(theme.phase.craftsman_bonus, this.autoChooseCraftsmanBonus(shouldUpdateFinishedRole)));
        continue;
      }
      if (game.actionQueue[0] !== game.currentPlayer) return autoMessages;
      return this.advanceToNextAction(autoMessages, shouldUpdateFinishedRole);
    }
    return autoMessages;
  }

  autoPlayQueuedAction(player: PlayerType, autoMessages: string[], shouldUpdateFinishedRole: boolean): string {
    const game = store.gameW.game;
    if (["settler", "builder", "trader"].includes(game.phase)) {
      return this.finishAction(theme.messages.passed(player.userName), false, autoMessages);
    }
    if (game.phase === "mayor") return this.autoFinishMayor(player, autoMessages, shouldUpdateFinishedRole);
    if (game.phase === "captain") return this.autoShipCaptain(player, autoMessages, shouldUpdateFinishedRole);
    if (game.phase === "storage") return this.autoStoreGoods(player, autoMessages);
    return "";
  }

  autoChooseCraftsmanBonus(shouldUpdateFinishedRole: boolean): string {
    const game = store.gameW.game;
    const player = game.players[game.currentPlayer];
    const good = (game.producedGoods?.[game.roleOwner || 0] || []).find(
      (candidate) => game.bank.goodsSupply[candidate] > 0
    );
    if (!good) {
      const message = theme.messages.skippedExtraGood(player.userName, this.totalProducedKinds());
      this.finishRole(message, [], shouldUpdateFinishedRole);
      return message;
    }
    player.goods[good] += 1;
    game.bank.goodsSupply[good] -= 1;
    const message = theme.messages.tookExtraGood(player.userName, theme.goods[good], 1, this.totalProducedKinds());
    this.finishRole(message, [], shouldUpdateFinishedRole);
    return message;
  }

  autoFinishMayor(player: PlayerType, autoMessages: string[], shouldUpdateFinishedRole: boolean): string {
    while (player.sanJuan > 0 && this.emptyColonistSpaces(player) > 0) {
      const tile = [...player.island, ...player.city].find((candidate) => candidate.colonists < this.tileCapacity(candidate));
      if (!tile) break;
      tile.colonists += 1;
      player.sanJuan -= 1;
    }
    const placed = this.placedColonists(player);
    const remaining = player.sanJuan;
    store.gameW.game.actionQueue.shift();
    this.advanceToNextAction(autoMessages, shouldUpdateFinishedRole);
    return theme.messages.finishedColonists(player.userName, placed, remaining);
  }

  autoShipCaptain(player: PlayerType, autoMessages: string[], shouldUpdateFinishedRole: boolean): string {
    const shipOption = this.shipOptions(player)[0];
    const message = shipOption
      ? this.shipGoodForPlayer(player, shipOption)
      : this.useWharfForPlayer(player, this.wharfOptions(player)[0]);
    this.rotateCaptainQueue();
    this.advanceToNextAction(autoMessages, shouldUpdateFinishedRole);
    return message;
  }

  autoStoreGoods(player: PlayerType, autoMessages: string[]): string {
    const discarded: string[] = [];
    while (!this.canStoreCurrentGoods(player)) {
      const good = GOOD_IDS.find((candidate) => player.goods[candidate] > 0);
      if (!good) break;
      const message = this.discardGoodForPlayer(player, good, false);
      if (message) discarded.push(message);
    }
    if (this.canStoreCurrentGoods(player)) {
      store.gameW.game.actionQueue.shift();
      this.advanceToNextAction(autoMessages, false);
      discarded.push(theme.messages.stored(player.userName, this.totalGoods(player)));
    }
    return discarded.join("; ");
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
    store.update(theme.messages.usedHacienda(player.userName, theme.plantations[good]));
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
    this.finishAction(theme.messages.settled(player.userName, theme.plantations[good]));
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
    this.finishAction(theme.messages.settledQuarry(player.userName));
  }

  skipAction(): void {
    if (!this.canPass()) {
      if (!this.isMyTurn()) return alert("not your turn");
      return alert("you must act");
    }
    this.finishAction(theme.messages.passed(this.getCurrent().userName));
  }

  canPass(): boolean {
    const game = store.gameW.game;
    return this.isMyTurn() && ["settler", "builder", "trader"].includes(game.phase);
  }

  subscribePendingAction(callback: () => void): () => void {
    window.addEventListener(PENDING_ACTION_EVENT, callback);
    return () => window.removeEventListener(PENDING_ACTION_EVENT, callback);
  }

  notifyPendingAction(): void {
    window.dispatchEvent(new Event(PENDING_ACTION_EVENT));
  }

  getPendingAction(): (PendingAction & { userId: string }) | undefined {
    const game = store.gameW.game;
    if (!this.pendingAction || !game) return undefined;
    if (this.pendingAction.userId !== store.me.userId) return undefined;
    if (this.pendingAction.phase !== game.phase) return undefined;
    const me = this.getMeOrUndefined();
    if (!me || !game.actionQueue.includes(me.index)) return undefined;
    return this.pendingAction;
  }

  setPendingAction(action: PendingAction): void {
    const next = { ...action, userId: store.me.userId };
    if (this.pendingActionsEqual(this.pendingAction, next)) delete this.pendingAction;
    else this.pendingAction = next;
    this.notifyPendingAction();
  }

  clearPendingAction(): void {
    if (!this.pendingAction) return;
    delete this.pendingAction;
    this.notifyPendingAction();
  }

  isPendingAction(action: PendingAction): boolean {
    const pending = this.getPendingAction();
    return this.pendingActionsEqual(pending, { ...action, userId: store.me.userId });
  }

  pendingActionsEqual(
    a: (PendingAction & { userId: string }) | undefined,
    b: PendingAction & { userId: string }
  ): boolean {
    if (!a || a.userId !== b.userId || a.phase !== b.phase) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  }

  canQueueActionForMe(phase: PendingAction["phase"]): boolean {
    const game = store.gameW.game;
    if (!game || game.phase !== phase) return false;
    const me = this.getMeOrUndefined();
    return !!me && game.actionQueue.includes(me.index);
  }

  getMeOrUndefined(): PlayerType | undefined {
    const game = store.gameW.game;
    return game?.players?.find((player) => player.userId === store.me.userId);
  }

  playPendingActionIfReady(): void {
    const game = store.gameW.game;
    const me = this.getMeOrUndefined();
    if (
      this.pendingAction?.userId === store.me.userId &&
      game &&
      (this.pendingAction.phase !== game.phase || !me || !game.actionQueue.includes(me.index))
    ) {
      this.clearPendingAction();
      return;
    }
    const pending = this.getPendingAction();
    if (!pending || !this.isMyTurn()) return;
    if (!this.isPendingActionLegal(pending)) {
      this.clearPendingAction();
      return;
    }
    this.clearPendingAction();
    this.playPendingAction(pending);
  }

  isPendingActionLegal(action: PendingAction): boolean {
    const player = this.getMeOrUndefined();
    if (!player || store.gameW.game.phase !== action.phase) return false;
    if (action.phase === "settler") {
      if (action.kind === "hacienda") return this.canUseHacienda(player);
      if (action.kind === "quarry") return this.canSettleQuarry(player);
      return store.gameW.game.bank.plantationRow[action.index] === action.good && player.island.length < MAX_ISLAND_SPACES;
    }
    if (action.phase === "builder") return this.buildError(player, action.buildingId) === null;
    if (action.phase === "trader") return this.tradeGoods(player).includes(action.good);
    if (action.phase === "captain") {
      if (action.kind === "wharf") return this.wharfOptions(player).some((option) => option.good === action.good);
      if (action.kind === "shipGood") return this.shipOptions(player).some((option) => option.good === action.good);
      return this.shipOptions(player).some(
        (option) => option.good === action.good && option.shipIndex === action.shipIndex
      );
    }
    if (action.phase === "storage") return player.goods[action.good] > 0 && !this.canStoreCurrentGoods(player);
    return false;
  }

  playPendingAction(action: PendingAction): void {
    if (action.phase === "settler") {
      if (action.kind === "hacienda") this.takeHaciendaPlantation();
      else if (action.kind === "quarry") this.settleQuarry();
      else this.settlePlantation(action.index);
    } else if (action.phase === "builder") this.buildBuilding(action.buildingId);
    else if (action.phase === "trader") this.sellGood(action.good);
    else if (action.phase === "captain") {
      if (action.kind === "wharf") this.useWharf(action.good);
      else if (action.kind === "shipGood") this.shipGoodFromBoard(action.good);
      else this.shipGood(action.good, action.shipIndex);
    } else if (action.phase === "storage") this.discardGood(action.good);
  }

  canManageMayor(player: PlayerType | undefined): boolean {
    const game = store.gameW.game;
    return (
      game.phase === "mayor" &&
      player?.userId === store.me.userId &&
      game.actionQueue.includes(player.index)
    );
  }

  getMayorPlayer(player: PlayerType): PlayerType {
    if (!this.canManageMayor(player)) return player;
    return this.mayorDrafts[player.userId] || player;
  }

  subscribeMayorDraft(callback: () => void): () => void {
    window.addEventListener(MAYOR_DRAFT_EVENT, callback);
    return () => window.removeEventListener(MAYOR_DRAFT_EVENT, callback);
  }

  notifyMayorDraft(): void {
    window.dispatchEvent(new Event(MAYOR_DRAFT_EVENT));
  }

  ensureMayorDraft(player: PlayerType): PlayerType {
    if (!this.mayorDrafts[player.userId]) {
      this.mayorDrafts[player.userId] = this.copy(player);
    }
    return this.mayorDrafts[player.userId];
  }

  clearMayorDraft(player: PlayerType): void {
    delete this.mayorDrafts[player.userId];
    this.notifyMayorDraft();
  }

  canFinishMayor(player: PlayerType | undefined): boolean {
    if (!player || !this.canManageMayor(player)) return false;
    return player.sanJuan === 0 || this.emptyColonistSpaces(player) === 0;
  }

  clearColonists(): void {
    const player = this.getMe();
    if (!this.assertMyMayorAction(player)) return;
    let recalled = 0;
    player.island.forEach((tile) => {
      recalled += tile.colonists;
      player.sanJuan += tile.colonists;
      tile.colonists = 0;
    });
    player.city.forEach((tile) => {
      recalled += tile.colonists;
      player.sanJuan += tile.colonists;
      tile.colonists = 0;
    });
    store.update(theme.messages.recalledColonists(player.userName, recalled));
  }

  assignColonist(target: "island" | "city", index: number): void {
    const basePlayer = this.getMe();
    if (!this.assertMyMayorAction(basePlayer)) return;
    const player = this.ensureMayorDraft(basePlayer);
    if (player.sanJuan <= 0) return alert(`${theme.labels.sanJuan} is empty`);
    const tile = target === "island" ? player.island[index] : player.city[index];
    if (!tile) return;
    if (tile.colonists >= this.tileCapacity(tile)) return alert("that tile is full");
    tile.colonists += 1;
    player.sanJuan -= 1;
    this.notifyMayorDraft();
  }

  removeColonist(target: "island" | "city", index: number): void {
    const basePlayer = this.getMe();
    if (!this.assertMyMayorAction(basePlayer)) return;
    const player = this.ensureMayorDraft(basePlayer);
    const tile = target === "island" ? player.island[index] : player.city[index];
    if (!tile || tile.colonists <= 0) return;
    tile.colonists -= 1;
    player.sanJuan += 1;
    this.notifyMayorDraft();
  }

  finishMayor(): void {
    const player = this.getMe();
    if (!this.assertMyMayorAction(player)) return;
    const draft = this.getMayorPlayer(player);
    if (!this.canFinishMayor(draft)) return alert(`empty ${theme.labels.sanJuan} first`);
    const game = store.gameW.game;
    const wasCurrent = game.currentPlayer === player.index;
    player.sanJuan = draft.sanJuan;
    player.island = draft.island;
    player.city = draft.city;
    const placed = this.placedColonists(player);
    const remaining = player.sanJuan;
    game.actionQueue = game.actionQueue.filter((playerIndex) => playerIndex !== player.index);
    if (wasCurrent) this.advanceToNextAction();
    this.clearMayorDraft(player);
    store.update(theme.messages.finishedColonists(player.userName, placed, remaining));
  }

  assertMyMayorAction(player: PlayerType): boolean {
    const game = store.gameW.game;
    if (game.phase !== "mayor") {
      alert(`not the ${theme.phase.mayor} phase`);
      return false;
    }
    if (!this.canManageMayor(player)) {
      alert("you already finished placing");
      return false;
    }
    return true;
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
    this.finishAction(theme.messages.built(player.userName, theme.buildings[buildingId], cost, theme.labels.doubloons));
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
    this.finishRole(theme.messages.tookExtraGood(this.getCurrent().userName, theme.goods[good], 1, this.totalProducedKinds()));
  }

  skipCraftsmanBonus(): void {
    if (!this.assertMyAction("craftsman_bonus")) return;
    this.finishRole(theme.messages.skippedExtraGood(this.getCurrent().userName, this.totalProducedKinds()));
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
    const price =
      TRADER_PRICES[good] +
      (player.index === game.roleOwner ? 1 : 0) +
      this.marketBonus(player);
    player.doubloons += price;
    game.bank.tradingHouse.push(good);
    this.finishAction(theme.messages.sold(player.userName, theme.goods[good], price, theme.labels.doubloons));
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
    this.finishCaptainTurn(this.shipGoodForPlayer(player, option));
  }

  shipGoodForPlayer(
    player: PlayerType,
    option: { good: GoodId; shipIndex: number; amount: number }
  ): string {
    const ship = store.gameW.game.bank.cargoShips[option.shipIndex];
    ship.good = option.good;
    ship.count += option.amount;
    player.goods[option.good] -= option.amount;
    const bonus = player.index === store.gameW.game.roleOwner && !player.captainBonusTaken ? 1 : 0;
    player.captainBonusTaken = player.captainBonusTaken || bonus > 0;
    const points = option.amount + bonus + this.harborBonus(player);
    this.gainVictoryPoints(player, points);
    return theme.messages.shipped(player.userName, option.amount, theme.goods[option.good], points);
  }

  shipGoodFromBoard(good: GoodId): void {
    if (!this.assertMyAction("captain")) return;
    const player = this.getCurrent();
    const options = this.shipOptions(player).filter((option) => option.good === good);
    if (options.length === 0) return alert("that shipment is not legal");
    const option = options.length === 1 ? options[0] : this.chooseShipOption(good, options);
    if (!option) return;
    this.shipGood(good, option.shipIndex);
  }

  chooseShipOption(
    good: GoodId,
    options: { good: GoodId; shipIndex: number; amount: number }[]
  ): { good: GoodId; shipIndex: number; amount: number } | undefined {
    const game = store.gameW.game;
    const lines = options.map((option, index) => {
      const ship = game.bank.cargoShips[option.shipIndex];
      const cargo = ship.good ? theme.goods[ship.good] : theme.labels.empty;
      return `${index + 1}: ${theme.labels.cargoShips} ${option.shipIndex + 1} (${cargo} ${ship.count}/${ship.capacity})`;
    });
    const choice = window.prompt(
      `${theme.actions.ship} ${theme.goods[good]} ${theme.actions.onShip}:\n${lines.join("\n")}`
    );
    if (choice === null) return undefined;
    const index = parseInt(choice, 10) - 1;
    if (!Number.isInteger(index) || !options[index]) {
      alert("choose one of the numbered options");
      return undefined;
    }
    return options[index];
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
    this.finishCaptainTurn(this.useWharfForPlayer(player, option));
  }

  useWharfForPlayer(player: PlayerType, option: { good: GoodId; amount: number }): string {
    player.goods[option.good] = 0;
    player.wharfUsed = true;
    store.gameW.game.bank.goodsSupply[option.good] += option.amount;
    const bonus = player.index === store.gameW.game.roleOwner && !player.captainBonusTaken ? 1 : 0;
    player.captainBonusTaken = player.captainBonusTaken || bonus > 0;
    const points = option.amount + bonus + this.harborBonus(player);
    this.gainVictoryPoints(player, points);
    return theme.messages.usedWharf(player.userName, option.amount, theme.goods[option.good], points);
  }

  autoTakeForcedCaptainAction(player: PlayerType): string | null {
    const shipActions = this.shipOptions(player).map((option) => ({
      kind: "ship" as const,
      option,
    }));
    const wharfActions = this.wharfOptions(player).map((option) => ({
      kind: "wharf" as const,
      option,
    }));
    const actions = [...shipActions, ...wharfActions];
    if (actions.length !== 1) return null;
    const action = actions[0];
    return action.kind === "ship"
      ? this.shipGoodForPlayer(player, action.option)
      : this.useWharfForPlayer(player, action.option);
  }

  harborBonus(player: PlayerType): number {
    return this.hasOccupiedBuilding(player, "harbor") ? 1 : 0;
  }

  finishCaptainTurn(message: string): void {
    this.rotateCaptainQueue();
    const autoMessages = this.advanceToNextAction([], false);
    store.update(this.withAutoMessages(message, autoMessages));
  }

  rotateCaptainQueue(): void {
    const game = store.gameW.game;
    const current = game.actionQueue.shift();
    if (current !== undefined) game.actionQueue.push(current);
  }

  startStorage(autoMessages: string[] = [], shouldUpdateFinishedRole = true): string[] {
    const game = store.gameW.game;
    game.phase = "storage";
    game.actionQueue = this.turnOrder(game.roleOwner!);
    return this.advanceToNextAction(autoMessages, shouldUpdateFinishedRole);
  }

  discardGood(good: GoodId): void {
    if (!this.assertMyAction("storage")) return;
    this.discardGoodForPlayer(this.getCurrent(), good);
  }

  discardGoodForPlayer(player: PlayerType, good: GoodId, shouldUpdate = true): string | null {
    if (player.goods[good] <= 0) return null;
    player.goods[good] -= 1;
    store.gameW.game.bank.goodsSupply[good] += 1;
    const message = theme.messages.discarded(player.userName, theme.goods[good], 1, this.totalGoods(player));
    if (shouldUpdate) {
      if (this.canStoreCurrentGoods(player)) this.finishAction(message);
      else store.update(message);
    }
    return message;
  }

  autoDiscardForcedStorageGood(player: PlayerType): string | null {
    const overflow = this.storageOverflow(player);
    if (overflow <= 0) return null;
    const forcedGoods = GOOD_IDS.filter((good) => {
      if (player.goods[good] <= 0) return false;
      const copy = { ...player, goods: { ...player.goods, [good]: player.goods[good] - 1 } };
      return this.storageOverflow(copy) < overflow;
    });
    if (forcedGoods.length !== 1) return null;
    return this.discardGoodForPlayer(player, forcedGoods[0], false);
  }

  finishStorage(): void {
    if (!this.assertMyAction("storage")) return;
    const player = this.getCurrent();
    if (!this.canStoreCurrentGoods(player)) return alert("discard goods until your warehouses can store them");
    this.finishAction(theme.messages.stored(player.userName, this.totalGoods(player)));
  }

  finishAction(message: string, shouldUpdate = true, autoMessages: string[] = []): string {
    store.gameW.game.actionQueue.shift();
    const generatedMessages = this.advanceToNextAction(autoMessages, shouldUpdate);
    const fullMessage = this.withAutoMessages(message, generatedMessages);
    if (shouldUpdate) store.update(fullMessage);
    return fullMessage;
  }

  finishRole(message: string, autoMessages: string[] = [], shouldUpdate = true): void {
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
    this.advanceAutoCurrent(autoMessages, false);
    if (shouldUpdate) store.update(this.withAutoMessages(message, autoMessages));
  }

  withAutoMessages(message: string, autoMessages: string[]): string {
    if (autoMessages.length === 0) return message;
    return [message, ...autoMessages].join("; ");
  }

  fastForwardMessage(phaseName: string, message: string): string {
    return `fast-forwarded ${phaseName}: ${message}`;
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
      .map((player) => this.scorePlayer(player))
      .sort((a, b) => b.total - a.total || b.tieBreaker - a.tieBreaker);
    game.currentPlayer = game.scores[0].playerIndex;
  }

  scorePlayer(player: PlayerType): ScoreLine {
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

  placedColonists(player: PlayerType): number {
    return (
      player.island.map((tile) => tile.colonists).sum() +
      player.city.map((tile) => tile.colonists).sum()
    );
  }

  totalProducedKinds(): number {
    return Object.values(store.gameW.game.producedGoods || {})
      .map((produced) => produced.length)
      .sum();
  }

  canStoreCurrentGoods(player: PlayerType): boolean {
    return this.storageOverflow(player) <= 0;
  }

  storageOverflow(player: PlayerType): number {
    const warehouseKinds =
      (this.hasOccupiedBuilding(player, "small_warehouse") ? 1 : 0) +
      (this.hasOccupiedBuilding(player, "large_warehouse") ? 2 : 0);
    const protectedGoods = Object.values(player.goods)
      .sort((a, b) => b - a)
      .slice(0, warehouseKinds)
      .sum();
    return this.totalGoods(player) - protectedGoods - 1;
  }

  takeColonists(player: PlayerType, count: number): number {
    const amount = Math.min(count, store.gameW.game.bank.colonistSupply);
    player.sanJuan += amount;
    store.gameW.game.bank.colonistSupply -= amount;
    return amount;
  }

  getPhaseLabel(): string {
    const game = store.gameW.game;
    return theme.phase[game.phase];
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
