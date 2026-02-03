import { expect } from "@playwright/test";

import { GAME_ACTION } from "../app/gameLogic/CatannFilesEnums";
import { ControllerType } from "./Controller";

export default async function autoChoreo(c: ControllerType) {
  const msg = c._peek();
  expect(msg.trigger).toBe("clientData");
  if (msg.data.action === GAME_ACTION.PassedTurn) {
    await c.passTurn();
  } else {
    return;
  }
  await c.verifyTestMessages();
  await autoChoreo(c);
}
