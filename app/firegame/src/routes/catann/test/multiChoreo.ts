import { expect } from "@playwright/test";

import { Browser, BrowserContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { GameStateUpdateType } from "../app/gameLogic/CatannFilesEnums";
import { colorHelper } from "../app/gameLogic/utils";
import { singleChoreo } from "./autoChoreo";
import { getStartButton } from "./canvasGeometry";
import Controller from "./Controller";
import {
  codex,
  createRoom,
  delay,
  isRealMessage,
  spliceTestMessages,
} from "./playwright_test.spec";

export const multiChoreo = (fileName: string) => {
  return async ({ browser }: { browser: Browser }, testInfo: any) => {
    const expectedMessages = await getExpectedMessages(fileName);
    const context: BrowserContext = await browser.newContext();

    const hostId = expectedMessages
      .map((msgs, i) => ({ msgs, i }))
      .find(({ msgs }) => msgs.find((msg) => msg.data.type === "startGame"))!.i;
    const payload = expectedMessages[hostId].find(
      (msg) => msg.data.data?.payload?.gameState,
    )!.data.data.payload;
    const roomId: string = payload.gameSettings.id;

    const players = await Promise.all(
      expectedMessages.map(async (msgs, i) => {
        const page = await context.newPage();
        page.on("pageerror", (msg) => console.log(i, msg));
        page.on("console", (msg) => {
          if (!msg.text().includes("test.log")) return;
          console.log(i, msg.text());
        });
        const payload = msgs.find(
          (msg) =>
            msg.trigger === "serverData" && msg.data.data.payload?.playerColor,
        )!.data.data.payload;
        const username = payload.playerUserStates.find(
          (s: any) => s.selectedColor === payload.playerColor,
        ).username;
        const iframe = await createRoom(page, {
          roomId,
          username,
          selectedColor: colorHelper.find(
            ({ int }) => int === payload.playerColor,
          )!.str,
        });
        const c = Controller(i, page, iframe, msgs);
        return {
          i,
          msgs,
          page,
          iframe,
          c,
        };
      }),
    );
    console.log("multiChoreo.initialized");
    const getActor = () => {
      const actors = players.filter(
        ({ msgs }) => msgs[0]?.trigger === "clientData",
      );
      if (actors.length === 0) return null;
      try {
        expect(actors.length).toBe(1);
      } catch (e) {
        console.log(actors.map((a) => a.msgs[0]));
        throw e;
      }
      return actors[0];
    };
    const startGame = async () => {
      const actor = players[hostId];
      console.log("start", { hostId });
      await actor.page.evaluate(
        (__testOverrides) => {
          window.__testOverrides = __testOverrides;
        },
        {
          databaseGame: actor.msgs.find(
            (msg) =>
              msg.trigger === "serverData" &&
              msg.data.data.payload?.databaseGameId,
          )!.data.data.payload,
          startTime: payload.gameState.currentState.startTime,
          sessions: actor.msgs
            .slice()
            .reverse()
            .find((msg) => msg.data.data?.sessions)!.data.data.sessions,
          mapState: payload.gameState.mapState,
          playOrder: actor.msgs.find(
            (msg) => msg.data.data?.payload?.playOrder,
          )!.data.data.payload.playOrder,
        },
      );
      for (let i = 0; i < players.length; i++) {
        const idx = players[i].msgs.findIndex(
          (msg) => msg.data.data?.sequence === 1,
        );
        players[i].msgs.splice(0, i === hostId ? idx - 1 : idx);
        await spliceTestMessages(players[i].iframe);
      }
      const startButton = getStartButton(actor.iframe);
      await startButton.click({ force: true });
      await delay(3000);
      for (let i = 0; i < players.length; i++) {
        await players[i].c.verifyTestMessages();
      }
    };
    const helper = async () => {
      await startGame();
      console.log("autoChoreo.start");
      for (let i = 0; true; i++) {
        const actor = getActor();
        if (!actor) break;
        console.log("actor", actor.i);
        await singleChoreo(actor.c);
        for (let i = 0; i < players.length; i++) {
          await players[i].c.verifyTestMessages(false);
        }
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
      console.log({ codex });
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
