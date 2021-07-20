import { VERSION } from "../../shared/shared";
import store, { MeType } from "../../shared/store";
import Firebase from "../firebase";
import { enterLobby } from "./lobby";

var initialized = false;
function init(roomId: number, gameName: string, update_: () => void) {
  if (initialized) return;
  initialized = true;
  Firebase.init();
  const userId = getUserId();
  const me: MeType = {
    roomId,
    gameName,
    VERSION,
    userId,
  };
  // @ts-ignore read only
  store.me = me;
  update = update_;
  enterLobby();
}

function getUserId(): string {
  if (localStorage.version !== VERSION) {
    localStorage.version = VERSION;
    localStorage.userId = `u_${Math.random().toString(16).substr(2)}`;
  }
  return localStorage.userId;
}

var update = function (): void {
  throw Error("this should be overwritten during init");
};

function lobbyPath(): string {
  return `${roomPath()}/lobby`;
}

function mePath(userId?: string): string {
  if (userId === undefined) userId = store.me.userId;
  return `${lobbyPath()}/${userId}`;
}

function namespace(): string {
  return (
    "firegame/" +
    (process.env.REACT_APP_NAMESPACE ||
      window.location.hostname.replace("www.", "").split(".")[0])
  );
}

function roomPath(): string {
  return `${namespace()}/${store.me.gameName}/${store.me.roomId}`;
}

function gamePath(): string {
  return `${roomPath()}/game`;
}

export { init, update, mePath, lobbyPath, gamePath, namespace };
