import { type ControllerType } from "./Controller";

export const startingSettlementChoreo = async (c: ControllerType) => {
  await c.playSettlement({ col: 2, row: 5 });
  await c.playRoad({ col: 2, row: 5 }, { col: 2, row: 6 });
  await c.playSettlement({ col: 8, row: 5 });
  await c.playRoad({ col: 8, row: 5 }, { col: 8, row: 6 });
  await c.rollNextDice();

  await c.verifyTestMessages();
};

export const singlePlayerChoreo = async (c: ControllerType) => {
  await c.playSettlement({ col: 3, row: 4 });
  await c.playRoad({ col: 3, row: 4 }, { col: 4, row: 5 });
  await c.playSettlement({ col: 6, row: 5 });
  await c.playRoad({ col: 6, row: 5 }, { col: 5, row: 4 });
  await c.verifyTestMessages();
  //
  await c.rollNextDice();
  await c.passTurn();
  await c.verifyTestMessages();
  //
  await c.rollNextDice();
  await c.verifyTestMessages();
  //
  await c.passTurn();
  await c.delay(1000);
  await c.passTurn();
  await c.verifyTestMessages();
  //
  await c.rollNextDice();
  await c.verifyTestMessages();
};
