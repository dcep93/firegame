import { ElementHandle, expect, FrameLocator, Locator } from "@playwright/test";
import { CornerDirection } from "../app/gameLogic/CatannFilesEnums";

const MAP_OFFSET = { x: 165, y: 11.5 };
const MAP_ZERO_ZERO = { x: 245 - MAP_OFFSET.x, y: 89 - MAP_OFFSET.y };
const MAP_HEX_SIDE_LENGTH = 59;
const MAP_CONFIRM_OFFSET = 53;
export const MAP_DICE_COORDS = { x: 717 - MAP_OFFSET.x, y: 551 - MAP_OFFSET.y };
export const MAP_PASS_COORDS = { x: 800 - MAP_OFFSET.x, y: 672 - MAP_OFFSET.y };

export const clickCanvas = async (
  canvas: Locator,
  position: { x: number; y: number },
  checkClickable = true,
) => {
  if (checkClickable)
    await expect
      .poll(() => canvasMapAppearsClickable(canvas, position), {
        timeout: 10000,
      })
      .toBe(true);

  await canvas.click({
    position,
    force: true,
  });
};

export const canvasMapAppearsClickable = async (
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
  await expect(gameCanvas).toBeVisible({ timeout: 10_000 });
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

export const canvasRollDice = async (
  canvas: Locator,
  diceState: [number, number] | null = null,
) => {
  if (diceState !== null)
    await canvas.evaluate((_, __testSeed) => {
      window.parent.__testSeed = __testSeed;
    }, diceState);

  await clickCanvas(canvas, MAP_DICE_COORDS);

  await expect
    .poll(() => canvasMapAppearsClickable(canvas, MAP_DICE_COORDS), {
      timeout: 5000,
    })
    .toBe(false);
};

export const getCanvas = (iframe: FrameLocator) =>
  iframe.locator("canvas#game-canvas");

export const getConfirmOffset = (baseOffset: { x: number; y: number }) => {
  return { x: baseOffset.x, y: baseOffset.y - MAP_CONFIRM_OFFSET };
};

export const getStartButton = (iframe: FrameLocator) => {
  return iframe.locator("#room_center_start_button");
};

export const getTilePosition = (tileIndex: number) => {
  const TILE_HEX_COORDS: Record<number, { x: number; y: number }> = {
    10: { x: 2, y: -2 },
    11: { x: 1, y: -2 },
    0: { x: 0, y: -2 },

    1: { x: -1, y: -1 },
    9: { x: 2, y: -1 },
    12: { x: 0, y: -1 },
    17: { x: 1, y: -1 },

    2: { x: -2, y: 0 },
    16: { x: 1, y: 0 },
    18: { x: 0, y: 0 },
    8: { x: 2, y: 0 },
    13: { x: -1, y: 0 },

    3: { x: -2, y: 1 },
    7: { x: 1, y: 1 },
    14: { x: -1, y: 1 },
    15: { x: 0, y: 1 },

    4: { x: -2, y: 2 },
    5: { x: -1, y: 2 },
    6: { x: 0, y: 2 },
  };

  const tileState = TILE_HEX_COORDS[tileIndex];
  const center = {
    col: 5 + 2 * (tileState.x + 0.5 * tileState.y),
    row: 5 + 2 * tileState.y,
  };
  return getSettlementOffset(center);
};

export const getColRow = ({
  x,
  y,
  z,
}: {
  x: number;
  y: number;
  z: CornerDirection;
}) => {
  const col = 5 + 2 * x + y;
  const row = (z === CornerDirection.North ? 4 : 7) + 2 * y;
  return { col, row };
};
