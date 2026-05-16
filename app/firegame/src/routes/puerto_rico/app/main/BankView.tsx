import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import { TRADER_PRICES } from "../utils/rules";
import { store } from "../utils/utils";

function BankView() {
  const bank = store.gameW.game.bank;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Board</h3>
      <div className={css.boardGrid}>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>Plantations</strong>
          <div className={css.boardStatsLine}>
            <span>Deck {bank.plantationDeck.length}</span>
            <span>Discard {bank.plantationDiscard.length}</span>
            <span>Quarries {bank.quarrySupply}</span>
          </div>
          <div className={css.compactRow}>
            {bank.plantationRow.map((plantation, index) => (
              <div
                key={`${plantation}-${index}`}
                className={`${css.smallTile} ${css.goodTile}`}
                style={{ backgroundColor: theme.colors[plantation] }}
              >
                {theme.plantations[plantation]}
              </div>
            ))}
          </div>
        </div>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>Goods supply</strong>
          {goodsInThemeOrder.map((good) => (
            <div
              key={good}
              className={`${css.metricRow} ${css.coloredMetricRow}`}
              style={{ backgroundColor: theme.colors[good] }}
            >
              <span>{theme.goods[good]}</span>
              <strong>{bank.goodsSupply[good]}</strong>
            </div>
          ))}
        </div>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>Trading house</strong>
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
                    "Open"
                  )}
                </div>
              );
            })}
          </div>
          <div className={css.tradeValues}>
            {goodsInThemeOrder.map((good) => (
              <span key={good} title={`${theme.goods[good]} sells for ${TRADER_PRICES[good]}`}>
                {theme.goods[good]} {TRADER_PRICES[good]}
              </span>
            ))}
          </div>
        </div>
        <div className={`${css.tile} ${css.boardTile}`}>
          <strong className={css.tileTitle}>Cargo ships</strong>
          {bank.cargoShips.map((ship, index) => (
            <div
              key={index}
              className={`${css.metricRow} ${css.shipRow}`}
              style={{ backgroundColor: ship.good ? theme.colors[ship.good] : undefined }}
            >
              <span>Ship {index + 1} {ship.count}/{ship.capacity}</span>
              <strong>
                {ship.good ? theme.goods[ship.good] : "Empty"}
              </strong>
            </div>
          ))}
          <div className={css.colonistShipPanel}>
            <strong>Colonist ship</strong>
            <span>{bank.colonistShip} colonists</span>
            <span>{bank.colonistSupply} in supply</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankView;
