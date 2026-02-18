import { firebaseData } from "./FirebaseWrapper";

const CHANNEL = "firebaseMock";

type MockPayload = typeof firebaseData;
type MockMessageCallback = (payload: MockPayload | undefined) => void;

let bc: BroadcastChannel;
let cb: MockMessageCallback;

export const listenMock = (_cb: MockMessageCallback): void => {
  cb = _cb;
  bc = new BroadcastChannel(CHANNEL);
  bc.onmessage = (ev: MessageEvent<MockPayload>): void => {
    cb(ev.data);
  };
  cb(undefined);
};

export const updateMock = (payload: MockPayload): void => {
  bc?.postMessage(payload);
  cb(payload);
};
