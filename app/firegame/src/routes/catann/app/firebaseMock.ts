const CHANNEL = "firebaseMock";

var bc: BroadcastChannel;
var cb: any;

export const listenMock = (_cb: any) => {
  cb = _cb;
  bc = new BroadcastChannel(CHANNEL);
  console.log("msg.reg", window.location.href);
  bc.onmessage = (ev) => {
    console.log("msg.rec", window.location.href, ev.data);
    cb(ev.data);
  };
  cb(undefined);
};

export const updateMock = (payload: any) => {
  console.log(
    "msg.post",
    window.location.href,
    JSON.stringify(payload, null, 2),
  );
  bc.postMessage(payload);
  //   cb(payload);
};
