import {
  expect,
  test,
  type ElementHandle,
  type FrameLocator,
  type Page,
} from "@playwright/test";
import * as http from "http";

const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const SERVER_START_TIMEOUT_MS = 60_000;
const PLAYWRIGHT_TIMEOUT_MS = SERVER_START_TIMEOUT_MS + 30_000;

test.use({ ignoreHTTPSErrors: true });
test.describe.configure({ timeout: PLAYWRIGHT_TIMEOUT_MS });

const starting_settlement = async (iframe: FrameLocator) => {
  // await revealAndStartGame(iframe);
  // const canvasHandle = await getCanvasHandle(iframe);
  // const vertex = await clickMap(canvasHandle);
  // await assertSettlementPlaced(canvasHandle, vertex);
  // await assertNotClickable(vertex);
  // const edge = await clickMap(canvasHandle);
  // await assertRoadPlaced(canvasHandle, edge);
  // await assertNotClickable(edge);
};

test("starting_settlement", async ({ page }, testInfo) => {
  try {
    await gotoCatann(page);
    // const realMessages = open("./starting_settlement.json");
    // const filteredRealMessages = realMessages.filter((msg) =>
    //   isNotHeartbeat(msg),
    // );
    // const iframe = await gotoCatann(page);
    // const testMessages = [];
    // page.on("console", (msg) => testMessages.push(msg.text()));
    // await starting_settlement(iframe);
    // const filteredAndMappedTestMessages = testMessages
    //   .map((msg) => tryParseJSON(msg))
    //   .filter((msg) => msg && isNotHeartbeat(msg));
    // expect(filteredAndMappedTestMessages).toEqual(filteredRealMessages);
  } finally {
    await page.screenshot({
      path: testInfo.outputPath("screenshot.png"),
      fullPage: true,
    });
  }
});

const gotoCatann = async (page: Page): Promise<FrameLocator> => {
  await page.goto(`${APP_URL}catann`, { waitUntil: "load" });
  const iframe = page.locator('iframe[title="iframe"]');
  await expect(iframe).toBeVisible({ timeout: 1000 });
  return page.frameLocator('iframe[title="iframe"]');
};

const revealAndStartGame = async (iframe: FrameLocator) => {
  const startButton = iframe.locator("#room_center_start_button");
  await expect(startButton).toBeVisible({ timeout: 10000 });
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
          const ctx = htmlCanvas.getContext("2d");
          if (ctx) {
            const width = htmlCanvas.width;
            const height = htmlCanvas.height;
            const stepX = Math.max(1, Math.floor(width / 10));
            const stepY = Math.max(1, Math.floor(height / 10));
            for (let x = 0; x < width; x += stepX) {
              for (let y = 0; y < height; y += stepY) {
                const data = ctx.getImageData(x, y, 1, 1).data;
                if (data[3] > 0) {
                  return true;
                }
              }
            }
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
