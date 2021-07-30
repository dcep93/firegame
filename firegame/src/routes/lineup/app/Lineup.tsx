import React, { ErrorInfo } from "react";
import Firebase from "../../../firegame/firebase";
import css from "./index.module.css";

const VERSION = "lineup/0.0.1";

type UserType = { [slotIndex: number]: number };
type SlotType = { x: number; y: number }[];
type StateType = {
  imgs: string[];
  slots: SlotType[];
  users: { [userId: string]: UserType };
};
type PropsType = { roomId: number };

var alerted = false;

class Lineup extends React.Component<PropsType, StateType> {
  componentDidMount() {
    Firebase.init();
    Firebase.connect(this.getRoom(), this.setState.bind(this));
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (alerted) return;
    alerted = true;
    alert(JSON.stringify({ error, info }, null, 2));
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
    if (!this.getUserId()) this.login();
    if (!this.state) return "loading";
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
        <div>
          {(this.state.slots || []).map((slot, i) => (
            <div key={i} onClick={() => this.click(i)}>
              <Slot
                mySelected={this.getMe()[i] || 0}
                slot={slot}
                selectedDict={Object.fromEntries(
                  Object.entries(this.state.users || {})
                    .map(([userId, userSlots]) => [userId, userSlots[i]])
                    .filter(([userId, selected]) => selected > 0)
                )}
              />
            </div>
          ))}
        </div>
        <div className={css.logout} onClick={this.logout}>
          logout
        </div>
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
    me[index] = ((me[index] || 0) + 1) % 4;
    Firebase.set(`${this.getRoom()}/users/${this.getUserId()}`, me);
  }

  login() {
    const userId = prompt("enter your name");
    localStorage.setItem(VERSION, JSON.stringify({ userId }));
  }

  logout() {
    localStorage.setItem(VERSION, "{}");
    window.location.reload();
  }

  getUserId(): string {
    return JSON.parse(localStorage.getItem(VERSION) || "{}").userId;
  }

  getMe(): UserType {
    return (this.state.users || {})[this.getUserId()] || {};
  }
}

class Slot extends React.Component<{
  selectedDict: { [userId: string]: number };
  slot: SlotType;
  mySelected: number;
}> {
  render() {
    return (
      <div
        className={css.slotWrapper}
        style={{
          left: this.props.slot[0].x,
          top: this.props.slot[0].y,
          width: this.props.slot[1].x - this.props.slot[0].x,
          height: this.props.slot[1].y - this.props.slot[0].y,
        }}
      >
        <div
          className={[css.slot, this.getSelectedClass()].join(" ")}
          style={{ opacity: this.getOpacity() }}
        ></div>

        <div
          className={css.slotCount}
          onClick={(e) => {
            alert(
              Object.entries(this.props.selectedDict)
                .map(([userId, selected]) => `${userId} ${selected}`)
                .join("\n") || "{none}"
            );
            e.stopPropagation();
          }}
        >
          {this.props.mySelected}/{this.getSelected()}
        </div>
      </div>
    );
  }

  getOpacity(): number {
    return 0.4;
  }

  getSelected(): number {
    return Object.values(this.props.selectedDict).reduce((a, b) => a + b, 0);
  }

  getSelectedClass(): string {
    const selected = this.getSelected();
    if (this.props.mySelected > 0) {
      if (selected > this.props.mySelected) {
        return css.multipleSelectedSlot;
      } else {
        return css.selectedSlot;
      }
    } else {
      if (selected > 0) {
        return css.otherSelectedSlot;
      } else {
        return "";
      }
    }
  }
}

export default Lineup;
