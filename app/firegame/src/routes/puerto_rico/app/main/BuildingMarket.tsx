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
                <strong>{quarryCap} {quarryCap === 1 ? "quarry" : "quarries"} max</strong>
              </div>
              <div className={css.buildingColumnBody}>
                {buildingIds.map((buildingId) => {
                  const rule = utils.building(buildingId);
                  const buildError = player ? utils.buildError(player, buildingId) : null;
                  const disabled = game.phase !== "builder" || !utils.isMyTurn() || !!buildError;
                  return (
                    <button
                      key={buildingId}
                      className={`${css.tile} ${css.buttonTile} ${css.building}`}
                      style={{
                        backgroundColor:
                          rule.kind === "production"
                            ? rule.good
                              ? theme.colors[rule.good]
                              : "white"
                            : theme.colors[rule.kind === "large" ? "large" : "violet"],
                      }}
                      disabled={disabled}
                      onClick={() => utils.buildBuilding(buildingId)}
                    >
                      <div className={css.buildingHeader}>
                        <strong className={`${css.tileTitle} ${css.buildingNameBubble}`}>
                          {theme.buildings[buildingId]}
                        </strong>
                        <span className={css.vpBadge}>{rule.victoryPoints} VP</span>
                      </div>
                      <div className={css.buildingFooter}>
                        <span>Cost {rule.cost}</span>
                        <strong>Supply {game.bank.buildingSupply[buildingId]}</strong>
                        {rule.size > 1 && <span>Size {rule.size}</span>}
                      </div>
                      <div className={css.buildingTextBubble}>
                        <div>{theme.buildingDescriptions[buildingId]}</div>
                        {rule.kind !== "production" && !utils.hasImplementedPower(buildingId) && (
                          <div>{theme.disabledPower}</div>
                        )}
                      </div>
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
