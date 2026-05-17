import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import { TRADER_PRICES } from "../utils/rules";
import utils, { store } from "../utils/utils";

function BankView() {
  const game = store.gameW.game;
  const bank = store.gameW.game.bank;
  const currentPlayer = game.players[game.currentPlayer];
  const canSettle = game.phase === "settler" && utils.isMyTurn();
  const canTradePass = game.phase === "trader" && utils.canPass();
  const shipOptions =
    game.phase === "captain" && utils.isMyTurn()
      ? utils.shipOptions(currentPlayer)
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
      <h3 className={css.heading}>{theme.labels.board}</h3>
      <div className={css.boardGrid}>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>{theme.labels.plantations}</strong>
          <div className={css.boardStatsLine}>
            <span>{theme.labels.deck} {bank.plantationDeck.length}</span>
            <span>{theme.labels.discard} {bank.plantationDiscard.length}</span>
            <span>{theme.labels.quarries} {bank.quarrySupply}</span>
          </div>
          <div className={css.compactRow}>
            {canSettle && utils.canUseHacienda(currentPlayer) && (
              <button
                className={`${css.smallTile} ${css.goodTile} ${css.buttonTile}`}
                onClick={() => utils.takeHaciendaPlantation()}
              >
                <span className={css.goodName}>{theme.actions.haciendaTile}</span>
              </button>
            )}
            {bank.plantationRow.map((plantation, index) =>
              canSettle ? (
                <button
                  key={`${plantation}-${index}`}
                  className={`${css.smallTile} ${css.goodTile} ${css.buttonTile}`}
                  style={{ backgroundColor: theme.colors[plantation] }}
                  onClick={() => utils.settlePlantation(index)}
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
                className={`${css.smallTile} ${css.goodTile} ${css.buttonTile}`}
                style={{ backgroundColor: theme.colors.quarry }}
                onClick={() => utils.settleQuarry()}
                disabled={!utils.canSettleQuarry(currentPlayer)}
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
                        className={css.shipActionButton}
                        onClick={() => utils.shipGood(option.good, option.shipIndex)}
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
          <strong className={css.tileTitle}>{theme.labels.colonistShip} {bank.colonistShip}/{bank.colonistSupply}</strong>
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
      </div>
    </div>
  );
}

export default BankView;
