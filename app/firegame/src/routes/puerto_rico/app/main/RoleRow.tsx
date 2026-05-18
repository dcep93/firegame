import css from "../index.module.css";
import { theme } from "../theme/base";
import { GameType } from "../utils/NewGame";
import { GoodId, RoleId, ROLE_KIND } from "../utils/rules";
import utils, { store } from "../utils/utils";

const roleIconText: Record<RoleId, string> = {
  settler: "SET",
  mayor: "MAY",
  builder: "BLD",
  craftsman: "CRF",
  trader: "TRD",
  captain: "CAP",
  prospector_1: "P1",
  prospector_2: "P2",
};

function RoleRow(props: { game?: GameType; readOnly?: boolean }) {
  const game = props.game || store.gameW.game;
  const canChooseCraftsmanBonus =
    !props.readOnly && game.phase === "craftsman_bonus" && utils.isMyTurn();
  const craftsmanBonusGoods = canChooseCraftsmanBonus
    ? game.producedGoods?.[game.roleOwner || 0] || []
    : [];
  return (
    <div className={css.section}>
      <h3 className={css.heading}>{theme.labels.roles}</h3>
      <div className={css.roleGrid}>
        {game.roles.map((role) => {
          const canChoose = !props.readOnly && game.phase === "role" && role.takenBy === undefined && utils.isRolePicker();
          const content = (
            <>
            <RoleIcon roleId={role.id} />
            <div className={css.tileTitle}>{theme.roles[role.id]}</div>
            <div className={css.roleLine}>* {theme.roleRewards[role.id]}</div>
            <div className={css.roleLine}>{theme.roleDescriptions[role.id]}</div>
            <div className={css.roleFooter}>
              <span className={css.resourceLine}>{role.doubloons} {theme.labels.doubloons}</span>
              {role.takenBy !== undefined && (
                <span className={css.roleTakenChip}>{game.players[role.takenBy]?.userName}</span>
              )}
            </div>
            {ROLE_KIND[role.id] === "craftsman" && canChooseCraftsmanBonus && (
              <div className={css.roleActionRow}>
                {craftsmanBonusGoods.map((good) => (
                  <CraftsmanBonusButton key={good} good={good} />
                ))}
                <button
                  type="button"
                  className={css.inlineActionButton}
                  onClick={() => utils.skipCraftsmanBonus()}
                >
                  {theme.controls.skipBonus}
                </button>
              </div>
            )}
            </>
          );
          return canChoose ? (
            <button
              key={role.id}
              className={`${css.tile} ${css.buttonTile} ${css.roleTile}`}
              onClick={() => utils.chooseRole(role.id)}
            >
              {content}
            </button>
          ) : (
            <div key={role.id} className={`${css.tile} ${css.roleTile}`}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoleIcon(props: { roleId: RoleId }) {
  const kind = ROLE_KIND[props.roleId];
  return (
    <span className={`${css.roleIcon} ${css[`roleIcon_${kind}`]}`} aria-hidden="true">
      <span className={css.roleIconGlyph} />
      <span className={css.roleIconText}>{roleIconText[props.roleId]}</span>
    </span>
  );
}

function CraftsmanBonusButton(props: { good: GoodId }) {
  return (
    <button
      type="button"
      className={`${css.smallTile} ${css.goodTile} ${css.playerGoodActionTile}`}
      style={{ backgroundColor: theme.colors[props.good] }}
      disabled={store.gameW.game.bank.goodsSupply[props.good] <= 0}
      onClick={() => utils.chooseCraftsmanBonus(props.good)}
    >
      <span className={css.goodName}>{theme.actions.take} {theme.goods[props.good]}</span>
    </button>
  );
}

export default RoleRow;
