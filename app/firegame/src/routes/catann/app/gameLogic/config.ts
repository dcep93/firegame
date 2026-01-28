import { VERSION } from "../../../../shared/shared";
import store from "../../../../shared/store";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

type DiceRoll = {
  dice1: number;
  dice2: number;
};

type StartGameOverrides = {
  serverId: string;
  databaseGameId: string;
  gameSettingId: string;
  shouldResetGameClient: boolean;
  isReconnectingSession: boolean;
};

type RoomDataConfig = {
  roomId: string;
  private: boolean;
  playOrderSelectionActive: boolean;
  minimumKarma: number;
  gameMode: string;
  map: string;
  diceType: string;
  victoryPointsToWin: number;
  victoryPointsRecommendedLimit: number;
  victoryPointsMaxAllowed: number;
  cardDiscardLimit: number;
  maxPlayers: number;
  gameSpeed: string;
  botSpeed: string;
  hiddenBankCards: boolean;
  friendlyRobber: boolean;
  isTournament: boolean;
  isTestFreeExpansionsAndMaps: boolean;
  kickedUserIds: string[];
  creationPhase: string;
};

type SessionDataConfig = {
  roomSessionId: string;
  userSessionId: string;
  userId: string;
  isBot: boolean;
  isReadyToPlay: boolean;
  selectedColor: string;
  username: string;
  isMember: boolean;
  icon: number;
  profilePictureUrl: string | null;
  karmaCompletedGames: number;
  karmaTotalGames: number;
  availableColors: string[];
  botDifficulty: string | null;
};

type UserStateOverrides = {
  id: string;
  username: string;
  icon: number;
};

type GameSettingsOverrides = {
  mapSetting: number;
  diceSetting: number;
};

export type CatannConfig = {
  roomData: RoomDataConfig;
  sessionData: SessionDataConfig;
  userStateOverrides: UserStateOverrides;
  gameSettingsOverrides: GameSettingsOverrides;
  diceRoll: DiceRoll;
  mapState?: Record<string, any>;
  startGameOverrides: StartGameOverrides;
};

declare global {
  interface Window {
    __catannTestConfig?: DeepPartial<CatannConfig>;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const mergeCatannConfig = <T,>(base: T, overrides?: DeepPartial<T>): T => {
  if (!overrides) return base;
  if (Array.isArray(base)) {
    return (overrides ?? base) as T;
  }
  if (!isObject(base) || !isObject(overrides)) {
    return (overrides ?? base) as T;
  }
  const result: Record<string, unknown> = { ...base };
  Object.keys(overrides).forEach((key) => {
    const overrideValue = overrides[key as keyof T];
    if (overrideValue === undefined) return;
    const baseValue = (base as Record<string, unknown>)[key];
    if (isObject(baseValue) && isObject(overrideValue)) {
      result[key] = mergeCatannConfig(baseValue, overrideValue);
      return;
    }
    result[key] = overrideValue as unknown;
  });
  return result as T;
};

const getDefaultRoomId = () => {
  const roomId = store.me?.roomId ?? 0;
  return `roomIdx${roomId}`;
};

export const getDefaultCatannConfig = (): CatannConfig => {
  const storeUserId = store.me?.userId ?? "102003699";
  return {
    roomData: {
      roomId: getDefaultRoomId(),
      private: true,
      playOrderSelectionActive: false,
      minimumKarma: 0,
      gameMode: "classic4P",
      map: "classic4P",
      diceType: "balanced",
      victoryPointsToWin: 10,
      victoryPointsRecommendedLimit: 22,
      victoryPointsMaxAllowed: 20,
      cardDiscardLimit: 7,
      maxPlayers: 4,
      gameSpeed: "base120s",
      botSpeed: "normal",
      hiddenBankCards: false,
      friendlyRobber: true,
      isTournament: false,
      isTestFreeExpansionsAndMaps: false,
      kickedUserIds: [],
      creationPhase: "settings",
    },
    sessionData: {
      roomSessionId: "1141816",
      userSessionId: storeUserId,
      userId: storeUserId,
      isBot: false,
      isReadyToPlay: true,
      selectedColor: "red",
      username: storeUserId,
      isMember: false,
      icon: 12,
      profilePictureUrl: null,
      karmaCompletedGames: 0,
      karmaTotalGames: 0,
      availableColors: ["red", "blue", "orange", "green"],
      botDifficulty: null,
    },
    userStateOverrides: {
      id: "102003699",
      username: "Hedley#1901",
      icon: 12,
    },
    gameSettingsOverrides: {
      mapSetting: 0,
      diceSetting: 1,
    },
    diceRoll: {
      dice1: 5,
      dice2: 4,
    },
    mapState: undefined,
    startGameOverrides: {
      serverId: "08CC38",
      databaseGameId: getDefaultRoomId(),
      gameSettingId: getDefaultRoomId(),
      shouldResetGameClient: false,
      isReconnectingSession: false,
    },
  };
};

export const getCatannConfig = (): CatannConfig => {
  const defaults = getDefaultCatannConfig();
  if (typeof window === "undefined") return defaults;
  return mergeCatannConfig(defaults, window.__catannTestConfig);
};

let didInitialize = false;

export const initializeCatannConfig = () => {
  if (didInitialize) return;
  didInitialize = true;
  const config = getCatannConfig();
  if (!store.me) {
    // @ts-ignore readonly store
    store.me = {
      userId: config.sessionData.userId,
      roomId: 0,
      gameName: "catann",
      VERSION,
    };
    return;
  }
  if (store.me.userId !== config.sessionData.userId) {
    // @ts-ignore readonly store
    store.me = { ...store.me, userId: config.sessionData.userId };
  }
};

export type { DeepPartial, RoomDataConfig, SessionDataConfig, DiceRoll };
