import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

const serviceWorkerSource = readFileSync(
  new URL("./service_worker.js", import.meta.url),
  "utf8",
);

const loadServiceWorker = () => {
  const runtimeListeners = [];
  const downloadListeners = new Set();
  const downloadCalls = [];
  const tabMessages = [];
  const reloadDelays = [];
  const warnings = [];
  const auditLogs = [];
  let downloadCallback = null;
  let runtimeLastError;
  let runtimeReloadCount = 0;

  const chrome = {
    runtime: {
      get lastError() {
        return runtimeLastError;
      },
      onMessage: {
        addListener(listener) {
          runtimeListeners.push(listener);
        },
      },
      reload() {
        runtimeReloadCount += 1;
      },
    },
    tabs: {
      sendMessage(tabId, message) {
        tabMessages.push({tabId, message});
      },
    },
    downloads: {
      download(options, callback) {
        downloadCalls.push(options);
        downloadCallback = callback;
      },
      onChanged: {
        addListener(listener) {
          downloadListeners.add(listener);
        },
        removeListener(listener) {
          downloadListeners.delete(listener);
        },
      },
    },
  };
  const console = {
    log(...args) {
      auditLogs.push(args);
    },
    warn(...args) {
      warnings.push(args);
    },
  };
  const setTimeout = (callback, delay) => {
    reloadDelays.push(delay);
    callback();
  };

  vm.runInNewContext(serviceWorkerSource, {chrome, console, setTimeout});

  return {
    dispatchRuntimeMessage(message, tabId = 17) {
      runtimeListeners.forEach((listener) => listener(message, {tab: {id: tabId}}));
    },
    resolveDownload(downloadId, lastError) {
      runtimeLastError = lastError;
      downloadCallback?.(downloadId);
      runtimeLastError = undefined;
    },
    dispatchDownloadChange(delta) {
      [...downloadListeners].forEach((listener) => listener(delta));
    },
    downloadCalls,
    auditLogs,
    tabMessages,
    reloadDelays,
    warnings,
    listenerCount: () => downloadListeners.size,
    runtimeReloadCount: () => runtimeReloadCount,
  };
};

const assertReloadedOrigin = (worker, tabId) => {
  assert.equal(worker.tabMessages.length, 1);
  assert.equal(worker.tabMessages[0].tabId, tabId);
  assert.equal(
    worker.tabMessages[0].message.type,
    "tfmars420:reload-page-after-runtime",
  );
  assert.deepEqual(worker.reloadDelays, [100]);
  assert.equal(worker.runtimeReloadCount(), 1);
};

test("keeps the known-working Save As download request", () => {
  const worker = loadServiceWorker();

  worker.dispatchRuntimeMessage({type: "tfmars420:update-content-and-reload"});

  assert.equal(worker.downloadCalls.length, 1);
  assert.deepEqual(
    {...worker.downloadCalls[0]},
    {
      url: "https://raw.githubusercontent.com/dcep93/firegame/master/extension/content.js",
      filename: "content.js",
      conflictAction: "overwrite",
      saveAs: true,
    },
  );
  assert.deepEqual(
    worker.auditLogs.map((entry) => entry[1]),
    ["runtime.message.received", "download.attempt"],
  );
});

test("completed download reloads the originating tab and extension", () => {
  const worker = loadServiceWorker();
  worker.dispatchRuntimeMessage({type: "tfmars420:update-content-and-reload"}, 23);
  worker.resolveDownload(41);

  assert.equal(worker.listenerCount(), 1);
  worker.dispatchDownloadChange({id: 99, state: {current: "complete"}});
  assert.equal(worker.listenerCount(), 1);
  assert.equal(worker.runtimeReloadCount(), 0);

  worker.dispatchDownloadChange({id: 41, state: {current: "complete"}});

  assert.equal(worker.listenerCount(), 0);
  assertReloadedOrigin(worker, 23);
  assert.deepEqual(
    worker.auditLogs.map((entry) => entry[1]),
    [
      "runtime.message.received",
      "download.attempt",
      "download.started",
      "download.success",
      "runtime.message.attempt",
      "runtime.message.success",
      "runtime.reload.requested",
    ],
  );
});

test("cancel before a download id reloads the local extension", () => {
  const worker = loadServiceWorker();
  worker.dispatchRuntimeMessage({type: "tfmars420:update-content-and-reload"}, 29);
  worker.resolveDownload(undefined, {message: "The user canceled the download"});

  assert.equal(worker.listenerCount(), 0);
  assertReloadedOrigin(worker, 29);
  assert.deepEqual(
    worker.auditLogs.map((entry) => entry[1]),
    [
      "runtime.message.received",
      "download.attempt",
      "download.canceled",
      "runtime.message.attempt",
      "runtime.message.success",
      "runtime.reload.requested",
    ],
  );
});

test("USER_CANCELED interruption reloads the local extension", () => {
  const worker = loadServiceWorker();
  worker.dispatchRuntimeMessage({type: "tfmars420:update-content-and-reload"}, 31);
  worker.resolveDownload(43);
  worker.dispatchDownloadChange({
    id: 43,
    state: {current: "interrupted"},
    error: {current: "USER_CANCELED"},
  });

  assert.equal(worker.listenerCount(), 0);
  assertReloadedOrigin(worker, 31);
  assert.deepEqual(
    worker.auditLogs.map((entry) => entry[1]),
    [
      "runtime.message.received",
      "download.attempt",
      "download.started",
      "download.canceled",
      "runtime.message.attempt",
      "runtime.message.success",
      "runtime.reload.requested",
    ],
  );
});

test("other interrupted downloads log their reason without reloading", () => {
  const worker = loadServiceWorker();
  worker.dispatchRuntimeMessage({type: "tfmars420:update-content-and-reload"}, 37);
  worker.resolveDownload(47);
  worker.dispatchDownloadChange({
    id: 47,
    state: {current: "interrupted"},
    error: {current: "NETWORK_FAILED"},
  });

  assert.equal(worker.listenerCount(), 0);
  assert.deepEqual(worker.tabMessages, []);
  assert.equal(worker.runtimeReloadCount(), 0);
  assert.deepEqual(worker.warnings, [
    ["[tfmars420] content.js download was interrupted", "NETWORK_FAILED"],
  ]);
  assert.deepEqual(
    worker.auditLogs.map((entry) => entry[1]),
    [
      "runtime.message.received",
      "download.attempt",
      "download.started",
      "download.failure",
    ],
  );
});

test("unrelated runtime messages do not start downloads", () => {
  const worker = loadServiceWorker();

  worker.dispatchRuntimeMessage({type: "something-else"});

  assert.deepEqual(worker.downloadCalls, []);
  assert.equal(worker.runtimeReloadCount(), 0);
  assert.deepEqual(worker.auditLogs, []);
});
