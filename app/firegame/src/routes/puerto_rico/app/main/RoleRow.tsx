import css from "../index.module.css";
import { theme } from "../theme/base";
import { ROLE_KIND } from "../utils/rules";
import utils, { store } from "../utils/utils";

function RoleRow() {
  const game = store.gameW.game;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Roles</h3>
      <div className={css.row}>
        {game.roles.map((role) => (
          <button
            key={role.id}
            className={`${css.tile} ${css.buttonTile}`}
            disabled={game.phase !== "role" || role.takenBy !== undefined || !utils.isRolePicker()}
            onClick={() => utils.chooseRole(role.id)}
          >
            <div>{theme.roles[role.id]}</div>
            <div className={css.tiny}>{ROLE_KIND[role.id]}</div>
            <div>{role.doubloons} doubloons</div>
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
