(function main(_ref) {
  let { me, isDev, future, userState } = _ref;
  window.parent = {
    postMessage: () => {
      throw new Error("postMessage");
    },
  };
  overrideXHR();
  overrideWebsocket();
  //   overrideServiceWorker();
  choreo();
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

    function decodeSocketBytes(bytes) {
      if (!bytes || bytes.length < 3) return undefined;

      let offset = 0;
      const header = [bytes[offset++], bytes[offset++]];
      const channelLength = bytes[offset++] ?? 0;
      if (bytes.length < offset + channelLength) return undefined;

      const channelBytes = bytes.slice(offset, offset + channelLength);
      offset += channelLength;

      const isPrintableAscii = (data) =>
        data.every((byte) => byte >= 32 && byte <= 126);

      const decodeText = (() => {
        if (typeof TextDecoder !== "undefined") {
          const decoder = new TextDecoder("utf-8");
          return (data) => decoder.decode(data);
        }
        return (data) => String.fromCharCode(...Array.from(data));
      })();

      if (!isPrintableAscii(channelBytes)) return undefined;
      const channel = decodeText(channelBytes);

      const decodeValue = () => {
        if (offset >= bytes.length) return undefined;
        const byte = bytes[offset++];
        if (byte === undefined) return undefined;

        if (byte <= 0x7f) return byte;
        if (byte >= 0xe0) return byte - 0x100;

        if (byte >= 0xa0 && byte <= 0xbf) {
          const length = byte & 0x1f;
          if (offset + length > bytes.length) return undefined;
          const value = decodeText(bytes.slice(offset, offset + length));
          offset += length;
          return value;
        }

        if (byte >= 0x90 && byte <= 0x9f) {
          const length = byte & 0x0f;
          const arr = new Array(length);
          for (let i = 0; i < length; i += 1) {
            arr[i] = decodeValue();
          }
          return arr;
        }

        if (byte >= 0x80 && byte <= 0x8f) {
          const length = byte & 0x0f;
          const obj = {};
          for (let i = 0; i < length; i += 1) {
            const key = decodeValue();
            obj[String(key)] = decodeValue();
          }
          return obj;
        }

        switch (byte) {
          case 0xc0:
            return null;
          case 0xc2:
            return false;
          case 0xc3:
            return true;
          case 0xcc: {
            if (offset + 1 > bytes.length) return undefined;
            const value = bytes[offset];
            offset += 1;
            return value;
          }
          case 0xcd: {
            if (offset + 2 > bytes.length) return undefined;
            const value = (bytes[offset] << 8) | bytes[offset + 1];
            offset += 2;
            return value;
          }
          case 0xce: {
            if (offset + 4 > bytes.length) return undefined;
            const value =
              bytes[offset] * 2 ** 24 +
              (bytes[offset + 1] << 16) +
              (bytes[offset + 2] << 8) +
              bytes[offset + 3];
            offset += 4;
            return value;
          }
          case 0xd0: {
            if (offset + 1 > bytes.length) return undefined;
            const value = (bytes[offset] << 24) >> 24;
            offset += 1;
            return value;
          }
          case 0xd1: {
            if (offset + 2 > bytes.length) return undefined;
            const value = (bytes[offset] << 8) | bytes[offset + 1];
            offset += 2;
            return (value << 16) >> 16;
          }
          case 0xd2: {
            if (offset + 4 > bytes.length) return undefined;
            const value =
              (bytes[offset] << 24) |
              (bytes[offset + 1] << 16) |
              (bytes[offset + 2] << 8) |
              bytes[offset + 3];
            offset += 4;
            return value;
          }
          case 0xd9: {
            const length = bytes[offset];
            if (offset + 1 + length > bytes.length) return undefined;
            offset += 1;
            const value = decodeText(bytes.slice(offset, offset + length));
            offset += length;
            return value;
          }
          case 0xda: {
            const length = (bytes[offset] << 8) | bytes[offset + 1];
            if (offset + 2 + length > bytes.length) return undefined;
            offset += 2;
            const value = decodeText(bytes.slice(offset, offset + length));
            offset += length;
            return value;
          }
          case 0xdb: {
            const length =
              bytes[offset] * 2 ** 24 +
              (bytes[offset + 1] << 16) +
              (bytes[offset + 2] << 8) +
              bytes[offset + 3];
            if (offset + 4 + length > bytes.length) return undefined;
            offset += 4;
            const value = decodeText(bytes.slice(offset, offset + length));
            offset += length;
            return value;
          }
          case 0xdc: {
            const length = (bytes[offset] << 8) | bytes[offset + 1];
            if (offset + 2 > bytes.length) return undefined;
            offset += 2;
            const arr = new Array(length);
            for (let i = 0; i < length; i += 1) {
              arr[i] = decodeValue();
            }
            return arr;
          }
          case 0xdd: {
            const length =
              bytes[offset] * 2 ** 24 +
              (bytes[offset + 1] << 16) +
              (bytes[offset + 2] << 8) +
              bytes[offset + 3];
            if (offset + 4 > bytes.length) return undefined;
            offset += 4;
            const arr = new Array(length);
            for (let i = 0; i < length; i += 1) {
              arr[i] = decodeValue();
            }
            return arr;
          }
          case 0xde: {
            const length = (bytes[offset] << 8) | bytes[offset + 1];
            if (offset + 2 > bytes.length) return undefined;
            offset += 2;
            const obj = {};
            for (let i = 0; i < length; i += 1) {
              const key = decodeValue();
              obj[String(key)] = decodeValue();
            }
            return obj;
          }
          case 0xdf: {
            const length =
              bytes[offset] * 2 ** 24 +
              (bytes[offset + 1] << 16) +
              (bytes[offset + 2] << 8) +
              bytes[offset + 3];
            if (offset + 4 > bytes.length) return undefined;
            offset += 4;
            const obj = {};
            for (let i = 0; i < length; i += 1) {
              const key = decodeValue();
              obj[String(key)] = decodeValue();
            }
            return obj;
          }
          default:
            return undefined;
        }
      };

      const payload = decodeValue();
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        return { channel, _header: header, ...payload };
      }

      return { channel, _header: header, payload };
    }

    function decodeMessagepack(bytes) {
      let offset = 0;

      const decodeText = (() => {
        if (typeof TextDecoder !== "undefined") {
          const decoder = new TextDecoder("utf-8");
          return (data) => decoder.decode(data);
        }
        return (data) => String.fromCharCode(...Array.from(data));
      })();

      const read = (length) => {
        if (offset + length > bytes.length) return null;
        const slice = bytes.slice(offset, offset + length);
        offset += length;
        return slice;
      };

      const readUInt = (length) => {
        const slice = read(length);
        if (!slice) return undefined;
        let value = 0;
        for (let i = 0; i < slice.length; i += 1) {
          value = (value << 8) | slice[i];
        }
        return value >>> 0;
      };

      const readInt = (length) => {
        const slice = read(length);
        if (!slice) return undefined;
        let value = 0;
        for (let i = 0; i < slice.length; i += 1) {
          value = (value << 8) | slice[i];
        }
        const signBit = 1 << (length * 8 - 1);
        if (value & signBit) {
          value = value - 2 ** (length * 8);
        }
        return value;
      };

      const readFloat = (length) => {
        const slice = read(length);
        if (!slice) return undefined;
        const view = new DataView(
          slice.buffer,
          slice.byteOffset,
          slice.byteLength,
        );
        return length === 4 ? view.getFloat32(0) : view.getFloat64(0);
      };

      const decodeValue = () => {
        if (offset >= bytes.length) return undefined;
        const byte = bytes[offset++];

        if (byte <= 0x7f) return byte;
        if (byte >= 0xe0) return byte - 0x100;

        if (byte >= 0xa0 && byte <= 0xbf) {
          const length = byte & 0x1f;
          const slice = read(length);
          if (!slice) return undefined;
          return decodeText(slice);
        }

        if (byte >= 0x90 && byte <= 0x9f) {
          const length = byte & 0x0f;
          const arr = new Array(length);
          for (let i = 0; i < length; i += 1) {
            arr[i] = decodeValue();
          }
          return arr;
        }

        if (byte >= 0x80 && byte <= 0x8f) {
          const length = byte & 0x0f;
          const obj = {};
          for (let i = 0; i < length; i += 1) {
            const key = decodeValue();
            obj[String(key)] = decodeValue();
          }
          return obj;
        }

        switch (byte) {
          case 0xc0:
            return null;
          case 0xc2:
            return false;
          case 0xc3:
            return true;
          case 0xc4: {
            const length = readUInt(1);
            const slice = length !== undefined ? read(length) : null;
            return slice ? slice : undefined;
          }
          case 0xc5: {
            const length = readUInt(2);
            const slice = length !== undefined ? read(length) : null;
            return slice ? slice : undefined;
          }
          case 0xc6: {
            const length = readUInt(4);
            const slice = length !== undefined ? read(length) : null;
            return slice ? slice : undefined;
          }
          case 0xca:
            return readFloat(4);
          case 0xcb:
            return readFloat(8);
          case 0xcc:
            return readUInt(1);
          case 0xcd:
            return readUInt(2);
          case 0xce:
            return readUInt(4);
          case 0xd0:
            return readInt(1);
          case 0xd1:
            return readInt(2);
          case 0xd2:
            return readInt(4);
          case 0xd9: {
            const length = readUInt(1);
            const slice = length !== undefined ? read(length) : null;
            return slice ? decodeText(slice) : undefined;
          }
          case 0xda: {
            const length = readUInt(2);
            const slice = length !== undefined ? read(length) : null;
            return slice ? decodeText(slice) : undefined;
          }
          case 0xdb: {
            const length = readUInt(4);
            const slice = length !== undefined ? read(length) : null;
            return slice ? decodeText(slice) : undefined;
          }
          case 0xdc: {
            const length = readUInt(2);
            if (length === undefined) return undefined;
            const arr = new Array(length);
            for (let i = 0; i < length; i += 1) {
              arr[i] = decodeValue();
            }
            return arr;
          }
          case 0xdd: {
            const length = readUInt(4);
            if (length === undefined) return undefined;
            const arr = new Array(length);
            for (let i = 0; i < length; i += 1) {
              arr[i] = decodeValue();
            }
            return arr;
          }
          case 0xde: {
            const length = readUInt(2);
            if (length === undefined) return undefined;
            const obj = {};
            for (let i = 0; i < length; i += 1) {
              const key = decodeValue();
              obj[String(key)] = decodeValue();
            }
            return obj;
          }
          case 0xdf: {
            const length = readUInt(4);
            if (length === undefined) return undefined;
            const obj = {};
            for (let i = 0; i < length; i += 1) {
              const key = decodeValue();
              obj[String(key)] = decodeValue();
            }
            return obj;
          }
          default:
            return undefined;
        }
      };

      return decodeValue();
    }

    function unpackSocketData(type, data) {
      try {
        if (data instanceof ArrayBuffer) {
          const bytes = new Uint8Array(data);
          return type === "receive"
            ? decodeMessagepack(bytes)
            : decodeSocketBytes(bytes);
        }
        if (ArrayBuffer.isView(data)) {
          const bytes = new Uint8Array(
            data.buffer,
            data.byteOffset,
            data.byteLength,
          );
          return type === "receive"
            ? decodeMessagepack(bytes)
            : decodeSocketBytes(bytes);
        }
        if (typeof data === "string") {
          return data;
        }
      } catch (error) {
        return { error: String(error?.message || error) };
      }
      return undefined;
    }

    function recordSocketActivity(socketInitAddress, type, data) {
      const parsed = unpackSocketData(type, data);
      const entry = {
        // socketInitAddress,
        type,
        data: parsed !== undefined ? parsed : { error: "socket unpack failed" },
      };
      // console.log("socket activity", entry);
      socketActivity.push(entry);
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

  function choreo() {
    console.log("choreo");
    setTimeout(() => {
      document.body.querySelector(".web-sidebar-lobby").click();
      setTimeout(() => {
        document.body.querySelector("#m-lobby-create-room-btn").click();
        setTimeout(() => {
          console.log(document.body.querySelector("#room_center_start_button"));
          __socketActivity.splice(0);
          document.body.querySelector("#room_center_start_button").click();
          setTimeout(() => console.log(__socketActivity.slice()), 1000);
        }, 2000);
      }, 2000);
    }, 2000);
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
      accessLevel: 1,
      colonistCoins: 0,
      colonistVersion: 2880,
      giftedMemberships: [],
      icon: 12,
      id: "101977055",
      interactedWithSite: false,
      isLoggedIn: false,
      hasJoinedColonistDiscordServer: false,
      karma: 0,
      karmaCompletedGameCount: 0,
      membershipPaymentMethod: null,
      membershipPending: false,
      isMuted: false,
      ownedItems: [],
      totalCompletedGameCount: 0,
      ckTotalGameCount: 0,
      ckNextRerollAt: "2026-01-26T04:47:13.672Z",
      username: "Cyna#2570",
      language: null,
      usernameChangeAttemptsLeft: 1,
      forceSubscription: true,
      expiresAt: "2026-02-25T03:47:13.672Z",
    },
    csrfToken:
      "d59716ba881c79e87225d0f77995ee75cdf67da802a33d2ef9bc5062fba44925c36443e6943cc3f93e5359ca4e04d76c89063546244ebf4e8b36d028d785c187",
    abTests: {
      BOT_GAME_TAB_CTA: "DEFAULT",
      CHAT_TOXICITY_SHOW_MONITORED_WARNING: "SHOW_CHAT_IS_MONITORED_WARNING",
      CK_MONETIZATION_DICE_ROLL: "FREE_PLAYS_THEN_DICE_ROLL",
      GIFTING_CHANGE_BEST_VALUE_HINT: "SHOW_MOST_POPULAR",
      MOBILE_MY_TURN_NOTIFICATION: "SEND_MOBILE_MY_TURN_NOTIFICATION",
      REACTIVATE_DISCORD_INACTIVE_USERS: "GROUP_C_GET_FREE_AVATAR",
      REFERRAL_PROGRAM: "REFERRAL_PROGRAM_ACTIVE",
    },
  },
});
