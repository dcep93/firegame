import css from "../index.module.css";
import { theme } from "../theme/base";
import { GameType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

function RoleRow(props: { game?: GameType; readOnly?: boolean }) {
  const game = props.game || store.gameW.game;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>{theme.labels.roles}</h3>
      <div className={css.roleGrid}>
        {game.roles.map((role) => {
          const canChoose = !props.readOnly && game.phase === "role" && role.takenBy === undefined && utils.isRolePicker();
          const content = (
            <>
            <div className={css.tileTitle}>{theme.roles[role.id]}</div>
            <div className={css.roleLine}>* {theme.roleRewards[role.id]}</div>
            <div className={css.roleLine}>{theme.roleDescriptions[role.id]}</div>
            <div className={css.roleFooter}>
              <span className={css.resourceLine}>{role.doubloons} {theme.labels.doubloons}</span>
              {role.takenBy !== undefined && (
                <span className={css.roleTakenChip}>{game.players[role.takenBy]?.userName}</span>
              )}
            </div>
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

export default RoleRow;
