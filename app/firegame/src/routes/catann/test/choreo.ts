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

  await autoChoreo(c);
  await c.wantToBuildRoad();
  await c.buildRoad({ col: 4, row: 5 }, { col: 4, row: 6 });
  await autoChoreo(c, 85);
  await c.handleReconnect();
  await c.rollNextDice();
  await autoChoreo(c);
  await c.wantToBuildRoad();
  await c.buildRoad({ col: 5, row: 3 }, { col: 5, row: 4 });
  await autoChoreo(c);
  return;

  await c.fastForward();
  await c.wantToBuildSettlement();
  await c.buildSettlement({ col: 5, row: 3 });
  await autoChoreo(c);
};
