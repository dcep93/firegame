const contentJsUrl =
  "https://raw.githubusercontent.com/dcep93/firegame/master/extension/content.js";

const auditLog = (eventName, details = {}) => {
  try {
    globalThis.console?.log?.("[tfmars420:audit]", eventName, details);
  } catch {
    // Audit logging must never affect extension behavior.
  }
};

const finishUpdate = (tabId) => {
  if (tabId !== undefined) {
    const type = "tfmars420:reload-page-after-runtime";
    auditLog("runtime.message.attempt", { direction: "service-worker-to-tab", type, tabId });
    try {
      const result = chrome.tabs.sendMessage(tabId, { type });
      if (result && typeof result.then === "function") {
        result
          .then(() => {
            auditLog("runtime.message.success", {
              direction: "service-worker-to-tab",
              type,
              tabId,
            });
          })
          .catch((error) => {
            auditLog("runtime.message.failure", {
              direction: "service-worker-to-tab",
              type,
              tabId,
              error: String(error?.message ?? error),
            });
          });
      } else {
        auditLog("runtime.message.success", { direction: "service-worker-to-tab", type, tabId });
      }
    } catch (error) {
      auditLog("runtime.message.failure", {
        direction: "service-worker-to-tab",
        type,
        tabId,
        error: String(error?.message ?? error),
      });
      throw error;
    }
  }
  setTimeout(() => {
    auditLog("runtime.reload.requested", {});
    chrome.runtime.reload();
  }, 100);
};

const downloadUpdatedContentScript = (tabId) => {
  auditLog("download.attempt", { asset: "content.js" });
  chrome.downloads.download(
    {
      url: contentJsUrl,
      filename: "content.js",
      conflictAction: "overwrite",
      saveAs: true,
    },
    (downloadId) => {
      const startError = chrome.runtime.lastError?.message;
      if (downloadId === undefined) {
        const canceled = !startError || /cancel/i.test(startError);
        auditLog(canceled ? "download.canceled" : "download.failure", {
          asset: "content.js",
          ...(startError ? { error: startError } : {}),
        });
        if (startError) {
          console.warn(
            "[tfmars420] content.js download did not start; reloading local extension",
            startError,
          );
        }
        finishUpdate(tabId);
        return;
      }
      auditLog("download.started", { asset: "content.js", downloadId });

      const handleChanged = (delta) => {
        if (delta.id !== downloadId || !delta.state?.current) {
          return;
        }

        if (delta.state.current === "complete") {
          chrome.downloads.onChanged.removeListener(handleChanged);
          auditLog("download.success", { asset: "content.js", downloadId });
          finishUpdate(tabId);
          return;
        }

        if (delta.state.current === "interrupted") {
          chrome.downloads.onChanged.removeListener(handleChanged);
          const reason = delta.error?.current ?? "UNKNOWN";
          if (reason === "USER_CANCELED") {
            auditLog("download.canceled", { asset: "content.js", downloadId, reason });
            finishUpdate(tabId);
            return;
          }
          auditLog("download.failure", { asset: "content.js", downloadId, error: reason });
          console.warn(
            "[tfmars420] content.js download was interrupted",
            reason,
          );
        }
      };

      chrome.downloads.onChanged.addListener(handleChanged);
    },
  );
};

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "tfmars420:update-content-and-reload") {
    auditLog("runtime.message.received", {
      direction: "tab-to-service-worker",
      type: message.type,
      tabId: sender.tab?.id,
    });
    downloadUpdatedContentScript(sender.tab?.id);
    return;
  }
});
