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
  const timeWarpFallbackFormId = "tfmars420-timewarp-form";
  const timeWarpCssId = "tfmars420-timewarp-css";
  const notesPanelId = "tfmars420-board-notes";
  const notesCssId = "tfmars420-board-notes-css";
  const runtimeConfigUrl = "https://aworldofstruggle.web.app/extension/config.json";
  let lastRenderKey = "";
  let clickInFlight = false;
  let notesSaveTimeout = null;
  let notesLastStorageKey = "";
  let notesVisible = true;
  let helpersHiddenCleaned = false;
  const timeWarpCachedWaitingFor = new Map();
  const timeWarpCachedUiState = new Map();
  let runtimeConfig = {
    version: 1,
    skills: {
      timeWarp: {
        enabled: true,
        panel: {
          queueMaxHeight: null,
        },
        fallbackRenderer: {
          preserveFormWhileActive: true,
          cardListMaxHeight: null,
        },
      },
    },
  };

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

  let sessionRequestId = 0;
  const sessionRequests = new Map();

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== window.location.origin) {
      return;
    }
    if (event.data?.type !== "tfmars420:session-response") {
      return;
    }

    const request = sessionRequests.get(event.data.requestId);
    if (!request) return;
    window.clearTimeout(request.timeoutId);
    sessionRequests.delete(event.data.requestId);
    request.resolve(event.data.response);
  });

  const extensionSessionRequest = (type, key, value) =>
    new Promise((resolve) => {
      const requestId = `tfmars420-session-${Date.now()}-${++sessionRequestId}`;
      const timeoutId = window.setTimeout(() => {
        sessionRequests.delete(requestId);
        resolve({ ok: false, error: "session request timed out" });
      }, 1500);
      sessionRequests.set(requestId, { resolve, timeoutId });
      window.postMessage({ type, requestId, key, value }, window.location.origin);
    });

  const extensionSessionGet = async (key) => {
    const response = await extensionSessionRequest("tfmars420:session-get", key);
    if (response?.ok) return response.value;
    timeWarpLog("session-get-error", { key, error: response?.error }, { limit: 8 });
    return undefined;
  };

  const extensionSessionSet = async (key, value) => {
    const response = await extensionSessionRequest("tfmars420:session-set", key, value);
    if (!response?.ok) {
      timeWarpLog("session-set-error", { key, error: response?.error }, { limit: 8 });
    }
  };

  const extensionSessionRemove = async (key) => {
    const response = await extensionSessionRequest("tfmars420:session-remove", key);
    if (!response?.ok) {
      timeWarpLog("session-remove-error", { key, error: response?.error }, { limit: 8 });
    }
  };

  const isPlainObject = (value) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value);

  const mergeConfig = (base, override) => {
    if (!isPlainObject(base) || !isPlainObject(override)) {
      return override === undefined ? base : override;
    }
    const merged = { ...base };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = mergeConfig(base[key], value);
    }
    return merged;
  };

  const getTimeWarpConfig = () => runtimeConfig.skills?.timeWarp ?? {};

  const applyRuntimeConfig = (config, source) => {
    if (!isPlainObject(config) || config.version !== 1) {
      timeWarpLog("runtime-config-ignored", { source, version: config?.version }, { limit: 8 });
      return;
    }
    runtimeConfig = mergeConfig(runtimeConfig, config);
    timeWarpLog(
      "runtime-config-applied",
      {
        source,
        timeWarp: runtimeConfig.skills?.timeWarp,
      },
      { limit: 8 },
    );
    upsertCss(timeWarpCssId, timeWarpCss());
    renderTimeWarpPanel();
  };

  const loadRemoteRuntimeConfig = () => {
    fetch(runtimeConfigUrl, {
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((config) => applyRuntimeConfig(config, "remote"))
      .catch((error) => {
        timeWarpLog("runtime-config-fetch-error", { message: String(error) }, { limit: 8 });
      });
  };
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

  const notesCss = () => `
    .tfmars420-board-notes-anchor {
      position: relative;
    }
    #${notesPanelId} {
      background: #2f2f2f;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 4px;
      box-sizing: border-box;
      color: #f5f5f5;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 0;
      padding: 8px;
      position: absolute;
      z-index: 5;
      width: 360px;
    }
    #${notesPanelId}.tfmars420-board-notes-hidden {
      width: auto;
    }
    #${notesPanelId} .tfmars420-board-notes-bar {
      align-items: center;
      display: flex;
      gap: 8px;
    }
    #${notesPanelId} button {
      background: #5d79bd;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font: inherit;
      min-width: 64px;
      padding: 4px 10px;
    }
    #${notesPanelId} textarea {
      background: #f8f2df;
      border: 1px solid rgba(0, 0, 0, 0.45);
      border-radius: 4px;
      box-sizing: border-box;
      color: #191919;
      font: 14px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      min-height: 420px;
      padding: 10px;
      resize: both;
      width: 100%;
    }
    #${notesPanelId}.tfmars420-board-notes-hidden textarea {
      display: none;
    }
    #${notesPanelId}.tfmars420-board-notes-hidden .tfmars420-board-notes-version {
      display: none;
    }
    @media (max-width: 1100px) {
      #${notesPanelId} {
        max-width: 95vw;
        width: 95vw;
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

  const notesStorageKey = () => "tfmars420:notes";

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

  const isNotesVisible = () => notesVisible;

  const shouldRunTerraformingMarsHelpers = () => isNotesVisible();

  const setNotesVisible = (visible) => {
    if (notesVisible === visible) return;
    notesVisible = visible;
    if (visible) {
      helpersHiddenCleaned = false;
    } else {
      cleanupTerraformingMarsHelpersForHidden();
    }
  };

  const scheduleNotesSave = (textarea) => {
    if (notesSaveTimeout) {
      window.clearTimeout(notesSaveTimeout);
    }
    const key = notesStorageKey();
    const value = textarea.value;
    notesSaveTimeout = window.setTimeout(() => {
      writeStorageString(key, value);
      notesSaveTimeout = null;
    }, 1000);
  };

  const flushNotesSave = (textarea) => {
    if (notesSaveTimeout) {
      window.clearTimeout(notesSaveTimeout);
      notesSaveTimeout = null;
    }
    writeStorageString(notesStorageKey(), textarea.value);
  };

  const stopNotesPropagation = (event) => {
    event.stopPropagation();
  };

  const handleNotesInput = (textarea, event) => {
    event.stopPropagation();
    scheduleNotesSave(textarea);
  };

  const reloadRuntime = () => {
    requestRuntimeUpdate();
  };

  const getBoardNotesAnchor = () => {
    const board = document.querySelector("#main_board");
    const gameBoard = board?.parentElement;
    if (!gameBoard) return null;

    const oldLayout = gameBoard.parentElement?.classList.contains("tfmars420-board-notes-layout")
      ? gameBoard.parentElement
      : null;
    if (oldLayout) {
      const oldBlock = oldLayout.closest(".player_home_block");
      if (oldBlock) {
        oldBlock.insertBefore(gameBoard, oldLayout);
      }
      oldLayout.remove();
    }

    const block = gameBoard.closest(".player_home_block");
    if (!block) return null;
    block.classList.add("tfmars420-board-notes-anchor");
    return { block, gameBoard };
  };

  const renderBoardNotes = () => {
    upsertCss(notesCssId, notesCss());
    const anchor = getBoardNotesAnchor();
    if (!anchor) {
      document.getElementById(notesPanelId)?.remove();
      return;
    }
    const { block, gameBoard } = anchor;

    const storageKey = notesStorageKey();
    let panel = document.getElementById(notesPanelId);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = notesPanelId;

      const bar = document.createElement("div");
      bar.className = "tfmars420-board-notes-bar";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "tfmars420-board-notes-toggle";
      toggle.textContent = "notes";
      bar.appendChild(toggle);

      const version = document.createElement("button");
      version.type = "button";
      version.className = "tfmars420-board-notes-version";
      version.textContent = contentScriptVersion;
      version.addEventListener("click", reloadRuntime);
      bar.appendChild(version);
      panel.appendChild(bar);

      const textarea = document.createElement("textarea");
      textarea.className = "tfmars420-board-notes-text";
      textarea.spellcheck = true;
      textarea.addEventListener("input", (event) => handleNotesInput(textarea, event), true);
      textarea.addEventListener("change", (event) => {
        event.stopPropagation();
        flushNotesSave(textarea);
      }, true);
      textarea.addEventListener("blur", () => flushNotesSave(textarea));
      window.addEventListener("beforeunload", () => flushNotesSave(textarea));
      for (const eventName of [
        "beforeinput",
        "keydown",
        "keyup",
        "keypress",
        "paste",
        "copy",
        "cut",
      ]) {
        textarea.addEventListener(eventName, stopNotesPropagation, true);
      }
      panel.appendChild(textarea);

      toggle.addEventListener("click", () => {
        setNotesVisible(panel.classList.contains("tfmars420-board-notes-hidden"));
        renderBoardNotes();
      });

      block.appendChild(panel);
    } else if (panel.parentElement !== block) {
      block.appendChild(panel);
    }

    panel.style.left = `${gameBoard.offsetLeft + gameBoard.offsetWidth + 12}px`;
    panel.style.top = `${gameBoard.offsetTop + 28}px`;

    const textarea = panel.querySelector(".tfmars420-board-notes-text");
    if (textarea && notesLastStorageKey !== storageKey) {
      textarea.value = readStorageString(storageKey);
      notesLastStorageKey = storageKey;
    }

    const visible = isNotesVisible();
    panel.classList.toggle("tfmars420-board-notes-hidden", !visible);
    panel.querySelector(".tfmars420-board-notes-toggle").setAttribute(
      "aria-pressed",
      visible ? "true" : "false",
    );
  };

  const startBoardNotes = () => {
    renderBoardNotes();
    window.setInterval(renderBoardNotes, 1000);
  };

  function removeTimeWarpUi() {
    document.getElementById(timeWarpPanelId)?.remove();
    document.getElementById(timeWarpFallbackFormId)?.remove();
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
    const context = timeWarpContext();
    const playerId = context?.playerView?.id ?? latestPlayerView?.id;
    if (context?.root) {
      context.root.isServerSideRequestInProgress = false;
    }
    restoreWaitingForPatch();
    timeWarp.active = false;
    timeWarp.queue = [];
    timeWarp.lastError = "";
    timeWarp.replayInFlight = false;
    timeWarp.renderingCachedAction = false;
    timeWarp.renderedCachedComponent = null;
    timeWarp.cachedWaitingFor = null;
    timeWarpCachedWaitingFor.clear();
    timeWarpCachedUiState.clear();
    hydratedTimeWarpPlayers.clear();
    hydratingTimeWarpPlayers.clear();
    latestPlayerView = null;
    latestPlayerViewCapturedAt = 0;
    clearRenderedCachedWaitingFor(context);
    clearFallbackCachedWaitingFor();
    clearTimeWarpSession(context ?? playerId);
    removeTimeWarpUi();
    removePreviewUi();
    closeRenderedLogCardPanel();
    helpersHiddenCleaned = true;
  }

  const cssMaxHeight = (value) => {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return `max-height: ${value}px; overflow: auto;`;
    }
    if (typeof value === "string" && value.trim()) {
      return `max-height: ${value}; overflow: auto;`;
    }
    return "max-height: none; overflow: visible;";
  };

  const timeWarpCss = () => {
    const config = getTimeWarpConfig();
    const queueMaxHeight = cssMaxHeight(config.panel?.queueMaxHeight);
    const cardListMaxHeight = cssMaxHeight(config.fallbackRenderer?.cardListMaxHeight);

    return `
    #${timeWarpPanelId} {
      align-items: center;
      background: #2f2f2f;
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 4px;
      box-sizing: border-box;
      color: #f5f5f5;
      display: flex;
      flex-wrap: wrap;
      font-family: inherit;
      gap: 8px;
      margin: 8px 0;
      padding: 8px;
    }
    #${timeWarpPanelId}[hidden] {
      display: none !important;
    }
    #${timeWarpPanelId} button {
      background: #5d79bd;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font: inherit;
      padding: 4px 10px;
    }
    #${timeWarpPanelId} button:hover {
      background: #6d8bd0;
    }
    #${timeWarpPanelId} .tfmars420-timewarp-anchor {
      background: #744444;
    }
    #${timeWarpPanelId} .tfmars420-timewarp-summary {
      font-weight: 700;
    }
    #${timeWarpPanelId} .tfmars420-timewarp-queue {
      flex-basis: 100%;
      font-size: 12px;
      margin: 0;
      ${queueMaxHeight}
      white-space: pre-wrap;
    }
    #${timeWarpPanelId} .tfmars420-timewarp-error {
      color: #ffb4a8;
      flex-basis: 100%;
      font-size: 12px;
    }
    #${timeWarpFallbackFormId} {
      background: #3a3a3a;
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 4px;
      color: #f5f5f5;
      margin: 8px 0;
      padding: 10px;
    }
    #${timeWarpFallbackFormId}[hidden] {
      display: none !important;
    }
    #${timeWarpFallbackFormId} .tfmars420-timewarp-title {
      font-weight: 700;
      margin-bottom: 8px;
    }
    #${timeWarpFallbackFormId} .tfmars420-timewarp-row {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 6px 0;
    }
    #${timeWarpFallbackFormId} label {
      cursor: pointer;
    }
    #${timeWarpFallbackFormId} input,
    #${timeWarpFallbackFormId} select {
      font: inherit;
    }
    #${timeWarpFallbackFormId} input[type="number"] {
      width: 72px;
    }
    #${timeWarpFallbackFormId} button {
      background: #5d79bd;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font: inherit;
      padding: 4px 10px;
    }
    #${timeWarpFallbackFormId} .tfmars420-timewarp-child {
      border-left: 3px solid rgba(255, 255, 255, 0.2);
      margin: 8px 0 8px 18px;
      padding-left: 10px;
    }
    #${timeWarpFallbackFormId} .tfmars420-timewarp-card-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin: 8px 0;
      ${cardListMaxHeight}
    }
    #${timeWarpFallbackFormId} .tfmars420-timewarp-muted {
      color: #cfcfcf;
      font-size: 12px;
    }
  `;
  };

  const getComponentName = (component) =>
    component?.type?.name ??
    component?.type?.__name ??
    component?.proxy?.$options?.name ??
    "";

  const componentFromElement = (element) =>
    element?.__vueParentComponent ??
    element?.__vnode?.component ??
    element?.__vue__?.$ ??
    element?.__vue__ ??
    null;

  const isWaitingForLikeComponent = (component) => {
    const name = getComponentName(component);
    if (name === "waiting-for") return true;

    const proxy = component?.proxy ?? component;
    const props = component?.props ?? proxy?.$props ?? {};
    return (
      typeof proxy?.onsave === "function" &&
      typeof proxy?.waitForUpdate === "function" &&
      (
        Object.prototype.hasOwnProperty.call(props, "waitingfor") ||
        Object.prototype.hasOwnProperty.call(proxy, "waitingfor")
      )
    );
  };

  const findParentComponent = (component, predicate) => {
    let current = component;
    while (current) {
      if (predicate(current)) {
        return current;
      }
      current = current.parent ?? current.$parent?.$;
    }
    return null;
  };

  const walkVnodeComponents = (vnode, visit, seen) => {
    if (!vnode) return null;
    if (vnode.component && !seen.has(vnode.component)) {
      const found = walkComponentTree(vnode.component, visit, seen);
      if (found) return found;
    }

    const children = Array.isArray(vnode.children) ? vnode.children : [];
    for (const child of children) {
      const found = walkVnodeComponents(child, visit, seen);
      if (found) return found;
    }
    return null;
  };

  function walkComponentTree(component, visit, seen = new Set()) {
    if (!component || seen.has(component)) return null;
    seen.add(component);
    if (visit(component)) return component;
    return walkVnodeComponents(component.subTree, visit, seen);
  }

  const findWaitingForComponentFromApp = () => {
    const appElement = Array.from(document.querySelectorAll("*")).find(
      (element) => element.__vue_app__,
    );
    const app = appElement?.__vue_app__;
    const rootComponent = app?._instance;
    const found = walkComponentTree(rootComponent, isWaitingForLikeComponent);
    if (!found) {
      timeWarpLog(
        "vue-app-scan-empty",
        {
          hasAppElement: Boolean(appElement),
          hasRootComponent: Boolean(rootComponent),
          appElementTag: appElement?.tagName,
          appElementId: appElement?.id,
          appKeys: app ? Object.keys(app).slice(0, 24) : [],
          componentName: app?._component?.name ?? app?._component?.__name,
        },
        { limit: 10 },
      );
    }
    return found;
  };

  const findWaitingForComponent = () => {
    const actionsBlock = document.querySelector(".player_home_block--actions");

    if (actionsBlock) {
      const elements = [actionsBlock, ...actionsBlock.querySelectorAll("*")];
      for (const element of elements) {
        const component = findParentComponent(
          componentFromElement(element),
          isWaitingForLikeComponent,
        );
        if (component?.proxy) {
          return component;
        }
      }
      timeWarpLog(
        "actions-scan-empty",
        {
          childCount: elements.length,
          hasWfRoot: Boolean(actionsBlock.querySelector(".wf-root")),
          vueKeys: elements
            .map((element) =>
              Object.keys(element)
                .filter((key) => key.includes("vue") || key.includes("vnode"))
                .slice(0, 8),
            )
            .filter((keys) => keys.length > 0)
            .slice(0, 4),
          text: cleanText(actionsBlock.textContent ?? "").slice(0, 160),
        },
        { limit: 10 },
      );
    }
    return findWaitingForComponentFromApp();
  };

  const getRootFromWaitingFor = (component) =>
    component?.proxy?.$root ?? component?.root?.proxy ?? null;

  const getPlayerViewFromRoot = (root) => root?.playerView ?? null;

  const getLiveWaitingFor = (root, component) => {
    const playerView = getPlayerViewFromRoot(root);
    if (playerView && Object.prototype.hasOwnProperty.call(playerView, "waitingFor")) {
      return playerView.waitingFor;
    }
    return component?.props?.waitingfor ?? component?.proxy?.waitingfor;
  };

  const isNormalTakeAction = (waitingFor) =>
    waitingFor?.type === "or" &&
    waitingFor?.buttonLabel === "Take action" &&
    Array.isArray(waitingFor.options);

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

  const getElementByPath = (root, path) => {
    let current = root;
    for (const index of path) {
      if (!current?.children || index >= current.children.length) {
        return null;
      }
      current = current.children[index];
    }
    return current;
  };

  const collectFormState = (root) => {
    const inputs = [];

    const visit = (element, path) => {
      if (element instanceof HTMLInputElement) {
        if (element.type === "checkbox" || element.type === "radio") {
          inputs.push({ path: [...path], type: element.type, checked: element.checked });
        } else {
          inputs.push({ path: [...path], type: element.type, value: element.value });
        }
      } else if (element instanceof HTMLTextAreaElement) {
        inputs.push({ path: [...path], type: "textarea", value: element.value });
      } else if (element instanceof HTMLSelectElement) {
        inputs.push({ path: [...path], type: "select", value: element.value });
      }

      Array.from(element.children).forEach((child, index) => {
        visit(child, [...path, index]);
      });
    };

    visit(root, []);
    return { inputs };
  };

  const restoreFormState = (root, state, attempt = 0) => {
    if (!state?.inputs) return;
    let needsRetry = false;

    for (const storedState of state.inputs) {
      const element = getElementByPath(root, storedState.path);
      if (!element?.isConnected) {
        needsRetry = true;
        continue;
      }

      if (element instanceof HTMLInputElement) {
        if (storedState.type === "checkbox" || storedState.type === "radio") {
          const checked = Boolean(storedState.checked);
          if (element.checked !== checked) {
            element.checked = checked;
            preserveScrollDuring(() => {
              dispatchBubbledEvent(element, "change");
              dispatchBubbledEvent(element, "input");
            });
          }
        } else if (storedState.value !== undefined && element.value !== storedState.value) {
          element.value = storedState.value;
          preserveScrollDuring(() => {
            dispatchBubbledEvent(element, "input");
            dispatchBubbledEvent(element, "change");
          });
        }
      } else if (
        (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) &&
        storedState.value !== undefined &&
        element.value !== storedState.value
      ) {
        element.value = storedState.value;
        preserveScrollDuring(() => {
          dispatchBubbledEvent(element, "input");
          dispatchBubbledEvent(element, "change");
        });
      }
    }

    if (needsRetry && attempt < 4) {
      window.setTimeout(() => restoreFormState(root, state, attempt + 1), 16);
    }
  };

  const timeWarp = {
    active: false,
    queue: [],
    lastError: "",
    patchedComponent: null,
    originalOnSave: null,
    originalCtxOnSave: null,
    renderingCachedAction: false,
    renderedCachedComponent: null,
    renderedFallbackKey: null,
    cachedWaitingFor: null,
    replayInFlight: false,
  };
  const hydratedTimeWarpPlayers = new Set();
  const hydratingTimeWarpPlayers = new Set();

  let latestPlayerView = null;
  let latestPlayerViewCapturedAt = 0;

  const looksLikePlayerView = (value) =>
    Boolean(value?.id && value?.game && Object.prototype.hasOwnProperty.call(value, "runId"));

  const rememberLatestPlayerView = (playerView, source) => {
    if (!looksLikePlayerView(playerView)) return;
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
  };

  const capturePlayerViewResponse = (response, source) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    try {
      if (!response?.clone) return;
      if (!response.ok) {
        timeWarpLog(
          "player-view-response-not-ok",
          { source, status: response.status, statusText: response.statusText },
          { limit: 8 },
        );
        return;
      }
      response
        .clone()
        .json()
        .then((value) => {
          if (looksLikePlayerView(value)) {
            rememberLatestPlayerView(value, source);
            return;
          }
          timeWarpLog(
            "player-view-json-not-player",
            {
              source,
              keys: value && typeof value === "object" ? Object.keys(value).slice(0, 12) : [],
            },
            { limit: 8 },
          );
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
    if (window.__TFMARS420_PLAYER_VIEW_CAPTURE_STARTED) {
      return;
    }
    window.__TFMARS420_PLAYER_VIEW_CAPTURE_STARTED = true;

    const originalFetch = window.fetch?.bind(window);
    if (originalFetch) {
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
    }
  };

  const timeWarpContext = () => {
    const component = findWaitingForComponent();
    const root = getRootFromWaitingFor(component);
    const playerView = getPlayerViewFromRoot(root);

    if (component && root && playerView?.id) {
      return {
        component,
        root,
        playerView,
        liveWaitingFor: getLiveWaitingFor(root, component),
        source: "vue",
      };
    }

    if (window.location.pathname === "/player" && latestPlayerView?.id) {
      timeWarpLog(
        "context-from-player-view",
        {
          playerId: latestPlayerView.id,
          ageMs: Date.now() - latestPlayerViewCapturedAt,
          hasComponent: Boolean(component),
          hasRoot: Boolean(root),
          phase: latestPlayerView.game?.phase,
          hasWaitingFor: Boolean(latestPlayerView.waitingFor),
        },
        { limit: 30 },
      );
      return {
        component,
        root,
        playerView: latestPlayerView,
        liveWaitingFor: latestPlayerView.waitingFor,
        source: "playerView",
      };
    }

    if (!component || !root || !playerView?.id) {
      timeWarpLog(
        "no-context",
        {
          hasComponent: Boolean(component),
          hasRoot: Boolean(root),
          hasPlayerView: Boolean(playerView),
          hasLatestPlayerView: Boolean(latestPlayerView),
          latestPlayerViewAgeMs: latestPlayerViewCapturedAt
            ? Date.now() - latestPlayerViewCapturedAt
            : undefined,
          pathname: window.location.pathname,
        },
        { limit: 12 },
      );
      return null;
    }
  };

  const getCachedWaitingFor = (playerId) => timeWarpCachedWaitingFor.get(playerId);

  const setCachedWaitingFor = (playerId, waitingFor) => {
    if (waitingFor === undefined) {
      timeWarpCachedWaitingFor.delete(playerId);
      return;
    }
    timeWarpCachedWaitingFor.set(playerId, cloneJson(waitingFor));
  };

  const getCachedUiState = (playerId) => timeWarpCachedUiState.get(playerId);

  const setCachedUiState = (playerId, state) => {
    if (state === undefined) {
      timeWarpCachedUiState.delete(playerId);
      return;
    }
    timeWarpCachedUiState.set(playerId, cloneJson(state));
  };

  const timeWarpSessionKey = (playerId) => `tfmars420:timewarp-session:${playerId}`;

  const persistTimeWarpSession = (contextOrPlayerId) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    const playerId =
      typeof contextOrPlayerId === "string"
        ? contextOrPlayerId
        : contextOrPlayerId?.playerView?.id;
    if (!playerId) return;

    if (
      !timeWarp.active &&
      timeWarp.queue.length === 0 &&
      !getCachedUiState(playerId) &&
      !timeWarp.cachedWaitingFor
    ) {
      extensionSessionRemove(timeWarpSessionKey(playerId));
      return;
    }

    extensionSessionSet(timeWarpSessionKey(playerId), {
      version: 1,
      playerId,
      active: timeWarp.active,
      queue: cloneJson(timeWarp.queue),
      cachedWaitingFor: cloneJson(
        timeWarp.cachedWaitingFor ?? getCachedWaitingFor(playerId) ?? null,
      ),
      cachedUiState: cloneJson(getCachedUiState(playerId) ?? null),
      lastError: timeWarp.lastError,
    });
  };

  const clearTimeWarpSession = (contextOrPlayerId) => {
    const playerId =
      typeof contextOrPlayerId === "string"
        ? contextOrPlayerId
        : contextOrPlayerId?.playerView?.id;
    if (!playerId) return;
    extensionSessionRemove(timeWarpSessionKey(playerId));
  };

  const hydrateTimeWarpSession = async (context) => {
    const playerId = context?.playerView?.id;
    if (!playerId || hydratedTimeWarpPlayers.has(playerId) || hydratingTimeWarpPlayers.has(playerId)) {
      return;
    }

    hydratingTimeWarpPlayers.add(playerId);
    try {
      const state = await extensionSessionGet(timeWarpSessionKey(playerId));
      if (!shouldRunTerraformingMarsHelpers()) {
        return;
      }
      hydratedTimeWarpPlayers.add(playerId);
      if (!state || state.version !== 1 || state.playerId !== playerId || !state.active) {
        return;
      }

      timeWarp.active = true;
      timeWarp.queue = Array.isArray(state.queue) ? cloneJson(state.queue) : [];
      timeWarp.lastError = state.lastError || "";
      timeWarp.cachedWaitingFor = state.cachedWaitingFor ? cloneJson(state.cachedWaitingFor) : null;
      if (state.cachedWaitingFor) {
        setCachedWaitingFor(playerId, state.cachedWaitingFor);
      }
      if (state.cachedUiState) {
        setCachedUiState(playerId, state.cachedUiState);
      }

      timeWarpLog(
        "session-hydrated",
        {
          playerId,
          queueLength: timeWarp.queue.length,
          hasCachedWaitingFor: Boolean(timeWarp.cachedWaitingFor),
          hasCachedUiState: Boolean(state.cachedUiState),
        },
        { limit: 8 },
      );
      renderTimeWarpPanel(context);
    } finally {
      hydratingTimeWarpPlayers.delete(playerId);
    }
  };

  const getWaitingForRootElement = (component) => {
    const element = component?.proxy?.$el;
    return element instanceof Element ? element : null;
  };

  const allPaymentUnits = [
    "megacredits",
    "steel",
    "titanium",
    "heat",
    "plants",
    "microbes",
    "floaters",
    "lunaArchivesScience",
    "spireScience",
    "seeds",
    "auroraiData",
    "graphene",
    "kuiperAsteroids",
  ];

  const emptyPayment = () =>
    Object.fromEntries(allPaymentUnits.map((unit) => [unit, 0]));

  const playerResourceAmount = (playerView, unit) => {
    const player = playerView?.thisPlayer ?? {};
    const value = player[unit];
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  };

  const simpleTitle = (value) => {
    if (typeof value === "string") return value;
    if (value?.message) return value.message;
    if (value?.data?.message) return value.data.message;
    return String(value ?? "");
  };

  const stableTitleString = (value) => {
    if (!value || typeof value !== "object") return simpleTitle(value);
    try {
      const normalize = (item) => {
        if (!item || typeof item !== "object") return item;
        if (Array.isArray(item)) return item.map(normalize);
        return Object.fromEntries(
          Object.keys(item)
            .sort()
            .map((key) => [key, normalize(item[key])]),
        );
      };
      return JSON.stringify(normalize(value));
    } catch {
      return simpleTitle(value);
    }
  };

  const optionTitleKeys = (title) => {
    const keys = new Set();
    const plainTitle = simpleTitle(title);
    if (plainTitle && plainTitle !== "[object Object]") {
      keys.add(plainTitle);
    }
    if (title?.key) keys.add(title.key);
    if (title?.data?.key) keys.add(title.data.key);
    const stableTitle = stableTitleString(title);
    if (stableTitle && stableTitle !== "[object Object]") {
      keys.add(stableTitle);
    }
    return keys;
  };

  const optionTitleLabel = (title) =>
    Array.from(optionTitleKeys(title))[0] ?? simpleTitle(title) ?? "unknown";

  const namedOptionValue = (value) => {
    if (typeof value === "string") return value;
    if (value?.name) return value.name;
    if (value?.id) return value.id;
    return String(value ?? "");
  };

  const addSmallNote = (root, text) => {
    const note = document.createElement("div");
    note.className = "tfmars420-timewarp-muted";
    note.textContent = text;
    root.appendChild(note);
  };

  const createFieldset = (title) => {
    const wrapper = document.createElement("div");
    const heading = document.createElement("div");
    heading.className = "tfmars420-timewarp-title";
    heading.textContent = simpleTitle(title);
    wrapper.appendChild(heading);
    return wrapper;
  };

  const createQueueButton = (label, onClick) => {
    const row = document.createElement("div");
    row.className = "tfmars420-timewarp-row";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label || "queue";
    button.addEventListener("click", onClick);
    row.appendChild(button);
    return row;
  };

  const readNumberInputs = (root, selector, fallback = 0) =>
    Array.from(root.querySelectorAll(selector)).reduce((values, input) => {
      const name = input.name;
      if (name) {
        const value = Number.parseInt(input.value, 10);
        values[name] = Number.isFinite(value) ? Math.max(0, value) : fallback;
      }
      return values;
    }, {});

  const createPaymentEditor = (root, playerView, card) => {
    const cost = Math.max(0, card?.calculatedCost ?? 0);
    const row = document.createElement("div");
    row.className = "tfmars420-timewarp-row";

    for (const unit of allPaymentUnits) {
      const available = unit === "megacredits" ? playerResourceAmount(playerView, unit) : playerResourceAmount(playerView, unit);
      if (unit !== "megacredits" && available <= 0) continue;

      const label = document.createElement("label");
      label.textContent = `${unit}: `;
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.name = unit;
      input.value = String(unit === "megacredits" ? Math.min(cost, available || cost) : 0);
      label.appendChild(input);
      row.appendChild(label);
    }

    root.appendChild(row);
    addSmallNote(root, `Default payment is ${cost} M€ when possible; adjust before queueing if you want to spend steel, titanium, heat, or other resources.`);
  };

  const getSelectedRadioValue = (root, name) =>
    root.querySelector(`input[name="${CSS.escape(name)}"]:checked`)?.value;

  const renderUnsupportedInput = (root, input) => {
    addSmallNote(root, `Time warp cannot render this input type yet: ${input?.type ?? "unknown"}.`);
  };

  const renderInputFallback = ({ root, input, playerView, onSave, path }) => {
    const wrapper = createFieldset(input?.title ?? input?.buttonLabel ?? input?.type);
    root.appendChild(wrapper);

    if (!input) {
      renderUnsupportedInput(wrapper, input);
      return;
    }

    if (input.warning) {
      addSmallNote(wrapper, simpleTitle(input.warning));
    }

    if (input.type === "or") {
      const options = Array.isArray(input.options) ? input.options : [];
      const radioName = `tfmars420-or-${path.join("-") || "root"}`;
      const child = document.createElement("div");
      child.className = "tfmars420-timewarp-child";

      options.forEach((option, index) => {
        const row = document.createElement("div");
        row.className = "tfmars420-timewarp-row";
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = radioName;
        radio.value = String(index);
        radio.checked = index === (input.initialIdx ?? 0);
        radio.addEventListener("change", () => {
          child.innerHTML = "";
          renderInputFallback({
            root: child,
            input: option,
            playerView,
            path: [...path, index],
            onSave: (response) => onSave({ type: "or", index, response }),
          });
        });
        label.appendChild(radio);
        label.append(` ${simpleTitle(option.title)}`);
        row.appendChild(label);
        wrapper.appendChild(row);
      });

      wrapper.appendChild(child);
      const selectedIndex = Number.parseInt(getSelectedRadioValue(wrapper, radioName) ?? "0", 10);
      if (options[selectedIndex]) {
        renderInputFallback({
          root: child,
          input: options[selectedIndex],
          playerView,
          path: [...path, selectedIndex],
          onSave: (response) => onSave({ type: "or", index: selectedIndex, response }),
        });
      }
      return;
    }

    if (input.type === "option") {
      wrapper.appendChild(createQueueButton(input.buttonLabel, () => onSave({ type: "option" })));
      return;
    }

    if (input.type === "projectCard") {
      const cards = (input.cards ?? []).filter((card) => card?.isDisabled !== true);
      if (cards.length === 0) {
        addSmallNote(wrapper, "No playable cards were present in the cached action.");
        return;
      }
      const radioName = `tfmars420-card-${path.join("-") || "root"}`;
      const cardList = document.createElement("div");
      cardList.className = "tfmars420-timewarp-card-list";
      const paymentRoot = document.createElement("div");

      const renderPaymentForSelectedCard = () => {
        paymentRoot.innerHTML = "";
        const selectedCardName = getSelectedRadioValue(wrapper, radioName) ?? cards[0].name;
        const card = cards.find((candidate) => candidate.name === selectedCardName) ?? cards[0];
        createPaymentEditor(paymentRoot, playerView, card);
      };

      cards.forEach((card, index) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = radioName;
        radio.value = card.name;
        radio.checked = index === 0;
        radio.addEventListener("change", renderPaymentForSelectedCard);
        label.appendChild(radio);
        label.append(` ${card.name}${Number.isFinite(card.calculatedCost) ? ` (${card.calculatedCost} M€)` : ""}`);
        cardList.appendChild(label);
      });

      wrapper.appendChild(cardList);
      wrapper.appendChild(paymentRoot);
      renderPaymentForSelectedCard();
      wrapper.appendChild(
        createQueueButton(input.buttonLabel, () => {
          const card = getSelectedRadioValue(wrapper, radioName) ?? cards[0].name;
          onSave({
            type: "projectCard",
            card,
            payment: { ...emptyPayment(), ...readNumberInputs(paymentRoot, "input[type='number']") },
          });
        }),
      );
      return;
    }

    if (input.type === "amount" || input.type === "deltaProject") {
      const row = document.createElement("div");
      row.className = "tfmars420-timewarp-row";
      const amount = document.createElement("input");
      amount.type = "number";
      amount.min = String(input.min ?? Math.min(...(input.validSteps ?? [0])));
      amount.max = String(input.max ?? Math.max(...(input.validSteps ?? [0])));
      amount.value = String(input.maxByDefault ? input.max : input.min ?? input.validSteps?.[0] ?? 0);
      row.appendChild(amount);
      wrapper.appendChild(row);
      wrapper.appendChild(
        createQueueButton(input.buttonLabel, () =>
          onSave({
            type: input.type,
            amount: Number.parseInt(amount.value, 10) || 0,
          }),
        ),
      );
      return;
    }

    if (input.type === "card") {
      const cards = input.cards ?? [];
      const name = `tfmars420-select-card-${path.join("-") || "root"}`;
      const multiple = input.max !== 1 || input.min !== 1;
      const cardList = document.createElement("div");
      cardList.className = "tfmars420-timewarp-card-list";
      cards.forEach((card, index) => {
        const label = document.createElement("label");
        const selector = document.createElement("input");
        selector.type = multiple ? "checkbox" : "radio";
        selector.name = name;
        selector.value = card.name;
        selector.checked = index === 0 && !multiple;
        label.appendChild(selector);
        label.append(` ${card.name}`);
        cardList.appendChild(label);
      });
      wrapper.appendChild(cardList);
      wrapper.appendChild(
        createQueueButton(input.buttonLabel, () => {
          const selected = Array.from(wrapper.querySelectorAll(`input[name="${CSS.escape(name)}"]:checked`))
            .map((element) => element.value);
          const min = input.min ?? 0;
          const max = input.max ?? selected.length;
          if (selected.length < min || selected.length > max) {
            timeWarp.lastError = `Select between ${min} and ${max} cards.`;
            renderTimeWarpPanel();
            return;
          }
          onSave({ type: "card", cards: selected });
        }),
      );
      return;
    }

    const simpleSelectConfigs = {
      player: ["player", input.players ?? []],
      delegate: ["player", input.players ?? []],
      party: ["partyName", input.parties ?? []],
      colony: ["colonyName", input.coloniesModel?.map((colony) => colony.name) ?? []],
      space: ["spaceId", input.spaces ?? []],
      globalEvent: ["globalEventName", input.globalEventNames ?? []],
      resource: ["resource", input.include ?? []],
    };
    const simpleConfig = simpleSelectConfigs[input.type];
    if (simpleConfig) {
      const [field, values] = simpleConfig;
      const select = document.createElement("select");
      values.forEach((value) => {
        const option = document.createElement("option");
        option.value = namedOptionValue(value);
        option.textContent = namedOptionValue(value);
        select.appendChild(option);
      });
      const row = document.createElement("div");
      row.className = "tfmars420-timewarp-row";
      row.appendChild(select);
      wrapper.appendChild(row);
      wrapper.appendChild(
        createQueueButton(input.buttonLabel, () =>
          onSave({ type: input.type, [field]: select.value }),
        ),
      );
      return;
    }

    renderUnsupportedInput(wrapper, input);
  };

  const queueFallbackResponse = (context, payload) => {
    timeWarp.queue.push(cloneJson(payload));
    timeWarp.lastError = "";
    rememberTimeWarpUiState(context);
    persistTimeWarpSession(context);
    timeWarpLog(
      "queued-fallback",
      {
        playerId: context.playerView.id,
        payload,
        queueLength: timeWarp.queue.length,
      },
      { limit: 20 },
    );
    renderTimeWarpPanel(context);
    renderFallbackCachedWaitingFor(context, timeWarp.cachedWaitingFor ?? getCachedWaitingFor(context.playerView.id));
  };

  const fallbackRenderKey = (context, cachedWaitingFor) =>
    JSON.stringify({
      playerId: context?.playerView?.id,
      buttonLabel: cachedWaitingFor?.buttonLabel,
      titles: cachedWaitingFor?.options?.map((option) => simpleTitle(option.title)) ?? [],
    });

  const getFallbackFormContainer = (context) => {
    const actionsBlock = document.querySelector(".player_home_block--actions");
    if (!actionsBlock || !context?.playerView?.id) return null;
    let form = document.getElementById(timeWarpFallbackFormId);
    if (!form) {
      form = document.createElement("div");
      form.id = timeWarpFallbackFormId;
      const panel = document.getElementById(timeWarpPanelId);
      if (panel?.nextSibling) {
        actionsBlock.insertBefore(form, panel.nextSibling);
      } else if (panel) {
        actionsBlock.insertBefore(form, panel.nextSibling);
      } else {
        actionsBlock.prepend(form);
      }
    }
    return form;
  };

  function renderFallbackCachedWaitingFor(context, cachedWaitingFor) {
    const form = getFallbackFormContainer(context);
    if (!form) return;
    const config = getTimeWarpConfig();
    if (!timeWarp.active || !isNormalTakeAction(cachedWaitingFor)) {
      form.hidden = true;
      form.innerHTML = "";
      form.dataset.renderKey = "";
      timeWarp.renderedFallbackKey = null;
      return;
    }

    const renderKey = fallbackRenderKey(context, cachedWaitingFor);
    if (
      config.fallbackRenderer?.preserveFormWhileActive !== false &&
      form.dataset.renderKey === renderKey &&
      timeWarp.renderedFallbackKey === renderKey &&
      form.childElementCount > 0
    ) {
      form.hidden = false;
      return;
    }

    form.hidden = false;
    form.innerHTML = "";
    form.dataset.renderKey = renderKey;
    timeWarp.renderedFallbackKey = renderKey;
    renderInputFallback({
      root: form,
      input: cachedWaitingFor,
      playerView: context.playerView,
      path: [],
      onSave: (payload) => queueFallbackResponse(context, payload),
    });
    restoreTimeWarpUiState(context);
  }

  const clearFallbackCachedWaitingFor = () => {
    const form = document.getElementById(timeWarpFallbackFormId);
    if (form) {
      form.hidden = true;
      form.innerHTML = "";
      form.dataset.renderKey = "";
    }
    timeWarp.renderedFallbackKey = null;
  };

  const getTimeWarpUiStateRootElement = (context) =>
    getWaitingForRootElement(context?.component) ??
    document.getElementById(timeWarpFallbackFormId);

  const rememberTimeWarpUiState = (context = timeWarpContext()) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    if (!timeWarp.active || !context?.playerView?.id) return;
    const rootElement = getTimeWarpUiStateRootElement(context);
    if (!rootElement) return;
    try {
      setCachedUiState(context.playerView.id, collectFormState(rootElement));
      persistTimeWarpSession(context);
    } catch (error) {
      console.warn("[tfmars420] unable to remember time-warp UI state", error);
    }
  };

  const restoreTimeWarpUiState = (context) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    if (!timeWarp.active || !context?.playerView?.id) return;
    const state = getCachedUiState(context.playerView.id);
    if (!state) return;
    const rootElement = getTimeWarpUiStateRootElement(context);
    if (!rootElement) return;
    restoreFormState(rootElement, state);
  };

  const forceComponentUpdate = (component) => {
    try {
      component?.proxy?.$forceUpdate?.();
    } catch (error) {
      console.warn("[tfmars420] unable to force Vue update", error);
    }
  };

  const setComponentWaitingFor = (component, waitingFor) => {
    const attempts = [
      () => {
        if (component?.props) component.props.waitingfor = waitingFor;
      },
      () => {
        if (component?.vnode?.props) component.vnode.props.waitingfor = waitingFor;
      },
      () => {
        if (component?.proxy) component.proxy.waitingfor = waitingFor;
      },
    ];

    for (const attempt of attempts) {
      try {
        attempt();
      } catch (error) {
        console.warn("[tfmars420] unable to set one waiting-for prop path", error);
      }
    }
    forceComponentUpdate(component);
  };

  const patchWaitingForOnSave = (context) => {
    const { component, playerView } = context;
    if (timeWarp.patchedComponent === component) return;

    restoreWaitingForPatch();
    timeWarp.patchedComponent = component;
    timeWarp.originalOnSave = component.proxy?.onsave;
    timeWarp.originalCtxOnSave = component.ctx?.onsave;

    const queueOnSave = (out) => {
      if (!timeWarp.active) {
        timeWarp.originalOnSave?.call(component.proxy, out);
        return;
      }

      const payload = cloneJson(out);
      delete payload.runId;
      timeWarp.queue.push(payload);
      timeWarpLog(
        "queued",
        {
          playerId: playerView.id,
          payload,
          queueLength: timeWarp.queue.length,
        },
        { limit: 20 },
      );
      timeWarp.lastError = "";
      rememberTimeWarpUiState(context);
      renderTimeWarpPanel(context);
    };

    try {
      if (component.ctx) component.ctx.onsave = queueOnSave;
      if (component.proxy) component.proxy.onsave = queueOnSave;
    } catch (error) {
      timeWarp.lastError = `Unable to prepare time warp for ${playerView.id}`;
      console.warn("[tfmars420] unable to patch onsave", error);
    }
    forceComponentUpdate(component);
  };

  function restoreWaitingForPatch() {
    const component = timeWarp.patchedComponent;
    if (!component) return;

    try {
      if (component.ctx && timeWarp.originalCtxOnSave) {
        component.ctx.onsave = timeWarp.originalCtxOnSave;
      }
      if (component.proxy && timeWarp.originalOnSave) {
        component.proxy.onsave = timeWarp.originalOnSave;
      }
    } catch (error) {
      console.warn("[tfmars420] unable to restore onsave", error);
    }

    timeWarp.patchedComponent = null;
    timeWarp.originalOnSave = null;
    timeWarp.originalCtxOnSave = null;
  }

  const renderCachedWaitingFor = (context, cachedWaitingFor) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    if (!context.component || !context.root) {
      renderFallbackCachedWaitingFor(context, cachedWaitingFor);
      return;
    }

    if (timeWarp.renderedCachedComponent === context.component) {
      patchWaitingForOnSave(context);
      return;
    }
    if (timeWarp.renderingCachedAction) return;
    timeWarp.renderingCachedAction = true;
    timeWarp.cachedWaitingFor = cachedWaitingFor;
    timeWarp.renderedCachedComponent = context.component;
    patchWaitingForOnSave(context);
    setComponentWaitingFor(context.component, cachedWaitingFor);
    window.setTimeout(() => {
      restoreTimeWarpUiState(context);
      timeWarp.renderingCachedAction = false;
    }, 0);
    window.setTimeout(() => restoreTimeWarpUiState(context), 32);
  };

  const clearRenderedCachedWaitingFor = (context) => {
    clearFallbackCachedWaitingFor();
    if (!context?.component) return;
    timeWarp.renderedCachedComponent = null;
    timeWarp.cachedWaitingFor = null;
    setComponentWaitingFor(context.component, context.liveWaitingFor);
  };

  const timeWarpQueueSummary = () => {
    if (timeWarp.queue.length === 0) return "queue empty";
    return `${timeWarp.queue.length} queued action${timeWarp.queue.length === 1 ? "" : "s"}`;
  };

  const timeWarpQueueText = () => {
    if (timeWarp.queue.length === 0) return "";
    return JSON.stringify(timeWarp.queue, null, 2);
  };

  const renderTimeWarpPanel = (context = timeWarpContext()) => {
    if (!shouldRunTerraformingMarsHelpers()) {
      removeTimeWarpUi();
      return;
    }
    upsertCss(timeWarpCssId, timeWarpCss());

    const actionsBlock = document.querySelector(".player_home_block--actions");
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

    if (getTimeWarpConfig().enabled === false) {
      panel.hidden = true;
      clearFallbackCachedWaitingFor();
      return;
    }

    if (!context?.playerView?.id) {
      panel.hidden = true;
      return;
    }

    const cachedWaitingFor = getCachedWaitingFor(context.playerView.id);
    const isActionPhase = context.playerView.game?.phase === "action";
    const canActivate =
      !timeWarp.active &&
      !context.liveWaitingFor &&
      isActionPhase &&
      isNormalTakeAction(cachedWaitingFor);
    timeWarpLog(
      "panel-state",
      {
        playerId: context.playerView.id,
        source: context.source,
        phase: context.playerView.game?.phase,
        active: timeWarp.active,
        hasComponent: Boolean(context.component),
        hasRoot: Boolean(context.root),
        hasLiveWaitingFor: Boolean(context.liveWaitingFor),
        liveType: context.liveWaitingFor?.type,
        liveButtonLabel: context.liveWaitingFor?.buttonLabel,
        hasCachedWaitingFor: Boolean(cachedWaitingFor),
        cachedType: cachedWaitingFor?.type,
        cachedButtonLabel: cachedWaitingFor?.buttonLabel,
        canActivate,
      },
      { limit: 40 },
    );

    if (!timeWarp.active && !canActivate && !timeWarp.lastError) {
      panel.hidden = true;
      return;
    }

    panel.hidden = false;
    panel.innerHTML = "";

    if (timeWarp.active) {
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "tfmars420-timewarp-anchor";
      cancel.textContent = "reality anchor";
      cancel.addEventListener("click", () => deactivateTimeWarp("cancelled"));
      panel.appendChild(cancel);

      const summary = document.createElement("span");
      summary.className = "tfmars420-timewarp-summary";
      summary.textContent = `time warp active: ${timeWarpQueueSummary()}`;
      panel.appendChild(summary);
    } else if (canActivate) {
      const activate = document.createElement("button");
      activate.type = "button";
      activate.textContent = "time warp";
      activate.addEventListener("click", () => activateTimeWarp());
      panel.appendChild(activate);

      const summary = document.createElement("span");
      summary.className = "tfmars420-timewarp-summary";
      summary.textContent = "queue a normal action while waiting";
      panel.appendChild(summary);
    }

    const queueText = timeWarpQueueText();
    if (queueText) {
      const queue = document.createElement("pre");
      queue.className = "tfmars420-timewarp-queue";
      queue.textContent = queueText;
      panel.appendChild(queue);
    }

    if (timeWarp.lastError) {
      const error = document.createElement("div");
      error.className = "tfmars420-timewarp-error";
      error.textContent = timeWarp.lastError;
      panel.appendChild(error);
    }
  };

  const activateTimeWarp = () => {
    if (getTimeWarpConfig().enabled === false) {
      timeWarp.lastError = "Time warp is disabled by tfmars420 remote config.";
      renderTimeWarpPanel();
      return;
    }
    const context = timeWarpContext();
    if (!context) {
      timeWarpLog("activate-no-context", {}, { limit: 10 });
      return;
    }
    const cachedWaitingFor = getCachedWaitingFor(context.playerView.id);
    if (
      context.playerView.game?.phase !== "action" ||
      context.liveWaitingFor ||
      !isNormalTakeAction(cachedWaitingFor)
    ) {
      timeWarpLog(
        "activate-blocked",
        {
          playerId: context.playerView.id,
          phase: context.playerView.game?.phase,
          hasLiveWaitingFor: Boolean(context.liveWaitingFor),
          hasCachedWaitingFor: Boolean(cachedWaitingFor),
          cachedType: cachedWaitingFor?.type,
          cachedButtonLabel: cachedWaitingFor?.buttonLabel,
        },
        { limit: 10 },
      );
      return;
    }

    if (!context.component || !context.root) {
      timeWarpLog(
        "activate-fallback-renderer",
        {
          playerId: context.playerView.id,
          source: context.source,
          hasComponent: Boolean(context.component),
          hasRoot: Boolean(context.root),
          hasCachedWaitingFor: Boolean(cachedWaitingFor),
        },
        { limit: 10 },
      );
      timeWarp.active = true;
      timeWarp.queue = [];
      timeWarp.lastError = "";
      timeWarp.cachedWaitingFor = cachedWaitingFor;
      persistTimeWarpSession(context);
      renderFallbackCachedWaitingFor(context, cachedWaitingFor);
      renderTimeWarpPanel(context);
      return;
    }

    timeWarpLog("activate", { playerId: context.playerView.id }, { limit: 10 });
    timeWarp.active = true;
    timeWarp.queue = [];
    timeWarp.lastError = "";
    timeWarp.cachedWaitingFor = cachedWaitingFor;
    persistTimeWarpSession(context);
    renderCachedWaitingFor(context, cachedWaitingFor);
    renderTimeWarpPanel(context);
  };

  function deactivateTimeWarp(reason, context = timeWarpContext()) {
    timeWarpLog(
      "deactivate",
      {
        reason,
        playerId: context?.playerView?.id,
        queueLength: timeWarp.queue.length,
      },
      { limit: 20 },
    );
    rememberTimeWarpUiState(context);
    restoreWaitingForPatch();
    timeWarp.active = false;
    timeWarp.queue = [];
    timeWarp.replayInFlight = false;
    timeWarp.renderingCachedAction = false;
    timeWarp.renderedCachedComponent = null;
    timeWarp.cachedWaitingFor = null;
    if (reason && reason !== "cancelled") {
      timeWarp.lastError = reason;
    } else if (reason === "cancelled") {
      timeWarp.lastError = "";
    }
    clearRenderedCachedWaitingFor(context);
    clearTimeWarpSession(context);
    renderTimeWarpPanel(context);
  }

  const updateRootPlayerView = (root, playerView) => {
    root.screen = "empty";
    root.playerView = playerView;
    root.playerkey++;
    root.screen = "player-home";
  };

  const replayNextQueuedAction = async (context) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    if (timeWarp.replayInFlight || timeWarp.queue.length === 0) return;

    const cachedWaitingFor = getCachedWaitingFor(context.playerView.id);
    const liveWaitingFor = context.liveWaitingFor;
    if (!isNormalTakeAction(cachedWaitingFor) || !isNormalTakeAction(liveWaitingFor)) {
      return;
    }

    const payload = cloneJson(timeWarp.queue[0]);
    const selectedOptionTitle = cachedWaitingFor.options?.[payload.index]?.title;
    const selectedOptionTitleKeys = optionTitleKeys(selectedOptionTitle);
    const selectedOptionTitleLabel = optionTitleLabel(selectedOptionTitle);
    const nextIndex = liveWaitingFor.options.findIndex((option) =>
      Array.from(optionTitleKeys(option.title)).some((key) => selectedOptionTitleKeys.has(key)),
    );
    timeWarpLog(
      "replay-match",
      {
        playerId: context.playerView.id,
        selectedOptionTitle: selectedOptionTitleLabel,
        nextIndex,
        cachedTitles: cachedWaitingFor.options.map((option) => optionTitleLabel(option.title)),
        liveTitles: liveWaitingFor.options.map((option) => optionTitleLabel(option.title)),
      },
      { limit: 20 },
    );

    if (nextIndex === -1) {
      deactivateTimeWarp(`Unable to match queued action: ${selectedOptionTitleLabel}`, context);
      return;
    }

    if (context.root?.isServerSideRequestInProgress) {
      deactivateTimeWarp("Server request already in progress", context);
      return;
    }

    payload.index = nextIndex;
    payload.runId = context.playerView.runId;
    timeWarp.replayInFlight = true;
    if (context.root) {
      context.root.isServerSideRequestInProgress = true;
    }
    timeWarpLog(
      "replay-post",
      {
        playerId: context.playerView.id,
        payload,
      },
      { limit: 20 },
    );
    renderTimeWarpPanel(context);

    try {
      const response = await fetch(`player/input?id=${encodeURIComponent(context.playerView.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Server rejected queued action: ${response.status} ${response.statusText}`);
      }

      const nextPlayerView = await response.json();
      if (!shouldRunTerraformingMarsHelpers()) {
        if (context.root) {
          context.root.isServerSideRequestInProgress = false;
        }
        timeWarp.replayInFlight = false;
        cleanupTerraformingMarsHelpersForHidden();
        return;
      }
      timeWarpLog(
        "replay-success",
        {
          playerId: context.playerView.id,
          remainingBeforeShift: timeWarp.queue.length,
          nextWaitingForType: nextPlayerView?.waitingFor?.type,
          nextWaitingForButtonLabel: nextPlayerView?.waitingFor?.buttonLabel,
        },
        { limit: 20 },
      );
      if (context.root) {
        context.root.isServerSideRequestInProgress = false;
      }
      timeWarp.replayInFlight = false;
      timeWarp.queue.shift();

      const hasMoreQueuedActions = timeWarp.queue.length > 0;
      if (!hasMoreQueuedActions) {
        restoreWaitingForPatch();
        timeWarp.active = false;
        timeWarp.renderingCachedAction = false;
        timeWarp.renderedCachedComponent = null;
        timeWarp.cachedWaitingFor = null;
        clearFallbackCachedWaitingFor();
        clearTimeWarpSession(context);
      } else {
        persistTimeWarpSession(context);
      }
      rememberLatestPlayerView(nextPlayerView, "replay");
      if (context.root) {
        updateRootPlayerView(context.root, nextPlayerView);
      } else {
        timeWarpLog(
          "replay-no-root-skip-reload",
          {
            playerId: context.playerView.id,
            remainingAfterShift: timeWarp.queue.length,
            nextWaitingForType: nextPlayerView?.waitingFor?.type,
            nextWaitingForButtonLabel: nextPlayerView?.waitingFor?.buttonLabel,
          },
          { limit: 12 },
        );
      }
      renderTimeWarpPanel();
    } catch (error) {
      if (context.root) {
        context.root.isServerSideRequestInProgress = false;
      }
      const message = error instanceof Error ? error.message : String(error);
      timeWarpLog(
        "replay-error",
        {
          playerId: context.playerView.id,
          message,
        },
        { limit: 20 },
      );
      deactivateTimeWarp(message, context);
    }
  };

  const updateTimeWarp = () => {
    if (!shouldRunTerraformingMarsHelpers()) {
      cleanupTerraformingMarsHelpersForHidden();
      return;
    }

    if (getTimeWarpConfig().enabled === false) {
      if (timeWarp.active) {
        deactivateTimeWarp("Time warp is disabled by tfmars420 remote config");
      }
      renderTimeWarpPanel();
      return;
    }

    const context = timeWarpContext();
    if (!context) {
      renderTimeWarpPanel(null);
      return;
    }
    hydrateTimeWarpSession(context);

    const { playerView, liveWaitingFor } = context;
    if (isNormalTakeAction(liveWaitingFor) && !timeWarp.active) {
      setCachedWaitingFor(playerView.id, cloneJson(liveWaitingFor));
      timeWarpLog(
        "cached-waitingfor",
        {
          playerId: playerView.id,
          optionTitles: liveWaitingFor.options.map((option) => option.title),
        },
        { limit: 20 },
      );
    } else {
      timeWarpLog(
        "not-caching",
        {
          playerId: playerView.id,
          phase: playerView.game?.phase,
          active: timeWarp.active,
          hasLiveWaitingFor: Boolean(liveWaitingFor),
          liveType: liveWaitingFor?.type,
          liveButtonLabel: liveWaitingFor?.buttonLabel,
        },
        { limit: 30 },
      );
    }

    if (timeWarp.active) {
      if (playerView.game?.phase !== "action") {
        deactivateTimeWarp("Time warp cancelled outside action phase", context);
        return;
      }
      if (liveWaitingFor) {
        timeWarp.renderedCachedComponent = null;
        if (timeWarp.queue.length === 0) {
          deactivateTimeWarp("cancelled", context);
          return;
        }
        replayNextQueuedAction(context);
      } else {
        const cachedWaitingFor = timeWarp.cachedWaitingFor ?? getCachedWaitingFor(playerView.id);
        if (isNormalTakeAction(cachedWaitingFor)) {
          renderCachedWaitingFor(context, cachedWaitingFor);
        }
      }
    }

    renderTimeWarpPanel(context);
  };

  const startTimeWarp = () => {
    updateTimeWarp();
    window.setInterval(updateTimeWarp, 500);
  };

  const handleTimeWarpFormChange = (event) => {
    if (!shouldRunTerraformingMarsHelpers()) return;
    if (!timeWarp.active) return;
    const context = timeWarpContext();
    const rootElement = getWaitingForRootElement(context?.component);
    const fallbackElement = document.getElementById(timeWarpFallbackFormId);
    if (rootElement?.contains(event.target) || fallbackElement?.contains(event.target)) {
      window.setTimeout(() => rememberTimeWarpUiState(context), 0);
    }
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

  loadRemoteRuntimeConfig();
  startPlayerViewCapture();

  document.addEventListener("change", handleSingleCardSelectionChange, true);
  document.addEventListener("change", handleTimeWarpFormChange, true);
  document.addEventListener("input", handleTimeWarpFormChange, true);
  window.addEventListener("beforeunload", () => {
    if (shouldRunTerraformingMarsHelpers()) {
      rememberTimeWarpUiState();
    }
  });

  ready(() => {
    startBoardNotes();
    startPreview();
    startTimeWarp();
  });
})();
