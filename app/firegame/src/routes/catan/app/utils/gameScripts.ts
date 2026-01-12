export type DemoDriver = {
  clickSelector: (selector: string) => void;
  clickFirstEnabled: (selector: string) => void;
  setCheckbox: (selector: string, checked: boolean) => void;
};

export type DemoAction = (driver: DemoDriver) => void | Promise<void>;

export type GameScriptEntry = [number, DemoAction];

const clickVertex: DemoAction = (driver) =>
  driver.clickFirstEnabled('button[data-demo="vertex"]');

const clickEdge: DemoAction = (driver) =>
  driver.clickFirstEnabled('button[data-demo="edge"]');

const confirmPlacement: DemoAction = (driver) =>
  driver.clickSelector('button[data-demo="confirm"]');

const rollDice: DemoAction = (driver) =>
  driver.clickSelector('button[data-demo="roll-dice"]');

const demoScript: GameScriptEntry[] = [
  [101, clickVertex],
  [102, confirmPlacement],
  [103, clickEdge],
  [104, confirmPlacement],
  [105, clickVertex],
  [106, confirmPlacement],
  [107, clickEdge],
  [108, confirmPlacement],
  [109, clickVertex],
  [110, confirmPlacement],
  [111, clickEdge],
  [112, confirmPlacement],
  [113, clickVertex],
  [114, confirmPlacement],
  [115, clickEdge],
  [116, confirmPlacement],
  [1, rollDice],
  [118, clickVertex],
  [119, confirmPlacement],
];

export const baseGameScript = [...demoScript];
export const citiesAndKnightsScript = [...demoScript];
