const CHANNEL = "firebaseMock";

var bc: BroadcastChannel;

export const listenMock = (cb: any) => {
  bc = new BroadcastChannel(CHANNEL);
  bc.onmessage = (ev) => {
    cb(ev.data);
  };
};

export const updateMock = (payload: any) => {
  bc.postMessage(payload);
};
