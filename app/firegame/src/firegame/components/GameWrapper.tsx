import React from "react";

import store from "../../shared/store";

import writer from "../writer/writer";

import Catann from "../../routes/catann/app/Catann";
import EclipseCalc from "../../routes/eclipse_calc/app/EclipseCalc";
import { VERSION } from "../../shared/shared";
import { getFiregameUserId } from "../writer/utils";
import LoadingPage from "./LoadingPage";
import LoginPage from "./LoginPage";

class GameWrapper extends React.Component<{
  component: typeof React.Component;
  gameName: string;
  roomId: number;
}> {
  isCatann() {
    return this.props.component.name === Catann.name;
  }
  skipsLogin() {
    return (
      this.props.component.name === EclipseCalc.name ||
      this.props.component.name === Catann.name ||
      this.props.component.name === "FireTimer"
    );
  }

  hasAutoUsername() {
    const username = store.lobby?.[store.me.userId]?.trim();
    if (!username) return false;
    return username === this.props.roomId.toString();
  }

  componentDidMount() {
    document.title = this.props.gameName.toLocaleUpperCase();
    // TODO remove
    if (this.isCatann()) {
      const userId = getFiregameUserId();
      (store as any).me = {
        roomId: this.props.roomId,
        gameName: this.props.gameName,
        VERSION,
        userId,
      };
      if (!store.lobby) {
        // @ts-ignore: initialize mock lobby state for catann
        store.lobby = { [userId]: userId };
      }
      if (!store.gameW) {
        // @ts-ignore: initialize mock game wrapper for catann
        store.gameW = {
          info: {
            id: 0,
            timestamp: Date.now(),
            host: userId,
            message: "local catann session",
            playerId: userId,
            playerName: userId,
          },
          game: null,
        };
        this.forceUpdate();
      }
    } else {
      writer.init(
        this.props.roomId,
        this.props.gameName,
        this.forceUpdate.bind(this),
      );
    }
  }

  render() {
    if (!this.isCatann()) {
      if (!store.lobby) {
        return <LoadingPage />;
      }
      if (!store.lobby[store.me.userId] && !store.isSpectator) {
        if (this.skipsLogin()) {
          setTimeout(() => writer.setUsername(store.me.roomId.toString()));
          return null;
        }
        return <LoginPage />;
      }
      if (!this.skipsLogin() && this.hasAutoUsername() && !store.isSpectator) {
        return <LoginPage />;
      }
      if (!store.gameW) {
        return null;
      }
    }
    return <this.props.component />;
  }
}

export default GameWrapper;
