(function main(_ref) {
  let { me, isDev, future, userState } = _ref;
  window.parent = {
    postMessage: () => {
      throw new Error("postMessage");
    },
  };
  overrideXHR();
  overrideWebsocket();
  overrideServiceWorker();
  //   loadIndex();

  function overrideXHR() {
    const OrigXHR = window.XMLHttpRequest;

    function getPayload(__meta, sendArgs) {
      const url = __meta.url;

      if (!url || !url.startsWith("/")) {
        return Promise.resolve(undefined);
      }

      if (url.startsWith("/api/analytic-events"))
        return Promise.resolve(JSON.stringify(true));
      if (url.startsWith("/api/validate-username/"))
        return Promise.resolve(
          JSON.stringify({
            isAvailable: true,
            containsToxicWord: false,
          }),
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
        userState.userState = { ...userState.userState, ...parsed };
        window.parent.postMessage(
          {
            catann: true,
            clientData: parsed,
          },
          "*",
        );
        return Promise.resolve(
          JSON.stringify({
            success: true,
            userState: userState.userState,
          }),
        );
      }

      if (url === "/api/profile-edit/username") {
        const parsed = JSON.parse(sendArgs[0]);
        userState.userState = { ...userState.userState, ...parsed };
        window.parent.postMessage(
          {
            catann: true,
            clientData: parsed,
          },
          "*",
        );
        return Promise.resolve(
          JSON.stringify({
            success: true,
            userState: userState.userState,
          }),
        );
      } // codex: dont remove this, its for debugging

      const e = `not implemented: ${JSON.stringify(__meta)}`;
      console.error(e);
      return Promise.reject(new Error(e));
    }

    function InterceptedXHR() {
      const xhr = new OrigXHR();
      xhr.__meta = {};
      const origOpen = xhr.open.bind(xhr);

      function interceptedOpen(method, url, async, username, password) {
        var _method$toUpperCase, _url$toString;

        xhr.__meta.method =
          (method === null || method === void 0
            ? void 0
            : (_method$toUpperCase = method.toUpperCase) === null ||
                _method$toUpperCase === void 0
              ? void 0
              : _method$toUpperCase.call(method)) || "GET";
        xhr.__meta.url =
          typeof url === "string"
            ? url
            : url === null || url === void 0
              ? void 0
              : (_url$toString = url.toString) === null ||
                  _url$toString === void 0
                ? void 0
                : _url$toString.call(url);
        return origOpen(method, url, async, username, password);
      }

      xhr.open = interceptedOpen;
      const origSend = xhr.send;

      xhr.send = function () {
        for (
          var _len = arguments.length, sendArgs = new Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          sendArgs[_key] = arguments[_key];
        }

        getPayload(xhr.__meta, sendArgs).then((payload) => {
          if (!payload) {
            return origSend.apply(xhr, sendArgs);
          }

          Object.defineProperty(xhr, "readyState", {
            value: 4,
          });
          Object.defineProperty(xhr, "status", {
            value: 200,
          });
          Object.defineProperty(xhr, "statusText", {
            value: "OK",
          });
          Object.defineProperty(xhr, "responseText", {
            value: payload,
          });
          Object.defineProperty(xhr, "response", {
            value: payload,
          });
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
    const OrigWebSocket = window.WebSocket;
    const socketsById = new Map();
    let nextSocketId = 1;
    const socketActivity =
      window.__socketActivity || (window.__socketActivity = []);

    function recordSocketActivity(socketInitAddress, type, data) {
      socketActivity.push({
        socketInitAddress,
        [type]: data,
      });
    }

    function InterceptedWebSocket() {
      const socket = new EventTarget();
      Object.setPrototypeOf(socket, InterceptedWebSocket.prototype);
      socket.id = nextSocketId++;
      socket.readyState = 1;
      socket.onopen = null;
      socket.onclose = null;
      socket.onmessage = null;
      socketsById.set(socket.id, socket);

      for (
        var _len2 = arguments.length, createArgs = new Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        createArgs[_key2] = arguments[_key2];
      }

      socket.initAddress = createArgs[0];
      Object.defineProperty(socket, "binaryType", {
        get() {
          if (this._realSocket) return this._realSocket.binaryType;
          return this._binaryType || "blob";
        },
        set(value) {
          this._binaryType = value;
          if (this._realSocket) {
            this._realSocket.binaryType = value;
          }
        },
      });
      socket._realSocket = OrigWebSocket
        ? new OrigWebSocket(...createArgs)
        : null;
      if (socket._realSocket) {
        if (socket._binaryType) {
          socket._realSocket.binaryType = socket._binaryType;
        }
        socket._realSocket.onmessage = (event) => {
          socket.receive(event.data);
        };
        socket._realSocket.onclose = (event) => {
          socket.readyState = 3;
          if (typeof socket.onclose === "function") {
            socket.onclose(event);
          }
          socket.dispatchEvent(event);
        };
        socket._realSocket.onerror = (event) => {
          if (typeof socket.onerror === "function") {
            socket.onerror(event);
          }
          socket.dispatchEvent(event);
        };
        socket._realSocket.onopen = () => {
          const onopen = socket.onopen;
          if (typeof onopen === "function") {
            onopen(new Event("open"));
          }
          socket.dispatchEvent(new Event("open"));
        };
      } else {
        socket.send({
          InterceptedWebSocket: createArgs,
        });
        queueMicrotask(() => {
          const onopen = socket.onopen;

          if (typeof onopen === "function") {
            onopen(new Event("open"));
          }

          socket.dispatchEvent(new Event("open"));
        });
      }
      return socket;
    }

    InterceptedWebSocket.prototype = Object.create(EventTarget.prototype);
    InterceptedWebSocket.prototype.constructor = InterceptedWebSocket;
    InterceptedWebSocket.CONNECTING = 0;
    InterceptedWebSocket.OPEN = 1;
    InterceptedWebSocket.CLOSING = 2;
    InterceptedWebSocket.CLOSED = 3;

    InterceptedWebSocket.prototype.send = function (clientData) {
      recordSocketActivity(this.initAddress, "send", clientData);
      if (this._realSocket) {
        this._realSocket.send(clientData);
        return;
      }
    };

    InterceptedWebSocket.prototype.close = function () {
      this.readyState = 3;
      if (this._realSocket) {
        this._realSocket.close();
      }
      socketsById.delete(this.id);

      if (typeof this.onclose === "function") {
        this.onclose(new CloseEvent("close"));
      }

      this.dispatchEvent(new CloseEvent("close"));
    };

    InterceptedWebSocket.prototype.receive = function (data) {
      recordSocketActivity(this.initAddress, "receive", data);
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
      socketsById.get(id).receive(serverData);

      if (!window.__gameStarted) {
        window.__gameStarted = true;
        setTimeout(
          () => document.querySelector("#room_center_start_button").click(),
          1000,
        );
      }
    };

    window.WebSocket = InterceptedWebSocket;
  }

  function overrideServiceWorker() {
    const origRegister = navigator.serviceWorker.register;

    const InterceptedRegister = function () {
      for (
        var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
        _key3 < _len3;
        _key3++
      ) {
        args[_key3] = arguments[_key3];
      }

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
        window.history.replaceState(null, "", `/#roomIdx${me.roomId}`);
        document.open();
        document.write(resp);
        document.close();

        if (window.__socketBridgeHandler) {
          window.addEventListener("message", window.__socketBridgeHandler);
        }
      });
  }
})({
  me: {
    roomId: -1,
    gameName: "catann",
    VERSION: "v0.1.2",
    userId: "u_3e83c5cc68115",
  },
  isDev: true,
  future: "2027-01-21T03:44:02.401Z",
  userState: {
    userState: {
      userSessionId: "u_3e83c5cc68115",
      accessLevel: 1,
      colonistCoins: 108000,
      colonistVersion: 1080,
      giftedMemberships: [],
      icon: 11,
      id: "u_3e83c5cc68115",
      interactedWithSite: true,
      isLoggedIn: true,
      hasJoinedColonistDiscordServer: false,
      karma: 20,
      karmaCompletedGameCount: 20,
      membershipPaymentMethod: "Stripe",
      membershipPending: false,
      membership: 5,
      membershipEndDate: "2027-01-21T03:44:02.401Z",
      isMuted: false,
      ownedItems: [
        { category: 1, type: 0 },
        { category: 1, type: 1 },
        { category: 1, type: 2 },
        { category: 1, type: 3 },
        { category: 1, type: 4 },
        { category: 1, type: 5 },
        { category: 1, type: 6 },
        { category: 1, type: 7 },
        { category: 1, type: 8 },
        { category: 1, type: 9 },
        { category: 2, type: 0 },
        { category: 2, type: 1 },
        { category: 2, type: 2 },
        { category: 2, type: 3 },
        { category: 2, type: 4 },
        { category: 2, type: 5 },
        { category: 2, type: 6 },
        { category: 2, type: 7 },
        { category: 2, type: 8 },
        { category: 2, type: 9 },
        { category: 2, type: 10 },
        { category: 2, type: 11 },
        { category: 2, type: 12 },
        { category: 3, type: 0 },
        { category: 3, type: 1 },
        { category: 3, type: 2 },
        { category: 3, type: 3 },
        { category: 3, type: 4 },
        { category: 3, type: 5 },
        { category: 3, type: 6 },
        { category: 3, type: 7 },
        { category: 3, type: 8 },
        { category: 3, type: 9 },
        { category: 3, type: 10 },
        { category: 3, type: 11 },
        { category: 3, type: 12 },
        { category: 3, type: 13 },
        { category: 3, type: 14 },
        { category: 3, type: 15 },
        { category: 3, type: 16 },
        { category: 3, type: 17 },
        { category: 3, type: 18 },
        { category: 3, type: 19 },
        { category: 3, type: 20 },
        { category: 3, type: 21 },
        { category: 3, type: 22 },
        { category: 3, type: 23 },
        { category: 3, type: 24 },
        { category: 3, type: 25 },
      ],
      username: "u_3e83c5cc68115",
      language: null,
      forceSubscription: true,
      expiresAt: "2027-01-21T03:44:02.401Z",
    },
    csrfToken:
      "e3eb1249fa0460b5c60c8c51c405365f88d9b20a0c0e9b6b1684a2b048b4aad0ab6e1f8424b0185bb61b1f6373f9324a94644e964ce348927fc8347eedd7d16b",
    abTests: {},
  },
});
