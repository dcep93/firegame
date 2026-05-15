import css from "../index.module.css";
import { theme } from "../theme/base";
import { BUILDING_IDS } from "../utils/rules";
import utils, { store } from "../utils/utils";

function BuildingMarket() {
  const game = store.gameW.game;
  const player = game.players[game.currentPlayer];
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Buildings</h3>
      <div className={css.row}>
        {BUILDING_IDS.map((buildingId) => {
          const rule = utils.building(buildingId);
          const cost = player
            ? utils.buildingCost(player, buildingId, player.index === game.roleOwner)
            : rule.cost;
          const disabled = game.phase !== "builder" || !utils.isMyTurn() || !!utils.buildError(player, buildingId);
          return (
            <button
              key={buildingId}
              className={`${css.tile} ${css.buttonTile} ${css.building}`}
              style={{
                background:
                  rule.kind === "production"
                    ? rule.good
                      ? theme.colors[rule.good]
                      : "white"
                    : theme.colors[rule.kind === "large" ? "large" : "violet"],
              }}
              disabled={disabled}
              onClick={() => utils.buildBuilding(buildingId)}
              title={utils.buildError(player, buildingId) || ""}
            >
              <strong>{theme.buildings[buildingId]}</strong>
              <div className={css.tiny}>
                Cost {rule.cost} ({cost}) | VP {rule.victoryPoints} | Size {rule.size}
              </div>
              <div className={css.tiny}>Supply {game.bank.buildingSupply[buildingId]}</div>
              {rule.kind !== "production" && (
                <div className={`${css.tiny} ${css.muted}`}>{theme.disabledPower}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BuildingMarket;
