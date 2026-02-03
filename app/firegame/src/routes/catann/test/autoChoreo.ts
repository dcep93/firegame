import { expect } from "@playwright/test";

import { GAME_ACTION } from "../app/gameLogic/CatannFilesEnums";
import { ControllerType } from "./Controller";

export default async function autoChoreo(c: ControllerType) {
  await c.verifyTestMessages();
  const msg = c._peek();
  if (!msg) return;
  expect(msg.trigger).toBe("clientData");
  if (msg.data.action === GAME_ACTION.PassedTurn) {
    console.log("autoChoreo.passTurn");
    await c.passTurn();
  } else if (msg.data.action === GAME_ACTION.ClickedDice) {
    console.log("autoChore.rollNextDice");
    await c.rollNextDice();
  } else {
    return;
  }
  await autoChoreo(c);
}
