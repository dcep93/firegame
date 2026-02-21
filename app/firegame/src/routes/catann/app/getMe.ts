import store from "../../../shared/store";

const [roomId, username, selectedColor] = (
  window.parent.location?.hash || window.location.hash
)
  .slice(1)
  .split(".");
var last = "";
const log = <T>(t: T) => {
  const nextLast = `${t}`;
  if (last !== nextLast) {
    last = nextLast;
    console.log("log", JSON.stringify(t, null, 2));
  }
  return t;
};
const getMe = () =>
  log({
    roomId: roomId || `roomIdx-${store.me?.roomId}`,
    username: username ?? store.me?.userId,
    userId: username ?? store.me?.userId,
    selectedColor,
    isTest: roomId !== "",
  });

export default getMe;
