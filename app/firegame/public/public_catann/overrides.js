function main() {
  console.log("overrides.js::main");
  overrideXHR();
  overrideWebsocket();
  overrideServiceWorker();
  loadRemote();
}

const FUTURE = "3000-01-01T00:00:00.000Z";

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

  async function getPayload(__meta) {
    if (!__meta.url.startsWith("/")) {
      return;
    }
    if (__meta.url.startsWith("/api/analytic-events"))
      return JSON.stringify(true);
    if (__meta.url.startsWith("/cdn-cgi/rum")) return JSON.stringify(true);
    if (__meta.url === "/api/header/friend-requests-received")
      return JSON.stringify([]);
    if (__meta.url === "/api/find-game-ranked-state") return JSON.stringify([]);
    if (__meta.url === "/api/show-feedback-form")
      return JSON.stringify({
        shouldShow: false,
        lastShown: FUTURE,
      });
    if (__meta.url === "/api/profile/friends")
      return JSON.stringify({
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
      });
    if (__meta.url === "/api/room-list.json") {
      return JSON.stringify({
        rooms: [],
      });
    }
    if (__meta.url === "/api/user-state") {
      return JSON.stringify(USER_STATE);
    }
    // codex: dont remove this, its for debugging
    const e = `not implemented: ${JSON.stringify(__meta)}`;
    console.log(e);
    throw new Error(e);
  }

  function InterceptedXHR() {
    const xhr = new OrigXHR();
    xhr.__meta = {};

    const origOpen = xhr.open;
    xhr.open = function (...args) {
      const [method, url] = args;
      xhr.__meta.method = method?.toUpperCase?.() || "GET";
      xhr.__meta.url = url;
      return origOpen.apply(xhr, args);
    };

    const origSend = xhr.send;
    xhr.send = function (body) {
      const __meta = xhr.__meta;
      getPayload(__meta).then((payload) => {
        if (!payload) {
          return origSend.call(xhr, body);
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
      InterceptedXHR[k] = OrigXHR[k];
    } catch {}
  });
  window.XMLHttpRequest = InterceptedXHR;
}

function overrideWebsocket() {
  const socketsById = new Map();
  let nextSocketId = 1;

  class InterceptedWebSocket extends EventTarget {
    constructor(...createArgs) {
      super();
      this.id = nextSocketId++;
      this.readyState = 1;
      socketsById.set(this.id, this);
      window.parent?.postMessage(
        { id: this.id, data: { InterceptedWebSocket: createArgs } },
        "*",
      );
      queueMicrotask(() => {
        if (typeof this.onopen === "function") {
          this.onopen(new Event("open"));
        }
        this.dispatchEvent(new Event("open"));
      });
    }

    send(data) {
      window.parent?.postMessage({ id: this.id, data }, "*");
    }

    close() {
      this.readyState = 3;
      socketsById.delete(this.id);
      if (typeof this.onclose === "function") {
        this.onclose(new CloseEvent("close"));
      }
      this.dispatchEvent(new CloseEvent("close"));
    }

    receive(data) {
      const messageEvent = new MessageEvent("message", { data });
      if (typeof this.onmessage === "function") {
        this.onmessage(messageEvent);
      }
      this.dispatchEvent(messageEvent);
    }
  }

  InterceptedWebSocket.CONNECTING = 0;
  InterceptedWebSocket.OPEN = 1;
  InterceptedWebSocket.CLOSING = 2;
  InterceptedWebSocket.CLOSED = 3;

  window.addEventListener("message", (event) => {
    const { id, data } = event.data || {};
    if (!id || !socketsById.has(id)) {
      return;
    }
    socketsById.get(id).receive(data);
  });

  window.WebSocket = InterceptedWebSocket;
}

function overrideServiceWorker() {
  const origRegister = navigator.serviceWorker.register;
  const InterceptedRegister = function (...args) {
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
  fetch(`./remote.html?${Date.now()}`)
    .then((resp) => resp.text())
    .then((resp) => {
      document.open();
      document.write(resp);
      document.close();
    });
}

main();
