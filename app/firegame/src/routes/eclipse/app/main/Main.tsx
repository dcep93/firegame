import React from "react";
import { Action } from "../utils/gameTypes";
import { store } from "../utils/utils";
import EclipseMap from "./EclipseMap";
import Players from "./Players";
import { SelectFaction } from "./SelectFaction";

export default class Main extends React.Component {
  render() {
    const game = store.gameW.game;
    if (game.action === Action.selectFaction) return <SelectFaction />;
    return (
      <div>
        <Players />
        <EclipseMap />
      </div>
    );
  }
}
