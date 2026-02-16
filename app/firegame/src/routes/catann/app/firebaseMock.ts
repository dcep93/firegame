const CHANNEL = "firebaseMock";

var bc: BroadcastChannel;
var cb: any;

export const listenMock = (_cb: any) => {
  cb = _cb;
  bc = new BroadcastChannel(CHANNEL);
  bc.onmessage = (ev) => {
    // if (ev.data.now === now) cb(ev.data.payload);
  };
  cb(undefined);
};

export const updateMock = (payload: any) => {
  //   bc.postMessage({ now, payload });
  cb(payload);
};
