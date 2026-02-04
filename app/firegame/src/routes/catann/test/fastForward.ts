import { expect, FrameLocator } from "@playwright/test";
import { ControllerType } from "./Controller";
import { spliceTestMessages } from "./playwright_test.spec";

export default async function fastForward(
  iframe: FrameLocator,
  _expectedMessages: { trigger: string; data: any }[] | undefined,
  c: ControllerType,
  clientDataSequence: number,
) {
  const cachedC = { ...c };
  Object.assign(
    c,
    Object.fromEntries(Object.keys(c).map((k) => [k, () => null])),
  );
  c.fastForward = async (choreoClientDataSequence: number) => {
    if (choreoClientDataSequence !== clientDataSequence) return;
    const testMessages = await spliceTestMessages(iframe);
    expect(testMessages).toEqual([]);

    const spliced = _expectedMessages!
      .splice(
        0,
        _expectedMessages!.findIndex(
          (msg) => msg.data.sequence >= clientDataSequence,
        ),
      )
      .filter(({ trigger }) => trigger === "serverData")
      .map(({ data }) => data);

    const aggregated = spliced.find(
      (msg) => msg.data.sequence && msg.data.payload.gameState,
    );
    spliced
      .filter((msg) => msg?.data?.payload?.diff && msg?.data?.sequence != null)
      .map((msg) => msg.data.payload.diff)
      .forEach((diff) => mergeDiff(aggregated.data.payload.gameState, diff));

    await iframe.locator("body").evaluate(
      (_, databaseGame) => {
        window.parent.__testOverrides = {
          databaseGame,
          session: null,
          startTime: -1,
          mapState: null,
        };
      },
      { aggregated },
    );
    Object.assign(c, cachedC);
    await c.clickStartButton();
    await spliceTestMessages(iframe);
  };
}

const mergeDiff = (
  target: Record<string, any>,
  source: Record<string, any>,
) => {
  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      target[key] = value;
      return;
    }
    if (value && typeof value === "object") {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      mergeDiff(target[key], value);
      return;
    }
    target[key] = value;
  });
};
