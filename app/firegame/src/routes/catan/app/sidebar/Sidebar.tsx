import React, { RefObject } from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  citiesAndKnightsRef: RefObject<HTMLInputElement> = React.createRef();
  name = "Catan";
  rules = "https://www.catan.com/sites/default/files/2021-06/catan_base_rules_2020_200707.pdf";
  utils = utils;

  renderNewGameExtras() {
    return (
      <div>
        <label>
          Cities &amp; Knights{" "}
          <input type={"checkbox"} ref={this.citiesAndKnightsRef} />
        </label>
      </div>
    );
  }

  getParams(): Params {
    return {
      lobby: store.lobby,
      citiesAndKnights: this.citiesAndKnightsRef.current!.checked,
    };
  }

  maybeSyncParams() {
    super.maybeSyncParams();
    if (store.gameW.info.isNewGame) {
      this.citiesAndKnightsRef.current!.checked =
        store.gameW.game.params.citiesAndKnights;
    }
  }
}

export default Sidebar;
