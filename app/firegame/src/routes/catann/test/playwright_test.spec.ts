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

test.skip(
  "clickable_map",
  screenshot(async ({ page }: { page: Page }) => {
    const settlementCoords = { col: 0, row: 5 };
    const destinationCoords = { col: 1, row: 4 };

    const iframe = await gotoCatann(page);
    await revealAndStartGame(iframe);

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

test(
  "starting_settlement",
  screenshot(async ({ page }: { page: Page }) => {
    const iframe = await gotoCatann(page);
    // not sure if we need to start game before setting expected messages
    const expectedMessages = await setExpectedMessages(
      page,
      "./starting_settlement.json",
    );

    // page.on("console", (msg) => {
    //   // throw new Error(`${msg.type()}: ${msg.text()}`);
    //   console.log(`${msg.type()}: ${msg.text()}`);
    // });
    await revealAndStartGame(iframe);
    await placeStartingSettlement(iframe);
    await expect
      .poll(async () => expectedMessages.length, {
        timeout: 1000,
      })
      .toBe(0);
  }),
);

//

const placeStartingSettlement = async (iframe: FrameLocator) => {
  const canvas = iframe.locator("canvas#game-canvas");

  const settlementOffset = getSettlementOffset({ col: 4, row: 2 });

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

  const destinationOffset = getSettlementOffset({ col: 5, row: 2 });
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

const gotoCatann = async (page: Page): Promise<FrameLocator> => {
  const setupClientMessageCapture = async (page: Page) => {
    await page.evaluate(() => {
      const globalWindow = window as typeof window & {
        __catannMessages?: { trigger: string; data: number[] }[];
      };
      globalWindow.__catannMessages = [];

      const toBytes = (clientData: unknown): number[] | null => {
        if (!clientData) return null;
        if (clientData instanceof ArrayBuffer) {
          return Array.from(new Uint8Array(clientData));
        }
        if (ArrayBuffer.isView(clientData)) {
          const view = clientData as ArrayBufferView;
          return Array.from(
            new Uint8Array(view.buffer, view.byteOffset, view.byteLength),
          );
        }
        if (typeof clientData === "object") {
          const record = clientData as Record<string, number>;
          const keys = Object.keys(record)
            .map((key) => Number(key))
            .filter((key) => Number.isFinite(key))
            .sort((a, b) => a - b);
          if (!keys.length) return null;
          return keys.map((key) => record[String(key)] ?? 0);
        }
        return null;
      };

      window.addEventListener("message", (event) => {
        const payload = event.data as {
          catann?: boolean;
          clientData?: unknown;
        };
        if (!payload?.catann || !payload.clientData) return;
        const bytes = toBytes(payload.clientData);
        if (!bytes) return;
        globalWindow.__catannMessages?.push({
          trigger: "socket.send",
          data: bytes,
        });
      });
    });
  };

  await setupClientMessageCapture(page);

  await page.goto(`${APP_URL}catann`, { waitUntil: "load" });
  const iframe = page.locator('iframe[title="iframe"]');
  await expect(iframe).toBeVisible({ timeout: 1000 });
  return page.frameLocator('iframe[title="iframe"]');
};

const revealAndStartGame = async (iframe: FrameLocator) => {
  const startButton = iframe.locator("#room_center_start_button");
  await expect(startButton).toBeVisible({ timeout: 30_000 });
  await startButton.click({ force: true });
};

const isNotHeartbeat = (msg: { trigger: string; data: number[] } | null) => {
  if (!msg) return false;
  if (!Array.isArray(msg.data)) return false;
  return !(msg.data[0] === 4 && msg.data[1] === 8);
};

const setExpectedMessages = async (page: Page, recordingPath: string) => {
  const openRecordingJson = (
    recordingPath: string,
  ): { trigger: string; data: number[] }[] => {
    const fullPath = path.resolve(__dirname, recordingPath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data) as { trigger: string; data: number[] }[];
  };
  const expectedMessages = openRecordingJson(recordingPath).filter((msg) =>
    isNotHeartbeat(msg),
  );
  page.evaluate(
    () => ((window as any).__catannExpectedMessages = expectedMessages),
  );
  return expectedMessages;
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
