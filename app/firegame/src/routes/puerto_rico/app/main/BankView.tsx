import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import { store } from "../utils/utils";

function BankView() {
  const bank = store.gameW.game.bank;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Board</h3>
      <div className={css.row}>
        <div className={css.tile}>
          <strong>Plantations</strong>
          <div className={css.row}>
            {bank.plantationRow.map((plantation, index) => (
              <div
                key={`${plantation}-${index}`}
                className={css.smallTile}
                style={{ background: theme.colors[plantation] }}
              >
                {theme.plantations[plantation]}
              </div>
            ))}
          </div>
          <div className={css.tiny}>Deck {bank.plantationDeck.length}</div>
          <div className={css.tiny}>Discard {bank.plantationDiscard.length}</div>
          <div className={css.tiny}>Quarries {bank.quarrySupply}</div>
        </div>
        <div className={css.tile}>
          <strong>Goods supply</strong>
          {goodsInThemeOrder.map((good) => (
            <div key={good}>
              {theme.goods[good]}: {bank.goodsSupply[good]}
            </div>
          ))}
        </div>
        <div className={css.tile}>
          <strong>Trading house</strong>
          {bank.tradingHouse.length === 0 && <div className={css.muted}>Empty</div>}
          {bank.tradingHouse.map((good, index) => (
            <div key={`${good}-${index}`}>{theme.goods[good]}</div>
          ))}
        </div>
        <div className={css.tile}>
          <strong>Cargo ships</strong>
          {bank.cargoShips.map((ship, index) => (
            <div key={index}>
              Ship {index + 1}: {ship.count}/{ship.capacity}{" "}
              {ship.good ? theme.goods[ship.good] : "empty"}
            </div>
          ))}
        </div>
        <div className={css.tile}>
          <strong>Colonist ship</strong>
          <div>{bank.colonistShip} colonists</div>
          <div className={css.tiny}>{bank.colonistSupply} in supply</div>
        </div>
      </div>
    </div>
  );
}

export default BankView;
