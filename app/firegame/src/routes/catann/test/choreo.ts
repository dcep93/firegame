import { ControllerType } from "./playwright_test.spec";

export const startingSettlementChoreo = async (c: ControllerType) => {
  await c.playSettlement({ col: 2, row: 5 });
  await c.playRoad({ col: 2, row: 5 }, { col: 2, row: 6 });
  await c.playSettlement({ col: 8, row: 5 });
  await c.playRoad({ col: 8, row: 5 }, { col: 8, row: 6 });

  const diceState = expectedMessages.find(
    (msg) => msg.data.data?.payload.diff?.diceState,
  )!.data.data.payload.diff.diceState;

  await rollDice(canvas, [diceState.dice1, diceState.dice2]);

  await verifyTestMessages(iframe, expectedMessages);
};

export const singlePlayerChoreo = async (c: ControllerType) => {
  await playSettlement(canvas, { col: 3, row: 4 });
  await playRoad(canvas, { col: 3, row: 4 }, { col: 4, row: 5 });
  await playSettlement(canvas, { col: 6, row: 5 });
  await playRoad(canvas, { col: 6, row: 5 }, { col: 5, row: 4 });
  await verifyTestMessages(iframe, expectedMessages);
};
