const contentJsUrl =
  "https://raw.githubusercontent.com/dcep93/firegame/master/extension/content.js";
const sessionFallback = {};

const finishUpdate = (tabId) => {
  if (tabId !== undefined) {
    chrome.tabs.sendMessage(tabId, { type: "tfmars420:reload-page-after-runtime" });
  }
  setTimeout(() => chrome.runtime.reload(), 100);
};

const downloadUpdatedContentScript = (tabId) => {
  chrome.downloads.download(
    {
      url: contentJsUrl,
      filename: "content.js",
      conflictAction: "overwrite",
      saveAs: true,
    },
    (downloadId) => {
      if (chrome.runtime.lastError || downloadId === undefined) {
        console.warn(
          "[tfmars420] content.js download did not start",
          chrome.runtime.lastError?.message,
        );
        return;
      }

      const handleChanged = (delta) => {
        if (delta.id !== downloadId || !delta.state?.current) {
          return;
        }

        if (delta.state.current === "complete") {
          chrome.downloads.onChanged.removeListener(handleChanged);
          finishUpdate(tabId);
          return;
        }

        if (delta.state.current === "interrupted") {
          chrome.downloads.onChanged.removeListener(handleChanged);
          console.warn("[tfmars420] content.js download was interrupted");
        }
      };

      chrome.downloads.onChanged.addListener(handleChanged);
    },
  );
};

const getSessionValue = async (key) => {
  if (chrome.storage?.session) {
    const values = await chrome.storage.session.get(key);
    return values[key];
  }
  return sessionFallback[key];
};

const setSessionValue = async (key, value) => {
  if (chrome.storage?.session) {
    await chrome.storage.session.set({ [key]: value });
    return;
  }
  sessionFallback[key] = value;
};

const removeSessionValue = async (key) => {
  if (chrome.storage?.session) {
    await chrome.storage.session.remove(key);
    return;
  }
  delete sessionFallback[key];
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "tfmars420:update-content-and-reload") {
    downloadUpdatedContentScript(sender.tab?.id);
    return;
  }

  if (message?.type === "tfmars420:session-get") {
    getSessionValue(message.key)
      .then((value) => sendResponse({ ok: true, value }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message?.type === "tfmars420:session-set") {
    setSessionValue(message.key, message.value)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message?.type === "tfmars420:session-remove") {
    removeSessionValue(message.key)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }
});
