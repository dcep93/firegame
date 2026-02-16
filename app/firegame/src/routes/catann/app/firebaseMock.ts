const CHANNEL = "firebaseMock";

var bc: BroadcastChannel;
var cb: any;

export const listenMock = (_cb: any) => {
  cb = _cb;
  bc = new BroadcastChannel(CHANNEL);
  bc.onmessage = (ev) => {
    cb(ev.data);
  };
  cb(undefined);
};

export const updateMock = (payload: any) => {
  //   bc.postMessage(payload);
  cb(payload);
};
