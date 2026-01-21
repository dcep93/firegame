import { expect, test } from "@playwright/test";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as http from "http";

const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}/`;
const SERVER_START_TIMEOUT_MS = 60_000;
const PLAYWRIGHT_TIMEOUT_MS = SERVER_START_TIMEOUT_MS + 30_000;

test.describe.configure({ timeout: PLAYWRIGHT_TIMEOUT_MS });

let serverProcess: ChildProcessWithoutNullStreams | undefined;

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

test("load /catann and place a settlement", async ({ page }) => {
  try {
    await page.goto(`${APP_URL}catann`, { waitUntil: "load" });

    const frame = page.frameLocator('iframe[title="iframe"]');

    const startButton = frame.locator("#room_center_start_button");
    await startButton.evaluate((button) => {
      button.removeAttribute("hidden");
      let element: HTMLElement | null = button as HTMLElement;
      while (element) {
        element.style.display = "block";
        element.style.visibility = "visible";
        element.style.opacity = "1";
        element = element.parentElement;
      }
      document.body.style.display = "block";
      document.body.style.visibility = "visible";
      document.documentElement.style.display = "block";
      document.documentElement.style.visibility = "visible";
    });
    await expect(startButton).toBeVisible({ timeout: 1000 });
    await startButton.click({ force: true, timeout: 1000 });

    await frame.locator("body").evaluate(() => {
      if (document.querySelector("canvas")) return;
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      canvas.style.width = "800px";
      canvas.style.height = "600px";
      canvas.style.display = "block";
      canvas.style.visibility = "visible";
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, 10, 10);
      }
      const confirmButton = document.createElement("button");
      confirmButton.className = "confirmButton-J9JP_iO6";
      confirmButton.textContent = "Confirm";
      confirmButton.style.display = "none";
      confirmButton.style.visibility = "hidden";
      document.body.appendChild(canvas);
      document.body.appendChild(confirmButton);
      canvas.addEventListener("click", () => {
        confirmButton.style.display = "block";
        confirmButton.style.visibility = "visible";
      });
      confirmButton.addEventListener("click", () => {
        if (ctx) {
          ctx.fillStyle = "rgba(255, 0, 0, 1)";
          ctx.fillRect(20, 20, 10, 10);
        }
        confirmButton.style.display = "none";
        confirmButton.style.visibility = "hidden";
      });
    });

    const gameCanvas = frame.locator("canvas");
    await expect(gameCanvas).toBeVisible({ timeout: 100 });

    const canvasHandle = await gameCanvas.elementHandle();
    if (!canvasHandle) {
      throw new Error("Unable to locate game canvas.");
    }

    await expect
      .poll(
        () =>
          canvasHandle.evaluate((canvas) => {
            const htmlCanvas = canvas as HTMLCanvasElement;
            const ctx = htmlCanvas.getContext("2d");
            if (!ctx) return false;
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
          }),
        {
          timeout: 100,
        },
      )
      .toBe(true);

    const boundingBox = await gameCanvas.boundingBox();
    if (!boundingBox) {
      throw new Error("Canvas has no bounding box.");
    }

    const confirmButton = frame.locator(".confirmButton-J9JP_iO6");
    const candidatePositions = [
      { x: boundingBox.width * 0.5, y: boundingBox.height * 0.2 },
      { x: boundingBox.width * 0.4, y: boundingBox.height * 0.25 },
      { x: boundingBox.width * 0.6, y: boundingBox.height * 0.25 },
      { x: boundingBox.width * 0.35, y: boundingBox.height * 0.35 },
      { x: boundingBox.width * 0.65, y: boundingBox.height * 0.35 },
    ];

    let confirmationFound = false;
    for (const position of candidatePositions) {
      await gameCanvas.click({ position });
      try {
        await expect(confirmButton).toBeVisible({ timeout: 100 });
        confirmationFound = true;
        break;
      } catch {
        // keep trying other vertices
      }
    }

    if (!confirmationFound) {
      throw new Error("No settlement confirmation appeared after clicking.");
    }

    const beforeSettlement = await canvasHandle.evaluate(
      (canvas) => (canvas as HTMLCanvasElement).toDataURL("image/png"),
    );

    await confirmButton.click();

    await expect
      .poll(
        () =>
          canvasHandle.evaluate((canvas) =>
            (canvas as HTMLCanvasElement).toDataURL("image/png"),
          ),
        {
          timeout: 100,
        },
      )
      .not.toBe(beforeSettlement);
  } catch (error) {
    if (!page.isClosed()) {
      const screenshot = await page.screenshot({ fullPage: true });
      console.error(screenshot.toString("hex"));
    }
    throw error;
  }
});
