(() => {
  const hostname = window.location.hostname;
  const isTerraformingMars = hostname === "terraforming-mars.herokuapp.com";
  const isColonist = hostname === "colonist.io" || hostname.endsWith(".colonist.io");

  if (!isTerraformingMars && !isColonist) {
    return;
  }

  if (window.__TFMARS420_RELOAD_BRIDGE_LOADED) {
    return;
  }
  window.__TFMARS420_RELOAD_BRIDGE_LOADED = true;

  const auditLog = (eventName, details = {}) => {
    try {
      globalThis.console?.log?.("[tfmars420:audit]", eventName, details);
    } catch {
      // Audit logging must never affect extension behavior.
    }
  };

  const postExtensionVersion = () => {
    const type = "tfmars420:extension-version";
    auditLog("runtime.message.attempt", {
      direction: "reload-bridge-to-page",
      type,
    });
    try {
      const version = chrome.runtime.getManifest()?.version;
      if (typeof version !== "string" || !version) {
        throw new Error("missing manifest version");
      }
      window.postMessage({type, version}, window.location.origin);
      auditLog("runtime.message.success", {
        direction: "reload-bridge-to-page",
        type,
      });
    } catch (error) {
      auditLog("runtime.message.failure", {
        direction: "reload-bridge-to-page",
        type,
        error: String(error?.message ?? error),
      });
      console.log("[tfmars420 reload bridge] Manifest version failed:", error);
    }
  };

  const logRuntimeMessageFailure = (error) => {
    auditLog("runtime.message.failure", {
      direction: "page-to-service-worker",
      type: "tfmars420:update-content-and-reload",
      error: String(error?.message ?? error),
    });
    console.log("[tfmars420 reload bridge] Runtime message failed:", error);
  };

  const requestContentUpdateAndReload = () => {
    const type = "tfmars420:update-content-and-reload";
    auditLog("runtime.message.attempt", { direction: "page-to-service-worker", type });
    try {
      const result = chrome.runtime.sendMessage({ type });
      if (result && typeof result.then === "function") {
        result
          .then(() => {
            auditLog("runtime.message.success", { direction: "page-to-service-worker", type });
          })
          .catch(logRuntimeMessageFailure);
      } else {
        auditLog("runtime.message.success", { direction: "page-to-service-worker", type });
      }
    } catch (error) {
      logRuntimeMessageFailure(error);
    }
  };

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== window.location.origin) {
      return;
    }
    if (event.data?.type === "tfmars420:request-extension-version") {
      auditLog("runtime.message.received", {
        direction: "page-to-reload-bridge",
        type: event.data.type,
      });
      postExtensionVersion();
      return;
    }
    if (event.data?.type === "tfmars420:update-content-and-reload") {
      auditLog("runtime.message.received", {
        direction: "page-to-reload-bridge",
        type: event.data.type,
      });
      requestContentUpdateAndReload();
      return;
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== "tfmars420:reload-page-after-runtime") {
      return;
    }

    auditLog("runtime.message.received", {
      direction: "service-worker-to-reload-bridge",
      type: message.type,
    });
    auditLog("runtime.message.attempt", {
      direction: "reload-bridge-to-page",
      type: message.type,
    });
    try {
      window.postMessage({ type: message.type }, window.location.origin);
      auditLog("runtime.message.success", {
        direction: "reload-bridge-to-page",
        type: message.type,
      });
    } catch (error) {
      auditLog("runtime.message.failure", {
        direction: "reload-bridge-to-page",
        type: message.type,
        error: String(error?.message ?? error),
      });
      throw error;
    }
  });
})();
