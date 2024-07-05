import React from "react";
import EclipseMap from "./EclipseMap";
import Players from "./Players";
import ResearchView from "./ResearchView";

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <Players />
        <EclipseMap />
        <ResearchView />
      </div>
    );
  }
}
