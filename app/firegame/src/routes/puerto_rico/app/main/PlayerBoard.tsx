import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import { PlayerType } from "../utils/NewGame";
import { BUILDING_IDS, PlantationId } from "../utils/rules";
import utils, { store } from "../utils/utils";
import BuildingCardContent from "./BuildingCardContent";

const islandOrder: PlantationId[] = [...goodsInThemeOrder, "quarry"];

function PlayerBoard(props: { player: PlayerType }) {
  const { player } = props;
  const game = store.gameW.game;
  const canPlace = game.phase === "mayor" && game.currentPlayer === player.index && utils.isMyTurn();
  const heldGoods = goodsInThemeOrder.filter((good) => player.goods[good] > 0);
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
        <h3 className={css.heading}>{player.userName}</h3>
        <div className={css.playerHeaderBadges}>
          {player.index === game.governor && <span className={css.governorBadge}>Governor</span>}
          <span className={css.score}>{player.doubloons} doubloons</span>
          <span className={css.score}>{player.victoryPoints} VP</span>
        </div>
      </div>
      <div className={css.goodsRow}>
        {heldGoods.length === 0 && <span className={css.emptyGoods}>No goods</span>}
        {heldGoods.map((good) => (
          <div
            key={good}
            className={`${css.smallTile} ${css.goodTile} ${css.ownedGoodTile}`}
            style={{ backgroundColor: theme.colors[good] }}
          >
            <span className={css.goodName}>{theme.goods[good]}</span>
            <strong>{player.goods[good]}</strong>
          </div>
        ))}
      </div>
      <div className={css.boardSubhead}>
        <h4>Island {player.island.length}/12</h4>
        <span className={css.metricBubble}>San Juan {player.sanJuan}</span>
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
        <h4>City {utils.citySpaces(player)}/12</h4>
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
