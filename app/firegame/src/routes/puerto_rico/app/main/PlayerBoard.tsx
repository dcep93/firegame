import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import { PlayerType } from "../utils/NewGame";
import { BUILDING_IDS, PlantationId } from "../utils/rules";
import utils, { store } from "../utils/utils";

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
        <div className={css.score}>{player.victoryPoints} VP</div>
      </div>
      <div className={css.playerStats}>
        <div><strong>{player.doubloons}</strong><span>Doubloons</span></div>
        <div><strong>{player.sanJuan}</strong><span>San Juan</span></div>
        <div><strong>{utils.citySpaces(player)}/12</strong><span>City</span></div>
        <div><strong>{player.island.length}/12</strong><span>Island</span></div>
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
      <h4>Island</h4>
      <div className={css.compactRow}>
        {sortedIsland.map(({ tile, index }) => (
          <div
            key={`${tile.id}-${index}`}
            className={`${css.smallTile} ${css.goodTile} ${css.islandTile}`}
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
      <h4>City</h4>
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
              <div className={css.buildingHeader}>
                <div className={css.tileTitle}>{theme.buildings[building.id]}</div>
                <span className={css.vpBadge}>{rule.victoryPoints} VP</span>
              </div>
              <div className={css.buildingTextBubble}>
                <div>{theme.buildingDescriptions[building.id]}</div>
                {rule.kind !== "production" && !utils.hasImplementedPower(building.id) && (
                  <div>{theme.disabledPower}</div>
                )}
              </div>
              {rule.size > 1 && (
                <div className={css.buildingFooter}>
                  <span>Size {rule.size}</span>
                </div>
              )}
              <div className={css.workerFooter}>
                <ColonistControls
                  count={building.colonists}
                  capacity={utils.tileCapacity(building)}
                  canPlace={canPlace}
                  onAdd={() => utils.assignColonist("city", index)}
                  onRemove={() => utils.removeColonist("city", index)}
                />
              </div>
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
          <span
            key={index}
            className={`${css.colonistDot} ${index < props.count ? css.filledColonistDot : ""}`}
          />
        ))}
      </span>
      {props.canPlace && (
        <span className={css.stepper}>
          <button onClick={props.onAdd} disabled={props.count >= props.capacity}>
            +
          </button>
          <button onClick={props.onRemove} disabled={props.count <= 0}>
            -
          </button>
        </span>
      )}
    </div>
  );
}

export default PlayerBoard;
