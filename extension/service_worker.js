const contentJsUrl =
  "https://raw.githubusercontent.com/dcep93/firegame/master/extension/content.js";

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

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "tfmars420:update-content-and-reload") {
    downloadUpdatedContentScript(sender.tab?.id);
    return;
  }
});
