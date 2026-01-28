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
import { State } from "../app/gameLogic/CatannFilesEnums";
import {
  getDefaultCatannConfig,
  mergeCatannConfig,
  type CatannConfig,
  type DeepPartial,
} from "../app/gameLogic/config";

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
    const { messages: expectedMessages, config: configOverrides } =
      await getExpectedMessages(fileName);
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

    const iframe = await createRoom(page, configOverrides);
    const spliced = await spliceTestMessages(iframe);
    const startButton = getStartButton(iframe);
    await startButton.click({ force: true });
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
          await expect
            .poll(async () => await mapAppearsClickable(canvas, vertexOffset), {
              timeout: 5000,
            })
            .toBe(shouldBeClickable);
        }
      }
    };

    await checkClickable((_) => true);

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

    await checkClickable((_) => false);

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

    // the road appears clickable, because it has a mouse over
    // "Road Length: 1"
    await checkClickable((offset) => offset.col !== 0);
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
  await f({ col: 0, row: 5 }, { col: 0, row: 6 });
  await f({ col: 10, row: 5 }, { col: 10, row: 6 });
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
  expect(canvasBox).toEqual({ x: 0, y: 0, width: 1280, height: 720 });
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
  await canvas.page().mouse.move(offset.x, offset.y);
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

//

