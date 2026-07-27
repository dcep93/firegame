import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const reloadBridgeSource = readFileSync(
  new URL("./reload_bridge.js", import.meta.url),
  "utf8",
);

const loadReloadBridge = (sendMessage) => {
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
    dispatchUpdateRequest() {
      for (const listener of windowMessageListeners) {
        listener({
          source: window,
          origin: window.location.origin,
          data: {type: "tfmars420:update-content-and-reload"},
        });
      }
    },
    dispatchRuntimeMessage(message) {
      runtimeListeners.forEach((listener) => listener(message));
    },
    auditLogs,
    logs,
    postedMessages,
  };
};

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
