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

  await c.fastForward(24);
  await autoChoreo(c);
  await c.buildRoad({ col: 4, row: 5 }, { col: 4, row: 6 }, true);
  await autoChoreo(c, 85);
  await c.handleReconnect();
  await c.rollNextDice();
  await autoChoreo(c, 105);

  await c.fastForward(105);
  await c.skipIllegalPass();
  await c.wantToBuildRoad();
  await autoChoreo(c, 111);

  await c.fastForward(111);
  await autoChoreo(c, 128);

  await c.fastForward(128);
  await autoChoreo(c, 152);

  await c.fastForward(152);
  await autoChoreo(c, 179);

  await c.fastForward(179);
  await autoChoreo(c, 188);

  await c.fastForward(188);
  await c.handleReconnect();
  await autoChoreo(c, 212);

  await c.fastForward(212);
  await autoChoreo(c, 247);

  await c.fastForward(247);
  await autoChoreo(c, 263);

  await c.fastForward(263);
  await autoChoreo(c, 285);

  await c.fastForward(285);
  await c.handleReconnect();
  await autoChoreo(c, 290);

  await c.fastForward(290);
  await autoChoreo(c, 296);

  await c.fastForward(296);
  await autoChoreo(c, 303);

  await c.fastForward(303);
  await autoChoreo(c);
};
