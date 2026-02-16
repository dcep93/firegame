import { StoreAvatarItemType, UserIcon } from "./gameLogic/CatannFilesEnums";
import {
  getRoomId,
  getRoomIdFromHash,
  newUserState,
} from "./gameLogic/createNew";
import { FUTURE } from "./handleMessage";

export const isDev = process.env.NODE_ENV === "development";
export const isTest = getRoomIdFromHash() !== undefined;

const storeAvatarToUserIconMap: Record<number, number> = {
  [StoreAvatarItemType.FounderHat]: UserIcon.IconFounderHat,
  [StoreAvatarItemType.ColonistHat]: UserIcon.IconColonistHat,
  [StoreAvatarItemType.SettlerHat]: UserIcon.IconSettlerHat,
  [StoreAvatarItemType.ChristmasHat]: UserIcon.IconChristmasHat,
  [StoreAvatarItemType.Player]: UserIcon.User,
  [StoreAvatarItemType.PirateShip]: UserIcon.IconPirateShip,
  [StoreAvatarItemType.MedalGold]: UserIcon.IconMedalGold,
  [StoreAvatarItemType.MedalSilver]: UserIcon.IconMedalSilver,
  [StoreAvatarItemType.MedalBronze]: UserIcon.IconMedalBronze,
  [StoreAvatarItemType.Elephant]: UserIcon.IconElephant,
  [StoreAvatarItemType.Avocado]: UserIcon.IconAvocado,
  [StoreAvatarItemType.Cactus]: UserIcon.IconCactus,
  [StoreAvatarItemType.Crown]: UserIcon.IconCrown,
  [StoreAvatarItemType.Swords]: UserIcon.IconSwords,
  [StoreAvatarItemType.Helmet]: UserIcon.IconHelmet,
  [StoreAvatarItemType.Snorkel]: UserIcon.IconSnorkel,
  [StoreAvatarItemType.Scarf]: UserIcon.IconScarf,
  [StoreAvatarItemType.Tie]: UserIcon.IconTie,
  [StoreAvatarItemType.Worker]: UserIcon.IconWorker,
  [StoreAvatarItemType.Sombrero]: UserIcon.IconSombrero,
  [StoreAvatarItemType.Farmer]: UserIcon.IconFarmer,
  [StoreAvatarItemType.RobberSanta]: UserIcon.IconRobberSanta,
  [StoreAvatarItemType.RobberLunar]: UserIcon.IconRobberLunar,
  [StoreAvatarItemType.RobberCupid]: UserIcon.IconRobberCupid,
  [StoreAvatarItemType.Mummy]: UserIcon.IconMummy,
  [StoreAvatarItemType.Gifter]: UserIcon.IconGifter,
};

type XhrMeta = {
  method?: string;
  url?: string;
};

declare global {
  interface Window {
    __socketBridgeHandler?: (event: MessageEvent) => void;
  }
}

