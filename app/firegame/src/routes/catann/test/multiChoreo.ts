import { Browser, BrowserContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { GameStateUpdateType } from "../app/gameLogic/CatannFilesEnums";
import { checkCanvasHandle, getStartButton } from "./canvasGeometry";
import { createRoom, delay, isRealMessage } from "./playwright_test.spec";

export const multiChoreo = (fileName: string) => {
  return async ({ browser }: { browser: Browser }, testInfo: any) => {
    const expectedMessages = await getExpectedMessages(fileName);
    const context: BrowserContext = await browser.newContext();

    const players = await Promise.all(
      expectedMessages.map(async (msgs) => {
        const page = await context.newPage();
        const iframe = await createRoom(page);
        return {
          msgs,
          page,
          iframe,
        };
      }),
    );
    const helper = async () => {
      const startButton = getStartButton(players[0].iframe);
      await startButton.click({ force: true });

      await Promise.all(
        players.map(async ({ iframe }) => await checkCanvasHandle(iframe)),
      );
    };
    try {
      await helper();
    } finally {
      await delay(1000);
      await Promise.all(
        players.map(
          async ({ page }, index) =>
            await page.screenshot({
              path: testInfo.outputPath(`screenshot_${index}.png`),
              fullPage: true,
            }),
        ),
      );
      await delay(1000);
    }

    // everyone get a browser and enter the room
    // seed
    // host presses start
    // await c.verifyTestMessages(false);
    // while true
    // assert onePlayerCanAct()
    // player.act()
    // await c.verifyTestMessages();
    // expect(expectedMessages.slice(0, 1)).toEqual([]);
    // await expect(page.locator('iframe[title="iframe"]')).toBeVisible();
  };
};

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
  ): { trigger: string; data: any }[][] => {
    const fullPath = path.resolve(__dirname, recordingPath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data) as { trigger: string; data: any }[][];
  };
  const expectedMessages = openRecordingJson(recordingPath).map((playerMsgs) =>
    playerMsgs
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
      }),
  );
  return expectedMessages;
};
