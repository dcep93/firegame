function main() {
  console.log("overrides.js::main");
  overrideXHR();
  overrideWebsocket();
}

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
    if (__meta.url === "/api/profile/friends")
      return JSON.stringify({
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
      });
    if (__meta.url === "/api/user-state") {
      return {
        userState: {
          accessLevel: 1,
          colonistCoins: 0,
          colonistVersion: 1080,
          giftedMemberships: [],
          icon: 11,
          id: "35001253",
          interactedWithSite: true,
          isLoggedIn: true,
          hasJoinedColonistDiscordServer: false,
          karma: 20,
          karmaCompletedGameCount: 20,
          membershipPaymentMethod: "Stripe",
          membershipPending: false,
          isMuted: false,
          items: {
            getCurrentMembership: () => ({
              image: "icon_profile_membership",
              pending: false,
              type: "Premium",
            }),
            hasAccessToPremiumMode: () => true,
          },
          ownedItems: [],
          //   totalCompletedGameCount: 441,
          //   ckTotalGameCount: 0,
          //   ckNextRerollAt: "2026-01-17T19:30:46.992Z",
          username: "username",
          language: null,
          //   usernameChangeAttemptsLeft: 0,
          forceSubscription: true,
          //   vliHash:
          //     "be7ff6257c114e96bf8bd088e74f557e7d0763d174985bb66a9f00b0df4e0661",
          expiresAt: "3000-01-01T00:00:00.000Z",
        },
        // csrfToken:
        //   "f8f6dfb42fb8eb7f534b0fc9b3aa01000dbf64475c90ac7263b94297059b414f6fe11edef4f28581c61af04c8784956d9325b72705e76a2853a6e679e0dadd55",
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
    }
    throw new Error(`not implemented: ${JSON.stringify(__meta)}`);
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

function overrideWebsocket() {}

main();
