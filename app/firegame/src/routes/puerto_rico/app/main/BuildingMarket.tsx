import { useEffect, useState } from "react";
import css from "../index.module.css";
import { theme } from "../theme/base";
import { GameType } from "../utils/NewGame";
import { BUILDING_COLUMNS } from "../utils/rules";
import utils, { store } from "../utils/utils";
import BuildingCardContent from "./BuildingCardContent";

function BuildingMarket(props: { game?: GameType; readOnly?: boolean }) {
  const [isOpen, setIsOpen] = useState(true);
  usePendingActionVersion();
  const game = props.game || store.gameW.game;
  const myPlayer = game.players.find((player) => player.userId === store.me.userId);
  const canPlanBuild = !props.readOnly && game.phase === "builder" && utils.canQueueActionForMe("builder");
  const player = canPlanBuild ? myPlayer : game.players[game.currentPlayer];
  return (
    <div id={buildingMarketElementId} className={css.section}>
      <div className={css.boardSubhead}>
        <button
          type="button"
          className={css.collapsibleHeading}
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
        >
          {theme.labels.buildings}
        </button>
        {!props.readOnly && game.phase === "builder" && utils.canPass() && (
          <button className={css.inlineActionButton} onClick={() => utils.skipAction()}>
            {theme.controls.pass}
          </button>
        )}
      </div>
      {isOpen && <div className={css.buildingColumns}>
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
                  const buildError = !props.readOnly && player ? utils.buildError(player, buildingId) : null;
                  const soldOut = game.bank.buildingSupply[buildingId] <= 0;
                  const canSelect = canPlanBuild && !buildError;
                  const isPending = utils.isPendingAction({ phase: "builder", buildingId });
                  const className = `${css.tile} ${canSelect ? css.buttonTile : ""} ${css.building} ${
                    soldOut ? css.soldOutBuilding : ""
                  } ${isPending ? css.pendingActionTile : ""}`;
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
                  return canSelect ? (
                    <button
                      key={buildingId}
                      className={className}
                      style={style}
                      onClick={() => {
                        if (utils.isMyTurn()) utils.buildBuilding(buildingId);
                        else utils.setPendingAction({ phase: "builder", buildingId });
                      }}
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
      </div>}
    </div>
  );
}

export const buildingMarketElementId = "puerto-rico-building-market";

function usePendingActionVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => utils.subscribePendingAction(() => setVersion((value) => value + 1)), []);
  return version;
}

export default BuildingMarket;
