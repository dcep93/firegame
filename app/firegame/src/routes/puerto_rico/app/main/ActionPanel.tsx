import css from "../index.module.css";
import { goodsInThemeOrder, theme } from "../theme/base";
import utils, { store } from "../utils/utils";

function ActionPanel() {
  const game = store.gameW.game;
  const player = game.players[game.currentPlayer];
  return (
    <div className={`${css.section} ${utils.isMyTurn() ? css.turnActionPanel : ""}`}>
      <h3 className={css.heading}>{theme.phase[game.phase]}</h3>
      {game.phase === "role" && (
        <div className={css.actionLead}>
          {utils.isRolePicker()
            ? theme.actions.chooseRole
            : theme.actions.choosingRole(game.players[game.rolePicker]?.userName)}
        </div>
      )}
      {game.phase === "settler" && (
        <div className={css.row}>
          {utils.canUseHacienda(player) && (
            <button
              className={`${css.smallTile} ${css.buttonTile}`}
              onClick={() => utils.takeHaciendaPlantation()}
              disabled={!utils.isMyTurn()}
            >
              {theme.actions.haciendaTile}
            </button>
          )}
          {game.bank.plantationRow.map((plantation, index) => (
            <button
              key={`${plantation}-${index}`}
              className={`${css.smallTile} ${css.goodTile} ${css.buttonTile}`}
              style={{ backgroundColor: theme.colors[plantation] }}
              onClick={() => utils.settlePlantation(index)}
              disabled={!utils.isMyTurn()}
            >
              <span className={css.goodName}>{theme.plantations[plantation]}</span>
            </button>
          ))}
          <button
            className={`${css.smallTile} ${css.goodTile} ${css.buttonTile}`}
            style={{ backgroundColor: theme.colors.quarry }}
            onClick={() => utils.settleQuarry()}
            disabled={!utils.isMyTurn() || !utils.canSettleQuarry(player)}
          >
            <span className={css.goodName}>{theme.plantations.quarry}</span>
          </button>
          <button onClick={() => utils.skipAction()} disabled={!utils.canPass()}>
            {theme.controls.pass}
          </button>
        </div>
      )}
      {game.phase === "mayor" && (
        <div className={css.actionLead}>{theme.actions.mayorHelp}</div>
      )}
      {game.phase === "builder" && (
        <div>
          <div className={css.muted}>{theme.actions.buildPrompt}</div>
          <button onClick={() => utils.skipAction()} disabled={!utils.canPass()}>
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
              {theme.actions.take} {theme.goods[good]}
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
              {theme.actions.sell} {theme.goods[good]}
            </button>
          ))}
          <button onClick={() => utils.skipAction()} disabled={!utils.canPass()}>
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
              {theme.actions.ship} {option.amount} {theme.goods[option.good]} {theme.actions.onShip} {option.shipIndex + 1}
            </button>
          ))}
          {utils.wharfOptions(player).map((option) => (
            <button
              key={`wharf-${option.good}`}
              onClick={() => utils.useWharf(option.good)}
              disabled={!utils.isMyTurn()}
            >
              {theme.actions.wharf} {option.amount} {theme.goods[option.good]}
            </button>
          ))}
        </div>
      )}
      {game.phase === "storage" && (
        <div>
          <div className={css.muted}>{theme.actions.storagePrompt}</div>
          <div className={css.row}>
            {goodsInThemeOrder.map((good) => (
              <button
                key={good}
                onClick={() => utils.discardGood(good)}
                disabled={!utils.isMyTurn() || player.goods[good] <= 0}
              >
                {theme.actions.discard} {theme.goods[good]}
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
