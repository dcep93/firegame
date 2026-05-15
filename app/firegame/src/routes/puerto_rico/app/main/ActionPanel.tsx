import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import utils, { store } from "../utils/utils";

function ActionPanel() {
  const game = store.gameW.game;
  const player = game.players[game.currentPlayer];
  return (
    <div className={`${css.section} ${utils.isMyTurn() ? css.active : ""}`}>
      <h3 className={css.heading}>{theme.phase[game.phase]}</h3>
      {!utils.isMyTurn() && <div>Waiting for {player?.userName}</div>}
      {game.phase === "role" && (
        <div>{game.players[game.rolePicker]?.userName} chooses a role.</div>
      )}
      {game.phase === "settler" && (
        <div className={css.row}>
          {game.bank.plantationRow.map((plantation, index) => (
            <button
              key={`${plantation}-${index}`}
              className={`${css.smallTile} ${css.buttonTile}`}
              style={{ background: theme.colors[plantation] }}
              onClick={() => utils.settlePlantation(index)}
              disabled={!utils.isMyTurn()}
            >
              {theme.plantations[plantation]}
            </button>
          ))}
          <button
            className={`${css.smallTile} ${css.buttonTile}`}
            onClick={() => utils.settleQuarry()}
            disabled={!utils.isMyTurn() || player?.index !== game.roleOwner}
          >
            Quarry
          </button>
          <button onClick={() => utils.skipAction()} disabled={!utils.isMyTurn()}>
            {theme.controls.pass}
          </button>
        </div>
      )}
      {game.phase === "mayor" && (
        <div className={css.row}>
          <button onClick={() => utils.clearColonists()} disabled={!utils.isMyTurn()}>
            {theme.controls.clearColonists}
          </button>
          <button onClick={() => utils.finishMayor()} disabled={!utils.isMyTurn()}>
            {theme.controls.finishPlacement}
          </button>
        </div>
      )}
      {game.phase === "builder" && (
        <div>
          <div className={css.muted}>Build from the market below or pass.</div>
          <button onClick={() => utils.skipAction()} disabled={!utils.isMyTurn()}>
            {theme.controls.pass}
          </button>
        </div>
      )}
      {game.phase === "craftsman_bonus" && (
        <div className={css.row}>
          {(game.producedGoods?.[game.roleOwner || 0] || []).map((good) => (
            <button
              key={good}
              onClick={() => utils.chooseCraftsmanBonus(good)}
              disabled={!utils.isMyTurn() || game.bank.goodsSupply[good] <= 0}
            >
              Take {theme.goods[good]}
            </button>
          ))}
          <button onClick={() => utils.skipCraftsmanBonus()} disabled={!utils.isMyTurn()}>
            {theme.controls.skipBonus}
          </button>
        </div>
      )}
      {game.phase === "trader" && (
        <div className={css.row}>
          {utils.tradeGoods(player).map((good) => (
            <button key={good} onClick={() => utils.sellGood(good)} disabled={!utils.isMyTurn()}>
              Sell {theme.goods[good]}
            </button>
          ))}
          <button onClick={() => utils.skipAction()} disabled={!utils.isMyTurn()}>
            {theme.controls.pass}
          </button>
        </div>
      )}
      {game.phase === "captain" && (
        <div className={css.row}>
          {utils.shipOptions(player).map((option) => (
            <button
              key={`${option.good}-${option.shipIndex}`}
              onClick={() => utils.shipGood(option.good, option.shipIndex)}
              disabled={!utils.isMyTurn()}
            >
              Ship {option.amount} {theme.goods[option.good]} on ship {option.shipIndex + 1}
            </button>
          ))}
        </div>
      )}
      {game.phase === "storage" && (
        <div>
          <div className={css.muted}>Discard down to one good.</div>
          <div className={css.row}>
            {goodsInThemeOrder.map((good) => (
              <button
                key={good}
                onClick={() => utils.discardGood(good)}
                disabled={!utils.isMyTurn() || player.goods[good] <= 0}
              >
                Discard {theme.goods[good]}
              </button>
            ))}
            <button onClick={() => utils.finishStorage()} disabled={!utils.isMyTurn()}>
              {theme.controls.finishStorage}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionPanel;
