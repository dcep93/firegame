import React from "react";
import styles from "../../../../shared/styles.module.css";
import beans from "../utils/beans";
import { Phase } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    return store.gameW.game.players.map((p, i) => (
      <div key={i} className={styles.bubble}>
        <h2>{p.userName}</h2>
        <div>hand: {(p.hand || []).length}</div>
        <div>money: {p.money}</div>
        <div className={styles.flex}>
          {p.fields.map((_, j) => (
            <div
              key={j}
              onClick={() => utils.myIndex() === i && this.clickField(j)}
            >
              {this.renderField(j)}
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

  renderField(index: number): React.ReactElement {
    const me = utils.getMe();
    const field = me.fields[index];
    if (!field.purchased) return <div>not purchased</div>;
    if (field.bean === -1) return <div>empty</div>;
    return (
      <div>
        <div>count: {field.count}</div>
        <div>
          <button onClick={() => this.harvest(index)}>harvest</button>
        </div>
        {this.renderCard(field.bean)}
      </div>
    );
  }

  harvest(index: number) {
    const me = utils.getMe();
    const field = me.fields[index];
    const bean = beans[field.bean];
    const count = field.count;

    const earnings =
      bean.earnings
        .map((e, i) => ({ e, i }))
        .filter((e) => e.e > count)
        .reverse()[0]?.i + 1 || 0;
    me.money += earnings;

    if (!store.gameW.game.discard) store.gameW.game.discard = [];
    store.gameW.game.discard.push(
      ...utils.repeat(field.bean, field.count - earnings)
    );

    field.bean = -1;
    field.count = 0;
    store.update(`harvested ${count} ${bean.name} for ${earnings}`);
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

  clickField(index: number) {
    const me = utils.getMe();
    const field = me.fields[index];
    if (!field.purchased) {
      if (me.money < 3) {
        alert("not enough money to buy this field");
        return;
      }
      me.money -= 3;
      field.purchased = true;
      store.update("purchased a field");
      return;
    }
    switch (store.gameW.game.phase) {
      case Phase.plant:
    }
  }

  clickCard(index: number) {}
}

export default Main;
