import { expect } from "@playwright/test";

import { GameAction } from "../app/gameLogic/CatannFilesEnums";
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
    console.log("autoChoreo", {
      [GameAction[msg.data.action]]: msg.data,
      i,
      nextReconnect,
    });
    if (msg.data.sequence === stopClientDataSequence) return;

    if (msg.data.sequence === nextReconnect) {
      console.log("handleReconnect");
      c.handleReconnect();
      nextReconnect = await c.getNextReconnect();
    }

    const handlers: Partial<Record<GameAction, () => Promise<void>>> = {
      [GameAction.PassedTurn]: c.passTurn,
      [GameAction.ClickedDice]: c.rollNextDice,
      [GameAction.WantToBuildRoad]: c.wantToBuildRoad,
      [GameAction.WantToBuildSettlement]: c.wantToBuildSettlement,
      [GameAction.WantToBuildCity]: c.wantToBuildCity,
      [GameAction.BuyDevelopmentCard]: c.buyDevelopmentCard,
      [GameAction.SelectedCardsState]: c.selectNextDiscardCard,
      [GameAction.PlayDevelopmentCardFromHand]: c.playDevelopmentCardFromHand,
      [GameAction.PreCreateTrade]: c.wantToTrade,
      [GameAction.CreateTrade]: c.makeNextTrade,
      [GameAction.ConfirmBuildRoad]: c.buildNextRoad,
      [GameAction.SelectedTile]: c.playNextRobber,
      [GameAction.SelectedCards]: c.confirmSelectedCards,
      [GameAction.ConfirmBuildSettlement]: c.buildNextSettlement,
      [GameAction.ConfirmBuildCity]: c.buildNextCity,
    };

    const handler = handlers[msg.data.action as GameAction];
    if (handler) {
      await handler();
    } else {
      return;
    }
  }
}
