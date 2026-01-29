// TODO
// dont splice in the beginning
// start from random point, interact, verify

import {
  expect,
  Locator,
  test,
  type ElementHandle,
  type FrameLocator,
  type Page,
} from "@playwright/test";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { GAME_ACTION, State } from "../app/gameLogic/CatannFilesEnums";

const screenshot = (f: ({ page }: { page: Page }) => void) => {
  return async ({ page }: { page: Page }, testInfo: any) => {
    try {
      await f({ page });
    } finally {
      await page.screenshot({
        path: testInfo.outputPath("screenshot.png"),
        fullPage: true,
      });
    }
  };
};

const choreo = (
  fileName: string,
  f: (
    iframe: FrameLocator,
    expectedMessages: { trigger: string; data: any }[],
  ) => Promise<void>,
) => {
  return async ({ page }: { page: Page }) => {
    const expectedMessages = await getExpectedMessages(fileName);
    const startIndex = expectedMessages.findIndex(
      (msg) => msg.data.type === "startGame",
    );
    const expectedSpliced = expectedMessages.splice(
      0,
      startIndex === -1 ? expectedMessages.length : startIndex,
    );
    console.log(
      "choreo",
      fileName,
      expectedSpliced.length,
      expectedMessages.length,
    );

    const gameState = expectedMessages.find(
      (msg) => msg.data.data?.payload.gameState,
    )!.data.data.payload.gameState;
    const roomId = expectedSpliced.find((msg) => msg.data.data?.roomId)!.data
      .data.roomId;
    const iframe = await createRoom(page, roomId);
    await page.evaluate(
      (__testOverrides) => {
        window.__testOverrides = __testOverrides;
      },
      {
        databaseGame: expectedMessages.find(
          (msg) =>
            msg.trigger === "serverData" &&
            msg.data.data.payload.databaseGameId,
        )!.data.data.payload,
        startTime: gameState.currentState.startTime,
        session: expectedSpliced.find((msg) => msg.data.data?.sessions)!.data
          .data.sessions[0],
        mapState: gameState.mapState,
      },
    );
    await spliceTestMessages(iframe);
    const startButton = getStartButton(iframe);
    await startButton.click({ force: true });
    await delay(1000);
    await f(iframe, expectedMessages);
    expect(expectedMessages).toEqual([]);
  };
};

test(
  "clickable_map",
  screenshot(async ({ page }: { page: Page }) => {
    const settlementCoords = { col: 0, row: 5 };
    const destinationCoords = { col: 1, row: 4 };

    const iframe = await createRoom(page);
    const startButton = getStartButton(iframe);
    await startButton.click({ force: true });

    await checkCanvasHandle(iframe);
    const canvas = iframe.locator("canvas#game-canvas");

    const checkClickable = async (
      f: (offset: { col: number; row: number }) => boolean,
    ) => {
      for (let row = 0; row < 12; row++) {
        const offset = Math.round(0.5 * Math.abs(row - 5.5));
        for (let range = 0; range < 6 - offset; range++) {
          const col = offset + 2 * range;
          const vertexOffset = getSettlementOffset({
            col,
            row,
          });
          const shouldBeClickable = f({ col, row });
          try {
            await expect
              .poll(
                async () => await mapAppearsClickable(canvas, vertexOffset),
                {
                  timeout: 3000,
                },
              )
              .toBe(shouldBeClickable);
          } catch (e) {
            console.log({ shouldBeClickable, col, row, vertexOffset });
            throw e;
          }
        }
      }
    };

    await checkClickable((_) => true);

    const f = async (
      settlementCoords: { col: number; row: number },
      destinationCoords: { col: number; row: number },
      isFirst: boolean,
    ) => {
      const settlementOffset = getSettlementOffset(settlementCoords);

      await expect
        .poll(async () => mapAppearsClickable(canvas, settlementOffset), {
          timeout: 5000,
        })
        .toBe(true);
      await canvas.click({
        position: settlementOffset,
        force: true,
      });

      const confirmSettlementOffset = getConfirmOffset(settlementOffset);
      await canvas.click({
        position: confirmSettlementOffset,
        force: true,
      });

      if (isFirst) await checkClickable((_) => false);

      const destinationOffset = getSettlementOffset(destinationCoords);
      const roadOffset = {
        x: (settlementOffset.x + destinationOffset.x) / 2,
        y: (settlementOffset.y + destinationOffset.y) / 2,
      };

      await expect
        .poll(async () => mapAppearsClickable(canvas, roadOffset), {
          timeout: 5000,
        })
        .toBe(true);
      await canvas.click({
        position: roadOffset,
        force: true,
      });

      const confirmRoadOffset = getConfirmOffset(roadOffset);
      await canvas.click({
        position: confirmRoadOffset,
        force: true,
      });
    };
    await f(settlementCoords, destinationCoords, true);

    // the road appears clickable, because it has a mouse over
    // "Road Length: 1"
    await checkClickable((offset) => offset.col !== 0);

    await expect
      .poll(async () => mapAppearsClickable(canvas, MAP_DICE_COORDS), {
        timeout: 5000,
      })
      .toBe(false);

    await f(
      { row: settlementCoords.row, col: settlementCoords.col + 2 },
      { row: destinationCoords.row, col: destinationCoords.col + 2 },
      false,
    );

    await expect
      .poll(async () => mapAppearsClickable(canvas, MAP_DICE_COORDS), {
        timeout: 5000,
      })
      .toBe(true);

    await rollDice(canvas);

    await expect
      .poll(async () => mapAppearsClickable(canvas, MAP_DICE_COORDS), {
        timeout: 5000,
      })
      .toBe(false);
  }),
);

