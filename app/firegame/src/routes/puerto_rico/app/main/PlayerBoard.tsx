import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import { PlayerType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

function PlayerBoard(props: { player: PlayerType }) {
  const { player } = props;
  const game = store.gameW.game;
  const canPlace = game.phase === "mayor" && game.currentPlayer === player.index && utils.isMyTurn();
  return (
    <div className={`${css.section} ${css.player} ${game.currentPlayer === player.index ? css.active : ""}`}>
      <div className={css.between}>
        <h3 className={css.heading}>{player.userName}</h3>
        <div className={css.score}>{player.victoryPoints} VP</div>
      </div>
      <div>
        {player.doubloons} doubloons | San Juan {player.sanJuan} | City{" "}
        {utils.citySpaces(player)}/12 | Island {player.island.length}/12
      </div>
      <div className={css.row}>
        {goodsInThemeOrder.map((good) => (
          <div
            key={good}
            className={css.smallTile}
            style={{ background: theme.colors[good] }}
          >
            {theme.goods[good]} {player.goods[good]}
          </div>
        ))}
      </div>
      <h4>Island</h4>
      <div className={css.row}>
        {player.island.map((tile, index) => (
          <div
            key={`${tile.id}-${index}`}
            className={css.smallTile}
            style={{ background: theme.colors[tile.id] }}
          >
            <div>{theme.plantations[tile.id]}</div>
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
      <div className={css.row}>
        {player.city.map((building, index) => {
          const rule = utils.building(building.id);
          return (
            <div
              key={`${building.id}-${index}`}
              className={`${css.tile} ${rule.size === 2 ? css.largeCityTile : ""}`}
              style={{
                background:
                  rule.kind === "production"
                    ? rule.good
                      ? theme.colors[rule.good]
                      : "white"
                    : theme.colors[rule.kind === "large" ? "large" : "violet"],
              }}
            >
              <div>{theme.buildings[building.id]}</div>
              <div className={css.tiny}>
                VP {rule.victoryPoints} | Size {rule.size}
              </div>
              <div className={`${css.tiny} ${css.muted}`}>
                {theme.buildingDescriptions[building.id]}
              </div>
              {rule.kind !== "production" && !utils.hasImplementedPower(building.id) && (
                <div className={`${css.tiny} ${css.muted}`}>{theme.disabledPower}</div>
              )}
              <ColonistControls
                count={building.colonists}
                capacity={utils.tileCapacity(building)}
                canPlace={canPlace}
                onAdd={() => utils.assignColonist("city", index)}
                onRemove={() => utils.removeColonist("city", index)}
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
    <div>
      Colonists {props.count}
      {props.canPlace && (
        <span>
          {" "}
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
