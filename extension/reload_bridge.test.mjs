import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const reloadBridgeSource = readFileSync(
  new URL("./reload_bridge.js", import.meta.url),
  "utf8",
);
const manifest = JSON.parse(
  readFileSync(new URL("./manifest.json", import.meta.url), "utf8"),
);

const loadReloadBridge = (sendMessage, manifestVersion = "1.0.6") => {
  const logs = [];
  const auditLogs = [];
  const postedMessages = [];
  const runtimeListeners = [];
  const windowMessageListeners = [];
  const window = {
    location: {
      hostname: "terraforming-mars.herokuapp.com",
      origin: "https://terraforming-mars.herokuapp.com",
    },
    addEventListener(type, listener) {
      if (type === "message") {
        windowMessageListeners.push(listener);
      }
    },
    postMessage(message, origin) {
      postedMessages.push({message, origin});
    },
  };
  const chrome = {
    runtime: {
      sendMessage,
      getManifest() {
        return {version: manifestVersion};
      },
      onMessage: {
        addListener(listener) {
          runtimeListeners.push(listener);
        },
      },
    },
  };
  const console = {
    log(...args) {
      if (args[0] === "[tfmars420:audit]") {
        auditLogs.push(args);
      } else {
        logs.push(args);
      }
    },
  };

  vm.runInNewContext(reloadBridgeSource, {chrome, console, window});

  return {
    dispatchWindowMessage(data, overrides = {}) {
      for (const listener of windowMessageListeners) {
        listener({
          source: overrides.source ?? window,
          origin: overrides.origin ?? window.location.origin,
          data,
        });
      }
    },
    dispatchUpdateRequest() {
      this.dispatchWindowMessage({type: "tfmars420:update-content-and-reload"});
    },
    dispatchVersionRequest(overrides = {}) {
      this.dispatchWindowMessage(
        {type: "tfmars420:request-extension-version"},
        overrides,
      );
    },
    dispatchRuntimeMessage(message) {
      runtimeListeners.forEach((listener) => listener(message));
    },
    auditLogs,
    logs,
    postedMessages,
  };
};

test("manifest declares version 1.0.6", () => {
  assert.equal(manifest.version, "1.0.6");
});

test("returns the manifest version to a trusted local page request", () => {
  let serviceWorkerCalls = 0;
  const bridge = loadReloadBridge(() => {
    serviceWorkerCalls += 1;
  });

  bridge.dispatchVersionRequest();

  assert.equal(serviceWorkerCalls, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(bridge.postedMessages)), [
    {
      message: {
        type: "tfmars420:extension-version",
        version: "1.0.6",
      },
      origin: "https://terraforming-mars.herokuapp.com",
    },
  ]);
});

test("ignores foreign extension-version requests", () => {
  const bridge = loadReloadBridge(() => Promise.resolve());

  bridge.dispatchVersionRequest({source: {}});
  bridge.dispatchVersionRequest({origin: "https://example.com"});

  assert.deepEqual(bridge.postedMessages, []);
});

test("logs and ignores an unavailable manifest version", () => {
  const bridge = loadReloadBridge(() => Promise.resolve(), "");

  assert.doesNotThrow(() => bridge.dispatchVersionRequest());
  assert.deepEqual(bridge.postedMessages, []);
  assert.equal(bridge.logs.length, 1);
  assert.match(bridge.logs[0][1].message, /missing manifest version/);
  assert.deepEqual(
    bridge.auditLogs.map((entry) => entry[1]),
    [
      "runtime.message.received",
      "runtime.message.attempt",
      "runtime.message.failure",
    ],
  );
});

test("logs a synchronous invalidated-context error instead of throwing", () => {
  const error = new Error("Extension context invalidated.");
  const bridge = loadReloadBridge(() => {
    throw error;
  });

  assert.doesNotThrow(() => bridge.dispatchUpdateRequest());
  assert.deepEqual(bridge.logs, [
    ["[tfmars420 reload bridge] Runtime message failed:", error],
  ]);
  assert.deepEqual(
    bridge.auditLogs.map((entry) => entry[1]),
    ["runtime.message.received", "runtime.message.attempt", "runtime.message.failure"],
  );
  assert.equal(bridge.auditLogs[2][2].error, "Extension context invalidated.");
});

test("logs a rejected runtime message promise", async () => {
  const error = new Error("Could not establish connection.");
  const bridge = loadReloadBridge(() => Promise.reject(error));

  bridge.dispatchUpdateRequest();
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(bridge.logs, [
    ["[tfmars420 reload bridge] Runtime message failed:", error],
  ]);
  assert.deepEqual(
    bridge.auditLogs.map((entry) => entry[1]),
    ["runtime.message.received", "runtime.message.attempt", "runtime.message.failure"],
  );
  assert.equal(bridge.auditLogs[2][2].error, "Could not establish connection.");
});

test("audits a successful runtime message without an error log", async () => {
  const bridge = loadReloadBridge(() => Promise.resolve());

  bridge.dispatchUpdateRequest();
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(bridge.logs, []);
  assert.deepEqual(
    bridge.auditLogs.map((entry) => entry[1]),
    ["runtime.message.received", "runtime.message.attempt", "runtime.message.success"],
  );
});

test("audits forwarding a service-worker reload message to the page", () => {
  const bridge = loadReloadBridge(() => Promise.resolve());

  bridge.dispatchRuntimeMessage({type: "tfmars420:reload-page-after-runtime"});

  assert.deepEqual(JSON.parse(JSON.stringify(bridge.postedMessages)), [
    {
      message: {type: "tfmars420:reload-page-after-runtime"},
      origin: "https://terraforming-mars.herokuapp.com",
    },
  ]);
  assert.deepEqual(
    bridge.auditLogs.map((entry) => entry[1]),
    ["runtime.message.received", "runtime.message.attempt", "runtime.message.success"],
  );
});
