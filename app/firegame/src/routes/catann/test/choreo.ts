import autoChoreo from "./autoChoreo";
import { type ControllerType } from "./Controller";

export const startingSettlementChoreo = async (c: ControllerType) => {
  await c.buildSettlement({ col: 2, row: 5 });
  await c.buildRoad({ col: 2, row: 5 }, { col: 2, row: 6 });
  await c.buildSettlement({ col: 8, row: 5 });
  await c.buildRoad({ col: 8, row: 5 }, { col: 8, row: 6 });
  await c.rollNextDice();
  await c.verifyTestMessages();
};

export const singlePlayerChoreo = async (c: ControllerType) => {
  await c.buildSettlement({ col: 3, row: 4 });
  await c.buildRoad({ col: 3, row: 4 }, { col: 4, row: 5 });
  await c.buildSettlement({ col: 6, row: 5 });
  await c.buildRoad({ col: 6, row: 5 }, { col: 5, row: 4 });

  await autoChoreo(c);
  await c.buildRoad({ col: 4, row: 5 }, { col: 4, row: 6 }, true);
  await autoChoreo(c, 85);
  await c.handleReconnect();
  await c.rollNextDice();
  await autoChoreo(c);
  // await c.buildRoad({ col: 5, row: 3 }, { col: 5, row: 4 });
  // await autoChoreo(c);
  return;

  await c.fastForward();
  await c.buildSettlement({ col: 5, row: 3 });
  await autoChoreo(c);
};
