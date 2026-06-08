(() => {
  const hostname = window.location.hostname;
  const isTerraformingMars = hostname === "terraforming-mars.herokuapp.com";
  const isColonist = hostname === "colonist.io" || hostname.endsWith(".colonist.io");
  const contentScriptVersion = "v0.1.2";

  if (!isTerraformingMars && !isColonist) {
    return;
  }

  if (window.__FIREGAME_EXTENSION_LOADED) {
    return;
  }
  window.__FIREGAME_EXTENSION_LOADED = true;
  window.__TFMARS420_EXTENSION_LOADED = true;

  const requestRuntimeUpdate = () => {
    window.postMessage({ type: "tfmars420:update-content-and-reload" }, window.location.origin);
  };

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== window.location.origin) {
      return;
    }
    if (event.data?.type === "tfmars420:reload-page-after-runtime") {
      window.setTimeout(() => window.location.reload(), 750);
    }
  });

  function startColonist420() {
    const containerSelector = "div.container-cVxpOtTU.gameHelpButtonsLayer-odYlgrig";
    const buttonClass = "firegame-colonist-420";
    const cssId = "firegame-colonist-420-css";
    const overlayId = "firegame-colonist-dice-overlay";

    const upsertColonistCss = () => {
      if (document.getElementById(cssId)) return;
      const style = document.createElement("style");
      style.id = cssId;
      style.textContent = `
        .${buttonClass} {
          align-items: center;
          color: #ff4fbf;
          cursor: pointer;
          display: flex;
          font-family: "Comic Sans MS", "Comic Sans", cursive;
          font-size: 18px;
          font-weight: 700;
          height: 28px;
          justify-content: center;
          line-height: 1;
          text-shadow: 0 1px 0 #ffffff;
          user-select: none;
          width: 28px;
        }

        .${buttonClass}:focus-visible {
          outline: 2px solid #ff4fbf;
          outline-offset: 2px;
        }

        #${overlayId} {
          align-items: stretch;
          background: rgba(0, 0, 0, 0.82);
          box-sizing: border-box;
          color: #f7f1ff;
          display: flex;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          inset: auto;
          justify-content: center;
          overflow: hidden;
          padding: 0;
          position: fixed;
          z-index: 2147483647;
        }

        #${overlayId} .firegame-colonist-dice-panel {
          background: #181a22;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 0;
          box-shadow: none;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: none;
          max-width: none;
          min-height: 0;
          overflow: hidden;
          width: 100%;
        }

        #${overlayId} .firegame-colonist-dice-header {
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          display: flex;
          gap: 16px;
          justify-content: space-between;
          padding: 16px 18px;
        }

        #${overlayId} .firegame-colonist-dice-actions {
          align-items: center;
          display: flex;
          flex-shrink: 0;
          gap: 8px;
        }

        #${overlayId} h2 {
          font-size: 22px;
          line-height: 1.2;
          margin: 0;
        }

        #${overlayId} .firegame-colonist-dice-close {
          background: #ff4fbf;
          border: 0;
          border-radius: 6px;
          color: #111;
          cursor: pointer;
          font: inherit;
          font-weight: 800;
          min-height: 36px;
          padding: 6px 12px;
        }

        #${overlayId} .firegame-colonist-dice-version {
          background: rgba(83, 255, 181, 0.14);
          border: 1px solid rgba(83, 255, 181, 0.42);
          border-radius: 6px;
          color: #9affd0;
          cursor: pointer;
          font: inherit;
          font-weight: 800;
          min-height: 36px;
          padding: 6px 10px;
        }

        #${overlayId} .firegame-colonist-dice-body {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: 16px 18px 20px;
        }

        #${overlayId} table {
          border-collapse: collapse;
          width: 100%;
        }

        #${overlayId} th,
        #${overlayId} td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding: 10px 8px;
          text-align: left;
          vertical-align: top;
        }

        #${overlayId} th {
          color: #ffb7e3;
          font-size: 13px;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        #${overlayId} .firegame-colonist-dice-sum {
          font-size: 20px;
          font-weight: 800;
          width: 72px;
        }

        #${overlayId} .firegame-colonist-dice-empty {
          color: #aaaec0;
        }

        #${overlayId} .firegame-colonist-dice-pill {
          background: rgba(var(--firegame-pill-r), var(--firegame-pill-g), var(--firegame-pill-b), 0.14);
          border: 1px solid rgba(var(--firegame-pill-r), var(--firegame-pill-g), var(--firegame-pill-b), 0.42);
          border-radius: 999px;
          color: rgb(var(--firegame-pill-r), var(--firegame-pill-g), var(--firegame-pill-b));
          display: inline-block;
          font-weight: 800;
          margin: 2px 4px 2px 0;
          padding: 3px 8px;
          white-space: nowrap;
        }
      `;
      (document.head ?? document.documentElement).append(style);
    };

    const numberWordToValue = new Map([
      ["one", 1],
      ["two", 2],
      ["three", 3],
      ["four", 4],
      ["five", 5],
      ["six", 6],
      ["seven", 7],
      ["eight", 8],
      ["nine", 9],
      ["ten", 10],
      ["eleven", 11],
      ["twelve", 12],
    ]);
    const diceModalState = {
      rolls: [],
      seenLogKeys: new Set(),
      refreshTimer: null,
      refreshInFlight: false,
      generation: 0,
      initialized: false,
      initialScanPromise: null,
      boundsCleanup: null,
    };
    const diceValueFromText = (text) => {
      const normalized = text.toLowerCase().replace(/[_-]/g, " ");
      const diceMatch = normalized.match(/\bdice(?: red)?\s*([1-6])\b/);
      if (diceMatch) return Number.parseInt(diceMatch[1], 10);
      const assetMatch = normalized.match(/\bdice(?:_red)?_([1-6])\b/);
      if (assetMatch) return Number.parseInt(assetMatch[1], 10);
      return null;
    };

    const collectDiceValues = (logEntry) => {
      const values = [];
      const seen = new Set();
      for (const element of logEntry.querySelectorAll("img, [aria-label], [title], [alt]")) {
        const candidates = [
          element.getAttribute("alt"),
          element.getAttribute("title"),
          element.getAttribute("aria-label"),
          element.getAttribute("src"),
          element.className,
        ].filter(Boolean);
        for (const candidate of candidates) {
          const value = diceValueFromText(String(candidate));
          if (!value) continue;
          const key = `${values.length}:${candidate}`;
          if (seen.has(key)) continue;
          seen.add(key);
          values.push(value);
          break;
        }
      }
      return values;
    };

    const extractDiceSumFromText = (text) => {
      const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();
      const rolledNumber = normalized.match(/\b(?:rolled|rolls|roll)\s+(?:a\s+)?(?:sum\s+of\s+)?([2-9]|1[0-2])\b/);
      if (rolledNumber) return Number.parseInt(rolledNumber[1], 10);
      const rolledWord = normalized.match(/\b(?:rolled|rolls|roll)\s+(?:a\s+)?(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/);
      if (rolledWord) return numberWordToValue.get(rolledWord[1]) ?? null;
      return null;
    };

    const collectDiceValuesFromText = (text) => {
      const values = [];
      const normalized = text.toLowerCase();
      const tokenPattern = /(?::?dice(?:_red)?[:_\s]?([1-6])\b)|(?:\bdice(?:\s+red)?\s+([1-6])\b)/g;
      let match = tokenPattern.exec(normalized);
      while (match) {
        values.push(Number.parseInt(match[1] ?? match[2], 10));
        match = tokenPattern.exec(normalized);
      }
      return values;
    };

    const looksLikeDiceRollText = (text) => {
      const normalized = text.toLowerCase();
      return /\brolled\b/.test(normalized) && /dice(?:_red)?[:_\s]?[1-6]\b/.test(normalized);
    };

    const wait = (milliseconds) =>
      new Promise((resolve) => window.setTimeout(resolve, milliseconds));

    const getScrollableAncestor = (element) => {
      let current = element?.parentElement ?? null;
      while (current && current !== document.body) {
        if (current.scrollHeight > current.clientHeight + 20) {
          return current;
        }
        current = current.parentElement;
      }
      return null;
    };

    const getVirtualFeed = () => {
      const feedContainer =
        document.querySelector("[class*='gameFeedsContainer']") ??
        document.querySelector("[class*='gameFeed']");
      const virtualScroller =
        feedContainer?.querySelector("[class*='virtualScroller']") ??
        document.querySelector("[class*='virtualScroller']");
      const scrollRoot = getScrollableAncestor(virtualScroller);
      if (!virtualScroller || !scrollRoot) return null;
      return { virtualScroller, scrollRoot };
    };

    const collectVisibleFeedSources = (virtualScroller, collected) => {
      const items = Array.from(
        virtualScroller.querySelectorAll("[data-index][class*='scrollItemContainer']"),
      );
      for (const item of items) {
        const index = Number.parseInt(item.getAttribute("data-index") ?? "", 10);
        if (!Number.isFinite(index) || collected.has(index)) continue;
        const message = item.querySelector("[class*='feedMessage']") ?? item;
        const text = (message.textContent ?? "").replace(/\s+/g, " ").trim();
        if (!text && !message.querySelector("img")) continue;
        collected.set(index, { index, element: message, text });
      }
    };

    const normalizeLogText = (text) => (text ?? "").replace(/\s+/g, " ").trim();

    const sourceKey = (source, sum = "") => {
      if (Number.isFinite(source.index)) {
        return `feed:${source.index}`;
      }
      const text = normalizeLogText(source.text);
      if (text) return `text:${text}:${sum ?? ""}`;
      if (source.element) {
        return `element:${source.element.tagName}:${source.element.id}:${source.element.className}:${sum ?? ""}`;
      }
      return "";
    };

    const collectCurrentVisibleSources = () => {
      const feed = getVirtualFeed();
      if (feed) {
        const collected = new Map();
        collectVisibleFeedSources(feed.virtualScroller, collected);
        return Array.from(collected.values()).sort((first, second) => first.index - second.index);
      }

      const entries = getLogEntries();
      if (entries.length > 0) {
        return entries.map((entry) => ({ element: entry, text: entry.textContent ?? "" }));
      }

      return getVisibleDiceLogLines().map((text) => ({ element: null, text }));
    };

    const collectVirtualFeedSources = async () => {
      const feed = getVirtualFeed();
      if (!feed) return [];
      const { virtualScroller, scrollRoot } = feed;
      const originalScrollTop = scrollRoot.scrollTop;
      const maxScrollTop = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
      const step = Math.max(240, Math.floor(scrollRoot.clientHeight * 0.85));
      const positions = [];
      for (let position = 0; position < maxScrollTop; position += step) {
        positions.push(position);
      }
      positions.push(maxScrollTop);

      const collected = new Map();
      try {
        for (const position of positions) {
          scrollRoot.scrollTop = position;
          await wait(35);
          collectVisibleFeedSources(virtualScroller, collected);
        }
      } finally {
        scrollRoot.scrollTop = originalScrollTop;
      }

      const sources = Array.from(collected.values()).sort((first, second) => first.index - second.index);
      return sources;
    };

    const getFallbackLogEntries = () => {
      const candidates = Array.from(document.querySelectorAll("div, li, p, span"))
        .filter((element) => {
          const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
          if (!looksLikeDiceRollText(text)) return false;
          if (text.length > 500) return false;
          return !Array.from(element.children).some((child) =>
            looksLikeDiceRollText((child.textContent ?? "").replace(/\s+/g, " ").trim()),
          );
        });

      return candidates;
    };

    const getVisibleDiceLogLines = () => {
      const lines = (document.body?.innerText ?? "")
        .split(/\n+/)
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter(looksLikeDiceRollText);
      return lines;
    };

    const getLogEntries = () => {
      const containers = [
        document.getElementById("game-log-text"),
        document.querySelector("[id*='game-log']"),
        document.querySelector("[class*='gameLog']"),
        document.querySelector("[class*='game-log']"),
      ].filter(Boolean);
      const container = containers[0];
      if (!container) return getFallbackLogEntries();
      const children = Array.from(container.children).filter((child) =>
        (child.textContent ?? "").trim() || child.querySelector("img"),
      );
      const entries = children.length > 0 ? children : [container];
      return entries;
    };

    const parseDiceRollSource = (source) => {
      let diceValues = source.element ? collectDiceValues(source.element) : [];
      if (diceValues.length < 2) {
        diceValues = collectDiceValuesFromText(source.text);
      }
      let sum = null;
      if (diceValues.length >= 2) {
        sum = diceValues.slice(0, 2).reduce((total, value) => total + value, 0);
      } else {
        sum = extractDiceSumFromText(source.text);
      }
      if (sum >= 2 && sum <= 12) {
        return {
          key: sourceKey(source, sum),
          roll: { sum },
        };
      }
      return {
        key: sourceKey(source, sum),
        roll: null,
      };
    };

    const indexRolls = (rolls) =>
      rolls.map((roll, index) => ({
        ...roll,
        turnsAgo: rolls.length - index - 1,
      }));

    const getDiceRolls = async () => {
      const rolls = [];
      const seenLogKeys = new Set();
      const virtualSources = await collectVirtualFeedSources();
      const entries = virtualSources.length > 0 ? [] : getLogEntries();
      const sources = virtualSources.length > 0
        ? virtualSources
        : entries.length > 0
          ? entries.map((entry) => ({ element: entry, text: entry.textContent ?? "" }))
          : getVisibleDiceLogLines().map((text) => ({ element: null, text }));
      for (const source of sources) {
        const parsed = parseDiceRollSource(source);
        if (parsed.key) {
          seenLogKeys.add(parsed.key);
        }
        if (parsed.roll) {
          rolls.push(parsed.roll);
        }
      }
      const indexedRolls = indexRolls(rolls);
      return { rolls: indexedRolls, seenLogKeys };
    };

    const loadInitialDiceCache = async () => {
      if (diceModalState.initialScanPromise) {
        return diceModalState.initialScanPromise;
      }

      diceModalState.initialScanPromise = getDiceRolls()
        .then(({ rolls, seenLogKeys }) => {
          diceModalState.rolls = rolls.map(({ sum }) => ({ sum }));
          diceModalState.seenLogKeys = seenLogKeys;
          diceModalState.initialized = true;
          return { rolls, seenLogKeys };
        })
        .finally(() => {
          diceModalState.initialScanPromise = null;
        });

      return diceModalState.initialScanPromise;
    };

    const formatTurnsAgo = (turnsAgo) => String(turnsAgo);

    const recencyColorStyle = (turnsAgo, maxTurnsAgo) => {
      const newest = [83, 255, 181];
      const oldest = [255, 95, 216];
      const ratio = maxTurnsAgo > 0 ? Math.min(Math.max(turnsAgo / maxTurnsAgo, 0), 1) : 0;
      const [red, green, blue] = newest
        .map((channel, index) => Math.round(channel + (oldest[index] - channel) * ratio))
      return `--firegame-pill-r: ${red}; --firegame-pill-g: ${green}; --firegame-pill-b: ${blue};`;
    };

    const renderDiceRows = (rolls) => {
      const bySum = new Map(Array.from({ length: 11 }, (_, index) => [index + 2, []]));
      const maxTurnsAgo = Math.max(0, rolls.length - 1);
      for (const roll of rolls) {
        bySum.get(roll.sum)?.push(roll.turnsAgo);
      }
      return Array.from(bySum.entries())
        .map(([sum, turnsAgoList]) => {
          const contents =
            turnsAgoList.length === 0
              ? `<span class="firegame-colonist-dice-empty">Never rolled</span>`
              : [...turnsAgoList]
                  .sort((first, second) => first - second)
                  .map((turnsAgo) => {
                    const style = recencyColorStyle(turnsAgo, maxTurnsAgo);
                    return `<span class="firegame-colonist-dice-pill" style="${style}">${formatTurnsAgo(turnsAgo)}</span>`;
                  })
                  .join(" ");
          return `
            <tr>
              <td class="firegame-colonist-dice-sum">${sum}</td>
              <td>${turnsAgoList.length}</td>
              <td>${contents}</td>
            </tr>
          `;
        })
        .join("");
    };

    const renderDiceTable = () => {
      const body = document.querySelector(`#${overlayId} .firegame-colonist-dice-body`);
      if (!body) return;
      body.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Sum</th>
              <th>Rolls</th>
              <th>How Many Turns Ago</th>
            </tr>
          </thead>
          <tbody>${renderDiceRows(indexRolls(diceModalState.rolls))}</tbody>
        </table>
      `;
    };

    const refreshDiceOverlay = () => {
      if (!document.getElementById(overlayId)) {
        stopDiceOverlayRefresh();
        return;
      }
      if (diceModalState.refreshInFlight) {
        return;
      }
      diceModalState.refreshInFlight = true;
      try {
        const sources = collectCurrentVisibleSources();
        const newRollsNewestFirst = [];
        for (const source of [...sources].reverse()) {
          const parsed = parseDiceRollSource(source);
          if (parsed.key && diceModalState.seenLogKeys.has(parsed.key)) {
            break;
          }
          if (parsed.key) {
            diceModalState.seenLogKeys.add(parsed.key);
          }
          if (parsed.roll) {
            newRollsNewestFirst.push(parsed.roll);
          }
        }

        if (newRollsNewestFirst.length > 0) {
          diceModalState.rolls.push(...newRollsNewestFirst.reverse());
          renderDiceTable();
        }
      } finally {
        diceModalState.refreshInFlight = false;
      }
    };

    const stopDiceOverlayRefresh = () => {
      if (diceModalState.refreshTimer) {
        window.clearInterval(diceModalState.refreshTimer);
        diceModalState.refreshTimer = null;
      }
      diceModalState.refreshInFlight = false;
    };

    const startDiceOverlayRefresh = () => {
      stopDiceOverlayRefresh();
      diceModalState.refreshTimer = window.setInterval(refreshDiceOverlay, 1000);
    };

    const getDiceOverlayTargetRect = () => {
      const canvases = Array.from(document.querySelectorAll("canvas"));
      const candidates = canvases
        .map((canvas) => {
          const rect = canvas.getBoundingClientRect();
          const style = window.getComputedStyle(canvas);
          return {
            rect,
            area: rect.width * rect.height,
            visible:
              rect.width >= 100 &&
              rect.height >= 100 &&
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0",
          };
        })
        .filter((candidate) => candidate.visible)
        .sort((first, second) => second.area - first.area);

      return candidates[0]?.rect ?? {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    const applyDiceOverlayBounds = () => {
      const overlay = document.getElementById(overlayId);
      if (!overlay) return;
      const rect = getDiceOverlayTargetRect();
      Object.assign(overlay.style, {
        height: `${Math.max(0, rect.height)}px`,
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${Math.max(0, rect.width / 2)}px`,
      });
    };

    const stopDiceOverlayBoundsSync = () => {
      if (!diceModalState.boundsCleanup) return;
      diceModalState.boundsCleanup();
      diceModalState.boundsCleanup = null;
    };

    const startDiceOverlayBoundsSync = () => {
      stopDiceOverlayBoundsSync();
      applyDiceOverlayBounds();
      const resizeObserver = new ResizeObserver(applyDiceOverlayBounds);
      resizeObserver.observe(document.documentElement);
      if (document.body) resizeObserver.observe(document.body);
      window.addEventListener("resize", applyDiceOverlayBounds);
      window.addEventListener("scroll", applyDiceOverlayBounds, true);
      diceModalState.boundsCleanup = () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", applyDiceOverlayBounds);
        window.removeEventListener("scroll", applyDiceOverlayBounds, true);
      };
    };

    const closeDiceOverlay = () => {
      diceModalState.generation++;
      stopDiceOverlayRefresh();
      stopDiceOverlayBoundsSync();
      document.getElementById(overlayId)?.remove();
      document.removeEventListener("keydown", handleOverlayKeydown, true);
    };

    function handleOverlayKeydown(event) {
      if (event.key === "Escape") {
        closeDiceOverlay();
      }
    }

    const showDiceOverlay = async () => {
      upsertColonistCss();
      stopDiceOverlayRefresh();
      stopDiceOverlayBoundsSync();
      document.removeEventListener("keydown", handleOverlayKeydown, true);
      document.getElementById(overlayId)?.remove();
      const generation = ++diceModalState.generation;
      const overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.innerHTML = `
        <section class="firegame-colonist-dice-panel" role="dialog" aria-modal="true" aria-labelledby="firegame-colonist-dice-title">
          <header class="firegame-colonist-dice-header">
            <h2 id="firegame-colonist-dice-title">Dice Rolls</h2>
            <div class="firegame-colonist-dice-actions">
              <button class="firegame-colonist-dice-version" type="button" aria-label="Update Firegame extension">${contentScriptVersion}</button>
              <button class="firegame-colonist-dice-close" type="button">Close</button>
            </div>
          </header>
          <div class="firegame-colonist-dice-body">
            <span class="firegame-colonist-dice-empty">Loading dice history...</span>
          </div>
        </section>
      `;
      overlay.querySelector(".firegame-colonist-dice-version")?.addEventListener("click", requestRuntimeUpdate);
      overlay.querySelector(".firegame-colonist-dice-close")?.addEventListener("click", closeDiceOverlay);
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeDiceOverlay();
      });
      document.addEventListener("keydown", handleOverlayKeydown, true);
      document.body.append(overlay);
      startDiceOverlayBoundsSync();

      if (diceModalState.initialized) {
        renderDiceTable();
        startDiceOverlayRefresh();
        refreshDiceOverlay();
        return;
      }

      await loadInitialDiceCache();
      if (generation !== diceModalState.generation) return;
      if (!document.getElementById(overlayId)) return;
      renderDiceTable();
      startDiceOverlayRefresh();
    };

    const ensureButton = () => {
      upsertColonistCss();
      const container = document.querySelector(containerSelector);
      if (!container) return;
      const existing = Array.from(container.children).find((child) =>
        child.classList.contains(buttonClass),
      );
      if (existing) return;

      const button = document.createElement("div");
      button.className = buttonClass;
      button.textContent = "420";
      button.role = "button";
      button.tabIndex = 0;
      button.setAttribute("aria-label", "Blaze it");
      button.addEventListener("click", showDiceOverlay);
      button.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        showDiceOverlay();
      });
      container.append(button);
    };

    const observe = () => {
      const target = document.body ?? document.documentElement;
      if (!target) {
        window.requestAnimationFrame(observe);
        return;
      }
      ensureButton();
      const observer = new MutationObserver(ensureButton);
      observer.observe(target, { childList: true, subtree: true });
    };

    observe();
  }

  if (isColonist) {
    startColonist420();
    return;
  }

  const previewId = "tfmars420-hand-preview";
  const cssId = "tfmars420-hand-preview-css";
  const cardTypeClasses = new Set([
    "background-color-active",
    "background-color-automated",
    "background-color-ceo",
    "background-color-corporation",
    "background-color-events",
    "background-color-prelude",
    "background-color-standard-project",
  ]);
  const renderedCardRequests = new Set();
  const renderedCardHtmlByKey = new Map();
  const timeWarpPanelId = "tfmars420-timewarp-panel";
  const timeWarpCssId = "tfmars420-timewarp-css";
  const controlsPanelId = "tfmars420-controls";
  const controlsCssId = "tfmars420-controls-css";
  const lobbyPanelId = "tfmars420-lobby-panel";
  const lobbyRootClass = "tfmars420-extension-ui";
  const firebaseLobbyUrl =
    "https://firebase-320421-default-rtdb.firebaseio.com/tfmars420/lobby";
  const extensionActiveStorageKey = "tfmars420:active";
  const queueSessionStorageKey = "tfmars420:session";
  let lastRenderKey = "";
  let clickInFlight = false;
  let extensionActive = true;
  let helpersHiddenCleaned = false;
  let queueUiScheduled = false;
  let queueExecutionAttempted = false;
  let queueExecutionInFlight = false;
  let queueExecutionError = "";

  const debug = new URL(window.location.href).searchParams.has("debug");
  const debugLogEnabled = () => debug;
  const debugLogCounts = new Map();
  const timeWarpLog = (eventName, details = {}, options = {}) => {
    if (!debugLogEnabled()) return;
    const limit = options.limit ?? 20;
    const count = debugLogCounts.get(eventName) ?? 0;
    if (count >= limit) return;
    debugLogCounts.set(eventName, count + 1);
    console.log(`[tfmars420:timewarp] ${eventName}`, details);
  };

  const isPlainObject = (value) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const ready = (callback) => {
    if (document.body) {
      callback();
      return;
    }
    window.requestAnimationFrame(() => ready(callback));
  };

  const scrollToPlayCardAction = () => {
    document.querySelector(".wf-action .btn-submit")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  const handleSingleCardSelectionChange = (event) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    const target = event.target;
    if (
      !event.isTrusted ||
      !(target instanceof HTMLInputElement) ||
      target.type !== "radio" ||
      !target.checked
    ) {
      return;
    }

    const selectCard = target.closest(".wf-component--select-card");
    if (!selectCard || selectCard.querySelector("input[type='checkbox']")) {
      return;
    }

    scrollToPlayCardAction();
  };

  const getScrollSnapshot = () => {
    const scrollingElement = document.scrollingElement ?? document.documentElement;
    const elements = new Set([
      scrollingElement,
      document.documentElement,
      document.body,
      document.querySelector(".log-panel"),
      document.querySelector(".logpanel-scrollable"),
      document.querySelector(".wf-root"),
      document.querySelector(".wf-action"),
      document.querySelector(`#${previewId}`),
    ]);

    return Array.from(elements)
      .filter((element) => element instanceof Element)
      .map((element) => ({
        element,
        left: element.scrollLeft,
        top: element.scrollTop,
      }));
  };

  const restoreScrollSnapshot = (snapshot) => {
    for (const item of snapshot) {
      if (!item.element.isConnected && item.element !== document.documentElement) {
        continue;
      }
      item.element.scrollLeft = item.left;
      item.element.scrollTop = item.top;
    }
  };

  const preserveScrollDuring = (callback) => {
    const snapshot = getScrollSnapshot();
    try {
      return callback();
    } finally {
      restoreScrollSnapshot(snapshot);
      window.requestAnimationFrame(() => restoreScrollSnapshot(snapshot));
    }
  };

  const wait = (milliseconds) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const nextFrame = () =>
    new Promise((resolve) => window.requestAnimationFrame(() => resolve()));

  const cloneJson = (value) => {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  };

  const cleanText = (text) => text.replace(/\s+/g, " ").trim();

  const normalizeCardName = (name) => cleanText(name).toLowerCase();

  const slugifyCardName = (name) =>
    normalizeCardName(name)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const cardNameFromElement = (element) => {
    const clone = element.cloneNode(true);
    for (const noisy of clone.querySelectorAll(
      ".log-tag, .log-resource-megacredits, .card-cost, .card-tags, .prelude-label, .corporation-label, .ceo-label",
    )) {
      noisy.remove();
    }
    return cleanText(clone.textContent ?? "");
  };

  const cardSlugFromElement = (element) =>
    Array.from(element.classList)
      .find(
        (className) =>
          className.startsWith("card-") &&
          ![
            "card-container",
            "card-auto-tall",
            "card-hover-tall",
            "card-hide",
            "card-standard-project",
            "card-unavailable",
          ].includes(className),
      )
      ?.replace(/^card-/, "");

  const getLogCards = () =>
    Array.from(document.querySelectorAll(".log-panel .log-card"))
      .map((card, logIndex) => {
        const name = cardNameFromElement(card);
        const typeClass = Array.from(card.classList).find((className) =>
          cardTypeClasses.has(className),
        );
        const tags = Array.from(card.querySelectorAll(".log-tag"))
          .map((tag) =>
            Array.from(tag.classList).find(
              (className) => className.startsWith("tag-") && className !== "log-tag",
            ),
          )
          .filter(Boolean)
          .map((className) => className.replace(/^tag-/, ""));
        const costText = cleanText(
          card.querySelector(".log-resource-megacredits")?.textContent ?? "",
        );
        const cost = Number.parseInt(costText, 10);
        return {
          name,
          logIndex,
          typeClass,
          tags,
          cost: Number.isFinite(cost) ? cost : undefined,
        };
      })
      .filter((card) => card.name && card.typeClass);

  const getVisibleCards = () =>
    Array.from(document.querySelectorAll(".card-container"))
      .filter((card) => !card.classList.contains("tfmars420-preview-card"))
      .map((card) => {
        const title = card.querySelector(".card-title") ?? card;
        return {
          name: cardNameFromElement(title),
          slug: cardSlugFromElement(card),
          html: card.outerHTML,
        };
      })
      .filter((card) => card.name && card.html);

  const recentCardsFromLog = (logCards) => {
    const newestFirst = [...logCards].reverse();
    const deduped = [];
    const seen = new Set();
    for (const card of newestFirst) {
      const key = normalizeCardName(card.name);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      deduped.push(card);
    }
    return deduped.slice(0, 10);
  };

  const visibleCardMap = (visibleCards) => {
    const cards = new Map();
    for (const card of visibleCards) {
      cards.set(normalizeCardName(card.name), card.html);
      if (card.slug) {
        cards.set(card.slug, card.html);
      }
    }
    for (const [key, html] of renderedCardHtmlByKey.entries()) {
      cards.set(key, html);
    }
    return cards;
  };

  const hasVisibleCard = (visibleCardsByName, card) =>
    visibleCardsByName.has(slugifyCardName(card.name)) ||
    visibleCardsByName.has(normalizeCardName(card.name));

  const cardTypeFromClass = (typeClass) => {
    if (typeClass === "background-color-active") return "Active";
    if (typeClass === "background-color-automated") return "Automated";
    if (typeClass === "background-color-events") return "Event";
    if (typeClass === "background-color-prelude") return "Prelude";
    if (typeClass === "background-color-corporation") return "Corporation";
    if (typeClass === "background-color-ceo") return "CEO";
    if (typeClass === "background-color-standard-project") return "Standard project";
    return "Project";
  };

  const uniqueTags = (card) => {
    const tags = Array.isArray(card.tags) ? card.tags.filter(Boolean) : [];
    if (card.typeClass === "background-color-events" && !tags.includes("event")) {
      tags.push("event");
    }
    return [...new Set(tags)].slice(0, 4);
  };

  const createTagHtml = (tags) => {
    if (tags.length === 0) return "";
    return tags
      .map((tag) => `<div class="card-tag tag-${escapeHtml(tag)}"></div>`)
      .join("");
  };

  const titleSizeClass = (name) => {
    if (name.length > 26) return " title-smaller";
    if (name.length > 23) return " title-small";
    return "";
  };

  const titleHtml = (card) => {
    const title = escapeHtml(card.name.split(":")[0]);
    const typeClass = card.typeClass ? ` ${escapeHtml(card.typeClass)}` : "";
    const sizeClass = titleSizeClass(card.name);
    if (card.typeClass === "background-color-corporation") {
      return `
        <div class="card-title is-corporation">
          <div class="corporation-label">corporation</div>
          <div class="tfmars420-corporation-title" title="${title}">${title}</div>
        </div>
      `;
    }
    if (card.typeClass === "background-color-prelude") {
      return `
        <div class="card-title">
          <div class="prelude-label">prelude</div>
          <div class="card-title${typeClass}${sizeClass}" title="${title}">${title}</div>
        </div>
      `;
    }
    return `
      <div class="card-title">
        <div class="card-title${typeClass}${sizeClass}" title="${title}">${title}</div>
      </div>
    `;
  };

  const createFallbackCardHtml = (card) => {
    const cardName = escapeHtml(card.name);
    const tags = uniqueTags(card);
    const hasCost = typeof card.cost === "number";
    const cost = hasCost ? String(card.cost) : "0";
    const costClass = hasCost ? "card-cost" : "card-cost visibility-hidden";
    const typeLabel = escapeHtml(cardTypeFromClass(card.typeClass));
    const slug = slugifyCardName(card.name);

    return `
      <div class="filterDiv card-container hover-hide-res card-${slug} tfmars420-preview-card" title="${cardName}">
        <div class="card-content-wrapper">
          <div class="card-cost-and-tags">
            <div><div class="${costClass}">${cost}</div></div>
            <div class="card-tags">${createTagHtml(tags)}</div>
          </div>
          ${titleHtml(card)}
          <div class="card-content">
            <div class="tfmars420-preview-art">
              <div class="tfmars420-preview-horizon"></div>
              <div class="tfmars420-preview-sun"></div>
              <div class="tfmars420-preview-type">${typeLabel}</div>
            </div>
            <div class="card-description tfmars420-preview-description">
              Recent card from the visible game log.
            </div>
          </div>
          <div class="card-number">LOG</div>
        </div>
      </div>
    `;
  };

  const previewCss = () => `
    #${previewId} {
      flex: 0 0 var(--tfmars420-log-preview-width, 515px);
      height: var(--tfmars420-log-preview-height, 190px);
      min-width: var(--tfmars420-log-preview-width, 515px);
      overflow: hidden;
      position: relative;
      width: var(--tfmars420-log-preview-width, 515px);
    }
    #${previewId} .tfmars420-preview-strip {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 4px;
      height: 350px;
      max-width: none;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 0 8px 8px;
      width: var(--tfmars420-log-preview-strip-width, 1073px);
      zoom: var(--tfmars420-log-preview-scale, 0.48);
    }
    #${previewId} .cardbox {
      align-items: flex-start;
      display: flex;
      flex: 0 0 250px;
      height: 350px;
      justify-content: flex-start;
      margin: 0 !important;
      max-width: 250px !important;
      min-width: 250px !important;
      overflow: visible;
      position: relative;
      width: 250px !important;
    }
    #${previewId} .card-container {
      box-sizing: border-box;
      cursor: default;
      margin: 0 !important;
      max-height: 350px;
      max-width: 240px;
      min-height: 350px;
      min-width: 240px;
      transform: none !important;
      width: 240px !important;
    }
    #${previewId} .card-container.card-auto-tall .card-content,
    #${previewId} .card-container.card-hover-tall .card-content,
    #${previewId} .card-container.card-hover-tall:hover .card-content,
    #${previewId} .card-container .card-content-corporation {
      max-height: 250px;
      overflow: hidden;
    }
    #${previewId} .card-container.card-auto-tall,
    #${previewId} .card-container.card-hover-tall:hover {
      z-index: 1;
    }
    #${previewId} .tfmars420-preview-card {
      flex: 0 0 240px;
    }
    #${previewId} .tfmars420-preview-card .card-content-wrapper {
      height: 350px;
    }
    #${previewId} .tfmars420-preview-card .card-title {
      line-height: 18px;
      white-space: normal;
    }
    #${previewId} .tfmars420-preview-card .tfmars420-corporation-title {
      align-items: center;
      color: #111;
      display: flex;
      font-size: 16px;
      font-weight: 700;
      height: 100%;
      justify-content: center;
      line-height: 18px;
      padding: 0 8px;
      text-align: center;
      text-transform: uppercase;
    }
    #${previewId} .tfmars420-preview-card .tfmars420-preview-art {
      background:
        radial-gradient(circle at 78% 17%, rgba(255, 235, 165, 0.98) 0 10%, transparent 11%),
        linear-gradient(160deg, #2a2034 0 35%, #793b2b 36% 55%, #c5652d 56% 76%, #dba55a 77% 100%);
      border: 2px solid #2a2018;
      border-radius: 8px;
      box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.48);
      height: 112px;
      margin: 8px auto;
      overflow: hidden;
      position: relative;
      width: 205px;
    }
    #${previewId} .tfmars420-preview-card .tfmars420-preview-horizon {
      background: linear-gradient(180deg, rgba(72, 32, 28, 0), rgba(66, 24, 21, 0.92));
      bottom: 0;
      height: 42px;
      left: 0;
      position: absolute;
      right: 0;
    }
    #${previewId} .tfmars420-preview-card .tfmars420-preview-sun {
      background: rgba(255, 239, 175, 0.9);
      border-radius: 50%;
      box-shadow: 0 0 22px rgba(255, 222, 137, 0.9);
      height: 26px;
      position: absolute;
      right: 24px;
      top: 18px;
      width: 26px;
    }
    #${previewId} .tfmars420-preview-card .tfmars420-preview-type {
      background: rgba(0, 0, 0, 0.5);
      border-radius: 999px;
      bottom: 8px;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      left: 10px;
      letter-spacing: 0;
      padding: 3px 8px;
      position: absolute;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
      text-transform: uppercase;
    }
    #${previewId} .tfmars420-preview-card .tfmars420-preview-description {
      margin: 6px auto 0;
      min-height: 50px;
      width: 190px;
    }
    .tfmars420-log-preview-layout {
      display: flex;
      flex-direction: row;
      width: 90vw;
    }
    .tfmars420-log-preview-layout > .log-panel {
      flex: 0 0 auto;
    }
  `;

  const upsertCss = (id, css) => {
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }
    if (style.textContent !== css) {
      style.textContent = css;
    }
  };

  const controlsCss = () => `
    .${lobbyRootClass} {
      box-sizing: border-box;
      color: #f5f5f5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #${controlsPanelId} {
      align-items: center;
      background: rgba(47, 47, 47, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
      box-sizing: border-box;
      color: #f5f5f5;
      display: flex;
      gap: 12px;
      margin: 8px 0 12px;
      padding: 8px 10px;
      position: relative;
      white-space: nowrap;
      z-index: 5;
      width: fit-content;
    }
    #${controlsPanelId} .tfmars420-controls-logo {
      align-items: center;
      background: transparent;
      border: 0;
      color: #ff4fbf;
      cursor: pointer;
      display: flex;
      font-family: "Comic Sans MS", "Comic Sans", cursive;
      font-size: 34px;
      font-weight: 700;
      height: 58px;
      justify-content: center;
      line-height: 1;
      margin: 0;
      padding: 0;
      text-shadow: 0 1px 0 #ffffff;
      user-select: none;
      width: 72px;
    }
    #${controlsPanelId} .tfmars420-controls-logo.is-inactive {
      filter: grayscale(1);
      opacity: 0.48;
      text-shadow: none;
    }
    #${controlsPanelId} .tfmars420-controls-version {
      background: #5d79bd;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 999px;
      color: #fff;
      cursor: pointer;
      font: 13px/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      min-width: 56px;
      padding: 4px 10px;
    }
    #${controlsPanelId} .tfmars420-controls-version:focus-visible,
    #${controlsPanelId} .tfmars420-controls-logo:focus-visible,
    #${lobbyPanelId} button:focus-visible,
    #${lobbyPanelId} a:focus-visible {
      outline: 2px solid #ff4fbf;
      outline-offset: 2px;
    }
    .tfmars420-newgame-lobby-wrap {
      margin: 0 0 18px;
    }
    .tfmars420-game-lobby-controls {
      list-style: none;
      margin: 0 0 8px;
      padding: 0;
    }
    .tfmars420-player-lobby-controls {
      margin: 8px 0 12px;
    }
    #${lobbyPanelId} {
      background: rgba(47, 47, 47, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
      color: #f5f5f5;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0 0 18px;
      max-width: 620px;
      padding: 10px 12px;
      width: fit-content;
    }
    #${lobbyPanelId} .tfmars420-lobby-row {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    #${lobbyPanelId} .tfmars420-lobby-label {
      color: #d7d7d7;
      font-size: 13px;
      font-weight: 700;
      min-width: 78px;
    }
    #${lobbyPanelId} .tfmars420-lobby-time {
      color: #b9c2d8;
      font-size: 12px;
    }
    #${lobbyPanelId} button,
    #${lobbyPanelId} a {
      background: #ff4fbf;
      border: 0;
      border-radius: 999px;
      color: #111;
      cursor: pointer;
      font: 700 13px/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 5px 10px;
      text-decoration: none;
    }
    #${lobbyPanelId} a:visited {
      color: #111;
    }
    #${lobbyPanelId} .tfmars420-lobby-muted {
      color: #b9c2d8;
      font-size: 13px;
    }
    @media (max-width: 1100px) {
      #${controlsPanelId} {
        border-radius: 8px;
        max-width: 95vw;
      }
    }
  `;

  const ensureAdjacentContainer = ({ targetSelector, wrapperClass, containerId }) => {
    const target = document.querySelector(targetSelector);
    if (!target) return undefined;

    const existing = document.getElementById(containerId);
    if (existing) return existing;

    const parent = target.parentElement;
    if (!parent) return undefined;

    let wrapper = parent;
    if (!parent.classList.contains(wrapperClass)) {
      wrapper = document.createElement("div");
      wrapper.className = wrapperClass;
      parent.insertBefore(wrapper, target);
      wrapper.appendChild(target);
    }

    const container = document.createElement("div");
    container.id = containerId;
    wrapper.appendChild(container);
    return container;
  };

  const readStorageString = (key, fallback = "") => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (error) {
      console.warn("[tfmars420] unable to read localStorage", error);
      return fallback;
    }
  };

  const writeStorageString = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("[tfmars420] unable to write localStorage", error);
    }
  };

  const readExtensionActive = () => {
    const storedValue = readStorageString(extensionActiveStorageKey, "true");
    return storedValue !== "false";
  };

  extensionActive = readExtensionActive();

  const shouldRunTerraformingMarsHelpers = () => extensionActive;

  const setExtensionActive = (active) => {
    if (extensionActive === active) return;
    extensionActive = active;
    writeStorageString(extensionActiveStorageKey, active ? "true" : "false");
    renderControls();
    renderLobbyPanel();
    if (active) {
      helpersHiddenCleaned = false;
      updatePreview();
      scheduleTerraformingMarsUpdate();
    } else {
      cleanupTerraformingMarsHelpersForHidden();
    }
  };

  const reloadRuntime = () => {
    requestRuntimeUpdate();
  };

  const isNewGamePage = () => window.location.pathname === "/new-game";

  const currentGameId = () => {
    if (window.location.pathname !== "/game") return "";
    return new URL(window.location.href).searchParams.get("id") ?? "";
  };

  const findSpectatorListItem = () => {
    const gameHome = document.querySelector("#game-home");
    if (!gameHome) return null;
    for (const item of gameHome.querySelectorAll("li")) {
      const playerName = cleanText(item.querySelector(".player-name")?.textContent ?? "");
      if (playerName.toLowerCase() === "spectator") return item;
    }
    return null;
  };

  const findPlayerSpectatorLinkBlock = () => {
    const playerHome = document.querySelector("#player-home");
    if (!playerHome) return null;
    for (const link of playerHome.querySelectorAll("a")) {
      if (cleanText(link.textContent ?? "").toLowerCase() !== "spectator link") continue;
      return link.closest("div") ?? link;
    }
    return null;
  };

  const getControlsHost = () => {
    if (isNewGamePage()) {
      const createGame = document.querySelector("#create-game");
      if (!createGame) return null;
      let wrapper = document.querySelector(".tfmars420-newgame-lobby-wrap");
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = `${lobbyRootClass} tfmars420-newgame-lobby-wrap`;
        createGame.prepend(wrapper);
      }
      return wrapper;
    }

    const playerSpectatorBlock = findPlayerSpectatorLinkBlock();
    if (playerSpectatorBlock?.parentElement) {
      let wrapper = document.querySelector(".tfmars420-player-lobby-controls");
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = `${lobbyRootClass} tfmars420-player-lobby-controls`;
      }
      if (wrapper.nextElementSibling !== playerSpectatorBlock) {
        playerSpectatorBlock.parentElement.insertBefore(wrapper, playerSpectatorBlock);
      }
      return wrapper;
    }

    const gameId = currentGameId();
    if (!gameId) return null;

    const spectatorItem = findSpectatorListItem();
    if (!spectatorItem?.parentElement) return null;

    let wrapper = document.querySelector(".tfmars420-game-lobby-controls");
    if (!wrapper) {
      wrapper = document.createElement("li");
      wrapper.className = `${lobbyRootClass} tfmars420-game-lobby-controls`;
    }
    if (wrapper.nextElementSibling !== spectatorItem) {
      spectatorItem.parentElement.insertBefore(wrapper, spectatorItem);
    }
    return wrapper;
  };

  const renderControls = () => {
    upsertCss(controlsCssId, controlsCss());
    const host = getControlsHost();
    if (!host) {
      document.getElementById(controlsPanelId)?.remove();
      document.getElementById(lobbyPanelId)?.remove();
      return;
    }

    let panel = document.getElementById(controlsPanelId);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = controlsPanelId;
      panel.className = lobbyRootClass;

      const logo = document.createElement("button");
      logo.type = "button";
      logo.className = "tfmars420-controls-logo";
      logo.title = "Toggle tfmars420";
      logo.textContent = "420";
      logo.addEventListener("click", () => {
        setExtensionActive(!shouldRunTerraformingMarsHelpers());
      });
      panel.appendChild(logo);

      const version = document.createElement("button");
      version.type = "button";
      version.className = "tfmars420-controls-version";
      version.textContent = contentScriptVersion;
      version.addEventListener("click", reloadRuntime);
      panel.appendChild(version);

      host.appendChild(panel);
    } else if (panel.parentElement !== host) {
      host.prepend(panel);
    }

    const logo = panel.querySelector(".tfmars420-controls-logo");
    if (logo) {
      logo.classList.toggle("is-inactive", !shouldRunTerraformingMarsHelpers());
      logo.setAttribute(
        "aria-label",
        shouldRunTerraformingMarsHelpers() ? "Disable tfmars420" : "Enable tfmars420",
      );
    }

    renderLobbyPanel();
  };

  let latestLobbyData = null;
  let lobbyEventSource = null;
  let newGameSettingsWriteTimer = null;
  let newGameSettingsListenersStarted = false;
  let applyingNewGameSettings = false;
  let lastSerializedNewGameSettings = "";
  let lastHandledRemoteNewGameSettingsTimestamp = 0;
  let lastLocalNewGameSettingsEditTimestamp = 0;
  let savedGameId = "";

  const firebaseLobbyFieldUrl = (field) => `${firebaseLobbyUrl}/${field}.json`;

  const firebaseSetLobbyField = async (field, value) => {
    const response = await fetch(firebaseLobbyFieldUrl(field), {
      method: "PUT",
      cache: "no-store",
      credentials: "omit",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  const formatLobbyTimestamp = (timestamp) => {
    if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) return "";
    return new Date(timestamp).toLocaleString();
  };

  const renderLobbyPanel = () => {
    if (!isNewGamePage()) {
      document.getElementById(lobbyPanelId)?.remove();
      return;
    }

    const host = document.querySelector(".tfmars420-newgame-lobby-wrap");
    if (!host) return;

    let panel = document.getElementById(lobbyPanelId);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = lobbyPanelId;
      panel.className = lobbyRootClass;
      host.appendChild(panel);
    } else if (panel.parentElement !== host) {
      host.appendChild(panel);
    }

    panel.innerHTML = "";

    const gameEntry = latestLobbyData?.gameId;
    const settingsEntry = latestLobbyData?.newGameSettings;

    const gameRow = document.createElement("div");
    gameRow.className = "tfmars420-lobby-row";
    const gameLabel = document.createElement("span");
    gameLabel.className = "tfmars420-lobby-label";
    gameLabel.textContent = "Game";
    gameRow.append(gameLabel);
    if (typeof gameEntry?.value === "string" && gameEntry.value.trim()) {
      const link = document.createElement("a");
      link.href = `/game?id=${encodeURIComponent(gameEntry.value.trim())}`;
      link.textContent = gameEntry.value.trim();
      gameRow.append(link);
      const timestamp = document.createElement("span");
      timestamp.className = "tfmars420-lobby-time";
      timestamp.textContent = formatLobbyTimestamp(gameEntry.timestamp);
      gameRow.append(timestamp);
    } else {
      const empty = document.createElement("span");
      empty.className = "tfmars420-lobby-muted";
      empty.textContent = "No game yet.";
      gameRow.append(empty);
    }
    panel.append(gameRow);

    const settingsRow = document.createElement("div");
    settingsRow.className = "tfmars420-lobby-row";
    const settingsLabel = document.createElement("span");
    settingsLabel.className = "tfmars420-lobby-label";
    settingsLabel.textContent = "Settings";
    settingsRow.append(settingsLabel);
    if (settingsEntry?.value?.version === 1 && Array.isArray(settingsEntry.value.controls)) {
      const synced = document.createElement("span");
      synced.className = "tfmars420-lobby-muted";
      synced.textContent = newGameSettingsDrift(settingsEntry.value) ? "Syncing settings..." : "Settings synced";
      settingsRow.append(synced);
      const timestamp = document.createElement("span");
      timestamp.className = "tfmars420-lobby-time";
      timestamp.textContent = formatLobbyTimestamp(settingsEntry.timestamp);
      settingsRow.append(timestamp);
    } else {
      const empty = document.createElement("span");
      empty.className = "tfmars420-lobby-muted";
      empty.textContent = "No shared settings yet.";
      settingsRow.append(empty);
    }
    panel.append(settingsRow);
  };

  const isSerializableNewGameControl = (control) =>
    (control instanceof HTMLInputElement ||
      control instanceof HTMLSelectElement ||
      control instanceof HTMLTextAreaElement) &&
    control.type !== "file" &&
    !control.closest("dialog, .preferences_panel, .sidebar_item--settings") &&
    !control.closest(`.${lobbyRootClass}`);

  const getNewGameControls = () => {
    const createGame = document.querySelector("#create-game");
    if (!createGame) return [];
    return Array.from(createGame.querySelectorAll("input, select, textarea")).filter(
      isSerializableNewGameControl,
    );
  };

  const serializeNewGameSettings = () => {
    const controls = getNewGameControls();
    if (controls.length === 0) return null;

    const idCounts = new Map();
    for (const control of controls) {
      if (!control.id) continue;
      idCounts.set(control.id, (idCounts.get(control.id) ?? 0) + 1);
    }

    const seenIds = new Map();
    return {
      version: 1,
      controls: controls.map((control, index) => {
        const idDuplicateIndex = control.id ? seenIds.get(control.id) ?? 0 : null;
        if (control.id) {
          seenIds.set(control.id, idDuplicateIndex + 1);
        }
        const type = control instanceof HTMLInputElement ? control.type : control.tagName.toLowerCase();
        const item = {
          index,
          tag: control.tagName.toLowerCase(),
          type,
          id: control.id || null,
          idIsUnique: control.id ? idCounts.get(control.id) === 1 : false,
          idDuplicateIndex,
          name: control.getAttribute("name") || null,
          value: control.value,
          valueAttribute: control.getAttribute("value"),
        };
        if (control instanceof HTMLInputElement && (control.type === "checkbox" || control.type === "radio")) {
          item.checked = control.checked;
        }
        return item;
      }),
    };
  };

  const findNewGameControlForSetting = (item) => {
    const controls = getNewGameControls();
    if (!item || controls.length === 0) return null;

    if (item.id) {
      const matches = controls.filter((control) => control.id === item.id);
      if (matches.length === 1) return matches[0];
      if (typeof item.idDuplicateIndex === "number" && matches[item.idDuplicateIndex]) {
        return matches[item.idDuplicateIndex];
      }
    }

    if (item.type === "radio" && item.name) {
      const radio = controls.find(
        (control) =>
          control instanceof HTMLInputElement &&
          control.type === "radio" &&
          control.getAttribute("name") === item.name &&
          control.getAttribute("value") === item.valueAttribute,
      );
      if (radio) return radio;
    }

    return controls[item.index] ?? null;
  };

  const applyControlSetting = (control, item) => {
    if (!control) return;

    if (control instanceof HTMLInputElement && (control.type === "checkbox" || control.type === "radio")) {
      const nextChecked = Boolean(item.checked);
      if (control.checked === nextChecked) return;
      control.checked = nextChecked;
      dispatchBubbledEvent(control, "input");
      dispatchBubbledEvent(control, "change");
      return;
    }

    const nextValue = item.value ?? "";
    if (control.value === nextValue) return;
    control.value = nextValue;
    dispatchBubbledEvent(control, "input");
    dispatchBubbledEvent(control, "change");
  };

  const applyNewGameSettings = (settings) => {
    if (settings?.version !== 1 || !Array.isArray(settings.controls)) return;
    applyingNewGameSettings = true;
    try {
      for (const item of settings.controls) {
        applyControlSetting(findNewGameControlForSetting(item), item);
      }
      lastSerializedNewGameSettings = JSON.stringify(serializeNewGameSettings() ?? {});
    } finally {
      window.setTimeout(() => {
        applyingNewGameSettings = false;
      }, 0);
    }
  };

  const newGameSettingsDrift = (settings) => {
    if (!isNewGamePage() || settings?.version !== 1 || !Array.isArray(settings.controls)) {
      return false;
    }
    const localSettings = serializeNewGameSettings();
    if (!localSettings) return false;
    return JSON.stringify(localSettings) !== JSON.stringify(settings);
  };

  const remoteNewGameSettingsTimestamp = () => {
    const timestamp = latestLobbyData?.newGameSettings?.timestamp;
    return typeof timestamp === "number" && Number.isFinite(timestamp) ? timestamp : 0;
  };

  const autoApplyNewGameSettingsIfNewer = () => {
    if (!isNewGamePage() || !shouldRunTerraformingMarsHelpers() || applyingNewGameSettings) return;
    const timestamp = remoteNewGameSettingsTimestamp();
    if (timestamp <= lastHandledRemoteNewGameSettingsTimestamp) return;
    if (timestamp <= lastLocalNewGameSettingsEditTimestamp) {
      lastHandledRemoteNewGameSettingsTimestamp = timestamp;
      return;
    }

    lastHandledRemoteNewGameSettingsTimestamp = timestamp;
    const settings = latestLobbyData?.newGameSettings?.value;
    if (!newGameSettingsDrift(settings)) return;
    applyNewGameSettings(settings);
    renderLobbyPanel();
  };

  const writeNewGameSettingsFromPage = async () => {
    if (!isNewGamePage() || !shouldRunTerraformingMarsHelpers() || applyingNewGameSettings) return;
    const settings = serializeNewGameSettings();
    if (!settings) return;

    const serialized = JSON.stringify(settings);
    if (serialized === lastSerializedNewGameSettings) return;
    lastSerializedNewGameSettings = serialized;

    const entry = { value: settings, timestamp: Date.now() };
    try {
      await firebaseSetLobbyField("newGameSettings", entry);
      lastHandledRemoteNewGameSettingsTimestamp = Math.max(
        lastHandledRemoteNewGameSettingsTimestamp,
        entry.timestamp,
      );
      latestLobbyData = { ...(latestLobbyData ?? {}), newGameSettings: entry };
      renderLobbyPanel();
    } catch (error) {
      console.warn("[tfmars420] unable to write new game settings", error);
    }
  };

  const scheduleNewGameSettingsWrite = () => {
    window.clearTimeout(newGameSettingsWriteTimer);
    newGameSettingsWriteTimer = window.setTimeout(writeNewGameSettingsFromPage, 450);
  };

  const handleNewGameSettingsEvent = (event) => {
    if (
      !isNewGamePage() ||
      !shouldRunTerraformingMarsHelpers() ||
      applyingNewGameSettings ||
      !event.isTrusted
    ) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(`.${lobbyRootClass}`)) return;
    if (target.closest("dialog, .preferences_panel, .sidebar_item--settings")) return;
    if (!target.closest("#create-game")) return;
    lastLocalNewGameSettingsEditTimestamp = Date.now();
    lastHandledRemoteNewGameSettingsTimestamp = Math.max(
      lastHandledRemoteNewGameSettingsTimestamp,
      remoteNewGameSettingsTimestamp(),
    );
    scheduleNewGameSettingsWrite();
  };

  const startNewGameSettingsListeners = () => {
    if (newGameSettingsListenersStarted) return;
    newGameSettingsListenersStarted = true;
    document.addEventListener("click", handleNewGameSettingsEvent, true);
    document.addEventListener("change", handleNewGameSettingsEvent, true);
    document.addEventListener("input", handleNewGameSettingsEvent, true);
  };

  const setLobbyValueAtPath = (path, value) => {
    if (!path || path === "/") {
      latestLobbyData = value ?? {};
      return;
    }

    const keys = path.split("/").filter(Boolean);
    if (keys.length === 0) {
      latestLobbyData = value ?? {};
      return;
    }

    const root = isPlainObject(latestLobbyData) ? { ...latestLobbyData } : {};
    let cursor = root;
    for (let index = 0; index < keys.length - 1; index += 1) {
      const key = keys[index];
      cursor[key] = isPlainObject(cursor[key]) ? { ...cursor[key] } : {};
      cursor = cursor[key];
    }
    const leaf = keys[keys.length - 1];
    if (value === null) {
      delete cursor[leaf];
    } else {
      cursor[leaf] = value;
    }
    latestLobbyData = root;
  };

  const patchLobbyValueAtPath = (path, value) => {
    if (!isPlainObject(value)) {
      setLobbyValueAtPath(path, value);
      return;
    }
    for (const [key, childValue] of Object.entries(value)) {
      setLobbyValueAtPath(`${path === "/" ? "" : path}/${key}`, childValue);
    }
  };

  const handleFirebaseLobbyStreamEvent = (event) => {
    if (!isNewGamePage()) return;
    try {
      const message = JSON.parse(event.data);
      if (event.type === "patch") {
        patchLobbyValueAtPath(message.path ?? "/", message.data);
      } else {
        setLobbyValueAtPath(message.path ?? "/", message.data);
      }
      autoApplyNewGameSettingsIfNewer();
      renderLobbyPanel();
    } catch (error) {
      console.warn("[tfmars420] unable to process lobby stream", error);
    }
  };

  const startFirebaseLobbyStream = () => {
    if (!isNewGamePage() || lobbyEventSource) return;
    lobbyEventSource = new EventSource(`${firebaseLobbyUrl}.json`);
    lobbyEventSource.addEventListener("put", handleFirebaseLobbyStreamEvent);
    lobbyEventSource.addEventListener("patch", handleFirebaseLobbyStreamEvent);
    lobbyEventSource.onerror = () => {
      console.warn("[tfmars420] lobby stream disconnected; browser will retry");
    };
  };

  const saveCurrentGameIdIfNeeded = async () => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    const gameId = currentGameId();
    if (!gameId || gameId === savedGameId) return;
    const spectatorItem = findSpectatorListItem();
    if (!spectatorItem) return;

    savedGameId = gameId;
    const entry = { value: gameId, timestamp: Date.now() };
    try {
      await firebaseSetLobbyField("gameId", entry);
    } catch (error) {
      savedGameId = "";
      console.warn("[tfmars420] unable to write game id", error);
    }
  };

  const startTerraformingMarsLobbySync = () => {
    startNewGameSettingsListeners();
    const updateLobby = () => {
      if (isNewGamePage()) {
        startFirebaseLobbyStream();
      }
      saveCurrentGameIdIfNeeded();
      renderLobbyPanel();
    };
    updateLobby();
    window.setInterval(updateLobby, 1000);
  };

  const startControls = () => {
    renderControls();
    window.setInterval(renderControls, 1000);
  };

  function removeTimeWarpUi() {
    document.getElementById(timeWarpPanelId)?.remove();
    document
      .querySelectorAll(".tfmars420-card-tools, .tfmars420-enqueue-tools")
      .forEach((element) => element.remove());
    document
      .querySelectorAll(".tfmars420-card-border, .tfmars420-card-derank")
      .forEach((element) => {
        element.classList.remove("tfmars420-card-border", "tfmars420-card-derank");
      });
  }

  function removePreviewUi() {
    document.getElementById(previewId)?.remove();
    const wrapper = document.querySelector(".tfmars420-log-preview-layout");
    const logPanel = wrapper?.querySelector(".log-panel");
    if (wrapper?.parentElement && logPanel) {
      wrapper.parentElement.insertBefore(logPanel, wrapper);
      wrapper.remove();
    }
    lastRenderKey = "";
  }

  function cleanupTerraformingMarsHelpersForHidden() {
    if (helpersHiddenCleaned) return;
    removeTimeWarpUi();
    removePreviewUi();
    closeRenderedLogCardPanel();
    queueExecutionError = "";
    queueExecutionAttempted = false;
    queueExecutionInFlight = false;
    helpersHiddenCleaned = true;
  }

  const createBubbledEvent = (target, eventName) => {
    const doc = target.ownerDocument ?? document;
    try {
      return new Event(eventName, { bubbles: true });
    } catch (error) {
      const legacyEvent = doc.createEvent("Event");
      legacyEvent.initEvent(eventName, true, false);
      return legacyEvent;
    }
  };

  const dispatchBubbledEvent = (target, eventName) => {
    target.dispatchEvent(createBubbledEvent(target, eventName));
  };

  let latestPlayerView = null;
  let latestPlayerViewCapturedAt = 0;
  let latestPlayerViewRunId = "";
  let queueMutationObserver = null;
  let queueMutationPaused = false;

  const looksLikePlayerView = (value) =>
    Boolean(value?.id && value?.game && Object.prototype.hasOwnProperty.call(value, "runId"));

  const rememberLatestPlayerView = (playerView, source) => {
    if (!looksLikePlayerView(playerView)) return;
    const nextRunId = String(playerView.runId ?? "");
    if (nextRunId && nextRunId !== latestPlayerViewRunId) {
      queueExecutionAttempted = false;
      queueExecutionError = "";
      latestPlayerViewRunId = nextRunId;
    }
    latestPlayerView = cloneJson(playerView);
    latestPlayerViewCapturedAt = Date.now();
    timeWarpLog(
      "player-view-captured",
      {
        source,
        playerId: latestPlayerView.id,
        phase: latestPlayerView.game?.phase,
        hasWaitingFor: Boolean(latestPlayerView.waitingFor),
        waitingForType: latestPlayerView.waitingFor?.type,
        waitingForButtonLabel: latestPlayerView.waitingFor?.buttonLabel,
      },
      { limit: 30 },
    );
    scheduleTerraformingMarsUpdate();
  };

  const capturePlayerViewResponse = (response, source) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    try {
      if (!response?.clone || !response.ok) return;
      response
        .clone()
        .json()
        .then((value) => {
          if (looksLikePlayerView(value)) {
            rememberLatestPlayerView(value, source);
          }
        })
        .catch((error) => {
          timeWarpLog(
            "player-view-json-error",
            { source, status: response.status, message: String(error) },
            { limit: 8 },
          );
        });
    } catch (error) {
      timeWarpLog("player-view-capture-error", { source, message: String(error) }, { limit: 8 });
    }
  };

  const startPlayerViewCapture = () => {
    if (window.__TFMARS420_PLAYER_VIEW_CAPTURE_STARTED) return;
    window.__TFMARS420_PLAYER_VIEW_CAPTURE_STARTED = true;

    const originalFetch = window.fetch?.bind(window);
    if (!originalFetch) return;
    window.fetch = (...args) => {
      const source =
        typeof args[0] === "string"
          ? args[0]
          : args[0] instanceof Request
            ? args[0].url
            : String(args[0]);
      return originalFetch(...args).then((response) => {
        if (source.includes("api/player") || source.includes("player/input")) {
          capturePlayerViewResponse(response, `fetch:${source}`);
        }
        return response;
      });
    };
    timeWarpLog("fetch-capture-installed", { pathname: window.location.pathname }, { limit: 1 });
  };

  const currentPlayerId = () => latestPlayerView?.id ?? "";

  const freshQueueSession = (playerId) => ({
    version: 1,
    playerId,
    queue: [],
    cardRanks: {},
  });

  const normalizeQueueSession = (value, playerId) => {
    if (!isPlainObject(value) || value.version !== 1 || value.playerId !== playerId) {
      return freshQueueSession(playerId);
    }
    return {
      version: 1,
      playerId,
      queue: Array.isArray(value.queue) ? value.queue.filter(isPlainObject) : [],
      cardRanks: isPlainObject(value.cardRanks) ? { ...value.cardRanks } : {},
    };
  };

  const writeQueueSession = (session) => {
    if (!session?.playerId) return;
    writeStorageString(queueSessionStorageKey, JSON.stringify(session));
  };

  const readQueueSession = () => {
    const playerId = currentPlayerId();
    if (!playerId) return null;

    let parsed = null;
    try {
      const raw = window.localStorage.getItem(queueSessionStorageKey);
      parsed = raw ? JSON.parse(raw) : null;
    } catch (error) {
      parsed = null;
    }

    const shouldOverwrite =
      !isPlainObject(parsed) || parsed.version !== 1 || parsed.playerId !== playerId;
    const session = normalizeQueueSession(parsed, playerId);
    if (shouldOverwrite) {
      writeQueueSession(session);
    }
    return session;
  };

  const updateQueueSession = (updater) => {
    const session = readQueueSession();
    if (!session) return null;
    const nextSession = normalizeQueueSession(updater(cloneJson(session)) ?? session, session.playerId);
    writeQueueSession(nextSession);
    queueExecutionAttempted = false;
    queueExecutionError = "";
    scheduleTerraformingMarsUpdate();
    return nextSession;
  };

  const isCurrentPlayerTurn = () => {
    const actionsBlock = document.querySelector(".player_home_block--actions");
    if (!actionsBlock) return false;
    const controls = Array.from(
      actionsBlock.querySelectorAll(
        ".wf-root input, .wf-root button, .wf-root select, form input, form button, form select",
      ),
    );
    return controls.some((control) => !control.disabled && !control.closest(`.${lobbyRootClass}`));
  };

  const hasLiveActionForm = () =>
    Boolean(document.querySelector(".player_home_block--actions .wf-root, .player_home_block--actions form"));

  const timeWarpCss = () => `
    #${timeWarpPanelId} {
      background: #2f2f2f;
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 4px;
      box-sizing: border-box;
      color: #f5f5f5;
      font-family: inherit;
      margin: 8px 0;
      padding: 8px;
    }
    #${timeWarpPanelId}[hidden] {
      display: none !important;
    }
    #${timeWarpPanelId} button,
    .tfmars420-card-tools button,
    .tfmars420-enqueue-tools button {
      background: #5d79bd;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font: inherit;
      padding: 4px 9px;
    }
    #${timeWarpPanelId} button:hover:not(:disabled),
    .tfmars420-card-tools button:hover:not(:disabled),
    .tfmars420-enqueue-tools button:hover:not(:disabled) {
      background: #6d8bd0;
    }
    #${timeWarpPanelId} button:disabled,
    .tfmars420-card-tools button:disabled,
    .tfmars420-enqueue-tools button:disabled {
      cursor: default;
      opacity: 0.62;
    }
    #${timeWarpPanelId} .tfmars420-queue-title {
      font-weight: 700;
      margin-bottom: 6px;
    }
    #${timeWarpPanelId} .tfmars420-queue-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 8px 0;
    }
    #${timeWarpPanelId} .tfmars420-queue-row {
      align-items: center;
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }
    #${timeWarpPanelId} .tfmars420-queue-label {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    #${timeWarpPanelId} .tfmars420-queue-total,
    #${timeWarpPanelId} .tfmars420-queue-empty {
      color: #d8d8d8;
      font-size: 12px;
      margin: 6px 0;
    }
    #${timeWarpPanelId} .tfmars420-queue-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    #${timeWarpPanelId} .tfmars420-timewarp-error {
      color: #ffb4a8;
      font-size: 12px;
    }
    .tfmars420-card-tools,
    .tfmars420-enqueue-tools {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: center;
      margin: 5px auto 7px;
      max-width: 210px;
    }
    .tfmars420-card-border {
      box-shadow: 0 0 0 4px #ff4fbf, 0 0 12px rgba(255, 79, 191, 0.78);
    }
    .tfmars420-card-derank {
      filter: brightness(0.55);
    }
    .tfmars420-card-derank:hover {
      filter: brightness(1);
    }
  `;

  const getActionsBlock = () => document.querySelector(".player_home_block--actions");

  const renderQueuePanel = () => {
    if (!shouldRunTerraformingMarsHelpers()) {
      removeTimeWarpUi();
      return;
    }
    upsertCss(timeWarpCssId, timeWarpCss());

    const actionsBlock = getActionsBlock();
    if (!actionsBlock) return;

    let panel = document.getElementById(timeWarpPanelId);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = timeWarpPanelId;
      const title = actionsBlock.querySelector(".dynamic-title, .wf-component-title");
      if (title?.nextSibling) {
        actionsBlock.insertBefore(panel, title.nextSibling);
      } else {
        actionsBlock.prepend(panel);
      }
    }

    const session = readQueueSession();
    const myTurn = isCurrentPlayerTurn();

    if (!session) {
      panel.hidden = true;
      return;
    }

    if (myTurn) {
      if (queueExecutionError) {
        panel.hidden = false;
        panel.innerHTML = "";
        const error = document.createElement("div");
        error.className = "tfmars420-timewarp-error";
        error.textContent = queueExecutionError;
        panel.append(error);
      } else {
        panel.hidden = true;
        panel.innerHTML = "";
      }
      return;
    }

    panel.hidden = false;
    panel.innerHTML = "";

    const title = document.createElement("div");
    title.className = "tfmars420-queue-title";
    title.textContent = "Queued actions";
    panel.append(title);

    if (session.queue.length === 0) {
      const empty = document.createElement("div");
      empty.className = "tfmars420-queue-empty";
      empty.textContent = "No actions queued.";
      panel.append(empty);
    } else {
      const list = document.createElement("div");
      list.className = "tfmars420-queue-list";
      session.queue.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "tfmars420-queue-row";

        const label = document.createElement("span");
        label.className = "tfmars420-queue-label";
        label.textContent = `${index + 1}. ${queueItemLabel(item)}`;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "remove";
        remove.addEventListener("click", () => {
          updateQueueSession((draft) => {
            draft.queue.splice(index, 1);
            return draft;
          });
        });

        row.append(label, remove);
        list.append(row);
      });
      panel.append(list);
    }

    const total = document.createElement("div");
    total.className = "tfmars420-queue-total";
    total.textContent = `Total queued M€: ${queuedProjectMoneyCost(session.queue)}`;
    panel.append(total);

    const actions = document.createElement("div");
    actions.className = "tfmars420-queue-actions";

    const passButton = document.createElement("button");
    passButton.type = "button";
    passButton.textContent = "Pass for this generation";
    passButton.addEventListener("click", () => {
      updateQueueSession((draft) => {
        draft.queue.push({ type: "pass", label: "Pass for this generation" });
        return draft;
      });
    });

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.textContent = "Clear queue";
    clearButton.disabled = session.queue.length === 0;
    clearButton.addEventListener("click", () => {
      updateQueueSession((draft) => {
        draft.queue = [];
        return draft;
      });
    });

    actions.append(passButton, clearButton);
    panel.append(actions);
  };

  const queuedProjectMoneyCost = (queue) =>
    queue.reduce((total, item) => {
      if (item?.type !== "projectCard") return total;
      const cost = Number(item.cost);
      return total + (Number.isFinite(cost) && cost > 0 ? cost : 0);
    }, 0);

  const queueItemLabel = (item) => {
    if (item?.type === "pass") return "Pass for this generation";
    if (item?.type === "projectCard") return `Play ${item.cardName ?? "project card"}`;
    if (item?.type === "playedAction") return `Use ${item.cardName ?? "played action"}`;
    return "Unknown action";
  };

  const cardContainerFromBox = (cardBox) => cardBox?.querySelector(".card-container") ?? cardBox;

  const getCardIdentity = (cardElement) => {
    const container = cardElement?.classList?.contains("card-container")
      ? cardElement
      : cardElement?.querySelector?.(".card-container") ?? cardElement;
    const cardBox = container?.closest?.(".cardbox") ?? container;
    const name = cardNameFromElement(container) || cardNameFromElement(cardBox) || "Card";
    const slug = cardSlugFromElement(container) || slugifyCardName(name);
    const key = slug || normalizeCardName(name);
    return { name, slug, key };
  };

  const findQueuedCardPosition = (queue, type, identity) =>
    queue.findIndex(
      (item) =>
        item?.type === type &&
        (item.cardKey === identity.key ||
          (item.cardSlug && item.cardSlug === identity.slug) ||
          normalizeCardName(item.cardName) === normalizeCardName(identity.name)),
    ) + 1;

  const removeQueuedCard = (draft, type, identity) => {
    const index = findQueuedCardPosition(draft.queue, type, identity) - 1;
    if (index >= 0) {
      draft.queue.splice(index, 1);
      return true;
    }
    return false;
  };

  const setButtonText = (button, text) => {
    if (button.textContent !== text) {
      button.textContent = text;
    }
  };

  const visibleProjectCost = (cardBox, identity) => {
    const playerViewCost = playerViewProjectCost(identity);
    if (playerViewCost !== null) return playerViewCost;

    const costText = cleanText(cardBox?.querySelector?.(".card-cost")?.textContent ?? "");
    const match = costText.match(/-?\d+/);
    return match ? Number(match[0]) : 0;
  };

  const playerViewProjectCost = (identity) => {
    const cards = collectWaitingForCards(latestPlayerView?.waitingFor);
    const match = cards.find((card) => {
      const name = card.name ?? card.cardName ?? card.title ?? "";
      const slug = card.name ?? card.cardName ?? card.title ?? card.cardType ?? "";
      return (
        normalizeCardName(name) === normalizeCardName(identity.name) ||
        slugifyCardName(slug) === identity.slug
      );
    });
    if (!match) return null;

    for (const key of ["calculatedCost", "discountedCost", "cost", "moneyCost"]) {
      const value = Number(match[key]);
      if (Number.isFinite(value)) return value;
    }
    return null;
  };

  const collectWaitingForCards = (waitingFor) => {
    const cards = [];
    const visit = (value) => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (Array.isArray(value.cards)) {
        value.cards.forEach((card) => {
          if (isPlainObject(card)) cards.push(card);
        });
      }
      Object.values(value).forEach(visit);
    };
    visit(waitingFor);
    return cards;
  };

  const applyCardRankClass = (cardBox, rank) => {
    const container = cardContainerFromBox(cardBox);
    container?.classList?.toggle("tfmars420-card-border", rank === "border");
    container?.classList?.toggle("tfmars420-card-derank", rank === "derank");
  };

  const nextCardRank = (rank) => {
    if (rank === "border") return "derank";
    if (rank === "derank") return "neutral";
    return "border";
  };

  const setCardRank = (draft, identity, rank) => {
    if (rank === "neutral") {
      delete draft.cardRanks[identity.key];
    } else {
      draft.cardRanks[identity.key] = rank;
    }
    return draft;
  };

  const ensureHandCardRankCycler = (cardBox, identity) => {
    if (cardBox.__tfmars420RankCyclerAttached) return;
    cardBox.__tfmars420RankCyclerAttached = true;
    cardBox.addEventListener(
      "click",
      (event) => {
        if (!shouldRunTerraformingMarsHelpers()) return;
        if (event.target instanceof Element && event.target.closest(".tfmars420-card-tools")) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        updateQueueSession((draft) => {
          const currentRank = draft.cardRanks[identity.key] ?? "neutral";
          return setCardRank(draft, identity, nextCardRank(currentRank));
        });
      },
      true,
    );
  };

  const upsertCardToolButton = (tools, className, text, onClick) => {
    let button = tools.querySelector(`:scope > .${className}`);
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.addEventListener("click", onClick);
      tools.append(button);
    }
    button.disabled = false;
    setButtonText(button, text);
    return button;
  };

  const renderHandCardTools = () => {
    const session = readQueueSession();
    if (!session) return;
    const myTurn = isCurrentPlayerTurn();

    document.querySelectorAll(".player_home_block--hand .cardbox").forEach((cardBox) => {
      const identity = getCardIdentity(cardBox);
      const rank = session.cardRanks[identity.key] ?? "neutral";
      applyCardRankClass(cardBox, rank);
      ensureHandCardRankCycler(cardBox, identity);

      let tools = cardBox.querySelector(":scope > .tfmars420-card-tools");
      if (myTurn) {
        tools?.remove();
        return;
      }

      if (!tools) {
        tools = document.createElement("div");
        tools.className = "tfmars420-card-tools";
        cardBox.append(tools);
      }

      const position = findQueuedCardPosition(session.queue, "projectCard", identity);
      upsertCardToolButton(
        tools,
        "tfmars420-project-queue-button",
        position ? "dequeue" : "enqueue",
        () => {
          updateQueueSession((draft) => {
            if (removeQueuedCard(draft, "projectCard", identity)) return draft;
            draft.queue.push({
              type: "projectCard",
              cardName: identity.name,
              cardSlug: identity.slug,
              cardKey: identity.key,
              cost: visibleProjectCost(cardBox, identity),
            });
            return draft;
          });
        },
      );
    });
  };

  const isUnusedPlayedActionCard = (cardBox) => {
    const container = cardContainerFromBox(cardBox);
    if (!container || container.classList.contains("card-unavailable")) return false;
    if (cardBox.querySelector(".card-unavailable")) return false;
    return Boolean(container.querySelector(".background-color-active")) && /Action:/i.test(cardBox.textContent ?? "");
  };

  const renderPlayedActionTools = () => {
    const session = readQueueSession();
    if (!session) return;
    const myTurn = isCurrentPlayerTurn();

    document.querySelectorAll(".player_home_block--cards .cardbox").forEach((cardBox) => {
      const existingTools = cardBox.querySelector(":scope > .tfmars420-enqueue-tools");
      if (myTurn || !isUnusedPlayedActionCard(cardBox)) {
        existingTools?.remove();
        return;
      }

      const identity = getCardIdentity(cardBox);
      const position = findQueuedCardPosition(session.queue, "playedAction", identity);

      let tools = existingTools;
      if (!tools) {
        tools = document.createElement("div");
        tools.className = "tfmars420-enqueue-tools";
        cardBox.append(tools);
      }

      upsertCardToolButton(
        tools,
        "tfmars420-played-action-queue-button",
        position ? "dequeue" : "enqueue",
        () => {
          updateQueueSession((draft) => {
            if (removeQueuedCard(draft, "playedAction", identity)) return draft;
            draft.queue.push({
              type: "playedAction",
              cardName: identity.name,
              cardSlug: identity.slug,
              cardKey: identity.key,
            });
            return draft;
          });
        },
      );
    });
  };

  const updateQueueUi = () => {
    queueUiScheduled = false;
    if (!shouldRunTerraformingMarsHelpers()) {
      removeTimeWarpUi();
      return;
    }

    queueMutationPaused = true;
    try {
      renderQueuePanel();
      renderHandCardTools();
      renderPlayedActionTools();
      maybeExecuteQueuedAction();
    } catch (error) {
      console.error("[tfmars420] queue UI update failed", error);
    } finally {
      window.setTimeout(() => {
        queueMutationPaused = false;
      }, 0);
    }
  };

  const scheduleTerraformingMarsUpdate = () => {
    if (queueUiScheduled) return;
    queueUiScheduled = true;
    window.requestAnimationFrame(updateQueueUi);
  };

  const startQueueUi = () => {
    scheduleTerraformingMarsUpdate();
    if (queueMutationObserver) return;

    const target = document.body ?? document.documentElement;
    queueMutationObserver = new MutationObserver(() => {
      if (queueMutationPaused) return;
      scheduleTerraformingMarsUpdate();
    });
    queueMutationObserver.observe(target, { childList: true, subtree: true });
  };

  const popNextQueuedAction = () => {
    const session = readQueueSession();
    if (!session || session.queue.length === 0) return null;
    const [item] = session.queue.splice(0, 1);
    writeQueueSession(session);
    return item;
  };

  const maybeExecuteQueuedAction = () => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    if (queueExecutionAttempted || queueExecutionInFlight) return;
    if (!latestPlayerView?.id || readQueueSession()?.playerId !== latestPlayerView.id) return;
    if (!isCurrentPlayerTurn() || !hasLiveActionForm()) return;

    const item = popNextQueuedAction();
    if (!item) return;

    queueExecutionAttempted = true;
    queueExecutionInFlight = true;
    queueExecutionError = "";
    executeQueuedItem(item)
      .then(() => {
        scheduleTerraformingMarsUpdate();
      })
      .catch((error) => {
        queueExecutionError = `Could not execute ${queueItemLabel(item)}: ${error.message ?? error}`;
        renderQueuePanel();
      })
      .finally(() => {
        queueExecutionInFlight = false;
      });
  };

  const executeQueuedItem = async (item) => {
    if (item?.type === "pass") {
      selectActionOption("Pass for this generation");
      await nextFrame();
      clickActionSubmit("Pass");
      return;
    }

    if (item?.type === "playedAction") {
      selectActionOption("Perform an action from a played card");
      await nextFrame();
      selectActionCard(item, ".player_home_block--actions .wf-component--select-card .cardbox");
      await nextFrame();
      clickActionSubmit("Take action");
      return;
    }

    if (item?.type === "projectCard") {
      selectActionOption("Play project card");
      await nextFrame();
      selectActionCard(item, ".player_home_block--actions .wf-component--select-card .cardbox");
      await nextFrame();
      clickActionSubmit("Play card");
      return;
    }

    throw new Error("unknown queued action type");
  };

  const selectActionOption = (labelText) => {
    const actionsBlock = getActionsBlock();
    const labels = Array.from(actionsBlock?.querySelectorAll("label.form-radio") ?? []);
    const label = labels.find((candidate) => {
      const text = cleanText(
        candidate.querySelector("span")?.textContent ?? candidate.textContent ?? "",
      );
      return text === labelText || text.includes(labelText);
    });
    const radio = label?.querySelector("input[type='radio']");
    if (!label || !radio) {
      throw new Error(`missing action option: ${labelText}`);
    }
    preserveScrollDuring(() => {
      radio.checked = true;
      radio.click();
      dispatchBubbledEvent(radio, "input");
      dispatchBubbledEvent(radio, "change");
    });
  };

  const selectActionCard = (item, selector) => {
    const cards = Array.from(document.querySelectorAll(selector));
    const cardBox = cards.find((candidate) => cardMatchesQueuedItem(candidate, item));
    const input = cardBox?.querySelector("input[type='radio'], input[type='checkbox']");
    if (!cardBox || !input) {
      throw new Error(`missing card: ${item.cardName ?? item.cardKey ?? "unknown"}`);
    }
    preserveScrollDuring(() => {
      input.checked = true;
      input.click();
      dispatchBubbledEvent(input, "input");
      dispatchBubbledEvent(input, "change");
    });
  };

  const cardMatchesQueuedItem = (cardBox, item) => {
    const identity = getCardIdentity(cardBox);
    return (
      identity.key === item.cardKey ||
      (item.cardSlug && identity.slug === item.cardSlug) ||
      normalizeCardName(identity.name) === normalizeCardName(item.cardName)
    );
  };

  const clickActionSubmit = (preferredText) => {
    const actionsRoot =
      getActionsBlock()?.querySelector(".wf-root, form") ?? getActionsBlock();
    const buttons = Array.from(actionsRoot?.querySelectorAll("button, input[type='submit']") ?? []);
    const button =
      buttons.find((candidate) => cleanText(candidate.textContent ?? candidate.value ?? "") === preferredText) ??
      buttons.find((candidate) => candidate.classList?.contains("btn-submit")) ??
      buttons.find((candidate) => !candidate.disabled);
    if (!button || button.disabled) {
      throw new Error(`missing submit button: ${preferredText}`);
    }
    preserveScrollDuring(() => button.click());
  };

  const clickLogCard = (index) => {
    const element = document.querySelectorAll(".log-panel .log-card")[index];
    const target = element?.closest("li") ?? element;
    if (!target) {
      throw new Error(`No log card found at ${index}`);
    }

    target.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
  };

  const closeRenderedLogCardPanel = () => {
    const panel = document.querySelector(".card-panel");
    const closeButton =
      panel?.querySelector(".icon-cross")?.closest("button") ??
      panel?.querySelector("button.float-right") ??
      panel?.querySelector("button");
    if (!closeButton) return false;
    closeButton.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
    return true;
  };

  const captureRenderedLogCard = (card) => {
    const rendered =
      document.querySelector(".card-panel #log_panel_card .card-container") ??
      document.querySelector(".card-panel .card-container");
    if (!rendered) return false;

    const title = rendered.querySelector(".card-title") ?? rendered;
    const renderedName = cardNameFromElement(title);
    const renderedSlug = cardSlugFromElement(rendered);
    const html = rendered.outerHTML;

    for (const key of [
      normalizeCardName(card.name),
      slugifyCardName(card.name),
      renderedName ? normalizeCardName(renderedName) : "",
      renderedSlug ?? "",
    ]) {
      if (key) {
        renderedCardHtmlByKey.set(key, html);
      }
    }
    return true;
  };

  const clickMissingCards = async (cards) => {
    for (const card of cards) {
      if (!shouldRunTerraformingMarsHelpers()) return;
      const slug = slugifyCardName(card.name);
      try {
        preserveScrollDuring(() => clickLogCard(card.logIndex));
        await nextFrame();
        if (!shouldRunTerraformingMarsHelpers()) return;
        await wait(5);
        if (!shouldRunTerraformingMarsHelpers()) return;
        if (captureRenderedLogCard(card)) {
          renderedCardRequests.add(slug);
        }
      } finally {
        preserveScrollDuring(closeRenderedLogCardPanel);
        await nextFrame();
      }
    }
  };

  const requestMissingCardRender = (cards, visibleCardsByName) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    if (clickInFlight) return;

    const missingCards = cards.filter((card) => {
      if (hasVisibleCard(visibleCardsByName, card)) return false;
      const slug = slugifyCardName(card.name);
      return !renderedCardRequests.has(slug);
    });
    if (missingCards.length === 0) return;

    clickInFlight = true;
    clickMissingCards(missingCards)
      .catch((error) => console.error("[tfmars420] card render click failed", error))
      .finally(() => {
        clickInFlight = false;
        if (shouldRunTerraformingMarsHelpers()) {
          updatePreview();
        } else {
          removePreviewUi();
        }
      });
  };

  const renderPreview = (logCards, visibleCards) => {
    if (!shouldRunTerraformingMarsHelpers()) {
      removePreviewUi();
      return;
    }
    const visibleCardsByName = visibleCardMap(visibleCards);
    const recentCards = recentCardsFromLog(logCards);
    const cardsHtml = recentCards
      .map((card) => {
        const html =
          visibleCardsByName.get(slugifyCardName(card.name)) ??
          visibleCardsByName.get(normalizeCardName(card.name)) ??
          createFallbackCardHtml(card);
        return `<div class="cardbox">${html}</div>`;
      })
      .join("");
    const html = `<div class="tfmars420-preview-strip">${cardsHtml}</div>`;
    const renderKey = `${window.location.href}:${html}`;
    upsertCss(cssId, previewCss());
    const container = ensureAdjacentContainer({
      targetSelector: ".log-panel",
      wrapperClass: "tfmars420-log-preview-layout",
      containerId: previewId,
    });
    if (!container) {
      return;
    }
    const logReference =
      document.querySelector(".log-panel") ??
      document.querySelector(".logpanel-scrollable");
    if (logReference) {
      const height = logReference.getBoundingClientRect().height;
      const scale = Math.max(0.35, height / 350);
      const width = Math.round((244 * scale + 4) * 4.25);
      container.style.setProperty("--tfmars420-log-preview-height", `${height}px`);
      container.style.setProperty("--tfmars420-log-preview-scale", String(scale));
      container.style.setProperty("--tfmars420-log-preview-width", `${width}px`);
      container.style.setProperty("--tfmars420-log-preview-strip-width", `${Math.round(width / scale)}px`);
    }
    if (renderKey === lastRenderKey) return;
    lastRenderKey = renderKey;

    if (container.innerHTML !== html) {
      preserveScrollDuring(() => {
        container.innerHTML = html;
      });
    }
    requestMissingCardRender(recentCards, visibleCardsByName);
  };

  const updatePreview = () => {
    if (!shouldRunTerraformingMarsHelpers()) {
      cleanupTerraformingMarsHelpersForHidden();
      return;
    }
    try {
      renderPreview(getLogCards(), getVisibleCards());
    } catch (error) {
      console.error("[tfmars420] preview update failed", error);
    }
  };

  const startPreview = () => {
    updatePreview();
    window.setInterval(updatePreview, 1000);
  };

  startPlayerViewCapture();

  document.addEventListener("change", handleSingleCardSelectionChange, true);

  ready(() => {
    startControls();
    startTerraformingMarsLobbySync();
    startPreview();
    startQueueUi();
  });
})();
