import { createRef } from "react";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import NewGame, { Params } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Sidebar extends SharedSidebar {
  ref = createRef<HTMLTextAreaElement>();
  name = "Spyfall";
  NewGame = NewGame;
  utils = utils;
  rules = "";

  getParams(): Params {
    return { lobby: store.lobby, p: this.ref.current!.value };
  }

  renderInfo() {
    return <textarea ref={this.ref} />;
  }

  newGame(params: Params) {
    return NewGame(params);
  }
}

export default Sidebar;
