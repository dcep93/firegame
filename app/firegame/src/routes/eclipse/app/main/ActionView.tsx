import { Action } from "../utils/gameTypes";
import { store } from "../utils/utils";

export default function ActionView() {
  return <div>{Action[store.gameW.game.action.action]}</div>;
}
