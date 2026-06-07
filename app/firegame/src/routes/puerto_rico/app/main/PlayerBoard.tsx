import { useEffect, useState } from "react";
import css from "../index.module.css";
import writer from "../../../../firegame/writer/writer";
import { goodsInThemeOrder, theme } from "../theme/base";
import { GameType, PlayerType } from "../utils/NewGame";
import { BUILDING_IDS, GoodId, MAX_ISLAND_SPACES, PlantationId } from "../utils/rules";
import utils, { store } from "../utils/utils";
import BuildingCardContent from "./BuildingCardContent";
import { buildingMarketElementId } from "./BuildingMarket";

const islandOrder: PlantationId[] = [...goodsInThemeOrder, "quarry"];

function PlayerBoard(props: { game?: GameType; player: PlayerType; readOnly?: boolean }) {
  useMayorDraftVersion();
  usePendingActionVersion();
  const player = props.readOnly ? props.player : utils.getMayorPlayer(props.player);
  const game = props.game || store.gameW.game;
  const canRename = !props.readOnly && player.userId === store.me.userId;
  const canPass = canRename && utils.canPass();
  const canPlace = !props.readOnly && utils.canManageMayor(player);
  const canFinishMayor = !props.readOnly && utils.canFinishMayor(player);
  const score = utils.scorePlayer(player);
  const totalColonists = utils.totalColonists(player);
  const canPlanTrade = canRename && game.phase === "trader" && utils.canQueueActionForMe("trader");
  const canPlanCaptain = canRename && game.phase === "captain" && utils.canQueueActionForMe("captain");
  const canPlanStorage = canRename && game.phase === "storage" && utils.canQueueActionForMe("storage");
  const canChooseCraftsmanBonus = canRename && game.phase === "craftsman_bonus" && utils.isMyTurn();
  const canUseWharf = canPlanCaptain;
  const canStore = canRename && game.phase === "storage" && utils.isMyTurn();
  const craftsmanBonusGoods = canChooseCraftsmanBonus
    ? game.producedGoods?.[game.roleOwner || 0] || []
    : [];
  const wharfOptions = canUseWharf ? utils.wharfOptions(player) : [];
  const shipGoods = canUseWharf
    ? Array.from(new Set(utils.shipOptions(player).map((option) => option.good)))
    : [];
  const tradeGoods =
    canPlanTrade
      ? utils.tradeGoods(player)
      : [];
  const heldGoods = goodsInThemeOrder.flatMap((good) =>
    Array.from({ length: player.goods[good] }, (_, index) => ({ good, index }))
  );
  const sortedIsland = player.island
    .map((tile, index) => ({ tile, index }))
    .sort(
      (a, b) =>
        islandOrder.indexOf(a.tile.id) - islandOrder.indexOf(b.tile.id) ||
        a.index - b.index
    );
  const sortedCity = player.city
    .map((building, index) => ({ building, index }))
    .sort(
      (a, b) =>
        BUILDING_IDS.indexOf(a.building.id) - BUILDING_IDS.indexOf(b.building.id) ||
        a.index - b.index
    );
  return (
    <div
      id={playerBoardElementId(player.userId)}
      className={`${css.section} ${css.player} ${!props.readOnly && game.currentPlayer === player.index ? css.active : ""}`}
    >
      <div className={css.between}>
        <h3 className={css.heading}>
          {canRename ? (
            <button
              type="button"
              className={css.playerNameButton}
              onClick={() => renameMe(player)}
            >
              {player.userName}
            </button>
          ) : (
            player.userName
          )}
        </h3>
        <div className={css.playerHeaderBadges}>
          {player.index === game.governor && <span className={css.governorBadge}>{theme.labels.governor}</span>}
          {canPass && (
            <button className={css.inlineActionButton} onClick={() => utils.skipAction()}>
              {theme.controls.pass}
            </button>
          )}
          <span className={css.score}>{player.doubloons} {theme.labels.doubloons}</span>
          <span className={css.score}>{player.victoryPoints} {theme.labels.vp} chips</span>
          <span className={css.score}>{score.total} {theme.labels.vp}</span>
          {canChooseCraftsmanBonus && (
            <button className={css.inlineActionButton} onClick={() => utils.skipCraftsmanBonus()}>
              {theme.controls.skipBonus}
            </button>
          )}
          {canStore && (
            <button className={css.inlineActionButton} onClick={() => utils.finishStorage()}>
              {theme.controls.finishStorage}
            </button>
          )}
        </div>
      </div>
      <div className={css.boardSubhead}>
        <h4>{theme.labels.goods}</h4>
      </div>
      <div className={css.goodsRow}>
        {heldGoods.length === 0 && <span className={css.emptyGoods}>{theme.labels.noGoods}</span>}
        {heldGoods.map(({ good, index }) => {
          const canTrade = tradeGoods.includes(good);
          const canShip = shipGoods.includes(good);
          const canDiscard = canPlanStorage && player.goods[good] > 0 && !utils.canStoreCurrentGoods(player);
          const pendingTrade = utils.isPendingAction({ phase: "trader", good });
          const pendingShip = utils.isPendingAction({ phase: "captain", kind: "shipGood", good });
          const pendingDiscard = utils.isPendingAction({ phase: "storage", good });
          const className = `${css.smallTile} ${css.goodTile} ${canTrade || canShip || canDiscard ? css.playerGoodActionTile : ""} ${
            pendingTrade || pendingShip || pendingDiscard ? css.pendingActionTile : ""
          }`;
          const style = { backgroundColor: theme.colors[good] };
          const content = <span className={css.goodName}>{theme.goods[good]}</span>;
          return canTrade || canShip || canDiscard ? (
            <button
              key={`${good}-${index}`}
              type="button"
              className={className}
              style={style}
              onClick={() => {
                if (canTrade) {
                  if (utils.isMyTurn()) utils.sellGood(good);
                  else utils.setPendingAction({ phase: "trader", good });
                } else if (canShip) {
                  if (utils.isMyTurn()) utils.shipGoodFromBoard(good);
                  else utils.setPendingAction({ phase: "captain", kind: "shipGood", good });
                } else if (utils.isMyTurn()) utils.discardGood(good);
                else utils.setPendingAction({ phase: "storage", good });
              }}
            >
              {content}
            </button>
          ) : (
            <div key={`${good}-${index}`} className={className} style={style}>
              {content}
            </div>
          );
        })}
        {craftsmanBonusGoods.map((good) => (
          <PlayerGoodAction
            key={`bonus-${good}`}
            good={good}
            label={`${theme.actions.take} ${theme.goods[good]}`}
            disabled={game.bank.goodsSupply[good] <= 0}
            onClick={() => utils.chooseCraftsmanBonus(good)}
          />
        ))}
        {wharfOptions.map((option) => (
          <PlayerGoodAction
            key={`wharf-${option.good}`}
            good={option.good}
            label={`${theme.actions.wharf} ${option.amount} ${theme.goods[option.good]}`}
            selected={utils.isPendingAction({ phase: "captain", kind: "wharf", good: option.good })}
            onClick={() => {
              if (utils.isMyTurn()) utils.useWharf(option.good);
              else utils.setPendingAction({ phase: "captain", kind: "wharf", good: option.good });
            }}
          />
        ))}
      </div>
      <div className={css.boardSubhead}>
        <h4>{theme.labels.island} {player.island.length} / {MAX_ISLAND_SPACES}</h4>
        {canFinishMayor ? (
          <button className={`${css.metricBubble} ${css.finishMayorBubble}`} onClick={() => utils.finishMayor()}>
            {theme.labels.sanJuan} {player.sanJuan} / {totalColonists}
          </button>
        ) : (
          <span className={`${css.metricBubble} ${canPlace ? css.pendingMayorBubble : ""}`}>
            {theme.labels.sanJuan} {player.sanJuan} / {totalColonists}
          </span>
        )}
      </div>
      <div className={css.compactRow}>
        {sortedIsland.map(({ tile, index }) => (
          <div
            key={`${tile.id}-${index}`}
            className={`${css.smallTile} ${css.goodTile}`}
            style={{ backgroundColor: theme.colors[tile.id] }}
          >
            <span className={css.goodName}>{theme.plantations[tile.id]}</span>
              <ColonistControls
                count={tile.colonists}
                capacity={utils.tileCapacity(tile)}
                canPlace={canPlace}
                onAdd={() => utils.assignColonist("island", index)}
                onRemove={() => utils.removeColonist("island", index)}
            />
          </div>
        ))}
      </div>
      <div className={css.boardSubhead}>
        <h4>
          <button
            type="button"
            className={css.subheadLinkButton}
            onClick={() => scrollToBuildingMarket()}
          >
            {theme.labels.city} {utils.citySpaces(player)} / 12
          </button>
        </h4>
      </div>
      <div className={css.cityGrid}>
        {sortedCity.map(({ building, index }) => {
          const rule = utils.building(building.id);
          return (
            <div
              key={`${building.id}-${index}`}
              className={`${css.tile} ${css.building} ${css.cityTile} ${rule.size === 2 ? css.largeCityTile : ""}`}
              style={{
                backgroundColor:
                  rule.kind === "production"
                    ? rule.good
                      ? theme.colors[rule.good]
                      : "white"
                    : theme.colors[rule.kind === "large" ? "large" : "violet"],
              }}
            >
              <BuildingCardContent
                buildingId={building.id}
                footer={
                  <ColonistControls
                    count={building.colonists}
                    capacity={utils.tileCapacity(building)}
                    canPlace={canPlace}
                    onAdd={() => utils.assignColonist("city", index)}
                    onRemove={() => utils.removeColonist("city", index)}
                  />
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function playerBoardElementId(userId: string): string {
  return `puerto-rico-player-${encodeURIComponent(userId)}`;
}

function scrollToBuildingMarket(): void {
  document.getElementById(buildingMarketElementId)?.scrollIntoView({ block: "start" });
}

function useMayorDraftVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => utils.subscribeMayorDraft(() => setVersion((value) => value + 1)), []);
  return version;
}

function usePendingActionVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => utils.subscribePendingAction(() => setVersion((value) => value + 1)), []);
  return version;
}

function PlayerGoodAction(props: {
  good: GoodId;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${css.smallTile} ${css.goodTile} ${css.playerGoodActionTile} ${
        props.selected ? css.pendingActionTile : ""
      }`}
      style={{ backgroundColor: theme.colors[props.good] }}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <span className={css.goodName}>{props.label}</span>
    </button>
  );
}

function renameMe(player: PlayerType): void {
  const nextName = window.prompt("Enter your name", player.userName)?.trim();
  if (!nextName || nextName === player.userName) return;

  const previousName = player.userName;
  player.userName = nextName;
  // Keep the live lobby name aligned with the game-state name so sidebars and
  // future new games use the same player label.
  // @ts-ignore mutating shared runtime store state
  store.lobby[store.me.userId] = nextName;
  writer.setUsername(nextName);
  store.update(`${previousName} changed name to ${nextName}`);
}

function ColonistControls(props: {
  count: number;
  capacity: number;
  canPlace: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className={css.colonistLine}>
      <span className={css.colonistDots}>
        {Array.from({ length: props.capacity }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${css.colonistDot} ${index < props.count ? css.filledColonistDot : ""}`}
            aria-label={index < props.count ? "Occupied colonist slot" : "Open colonist slot"}
            onClick={() => {
              if (!props.canPlace) return;
              if (index < props.count) props.onRemove();
              else if (index === props.count) props.onAdd();
            }}
            disabled={!props.canPlace || index > props.count}
          />
        ))}
      </span>
    </div>
  );
}

export default PlayerBoard;
