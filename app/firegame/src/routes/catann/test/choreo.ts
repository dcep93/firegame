import autoChoreo from "./autoChoreo";
import { type ControllerType } from "./Controller";

export const startingSettlementChoreo = async (c: ControllerType) => {
  await c.playStartingSettlement({ col: 2, row: 5 });
  await c.playStartingRoad({ col: 2, row: 5 }, { col: 2, row: 6 });
  await c.playStartingSettlement({ col: 8, row: 5 });
  await c.playStartingRoad({ col: 8, row: 5 }, { col: 8, row: 6 });
  await c.rollNextDice();
  await c.verifyTestMessages();
};

export const singlePlayerChoreo = async (c: ControllerType) => {
  await c.playStartingSettlement({ col: 3, row: 4 });
  await c.playStartingRoad({ col: 3, row: 4 }, { col: 4, row: 5 });
  await c.playStartingSettlement({ col: 6, row: 5 });
  await c.playStartingRoad({ col: 6, row: 5 }, { col: 5, row: 4 });
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
  //
  await c.passTurn();
  await c.delay(1000);
  await c.verifyTestMessages();
  //
  await c.rollNextDice();
  await c.verifyTestMessages();
  //
  await c.wantToBuildRoad();
  await c.verifyTestMessages();
  await c.delay(1000);
  await c.verifyTestMessages();
  await c.buildRoad({ col: 4, row: 5 }, { col: 4, row: 6 });
  await c.verifyTestMessages();
  //
  await c.passTurn();
  await c.verifyTestMessages();
  await c.delay(1000);
  await c.verifyTestMessages();
  //
  await c.rollNextDice();
  await c.verifyTestMessages();
  //
  await c.passTurn();
  await c.verifyTestMessages();
  //
  await c.rollNextDice();
  await c.verifyTestMessages();
  //
  await c.passTurn();
  await c.verifyTestMessages();
  //
  await c.rollNextDice();
  await c.verifyTestMessages();
  //
  await c.passTurn();
  await c.verifyTestMessages();
  //
  for (let i = 0; i < 5; i += 1) {
    await c.rollNextDice();
    await c.verifyTestMessages();
    //
    await c.passTurn();
    await c.verifyTestMessages();
  }
  //
  await c.rollNextDice();
  await c.verifyTestMessages();
  //
  await c.passTurn();
  await c.verifyTestMessages();
  //
  await c.handleReconnect();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();
  await c.buyDevelopmentCard();
  await c.verifyTestMessages();
  await c.delay(1000);
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();
  await c.wantToBuildRoad();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.wantToBuildRoad();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();
  await c.wantToBuildRoad();
  await c.verifyTestMessages();
  await c.buildRoad({ col: 5, row: 3 }, { col: 5, row: 4 });
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();
  await c.passTurn();
  await c.verifyTestMessages();
  await c.rollNextDice();
  await c.verifyTestMessages();

  await c.fastForward();
  await c.wantToBuildSettlement();
  await c.buildSettlement({ col: 5, row: 3 });
  await autoChoreo(c);
};