function main({
  roomId,
  isDev,
  future,
  userState,
  storeAvatarToUserIconMap,
}: {
  roomId: string;
  isDev: boolean;
  future: string;
  userState: { userState: {} };
  storeAvatarToUserIconMap: Record<number, number>;
}) {
  overrideXHR();
  overrideWebsocket();
  overrideServiceWorker();
  installCanvasPointerOverDedupe();
  loadIndex();

  function overrideXHR() {
    const OrigXHR = window.XMLHttpRequest;

    function getPayload(__meta: XhrMeta, sendArgs: any) {
      const url = __meta.url;
      if (!url || !url.startsWith("/")) {
        return Promise.resolve(undefined);
      }
      if (url.startsWith("/api/user/assign-ab-test"))
        return Promise.resolve(JSON.stringify(true));
      if (url.startsWith("/api/analytic-events"))
        return Promise.resolve(JSON.stringify(true));
      if (url.startsWith("/api/validate-username/"))
        return Promise.resolve(
          JSON.stringify({ isAvailable: true, containsToxicWord: false }),
        );
      if (url.startsWith("/cdn-cgi/rum"))
        return Promise.resolve(JSON.stringify(true));
      if (url === "/api/header/friend-requests-received")
        return Promise.resolve(JSON.stringify([]));
      if (url === "/api/find-game-ranked-state")
        return Promise.resolve(JSON.stringify([]));
      if (url === "/api/show-feedback-form")
        return Promise.resolve(
          JSON.stringify({
            shouldShow: false,
            lastShown: future,
          }),
        );
      if (url === "/api/profile/friends")
        return Promise.resolve(
          JSON.stringify({
            friends: [],
            friendRequestsSent: [],
            friendRequestsReceived: [],
          }),
        );
      if (url === "/api/room-list.json") {
        return Promise.resolve(
          JSON.stringify({
            rooms: [],
          }),
        );
      }
      if (url === "/api/user-state") {
        return Promise.resolve(JSON.stringify(userState));
      }
      if (url === "/api/profile-edit/icon") {
        const parsed = JSON.parse(sendArgs[0]);
        const mappedIcon =
          parsed?.icon == null ? null : storeAvatarToUserIconMap?.[parsed.icon];
        if (mappedIcon != null) parsed.icon = mappedIcon;
        userState.userState = {
          ...userState.userState,
          ...parsed,
        };
        window.parent!.postMessage({ catann: true, clientData: parsed }, "*");
        return Promise.resolve(
          JSON.stringify({ success: true, userState: userState.userState }),
        );
      }
      if (url === "/api/profile-edit/username") {
        const parsed = JSON.parse(sendArgs[0]);
        userState.userState = {
          ...userState.userState,
          ...parsed,
        };
        window.parent!.postMessage({ catann: true, clientData: parsed }, "*");
        return Promise.resolve(
          JSON.stringify({ success: true, userState: userState.userState }),
        );
      }
      if (url.includes("cdn.vlitag.com")) {
        return Promise.resolve({});
      }
      // codex: dont remove this, its for debugging
      const e = `xhr not implemented: ${JSON.stringify(__meta)}`;
      console.error(e);
      return Promise.reject(new Error(e));
    }

    function InterceptedXHR(this: XMLHttpRequest) {
      const xhr = new OrigXHR() as XMLHttpRequest & { __meta: XhrMeta };
      xhr.__meta = {};

      const origOpen = xhr.open.bind(xhr);
      function interceptedOpen(method: string, url: string | URL): void;
      function interceptedOpen(
        method: string,
        url: string | URL,
        async: boolean,
        username?: string | null,
        password?: string | null,
      ): void;
      function interceptedOpen(
        method: string,
        url: string | URL,
        async?: boolean,
        username?: string | null,
        password?: string | null,
      ) {
        xhr.__meta.method = method?.toUpperCase?.() || "GET";
        xhr.__meta.url = typeof url === "string" ? url : url?.toString?.();
        return origOpen(method, url, async as boolean, username, password);
      }
      xhr.open = interceptedOpen as typeof xhr.open;

      const origSend = xhr.send;
      xhr.send = function (...sendArgs: Parameters<XMLHttpRequest["send"]>) {
        getPayload(xhr.__meta, sendArgs).then((payload) => {
          if (!payload) {
            return origSend.apply(xhr, sendArgs);
          }

          Object.defineProperty(xhr, "readyState", { value: 4 });
          Object.defineProperty(xhr, "status", { value: 200 });
          Object.defineProperty(xhr, "statusText", { value: "OK" });
          Object.defineProperty(xhr, "responseText", {
            value: payload,
          });
          Object.defineProperty(xhr, "response", { value: payload });

          xhr.dispatchEvent(new Event("readystatechange"));
          xhr.dispatchEvent(new Event("load"));
          xhr.dispatchEvent(new Event("loadend"));
        });
      };

      return xhr;
    }
    InterceptedXHR.prototype = OrigXHR.prototype;
    Object.getOwnPropertyNames(OrigXHR).forEach((k) => {
      try {
        (InterceptedXHR as unknown as Record<string, unknown>)[k] = (
          OrigXHR as unknown as Record<string, unknown>
        )[k];
      } catch {}
    });
    window.XMLHttpRequest = InterceptedXHR as unknown as typeof XMLHttpRequest;
  }

  function overrideWebsocket() {
    const socketsById = new Map();
    let nextSocketId = 1;

    function InterceptedWebSocket(this: EventTarget, ...createArgs: unknown[]) {
      const socket = new EventTarget();
      Object.setPrototypeOf(socket, InterceptedWebSocket.prototype);
      (socket as unknown as { id: number }).id = nextSocketId++;
      (socket as unknown as { readyState: number }).readyState = 1;
      (
        socket as unknown as { onopen: ((event: Event) => void) | null }
      ).onopen = null;
      (
        socket as unknown as { onclose: ((event: CloseEvent) => void) | null }
      ).onclose = null;
      (
        socket as unknown as {
          onmessage: ((event: MessageEvent) => void) | null;
        }
      ).onmessage = null;
      socketsById.set((socket as unknown as { id: number }).id, socket);
      (
        socket as unknown as {
          send: (clientData: unknown) => void;
        }
      ).send({ InterceptedWebSocket: createArgs });
      queueMicrotask(() => {
        const onopen = (
          socket as unknown as {
            onopen: ((event: Event) => void) | null;
          }
        ).onopen;
        if (typeof onopen === "function") {
          onopen(new Event("open"));
        }
        socket.dispatchEvent(new Event("open"));
      });
      return socket as unknown as WebSocket;
    }

    InterceptedWebSocket.prototype = Object.create(EventTarget.prototype);
    InterceptedWebSocket.prototype.constructor = InterceptedWebSocket;
    InterceptedWebSocket.CONNECTING = 0;
    InterceptedWebSocket.OPEN = 1;
    InterceptedWebSocket.CLOSING = 2;
    InterceptedWebSocket.CLOSED = 3;

    (InterceptedWebSocket.prototype as unknown as WebSocket).send = function (
      this: { id: number },
      clientData: unknown,
    ) {
      window.parent!.postMessage(
        { catann: true, id: this.id, clientData },
        "*",
      );
    };

    (InterceptedWebSocket.prototype as unknown as WebSocket).close =
      function (this: {
        id: number;
        readyState: number;
        onclose: ((event: CloseEvent) => void) | null;
        dispatchEvent: (event: Event) => boolean;
      }) {
        console.trace("test.log", { this_id: this.id });
        this.readyState = 3;
        socketsById.delete(this.id);
        if (typeof this.onclose === "function") {
          this.onclose(new CloseEvent("close"));
        }
        this.dispatchEvent(new CloseEvent("close"));
      };

    (
      InterceptedWebSocket.prototype as unknown as {
        receive: (data: unknown) => void;
      }
    ).receive = function (
      this: {
        onmessage: ((event: MessageEvent) => void) | null;
        dispatchEvent: (event: Event) => boolean;
      },
      data: unknown,
    ) {
      const messageEvent = new MessageEvent("message", {
        data,
      });
      if (typeof this.onmessage === "function") {
        this.onmessage(messageEvent);
      }
      this.dispatchEvent(messageEvent);
    };

    window.__socketBridgeHandler = (event) => {
      const { id, serverData } = event.data || {};
      if (!serverData) return;
      if (!socketsById.get(id)) throw new Error(`no socketId ${id}`);
      console.log("test.log", { id });
      socketsById.get(id).receive(serverData);
    };

    window.WebSocket = InterceptedWebSocket as unknown as typeof WebSocket;
  }

  function overrideServiceWorker() {
    const origRegister = navigator.serviceWorker.register;
    const InterceptedRegister = function (
      this: ServiceWorkerContainer,
      ...args: Parameters<ServiceWorkerContainer["register"]>
    ) {
      const [path, options] = args;
      let nextPath = path;
      if (typeof nextPath === "string") {
        if (/\/?service-worker$/.test(nextPath)) {
          nextPath = `${nextPath}.js`;
        }
        nextPath = `/public_catann${nextPath}`;
      }
      return origRegister.call(this, nextPath, options);
    };
    navigator.serviceWorker.register = InterceptedRegister;
  }

  function loadIndex() {
    fetch(`/public_catann/index.html?${Date.now()}`)
      .then((resp) => resp.text())
      .then((resp) =>
        !isDev
          ? resp
          : resp
              .replaceAll(
                "https://cdn.colonist.io/dist/js",
                "/public_catann/catann_files",
              )
              .replaceAll(
                "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=turnstileLoaded",
                "",
              ),
      )
      .then((resp) => {
        window.history.replaceState(null, "", `/#${roomId}`);
        document.open();
        document.write(resp);
        document.close();
        if (window.__socketBridgeHandler) {
          window.addEventListener("message", window.__socketBridgeHandler);
        }
      });
  }

  function installCanvasPointerOverDedupe() {
    // Dedupe a browser/iframe quirk where the canvas can receive duplicate
    // pointerover events with relatedTarget === null for the same pointerId.
    // We wrap canvas listeners so duplicates are ignored before app handlers run,
    // while preserving legitimate pointerover/out/leave for other pointers.
    const proto = HTMLCanvasElement.prototype as HTMLCanvasElement & {
      __codexPointerOverPatched?: boolean;
    };
    if (proto.__codexPointerOverPatched) return;
    proto.__codexPointerOverPatched = true;

    const originalAdd = proto.addEventListener;
    const originalRemove = proto.removeEventListener;
    const isPointerType = (type: string) =>
      type === "pointerover" ||
      type === "pointerout" ||
      type === "pointerleave";

    const wrapListener = (listener: Function) =>
      (listener as any).__codexPointerWrap ??
      ((listener as any).__codexPointerWrap = function (
        this: HTMLCanvasElement,
        event: Event,
      ) {
        if (event instanceof PointerEvent && isPointerType(event.type)) {
          const guard =
            (this as any)._codexOverOutGuard ||
            ((this as any)._codexOverOutGuard = {
              lastType: null,
              lastPointerId: null,
            });
          if (
            event.type === "pointerover" &&
            event.target === this &&
            event.relatedTarget === null &&
            guard.lastType === "pointerover" &&
            guard.lastPointerId === event.pointerId
          ) {
            return;
          }
          guard.lastType = event.type;
          guard.lastPointerId = event.pointerId;
        }
        return listener.call(this, event);
      });

    proto.addEventListener = function (
      this: HTMLCanvasElement,
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions,
    ) {
      if (typeof listener === "function" && isPointerType(type)) {
        return originalAdd.call(
          this,
          type,
          wrapListener(listener) as EventListener,
          options,
        );
      }
      return originalAdd.call(this, type, listener as any, options as any);
    };

    proto.removeEventListener = function (
      this: HTMLCanvasElement,
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions,
    ) {
      if (typeof listener === "function" && isPointerType(type)) {
        const wrapped = (listener as any).__codexPointerWrap as
          | EventListener
          | undefined;
        return originalRemove.call(
          this,
          type,
          (wrapped || listener) as any,
          options as any,
        );
      }
      return originalRemove.call(this, type, listener as any, options as any);
    };
  }
}

const IframeScriptString = () =>
  `(${main.toString()})(${JSON.stringify({
    roomId: getRoomId(),
    isDev,
    future: FUTURE,
    userState: newUserState(),
    storeAvatarToUserIconMap,
  })});`;
export default IframeScriptString;
