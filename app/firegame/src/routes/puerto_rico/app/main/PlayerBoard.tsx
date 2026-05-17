import css from "../index.module.css";
import writer from "../../../../firegame/writer/writer";
import { goodsInThemeOrder, theme } from "../theme/base";
import { PlayerType } from "../utils/NewGame";
import { BUILDING_IDS, PlantationId } from "../utils/rules";
import utils, { store } from "../utils/utils";
import BuildingCardContent from "./BuildingCardContent";

const islandOrder: PlantationId[] = [...goodsInThemeOrder, "quarry"];

function PlayerBoard(props: { player: PlayerType }) {
  const { player } = props;
  const game = store.gameW.game;
  const canRename = player.userId === store.me.userId;
  const canPlace = game.phase === "mayor" && game.currentPlayer === player.index && utils.isMyTurn();
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
    <div className={`${css.section} ${css.player} ${game.currentPlayer === player.index ? css.active : ""}`}>
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
          <span className={css.score}>{player.doubloons} {theme.labels.doubloons}</span>
          <span className={css.score}>{player.victoryPoints} {theme.labels.vp}</span>
        </div>
      </div>
      <div className={css.boardSubhead}>
        <h4>{theme.labels.goods}</h4>
      </div>
      <div className={css.goodsRow}>
        {heldGoods.length === 0 && <span className={css.emptyGoods}>{theme.labels.noGoods}</span>}
        {heldGoods.map(({ good, index }) => (
          <div
            key={`${good}-${index}`}
            className={`${css.smallTile} ${css.goodTile}`}
            style={{ backgroundColor: theme.colors[good] }}
          >
            <span className={css.goodName}>{theme.goods[good]}</span>
          </div>
        ))}
      </div>
      <div className={css.boardSubhead}>
        <h4>{theme.labels.island} {player.island.length}/12</h4>
        <span className={css.metricBubble}>{theme.labels.sanJuan} {player.sanJuan}</span>
        {canPlace && (
          <button className={css.inlineActionButton} onClick={() => utils.finishMayor()}>
            {theme.controls.finishPlacement}
          </button>
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
        <h4>{theme.labels.city} {utils.citySpaces(player)}/12</h4>
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
