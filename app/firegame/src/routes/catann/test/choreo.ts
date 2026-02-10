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
  await autoChoreo(c);

  await c.fastForward(112);
  await c.buildRoad({ col: 5, row: 3 }, { col: 5, row: 4 }, true);
  await autoChoreo(c);

  await c.fastForward(128);
  await c.buildSettlement({ col: 5, row: 3 }, true);
  await autoChoreo(c);

  await c.fastForward(152);
  await c.buildCity({ col: 3, row: 4 }, true);
  await autoChoreo(c, 179);

  await c.fastForward(179);
  await c.wantToTrade();
  await c.makeTrade({
    creator: 1,
    isBankTrade: true,
    offeredResources: [4, 4, 4, 4],
    wantedResources: [5],
  });
  await c.fixWeirdTrade();
  await c.verifyTestMessages();
  await autoChoreo(c, 188);

  await c.fastForward(188);
  await c.handleReconnect();
  await autoChoreo(c, 212);

  await c.fastForward(212);
  await autoChoreo(c);
  await c.confirmSelectedCards();
  await autoChoreo(c);
  await c.buildSettlement({ col: 4, row: 6 }, true);
  await autoChoreo(c, 244);

  await c.fastForward(244);
  await autoChoreo(c);
  await c.playDevelopmentCardFromHand();
  await autoChoreo(c);
  await c.playNextRobber();
  await autoChoreo(c);
  await c.playDevelopmentCardFromHand();
  await autoChoreo(c);
  await c.playNextRobber();
  await autoChoreo(c);
  await c.playNextRobber();
  await autoChoreo(c, 263);

  await c.fastForward(263);
  await autoChoreo(c);
  await c.playNextRobber();
  await autoChoreo(c, 283);

  // {
  //   "trigger": "serverData",
  //   "data": {
  //     "id": "130",
  //     "data": {
  //       "type": 77,
  //       "payload": {
  //         "type": 49,
  //         "data": {
  //           "creator": 1,
  //           "isBankTrade": true,
  //           "counterOfferInResponseToTradeId": null,
  //           "offeredResources": [4, 4, 4, 4],
  //           "wantedResources": [1]
  //         }
  //       },
  //       "sequence": 174
  //     }
  //   }
  // },

  await c.fastForward(283);
  await autoChoreo(c, 285);
  await c.handleReconnect();
  await autoChoreo(c, 290);

  await c.fastForward(290);
  await c.playDevelopmentCardFromHand();
  await c.verifyTestMessages();
  await c.playFreeRoad();
  await c.verifyTestMessages();
  await c.playFreeRoad();
  await c.verifyTestMessages();

  await c.fastForward(296);
  await c.wantToTrade();
  await c.verifyTestMessages();
  await c.makeTrade({
    creator: 1,
    isBankTrade: true,
    offeredResources: [4, 4, 4, 4],
    wantedResources: [1],
  });
  await c.fixWeirdTrade();
  await c.verifyTestMessages();
  await c.wantToBuildRoad();
  await c.verifyTestMessages();
  await c.buildRoad({ col: 4, row: 6 }, { col: 5, row: 7 }, true);
  await c.verifyTestMessages();
  await c.passTurn();
  await c.skipIllegalPass();
  await c.verifyTestMessages();

  await c.fastForward(303);
  await autoChoreo(c);
  await c.playDevelopmentCardFromHand();
  await c.verifyTestMessages();
  await c.playNextRobber();
  await c.verifyTestMessages();
};
