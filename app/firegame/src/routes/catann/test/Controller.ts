import {
  ElementHandle,
  expect,
  FrameLocator,
  Locator,
  Page,
  test,
} from "@playwright/test";
import {
  CLIENT_TRADE_OFFER_TYPE,
  GAME_ACTION,
  GameLogMessageType,
} from "../app/gameLogic/CatannFilesEnums";
import { addGameLogEntry } from "../app/gameLogic/utils";
import { _delay, codex, spliceTestMessages } from "./playwright_test.spec";

const MAP_OFFSET = { x: 165, y: 11.5 };
const MAP_ZERO_ZERO = { x: 245 - MAP_OFFSET.x, y: 89 - MAP_OFFSET.y };
const MAP_DICE_COORDS = { x: 717 - MAP_OFFSET.x, y: 551 - MAP_OFFSET.y };
const MAP_PASS_COORDS = { x: 800 - MAP_OFFSET.x, y: 672 - MAP_OFFSET.y };
const MAP_HEX_SIDE_LENGTH = 59;
const MAP_CONFIRM_OFFSET = 53;

const loaded = Date.now();

export type ControllerType = ReturnType<typeof Controller>;
const Controller = (
  page: Page,
  iframe: FrameLocator,
  _expectedMessages: { trigger: string; data: any }[] | undefined,
) =>
  ((canvas) => {
    const verifyTestMessages = async (failOnEmpty: boolean = true) => {
      const expectedMessages = _expectedMessages!;
      const testMessages = await spliceTestMessages(iframe);
      try {
        if (failOnEmpty) expect(testMessages.length).not.toBe(0);
      } catch (e) {
        console.log(JSON.stringify(expectedMessages[0], null, 2));
        throw e;
      }
      const durationMs = Date.now() - loaded;
      console.log(
        "verifyTestMessages",
        (durationMs / 1000).toFixed(2),
        testMessages.length,
        expectedMessages.length,
      );
      testMessages.forEach((msg) => {
        const expectedMsg = expectedMessages.shift()!;
        if (expectedMsg?.trigger === "debug") {
          test.skip();
        }
        try {
          expect(expectedMsg).toBeDefined();
          expect(msg.trigger).toEqual(expectedMsg.trigger);
        } catch (e) {
          console.log(JSON.stringify({ msg, expectedMsg }, null, 2));
          throw e;
        }
        if (msg.trigger === "clientData") {
          if (expectedMsg.data.sequence) {
            msg.data.sequence = expectedMsg.data.sequence;
            codex[msg.trigger] = msg.data.sequence;
          }
        } else {
          msg.data.data.sequence = expectedMsg.data.data.sequence;
          codex[msg.trigger] = msg.data.data.sequence;
          const msgStartTime =
            msg.data.data.payload?.diff?.currentState?.startTime;
          const expectedStartTime =
            expectedMsg.data.data.payload?.diff?.currentState?.startTime;
          if (msgStartTime == null || expectedStartTime == null) {
            if (msg.data.data.payload?.diff?.currentState) {
              delete msg.data.data.payload.diff.currentState.startTime;
            }
            if (expectedMsg.data.data.payload?.diff?.currentState) {
              delete expectedMsg.data.data.payload.diff.currentState.startTime;
            }
          } else {
            msg.data.data.payload.diff.currentState.startTime =
              expectedStartTime;
          }
        }
        expect(msg).toEqual(expectedMsg);
        console.log(msg);
      });
    };
    return {
      _peek: () => _expectedMessages![0],
      verifyTestMessages,
      fastForward: async (clientDataSequence: number) => {
        await verifyTestMessages();
        const nextSequence = _expectedMessages!.find(
          (msg) => msg.data.sequence,
        );
        if (clientDataSequence === -1) {
          expect(nextSequence).toBe(null);
        } else {
          console.log({ clientDataSequence, nextSequence });
        }
      },
      clickStartButton: async () => {
        const startButton = getStartButton(iframe);
        await startButton.click({ force: true });
        await _delay(1000);
        page.on("pageerror", (msg) => console.log(msg));
      },
      delay: async (durationMs: number) => _delay(durationMs),
      buildSettlement: async (
        settlementCoords: {
          col: number;
          row: number;
        },
        skipConfirm: boolean = false,
      ) => {
        console.log("\t", "buildSettlement");
        const settlementOffset = getSettlementOffset(settlementCoords);
        await clickCanvas(canvas, settlementOffset);

        if (!skipConfirm) {
          const confirmSettlementOffset = getConfirmOffset(settlementOffset);
          await clickCanvas(canvas, confirmSettlementOffset);
        }
      },
      buildCity: async (
        settlementCoords: {
          col: number;
          row: number;
        },
        skipConfirm: boolean = false,
      ) => {
        console.log("\t", "buildCity");
        const settlementOffset = getSettlementOffset(settlementCoords);
        await clickCanvas(canvas, settlementOffset);

        if (!skipConfirm) {
          const confirmCityOffset = getConfirmOffset(settlementOffset);
          await clickCanvas(canvas, confirmCityOffset);
        }
      },
      buildRoad: async (
        settlementCoords: { col: number; row: number },
        destinationCoords: { col: number; row: number },
        skipConfirm: boolean = false,
      ) => {
        console.log("\t", "buildRoad");
        const settlementOffset = getSettlementOffset(settlementCoords);
        const destinationOffset = getSettlementOffset(destinationCoords);
        const roadOffset = {
          x: (settlementOffset.x + destinationOffset.x) / 2,
          y: (settlementOffset.y + destinationOffset.y) / 2,
        };
        await clickCanvas(canvas, roadOffset);

        if (!skipConfirm) {
          const confirmRoadOffset = getConfirmOffset(roadOffset);
          await clickCanvas(canvas, confirmRoadOffset);
        }
      },
      wantToBuildRoad: async () => {
        const roadButton = iframe.locator(
          'div[class*="roadButton-"] div[class*="container-"]',
        );
        await roadButton.first().click({ force: true });
        await _delay(100);
      },
      wantToBuildSettlement: async () => {
        const settlementButton = iframe.locator(
          'div[class*="settlementButton-"] div[class*="container-"]',
        );
        await settlementButton.first().click({ force: true });
        await _delay(100);
      },
      wantToBuildCity: async () => {
        const cityButton = iframe.locator(
          'div[class*="cityButton-"] div[class*="container-"]',
        );
        await cityButton.first().click({ force: true });
        await _delay(100);
      },
      buyDevelopmentCard: async () => {
        const devCardButton = iframe.locator(
          'div[class*="actionButton"] img[src*="development"], div[class*="actionButton"] img[src*="dev"], div[class*="actionButton"] img[src*="card_"]',
        );
        if ((await devCardButton.count()) > 0) {
          await devCardButton.first().click({ force: true });
          return;
        }
        const actionButtons = iframe.locator('div[class*="actionButton"]');
        await actionButtons.last().click({ force: true });
      },
      wantToTrade: async (payload: any) => {
        const tradeButton = iframe.locator('div[id="action-button-trade"]');
        await tradeButton.first().click({ force: true });
        await _delay(100);

        await expect
          .poll(
            async () => {
              await verifyTestMessages(false);
              return (
                _expectedMessages &&
                _expectedMessages[0].data.data.type ===
                  CLIENT_TRADE_OFFER_TYPE &&
                _expectedMessages[0].trigger === "serverData"
              );
            },
            { timeout: 5000 },
          )
          .toBe(true);

        const resourceCardType: Record<number, string> = {
          1: "lumber",
          2: "brick",
          3: "wool",
          4: "grain",
          5: "ore",
          6: "cloth",
          7: "coin",
          8: "paper",
        };

        const tradeCard = iframe.locator('img[src*="card_"]');
        await expect(tradeCard.first()).toBeVisible({ timeout: 5000 });

        const clickResourceCard = async (
          parent: string,
          resourceId: number,
        ) => {
          const resourceType = resourceCardType[resourceId];
          if (!resourceType) {
            throw new Error(`Unknown resource type: ${resourceId}`);
          }
          const card = iframe.locator(
            `${parent} img[src*="card_${resourceType}"]`,
          );
          await card.first().click({ force: true });
          await _delay(50);
        };

        for (const resourceId of payload.offeredResources ?? []) {
          await clickResourceCard(
            `div[id="player-card-inventory"]`,
            resourceId,
          );
        }

        for (const resourceId of payload.wantedResources ?? []) {
          await clickResourceCard(
            `div[class*="wantedCardSelectorContainer-"]`,
            resourceId,
          );
        }

        const bankTradeButton = iframe.locator(
          'div[id="action-button-trade-bank"]',
        );
        await bankTradeButton.first().click({ force: true });
        await expect
          .poll(
            () =>
              iframe
                .locator("body")
                .evaluate(() =>
                  window.parent.__socketCatannMessages.some(
                    (msg: { trigger?: string }) =>
                      msg?.trigger === "serverData",
                  ),
                ),
            { timeout: 5000 },
          )
          .toBe(true);
        const shifted = _expectedMessages!.shift()!;
        try {
          expect(shifted.data.data.type).toBe(CLIENT_TRADE_OFFER_TYPE);
        } catch (e) {
          console.log(shifted);
          throw e;
        }
        _expectedMessages![0].data.payload.counterOfferInResponseToTradeId =
          null;
      },
      rollNextDice: async () => {
        const diceStateMessage = _expectedMessages!.find(
          (msg) => msg.data.data?.payload?.diff?.diceState?.diceThrown,
        )!;
        const diceStateLog = (
          Object.values(
            diceStateMessage.data.data.payload.diff.gameLogState,
          ).find((log: any) => log.text.firstDice) as any
        ).text;
        const diceState: [number, number] = [
          diceStateLog.firstDice,
          diceStateLog.secondDice,
        ];
        console.log("rolling", diceState);
        await _rollDice(canvas, diceState);
      },
      passTurn: async () => await _passTurn(canvas),
      handleReconnect: async () => {
        const expectedMessages = _expectedMessages!;
        let serverIndex = -1;
        for (let i = 0; i < expectedMessages.length; i += 1) {
          const msg = expectedMessages[i];
          if (msg.trigger !== "serverData") continue;
          const sequence = msg.data?.data?.sequence;
          if (sequence == null) continue;
          serverIndex = i;
          expect(sequence).toBe(1);
          break;
        }
        expect(serverIndex).toBeGreaterThanOrEqual(0);

        let clientIndex = -1;
        for (let i = serverIndex + 1; i < expectedMessages.length; i += 1) {
          const msg = expectedMessages[i];
          if (msg.trigger !== "clientData") continue;
          const sequence = msg.data?.sequence;
          if (sequence == null) continue;
          clientIndex = i;
          break;
        }
        expect(clientIndex).toBeGreaterThan(serverIndex);
        expectedMessages.splice(0, clientIndex);

        const firebaseData = await page.evaluate(() =>
          window.__getFirebaseData(),
        );
        const gameState = firebaseData.GAME.data.payload.gameState;
        const playerColor = 1;
        addGameLogEntry(gameState, {
          text: {
            type: GameLogMessageType.Disconnected,
            playerColor,
            is10SecondRuleDisabled: true,
          },
          from: playerColor,
        });
        addGameLogEntry(gameState, {
          text: {
            type: GameLogMessageType.PlayerReconnecting,
            playerColor,
          },
          from: playerColor,
        });

        await page.evaluate(
          (_firebaseData) => window.__setFirebaseData(_firebaseData),
          firebaseData,
        );
      },
      skipIllegalPass: async () => {
        const msg = _expectedMessages!.shift()!;
        expect(msg.data.action).toBe(GAME_ACTION.PassedTurn);
      },
      playNextRobber: async () => {
        const msg = _expectedMessages![0];
        expect(msg.trigger).toBe("clientData");
        expect(msg.data.action).toBe(GAME_ACTION.SelectedTile);
        const robberOffset = getTilePosition(msg.data.payload);
        await clickCanvas(canvas, robberOffset);

        const confirmRobberOffset = getConfirmOffset(robberOffset);
        await clickCanvas(canvas, confirmRobberOffset);
      },
    };
  })(getCanvas(iframe));

