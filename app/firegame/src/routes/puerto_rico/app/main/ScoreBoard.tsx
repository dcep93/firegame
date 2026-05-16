import css from "../index.module.css";
import { store } from "../utils/utils";

function ScoreBoard() {
  const game = store.gameW.game;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Final scoring</h3>
      {game.endTriggered && <div className={css.danger}>{game.endTriggered}</div>}
      <div className={css.scoreTable}>
        {(game.scores || []).map((score, index) => {
          const player = game.players[score.playerIndex];
          return (
            <div key={score.playerIndex} className={css.scoreRow}>
              <span className={css.scoreRank}>{index + 1}</span>
              <strong>{player.userName}</strong>
              <span>{score.shipped} shipped</span>
              <span>{score.buildings} buildings</span>
              <span>{score.largeBuildings} bonus</span>
              <span>{score.tieBreaker} tie</span>
              <strong className={css.scoreTotal}>{score.total} VP</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScoreBoard;
