import { useEffect, useState } from "react";
import css from "../index.module.css";
import { goodsInThemeOrder, theme, workerText } from "../theme/base";
import { GameType } from "../utils/NewGame";
import { TRADER_PRICES } from "../utils/rules";
import utils, { store } from "../utils/utils";

function BankView(props: { game?: GameType; readOnly?: boolean }) {
  const [isOpen, setIsOpen] = useState(true);
  usePendingActionVersion();
  const game = props.game || store.gameW.game;
  const bank = game.bank;
  const currentPlayer = game.players[game.currentPlayer];
  const myPlayer = game.players.find((player) => player.userId === store.me.userId);
  const canPlanSettle = !props.readOnly && game.phase === "settler" && utils.canQueueActionForMe("settler");
  const canSettle = canPlanSettle;
  const canTradePass = !props.readOnly && game.phase === "trader" && utils.canPass();
  const settlerPlayer = canPlanSettle ? myPlayer : currentPlayer;
  const canPlanCaptain = !props.readOnly && game.phase === "captain" && utils.canQueueActionForMe("captain");
  const captainPlayer = canPlanCaptain ? myPlayer : currentPlayer;
  const shipOptions =
    canPlanCaptain && captainPlayer
      ? utils.shipOptions(captainPlayer)
      : [];
  const shipOptionsByIndex = new Map<number, typeof shipOptions>();
  shipOptions.forEach((option) => {
    shipOptionsByIndex.set(option.shipIndex, [
      ...(shipOptionsByIndex.get(option.shipIndex) || []),
      option,
    ]);
  });
  return (
    <div className={css.section}>
      <button
        type="button"
        className={css.collapsibleHeading}
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        {theme.labels.board}
      </button>
      {isOpen && <div className={css.boardGrid}>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>{theme.labels.plantations}</strong>
          <div className={css.boardStatsLine}>
            <span>{theme.labels.deck} {bank.plantationDeck.length}</span>
            <span>{theme.labels.discard} {bank.plantationDiscard.length}</span>
            <span>{theme.labels.quarries} {bank.quarrySupply}</span>
          </div>
          <div className={css.compactRow}>
            {canSettle && settlerPlayer && utils.canUseHacienda(settlerPlayer) && (
              <button
                className={`${css.smallTile} ${css.goodTile} ${css.buttonTile} ${
                  utils.isPendingAction({ phase: "settler", kind: "hacienda" }) ? css.pendingActionTile : ""
                }`}
                onClick={() => {
                  if (utils.isMyTurn()) utils.takeHaciendaPlantation();
                  else utils.setPendingAction({ phase: "settler", kind: "hacienda" });
                }}
              >
                <span className={css.goodName}>{theme.actions.haciendaTile}</span>
              </button>
            )}
            {bank.plantationRow.map((plantation, index) =>
              canSettle ? (
                <button
                  key={`${plantation}-${index}`}
                  className={`${css.smallTile} ${css.goodTile} ${css.buttonTile} ${
                    utils.isPendingAction({ phase: "settler", kind: "plantation", index, good: plantation })
                      ? css.pendingActionTile
                      : ""
                  }`}
                  style={{ backgroundColor: theme.colors[plantation] }}
                  onClick={() => {
                    if (utils.isMyTurn()) utils.settlePlantation(index);
                    else utils.setPendingAction({ phase: "settler", kind: "plantation", index, good: plantation });
                  }}
                >
                  <span className={css.goodName}>{theme.plantations[plantation]}</span>
                </button>
              ) : (
                <div
                  key={`${plantation}-${index}`}
                  className={`${css.smallTile} ${css.goodTile}`}
                  style={{ backgroundColor: theme.colors[plantation] }}
                >
                  <span className={css.goodName}>{theme.plantations[plantation]}</span>
                </div>
              )
            )}
            {canSettle && (
              <button
                className={`${css.smallTile} ${css.goodTile} ${css.buttonTile} ${
                  utils.isPendingAction({ phase: "settler", kind: "quarry" }) ? css.pendingActionTile : ""
                }`}
                style={{ backgroundColor: theme.colors.quarry }}
                onClick={() => {
                  if (utils.isMyTurn()) utils.settleQuarry();
                  else utils.setPendingAction({ phase: "settler", kind: "quarry" });
                }}
                disabled={!utils.canSettleQuarry(settlerPlayer)}
              >
                <span className={css.goodName}>{theme.plantations.quarry}</span>
              </button>
            )}
            {canSettle && (
              <button className={css.inlineActionButton} onClick={() => utils.skipAction()}>
                {theme.controls.pass}
              </button>
            )}
          </div>
        </div>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>{theme.labels.cargoShips}</strong>
          {bank.cargoShips.map((ship, index) => {
            const options = shipOptionsByIndex.get(index) || [];
            return (
              <div
                key={index}
                className={`${css.metricRow} ${css.shipRow} ${options.length > 0 ? css.selectableShipRow : ""}`}
                style={{ backgroundColor: ship.good ? theme.colors[ship.good] : undefined }}
              >
                <strong>{ship.good ? theme.goods[ship.good] : theme.labels.empty} {ship.count}/{ship.capacity}</strong>
                {options.length > 0 && (
                  <div className={css.shipActions}>
                    {options.map((option) => (
                      <button
                        key={`${option.good}-${option.shipIndex}`}
                        className={`${css.shipActionButton} ${
                          utils.isPendingAction({
                            phase: "captain",
                            kind: "ship",
                            good: option.good,
                            shipIndex: option.shipIndex,
                          })
                            ? css.pendingActionButton
                            : ""
                        }`}
                        onClick={() => {
                          if (utils.isMyTurn()) utils.shipGood(option.good, option.shipIndex);
                          else utils.setPendingAction({
                            phase: "captain",
                            kind: "ship",
                            good: option.good,
                            shipIndex: option.shipIndex,
                          });
                        }}
                      >
                        {theme.actions.ship} {option.amount} {theme.goods[option.good]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className={css.cargoSubsection}>
            <strong className={css.tileTitle}>{theme.labels.tradingHouse}</strong>
            {canTradePass && (
              <button className={css.inlineActionButton} onClick={() => utils.skipAction()}>
                {theme.controls.pass}
              </button>
            )}
            <div className={css.tradeSlots}>
              {[0, 1, 2, 3].map((slot) => {
                const good = bank.tradingHouse[slot];
                return (
                  <div key={slot} className={`${css.tradeSlot} ${good ? css.filledTradeSlot : ""}`}>
                    {good ? (
                      <span
                        className={css.tradeGoodChip}
                        style={{ backgroundColor: theme.colors[good] }}
                      >
                        {theme.goods[good]}
                      </span>
                    ) : (
                      theme.labels.open
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>
            {theme.labels.colonistShip}: {workerText(bank.colonistShip)}, {bank.colonistSupply} reserve
          </strong>
          <div className={css.cardSeparator} />
          <strong className={css.tileTitle}>{theme.labels.goodsSupply}</strong>
          {goodsInThemeOrder.map((good) => (
            <div
              key={good}
              className={`${css.metricRow} ${css.coloredMetricRow}`}
              style={{ backgroundColor: theme.colors[good] }}
            >
              <span>(${TRADER_PRICES[good]}) {theme.goods[good]}</span>
              <strong>{bank.goodsSupply[good]}</strong>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

function usePendingActionVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => utils.subscribePendingAction(() => setVersion((value) => value + 1)), []);
  return version;
}

export default BankView;
