import { expect } from "@playwright/test";

import { GAME_ACTION } from "../app/gameLogic/CatannFilesEnums";
import { ControllerType } from "./Controller";

export default async function autoChoreo(
  c: ControllerType,
  stopClientDataSequence: number = -1,
) {
  let nextReconnect = await c.getNextReconnect();
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
      msg.data.payload,
      nextReconnect,
    );
    if (msg.data.sequence === stopClientDataSequence) return;

    if (msg.data.sequence === nextReconnect) {
      console.log("handleReconnect");
      c.handleReconnect();
      nextReconnect = await c.getNextReconnect();
    }

    const handlers: Partial<Record<GAME_ACTION, () => Promise<void>>> = {
      [GAME_ACTION.PassedTurn]: c.passTurn,
      [GAME_ACTION.ClickedDice]: c.rollNextDice,
      [GAME_ACTION.WantToBuildRoad]: c.wantToBuildRoad,
      [GAME_ACTION.WantToBuildSettlement]: c.wantToBuildSettlement,
      [GAME_ACTION.WantToBuildCity]: c.wantToBuildCity,
      [GAME_ACTION.BuyDevelopmentCard]: c.buyDevelopmentCard,
      [GAME_ACTION.SelectedCardsState]: c.selectNextDiscardCard,
      [GAME_ACTION.PlayDevelopmentCardFromHand]: c.playDevelopmentCardFromHand,
      [GAME_ACTION.PreCreateTrade]: c.wantToTrade,
      [GAME_ACTION.CreateTrade]: c.makeNextTrade,
      [GAME_ACTION.ConfirmBuildRoad]: c.buildNextRoad,
      [GAME_ACTION.SelectedTile]: c.playNextRobber,
      [GAME_ACTION.SelectedCards]: c.confirmSelectedCards,
      [GAME_ACTION.ConfirmBuildSettlement]: c.buildNextSettlement,
      [GAME_ACTION.ConfirmBuildCity]: c.buildNextCity,
    };

    const handler = handlers[msg.data.action as GAME_ACTION];
    if (handler) {
      await handler();
    } else {
      return;
    }
  }
}