export default Controller;

export const clickCanvas = async (
  canvas: Locator,
  position: { x: number; y: number },
) => {
  await expect
    .poll(() => _mapAppearsClickable(canvas, position), {
      timeout: 10_000,
    })
    .toBe(true);

  await canvas.click({
    position,
    force: true,
  });
};

export const _mapAppearsClickable = async (
  canvas: Locator,
  offset: { x: number; y: number },
) => {
  await canvas
    .page()
    .mouse.move(offset.x + MAP_OFFSET.x, offset.y + MAP_OFFSET.y);
  const hasPointerCursor = await canvas.evaluate((element, hoverOffset) => {
    const htmlElement = element as HTMLElement;
    const rect = htmlElement.getBoundingClientRect();
    const target = document.elementFromPoint(
      rect.left + hoverOffset.x,
      rect.top + hoverOffset.y,
    ) as HTMLElement | null;
    const cursor = target
      ? window.getComputedStyle(target).cursor
      : window.getComputedStyle(htmlElement).cursor;
    return cursor === "pointer";
  }, offset);
  return hasPointerCursor;
};

export const checkCanvasHandle = async (iframe: FrameLocator) => {
  const waitForCanvasPaint = async (
    canvasHandle: ElementHandle<HTMLCanvasElement>,
  ) => {
    await expect
      .poll(
        () =>
          canvasHandle.evaluate((canvas) => {
            const htmlCanvas = canvas as HTMLCanvasElement;
            if (htmlCanvas.width === 0 || htmlCanvas.height === 0) {
              return false;
            }

            const gl =
              htmlCanvas.getContext("webgl") || htmlCanvas.getContext("webgl2");
            if (!gl) return false;
            const glCtx = gl as WebGLRenderingContext | WebGL2RenderingContext;
            const width = glCtx.drawingBufferWidth;
            const height = glCtx.drawingBufferHeight;
            if (width === 0 || height === 0) return false;
            const stepX = Math.max(1, Math.floor(width / 10));
            const stepY = Math.max(1, Math.floor(height / 10));
            const pixel = new Uint8Array(4);
            try {
              for (let x = 0; x < width; x += stepX) {
                for (let y = 0; y < height; y += stepY) {
                  glCtx.readPixels(
                    x,
                    y,
                    1,
                    1,
                    glCtx.RGBA,
                    glCtx.UNSIGNED_BYTE,
                    pixel,
                  );
                  if (pixel[3] > 0) {
                    return true;
                  }
                }
              }
            } catch {
              return false;
            }
            return false;
          }),
        {
          timeout: 1000,
        },
      )
      .toBe(true);
  };
  const gameCanvas = iframe.locator("canvas#game-canvas");
  await expect(gameCanvas).toBeVisible({ timeout: 1000 });
  const canvasHandle =
    (await gameCanvas.elementHandle()) as ElementHandle<HTMLCanvasElement>;
  if (!canvasHandle) {
    throw new Error("Unable to locate game canvas.");
  }
  await waitForCanvasPaint(canvasHandle);
  const canvasBox = await canvasHandle.boundingBox();
  expect(canvasBox).toEqual({
    ...MAP_OFFSET,
    width: 1280 - 2 * MAP_OFFSET.x,
    height: 720 - 2 * MAP_OFFSET.y,
  });
};

