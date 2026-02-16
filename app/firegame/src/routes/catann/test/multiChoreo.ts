import { Browser, BrowserContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { GameStateUpdateType } from "../app/gameLogic/CatannFilesEnums";
import autoChoreo from "./autoChoreo";
import { checkCanvasHandle, getStartButton } from "./canvasGeometry";
import Controller from "./Controller";
import { createRoom, delay, isRealMessage } from "./playwright_test.spec";

export const multiChoreo = (fileName: string) => {
  return async ({ browser }: { browser: Browser }, testInfo: any) => {
    const expectedMessages = await getExpectedMessages(fileName);
    const context: BrowserContext = await browser.newContext();

    const players = await Promise.all(
      expectedMessages.map(async (msgs) => {
        const page = await context.newPage();
        const iframe = await createRoom(page);
        const c = Controller(page, iframe, msgs);
        return {
          msgs,
          page,
          iframe,
          c,
        };
      }),
    );
    const helper = async () => {
      const startButton = getStartButton(players[0].iframe);
      await startButton.click({ force: true });

      for (let i = 0; i < players.length; i++) {
        await checkCanvasHandle(players[i].iframe);
      }
      for (let i = 0; i < players.length; i++) {
        await players[i].c.verifyTestMessages();
      }
      while (true) {
        const actors = players.filter(
          ({ msgs }) => msgs[0]?.trigger === "clientData",
        );
        if (actors.length === 0) break;
        expect(actors.length).toBe(1);
        autoChoreo(actors[0].c);
      }
      for (let i = 0; i < players.length; i++) {
        await expect(players[i].msgs.slice(0, 1)).toEqual([]);
      }
      for (let i = 0; i < players.length; i++) {
        await expect(
          players[i].page.locator('iframe[title="iframe"]'),
        ).toBeVisible();
      }
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
