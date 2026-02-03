import { expect } from "@playwright/test";

import { GAME_ACTION } from "../app/gameLogic/CatannFilesEnums";
import { ControllerType } from "./Controller";

export default async function autoChoreo(
  c: ControllerType,
  stopClientDataSequence: number = -1,
) {
  await c.verifyTestMessages();
  const msg = c._peek();
  if (!msg) return; // fastForward
  expect(msg.trigger).toBe("clientData");
  console.log("autoChoreo", msg.data.sequence, GAME_ACTION[msg.data.action]);
  if (msg.data.sequence === stopClientDataSequence) return;
  if (msg.data.action === GAME_ACTION.PassedTurn) {
    await c.passTurn();
  } else if (msg.data.action === GAME_ACTION.ClickedDice) {
    await c.rollNextDice();
  } else if (msg.data.action === GAME_ACTION.WantToBuildRoad) {
    await c.wantToBuildRoad();
  } else if (msg.data.action === GAME_ACTION.WantToBuildSettlement) {
    await c.wantToBuildSettlement();
  } else if (msg.data.action === GAME_ACTION.BuyDevelopmentCard) {
    await c.buyDevelopmentCard();
  } else {
    return;
  }
  await autoChoreo(c, stopClientDataSequence);
}
