const CHANNEL = "firebaseMock";

var bc: BroadcastChannel;
var cb: any;

export const listenMock = (_cb: any) => {
  cb = _cb;
  bc = new BroadcastChannel(CHANNEL);
  console.log("msg.reg");
  bc.onmessage = (ev) => {
    cb(ev.data);
    console.log("msg.rec");
  };
  cb(undefined);
};

export const updateMock = (payload: any) => {
  console.log("msg.post");
  bc.postMessage(payload);
  //   cb(payload);
};
