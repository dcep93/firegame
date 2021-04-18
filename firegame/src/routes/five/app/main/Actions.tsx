import React, { RefObject } from "react";
import styles from "../../../../shared/styles.module.css";
import { Action, PlayerType, Turn } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

type turnData = {
  p: PlayerType;
  t: Turn;
};

class Actions extends React.Component<
  {},
  { selected: { [a in Action]?: boolean } }
> {
  blockRef: RefObject<HTMLSelectElement> = React.createRef();
  constructor(params: {}) {
    super(params);
    this.state = { selected: {} };
  }

  render() {
    return (
      <div>
        <div>
          {utils.enumArray(Action).map((a, i) => (
            <div
              key={i}
              className={[
                styles.bubble,
                this.state.selected[a as Action] && styles.blue,
              ].join(" ")}
              onClick={() => this.select(a)}
            >
              {Action[a]}
              {a === Action.Block && (
                <span>
                  {" "}
                  <select ref={this.blockRef}>
                    {utils.enumArray(Action).map((a, i) => (
                      <option key={i}>{Action[a as Action]}</option>
                    ))}
                  </select>
                </span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.bubble}>
          <button disabled={!utils.isMyTurn()} onClick={this.submit.bind(this)}>
            submit
          </button>
        </div>
      </div>
    );
  }

  select(a: Action) {
    const selected = this.state.selected;
    selected[a] = !selected[a];
    this.setState({});
  }

  submit() {
    const twoInARow = utils.getMe().twoInARow;
    if (twoInARow !== undefined && this.state.selected[twoInARow]) {
      alert(`cannot select the same action 3 times in a row - ${twoInARow}`);
      return;
    }
    const rawSelected = Object.entries(this.state.selected)
      .filter(([a, s]) => s)
      .map(([a, s]) => parseInt(a) as Action);
    if (rawSelected.length > 2) {
      alert("cannot select more than 2 options");
      return;
    }
    if (utils.objEqual(rawSelected, utils.getMe().lastRound || [])) {
      alert("cannot select the same actions 2 rounds in a row");
      return;
    }
    const turn = {
      actions: rawSelected,
      blocked: this.state.selected[Action.Block]
        ? utils.enumNameToValue(this.blockRef.current!.value, Action)
        : null,
    };
    if (store.gameW.game.staged === undefined) {
      store.gameW.game.staged = turn;
      utils.incrementPlayerTurn();
      store.update("submitted");
      return;
    }
    const myData = {
      p: utils.getMe(),
      t: turn,
    };
    const oppData = {
      p: utils.getOpponent(),
      t: store.gameW.game.staged!,
    };
    utils
      .enumArray(Action)
      .sort()
      .forEach((a) => {
        this.perform(a, myData, oppData);
        this.perform(a, oppData, myData);
      });
    this.handle(myData);
    this.handle(oppData);
    utils.incrementPlayerTurn();
    store.gameW.game.round++;
    const message = [turn, store.gameW.game.staged]
      .map((t) =>
        t.actions
          .map(
            (a) =>
              Action[a] + (a === Action.Block ? `(${Action[t.blocked!]})` : "")
          )
          .join(",")
      )
      .join(" / ");
    delete store.gameW.game.staged;
    store.update(message);
  }

  perform(a: Action, myTurnData: turnData, oppTurnData: turnData) {
    if (!myTurnData.t.actions.includes(a)) return;
    if (oppTurnData.t.actions.includes(a)) return;
    if (myTurnData.p.blocked === a) return;
    switch (a) {
      case Action.Score:
        myTurnData.p.chips++;
        break;
      case Action.Grow:
        store.gameW.game.pot++;
        break;
      case Action.Claim:
        if (!oppTurnData.t.actions.includes(Action.Steal)) {
          myTurnData.p.chips += store.gameW.game.pot;
          store.gameW.game.pot = 1;
        }
        break;
      case Action.Steal:
        if (oppTurnData.t.actions.includes(Action.Claim)) {
          myTurnData.p.chips += store.gameW.game.pot;
          store.gameW.game.pot = 1;
        }
        break;
      case Action.Block:
        oppTurnData.p.blocked = myTurnData.t.blocked!;
        // todo - clear blocked
        break;
      default:
        throw new Error("unimplemented");
    }
  }

  handle(td: turnData) {
    td.p.twoInARow = td.t.actions.filter((a) => td.p.lastRound?.includes(a))[0];
    if (td.p.twoInARow === undefined) {
      delete td.p.twoInARow;
    }
    td.p.lastRound = td.t.actions;
    Object.assign(td.p.lights, ...td.t.actions.map((a) => ({ [a]: true })));
    if (
      Object.values(td.p.lights).filter((i) => i).length ===
      utils.enumArray(Action).length
    ) {
      Object.assign(
        td.p.lights,
        ...utils.enumArray(Action).map((a) => ({ [a]: false }))
      );
      td.p.chips++;
    }
  }
}

export default Actions;
