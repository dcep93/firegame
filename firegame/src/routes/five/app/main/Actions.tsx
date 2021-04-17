import React, { RefObject } from "react";
import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/NewGame";
import utils from "../utils/utils";

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
    const b = this.blockRef.current!.value;
    alert(utils.enumNameToValue(b, Action));
  }
}

export default Actions;
