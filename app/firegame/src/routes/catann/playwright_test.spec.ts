import { expect, test } from "@playwright/test";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import http from "http";

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

test("load / and make sure the text CATANN is on the screen", async ({
  page,
}) => {
  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("CATANN", { exact: false })).toBeVisible();
});
