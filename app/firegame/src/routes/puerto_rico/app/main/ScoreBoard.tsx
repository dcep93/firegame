import css from "../index.module.css";
import { theme } from "../theme/base";
import { store } from "../utils/utils";

function ScoreBoard() {
  const game = store.gameW.game;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>{theme.labels.finalScoring}</h3>
      {game.endTriggered && <div className={css.danger}>{game.endTriggered}</div>}
      <div className={css.scoreTable}>
        {(game.scores || []).map((score, index) => {
          const player = game.players[score.playerIndex];
          return (
            <div key={score.playerIndex} className={css.scoreRow}>
              <span className={css.scoreRank}>{index + 1}</span>
              <strong>{player.userName}</strong>
              <span>{score.shipped} {theme.labels.shipped}</span>
              <span>{score.buildings} {theme.labels.buildingScore}</span>
              <span>{score.largeBuildings} {theme.labels.bonus}</span>
              <span>{score.tieBreaker} {theme.labels.tie}</span>
              <strong className={css.scoreTotal}>{score.total} {theme.labels.vp}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScoreBoard;
