import React, { RefObject } from "react";
import styles from "../../../../shared/styles.module.css";
import { Action, PlayerType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

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
    const selected = rawSelected.flatMap((a) =>
      a === Action.Block
        ? [a, utils.enumNameToValue(this.blockRef.current!.value, Action)]
        : a
    );
    if (store.gameW.game.stagedAction === undefined) {
      store.gameW.game.stagedAction = selected;
      utils.incrementPlayerTurn();
      store.update("submitted");
      return;
    }
    utils
      .enumArray(Action)
      .sort()
      .forEach((a) => {
        this.perform(
          a,
          utils.getMe(),
          selected,
          store.gameW.game.stagedAction!
        );
        this.perform(
          a,
          utils.getOpponent(),
          store.gameW.game.stagedAction!,
          selected
        );
      });
    this.handle(utils.getMe(), selected);
    this.handle(utils.getOpponent(), store.gameW.game.stagedAction);
    utils.incrementPlayerTurn();
    store.gameW.game.round++;
    const message = [selected, store.gameW.game.stagedAction]
      .map((actions) => actions!.map((a) => Action[a]).join(","))
      .join(" / ");
    delete store.gameW.game.stagedAction;
    store.update(message);
  }

  perform(a: Action, p: PlayerType, selected: Action[], oppSelected: Action[]) {
    if (!selected.includes(a)) return;
    if (oppSelected.includes(a)) return;
    if (p.blocked === a) return;
    switch (a) {
      case Action.Score:
        p.chips++;
        break;
      case Action.Grow:
        store.gameW.game.pot++;
        break;
      case Action.Claim:
        if (!oppSelected.includes(Action.Steal)) {
          p.chips += store.gameW.game.pot;
          store.gameW.game.pot = 1;
        }
        break;
      case Action.Steal:
        if (oppSelected.includes(Action.Claim)) {
          p.chips += store.gameW.game.pot;
          store.gameW.game.pot = 1;
        }
        break;
      case Action.Block:
        // todo
        break;
      default:
        throw new Error("unimplemented");
    }
  }

  handle(p: PlayerType, selected: Action[]) {
    p.twoInARow = selected.filter((a) => p.lastRound?.includes(a))[0];
    if (p.twoInARow === undefined) {
      delete p.twoInARow;
    }
    p.lastRound = selected;
    Object.assign(p.lights, ...selected.map((a) => ({ [a]: true })));
    if (
      Object.values(p.lights).filter((i) => i).length ===
      utils.enumArray(Action).length
    ) {
      Object.assign(
        p.lights,
        ...utils.enumArray(Action).map((a) => ({ [a]: false }))
      );
      p.chips++;
    }
  }
}

export default Actions;
