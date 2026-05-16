import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import { TRADER_PRICES } from "../utils/rules";
import { store } from "../utils/utils";

function BankView() {
  const bank = store.gameW.game.bank;
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
            {bank.plantationRow.map((plantation, index) => (
              <div
                key={`${plantation}-${index}`}
                className={`${css.smallTile} ${css.goodTile}`}
                style={{ backgroundColor: theme.colors[plantation] }}
              >
                <span className={css.goodName}>{theme.plantations[plantation]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>{theme.labels.cargoShips}</strong>
          {bank.cargoShips.map((ship, index) => (
            <div
              key={index}
              className={`${css.metricRow} ${css.shipRow}`}
              style={{ backgroundColor: ship.good ? theme.colors[ship.good] : undefined }}
            >
              <strong>{ship.good ? theme.goods[ship.good] : theme.labels.empty} {ship.count}/{ship.capacity}</strong>
            </div>
          ))}
          <div className={css.cargoSubsection}>
            <strong className={css.tileTitle}>{theme.labels.tradingHouse}</strong>
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
