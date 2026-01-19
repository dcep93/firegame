import React from "react";

import store from "../../shared/store";

import writer from "../writer/writer";

import Catann from "../../routes/catann/app/Catann";
import EclipseCalc from "../../routes/eclipse_calc/app/EclipseCalc";
import LoadingPage from "./LoadingPage";
import LoginPage from "./LoginPage";

class GameWrapper extends React.Component<{
  component: typeof React.Component;
  gameName: string;
  roomId: number;
}> {
  componentDidMount() {
    document.title = this.props.gameName.toLocaleUpperCase();
    writer.init(
      this.props.roomId,
      this.props.gameName,
      this.forceUpdate.bind(this),
    );
  }

  render() {
    if (!store.lobby) {
      return <LoadingPage />;
    }
    if (!store.lobby[store.me.userId]) {
      if (this.props.component.name === EclipseCalc.name) {
        setTimeout(() => writer.setUsername(store.me.roomId.toString()));
        return null;
      }
      if (this.props.component.name === Catann.name) {
        setTimeout(() => writer.setUsername(store.me.roomId.toString()));
        return null;
      }
      return <LoginPage />;
    }
    if (!store.gameW) {
      return null;
    }
    return <this.props.component />;
  }
}

export default GameWrapper;
