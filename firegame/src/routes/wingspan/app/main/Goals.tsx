import React from "react";
import styles from "../../../../shared/styles.module.css";
import GoalsBank from "../utils/goals_bank";
import utils, { store } from "../utils/utils";

class Goals extends React.Component {
  render() {
    return (
      <div className={styles.bubble}>
        <h2>Goals</h2>
        {store.gameW.game.goals.map((gw, i) => (
          <div>
            {utils.goalScoring[i].map((val, j) => this.goalCell(val, i, j))}
            <span>{GoalsBank[gw.index].goal}</span>
          </div>
        ))}
      </div>
    );
  }

  goalCell(val: number, i: number, j: number) {
    const rankings = store.gameW.game.goals[i].rankings[j];
    return (
      <span
        className={styles.bubble}
        onClick={() => this.toggleGoalCell(rankings, i, j)}
      >
        <div>{val}</div>
        <div>
          {Object.entries(rankings)
            .map(([id, selected]) => ({ id, selected }))
            .filter((i) => i.selected)
            .map((i) => parseInt(i.id))
            .map((i) => `p${i + 1}`)
            .join(" ")}
        </div>
      </span>
    );
  }

  toggleGoalCell(rankings: { [n: number]: boolean }, i: number, j: number) {
    const myIndex = utils.myIndex();
    if (myIndex < 0) return;
    rankings[myIndex] = !rankings[myIndex];
    store.update(`toggled goal ${i + 1} ${j + 1}`);
  }
}

export default Goals;
