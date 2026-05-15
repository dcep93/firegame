import css from "../index.module.css";
import { store } from "../utils/utils";

function ScoreBoard() {
  const game = store.gameW.game;
  return (
    <div className={css.section}>
      <h3 className={css.heading}>Final scoring</h3>
      {game.endTriggered && <div className={css.danger}>{game.endTriggered}</div>}
      {(game.scores || []).map((score, index) => {
        const player = game.players[score.playerIndex];
        return (
          <div key={score.playerIndex} className={`${css.tile} ${css.score}`}>
            {index + 1}. {player.userName}: {score.total} VP
            <div className={css.tiny}>
              Shipped {score.shipped}, buildings {score.buildings}, large buildings{" "}
              {score.largeBuildings}, tie breaker {score.tieBreaker}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ScoreBoard;
