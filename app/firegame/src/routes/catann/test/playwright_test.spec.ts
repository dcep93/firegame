// TODO
// 2 player game
// 4 player setup, first turns
// audit skills
// skill find bugs
// expansions
// timeout/autoplay

import { expect, test, type FrameLocator, type Page } from "@playwright/test";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { deepEqual } from "../app/gameDataHelper";
import {
  GameAction,
  GameStateUpdateType,
  GeneralAction,
  OnlineStatus,
  State,
} from "../app/gameLogic/CatannFilesEnums";
import autoChoreo from "./autoChoreo";
import {
  canvasMapAppearsClickable,
  canvasRollDice,
  checkCanvasHandle,
  getCanvas,
  getSettlementOffset,
  getStartButton,
} from "./canvasGeometry";
import Controller from "./Controller";
import fastForward from "./fastForward";
import { multiChoreo } from "./multiChoreo";

export const codex: Record<number, Record<string, number>> = {};

const screenshot = (f: ({ page }: { page: Page }) => void) => {
  return async ({ page }: { page: Page }, testInfo: any) => {
    try {
      await f({ page });
    } finally {
      await delay(1000);
      console.log({ codex });
      await page.screenshot({
        path: testInfo.outputPath("screenshot.png"),
        fullPage: true,
      });
    }
  };
};

const choreo = (fileName: string, clientDataSequence: number = -1) => {
  return async ({ page }: { page: Page }) => {
    page.on("pageerror", (msg) => console.log(msg));
    // page.on("console", (msg) => console.log("test.debug", msg.text()));
    const getExpectedMessages = async (recordingPath: string) => {
      const sortCardsToBroadcast = (value: unknown): void => {
        if (!value || typeof value !== "object") {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((entry) => sortCardsToBroadcast(entry));
          return;
        }

        const entries = Object.entries(value);
        entries.forEach(([key, nestedValue]) => {
          if (
            ["cards", "cardsToBroadcast", "validCardsToSelect"].includes(key) &&
            Array.isArray(nestedValue) &&
            nestedValue.every((entry) => typeof entry === "number")
          ) {
            nestedValue.sort((a, b) => a - b);
            return;
          }
          sortCardsToBroadcast(nestedValue);
        });
      };

      const openRecordingJson = (
        recordingPath: string,
      ): { trigger: string; data: any }[] => {
        const fullPath = path.resolve(__dirname, recordingPath);
        const data = fs.readFileSync(fullPath, "utf8");
        return JSON.parse(data) as { trigger: string; data: any }[];
      };
      const expectedMessages = openRecordingJson(recordingPath)
        .filter((msg) => isRealMessage(msg))
        .map((msg) => {
          if (msg.trigger === "serverData") {
            sortCardsToBroadcast(msg.data);
            if (
              [
                GameStateUpdateType.HighlightRoadEdges,
                GameStateUpdateType.HighlightCorners,
                GameStateUpdateType.HighlightTiles,
              ].includes(msg.data.data.type)
            ) {
              (msg.data.data.payload as number[]).sort((a, b) => a - b);
            }
          }
          return msg;
        });
      return expectedMessages;
    };
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
    const iframe = await createRoom(page, {
      roomId,
      username: "choreo",
      selectedColor: "",
    });
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
        sessions: expectedSpliced.find((msg) => msg.data.data?.sessions)!.data
          .data.sessions,
        mapState: gameState.mapState,
        playOrder: null,
      },
    );
    await spliceTestMessages(iframe);
    const c = Controller(-1, page, iframe, expectedMessages);
    if (clientDataSequence !== -1) {
      await fastForward(iframe, expectedMessages, c, clientDataSequence);
      await c.fastForward(clientDataSequence);
    } else {
      await c.clickStartButton();
      await c.verifyTestMessages();
    }
    await autoChoreo(c);
    await c.verifyTestMessages(false);
    expect(expectedMessages.slice(0, 1)).toEqual([]);
    await expect(page.locator('iframe[title="iframe"]')).toBeVisible();
  };
};

//

test.skip(
  "clickable_map",
  screenshot(async ({ page }: { page: Page }) => {
    const settlementCoords = { col: 0, row: 5 };
    const destinationCoords = { col: 1, row: 4 };

    const iframe = await createRoom(page);
    const startButton = getStartButton(iframe);
    await startButton.click({ force: true });

    await checkCanvasHandle(iframe);

    const c = Controller(-1, page, iframe, undefined);
    const canvas = getCanvas(iframe);

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
                async () =>
                  await canvasMapAppearsClickable(canvas, vertexOffset),
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

    await spliceTestMessages(iframe);
    await c.buildSettlement(settlementCoords);
    await spliceTestMessages(iframe);
    await c.buildRoad(settlementCoords, destinationCoords);

    // the road appears clickable, because it has a mouse over
    // "Road Length: 1"
    await checkClickable((offset) => offset.col !== 0);

    await spliceTestMessages(iframe);
    await c.buildSettlement({
      row: settlementCoords.row,
      col: settlementCoords.col + 2,
    });
    await spliceTestMessages(iframe);
    await c.buildRoad(
      { row: settlementCoords.row, col: settlementCoords.col + 2 },
      { row: destinationCoords.row, col: destinationCoords.col + 2 },
    );

    await canvasRollDice(canvas);
  }),
);

test.skip(
  "reconnect",
  screenshot(async ({ page }: { page: Page }) => {
    await page.goto(`${APP_URL}catann?test#reconnect`, {
      waitUntil: "load",
    });
    page.on("pageerror", (msg) => console.log(msg));
    page.on("console", (msg) => console.log(msg));
    await delay(5000);

    const _iframe = page.locator('iframe[title="iframe"]');
    await expect(_iframe).toBeVisible({ timeout: 1000 });
    const iframe = page.frameLocator('iframe[title="iframe"]');

    await checkCanvasHandle(iframe);

    const c = Controller(-1, page, iframe, undefined);

    const settlementCoords = { col: 0, row: 5 };
    const destinationCoords = { col: 1, row: 4 };

    await c.buildSettlement(settlementCoords);
    await spliceTestMessages(iframe);
    await c.buildRoad(settlementCoords, destinationCoords);
  }),
);

