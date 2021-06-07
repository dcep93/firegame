import React from "react";
import styles from "../../../../shared/styles.module.css";
import beans from "../utils/beans";
import { Field } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    return store.gameW.game.players.map((p, i) => (
      <div key={i} className={styles.bubble}>
        <h2>{p.userName}</h2>
        <div>hand: {(p.hand || []).length}</div>
        <div>money: {p.money}</div>
        <div className={styles.flex}>
          {p.fields.map((f, j) => (
            <div
              key={j}
              onClick={() => utils.myIndex() === i && this.clickField(j)}
            >
              {this.renderField(f)}
            </div>
          ))}
        </div>
        {utils.myIndex() === i && (
          <div className={styles.flex}>
            {(p.hand || []).map((c, j) => (
              <div key={j} onClick={() => this.clickCard(j)}>
                {this.renderCard(c)}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  }

  renderField(field: Field): React.ReactElement {
    if (!field.purchased) return <div>not purchased</div>;
    return (
      <div>
        <div>count: {field.count}</div>
        {this.renderCard(field.bean)}
      </div>
    );
  }

  renderCard(index: number) {
    const bean = beans[index];
    return (
      <div>
        <div>{bean.name}</div>
        <div>total: {bean.quantity}</div>
        <div>{bean.earnings.join(" ")}</div>
      </div>
    );
  }

  clickField(index: number) {}

  clickCard(index: number) {}
}

export default Main;
