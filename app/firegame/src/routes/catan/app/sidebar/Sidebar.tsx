import React, { RefObject } from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import { Params } from "../utils/NewGame";
import {
  baseGameScript,
  citiesAndKnightsScript,
} from "../utils/gameScripts";
import {
  createDomDemoDriver,
  runGameScript,
  waitForElement,
} from "../utils/demoRunner";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  citiesAndKnightsRef: RefObject<HTMLInputElement> = React.createRef();
  state = { isDemoRunning: false };
  private isDemo = false;
  name = "Catan";
  rules = "https://www.catan.com/sites/default/files/2021-06/catan_base_rules_2020_200707.pdf";
  utils = utils;

  renderNewGameExtras() {
    return (
      <div>
        <label>
          Cities &amp; Knights{" "}
          <input
            type={"checkbox"}
            ref={this.citiesAndKnightsRef}
            data-demo="cities-and-knights"
          />
        </label>
        <div>
          <button
            onClick={() => this.startDemo()}
            disabled={this.state.isDemoRunning}
            data-demo="run-demo"
          >
            {this.state.isDemoRunning ? "Running demo..." : "Run demo"}
          </button>
        </div>
      </div>
    );
  }

  getParams(): Params {
    return {
      lobby: store.lobby,
      citiesAndKnights: this.citiesAndKnightsRef.current!.checked,
      isDemo: this.isDemo,
    };
  }

  startNewGame() {
    this.isDemo = false;
    super.startNewGame();
  }

  maybeSyncParams() {
    super.maybeSyncParams();
    if (store.gameW.info.isNewGame) {
      this.citiesAndKnightsRef.current!.checked =
        store.gameW.game.params.citiesAndKnights;
    }
  }

  async startDemo() {
    if (this.state.isDemoRunning) return;
    const playerCount = Object.keys(store.lobby).length;
    if (playerCount !== 2) {
      alert("Demo requires exactly 2 players in the lobby.");
      return;
    }
    this.isDemo = true;
    this.setState({ isDemoRunning: true });
    try {
      const citiesAndKnights = this.citiesAndKnightsRef.current!.checked;
      const params: Params = {
        lobby: store.lobby,
        citiesAndKnights,
        isDemo: true,
      };
      const script = citiesAndKnights
        ? citiesAndKnightsScript
        : baseGameScript;
      const game = await this.utils.newGame(params);
      if (game) {
        store.update("started a demo", game);
      }
      await waitForElement('button[data-demo="vertex"]');
      const driver = createDomDemoDriver(() => store.gameW.game);
      await runGameScript(script, driver, { delayMs: 2000 });
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      this.isDemo = false;
      this.setState({ isDemoRunning: false });
    }
  }
}

export default Sidebar;