//

const startingSettlementChoreo = async (
  iframe: FrameLocator,
  expectedMessages: { trigger: string; data: any }[],
) => {
  await verifyTestMessages(iframe, expectedMessages);

  const canvas = iframe.locator("canvas#game-canvas");

  const f = async (
    settlementCoords: { col: number; row: number },
    destinationCoords: { col: number; row: number },
  ) => {
    const settlementOffset = getSettlementOffset(settlementCoords);
    const destinationOffset = getSettlementOffset(destinationCoords);
    await expect
      .poll(async () => mapAppearsClickable(canvas, settlementOffset), {
        timeout: 5000,
      })
      .toBe(true);
    await canvas.click({
      position: settlementOffset,
      force: true,
    });

    await verifyTestMessages(iframe, expectedMessages);

    const confirmSettlementOffset = getConfirmOffset(settlementOffset);
    await canvas.click({
      position: confirmSettlementOffset,
      force: true,
    });

    await verifyTestMessages(iframe, expectedMessages);

    const roadOffset = {
      x: (settlementOffset.x + destinationOffset.x) / 2,
      y: (settlementOffset.y + destinationOffset.y) / 2,
    };

    await expect
      .poll(async () => mapAppearsClickable(canvas, roadOffset), {
        timeout: 5000,
      })
      .toBe(true);
    await canvas.click({
      position: roadOffset,
      force: true,
    });

    const confirmRoadOffset = getConfirmOffset(roadOffset);
    await canvas.click({
      position: confirmRoadOffset,
      force: true,
    });

    await verifyTestMessages(iframe, expectedMessages);
  };
  await f({ col: 2, row: 5 }, { col: 2, row: 6 });
  await f({ col: 8, row: 5 }, { col: 8, row: 6 });

  const diceState = expectedMessages.find(
    (msg) => msg.data.data?.payload.diff?.diceState,
  )!.data.data.payload.diff.diceState;

  await rollDice(canvas, [diceState.dice1, diceState.dice2]);

  await verifyTestMessages(iframe, expectedMessages);
};

test.skip(
  "starting_settlement",
  screenshot(choreo("./starting_settlement.json", startingSettlementChoreo)),
);

//

