import React from "react";
import Firebase from "../../../firegame/firebase";
import css from "./index.module.css";

type UserType = { [slotIndex: number]: number };
type SlotType = { x: number; y: number }[];
type StateType = {
  imgs: string[];
  slots: SlotType[];
  users: { [userId: string]: UserType };
};

class Lineup extends React.Component<{ roomId: number }, StateType> {
  componentDidMount() {
    Firebase.init();
    Firebase.connect(this.getRoom(), this.setState.bind(this));
  }

  getRoom() {
    return `lineup/${this.props.roomId}`;
  }

  render() {
    // todo define imgs
    // if (!this.state?.imgs) {
    //   Firebase.set(`${this.getRoom()}/imgs`, [
    //     "https://assets-global.website-files.com/5e927ba01e4ad56ae5465eb8/6101b1b092b6d1fe1809539b_LP21-GRID-V13_01-Thurs-p-2000.png",
    //     "https://assets-global.website-files.com/5e927ba01e4ad56ae5465eb8/6101bb613f9800a7381b6064_LP21-GRID-V13_02-Fri%20(1)-p-1080.png",
    //     "https://assets-global.website-files.com/5e927ba01e4ad56ae5465eb8/61001c48397ee501f809d606_LP21-GRID-V12_03-Sat-p-2000.png",
    //     "https://assets-global.website-files.com/5e927ba01e4ad56ae5465eb8/61001c57066f2e518d546704_LP21-GRID-V12_04-Sun-p-2000.png",
    //   ]);
    //   return null;
    // }
    if (!this.state) return null;
    return (
      <div>
        <div className={css.imgs}>
          {(this.state.imgs || []).map((img, i) => (
            <img
              className={css.img}
              alt={"missing"}
              key={i}
              src={img}
              // todo define slot corners
              // onClick={this.defineSlotCorner.bind(this)}
            />
          ))}
        </div>
        {(this.state.slots || []).map((slot, i) => (
          <div
            className={css.slotWrapper}
            key={i}
            onClick={() => this.click(i)}
            style={{
              left: slot[0].x,
              top: slot[0].y,
              width: slot[1].x - slot[0].x,
              height: slot[1].y - slot[0].y,
            }}
          >
            <div
              className={[css.slot, this.getMe()[i] && css.selectedSlot].join(
                " "
              )}
            ></div>
            <div className={css.slotCount}>
              (
              {Object.values(this.state.users)
                .map((u) => u[i] || 0)
                .reduce((a, b) => a + b, 0)}
              )
            </div>
          </div>
        ))}
      </div>
    );
  }

  definedSlots: SlotType = [];
  defineSlotCorner(e: { pageX: number; pageY: number }): void {
    this.definedSlots.push({ x: e.pageX, y: e.pageY });
    if (this.definedSlots.length === 2) {
      const slots = (this.state.slots || []).concat([
        this.definedSlots.splice(0),
      ]);
      Firebase.set(`${this.getRoom()}/slots`, slots);
    }
  }

  click(index: number) {
    const me = this.getMe();
    me[index] = ((me[index] || 0) + 1) % 2;
    Firebase.set(`${this.getRoom()}/users/${this.getUserId()}`, me);
  }

  getUserId(): string {
    // todo login/logout
    return "dantest";
  }

  getMe(): UserType {
    return (this.state.users || {})[this.getUserId()] || {};
  }
}

export default Lineup;
