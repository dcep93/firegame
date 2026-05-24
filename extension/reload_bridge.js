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

  const postSessionResponse = (requestId, response) => {
    window.postMessage(
      { type: "tfmars420:session-response", requestId, response },
      window.location.origin,
    );
  };

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== window.location.origin) {
      return;
    }
    if (event.data?.type === "tfmars420:update-content-and-reload") {
      chrome.runtime.sendMessage({ type: "tfmars420:update-content-and-reload" });
      return;
    }

    if (
      event.data?.type === "tfmars420:session-get" ||
      event.data?.type === "tfmars420:session-set" ||
      event.data?.type === "tfmars420:session-remove"
    ) {
      const { requestId, type, key, value } = event.data;
      chrome.runtime.sendMessage({ type, key, value }, (response) => {
        if (chrome.runtime.lastError) {
          postSessionResponse(requestId, {
            ok: false,
            error: chrome.runtime.lastError.message,
          });
          return;
        }
        postSessionResponse(requestId, response);
      });
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== "tfmars420:reload-page-after-runtime") {
      return;
    }

    window.postMessage({ type: "tfmars420:reload-page-after-runtime" }, window.location.origin);
  });
})();
