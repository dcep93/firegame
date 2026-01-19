import store, { MeType } from "../../../shared/store";
import { handleServerUpdate } from "./FirebaseWrapper";
import handleMessage, { FUTURE } from "./handleMessage";
import { packServerData } from "./parseMessagepack";

export const isDev = process.env.NODE_ENV === "development";

window.addEventListener("message", (event) => {
  const { id, clientData, catann } = event.data || {};
  if (!catann) return;
  if (!id) return handleServerUpdate(clientData);
  handleMessage(clientData, (serverData) =>
    event.source!.postMessage(
      { id, serverData: packServerData(serverData) },
      { targetOrigin: "*" },
    ),
  );
});

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
  me,
  isDev,
  future,
}: {
  me: MeType;
  isDev: boolean;
  future: string;
}) {
  overrideXHR();
  overrideWebsocket();
  overrideServiceWorker();
  loadRemote();

  const USER_STATE = {
    userState: {
      userSessionId: "asdf",
      accessLevel: 1,
      colonistCoins: 0,
      colonistVersion: 1080,
      giftedMemberships: [],
      icon: 11,
      id: me.userId,
      interactedWithSite: true,
      isLoggedIn: true,
      hasJoinedColonistDiscordServer: false,
      karma: 20,
      karmaCompletedGameCount: 20,
      membershipPaymentMethod: "Stripe",
      membershipPending: false,
      membership: 5,
      membershipEndDate: future,
      isMuted: false,
      ownedItems: [
        // Expansions (category 1)
        { category: 1, type: 0 }, // Seafarers4P
        { category: 1, type: 1 }, // CitiesAndKnights4P
        { category: 1, type: 2 }, // TradersAndBarbarians
        { category: 1, type: 3 }, // ExplorersAndPirates
        { category: 1, type: 4 }, // Classic56P
        { category: 1, type: 5 }, // Classic78P
        { category: 1, type: 6 }, // Seafarers56P
        { category: 1, type: 7 }, // CitiesAndKnights56P
        { category: 1, type: 8 }, // CitiesAndKnightsSeafarers4P
        { category: 1, type: 9 }, // CitiesAndKnightsSeafarers56P
        // Maps (category 2)
        { category: 2, type: 0 }, // Earth
        { category: 2, type: 1 }, // USA
        { category: 2, type: 2 }, // UK
        { category: 2, type: 3 }, // Diamond
        { category: 2, type: 4 }, // Gear
        { category: 2, type: 5 }, // Lakes
        { category: 2, type: 6 }, // Pond
        { category: 2, type: 7 }, // Twirl
        { category: 2, type: 8 }, // Classic4PRandom
        { category: 2, type: 9 }, // ShuffleBoard
        { category: 2, type: 10 }, // BlackForest
        { category: 2, type: 11 }, // Volcano
        { category: 2, type: 12 }, // GoldRush
        // Avatars (category 3)
        { category: 3, type: 0 }, // FounderHat
        { category: 3, type: 1 }, // ColonistHat
        { category: 3, type: 2 }, // SettlerHat
        { category: 3, type: 3 }, // ChristmasHat
        { category: 3, type: 4 }, // Player
        { category: 3, type: 5 }, // PirateShip
        { category: 3, type: 6 }, // MedalGold
        { category: 3, type: 7 }, // MedalSilver
        { category: 3, type: 8 }, // MedalBronze
        { category: 3, type: 9 }, // Elephant
        { category: 3, type: 10 }, // Avocado
        { category: 3, type: 11 }, // Cactus
        { category: 3, type: 12 }, // Crown
        { category: 3, type: 13 }, // Swords
        { category: 3, type: 14 }, // Helmet
        { category: 3, type: 15 }, // Snorkel
        { category: 3, type: 16 }, // Scarf
        { category: 3, type: 17 }, // Tie
        { category: 3, type: 18 }, // Worker
        { category: 3, type: 19 }, // Sombrero
        { category: 3, type: 20 }, // Farmer
        { category: 3, type: 21 }, // RobberSanta
        { category: 3, type: 22 }, // RobberLunar
        { category: 3, type: 23 }, // RobberCupid
        { category: 3, type: 24 }, // Mummy
        { category: 3, type: 25 }, // Gifter
      ],
      //   totalCompletedGameCount: 441,
      //   ckTotalGameCount: 0,
      //   ckNextRerollAt: "2026-01-17T19:30:46.992Z",
      username: me.userId,
      language: null,
      //   usernameChangeAttemptsLeft: 0,
      forceSubscription: true,
      //   vliHash:
      //     "be7ff6257c114e96bf8bd088e74f557e7d0763d174985bb66a9f00b0df4e0661",
      expiresAt: future,
    },
    csrfToken:
      "e3eb1249fa0460b5c60c8c51c405365f88d9b20a0c0e9b6b1684a2b048b4aad0ab6e1f8424b0185bb61b1f6373f9324a94644e964ce348927fc8347eedd7d16b",
    abTests: {
      //   CHAT_TOXICITY_SHOW_MONITORED_WARNING:
      //     "SHOW_CHAT_IS_MONITORED_WARNING",
      //   CK_MONETIZATION_DICE_ROLL: "FREE_PLAYS_THEN_DICE_ROLL",
      //   GIFTING_CHANGE_BEST_VALUE_HINT: "SHOW_MOST_POPULAR",
      //   MOBILE_MY_TURN_NOTIFICATION: "DEFAULT",
      //   REACTIVATE_DISCORD_INACTIVE_USERS:
      //     "GROUP_A_YOU_HAVE_NOT_PLAYED_FOR_A_WHILE",
    },
  };

  function overrideXHR() {
    const OrigXHR = window.XMLHttpRequest;

    function getPayload(__meta: XhrMeta, sendArgs: any) {
      const url = __meta.url;
      if (!url || !url.startsWith("/")) {
        return Promise.resolve(undefined);
      }
      if (url.startsWith("/api/analytic-events"))
        return Promise.resolve(JSON.stringify(true));
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
        return Promise.resolve(JSON.stringify(USER_STATE));
      }
      if (url === "/api/profile-edit/icon") {
        const parsed = JSON.parse(sendArgs[0]);
        USER_STATE.userState = {
          ...USER_STATE.userState,
          ...parsed,
        };
        window.parent?.postMessage({ catann: true, clientData: parsed }, "*");
        return Promise.resolve(
          JSON.stringify({ success: true, userState: USER_STATE.userState }),
        );
      }
      // codex: dont remove this, its for debugging
      const e = `not implemented: ${JSON.stringify(__meta)}`;
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
      window.parent?.postMessage(
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
      socketsById.get(id)?.receive(serverData);
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

  function loadRemote() {
    fetch(`/public_catann/remote.html?${Date.now()}`)
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
        console.log(me);
        window.history.replaceState(null, "", `/#roomIdx${me.roomId}`);
        document.open();
        document.write(resp);
        document.close();
        if (window.__socketBridgeHandler) {
          window.addEventListener("message", window.__socketBridgeHandler);
        }
      });
  }
}

const IframeScriptString = () =>
  `(${main.toString()})(${JSON.stringify({ me: store.me, isDev, future: FUTURE })});`;
export default IframeScriptString;
