import { expect } from "@playwright/test";

import { GAME_ACTION } from "../app/gameLogic/CatannFilesEnums";
import { ControllerType } from "./Controller";

export default async function autoChoreo(
  c: ControllerType,
  reconnectClientDataSequence: number = -1,
) {
  await c.verifyTestMessages();
  const msg = c._peek();
  if (!msg) return; // fastForward
  expect(msg.trigger).toBe("clientData");
  if (msg.data.sequence === reconnectClientDataSequence) return;
  if (msg.data.action === GAME_ACTION.PassedTurn) {
    await c.passTurn();
  } else if (msg.data.action === GAME_ACTION.ClickedDice) {
    await c.rollNextDice();
  } else {
    return;
  }
  console.log("autoChoreo", msg.data.sequence, msg.data.action);
  await autoChoreo(c, reconnectClientDataSequence);
}
