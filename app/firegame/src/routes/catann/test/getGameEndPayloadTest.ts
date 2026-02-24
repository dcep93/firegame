import fs from "fs";
import path from "path";
import { firebaseData } from "../app/FirebaseWrapper";
import getGameEndPayload from "../app/gameLogic/getGameEndPayload";

type RawMessage = {
  trigger?: string;
  data?: {
    id?: string;
    data?: {
      type?: number;
      payload?: ServerPayload;
      sequence?: number;
    };
  };
};

type RawRecording = RawMessage[] | RawMessage[][];

type ServerPayload = {
  [key: string]: unknown;
  playerColor?: number;
  gameState?: {
    [key: string]: unknown;
    currentState?: {
      [key: string]: unknown;
      startTime?: number;
    };
  };
  diff?: Record<string, unknown>;
  endGameState?: {
    [key: string]: unknown;
    players?: Record<string, unknown>;
    gameDurationInMS?: number;
  };
  rankedUserStates?: {
    color?: number;
    [key: string]: unknown;
  }[];
  isReplayAvailable?: boolean;
};

const isMessage = (value: unknown): value is RawMessage =>
  Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "trigger" in value,
  );

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const mergeDiff = (
  target: Record<string, any>,
  source: Record<string, any>,
) => {
  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      target[key] = value;
      return;
    }
    if (value !== null && typeof value === "object") {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      mergeDiff(target[key], value as Record<string, any>);
      return;
    }
    target[key] = value;
  });
};

const sortArraysThatAreNumberLists = (value: unknown): void => {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => sortArraysThatAreNumberLists(entry));
    return;
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    const shouldSort =
      [
        "cards",
        "cardsToBroadcast",
        "resourceCardsStats",
        "validCardsToSelect",
      ].includes(key) &&
      Array.isArray(nestedValue) &&
      nestedValue.every((entry) => typeof entry === "number");

    if (shouldSort) {
      nestedValue.sort((a, b) => a - b);
      return;
    }

    sortArraysThatAreNumberLists(nestedValue);
  });
};

const getStreams = (recording: RawRecording): RawMessage[][] => {
  if (recording.length === 0) return [];
  if (Array.isArray(recording[0])) {
    const firstElement = (recording as RawMessage[][])[0];
    if (isMessage(firstElement?.[0])) {
      return recording as RawMessage[][];
    }
    return [];
  }
  return [recording as RawMessage[]];
};

const resolveExpectedPlayerColor = (
  endPayload: ServerPayload,
): number | undefined => {
  const players = endPayload?.endGameState?.players;
  const rankedUsers = endPayload?.rankedUserStates;
  if (!players || typeof players !== "object" || !Array.isArray(rankedUsers)) {
    return undefined;
  }

  const allPlayers = Object.keys(players).map((value) => Number(value));
  const ranked = new Set(rankedUsers.map((entry) => entry?.color));
  const remaining = allPlayers.find((color) => !ranked.has(color));
  return Number.isFinite(remaining) ? remaining : undefined;
};

const findEndPayload = (stream: RawMessage[]): ServerPayload => {
  const endGameMessage = stream.find(
    (msg) =>
      msg.trigger === "serverData" &&
      msg.data?.data?.type === 45 &&
      msg.data.data.payload &&
      Object.prototype.hasOwnProperty.call(
        msg.data.data.payload,
        "endGameState",
      ),
  );
  if (!endGameMessage?.data?.data?.payload) {
    throw new Error("No endGameState payload found in recording stream");
  }
  return endGameMessage.data.data.payload as ServerPayload;
};

const buildAggregatedPayload = (stream: RawMessage[]): ServerPayload => {
  const startMessage = stream.find(
    (msg) => msg.trigger === "serverData" && msg.data?.data?.payload?.gameState,
  );
  if (!startMessage?.data?.data?.payload) {
    throw new Error(
      "No message with payload.gameState found in recording stream",
    );
  }

  const payload = clone(startMessage.data.data.payload) as ServerPayload;
  for (const msg of stream) {
    const diff = msg.data?.data?.payload?.diff;
    if (diff && typeof diff === "object") {
      mergeDiff(payload as Record<string, any>, diff as Record<string, any>);
    }
  }
  return payload;
};

const getGameEndPayloadTest = (arg: string) => {
  return () => {
    const recordingPath = path.resolve(__dirname, arg);
    const recording = JSON.parse(
      fs.readFileSync(recordingPath, "utf8"),
    ) as RawRecording;

    const streams = getStreams(recording);
    if (streams.length === 0) {
      throw new Error("Unable to parse recording structure");
    }

    const previousState = {
      game: clone(firebaseData.GAME),
      meta: clone((firebaseData as any).__meta),
    };

    try {
      streams.forEach((stream, streamIndex) => {
        const expectedFromJson = findEndPayload(stream);
        const expectedPayload = clone(expectedFromJson) as ServerPayload;
        sortArraysThatAreNumberLists(expectedPayload);

        const gamePayload = buildAggregatedPayload(stream);
        const expectedColor = resolveExpectedPlayerColor(expectedPayload);
        if (expectedColor !== undefined) {
          (gamePayload as Record<string, any>).playerColor = expectedColor;
        }
        sortArraysThatAreNumberLists(gamePayload);

        firebaseData.GAME = { data: { payload: gamePayload } } as any;
        const gameState = gamePayload.gameState;
        const startTime = gameState?.currentState?.startTime;
        const gameDurationInMS = expectedPayload.endGameState?.gameDurationInMS;
        if (
          typeof startTime === "number" &&
          typeof gameDurationInMS === "number"
        ) {
          (firebaseData as any).__meta = {
            now: startTime + gameDurationInMS,
          };
        } else {
          (firebaseData as any).__meta = {};
        }

        const actual = getGameEndPayload();
        sortArraysThatAreNumberLists(actual);

        expect(actual).toEqual(expectedPayload);
        console.log("validated stream", streamIndex);
      });
    } finally {
      firebaseData.GAME = previousState.game;
      (firebaseData as any).__meta = previousState.meta;
    }
  };
};
export default getGameEndPayloadTest;
