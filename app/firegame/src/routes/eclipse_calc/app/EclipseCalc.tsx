import React from "react";
import Main from "./main/Main";
import TestCases from "./main/TestCases";
import Sidebar from "./sidebar/Sidebar";
import { store } from "./utils/utils";

export default class EclipseCalc extends React.Component {
  render() {
    if (!store.gameW.game) {
      setTimeout(() => new Sidebar({}).startNewGame());
      return;
    }
    return <Main />;
  }
}

console.log({ testCaseFailures: TestCases() });
