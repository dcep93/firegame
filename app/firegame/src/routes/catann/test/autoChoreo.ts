import { expect } from "@playwright/test";

import { GameAction } from "../app/gameLogic/CatannFilesEnums";
import { ControllerType } from "./Controller";

// TODO make this the only default?
export const singleChoreo = (c: ControllerType) => {
  const action = c._peek().data.action as GameAction;
  console.log("singleChoreo", {
    [GameAction[action]]: c._peek().data,
  });
  return getHandlers(c)[action]!();
};

export default async function autoChoreo(
  c: ControllerType,
  stopClientDataSequence: number = -1,
) {
  let nextReconnect = await c.getNextReconnect();
  for (let i = 0; true; i++) {
    await c.verifyTestMessages(i > 0);
    const msg = c._peek();
    if (!msg) return -1; // fastForward
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
    if (msg.data.sequence === stopClientDataSequence) return i;

    if (msg.data.sequence === nextReconnect) {
      console.log("handleReconnect");
      c.handleReconnect();
      nextReconnect = await c.getNextReconnect();
    }

    const handler = getHandlers(c)[msg.data.action as GameAction];
    if (handler) {
      await handler();
    } else {
      return i;
    }
  }
}

const getHandlers: (
  c: ControllerType,
) => Partial<Record<GameAction, () => Promise<void>>> = (c) => ({
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
  [GameAction.UpdateTradeResponse]: c.updateTradeResponse,
  [GameAction.ConfirmBuildRoad]: c.buildNextRoad,
  [GameAction.SelectedTile]: c.playNextRobber,
  [GameAction.SelectedCards]: c.confirmSelectedCards,
  [GameAction.ConfirmBuildSettlement]: c.buildNextSettlement,
  [GameAction.ConfirmBuildCity]: c.buildNextCity,
  [GameAction.SelectedInitialPlacementIndex]: c.selectInitialPlacementIndex,
});
