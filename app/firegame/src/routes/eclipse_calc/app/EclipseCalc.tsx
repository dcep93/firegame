import React from "react";
import Main from "./main/Main";
import TestCases from "./main/TestCases";

export default class EclipseCalc extends React.Component {
  render() {
    return <Main />;
  }
}

console.log({ testCaseFailures: TestCases() });
