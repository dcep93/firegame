(() => {
  var e,
    t,
    i,
    o,
    r,
    a = {
      5603: (e, t, i) => {
        "use strict";
        i.d(t, { A: () => Z, h: () => o });
        var o = (function (e) {
            return (
              (e[(e.DiceRoll1 = 0)] = "DiceRoll1"),
              (e[(e.DiceRoll2 = 1)] = "DiceRoll2"),
              (e[(e.DiceRoll3 = 2)] = "DiceRoll3"),
              (e[(e.DiceRoll4 = 3)] = "DiceRoll4"),
              (e[(e.YourTurn = 4)] = "YourTurn"),
              (e[(e.FirstReminder = 5)] = "FirstReminder"),
              (e[(e.RoadPlace = 6)] = "RoadPlace"),
              (e[(e.SettlementPlace = 7)] = "SettlementPlace"),
              (e[(e.CityPlace = 8)] = "CityPlace"),
              (e[(e.ShipPlace = 9)] = "ShipPlace"),
              (e[(e.ShipMove = 10)] = "ShipMove"),
              (e[(e.MetropolisPlace = 11)] = "MetropolisPlace"),
              (e[(e.CityWallPlace = 12)] = "CityWallPlace"),
              (e[(e.CityDestroy = 13)] = "CityDestroy"),
              (e[(e.CityImprovement = 14)] = "CityImprovement"),
              (e[(e.RobberPlace = 15)] = "RobberPlace"),
              (e[(e.PiratePlace = 16)] = "PiratePlace"),
              (e[(e.LeaveRoom = 17)] = "LeaveRoom"),
              (e[(e.JoinRoom = 18)] = "JoinRoom"),
              (e[(e.RoomSettingUpdated = 19)] = "RoomSettingUpdated"),
              (e[(e.RoomGetReady = 20)] = "RoomGetReady"),
              (e[(e.ClockTick = 21)] = "ClockTick"),
              (e[(e.MessageNotification = 22)] = "MessageNotification"),
              (e[(e.Click = 23)] = "Click"),
              (e[(e.Victory = 24)] = "Victory"),
              (e[(e.VoteReminder = 25)] = "VoteReminder"),
              (e[(e.AchievementCKProgress = 26)] = "AchievementCKProgress"),
              (e[(e.GameStarted = 27)] = "GameStarted"),
              (e[(e.GameStartedGuitar = 28)] = "GameStartedGuitar"),
              (e[(e.AchievementLargestArmy = 29)] = "AchievementLargestArmy"),
              (e[(e.AchievementLongestRoad = 30)] = "AchievementLongestRoad"),
              (e[(e.SettlementPhaseEnded = 31)] = "SettlementPhaseEnded"),
              (e[(e.SettlementPhaseEndedGuitar = 32)] =
                "SettlementPhaseEndedGuitar"),
              (e[(e.OfferAcceptable = 33)] = "OfferAcceptable"),
              (e[(e.OfferNotAcceptable = 34)] = "OfferNotAcceptable"),
              (e[(e.OfferAccepted = 35)] = "OfferAccepted"),
              (e[(e.OfferRejected = 36)] = "OfferRejected"),
              (e[(e.Reconnect = 37)] = "Reconnect"),
              (e[(e.Disconnect = 38)] = "Disconnect"),
              (e[(e.KnightEquip = 39)] = "KnightEquip"),
              (e[(e.KnightPlace = 40)] = "KnightPlace"),
              (e[(e.KnightUpgrade = 41)] = "KnightUpgrade"),
              (e[(e.DiscardBroadcast = 42)] = "DiscardBroadcast"),
              (e[(e.DiscardNotification = 43)] = "DiscardNotification"),
              (e[(e.BeginnerHintActivated = 44)] = "BeginnerHintActivated"),
              (e[(e.DevelopmentCardBought = 45)] = "DevelopmentCardBought"),
              (e[(e.DevelopmentCardMonopoly = 46)] = "DevelopmentCardMonopoly"),
              (e[(e.DevelopmentCardUsed = 47)] = "DevelopmentCardUsed"),
              e
            );
          })({}),
          r = i(66350),
          a = i(80641),
          n = i(87868),
          c = i(35351),
          s = i(70746),
          l = i(91678),
          d = i(927),
          u = i(35032),
          h = i(25196),
          f = i(83927),
          m = i(28333),
          p = i(41157),
          v = i(1631),
          g = i(6883),
          b = i(91265),
          y = i(81665),
          P = i(45190),
          R = i(77954),
          A = i(15756),
          O = i(87542),
          C = i(87283),
          D = i(69362),
          w = i(82671),
          M = i(77183),
          k = i(27058),
          S = i(89483),
          E = i(881),
          x = i(44957),
          G = i(38271),
          j = i(83476),
          L = i(76861),
          U = i(39384),
          T = i(52533),
          _ = i(66217),
          N = i(34463),
          F = i(92469),
          B = i(62254),
          K = i(57385),
          V = i(93950),
          I = i(54593),
          z = i(22502),
          W = i(45477),
          q = i(5124),
          H = i(10427),
          J = i(31597),
          Y = i(15902),
          $ = i(7572),
          Q = i(96072);
        const X = {
          [o.DiceRoll1]: r,
          [o.DiceRoll2]: a,
          [o.DiceRoll3]: n,
          [o.DiceRoll4]: c,
          [o.YourTurn]: s,
          [o.FirstReminder]: l,
          [o.RoadPlace]: d,
          [o.SettlementPlace]: u,
          [o.CityPlace]: h,
          [o.ShipPlace]: f,
          [o.ShipMove]: m,
          [o.MetropolisPlace]: p,
          [o.CityWallPlace]: v,
          [o.CityDestroy]: g,
          [o.CityImprovement]: b,
          [o.RobberPlace]: y,
          [o.PiratePlace]: P,
          [o.VoteReminder]: R,
          [o.OfferAcceptable]: A,
          [o.OfferNotAcceptable]: O,
          [o.OfferAccepted]: C,
          [o.OfferRejected]: D,
          [o.ClockTick]: w,
          [o.KnightEquip]: M,
          [o.KnightPlace]: k,
          [o.KnightUpgrade]: S,
          [o.DiscardBroadcast]: E,
          [o.DiscardNotification]: x,
          [o.Click]: G,
          [o.MessageNotification]: j,
          [o.JoinRoom]: L,
          [o.LeaveRoom]: U,
          [o.RoomSettingUpdated]: T,
          [o.RoomGetReady]: _,
          [o.AchievementCKProgress]: N,
          [o.AchievementLargestArmy]: F,
          [o.AchievementLongestRoad]: B,
          [o.GameStarted]: K,
          [o.GameStartedGuitar]: V,
          [o.SettlementPhaseEnded]: I,
          [o.SettlementPhaseEndedGuitar]: z,
          [o.Victory]: W,
          [o.Reconnect]: q,
          [o.Disconnect]: H,
          [o.BeginnerHintActivated]: J,
          [o.DevelopmentCardBought]: Y,
          [o.DevelopmentCardUsed]: $,
          [o.DevelopmentCardMonopoly]: Q,
        };
        class Z {
          static get isMuted() {
            return null == this.masterGain || 0 === this.masterGain.gain.value;
          }
          static async init(e = this.DEFAULT_VOLUME) {
            ((this.context = new AudioContext()),
              (this.buffers = new Map()),
              (this.masterGain = this.context.createGain()),
              this.masterGain.connect(this.context.destination),
              (this.masterGain.gain.value = e),
              this.unlockAudioWithFirstUserInteraction(),
              await this.loadAll());
          }
          static async load(e, t) {
            if (void 0 === this.buffers || void 0 === this.context)
              throw new Error("AudioManager not initialized");
            if (this.buffers.has(e)) return;
            const i = await fetch(t);
            if (!i.ok) return void console.error(`Failed to load sound: ${t}`);
            const o = await i.arrayBuffer(),
              r = await this.context.decodeAudioData(o);
            this.buffers.set(e, r);
          }
          static async loadAll() {
            if (null != window.Cypress) return;
            const e = Object.values(o)
              .filter((e) => "number" == typeof e)
              .map((e) => this.load(e, X[e]));
            (await Promise.all(e), this.handleAudioContextLossForIOSMobile());
          }
          static play(e, t = 1, i = 1) {
            if (
              void 0 === this.buffers ||
              void 0 === this.context ||
              void 0 === this.masterGain
            )
              throw new Error("AudioManager not initialized");
            if (this.isMuted) return;
            const o = this.buffers.get(e);
            if (!o) return;
            this.resumeAudioContext();
            const r = this.context.createBufferSource();
            ((r.buffer = o), (r.playbackRate.value = i));
            const a = this.context.createGain();
            ((a.gain.value = t),
              a.connect(this.masterGain),
              r.connect(a),
              r.start(0));
          }
          static setMasterVolume(e) {
            if (null == this.masterGain)
              throw new Error("AudioManager not initialized");
            this.masterGain.gain.value = e;
          }
          static toggleMute() {
            const e = this.isMuted ? this.DEFAULT_VOLUME : 0;
            this.setMasterVolume(e);
          }
          static async resumeAudioContext() {
            if (null == this.context)
              throw new Error("AudioManager not initialized");
            "suspended" === this.context.state && (await this.context.resume());
          }
          static unlockAudioWithFirstUserInteraction() {
            if (null == this.context)
              throw new Error("AudioManager not initialized");
            const e = async () => {
              (await this.resumeAudioContext(),
                document.removeEventListener("click", e));
            };
            document.addEventListener("click", e, { once: !0 });
          }
          static handleAudioContextLossForIOSMobile() {
            document.addEventListener(
              "visibilitychange",
              () => {
                "visible" === document.visibilityState &&
                  setTimeout(async () => {
                    var e;
                    await (null === (e = this.context) || void 0 === e
                      ? void 0
                      : e.resume());
                  }, 500);
              },
              !1,
            );
          }
        }
        Z.DEFAULT_VOLUME = 0.5;
      },
      14600: () => {},
      44626: (e, t, i) => {
        var o = { "./temp_delete_me.png": [74352, 804] };
        function r(e) {
          if (!i.o(o, e))
            return Promise.resolve().then(() => {
              var t = new Error("Cannot find module '" + e + "'");
              throw ((t.code = "MODULE_NOT_FOUND"), t);
            });
          var t = o[e],
            r = t[0];
          return i.e(t[1]).then(() => i.t(r, 17));
        }
        ((r.keys = () => Object.keys(o)), (r.id = 44626), (e.exports = r));
      },
    },
    n = {};
  function c(e) {
    var t = n[e];
    if (void 0 !== t) return t.exports;
    var i = (n[e] = { id: e, loaded: !1, exports: {} });
    return (a[e].call(i.exports, i, i.exports, c), (i.loaded = !0), i.exports);
  }
  ((c.m = a),
    (e = []),
    (c.O = (t, i, o, r) => {
      if (!i) {
        var a = 1 / 0;
        for (d = 0; d < e.length; d++) {
          for (var [i, o, r] = e[d], n = !0, s = 0; s < i.length; s++)
            (!1 & r || a >= r) && Object.keys(c.O).every((e) => c.O[e](i[s]))
              ? i.splice(s--, 1)
              : ((n = !1), r < a && (a = r));
          if (n) {
            e.splice(d--, 1);
            var l = o();
            void 0 !== l && (t = l);
          }
        }
        return t;
      }
      r = r || 0;
      for (var d = e.length; d > 0 && e[d - 1][2] > r; d--) e[d] = e[d - 1];
      e[d] = [i, o, r];
    }),
    (c.n = (e) => {
      var t = e && e.__esModule ? () => e.default : () => e;
      return (c.d(t, { a: t }), t);
    }),
    (i = Object.getPrototypeOf
      ? (e) => Object.getPrototypeOf(e)
      : (e) => e.__proto__),
    (c.t = function (e, o) {
      if ((1 & o && (e = this(e)), 8 & o)) return e;
      if ("object" == typeof e && e) {
        if (4 & o && e.__esModule) return e;
        if (16 & o && "function" == typeof e.then) return e;
      }
      var r = Object.create(null);
      c.r(r);
      var a = {};
      t = t || [null, i({}), i([]), i(i)];
      for (var n = 2 & o && e; "object" == typeof n && !~t.indexOf(n); n = i(n))
        Object.getOwnPropertyNames(n).forEach((t) => (a[t] = () => e[t]));
      return ((a.default = () => e), c.d(r, a), r);
    }),
    (c.d = (e, t) => {
      for (var i in t)
        c.o(t, i) &&
          !c.o(e, i) &&
          Object.defineProperty(e, i, { enumerable: !0, get: t[i] });
    }),
    (c.f = {}),
    (c.e = (e) =>
      Promise.all(Object.keys(c.f).reduce((t, i) => (c.f[i](e, t), t), []))),
    (c.u = (e) =>
      "js/" +
      { 117: "highlight-run", 283: "logrocket", 526: "html2canvas" }[e] +
      "." +
      {
        117: "b4d132275750b4c7e37a",
        283: "488e64bf23cb94d9cc56",
        526: "d5b72c360dac35860227",
      }[e] +
      ".js"),
    (c.miniCssF = (e) => {}),
    (c.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (c.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (o = {}),
    (r = "katan:"),
    (c.l = (e, t, i, a) => {
      if (o[e]) o[e].push(t);
      else {
        var n, s;
        if (void 0 !== i)
          for (
            var l = document.getElementsByTagName("script"), d = 0;
            d < l.length;
            d++
          ) {
            var u = l[d];
            if (
              u.getAttribute("src") == e ||
              u.getAttribute("data-webpack") == r + i
            ) {
              n = u;
              break;
            }
          }
        (n ||
          ((s = !0),
          ((n = document.createElement("script")).charset = "utf-8"),
          (n.timeout = 120),
          c.nc && n.setAttribute("nonce", c.nc),
          n.setAttribute("data-webpack", r + i),
          (n.src = e)),
          (o[e] = [t]));
        var h = (t, i) => {
            ((n.onerror = n.onload = null), clearTimeout(f));
            var r = o[e];
            if (
              (delete o[e],
              n.parentNode && n.parentNode.removeChild(n),
              r && r.forEach((e) => e(i)),
              t)
            )
              return t(i);
          },
          f = setTimeout(
            h.bind(null, void 0, { type: "timeout", target: n }),
            12e4,
          );
        ((n.onerror = h.bind(null, n.onerror)),
          (n.onload = h.bind(null, n.onload)),
          s && document.head.appendChild(n));
      }
    }),
    (c.r = (e) => {
      ("undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 }));
    }),
    (c.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
    (c.j = 651),
    (c.p = "/dist/"),
    (() => {
      c.b = document.baseURI || self.location.href;
      var e = { 251: 0, 630: 0, 651: 0 };
      ((c.f.j = (t, i) => {
        var o = c.o(e, t) ? e[t] : void 0;
        if (0 !== o)
          if (o) i.push(o[2]);
          else {
            var r = new Promise((i, r) => (o = e[t] = [i, r]));
            i.push((o[2] = r));
            var a = c.p + c.u(t),
              n = new Error();
            c.l(
              a,
              (i) => {
                if (c.o(e, t) && (0 !== (o = e[t]) && (e[t] = void 0), o)) {
                  var r = i && ("load" === i.type ? "missing" : i.type),
                    a = i && i.target && i.target.src;
                  ((n.message =
                    "Loading chunk " + t + " failed.\n(" + r + ": " + a + ")"),
                    (n.name = "ChunkLoadError"),
                    (n.type = r),
                    (n.request = a),
                    o[1](n));
                }
              },
              "chunk-" + t,
              t,
            );
          }
      }),
        (c.O.j = (t) => 0 === e[t]));
      var t = (t, i) => {
          var o,
            r,
            [a, n, s] = i,
            l = 0;
          if (a.some((t) => 0 !== e[t])) {
            for (o in n) c.o(n, o) && (c.m[o] = n[o]);
            if (s) var d = s(c);
          }
          for (t && t(i); l < a.length; l++)
            ((r = a[l]), c.o(e, r) && e[r] && e[r][0](), (e[r] = 0));
          return c.O(d);
        },
        i = (self.webpackChunkkatan = self.webpackChunkkatan || []);
      (i.forEach(t.bind(null, 0)), (i.push = t.bind(null, i.push.bind(i))));
    })(),
    c.O(void 0, [175, 50, 906, 728, 804, 67, 993, 96], () => c(71704)));
  var s = c.O(void 0, [175, 50, 906, 728, 804, 67, 993, 96], () => c(26987));
  s = c.O(s);
})();
//# sourceMappingURL=web.d88224967e857de5296c.js.map