test.skip("1p.v0", screenshot(choreo("./choreo/1p.v0.json")));

test.skip("1p.v1", screenshot(choreo("./choreo/1p.v1.json")));

test.skip("1p.v2", screenshot(choreo("./choreo/1p.v2.json")));

const isRegression = process.env.CATANN_REGRESSION === "1";
const doIfRegression = isRegression ? test : test.skip;
const doIfNotRegression = !isRegression ? test : test.skip;
doIfRegression("2p.v0", multiChoreo("./choreo/2p.v0.json"));
doIfNotRegression("2p.v1", multiChoreo("./choreo/2p.v1.json", "96"));
test.skip("4p.v0", multiChoreo("./choreo/4p.v0.json"));

//

//

export const createRoom = async (
  page: Page,
  params: {
    roomId: string;
    username: string;
    selectedColor: string;
  } | null = null,
): Promise<FrameLocator> => {
  console.log("createRoom", { params });
  const gotoCatann = async (page: Page): Promise<FrameLocator> => {
    await page.goto(
      `${APP_URL}catann#${params?.roomId}.${params?.username}.${params?.selectedColor}`,
      {
        waitUntil: "load",
      },
    );
    const iframe = page.locator('iframe[title="iframe"]');
    await expect(iframe).toBeVisible({ timeout: 1000 });
    return page.frameLocator('iframe[title="iframe"]');
  };
  const iframe = await gotoCatann(page);
  const startButton = getStartButton(iframe);
  await expect(startButton).toBeVisible({ timeout: 30_000 });
  return iframe;
};

export const isRealMessage = (msg: { trigger: string; data: any }) => {
  if (!msg) return false;
  const knownIgnores: (typeof msg)[] = [
    { trigger: "clientData", data: {} },
    {
      trigger: "clientData",
      data: {
        action: GeneralAction.ChangeOnlineStatus,
        payload: OnlineStatus.InGame,
      },
    },
    {
      trigger: "clientData",
      data: {
        action: GeneralAction.GetAllFriendsOnlineStatus,
        payload: {},
      },
    },
    {
      trigger: "clientData",
      data: {
        action: GeneralAction.GetAllRoomInvitesReceived,
        payload: {},
      },
    },
    {
      trigger: "clientData",
      data: {
        action: GeneralAction.GetNotifications,
        payload: { ["-1"]: msg.data.payload?.["-1"], date: undefined },
      },
    },
    {
      trigger: "clientData",
      data: {
        id: State.SocketMonitorUpdate.toString(),
        data: { timestamp: msg.data.data?.timestamp },
      },
    },
    {
      trigger: "serverData",
      data: {
        id: State.SocketMonitorUpdate.toString(),
        data: { timestamp: msg.data.data?.timestamp, sequence: undefined },
      },
    },
    {
      trigger: "serverData",
      data: {
        id: State.SocketMonitorUpdate.toString(),
        data: { timestamp: msg.data.data?.timestamp },
      },
    },
    {
      trigger: "serverData",
      data: {
        data: {
          payload: {
            diff: {
              currentState: {
                startTime:
                  msg.data.data?.payload?.diff?.currentState?.startTime,
              },
            },
          },
        },
      },
    },
    {
      trigger: "serverData",
      data: {
        id: State.GameStateUpdate.toString(),
        data: {
          // seems to be sent in a nondeterministic order
          type: GameStateUpdateType.PlayTurnSound,
          payload: [],
          sequence: msg.data.data?.sequence,
        },
      },
    },
    {
      trigger: "serverData",
      data: {
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.ExitInitialPlacement,
          payload: {},
          sequence: msg.data.data?.sequence,
        },
      },
    },
    {
      trigger: "clientData",
      data: {
        action: GameAction.RequestBeginnerHint,
        payload: false,
        sequence: msg.data?.sequence,
      },
    },
    {
      trigger: "serverData",
      data: {
        id: State.GameStateUpdate.toString(),
        data: {
          ...msg.data.data,
          type: GameStateUpdateType.BeginnerHintActivated,
        },
      },
    },
    {
      trigger: "serverData",
      data: {
        id: State.GameStateUpdate.toString(),
        data: {
          payload: {
            timeLeftInState: msg.data.data?.payload?.timeLeftInState,
            diff: {
              currentState: {
                startTime:
                  msg.data.data?.payload?.diff?.currentState?.startTime,
              },
            },
          },
          type: GameStateUpdateType.GameStateUpdated,
          sequence: msg.data.data?.sequence,
        },
      },
    },
  ];
  if (knownIgnores.some((x) => deepEqual(msg, x))) return false;
  //
  if (
    [
      GameStateUpdateType.PlayerReconnected,
      GameStateUpdateType.GameEndState,
    ].includes(msg.data.data?.type)
  )
    return true;
  return true;
};

export const spliceTestMessages = async (
  iframe: FrameLocator,
): Promise<{ trigger: string; data: any }[]> => {
  return (
    await iframe
      .locator("body")
      .evaluate(() => window.parent.__socketCatannMessages.splice(0))
  ).filter((msg) => isRealMessage(msg));
};

//

const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const SERVER_START_TIMEOUT_MS = 10_000;

test.use({ ignoreHTTPSErrors: true });
test.describe.configure({ timeout: 300_000 });

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

test.beforeAll(async ({ request }) => {
  void request;
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
