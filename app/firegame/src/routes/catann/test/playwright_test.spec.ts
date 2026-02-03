// TODO
// finish single_player
// explicitly place robber
// timeLeftInState
// no magic numbers
// redo single_player
// read everything
// audit skills
// 2 player setup, first turns
// 4 player setup, first turns
// audit skills
// 2 player game
// audit skills
// skill find bugs
// expansions

import { expect, test, type FrameLocator, type Page } from "@playwright/test";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import {
  GAME_ACTION,
  GameStateUpdateType,
  State,
} from "../app/gameLogic/CatannFilesEnums";
import { singlePlayerChoreo, startingSettlementChoreo } from "./choreo";
import Controller, {
  _mapAppearsClickable,
  _rollDice,
  checkCanvasHandle,
  ControllerType,
  getCanvas,
  getSettlementOffset,
  getStartButton,
} from "./Controller";
import fastForward from "./fastForward";

export const codex: Record<string, number> = {};

const screenshot = (f: ({ page }: { page: Page }) => void) => {
  return async ({ page }: { page: Page }, testInfo: any) => {
    try {
      await f({ page });
    } finally {
      await _delay(5000);
      console.log({ codex });
      await page.screenshot({
        path: testInfo.outputPath("screenshot.png"),
        fullPage: true,
      });
    }
  };
};

test.skip(
  "clickable_map",
  screenshot(async ({ page }: { page: Page }) => {
    const settlementCoords = { col: 0, row: 5 };
    const destinationCoords = { col: 1, row: 4 };

    const iframe = await createRoom(page);
    const startButton = getStartButton(iframe);
    await startButton.click({ force: true });

    await checkCanvasHandle(iframe);

    const c = Controller(page, iframe, undefined);
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
                async () => await _mapAppearsClickable(canvas, vertexOffset),
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

    await c.playStartingSettlement(settlementCoords);
    await c.playStartingRoad(settlementCoords, destinationCoords);

    // the road appears clickable, because it has a mouse over
    // "Road Length: 1"
    await checkClickable((offset) => offset.col !== 0);

    await c.playStartingSettlement({
      row: settlementCoords.row,
      col: settlementCoords.col + 2,
    });
    await c.playStartingRoad(
      { row: settlementCoords.row, col: settlementCoords.col + 2 },
      { row: destinationCoords.row, col: destinationCoords.col + 2 },
    );

    await _rollDice(canvas);
  }),
);

const choreo = (
  fileName: string,
  f: (c: ControllerType) => Promise<void>,
  clientDataSequence: number = -1,
) => {
  return async ({ page }: { page: Page }) => {
    const getExpectedMessages = async (recordingPath: string) => {
      const openRecordingJson = (
        recordingPath: string,
      ): { trigger: string; data: any }[] => {
        const fullPath = path.resolve(__dirname, recordingPath);
        const data = fs.readFileSync(fullPath, "utf8");
        return JSON.parse(data) as { trigger: string; data: any }[];
      };
      const expectedMessages = openRecordingJson(recordingPath).filter((msg) =>
        isRealMessage(msg),
      );
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
    const c = Controller(page, iframe, expectedMessages);
    if (clientDataSequence !== -1) {
      await fastForward(iframe, expectedMessages, c, clientDataSequence);
    }
    await c.clickStartButton();
    await c.verifyTestMessages();
    await f(c);
    expect(expectedMessages.slice(0, 1)).toEqual([]);
    await expect(page.locator('iframe[title="iframe"]')).toBeVisible();
  };
};

//

test.skip(
  "starting_settlement",
  screenshot(choreo("./starting_settlement.json", startingSettlementChoreo)),
);

test(
  "single_player",
  screenshot(choreo("./single_player.json", singlePlayerChoreo, 126)),
);

//

//

const createRoom = async (
  page: Page,
  roomId: string = "",
): Promise<FrameLocator> => {
  const gotoCatann = async (page: Page): Promise<FrameLocator> => {
    // page.on("console", (msg) => console.log("test.debug", msg.text()));
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

const isRealMessage = (msg: { trigger: string; data: any }) => {
  if (!msg) return false;
  if (msg.data.id === State.SocketMonitorUpdate.toString()) return false;
  if (msg.data.id === GameStateUpdateType.FirstGameState) return false;
  if (msg.data.data?.type === GameStateUpdateType.PlayerReconnected)
    return false;
  if (
    msg.trigger === "clientData" &&
    msg.data.action === GAME_ACTION.SelectedCards &&
    msg.data.payload &&
    typeof msg.data.payload === "object" &&
    !Array.isArray(msg.data.payload) &&
    msg.data.payload["-1"] !== undefined
  )
    return false;
  // isLoggedIn: false, TODO audit
  if (
    msg.trigger === "clientData" &&
    msg.data.action === GAME_ACTION.ClickedDice &&
    msg.data.payload === 3
  )
    return false;
  if (
    msg.trigger === "clientData" &&
    [
      GAME_ACTION.SelectedTile,
      GAME_ACTION.ConfirmBuildSettlement,
      GAME_ACTION.RequestBeginnerHint,
      GAME_ACTION.SelectedInitialPlacementIndex,
    ].includes(msg.data.action)
  )
    return false;
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

export const _delay = (ms: number) =>
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
        await _delay(500);
      }
    }

    throw new Error(`Timed out waiting for ${url}`);
  };

  await waitForServer(APP_URL, SERVER_START_TIMEOUT_MS);
});
