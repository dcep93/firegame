import {
  expect,
  test,
  type ElementHandle,
  type FrameLocator,
  type Page,
} from "@playwright/test";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";

const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const SERVER_START_TIMEOUT_MS = 60_000;
const PLAYWRIGHT_TIMEOUT_MS = SERVER_START_TIMEOUT_MS + 30_000;

test.use({ ignoreHTTPSErrors: true });
test.describe.configure({ timeout: PLAYWRIGHT_TIMEOUT_MS });

const placeStartingSettlement = async (iframe: FrameLocator) => {
  const canvasHandle = await getCanvasHandle(iframe);
  const canvasBox = await canvasHandle.boundingBox();
  if (!canvasBox) {
    throw new Error("Unable to determine canvas bounds.");
  }
  const canvas = iframe.locator("canvas#game-canvas");
  const settlementOffset = { x: 436, y: 297 };
  const roadOffset = { x: 462, y: 333 };
  if (
    settlementOffset.x > canvasBox.width ||
    settlementOffset.y > canvasBox.height ||
    roadOffset.x > canvasBox.width ||
    roadOffset.y > canvasBox.height
  ) {
    throw new Error("Click offsets are outside the canvas bounds.");
  }

  await canvas.click({
    position: settlementOffset,
    force: true,
    timeout: 5000,
  });
  const confirmButton = iframe.locator(".btn_general_check");
  await expect(confirmButton).toBeVisible({ timeout: 5000 });
  await confirmButton.click({ force: true, timeout: 5000 });

  await canvas.click({
    position: roadOffset,
    force: true,
    timeout: 5000,
  });
  await expect(confirmButton).toBeVisible({ timeout: 5000 });
  await confirmButton.click({ force: true, timeout: 5000 });
};

const openRecordingJson = (
  recordingPath: string,
): { trigger: string; data: number[] }[] => {
  const fullPath = path.resolve(__dirname, recordingPath);
  const data = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(data);
};

test("starting_settlement", async ({ page }, testInfo) => {
  try {
    await setupClientMessageCapture(page);
    const iframe = await gotoCatann(page);
    await revealAndStartGame(iframe);
    const realMessages = openRecordingJson("./starting_settlement.json");
    const filteredRealMessages = realMessages.filter((msg) =>
      isNotHeartbeat(msg),
    );
    await placeStartingSettlement(iframe);
    const getFilteredTestMessages = async () =>
      (await getCapturedMessages(page)).filter((msg) => isNotHeartbeat(msg));
    await expect
      .poll(async () => (await getFilteredTestMessages()).length, {
        timeout: 5000,
      })
      .toBe(filteredRealMessages.length);
    expect(await getFilteredTestMessages()).toEqual(filteredRealMessages);
  } finally {
    await page.screenshot({
      path: testInfo.outputPath("screenshot.png"),
      fullPage: true,
    });
  }
});

const gotoCatann = async (page: Page): Promise<FrameLocator> => {
  // page.on("console", (msg) => {
  //   console.log(`${msg.type()}: ${msg.text()}`);
  // });
  await page.goto(`${APP_URL}catann`, { waitUntil: "load" });
  const iframe = page.locator('iframe[title="iframe"]');
  await expect(iframe).toBeVisible({ timeout: 1000 });
  return page.frameLocator('iframe[title="iframe"]');
};

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
      const payload = event.data as { catann?: boolean; clientData?: unknown };
      if (!payload?.catann || !payload.clientData) return;
      const bytes = toBytes(payload.clientData);
      if (!bytes) return;
      globalWindow.__catannMessages?.push({ trigger: "socket.send", data: bytes });
    });
  });
};

const getCapturedMessages = async (page: Page) =>
  page.evaluate(
    () =>
      (
        window as typeof window & {
          __catannMessages?: { trigger: string; data: number[] }[];
        }
      ).__catannMessages ?? [],
  );

const revealAndStartGame = async (iframe: FrameLocator) => {
  const startButton = iframe.locator("#room_center_start_button");
  await expect(startButton).toBeVisible({ timeout: 15000 });
  await startButton.click({ force: true, timeout: 1000 });
};

const getCanvasHandle = async (
  iframe: FrameLocator,
): Promise<ElementHandle<HTMLCanvasElement>> => {
  const gameCanvas = iframe.locator("canvas#game-canvas");
  await expect(gameCanvas).toBeVisible({ timeout: 1000 });
  const canvasHandle =
    (await gameCanvas.elementHandle()) as ElementHandle<HTMLCanvasElement>;
  if (!canvasHandle) {
    throw new Error("Unable to locate game canvas.");
  }
  await waitForCanvasPaint(canvasHandle);
  return canvasHandle;
};

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
          // const ctx = htmlCanvas.getContext("2d");
          // if (ctx) {
          //   const width = htmlCanvas.width;
          //   const height = htmlCanvas.height;
          //   const stepX = Math.max(1, Math.floor(width / 10));
          //   const stepY = Math.max(1, Math.floor(height / 10));
          //   for (let x = 0; x < width; x += stepX) {
          //     for (let y = 0; y < height; y += stepY) {
          //       const data = ctx.getImageData(x, y, 1, 1).data;
          //       if (data[3] > 0) {
          //         return true;
          //       }
          //     }
          //   }
          //   return false;
          // }

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

test.beforeAll(async ({}, testInfo) => {
  testInfo.setTimeout(PLAYWRIGHT_TIMEOUT_MS);

  await waitForServer(APP_URL, SERVER_START_TIMEOUT_MS);
});

const isNotHeartbeat = (msg: { trigger: string; data: number[] } | null) => {
  if (!msg) return false;
  if (!Array.isArray(msg.data)) return false;
  return !(msg.data[0] === 4 && msg.data[1] === 8);
};
