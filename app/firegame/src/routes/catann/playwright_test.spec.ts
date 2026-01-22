import {
  expect,
  test,
  type ElementHandle,
  type FrameLocator,
  type Page,
} from "@playwright/test";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as http from "http";

const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const SERVER_START_TIMEOUT_MS = 60_000;
const PLAYWRIGHT_TIMEOUT_MS = SERVER_START_TIMEOUT_MS + 30_000;

test.describe.configure({ timeout: PLAYWRIGHT_TIMEOUT_MS });

let serverProcess: ChildProcessWithoutNullStreams | undefined;

const main = async (frame: FrameLocator) => {
  await revealAndStartGame(frame);

  const canvasHandle = await getCanvasHandle(frame);
};

test("load /catann and place a settlement", async ({ page }, testInfo) => {
  const consoleEntries: {
    type: string;
    text: string;
    location: { url: string; lineNumber: number; columnNumber: number };
  }[] = [];
  const pageErrors: { message: string; stack?: string }[] = [];
  let iframeUrl: string | null = null;

  page.on("console", (msg) => {
    consoleEntries.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });
  page.on("pageerror", (error) => {
    pageErrors.push({ message: error.message, stack: error.stack });
  });

  try {
    const { frame, resolvedIframeUrl } = await gotoCatann(page);
    iframeUrl = resolvedIframeUrl;
    await main(frame);
  } finally {
    await page.screenshot({
      path: testInfo.outputPath("screenshot.png"),
      fullPage: true,
    });
    printIframeDiagnostics(iframeUrl, consoleEntries, pageErrors);
  }
});

const gotoCatann = async (
  page: Page,
): Promise<{ frame: FrameLocator; resolvedIframeUrl: string | null }> => {
  await page.goto(`${APP_URL}catann`, { waitUntil: "load" });
  const iframe = page.locator('iframe[title="iframe"]');
  await expect(iframe).toBeVisible({ timeout: 1000 });
  const iframeHandle = await iframe.elementHandle();
  const iframeSrc = await iframeHandle?.getAttribute("src");
  const resolvedIframeUrl = iframeSrc
    ? new URL(iframeSrc, page.url()).toString()
    : null;
  return {
    frame: page.frameLocator('iframe[title="iframe"]'),
    resolvedIframeUrl,
  };
};

const revealAndStartGame = async (frame: FrameLocator) => {
  const startButton = frame.locator("#room_center_start_button");
  await expect(startButton).toBeVisible({ timeout: 5000 });
  await startButton.click({ force: true, timeout: 1000 });
};

const getCanvasHandle = async (
  frame: FrameLocator,
): Promise<ElementHandle<HTMLCanvasElement>> => {
  const gameCanvas = frame.locator("canvas#game-canvas");
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

const printIframeDiagnostics = (
  iframeUrl: string | null,
  consoleEntries: {
    type: string;
    text: string;
    location: { url: string; lineNumber: number; columnNumber: number };
  }[],
  pageErrors: { message: string; stack?: string }[],
) => {
  const normalize = (url: string) => {
    try {
      return new URL(url, APP_URL).toString();
    } catch {
      return url;
    }
  };
  const matchesIframeUrl = (url: string) => {
    if (!iframeUrl) return true;
    return normalize(url) === iframeUrl;
  };
  const iframeConsole = consoleEntries.filter((entry) =>
    matchesIframeUrl(entry.location.url),
  );
  const iframeErrors = pageErrors;

  if (iframeConsole.length === 0 && iframeErrors.length === 0) {
    console.log("Iframe diagnostics: no console entries or errors captured.");
    return;
  }

  console.log("Iframe diagnostics:");
  if (iframeConsole.length) {
    console.log("Console:");
    for (const entry of iframeConsole) {
      const { url, lineNumber, columnNumber } = entry.location;
      const location = url ? `${url}:${lineNumber}:${columnNumber}` : "unknown";
      console.log(`[${entry.type}] ${entry.text} (${location})`);
    }
  }
  if (iframeErrors.length) {
    console.log("Errors:");
    for (const error of iframeErrors) {
      console.log(error.message);
      if (error.stack) {
        console.log(error.stack);
      }
    }
  }
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
  serverProcess = spawn("npm", ["start"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      BROWSER: "none",
      HOST: "0.0.0.0",
      PORT: `${APP_PORT}`,
      CI: "true",
    },
    stdio: "pipe",
  });

  await waitForServer(APP_URL, SERVER_START_TIMEOUT_MS);
});

test.afterAll(() => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill("SIGTERM");
  }
});
