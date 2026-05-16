import css from "../index.module.css";
import { theme } from "../theme/base";
import utils, { store } from "../utils/utils";

function RoleRow() {
  const game = store.gameW.game;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Roles</h3>
      <div className={css.roleGrid}>
        {game.roles.map((role) => (
          <button
            key={role.id}
            className={`${css.tile} ${css.buttonTile} ${css.roleTile}`}
            disabled={game.phase !== "role" || role.takenBy !== undefined || !utils.isRolePicker()}
            onClick={() => utils.chooseRole(role.id)}
          >
            <div className={css.tileTitle}>{theme.roles[role.id]}</div>
            <div className={css.roleLine}>* {theme.roleRewards[role.id]}</div>
            <div className={css.roleLine}>{theme.roleDescriptions[role.id]}</div>
            <div className={css.resourceLine}>{role.doubloons} doubloons</div>
            {role.takenBy !== undefined && (
              <div className={css.muted}>Taken by {game.players[role.takenBy]?.userName}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoleRow;
