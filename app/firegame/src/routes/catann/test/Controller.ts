import {
  ElementHandle,
  expect,
  FrameLocator,
  Locator,
  test,
} from "@playwright/test";
import { _delay, codex, spliceTestMessages } from "./playwright_test.spec";

const MAP_OFFSET = { x: 165, y: 11.5 };
const MAP_ZERO_ZERO = { x: 245 - MAP_OFFSET.x, y: 89 - MAP_OFFSET.y };
const MAP_DICE_COORDS = { x: 717 - MAP_OFFSET.x, y: 551 - MAP_OFFSET.y };
const MAP_PASS_COORDS = { x: 800 - MAP_OFFSET.x, y: 672 - MAP_OFFSET.y };
const MAP_HEX_SIDE_LENGTH = 59;
const MAP_CONFIRM_OFFSET = 53;

export type ControllerType = ReturnType<typeof Controller>;
const Controller = (
  iframe: FrameLocator,
  _expectedMessages: { trigger: string; data: any }[] | undefined,
) =>
  ((canvas) => ({
    delay: async (durationMs: number) => _delay(durationMs),
    playSettlement: async (settlementCoords: { col: number; row: number }) => {
      const settlementOffset = getSettlementOffset(settlementCoords);
      await clickCanvas(canvas, settlementOffset);

      const confirmSettlementOffset = getConfirmOffset(settlementOffset);
      await clickCanvas(canvas, confirmSettlementOffset);
    },
    playRoad: async (
      settlementCoords: { col: number; row: number },
      destinationCoords: { col: number; row: number },
    ) => {
      const settlementOffset = getSettlementOffset(settlementCoords);
      const destinationOffset = getSettlementOffset(destinationCoords);
      const roadOffset = {
        x: (settlementOffset.x + destinationOffset.x) / 2,
        y: (settlementOffset.y + destinationOffset.y) / 2,
      };
      await clickCanvas(canvas, roadOffset);

      const confirmRoadOffset = getConfirmOffset(roadOffset);
      await clickCanvas(canvas, confirmRoadOffset);
    },
    playRoadWithoutCheck: async (
      settlementCoords: { col: number; row: number },
      destinationCoords: { col: number; row: number },
    ) => {
      const settlementOffset = getSettlementOffset(settlementCoords);
      const destinationOffset = getSettlementOffset(destinationCoords);
      const roadOffset = {
        x: (settlementOffset.x + destinationOffset.x) / 2,
        y: (settlementOffset.y + destinationOffset.y) / 2,
      };
      await clickCanvasWithoutCheck(canvas, roadOffset);

      const confirmRoadOffset = getConfirmOffset(roadOffset);
      await clickCanvasWithoutCheck(canvas, confirmRoadOffset);
    },
    wantToBuildRoad: async () => {
      const roadButton = iframe.locator(
        'div[class*="actionButton"] img[src*="road_"]',
      );
      await roadButton.first().click({ force: true });
    },
    verifyTestMessages: async () => {
      const expectedMessages = _expectedMessages!;
      const testMessages = await spliceTestMessages(iframe);
      console.log(
        "verifyTestMessages",
        testMessages.length,
        expectedMessages.length,
      );
      testMessages.forEach((msg) => {
        const expectedMsg = expectedMessages.shift()!;
        if (expectedMsg?.trigger === "debug") {
          test.skip();
        }
        try {
          expect(expectedMsg).toBeDefined();
          expect(msg.trigger).toEqual(expectedMsg.trigger);
        } catch (e) {
          console.log(JSON.stringify({ msg, expectedMsg }, null, 2));
          throw e;
        }
        if (msg.trigger === "clientData") {
          if (expectedMsg.data.sequence) {
            msg.data.sequence = expectedMsg.data.sequence;
            codex[msg.trigger] = msg.data.sequence;
          }
        } else {
          msg.data.data.sequence = expectedMsg.data.data.sequence;
          codex[msg.trigger] = msg.data.data.sequence;
          const msgStartTime =
            msg.data.data.payload?.diff?.currentState?.startTime;
          const expectedStartTime =
            expectedMsg.data.data.payload?.diff?.currentState?.startTime;
          if (msgStartTime == null || expectedStartTime == null) {
            if (msg.data.data.payload?.diff?.currentState) {
              delete msg.data.data.payload.diff.currentState.startTime;
            }
            if (expectedMsg.data.data.payload?.diff?.currentState) {
              delete expectedMsg.data.data.payload.diff.currentState.startTime;
            }
          } else {
            msg.data.data.payload.diff.currentState.startTime =
              expectedStartTime;
          }
        }
        expect(msg).toEqual(expectedMsg);
        console.log(msg);
      });
    },
    mapAppearsClickable: async (offset: { x: number; y: number }) =>
      await _mapAppearsClickable(canvas, offset),
    rollNextDice: async () => {
      const diceStateLog = (
        Object.values(
          _expectedMessages!.find(
            (msg) => msg.data.data?.payload?.diff?.diceState?.diceThrown,
          )!.data.data.payload.diff.gameLogState,
        ).find((log: any) => log.text.firstDice) as any
      ).text;
      await _rollDice(canvas, [
        diceStateLog.firstDice,
        diceStateLog.secondDice,
      ]);
    },
    passTurn: async () => await _passTurn(canvas),
    handleReconnect: async () => {},
  }))(getCanvas(iframe));

export default Controller;

export const clickCanvas = async (
  canvas: Locator,
  position: { x: number; y: number },
) => {
  await expect
    .poll(() => _mapAppearsClickable(canvas, position), {
      timeout: 5000,
    })
    .toBe(true);

  await canvas.click({
    position,
    force: true,
  });
};

export const clickCanvasWithoutCheck = async (
  canvas: Locator,
  position: { x: number; y: number },
) => {
  await canvas.click({
    position,
    force: true,
  });
};

export const _mapAppearsClickable = async (
  canvas: Locator,
  offset: { x: number; y: number },
) => {
  await canvas
    .page()
    .mouse.move(offset.x + MAP_OFFSET.x, offset.y + MAP_OFFSET.y);
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

export const checkCanvasHandle = async (iframe: FrameLocator) => {
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
  expect(canvasBox).toEqual({
    ...MAP_OFFSET,
    width: 1280 - 2 * MAP_OFFSET.x,
    height: 720 - 2 * MAP_OFFSET.y,
  });
};

export const getSettlementOffset = (position: { col: number; row: number }) => {
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

export const _rollDice = async (
  canvas: Locator,
  diceState: [number, number] | null = null,
) => {
  if (diceState !== null)
    await canvas.evaluate((_, diceState) => {
      window.parent.__diceState = diceState;
    }, diceState);

  await clickCanvas(canvas, MAP_DICE_COORDS);

  await expect
    .poll(() => _mapAppearsClickable(canvas, MAP_DICE_COORDS), {
      timeout: 5000,
    })
    .toBe(false);
};

const _passTurn = async (canvas: Locator) => {
  await clickCanvas(canvas, MAP_PASS_COORDS);
};

export const getCanvas = (iframe: FrameLocator) =>
  iframe.locator("canvas#game-canvas");

const getConfirmOffset = (baseOffset: { x: number; y: number }) => {
  return { x: baseOffset.x, y: baseOffset.y - MAP_CONFIRM_OFFSET };
};
