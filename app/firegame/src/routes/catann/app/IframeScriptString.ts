type XhrMeta = {
  method?: string;
  url?: string;
};

declare global {
  interface Window {
    __socketBridgeHandler?: (event: MessageEvent) => void;
  }
}

function main() {
  console.log("overrides.js::main");
  overrideXHR();
  overrideWebsocket();
  overrideServiceWorker();
  loadRemote();

  const FUTURE = (() => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    return future.toISOString();
  })();

  const USER_STATE = {
    userState: {
      accessLevel: 1,
      colonistCoins: 0,
      colonistVersion: 1080,
      giftedMemberships: [],
      icon: 11,
      id: "420",
      interactedWithSite: true,
      isLoggedIn: true,
      hasJoinedColonistDiscordServer: false,
      karma: 20,
      karmaCompletedGameCount: 20,
      membershipPaymentMethod: "Stripe",
      membershipPending: false,
      membership: 5,
      membershipEndDate: FUTURE,
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
      ],
      //   totalCompletedGameCount: 441,
      //   ckTotalGameCount: 0,
      //   ckNextRerollAt: "2026-01-17T19:30:46.992Z",
      username: "username",
      language: null,
      //   usernameChangeAttemptsLeft: 0,
      forceSubscription: true,
      //   vliHash:
      //     "be7ff6257c114e96bf8bd088e74f557e7d0763d174985bb66a9f00b0df4e0661",
      expiresAt: FUTURE,
    },
    // csrfToken:
    //   "e3eb1249fa0460b5c60c8c51c405365f88d9b20a0c0e9b6b1684a2b048b4aad0ab6e1f8424b0185bb61b1f6373f9324a94644e964ce348927fc8347eedd7d16b",
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

    async function getPayload(__meta: XhrMeta) {
      const url = __meta.url;
      if (!url || !url.startsWith("/")) {
        return;
      }
      if (url.startsWith("/api/analytic-events")) return JSON.stringify(true);
      if (url.startsWith("/cdn-cgi/rum")) return JSON.stringify(true);
      if (url === "/api/header/friend-requests-received")
        return JSON.stringify([]);
      if (url === "/api/find-game-ranked-state") return JSON.stringify([]);
      if (url === "/api/show-feedback-form")
        return JSON.stringify({
          shouldShow: false,
          lastShown: FUTURE,
        });
      if (url === "/api/profile/friends")
        return JSON.stringify({
          friends: [],
          friendRequestsSent: [],
          friendRequestsReceived: [],
        });
      if (url === "/api/room-list.json") {
        return JSON.stringify({
          rooms: [],
        });
      }
      if (url === "/api/user-state") {
        return JSON.stringify(USER_STATE);
      }
      // codex: dont remove this, its for debugging
      const e = `not implemented: ${JSON.stringify(__meta)}`;
      console.error(e);
      throw new Error(e);
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
        const __meta = xhr.__meta;
        getPayload(__meta).then((payload) => {
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

    class InterceptedWebSocket extends EventTarget {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;

      id: number;
      readyState: number;
      onopen: ((event: Event) => void) | null = null;
      onclose: ((event: CloseEvent) => void) | null = null;
      onmessage: ((event: MessageEvent) => void) | null = null;

      constructor(...createArgs: unknown[]) {
        super();
        this.id = nextSocketId++;
        this.readyState = 1;
        socketsById.set(this.id, this);
        this.send({ InterceptedWebSocket: createArgs });
        queueMicrotask(() => {
          if (typeof this.onopen === "function") {
            this.onopen(new Event("open"));
          }
          this.dispatchEvent(new Event("open"));
        });
      }

      send(clientData: unknown) {
        window.parent?.postMessage({ id: this.id, clientData }, "*");
      }

      close() {
        this.readyState = 3;
        socketsById.delete(this.id);
        if (typeof this.onclose === "function") {
          this.onclose(new CloseEvent("close"));
        }
        this.dispatchEvent(new CloseEvent("close"));
      }

      receive(serverData: unknown) {
        const data = JSON.stringify(serverData);
        const messageEvent = new MessageEvent("message", {
          data,
        });
        if (typeof this.onmessage === "function") {
          this.onmessage(messageEvent);
        }
        this.dispatchEvent(messageEvent);
      }
    }

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
        resp.replaceAll(
          "https://cdn.colonist.io/dist/js",
          "/public_catann/catann_files",
        ),
      )
      .then((resp) => {
        document.open();
        document.write(resp);
        document.close();
        if (window.__socketBridgeHandler) {
          window.addEventListener("message", window.__socketBridgeHandler);
        }
      });
  }
}

const IframeScriptString = `(${main.toString()})();`;
export default IframeScriptString;