const checkCanvasHandle = async (iframe: FrameLocator) => {
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

const getSettlementOffset = (position: { col: number; row: number }) => {
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

const getConfirmOffset = (baseOffset: { x: number; y: number }) => {
  return { x: baseOffset.x, y: baseOffset.y - MAP_CONFIRM_OFFSET };
};

const mapAppearsClickable = async (
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

const rollDice = async (
  canvas: Locator,
  diceState: [number, number] | null = null,
) => {
  if (diceState !== null)
    await canvas.evaluate((_, diceState) => {
      window.parent.__diceState = diceState;
    }, diceState);

  await canvas.click({
    position: MAP_DICE_COORDS,
    force: true,
  });
};

//

const createRoom = async (
  page: Page,
  roomId: string = "",
): Promise<FrameLocator> => {
  const gotoCatann = async (page: Page): Promise<FrameLocator> => {
    // page.on("console", (msg) => {
    //   console.log(msg.text());
    // });
    await page.goto(`${APP_URL}catann#${roomId}`, { waitUntil: "load" });
    const iframe = page.locator('iframe[title="iframe"]');
    await expect(iframe).toBeVisible({ timeout: 1000 });
    return page.frameLocator('iframe[title="iframe"]');
  };
  const iframe = await gotoCatann(page);
  const startButton = getStartButton(iframe);
  await expect(startButton).toBeVisible({ timeout: 30_000 });
  return iframe;
};

const getStartButton = (iframe: FrameLocator) => {
  return iframe.locator("#room_center_start_button");
};

const isNotHeartbeat = (msg: { trigger: string; data: any }) => {
  if (!msg) return false;
  if (msg.data.id === State.SocketMonitorUpdate.toString()) return false;
  // isLoggedIn: false, TODO audit
  if (
    msg.trigger === "clientData" &&
    [
      GAME_ACTION.ClickedDice,
      GAME_ACTION.SelectedTile,
      GAME_ACTION.ConfirmBuildSettlement,
      GAME_ACTION.RequestBeginnerHint,
      GAME_ACTION.SelectedInitialPlacementIndex,
    ].includes(msg.data.action)
  )
    return false;
  return true;
};

const getExpectedMessages = async (recordingPath: string) => {
  const openRecordingJson = (
    recordingPath: string,
  ): { trigger: string; data: any }[] => {
    const fullPath = path.resolve(__dirname, recordingPath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data) as { trigger: string; data: any }[];
  };
  const expectedMessages = openRecordingJson(recordingPath).filter((msg) =>
    isNotHeartbeat(msg),
  );
  return expectedMessages;
};

const spliceTestMessages = async (
  iframe: FrameLocator,
): Promise<{ trigger: string; data: any }[]> => {
  return (
    await iframe
      .locator("body")
      .evaluate(() => window.parent.__socketCatannMessages.splice(0))
  ).filter((msg) => isNotHeartbeat(msg));
};

const verifyTestMessages = async (
  iframe: FrameLocator,
  expectedMessages: { trigger: string; data: any }[],
) => {
  const testMessages = await spliceTestMessages(iframe);
  console.log(
    "verifyTestMessages",
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
      if (expectedMsg.data.sequence)
        msg.data.sequence = expectedMsg.data.sequence;
    } else {
      msg.data.data.sequence = expectedMsg.data.data.sequence;
      if (
        msg.data.data.payload.diff?.currentState.startTime &&
        expectedMsg.data.data.payload.diff?.currentState.startTime
      ) {
        msg.data.data.payload.diff.currentState.startTime =
          expectedMsg.data.data.payload.diff?.currentState.startTime;
      }
    }
    expect(msg).toEqual(expectedMsg);
    console.log(msg);
  });
};

//

const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const SERVER_START_TIMEOUT_MS = 10_000;
const MAP_OFFSET = { x: 165, y: 11.5 };
const MAP_ZERO_ZERO = { x: 245 - MAP_OFFSET.x, y: 89 - MAP_OFFSET.y };
const MAP_HEX_SIDE_LENGTH = 59;
const MAP_CONFIRM_OFFSET = 53;
const MAP_DICE_COORDS = { x: 717 - MAP_OFFSET.x, y: 551 - MAP_OFFSET.y };

test.use({ ignoreHTTPSErrors: true });
test.describe.configure({ timeout: 300_000 });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test.beforeAll(async ({}, testInfo) => {
  const waitForServer = async (url: string, timeoutMs: number) => {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      try {
        await new Promise<void>((resolve, reject) => {
          const req = http.get(url, (res) => {
            res.resume();
            if (res.statusCode && res.statusCode < 500) {
              resolve();
            } else {
              reject(new Error(`Unexpected status code: ${res.statusCode}`));
            }
          });
          req.on("error", reject);
        });
        return;
      } catch (error) {
        await delay(500);
      }
    }

    throw new Error(`Timed out waiting for ${url}`);
  };

  await waitForServer(APP_URL, SERVER_START_TIMEOUT_MS);
});
