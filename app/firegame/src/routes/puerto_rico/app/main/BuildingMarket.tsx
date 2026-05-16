import css from "../index.module.css";
import { theme } from "../theme/base";
import { BUILDING_COLUMNS } from "../utils/rules";
import utils, { store } from "../utils/utils";

function BuildingMarket() {
  const game = store.gameW.game;
  const player = game.players[game.currentPlayer];
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Buildings</h3>
      <div className={css.buildingColumns}>
        {BUILDING_COLUMNS.map((buildingIds, index) => {
          const quarryCap = index + 1;
          return (
            <div key={quarryCap} className={css.buildingColumn}>
              <div className={css.buildingColumnHeader}>
                <strong>Column {quarryCap}</strong>
                <span className={css.quarryIndicator}>
                  {quarryCap} {quarryCap === 1 ? "quarry" : "quarries"} max
                </span>
              </div>
              <div className={css.buildingColumnBody}>
                {buildingIds.map((buildingId) => {
                  const rule = utils.building(buildingId);
                  const cost = player
                    ? utils.buildingCost(player, buildingId, player.index === game.roleOwner)
                    : rule.cost;
                  const buildError = player ? utils.buildError(player, buildingId) : null;
                  const disabled = game.phase !== "builder" || !utils.isMyTurn() || !!buildError;
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
                      title={buildError || ""}
                    >
                      <strong>{theme.buildings[buildingId]}</strong>
                      <div className={css.tiny}>
                        Cost {rule.cost} ({cost}) | VP {rule.victoryPoints} | Size {rule.size}
                      </div>
                      <div className={`${css.tiny} ${css.muted}`}>
                        {theme.buildingDescriptions[buildingId]}
                      </div>
                      <div className={css.tiny}>Supply {game.bank.buildingSupply[buildingId]}</div>
                      {rule.kind !== "production" && !utils.hasImplementedPower(buildingId) && (
                        <div className={`${css.tiny} ${css.muted}`}>{theme.disabledPower}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BuildingMarket;
