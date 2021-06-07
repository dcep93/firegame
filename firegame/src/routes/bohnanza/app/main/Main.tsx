import React from "react";
import styles from "../../../../shared/styles.module.css";
import beans from "../utils/beans";
import { Phase } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Main extends React.Component<
  {},
  { selectedTable?: number; table?: number[] }
> {
  componentDidUpdate() {
    if (this.state.table?.toString() !== store.gameW.game.table?.toString()) {
      this.setState({ selectedTable: -1 });
    }
  }

  render() {
    return (
      <div>
        {store.gameW.game.players.map((p, i) => (
          <div key={i} className={styles.bubble}>
            <h2>{p.userName}</h2>
            <div>hand: {(p.hand || []).length}</div>
            <div>money: {(p.money || []).length}</div>
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
                {store.gameW.game.phase === Phase.plantSecond && (
                  <button onClick={() => this.pass()}>pass</button>
                )}
                {(p.hand || []).map((c, j) => (
                  <div key={j} onClick={() => this.clickCard(j)}>
                    {this.renderCard(c)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {this.renderTable()}
      </div>
    );
  }

  renderField(index: number): React.ReactElement {
    const me = utils.getMe();
    const field = me.fields[index];
    if (!field.purchased) return <div>not purchased</div>;
    if (field.bean === -1) return <div>empty</div>;
    return (
      <div>
        {this.renderCard(field.bean)}
        <div>count: {field.count}</div>
        <div>
          <button onClick={() => this.harvest(index)}>harvest</button>
        </div>
      </div>
    );
  }

  harvest(index: number) {
    if (store.gameW.game.players.length === 2 && !utils.isMyTurn())
      return alert("can only harvest on your turn");
    const me = utils.getMe();
    const field = me.fields[index];
    const bean = beans[field.bean];
    const count = field.count;

    if (count === 1 && me.fields.find((f) => f.count > 1))
      return alert(
        "cannot harvest from a field with one bean unless all fields have only a single bean"
      );

    const earnings =
      bean.earnings
        .map((e, i) => ({ e, i }))
        .filter((e) => e.e > count)
        .reverse()[0]?.i + 1 || 0;
    if (!me.money) me.money = [];
    me.money.push(...utils.repeat(field.bean, earnings));

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
      if ((me.money || []).length < 3) {
        alert("not enough money to buy this field");
        return;
      }
      const paid = me.money!.splice(0, 3);
      if (store.gameW.game.players.length > 2) {
        if (!store.gameW.game.discard) store.gameW.game.discard = [];
        store.gameW.game.discard.push(...paid);
      }
      field.purchased = true;
      store.update("purchased a field");
      return;
    }
    switch (store.gameW.game.phase) {
      case Phase.plant:
      case Phase.plantSecond:
        if (!utils.isMyTurn()) return;
        if (field.bean !== -1 && field.bean !== me.hand![0])
          return alert("need to plant same type of bean");
        field.bean = me.hand!.unshift();
        field.count++;
        if (store.gameW.game.phase === Phase.plant && me.hand!.length > 0) {
          store.gameW.game.phase = Phase.plantSecond;
        } else {
          this.flip();
        }
        store.update(`planted ${beans[field.bean].name} from hand`);
        break;
      case Phase.draw:
        if (this.state.selectedTable === undefined) return;
        const selected = store.gameW.game.table![this.state.selectedTable];
        if (!selected) return;
        if (utils.isMyTurn()) {
          if (selected.origin === utils.currentIndex()) {
            return alert("cannot plant card from own hand");
          }
        } else {
          if (
            selected.origin !== -1 &&
            selected.origin !== utils.currentIndex()
          ) {
            return alert("can only plant cards from current player");
          }
        }

        if (field.bean !== -1 && field.bean !== selected.bean)
          return alert("need to plant same type of bean");
        field.bean = store.gameW.game.table!.splice(
          this.state.selectedTable,
          1
        )[0].bean;
        field.count++;
        if (store.gameW.game.table!.length === 0) {
          utils.incrementPlayerTurn();
          store.gameW.game.phase = Phase.plant;
          const p = utils.getCurrent();
          if (!p.hand) p.hand = [];
          p.hand.push(...this.draw(3));
        }
        store.update(`planted ${beans[field.bean].name} from table`);
    }
  }

  flip() {
    store.gameW.game.phase = Phase.draw;
    store.gameW.game.table = this.draw(2).map((b) => ({ bean: b, origin: -1 }));
  }

  pass() {
    this.flip();
    store.update("passed");
  }

  draw(num: number): number[] {
    if (!store.gameW.game.deck) store.gameW.game.deck = [];
    const deck = store.gameW.game.deck;
    if ((deck || []).length < num) {
      deck.push(...utils.shuffle(store.gameW.game.discard!.splice(0)));
      store.gameW.game.shuffles++;
    }
    return deck!.splice(0, num);
  }

  clickCard(index: number) {
    if (store.gameW.game.phase !== Phase.draw) return;
    const bean = utils.getMe().hand!.splice(index, 1)[0];
    store.gameW.game.table!.push({
      origin: utils.myIndex(),
      bean,
    });
    store.update(`donated ${beans[bean].name}`);
  }

  renderTable() {
    if (store.gameW.game.phase !== Phase.draw) return;
    return store.gameW.game.table!.map((d, i) => (
      <div
        key={i}
        onClick={() =>
          this.setState({
            selectedTable: this.state.selectedTable === i ? -1 : i,
          })
        }
      >
        <div>
          {this.renderCard(d.bean)}
          <div>origin: {store.gameW.game.players[d.origin]?.userName}</div>
        </div>
      </div>
    ));
  }
}

export default Main;
