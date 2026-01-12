import { GameType } from "./NewGame";
import { DemoDriver, GameScriptEntry } from "./gameScripts";

const seedRandom = (seed: number) => {
  let t = seed;
  return () => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const withSeed = async <T,>(
  seed: number,
  fn: () => Promise<T> | T
) => {
  const originalRandom = Math.random;
  Math.random = seedRandom(seed);
  try {
    return await fn();
  } finally {
    Math.random = originalRandom;
  }
};

export const hasScriptWinner = (game: GameType) => {
  const target = game.params.isDemo ? 3 : 10;
  return game.players.some((player) => player.victoryPoints >= target);
};

const isDisabled = (element: Element) =>
  element instanceof HTMLButtonElement
    ? element.disabled
    : element instanceof HTMLInputElement
    ? element.disabled
    : false;

const clickElement = (element: Element, selector: string) => {
  if (isDisabled(element)) {
    throw new Error(`Element disabled for selector: ${selector}`);
  }
  if (element instanceof HTMLElement) {
    element.click();
  } else {
    throw new Error(`Element is not clickable for selector: ${selector}`);
  }
};

export const createDomDemoDriver = (
  getGame: () => GameType
): DemoDriver & { getGame: () => GameType } => {
  return {
    clickSelector: (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Unable to find element: ${selector}`);
      }
      clickElement(element, selector);
    },
    clickFirstEnabled: (selector: string) => {
      const elements = Array.from(document.querySelectorAll(selector));
      const element = elements.find((el) => !isDisabled(el));
      if (!element) {
        throw new Error(`No enabled elements found for selector: ${selector}`);
      }
      clickElement(element, selector);
    },
    setCheckbox: (selector: string, checked: boolean) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLInputElement)) {
        throw new Error(`Expected checkbox input for selector: ${selector}`);
      }
      if (element.disabled) {
        throw new Error(`Checkbox disabled for selector: ${selector}`);
      }
      if (element.checked !== checked) {
        element.click();
      }
    },
    getGame,
  };
};

export const runGameScript = async (
  script: GameScriptEntry[],
  driver: DemoDriver,
  options?: {
    delayMs?: number;
    beforeEach?: () => void;
    afterEach?: () => void;
  }
) => {
  const delayMs = options?.delayMs ?? 0;
  for (const [seed, action] of script) {
    options?.beforeEach?.();
    await withSeed(seed, () => action(driver));
    options?.afterEach?.();
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

export const waitForElement = async (
  selector: string,
  timeoutMs = 10000,
  intervalMs = 200
) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (document.querySelector(selector)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Timed out waiting for element: ${selector}`);
};
