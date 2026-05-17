import css from "../index.module.css";
import { theme } from "../theme/base";
import { BUILDING_COLUMNS } from "../utils/rules";
import utils, { store } from "../utils/utils";
import BuildingCardContent from "./BuildingCardContent";

function BuildingMarket() {
  const game = store.gameW.game;
  const player = game.players[game.currentPlayer];
  return (
    <div className={css.section}>
      <div className={css.boardSubhead}>
        <h3 className={css.heading}>{theme.labels.buildings}</h3>
        {game.phase === "builder" && utils.canPass() && (
          <button className={css.inlineActionButton} onClick={() => utils.skipAction()}>
            {theme.controls.pass}
          </button>
        )}
      </div>
      <div className={css.buildingColumns}>
        {BUILDING_COLUMNS.map((buildingIds, index) => {
          const quarryCap = index + 1;
          return (
            <div key={quarryCap} className={css.buildingColumn}>
              <div className={css.buildingColumnHeader}>
                <strong>{quarryCap} {quarryCap === 1 ? theme.labels.quarry : theme.labels.quarriesPlural} {theme.labels.max}</strong>
              </div>
              <div className={css.buildingColumnBody}>
                {buildingIds.map((buildingId) => {
                  const rule = utils.building(buildingId);
                  const buildError = player ? utils.buildError(player, buildingId) : null;
                  const soldOut = game.bank.buildingSupply[buildingId] <= 0;
                  const canBuild = game.phase === "builder" && utils.isMyTurn() && !buildError;
                  const className = `${css.tile} ${canBuild ? css.buttonTile : ""} ${css.building} ${
                    soldOut ? css.soldOutBuilding : ""
                  }`;
                  const style = {
                    backgroundColor:
                      rule.kind === "production"
                        ? rule.good
                          ? theme.colors[rule.good]
                          : "white"
                        : theme.colors[rule.kind === "large" ? "large" : "violet"],
                  };
                  const content = (
                    <BuildingCardContent
                      buildingId={buildingId}
                      footer={
                        <>
                          <span>{theme.labels.cost} {rule.cost}</span>
                          <strong>{theme.labels.supply} {game.bank.buildingSupply[buildingId]}</strong>
                          {rule.size > 1 && <span>{theme.labels.size} {rule.size}</span>}
                        </>
                      }
                    />
                  );
                  return canBuild ? (
                    <button
                      key={buildingId}
                      className={className}
                      style={style}
                      onClick={() => utils.buildBuilding(buildingId)}
                    >
                      {content}
                    </button>
                  ) : (
                    <div key={buildingId} className={className} style={style}>
                      {content}
                    </div>
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