const createRoom = async (
  page: Page,
  configOverrides?: DeepPartial<CatannConfig>,
): Promise<FrameLocator> => {
  const gotoCatann = async (page: Page): Promise<FrameLocator> => {
    if (configOverrides) {
      await page.addInitScript((config) => {
        window.__catannTestConfig = config;
      }, configOverrides);
    }
    await page.goto(`${APP_URL}catann`, { waitUntil: "load" });
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
  return true;
};

const deepEqual = (a: any, b: any): boolean => {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
};

const buildDiffOverrides = <T>(base: T, incoming: T): DeepPartial<T> => {
  if (deepEqual(base, incoming)) return {};
  if (Array.isArray(base) || Array.isArray(incoming)) {
    return incoming as any;
  }
  if (
    base &&
    incoming &&
    typeof base === "object" &&
    typeof incoming === "object"
  ) {
    const diff: Record<string, any> = {};
    Object.keys(incoming as Record<string, any>).forEach((key) => {
      const baseValue = (base as Record<string, any>)[key];
      const incomingValue = (incoming as Record<string, any>)[key];
      if (incomingValue === undefined) return;
      if (
        baseValue &&
        incomingValue &&
        typeof baseValue === "object" &&
        typeof incomingValue === "object" &&
        !Array.isArray(baseValue) &&
        !Array.isArray(incomingValue)
      ) {
        const nested = buildDiffOverrides(baseValue, incomingValue);
        if (Object.keys(nested).length > 0) {
          diff[key] = nested;
        }
        return;
      }
      if (!deepEqual(baseValue, incomingValue)) {
        diff[key] = incomingValue;
      }
    });
    return diff as DeepPartial<T>;
  }
  return incoming as any;
};

const extractExpectedConfig = (
  messages: { trigger: string; data: any }[],
): CatannConfig => {
  const defaults = getDefaultCatannConfig();
  const roomStateMessage = messages.find(
    (msg) =>
      msg.trigger === "serverData" && msg.data?.data?.type === "StateUpdated",
  );
  const roomState = roomStateMessage?.data?.data ?? {};
  const roomSession = roomState?.sessions?.[0] ?? {};

  const gameStateMessage = messages.find(
    (msg) => msg.trigger === "serverData" && msg.data?.data?.payload?.gameState,
  );
  const gamePayload = gameStateMessage?.data?.data?.payload ?? {};
  const playerUserState = gamePayload?.playerUserStates?.[0] ?? {};

  const startGameMessage = messages.find(
    (msg) => msg.trigger === "serverData" && msg.data?.data?.payload?.serverId,
  );
  const startGamePayload = startGameMessage?.data?.data?.payload ?? {};

  const diceEntry = messages
    .flatMap((msg) =>
      msg.trigger === "serverData"
        ? Object.values(
            msg.data?.data?.payload?.diff?.gameLogState ??
              msg.data?.data?.payload?.gameLogState ??
              {},
          )
        : [],
    )
    .find(
      (entry: any) =>
        entry?.text?.type === 10 && typeof entry?.text?.firstDice === "number",
    ) as { text?: { firstDice?: number; secondDice?: number } } | undefined;

  const expectedConfig = mergeCatannConfig(defaults, {
    roomData: {
      roomId: roomState?.roomId,
      private: roomState?.private,
      playOrderSelectionActive: roomState?.playOrderSelectionActive,
      minimumKarma: roomState?.minimumKarma,
      gameMode: roomState?.gameMode,
      map: roomState?.map,
      diceType: roomState?.diceType,
      victoryPointsToWin: roomState?.victoryPointsToWin,
      victoryPointsRecommendedLimit: roomState?.victoryPointsRecommendedLimit,
      victoryPointsMaxAllowed: roomState?.victoryPointsMaxAllowed,
      cardDiscardLimit: roomState?.cardDiscardLimit,
      maxPlayers: roomState?.maxPlayers,
      gameSpeed: roomState?.gameSpeed,
      botSpeed: roomState?.botSpeed,
      hiddenBankCards: roomState?.hiddenBankCards,
      friendlyRobber: roomState?.friendlyRobber,
      isTournament: roomState?.isTournament,
      isTestFreeExpansionsAndMaps: roomState?.isTestFreeExpansionsAndMaps,
      kickedUserIds: roomState?.kickedUserIds,
      creationPhase: roomState?.creationPhase,
    },
    sessionData: {
      roomSessionId: roomSession?.roomSessionId,
      userSessionId: roomSession?.userSessionId,
      userId: roomSession?.userId,
      isBot: roomSession?.isBot,
      isReadyToPlay: roomSession?.isReadyToPlay,
      selectedColor: roomSession?.selectedColor,
      username: roomSession?.username,
      isMember: roomSession?.isMember,
      icon: roomSession?.icon,
      profilePictureUrl: roomSession?.profilePictureUrl,
      karmaCompletedGames: roomSession?.karmaCompletedGames,
      karmaTotalGames: roomSession?.karmaTotalGames,
      availableColors: roomSession?.availableColors,
      botDifficulty: roomSession?.botDifficulty,
    },
    userStateOverrides: {
      id: playerUserState?.userId ?? roomSession?.userId,
      username: playerUserState?.username ?? roomSession?.username,
      icon: playerUserState?.databaseIcon ?? roomSession?.icon,
    },
    gameSettingsOverrides: {
      mapSetting: gamePayload?.gameSettings?.mapSetting,
      diceSetting: gamePayload?.gameSettings?.diceSetting,
    },
    diceRoll: {
      dice1: diceEntry?.text?.firstDice ?? defaults.diceRoll.dice1,
      dice2: diceEntry?.text?.secondDice ?? defaults.diceRoll.dice2,
    },
    mapState: gamePayload?.gameState?.mapState,
    startGameOverrides: {
      serverId: startGamePayload?.serverId,
      databaseGameId: startGamePayload?.databaseGameId,
      gameSettingId: startGamePayload?.gameSettingId,
      shouldResetGameClient: startGamePayload?.shouldResetGameClient,
      isReconnectingSession: startGamePayload?.isReconnectingSession,
    },
  });

  return expectedConfig;
};

const getExpectedMessages = async (recordingPath: string) => {
  const openRecordingJson = (
    recordingPath: string,
  ): { trigger: string; data: any }[] => {
    const fullPath = path.resolve(__dirname, recordingPath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data) as { trigger: string; data: any }[];
  };
  const messages = openRecordingJson(recordingPath).filter((msg) =>
    isNotHeartbeat(msg),
  );
  const defaults = getDefaultCatannConfig();
  const expectedConfig = extractExpectedConfig(messages);
  const configOverrides = buildDiffOverrides(defaults, expectedConfig);
  return { messages, config: configOverrides };
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
      delete expectedMsg.data.data.payload.diff?.currentState.startTime;
      delete msg.data.data.payload.diff?.currentState.startTime;
    }
    expect(msg).toEqual(expectedMsg);
    console.log(msg);
  });
};

//

const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const SERVER_START_TIMEOUT_MS = 10_000;
const MAP_ZERO_ZERO = { x: 232, y: 79 };
const MAP_HEX_SIDE_LENGTH = 61;
const MAP_CONFIRM_OFFSET = 53;

test.use({ ignoreHTTPSErrors: true });
test.describe.configure({ timeout: 300_000 });

test.beforeAll(async ({}, testInfo) => {
  const waitForServer = async (url: string, timeoutMs: number) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
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