export const getSettlementOffset = (position: { col: number; row: number }) => {
  return {
    x: Math.round(
      MAP_ZERO_ZERO.x +
        (position.col * (MAP_HEX_SIDE_LENGTH * Math.sqrt(3))) / 2,
    ),
    y: Math.round(
      MAP_ZERO_ZERO.y +
        (position.row % 2) * 0.5 * MAP_HEX_SIDE_LENGTH +
        Math.floor(position.row / 2) * 1.5 * MAP_HEX_SIDE_LENGTH,
    ),
  };
};

export const _rollDice = async (
  canvas: Locator,
  diceState: [number, number] | null = null,
) => {
  if (diceState !== null)
    await canvas.evaluate((_, diceState) => {
      window.parent.__diceState = diceState;
    }, diceState);

  await clickCanvas(canvas, MAP_DICE_COORDS);

  await expect
    .poll(() => _mapAppearsClickable(canvas, MAP_DICE_COORDS), {
      timeout: 5000,
    })
    .toBe(false);
};

const _passTurn = async (canvas: Locator) => {
  await expect
    .poll(() => _mapAppearsClickable(canvas, MAP_DICE_COORDS), {
      timeout: 5000,
    })
    .toBe(false);
  for (let i = 0; i < 5; i++) {
    await clickCanvas(canvas, MAP_PASS_COORDS);
    await _delay(50);
  }
  await expect
    .poll(() => _mapAppearsClickable(canvas, MAP_DICE_COORDS), {
      timeout: 5000,
    })
    .toBe(true);
};

