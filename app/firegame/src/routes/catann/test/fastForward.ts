import { FrameLocator } from "@playwright/test";
import { ControllerType } from "./Controller";
import { spliceTestMessages } from "./playwright_test.spec";

export default async function fastForward(
  iframe: FrameLocator,
  _expectedMessages: { trigger: string; data: any }[] | undefined,
  clientDataSequence: number,
  c: ControllerType,
) {
  const testMessages = await spliceTestMessages(iframe);
  expect(testMessages.slice(0, 1)).toEqual([]);

  const spliced = _expectedMessages!
    .splice(
      0,
      _expectedMessages!.findIndex(
        (msg) => msg.data.sequence === clientDataSequence,
      ),
    )
    .filter(({ trigger }) => trigger === "serverData")
    .map(({ data }) => data);

  const aggregated = spliced.find(
    (msg) => msg.data.sequence && !msg.data.payload.diff,
  );
  spliced
    .filter((msg) => msg?.data?.payload?.diff && msg?.data?.sequence != null)
    .forEach((msg) => mergeDiff(aggregated, msg.data.payload.diff));

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

  const cachedC = { ...c };
  const fakeC = new Proxy(
    {},
    {
      get:
        (_, p) =>
        (...a: any[]) =>
          0,
    },
  ) as ControllerType;
  Object.assign(c, fakeC);
  return () => Object.assign(c, cachedC);
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
