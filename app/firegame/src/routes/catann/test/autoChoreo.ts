import { expect } from "@playwright/test";

import { GAME_ACTION } from "../app/gameLogic/CatannFilesEnums";
import { ControllerType } from "./Controller";

export default async function autoChoreo(
  c: ControllerType,
  stopClientDataSequence: number = -1,
) {
  for (let i = 0; true; i++) {
    await c.verifyTestMessages(i > 0);
    const msg = c._peek();
    if (!msg) return; // fastForward
    try {
      expect(msg.trigger).not.toBe("serverData");
    } catch (e) {
      console.log(JSON.stringify(msg, null, 2));
      throw e;
    }
    console.log(
      "autoChoreo",
      msg.data.sequence,
      i,
      GAME_ACTION[msg.data.action],
    );
    if (msg.data.sequence === stopClientDataSequence) return;
    if (msg.data.action === GAME_ACTION.PassedTurn) {
      await c.passTurn();
    } else if (msg.data.action === GAME_ACTION.ClickedDice) {
      await c.rollNextDice();
    } else if (msg.data.action === GAME_ACTION.WantToBuildRoad) {
      await c.wantToBuildRoad();
    } else if (msg.data.action === GAME_ACTION.WantToBuildSettlement) {
      await c.wantToBuildSettlement();
    } else if (msg.data.action === GAME_ACTION.WantToBuildCity) {
      await c.wantToBuildCity();
    } else if (msg.data.action === GAME_ACTION.BuyDevelopmentCard) {
      await c.buyDevelopmentCard();
    } else if (msg.data.action === GAME_ACTION.SelectedCardsState) {
      await c.selectNextDiscardCard();
    } else {
      return;
    }
  }
}