export const getCanvas = (iframe: FrameLocator) =>
  iframe.locator("canvas#game-canvas");

const getConfirmOffset = (baseOffset: { x: number; y: number }) => {
  return { x: baseOffset.x, y: baseOffset.y - MAP_CONFIRM_OFFSET };
};

export const getStartButton = (iframe: FrameLocator) => {
  return iframe.locator("#room_center_start_button");
};

const getTilePosition = (tileIndex: number) => {
  const TILE_HEX_COORDS: Record<number, { x: number; y: number }> = {
    10: { x: 2, y: -2 },
    11: { x: 1, y: -2 },
    0: { x: 0, y: -2 },

    1: { x: -1, y: -1 },
    9: { x: 2, y: -1 },
    12: { x: 0, y: -1 },
    17: { x: 1, y: -1 },

    2: { x: -2, y: 0 },
    16: { x: 1, y: 0 },
    18: { x: 0, y: 0 },
    8: { x: 2, y: 0 },
    13: { x: -1, y: 0 },

    3: { x: -2, y: 1 },
    7: { x: 1, y: 1 },
    14: { x: -1, y: 1 },
    15: { x: 0, y: 1 },

    4: { x: -2, y: 2 },
    5: { x: -1, y: 2 },
    6: { x: 0, y: 2 },
  };

  const tileState = TILE_HEX_COORDS[tileIndex];
  const center = {
    col: 5 + 2 * (tileState.x + 0.5 * tileState.y),
    row: 5 + 2 * tileState.y,
  };
  return getSettlementOffset(center);
};
