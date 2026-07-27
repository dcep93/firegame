import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./content.js", import.meta.url), "utf8");

test("in-page release version travels with content.js", () => {
  assert.match(source, /const contentScriptVersion = "v1\.0\.6"/);
  assert.match(
    source,
    /firegame-colonist-dice-version"[^]*\$\{contentScriptVersion\}/,
  );
  assert.match(source, /version\.textContent = contentScriptVersion/);
  assert.doesNotMatch(
    source,
    /manifestVersion|request-extension-version|tfmars420:extension-version/,
  );
});
const auditLoggerSource = source.slice(
  source.indexOf("const auditLog"),
  source.indexOf("const requestRuntimeUpdate"),
);
const storageWriteSource = source.slice(
  source.indexOf("const writeStorageString"),
  source.indexOf("const readExtensionActive"),
);
const firebaseWriteSource = source.slice(
  source.indexOf("const firebaseLobbyFieldUrl"),
  source.indexOf("const formatLobbyTimestamp"),
);
const networkPassQualificationSource = source.slice(
  source.indexOf("const playerInputModelTitle"),
  source.indexOf("const rememberLatestPlayerView"),
);
const networkPassSelectionSource = source.slice(
  source.indexOf("const maybeSelectNetworkDefaultPass"),
  source.indexOf("const selectIndexedRadioOption"),
);
const networkTurnTrackingSource = source.slice(
  source.indexOf("const playerInputModelTitle"),
  source.indexOf("const shouldArmNetworkPassSelection"),
);
const playerViewQueueRearmSource = source.slice(
  source.indexOf("const playerViewWaitingForKey"),
  source.indexOf("const capturePlayerViewResponse"),
);
const playedActionLearningSource = source.slice(
  source.indexOf("const playerInputModelTitle"),
  source.indexOf("const rememberNetworkTurnState"),
);
const turnScrollSource = source.slice(
  source.indexOf("const maybeScrollToBottomForTurn"),
  source.indexOf("const selectIndexedRadioOption"),
);
const turnTintSource = source.slice(
  source.indexOf("const playerHomeTurnTintState"),
  source.indexOf("const isWorldGovernmentTerraformingPrompt"),
);
const extensionToggleSource = source.slice(
  source.indexOf("const setExtensionActive"),
  source.indexOf("const reloadRuntime"),
);
const domUpdateSource = source.slice(
  source.indexOf("const runTerraformingMarsDomUpdate"),
  source.indexOf("const scheduleTerraformingMarsDomUpdate"),
);
const domObserverStartSource = source.slice(
  source.indexOf("const startTerraformingMarsDomObserver"),
  source.indexOf("function removeTimeWarpUi"),
);
const queueUiUpdateSource = source.slice(
  source.indexOf("const updateQueueUi"),
  source.indexOf("const scheduleTerraformingMarsUpdate"),
);
const navigationHotkeySource = source.slice(
  source.indexOf("const isEditableNavigationHotkeyTarget"),
  source.indexOf("const startTerraformingMarsNavigationHotkeys"),
);
const handSortStateSource = source.slice(
  source.indexOf("const normalizeHandSortMode"),
  source.indexOf("const writeQueueSession"),
);
const enqueueAutopilotSource = source.slice(
  source.indexOf("const enqueueAutopilot"),
  source.indexOf("const isCurrentPlayerTurn"),
);
const globalTagRecognitionSource = source.slice(
  source.indexOf("const terraformingMarsTagTypes"),
  source.indexOf("const freshQueueSession"),
);
const handSortAlgorithmSource = source.slice(
  source.indexOf("const compareHandServerOrder"),
  source.indexOf("const handSortableContainer"),
);
const globalTagClickSource = source.slice(
  source.indexOf("const handleGlobalHandTagClick"),
  source.indexOf("const playerViewHandCards"),
);
const handSortDomSource = source.slice(
  source.indexOf("const handSortableContainer"),
  source.indexOf("const visibleProjectCost"),
);
const handToolsSource = source.slice(
  source.indexOf("const renderHandCardTools"),
  source.indexOf("const isUnusedPlayedActionCard"),
);
const targetEligibilitySource = source.slice(
  source.indexOf("const isEnqueueablePlayedCardTarget"),
  source.indexOf("const renderPlayedActionTools"),
);
const queuedCardCountSource = source.slice(
  source.indexOf("const queuedCardMatches"),
  source.indexOf("const removeQueuedCard"),
);
const quickChoiceCaptureSource = source.slice(
  source.indexOf("const exactRadioOptionText"),
  source.indexOf("const queuedCardMatches"),
);
const quickChoiceUiSource = source.slice(
  source.indexOf("const quickChoiceQueueItem"),
  source.indexOf("const renderPlayedActionTools"),
);
const playedToolsSource = source.slice(
  source.indexOf("const renderPlayedActionTools"),
  source.indexOf("const updateQueueUi"),
);
const actionToolsSource = playedToolsSource.slice(
  playedToolsSource.indexOf("const existingActionButton"),
  playedToolsSource.indexOf("const existingTargetButton"),
);
const targetToolsSource = playedToolsSource.slice(
  playedToolsSource.indexOf("const existingTargetButton"),
);
const cardTargetSubmitSource = source.slice(
  source.indexOf("const clickCardTargetSubmit"),
  source.indexOf("const findActionCardForQueuedItem"),
);
const executeQueuedItemSource = source.slice(
  source.indexOf("const executeQueuedItem"),
  source.indexOf("const actionCardSelector"),
);
const radioOptionExecutionSource = executeQueuedItemSource.slice(
  executeQueuedItemSource.indexOf('if (item?.type === "radioOption")'),
  executeQueuedItemSource.indexOf('if (item?.type === "cardTarget")'),
);
const selectedRadioChildrenSource = source.slice(
  source.indexOf("const selectedRadioOptionHasChildren"),
  source.indexOf("const clickIndexedRadioSubmit"),
);
const exactQuickChoiceExecutionSource = source.slice(
  source.indexOf("const selectExactQuickChoiceOption"),
  source.indexOf("const clickIndexedRadioSubmit"),
);
const selectIndexedRadioSource = source.slice(
  source.indexOf("const selectIndexedRadioOption"),
  source.indexOf("const selectedRadioOptionHasChildren"),
);
const indexedRadioSubmitSource = source.slice(
  source.indexOf("const clickIndexedRadioSubmit"),
  source.indexOf("const clickCardTargetSubmit"),
);
const liveScoreDataSource = source.slice(
  source.indexOf("const baseGlobalContributionColumns"),
  source.indexOf("const timeWarpCss = () =>"),
);
const liveScoreRenderSource = source.slice(
  source.indexOf("const liveScoreText"),
  source.indexOf("const renderQueuePanel"),
);
const liveScoreCssSource = source.slice(
  source.indexOf(`#\${timeWarpPanelId} .tfmars420-live-scores-scroll`),
  source.indexOf(`#\${timeWarpPanelId} .tfmars420-radio-option-index`),
);
const queuePanelSource = source.slice(
  source.indexOf("const createQueueIconButton"),
  source.indexOf("const queuedProjectMoneyCost"),
);
const actionsMirrorSource = source.slice(
  source.indexOf("const actionsMirrorSourceAttribute"),
  source.indexOf("const createQueueIconButton"),
);
const queueItemLabelSource = source.slice(
  source.indexOf("const queueItemLabel"),
  source.indexOf("const queueCardName"),
);
const queuePromptSource = source.slice(
  source.indexOf("const isFollowUpQueueItem"),
  source.indexOf("const removeQueuedItemAt"),
);
const enqueueDecisionSource = source.slice(
  source.indexOf("const enqueueOrExecuteNow"),
  source.indexOf("const removeQueuedItemAt"),
);
const queueMutationSource = source.slice(
  source.indexOf("const removeQueuedItemAt"),
  source.indexOf("const clearQueuedActions"),
);
const queueLifecycleSource = source.slice(
  source.indexOf("const startQueueItemExecution"),
  source.indexOf("const maybeExecuteQueuedAction"),
);
const indexedQueueExecutionSource = source.slice(
  source.indexOf("const executeQueuedActionAt"),
  source.indexOf("const maybeExecuteQueuedAction"),
);
const queueExecutionSource = source.slice(
  source.indexOf("const maybeExecuteQueuedAction"),
  source.indexOf("const executeQueuedItem"),
);
const enabledExactPassOptionSource = source.slice(
  source.indexOf("const hasEnabledExactPassOption"),
  source.indexOf("const isWorldGovernmentTerraformingPrompt"),
);
const autopilotExecutionSource = executeQueuedItemSource.slice(
  executeQueuedItemSource.indexOf('if (item?.type === "autopilot")'),
  executeQueuedItemSource.indexOf('if (item?.type === "playedAction")'),
);
const autopilotActionHelpersSource = source.slice(
  source.indexOf("const executePassAction"),
  source.indexOf("const maybeSelectNetworkDefaultPass"),
);
const passActionSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const executePassAction"),
  autopilotActionHelpersSource.indexOf("const clickWorldGovernmentSubmit"),
);
const exactActionOptionSource = source.slice(
  source.indexOf("const selectExactActionOption"),
  source.indexOf("const executePassAction"),
);
const selectPowerPlantSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const selectPowerPlantStandardProject"),
  autopilotActionHelpersSource.indexOf("const clickExactActionSubmit"),
);
const exactActionSubmitSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const clickExactActionSubmit"),
  autopilotActionHelpersSource.indexOf("const tryExecutePowerPlantStandardProject"),
);
const powerPlantAttemptSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const tryExecutePowerPlantStandardProject"),
);
const worldGovernmentPromptSource = source.slice(
  source.indexOf("const isWorldGovernmentTerraformingPrompt"),
  source.indexOf("const baseGlobalContributionColumns"),
);
const finalGreeneryPromptSource = source.slice(
  source.indexOf("const isFinalGreeneryPlacementPrompt"),
  source.indexOf("const renderedSelectSpaceTitle"),
);
const researchPurchasePromptSource = source.slice(
  source.indexOf("const isResearchCardPurchaseTitle"),
  source.indexOf("const baseGlobalContributionColumns"),
);
const buyEverythingPromptSource = source.slice(
  source.indexOf("const isBuyEverythingPurchaseTitle"),
  source.indexOf("const baseGlobalContributionColumns"),
);
const worldGovernmentSubmitSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const clickWorldGovernmentSubmit"),
  autopilotActionHelpersSource.indexOf("const clickResearchPurchaseSkip"),
);
const worldGovernmentOceanPlacementSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf(
    "const leastBonusWorldGovernmentOceanPlacementSpace",
  ),
  autopilotActionHelpersSource.indexOf("const clickResearchPurchaseSkip"),
);
const worldGovernmentExecutionSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf(
    "const selectedWorldGovernmentOptionTitle",
  ),
  autopilotActionHelpersSource.indexOf("const clickResearchPurchaseSkip"),
);
const researchPurchaseSkipSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const clickResearchPurchaseSkip"),
  autopilotActionHelpersSource.indexOf("const buyEverythingPurchaseWorkflow"),
);
const buyEverythingPurchaseSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const buyEverythingPurchaseWorkflow"),
  autopilotActionHelpersSource.indexOf("const clickPurchasePaymentSubmit"),
);
const purchasePaymentSubmitSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const clickPurchasePaymentSubmit"),
  autopilotActionHelpersSource.indexOf("const executeBuyEverythingAutopilot"),
);
const buyEverythingAutopilotSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const executeBuyEverythingAutopilot"),
  autopilotActionHelpersSource.indexOf("const executeEscapeAutopilot"),
);
const escapeAutopilotSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const executeEscapeAutopilot"),
  autopilotActionHelpersSource.indexOf("const selectPowerPlantStandardProject"),
);
const finalGreenerySkipSource = autopilotActionHelpersSource.slice(
  autopilotActionHelpersSource.indexOf("const executeFinalGreenerySkip"),
  autopilotActionHelpersSource.indexOf("const executeEscapeAutopilot"),
);

const shouldArmNetworkPassSelection = Function(
  "cleanText",
  `"use strict"; ${networkPassQualificationSource}; return shouldArmNetworkPassSelection;`,
)((value) => String(value ?? "").replace(/\s+/g, " ").trim());

const createNetworkPassSelector = (options = {}) => {
  let selectionCount = 0;
  const state = Function(
    "isCurrentPlayerTurn",
    "hasLiveActionForm",
    "isTakeNextActionPhase",
    "selectActionOption",
    `"use strict";
      let pendingNetworkPassSelection = true;
      ${networkPassSelectionSource}
      return {
        select: maybeSelectNetworkDefaultPass,
        pending: () => pendingNetworkPassSelection,
      };
    `,
  )(
    () => options.isCurrentPlayerTurn ?? true,
    () => options.hasLiveActionForm ?? true,
    () => options.isTakeNextActionPhase ?? true,
    (label, selectOptions) => {
      assert.equal(label, "Pass for this generation");
      assert.deepEqual(selectOptions, {required: false});
      selectionCount += 1;
      return options.optionExists ?? true;
    },
  );
  return {...state, selectionCount: () => selectionCount};
};

const createNetworkTurnTracker = () =>
  Function(
    "cleanText",
    `"use strict";
      let lastNetworkTurnState;
      let pendingTurnScroll = false;
      ${networkTurnTrackingSource}
      return {
        remember: rememberNetworkTurnState,
        state: () => lastNetworkTurnState,
        pending: () => pendingTurnScroll,
        clearPending: () => { pendingTurnScroll = false; },
      };
    `,
  )((value) => String(value ?? "").replace(/\s+/g, " ").trim());

const createPlayedActionLearningTracker = (playerId = "player-1") =>
  Function(
    "cleanText",
    "currentPlayerId",
    `"use strict";
      let pendingPlayedActionLearning = null;
      let armedPlayedActionLearning = null;
      ${playedActionLearningSource}
      return {
        remember: rememberPlayedActionForLearning,
        update: updatePlayedActionLearningFromPlayerView,
        clear: clearPlayedActionLearning,
        state: () => ({
          pendingPlayedActionLearning,
          armedPlayedActionLearning,
        }),
      };
    `,
  )(
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    () => playerId,
  );

const createQuickChoiceCaptureHarness = ({
  optionText = "Gain a standard resource",
  targetCardText = "",
  direct = false,
  directPromptText = "",
  directSelectedInputCount = 1,
  directTargetDisabled = false,
  directWorkflowCount = 1,
  nestedCheckedOptionText = "",
  trusted = true,
  playbackActive = false,
} = {}) => {
  const isDirect = direct || directPromptText !== "";
  class FakeElement {
    closest(selector) {
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return submit;
    }
  }

  const draft = freshQueueSession("player-1");
  const auditEvents = [];
  let updateCount = 0;
  const outerOptions = isDirect ? null : {
    querySelectorAll(selector) {
      assert.equal(selector, "label.form-radio input[type='radio']:checked");
      return nestedRadio ? [topLevelRadio, nestedRadio] : [topLevelRadio];
    },
  };
  const nestedOptions = {};
  const selectedCardInput = targetCardText
    ? {
        disabled: directTargetDisabled,
        closest(selector) {
          assert.equal(selector, ".cardbox");
          return {name: targetCardText};
        },
      }
    : null;
  const cardWorkflow = targetCardText
    ? {
        querySelector(selector) {
          assert.equal(selector, ":scope > .wf-component-title");
          return directPromptText ? {textContent: directPromptText} : null;
        },
        querySelectorAll(selector) {
          if (
            selector ===
            "input[type='radio']:checked, input[type='checkbox']:checked"
          ) {
            return Array.from({length: directSelectedInputCount}, () => selectedCardInput);
          }
          assert.fail(`unexpected selector: ${selector}`);
        },
      }
    : null;
  const topLevelLabel = {
    parentElement: {
      querySelector(selector) {
        assert.equal(selector, ".wf-component--select-card");
        return cardWorkflow;
      },
    },
    querySelector(selector) {
      assert.equal(selector, "span");
      return {textContent: optionText};
    },
  };
  const topLevelRadio = {
    disabled: false,
    closest(selector) {
      if (selector === ".wf-options") return outerOptions;
      assert.equal(selector, "label.form-radio");
      return topLevelLabel;
    },
  };
  const nestedRadio = nestedCheckedOptionText
    ? {
        disabled: false,
        closest(selector) {
          if (selector === ".wf-options") return nestedOptions;
          assert.equal(selector, "label.form-radio");
          return {
            querySelector(labelSelector) {
              assert.equal(labelSelector, "span");
              return {textContent: nestedCheckedOptionText};
            },
          };
        },
      }
    : null;
  const actionsRoot = {
    querySelector(selector) {
      assert.equal(selector, ".wf-options");
      return outerOptions;
    },
    querySelectorAll(selector) {
      assert.equal(selector, ":scope > .wf-component--select-card");
      return isDirect && cardWorkflow
        ? Array.from({length: directWorkflowCount}, () => cardWorkflow)
        : [];
    },
  };
  const submit = {disabled: false};
  const actionsBlock = {
    contains(candidate) {
      return candidate === submit;
    },
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  const capture = Function(
    "Element",
    "getActionsBlock",
    "cleanText",
    "getCardIdentity",
    "updateQueueSession",
    "rememberQuickChoice",
    "auditLog",
    "initialPlaybackActive",
    `"use strict";
      let armedPlayedActionLearning = {
        playerId: "player-1",
        cardKey: "astrodrill",
        cardName: "AstroDrill",
      };
      let pendingPlayedActionLearning = null;
      let quickChoicePlaybackActive = initialPlaybackActive;
      let clearCount = 0;
      const clearPlayedActionLearning = () => {
        pendingPlayedActionLearning = null;
        armedPlayedActionLearning = null;
        clearCount += 1;
      };
      ${quickChoiceCaptureSource}
      return {
        handle: handleRememberedQuickChoiceSubmit,
        armed: () => armedPlayedActionLearning,
        clearCount: () => clearCount,
      };
    `,
  )(
    FakeElement,
    () => actionsBlock,
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (cardBox) => ({name: cardBox?.name ?? "Card"}),
    (updater) => {
      updateCount += 1;
      updater(draft);
      return draft;
    },
    rememberQuickChoice,
    (eventName, details) => auditEvents.push({eventName, details}),
    playbackActive,
  );
  return {
    ...capture,
    auditEvents,
    draft,
    event: {isTrusted: trusted, target: new FakeElement()},
    updateCount: () => updateCount,
  };
};

const createTurnScrollExecutor = (readiness = {}) => {
  const scrollCalls = [];
  const actions = [];
  const session = {
    autoProcess: readiness.autoProcess ?? false,
    queue: [...(readiness.queue ?? [{type: "pass"}])],
  };
  let updateCount = 0;
  const executor = Function(
    "isCurrentPlayerTurn",
    "hasLiveActionForm",
    "isTakeNextActionPhase",
    "readQueueSession",
    "updateQueueSession",
    "window",
    "document",
    `"use strict";
      let pendingTurnScroll = true;
      ${turnScrollSource}
      return {
        scroll: maybeScrollToBottomForTurn,
        pending: () => pendingTurnScroll,
      };
    `,
  )(
    () => readiness.isCurrentPlayerTurn ?? false,
    () => readiness.hasLiveActionForm ?? false,
    () => readiness.isTakeNextActionPhase ?? false,
    () => (readiness.sessionExists === false ? null : session),
    (updater) => {
      updateCount += 1;
      actions.push("update");
      updater(session);
      return session;
    },
    {
      scrollTo: (options) => {
        actions.push("scroll");
        scrollCalls.push(options);
      },
    },
    {documentElement: {scrollHeight: 4321}},
  );
  return {
    ...executor,
    scrollCalls,
    actions,
    session,
    updateCount: () => updateCount,
  };
};

const createNavigationHotkeyExecutor = ({
  active = true,
  innerHeight = 600,
  scrollHeight = 5000,
  scrollY = 100,
  targets = {},
} = {}) => {
  const scrollCalls = [];
  const selectors = [];
  const handle = Function(
    "document",
    "window",
    "timeWarpPanelId",
    "shouldRunTerraformingMarsHelpers",
    `"use strict";
      ${navigationHotkeySource}
      return handleTerraformingMarsNavigationHotkey;
    `,
  )(
    {
      documentElement: {scrollHeight},
      querySelector(selector) {
        selectors.push(selector);
        return targets[selector] ?? null;
      },
    },
    {
      getComputedStyle(target) {
        return target.style ?? {display: "block", visibility: "visible"};
      },
      innerHeight,
      scrollTo(options) {
        scrollCalls.push(options);
      },
      scrollY,
    },
    "tfmars420-timewarp-panel",
    () => active,
  );

  const event = (key, overrides = {}) => {
    let preventDefaultCount = 0;
    const keyboardEvent = {
      altKey: false,
      ctrlKey: false,
      key,
      metaKey: false,
      preventDefault() {
        preventDefaultCount += 1;
      },
      target: {closest: () => null},
      ...overrides,
    };
    return {
      keyboardEvent,
      preventDefaultCount: () => preventDefaultCount,
    };
  };

  return {event, handle, scrollCalls, selectors};
};

const createActionsMirrorExecutor = () => {
  const preserved = [];
  const dispatched = [];
  let refreshCount = 0;
  const executor = Function(
    "timeWarpPanelId",
    "lobbyRootClass",
    "preserveScrollDuring",
    "dispatchBubbledEvent",
    "scheduleTerraformingMarsUpdate",
    `"use strict";
      ${actionsMirrorSource}
      return {
        mapActionsMirrorElements,
        sanitizeActionsMirror,
        proxyActionsMirrorClick,
        proxyActionsMirrorValueEvent,
      };
    `,
  )(
    "tfmars420-timewarp-panel",
    "tfmars420-extension-ui",
    (callback) => {
      preserved.push(true);
      return callback();
    },
    (target, eventName) => dispatched.push({target, eventName}),
    () => {
      refreshCount += 1;
    },
  );
  return {
    ...executor,
    dispatched,
    preserved,
    refreshCount: () => refreshCount,
  };
};

const createMirrorEvent = (type, target) => {
  let preventDefaultCount = 0;
  let stopImmediatePropagationCount = 0;
  let stopPropagationCount = 0;
  return {
    event: {
      preventDefault() {
        preventDefaultCount += 1;
      },
      stopImmediatePropagation() {
        stopImmediatePropagationCount += 1;
      },
      stopPropagation() {
        stopPropagationCount += 1;
      },
      target,
      type,
    },
    preventDefaultCount: () => preventDefaultCount,
    stopImmediatePropagationCount: () => stopImmediatePropagationCount,
    stopPropagationCount: () => stopPropagationCount,
  };
};

const createTurnTintExecutor = ({
  active = true,
  canPass = false,
  isTurn = false,
  playerHomeExists = true,
  startingClasses = [],
} = {}) => {
  const classes = new Set(startingClasses);
  const playerHome = playerHomeExists
    ? {
        classList: {
          toggle(name, force) {
            if (force) {
              classes.add(name);
            } else {
              classes.delete(name);
            }
          },
        },
      }
    : null;
  const executor = Function(
    "document",
    "shouldRunTerraformingMarsHelpers",
    "isCurrentPlayerTurn",
    "hasEnabledExactPassOption",
    `"use strict";
      ${turnTintSource}
      return {playerHomeTurnTintState, updatePlayerHomeTurnTint};
    `,
  )(
    {
      querySelector(selector) {
        assert.equal(selector, "#player-home");
        return playerHome;
      },
    },
    () => active,
    () => isTurn,
    () => canPass,
  );
  return {...executor, classes};
};

const createTargetEligibilityCheck = (resourceCounter) =>
  Function(
    "cardContainerFromBox",
    `"use strict"; ${targetEligibilitySource}; return isEnqueueablePlayedCardTarget;`,
  )(() => ({
    querySelector(selector) {
      assert.equal(selector, ".card-resources-counter");
      return resourceCounter;
    },
  }));

const {
  normalizeHandSortMode,
  normalizeAutopilotMode,
  autopilotModeLabel,
  normalizeRememberedQuickChoice,
  normalizeRememberedQuickChoices,
  rememberQuickChoice,
  freshQueueSession,
  normalizeQueueSession,
  nextHandSortModeForTag,
  nextHandSortModeForCost,
} =
  Function(
    "isPlainObject",
    "cleanText",
    `"use strict";
      ${handSortStateSource}
      return {
        normalizeHandSortMode,
        normalizeAutopilotMode,
        autopilotModeLabel,
        normalizeRememberedQuickChoice,
        normalizeRememberedQuickChoices,
        rememberQuickChoice,
        freshQueueSession,
        normalizeQueueSession,
        nextHandSortModeForTag,
        nextHandSortModeForCost,
      };
    `,
  )(
    (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
  );

const {sortHandCardEntries} = Function(
  "normalizeHandSortMode",
  `"use strict"; ${handSortAlgorithmSource}; return {sortHandCardEntries};`,
)(normalizeHandSortMode);

const {terraformingMarsTagTypes, tagTypeFromClassNames} = Function(
  `"use strict";
    ${globalTagRecognitionSource}
    return {terraformingMarsTagTypes, tagTypeFromClassNames};
  `,
)();

const createGlobalTagClickHandler = ({
  helpersActive = true,
  handExists = true,
  sessionExists = true,
  resolvedTag = "science",
  initialMode = null,
} = {}) => {
  const draft = {handSortMode: initialMode};
  const auditEvents = [];
  let updateCount = 0;
  const handle = Function(
    "shouldRunTerraformingMarsHelpers",
    "terraformingMarsTagTypeFromElement",
    "handSortableContainer",
    "readQueueSession",
    "updateQueueSession",
    "nextHandSortModeForTag",
    "auditLog",
    `"use strict";
      ${globalTagClickSource}
      return handleGlobalHandTagClick;
    `,
  )(
    () => helpersActive,
    () => resolvedTag,
    () => (handExists ? {} : null),
    () => (sessionExists ? draft : null),
    (updater) => {
      updateCount += 1;
      updater(draft);
      return draft;
    },
    nextHandSortModeForTag,
    (eventName, details) => auditEvents.push({eventName, details}),
  );
  return {handle, draft, auditEvents, updateCount: () => updateCount};
};

const {countQueuedCards, latestQueuedPlayedActionMatches, targetQueueButtonPresentation} = Function(
  "normalizeCardName",
  `"use strict";
    ${queuedCardCountSource};
    return {countQueuedCards, latestQueuedPlayedActionMatches, targetQueueButtonPresentation};
  `,
)((value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());

const quickChoiceQueueItem = Function(
  `"use strict"; ${quickChoiceUiSource}; return quickChoiceQueueItem;`,
)();

const createCardTargetSubmit = (buttons) => {
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return buttons;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  return Function(
    "getActionsBlock",
    "preserveScrollDuring",
    `"use strict"; ${cardTargetSubmitSource}; return clickCardTargetSubmit;`,
  )(
    () => actionsBlock,
    (callback) => callback(),
  );
};

const selectedRadioOptionHasChildren = Function(
  `"use strict";
    ${selectedRadioChildrenSource}
    return selectedRadioOptionHasChildren;
  `,
)();

const createNestedWorkflow = ({selectOption = false, interactive = false} = {}) => ({
  classList: {
    contains(className) {
      assert.equal(className, "wf-component--select-option");
      return selectOption;
    },
  },
  querySelector(selector) {
    assert.equal(
      selector,
      "input:not([type='hidden']), select, textarea, button, .cardbox, .wf-component",
    );
    return interactive ? {} : null;
  },
});

const radioWithNestedWorkflow = (nestedWorkflow) => ({
  closest(selector) {
    assert.equal(selector, "label.form-radio");
    return {
      parentElement: {
        querySelector(childSelector) {
          assert.equal(childSelector, ":scope > div .wf-component");
          return nestedWorkflow;
        },
      },
    };
  },
});

const createIndexedRadioSubmit = (buttons) => {
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return buttons;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  return Function(
    "getActionsBlock",
    "preserveScrollDuring",
    `"use strict"; ${indexedRadioSubmitSource}; return clickIndexedRadioSubmit;`,
  )(
    () => actionsBlock,
    (callback) => callback(),
  );
};

const createIndexedRadioSelector = (radios) => {
  const dispatchedEvents = [];
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "input[type='radio']");
      return radios;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  const select = Function(
    "getActionsBlock",
    "preserveScrollDuring",
    "dispatchBubbledEvent",
    `"use strict";
      ${selectIndexedRadioSource}
      return selectIndexedRadioOption;
    `,
  )(
    () => actionsBlock,
    (callback) => callback(),
    (radio, eventName) => {
      dispatchedEvents.push({radio, eventName});
    },
  );
  return {select, dispatchedEvents};
};

const executeRadioOption = async ({hasChildren}) => {
  const events = [];
  await Function(
    "item",
    "selectIndexedRadioOption",
    "nextFrame",
    "selectedRadioOptionHasChildren",
    "clickIndexedRadioSubmit",
    `"use strict";
      return (async () => {
        ${radioOptionExecutionSource}
      })();
    `,
  )(
    {type: "radioOption", optionIndex: 2},
    (optionIndex) => {
      events.push(`select:${optionIndex}`);
      return {optionIndex};
    },
    async () => {
      events.push("frame");
    },
    (radio) => {
      events.push(`children:${radio.optionIndex}`);
      return hasChildren;
    },
    () => {
      events.push("submit");
    },
  );
  return events;
};

const createExactQuickChoiceHarness = ({
  optionLabels = [],
  targetCards = [],
  directPromptTexts = [],
  submitButtons = [{disabled: false}],
  hasChildren = false,
  hasCardWorkflow = true,
} = {}) => {
  const events = [];
  const createCardWorkflow = (promptText = "") => ({
    querySelector(selector) {
      assert.equal(selector, ":scope > .wf-component-title");
      return promptText ? {textContent: promptText} : null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, ".cardbox");
      return targetCards;
    },
  });
  const cardWorkflow = createCardWorkflow();
  const directWorkflows = directPromptTexts.map(createCardWorkflow);
  const labels = optionLabels.map(({text, disabled = false}) => {
    const radio = {
      checked: false,
      disabled,
      text,
      click() {
        events.push(`option:${text}`);
      },
    };
    const label = {
      parentElement: {
        querySelector(selector) {
          assert.equal(selector, ".wf-component--select-card");
          return hasCardWorkflow ? cardWorkflow : null;
        },
      },
      querySelector(selector) {
        assert.equal(selector, "input[type='radio']");
        return radio;
      },
    };
    radio.closest = (selector) => {
      assert.equal(selector, "label.form-radio");
      return label;
    };
    return label;
  });
  targetCards.forEach((card) => {
    card.input ??= {
      checked: false,
      disabled: false,
      click() {
        events.push(`target:${card.name}`);
      },
    };
    card.querySelector = (selector) => {
      assert.equal(selector, "input[type='radio'], input[type='checkbox']");
      return card.input;
    };
  });
  submitButtons.forEach((button, index) => {
    button.click ??= () => events.push(`submit:${index}`);
  });
  const actionsRoot = {
    querySelectorAll(selector) {
      if (selector === "label.form-radio") return labels;
      if (selector === ":scope > .wf-component--select-card") {
        return directWorkflows;
      }
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return submitButtons;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  const harness = Function(
    "getActionsBlock",
    "exactRadioOptionText",
    "preserveScrollDuring",
    "dispatchBubbledEvent",
    "cleanText",
    "getCardIdentity",
    "quickChoiceCardWorkflowPrompt",
    "normalizeRememberedQuickChoice",
    "clearPlayedActionLearning",
    "nextFrame",
    "selectedRadioOptionHasChildren",
    `"use strict";
      let quickChoicePlaybackActive = false;
      ${exactQuickChoiceExecutionSource}
      return {
        selectOption: selectExactQuickChoiceOption,
        selectTarget: selectExactQuickChoiceTarget,
        selectDirectTarget: selectExactDirectQuickChoiceTarget,
        submit: clickQuickChoiceSubmit,
        execute: executeRememberedQuickChoice,
        playbackActive: () => quickChoicePlaybackActive,
      };
    `,
  )(
    () => actionsBlock,
    (radio) => radio.text,
    (callback) => callback(),
    (_input, eventName) => events.push(`event:${eventName}`),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (card) => ({name: card?.name ?? "Card"}),
    (workflow) =>
      String(
        workflow?.querySelector(":scope > .wf-component-title")?.textContent ?? "",
      )
        .replace(/\s+/g, " ")
        .trim(),
    normalizeRememberedQuickChoice,
    () => events.push("clear-learning"),
    async () => events.push("frame"),
    () => hasChildren,
  );
  return { ...harness, events, labels, targetCards, submitButtons };
};

const {
  globalContributionColumnsForGame,
  playerGlobalContributionData,
  adjacentBoardSpaceCoordinates,
  boardVictoryPointsForColor,
  greeneryTileTypes,
  cityTileTypes,
} = Function(
  "isPlainObject",
  `"use strict";
    ${liveScoreDataSource}
    return {
      globalContributionColumnsForGame,
      playerGlobalContributionData,
      adjacentBoardSpaceCoordinates,
      boardVictoryPointsForColor,
      greeneryTileTypes,
      cityTileTypes,
    };
  `,
)((value) => Boolean(value) && typeof value === "object" && !Array.isArray(value));

const createQueuePromptChecks = (options = {}) =>
  Function(
    "isTakeNextActionPhase",
    "isWorldGovernmentTerraformingPrompt",
    "isWorldGovernmentOceanPlacementPrompt",
    "isFinalGreeneryPlacementPrompt",
    "worldGovernmentOceanPlacementSpaces",
    "isResearchCardPurchasePrompt",
    "hasEnabledExactPassOption",
    "isBuyEverythingPurchasePrompt",
    "isBuyEverythingPurchasePaymentPrompt",
    "normalizeAutopilotMode",
    "isCurrentPlayerTurn",
    "hasLiveActionForm",
    "queueExecutionInFlight",
    `"use strict";
      ${queuePromptSource}
      return {isPersistentQueueItem, queueItemMatchesCurrentPrompt, canExecuteQueuedItemNow};
    `,
  )(
    () => options.isTakeNextActionPhase ?? true,
    () => options.isWorldGovernmentTerraformingPrompt ?? false,
    () => options.isWorldGovernmentOceanPlacementPrompt ?? false,
    () => options.isFinalGreeneryPlacementPrompt ?? false,
    () => options.hasWorldGovernmentOceanPlacementSpace === false ? [] : [{}],
    () => options.isResearchCardPurchasePrompt ?? false,
    () => options.hasEnabledExactPassOption ?? false,
    () => options.isBuyEverythingPurchasePrompt ?? false,
    () => options.isBuyEverythingPurchasePaymentPrompt ?? false,
    normalizeAutopilotMode,
    () => options.isCurrentPlayerTurn ?? true,
    () => options.hasLiveActionForm ?? true,
    options.queueExecutionInFlight ?? false,
  );

const createEnabledExactPassOptionCheck = (choices = []) => {
  let clickCount = 0;
  const labels = choices.map(({text, disabled = false, hasRadio = true}) => {
    const radio = hasRadio
      ? {
          disabled,
          click() {
            clickCount += 1;
          },
        }
      : null;
    return {
      textContent: text,
      querySelector(selector) {
        if (selector === "span") return null;
        if (selector === "input[type='radio']") return radio;
        assert.fail(`unexpected selector: ${selector}`);
      },
    };
  });
  const hasEnabledExactPassOption = Function(
    "getActionsBlock",
    "cleanText",
    `"use strict";
      ${enabledExactPassOptionSource}
      return hasEnabledExactPassOption;
    `,
  )(
    () => ({
      querySelectorAll(selector) {
        assert.equal(selector, "label.form-radio");
        return labels;
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
  );
  return {
    hasEnabledExactPassOption,
    clickCount: () => clickCount,
  };
};

const {removeQueuedItemAt, restoreQueuedItemAt} = Function(
  `"use strict";
    ${queueMutationSource}
    return {removeQueuedItemAt, restoreQueuedItemAt};
  `,
)();

const createEnqueueDecisionExecutor = (initialQueue, {executeNow = false} = {}) => {
  const session = {autoProcess: true, queue: [...initialQueue]};
  const executedItems = [];
  let updateCount = 0;
  const enqueueOrExecuteNow = Function(
    "executeQueueItemNow",
    "updateQueueSession",
    `"use strict";
      ${enqueueDecisionSource}
      return enqueueOrExecuteNow;
    `,
  )(
    (item) => {
      executedItems.push(item);
      return executeNow;
    },
    (updater) => {
      updateCount += 1;
      updater(session);
      return session;
    },
  );
  return {
    enqueueOrExecuteNow,
    executedItems,
    session,
    updateCount: () => updateCount,
  };
};

const createAutopilotEnqueuer = (initialQueue = [], {executeNow = false} = {}) => {
  const session = {autoProcess: false, queue: [...initialQueue], autopilotMode: "escape"};
  const executedItems = [];
  let updateCount = 0;
  const enqueueAutopilot = Function(
    "normalizeAutopilotMode",
    "updateQueueSession",
    "executeQueueItemNow",
    `"use strict"; ${enqueueAutopilotSource}; return enqueueAutopilot;`,
  )(
    normalizeAutopilotMode,
    (updater) => {
      updateCount += 1;
      updater(session);
      return session;
    },
    (item, options) => {
      executedItems.push({item, options});
      return executeNow;
    },
  );
  return {enqueueAutopilot, executedItems, session, updateCount: () => updateCount};
};

const autopilotQueueItemLabel = Function(
  "autopilotModeLabel",
  "cleanText",
  `"use strict"; ${queueItemLabelSource}; return queueItemLabel;`,
)(
  autopilotModeLabel,
  (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
);

const executeAutopilotItem = async (mode, energyResult) => {
  const events = [];
  await Function(
    "item",
    "normalizeAutopilotMode",
    "tryExecutePowerPlantStandardProject",
    "executeBuyEverythingAutopilot",
    "executeEscapeAutopilot",
    `"use strict";
      return (async () => {
        ${autopilotExecutionSource}
      })();
    `,
  )(
    {type: "autopilot", mode},
    normalizeAutopilotMode,
    async () => {
      events.push("energy");
      return energyResult;
    },
    async () => {
      events.push("buy-everything");
    },
    async () => {
      events.push("pass");
    },
  );
  return events;
};

const executeBuyEverything = async ({payment = false, purchase = false} = {}) => {
  const events = [];
  await Function(
    "isBuyEverythingPurchasePaymentPrompt",
    "clickPurchasePaymentSubmit",
    "isBuyEverythingPurchasePrompt",
    "executeBuyEverythingPurchase",
    "executeEscapeAutopilot",
    `"use strict";
      ${buyEverythingAutopilotSource}
      return executeBuyEverythingAutopilot();
    `,
  )(
    () => payment,
    () => events.push("pay"),
    () => purchase,
    async () => events.push("purchase"),
    async () => events.push("escape"),
  );
  return events;
};

const executePass = async () => {
  const events = [];
  await Function(
    "selectActionOption",
    "nextFrame",
    "clickActionSubmit",
    `"use strict"; ${passActionSource}; return executePassAction();`,
  )(
    (label) => {
      events.push(`select:${label}`);
    },
    async () => {
      events.push("frame");
    },
    (label, alternatives) => {
      events.push(`submit:${label}`);
      assert.deepEqual(alternatives, ["Pass for this generation"]);
    },
  );
  return events;
};

const executeFinalGreenerySkip = async () => {
  const events = [];
  await Function(
    "selectExactActionOption",
    "declineFinalGreeneryOption",
    "nextFrame",
    "clickExactActionSubmit",
    `"use strict";
      ${finalGreenerySkipSource}
      return executeFinalGreenerySkip();
    `,
  )(
    (label) => events.push(`select:${label}`),
    "Don't place a greenery",
    async () => events.push("frame"),
    (label) => events.push(`submit:${label}`),
  );
  return events;
};

const createExactActionOptionSelector = (choices = []) => {
  const events = [];
  const labels = choices.map(({text, disabled = false, hasRadio = true}) => {
    const radio = hasRadio
      ? {
          checked: false,
          disabled,
          click() {
            events.push(`click:${text}`);
          },
        }
      : null;
    return {
      textContent: text,
      radio,
      querySelector(selector) {
        if (selector === "span") return null;
        if (selector === "input[type='radio']") return radio;
        assert.fail(`unexpected selector: ${selector}`);
      },
    };
  });
  const selectExactActionOption = Function(
    "getActionsBlock",
    "cleanText",
    "preserveScrollDuring",
    "dispatchBubbledEvent",
    `"use strict";
      ${exactActionOptionSource}
      return selectExactActionOption;
    `,
  )(
    () => ({
      querySelectorAll(selector) {
        assert.equal(selector, "label.form-radio");
        return labels;
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
    (_radio, eventName) => events.push(`event:${eventName}`),
  );
  return {selectExactActionOption, labels, events};
};

const createPowerPlantAttempt = ({
  standardProjects = true,
  powerPlant = true,
  confirm = true,
} = {}) => {
  const events = [];
  const attempt = Function(
    "selectActionOption",
    "nextFrame",
    "selectPowerPlantStandardProject",
    "clickExactActionSubmit",
    `"use strict"; ${powerPlantAttemptSource}; return tryExecutePowerPlantStandardProject;`,
  )(
    (label, options) => {
      events.push(`action:${label}`);
      assert.deepEqual(options, {required: false});
      return standardProjects;
    },
    async () => {
      events.push("frame");
    },
    (options) => {
      events.push("project:Power Plant");
      assert.deepEqual(options, {required: false});
      return powerPlant;
    },
    (label, options) => {
      events.push(`submit:${label}`);
      assert.deepEqual(options, {required: false});
      return confirm;
    },
  );
  return {attempt, events};
};

const createPowerPlantSelector = ({titleText = "Power Plant", disabled = false} = {}) => {
  const dispatchedEvents = [];
  let clickCount = 0;
  const radio = {
    checked: false,
    disabled,
    click() {
      clickCount += 1;
    },
  };
  const label = {
    querySelector(selector) {
      assert.equal(selector, "input[type='radio']");
      return radio;
    },
  };
  const title = {
    textContent: titleText,
    closest(selector) {
      assert.equal(selector, "label");
      return label;
    },
  };
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, ".card-title-standard-project");
      return [title];
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  const select = Function(
    "getActionsBlock",
    "cleanText",
    "preserveScrollDuring",
    "dispatchBubbledEvent",
    `"use strict"; ${selectPowerPlantSource}; return selectPowerPlantStandardProject;`,
  )(
    () => actionsBlock,
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
    (_radio, eventName) => dispatchedEvents.push(eventName),
  );
  return {select, radio, clickCount: () => clickCount, dispatchedEvents};
};

const createExactActionSubmit = (buttons) => {
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return buttons;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  return Function(
    "getActionsBlock",
    "cleanText",
    "preserveScrollDuring",
    `"use strict"; ${exactActionSubmitSource}; return clickExactActionSubmit;`,
  )(
    () => actionsBlock,
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
  );
};

const createWorldGovernmentPromptCheck = ({
  modelTitle = "",
  renderedTitles = [],
} = {}) =>
  Function(
    "playerInputModelTitle",
    "latestPlayerView",
    "worldGovernmentTerraformingPrompt",
    "getActionsBlock",
    "cleanText",
    `"use strict";
      ${worldGovernmentPromptSource}
      return isWorldGovernmentTerraformingPrompt;
    `,
  )(
    (model) => String(model?.title ?? "").replace(/\s+/g, " ").trim(),
    {waitingFor: {title: modelTitle}},
    "Select action for World Government Terraforming",
    () => ({
      querySelectorAll(selector) {
        assert.equal(selector, ".wf-options > label");
        return renderedTitles.map((textContent) => ({textContent}));
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
  );

const createFinalGreeneryPromptCheck = ({
  modelTitle = "",
  renderedTitles = [],
} = {}) =>
  Function(
    "playerInputModelTitle",
    "latestPlayerView",
    "finalGreeneryPlacementPrompt",
    "getActionsBlock",
    "cleanText",
    `"use strict";
      ${finalGreeneryPromptSource}
      return isFinalGreeneryPlacementPrompt;
    `,
  )(
    (model) => String(model?.title ?? "").replace(/\s+/g, " ").trim(),
    {waitingFor: {title: modelTitle}},
    "Place any final greenery from plants",
    () => ({
      querySelectorAll(selector) {
        assert.equal(selector, ".wf-options > label");
        return renderedTitles.map((textContent) => ({textContent}));
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
  );

const createWorldGovernmentOceanPlacementPromptCheck = ({
  modelTitle = "",
  renderedTitle = "",
} = {}) =>
  Function(
    "playerInputModelTitle",
    "latestPlayerView",
    "worldGovernmentTerraformingPrompt",
    "worldGovernmentOceanPlacementPrompt",
    "getActionsBlock",
    "cleanText",
    `"use strict";
      ${worldGovernmentPromptSource}
      return isWorldGovernmentOceanPlacementPrompt;
    `,
  )(
    (model) => String(model?.title ?? "").replace(/\s+/g, " ").trim(),
    {waitingFor: {title: modelTitle}},
    "Select action for World Government Terraforming",
    "Select space for ocean from temperature increase",
    () => ({
      querySelectorAll(selector) {
        if (selector !== ".wf-select-space" || !renderedTitle) return [];
        return [{
          cloneNode() {
            const clone = {
              textContent: `${renderedTitle} go to map`,
              querySelectorAll(anchorSelector) {
                assert.equal(anchorSelector, "a");
                return [{
                  remove() {
                    clone.textContent = renderedTitle;
                  },
                }];
              },
            };
            return clone;
          },
        }];
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
  );

const createWorldGovernmentOceanPlacementSpaces = (candidates) =>
  Function(
    "document",
    `"use strict";
      ${worldGovernmentPromptSource}
      return worldGovernmentOceanPlacementSpaces;
    `,
  )({
    querySelectorAll(selector) {
      assert.equal(
        selector,
        "#main_board > .board-space.board-space--available",
      );
      return candidates.map(({ocean = true}, index) => ({
        index,
        querySelector(childSelector) {
          assert.equal(childSelector, ".board-space-type-ocean");
          return ocean ? {} : null;
        },
      }));
    },
  });

const createWorldGovernmentSubmit = (buttons) => {
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return buttons;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  return Function(
    "getActionsBlock",
    "preserveScrollDuring",
    `"use strict";
      ${worldGovernmentSubmitSource}
      return clickWorldGovernmentSubmit;
    `,
  )(
    () => actionsBlock,
    (callback) => callback(),
  );
};

const createWorldGovernmentOceanPlacement = ({
  spaces = [],
  buttons = [],
} = {}) => {
  const events = [];
  const boardSpaces = spaces.map(({bonuses = []}, index) => ({
    querySelectorAll(selector) {
      assert.equal(selector, ".board-space-bonus");
      return Array.from({length: bonuses.length}, () => ({}));
    },
    click() {
      events.push(`space:${index}`);
    },
  }));
  const confirmationButtons = buttons.map(
    ({text = "", disabled = false, visible = true}, index) => ({
      textContent: text,
      disabled,
      visible,
      getBoundingClientRect() {
        return visible
          ? {width: 80, height: 30}
          : {width: 0, height: 0};
      },
      click() {
        events.push(`confirm:${index}`);
      },
    }),
  );
  const executeWorldGovernmentOceanPlacement = Function(
    "worldGovernmentOceanPlacementSpaces",
    "getActionsBlock",
    "cleanText",
    "window",
    "preserveScrollDuring",
    "nextFrame",
    `"use strict";
      ${worldGovernmentOceanPlacementSource}
      return executeWorldGovernmentOceanPlacement;
    `,
  )(
    () => boardSpaces,
    () => ({
      querySelectorAll(selector) {
        assert.equal(selector, ".select_space_cont button");
        return confirmationButtons;
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    {
      getComputedStyle(button) {
        return {
          display: button.visible ? "block" : "none",
          visibility: button.visible ? "visible" : "hidden",
        };
      },
    },
    (callback) => callback(),
    async () => {
      events.push("frame");
    },
  );
  return {events, executeWorldGovernmentOceanPlacement};
};

const createWorldGovernmentExecution = ({
  options = [],
  hasAvailableOceanSpace = true,
} = {}) => {
  const events = [];
  const labels = options.map(({text, checked = false, disabled = false}) => {
    const radio = {checked, disabled};
    return {
      textContent: text,
      querySelector(selector) {
        if (selector === "span") return null;
        assert.equal(selector, "input[type='radio']");
        return radio;
      },
    };
  });
  const executeWorldGovernmentTerraforming = Function(
    "getActionsBlock",
    "cleanText",
    "worldGovernmentOceanPlacementSpaces",
    "executeWorldGovernmentOceanPlacement",
    "clickWorldGovernmentSubmit",
    `"use strict";
      ${worldGovernmentExecutionSource}
      return executeWorldGovernmentTerraforming;
    `,
  )(
    () => ({
      querySelectorAll(selector) {
        assert.equal(selector, "label.form-radio");
        return labels;
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    () => hasAvailableOceanSpace ? [{}] : [],
    async () => {
      events.push("place-ocean");
    },
    () => {
      events.push("submit");
    },
  );
  return {events, executeWorldGovernmentTerraforming};
};

const createResearchPurchasePromptCheck = ({
  modelTitle = "",
  renderedTitles = [],
} = {}) =>
  Function(
    "playerInputModelTitle",
    "latestPlayerView",
    "getActionsBlock",
    "cleanText",
    `"use strict";
      ${researchPurchasePromptSource}
      return isResearchCardPurchasePrompt;
    `,
  )(
    (model) => String(model?.title ?? "").replace(/\s+/g, " ").trim(),
    {waitingFor: {title: modelTitle}},
    () => ({
      querySelectorAll(selector) {
        assert.equal(
          selector,
          ".wf-component--select-card .wf-component-title",
        );
        return renderedTitles.map((textContent) => ({textContent}));
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
  );

const createBuyEverythingPromptChecks = ({
  modelTitle = "",
  purchaseTitles = [],
  paymentTitles = [],
} = {}) =>
  Function(
    "playerInputModelTitle",
    "latestPlayerView",
    "getActionsBlock",
    "cleanText",
    "isResearchCardPurchaseTitle",
    `"use strict";
      ${buyEverythingPromptSource}
      return {
        purchase: isBuyEverythingPurchasePrompt,
        payment: isBuyEverythingPurchasePaymentPrompt,
      };
    `,
  )(
    (model) => String(model?.title ?? "").replace(/\s+/g, " ").trim(),
    {waitingFor: {title: modelTitle}},
    () => ({
      querySelectorAll(selector) {
        if (selector === ".wf-component--select-card .wf-component-title") {
          return purchaseTitles.map((textContent) => ({textContent}));
        }
        if (selector === ".payments_cont .payments_title") {
          return paymentTitles.map((textContent) => ({textContent}));
        }
        assert.fail(`unexpected selector: ${selector}`);
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (value) => {
      const title = String(value ?? "").replace(/\s+/g, " ").trim();
      return (
        title === "Select card(s) to buy" ||
        /^Select up to \d+ card\(s\) to buy$/.test(title)
      );
    },
  );

const createResearchPurchaseSkip = (buttons) => {
  const workflow = {
    querySelectorAll(selector) {
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return buttons;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-component--select-card");
      return workflow;
    },
  };
  return Function(
    "getActionsBlock",
    "cleanText",
    "preserveScrollDuring",
    `"use strict";
      ${researchPurchaseSkipSource}
      return clickResearchPurchaseSkip;
    `,
  )(
    () => actionsBlock,
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
  );
};

const createBuyEverythingPurchase = ({
  cards = [],
  buttons = [],
  maxSelected = Number.POSITIVE_INFINITY,
} = {}) => {
  const events = [];
  const inputs = cards.map((card, index) => {
    if (card.hasInput === false) return null;
    return {
      checked: card.checked === true,
      disabled: card.disabled === true,
      baseDisabled: card.disabled === true,
      click() {
        if (this.disabled) return;
        this.checked = !this.checked;
        events.push(`card:${index}:${this.checked}`);
      },
    };
  });
  const rows = cards.map((card, index) => ({
    name: card.name,
    fullText: card.fullText ?? card.name,
    querySelector(selector) {
      assert.equal(selector, "input[type='checkbox']");
      return inputs[index];
    },
  }));
  const submitButtons = buttons.map(({text, value = "", disabled = false}) => ({
    textContent: text,
    value,
    disabled,
    click() {
      events.push(`submit:${text || value}`);
    },
  }));
  const updateDisabled = () => {
    const selectedCount = inputs.filter((input) => input?.checked).length;
    inputs.forEach((input) => {
      if (!input) return;
      input.disabled =
        input.baseDisabled ||
        (!input.checked && selectedCount >= maxSelected);
    });
  };
  updateDisabled();
  const workflow = {
    querySelectorAll(selector) {
      if (selector === ":scope > label.cardbox") return rows;
      if (selector === "button.btn-submit, input.btn-submit") {
        return submitButtons;
      }
      assert.fail(`unexpected selector: ${selector}`);
    },
  };
  const executeBuyEverythingPurchase = Function(
    "getActionsBlock",
    "cleanText",
    "preserveScrollDuring",
    "nextFrame",
    "dispatchBubbledEvent",
    `"use strict";
      ${buyEverythingPurchaseSource}
      return {
        executeBuyEverythingPurchase,
        clickBuyEverythingNoPurchaseSubmit,
      };
    `,
  )(
    () => ({
      querySelector(selector) {
        assert.equal(selector, ".wf-component--select-card");
        return workflow;
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
    async () => {
      events.push("frame");
      updateDisabled();
    },
    (_input, eventName) => events.push(`event:${eventName}`),
  );
  return {
    ...executeBuyEverythingPurchase,
    events,
    inputs,
  };
};

const createPurchasePaymentSubmit = (buttons) => {
  const events = [];
  const payment = {
    querySelectorAll(selector) {
      assert.equal(selector, "button.btn-submit, input.btn-submit");
      return buttons.map(({text, value = "", disabled = false}) => ({
        textContent: text,
        value,
        disabled,
        click() {
          events.push(`submit:${text || value}`);
        },
      }));
    },
    querySelector(selector) {
      assert.fail(`payment inputs must not be queried: ${selector}`);
    },
  };
  const clickPurchasePaymentSubmit = Function(
    "getActionsBlock",
    "cleanText",
    "preserveScrollDuring",
    `"use strict";
      ${purchasePaymentSubmitSource}
      return clickPurchasePaymentSubmit;
    `,
  )(
    () => ({
      querySelector(selector) {
        assert.equal(selector, ".payments_cont");
        return payment;
      },
    }),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
  );
  return {clickPurchasePaymentSubmit, events};
};

const executeEscape = async ({
  worldGovernment = false,
  worldGovernmentOceanPlacement = false,
  finalGreenery = false,
  researchPurchase = false,
} = {}) => {
  const events = [];
  await Function(
    "isWorldGovernmentTerraformingPrompt",
    "isWorldGovernmentOceanPlacementPrompt",
    "isFinalGreeneryPlacementPrompt",
    "isResearchCardPurchasePrompt",
    "clickWorldGovernmentSubmit",
    "executeWorldGovernmentTerraforming",
    "executeWorldGovernmentOceanPlacement",
    "executeFinalGreenerySkip",
    "clickResearchPurchaseSkip",
    "executePassAction",
    `"use strict";
      ${escapeAutopilotSource}
      return executeEscapeAutopilot();
    `,
  )(
    () => worldGovernment,
    () => worldGovernmentOceanPlacement,
    () => finalGreenery,
    () => researchPurchase,
    () => events.push("submit-default"),
    async () => events.push("execute-wgt"),
    async () => events.push("place-ocean"),
    async () => events.push("skip-greenery"),
    () => events.push("skip-research"),
    async () => events.push("pass"),
  );
  return events;
};

const createQueueExecutor = (initialQueue, {reject = false, canExecute = true} = {}) => {
  const session = {playerId: "player-1", queue: [...initialQueue]};
  const auditEvents = [];
  let clearCount = 0;
  let restoreCount = 0;
  let writeCount = 0;
  const executedItems = [];
  const learningItems = [];
  let learningClearCount = 0;
  const executor = Function(
    "readQueueSession",
    "latestPlayerView",
    "canExecuteQueuedItemNow",
    "removeQueuedItemAt",
    "writeQueueSession",
    "renderQueuePanel",
    "executeQueuedItem",
    "queueItemLabel",
    "restoreQueuedAction",
    "clearQueuedActions",
    "isPersistentQueueItem",
    "auditLog",
    "rememberPlayedActionForLearning",
    "isFollowUpQueueItem",
    "clearPlayedActionLearning",
    "window",
    "scheduleTerraformingMarsUpdate",
    "queueExecutionAttempted",
    "queueExecutionInFlight",
    "queuePendingLogMutation",
    "queueExecutionError",
    `"use strict";
      ${queueLifecycleSource}
      return {
        executeQueueItemNow,
        executeQueuedActionAt,
        state: () => ({
          queueExecutionAttempted,
          queueExecutionInFlight,
          queueExecutionError,
        }),
      };
    `,
  )(
    () => session,
    {id: "player-1"},
    () => canExecute,
    removeQueuedItemAt,
    () => {
      writeCount += 1;
    },
    () => {},
    async (item) => {
      executedItems.push(item);
      if (reject) throw new Error("test failure");
    },
    (item) => item.label,
    (item, index) => {
      restoreCount += 1;
      restoreQueuedItemAt(session.queue, index, item);
    },
    () => {
      clearCount += 1;
      session.queue = [];
    },
    (item) => item?.type === "autopilot",
    (eventName, details) => auditEvents.push({eventName, details}),
    (item) => {
      learningItems.push(item);
      return true;
    },
    (item) =>
      item?.type === "radioOption" ||
      item?.type === "cardTarget" ||
      item?.type === "quickChoice",
    () => {
      learningClearCount += 1;
    },
    {setTimeout: (callback) => callback()},
    () => {},
    false,
    false,
    false,
    "",
  );
  return {
    ...executor,
    auditEvents,
    queue: () => session.queue,
    clearCount: () => clearCount,
    executedItems,
    learningClearCount: () => learningClearCount,
    learningItems,
    restoreCount: () => restoreCount,
    writeCount: () => writeCount,
  };
};

const createStorageWriter = ({failure} = {}) => {
  const auditEvents = [];
  const warnings = [];
  const writes = [];
  const write = Function(
    "localStorage",
    "auditLog",
    "console",
    `"use strict"; ${storageWriteSource}; return writeStorageString;`,
  )(
    {
      setItem(key, value) {
        if (failure) throw failure;
        writes.push({key, value});
      },
    },
    (eventName, details) => auditEvents.push({eventName, details}),
    {warn: (...args) => warnings.push(args)},
  );
  return {write, auditEvents, warnings, writes};
};

const createFirebaseWriter = (responseFactory) => {
  const auditEvents = [];
  const requests = [];
  const write = Function(
    "firebaseLobbyUrl",
    "fetch",
    "auditLog",
    `"use strict"; ${firebaseWriteSource}; return firebaseSetLobbyField;`,
  )(
    "https://example.test/tfmars420/lobby",
    async (url, options) => {
      requests.push({url, options});
      return responseFactory();
    },
    (eventName, details) => auditEvents.push({eventName, details}),
  );
  return {write, auditEvents, requests};
};

test("audit logger is always-on, structured, and isolated from debug logging", () => {
  assert.match(
    auditLoggerSource,
    /globalThis\.console\?\.log\?\.\("\[tfmars420:audit\]", eventName, details\)/,
  );
  assert.match(auditLoggerSource, /catch \{\s*\/\/ Audit logging must never affect extension behavior\./);
  assert.doesNotMatch(auditLoggerSource, /debug|searchParams|timeWarpLog/);
});

test("storage writes audit success and failure without logging values", () => {
  const success = createStorageWriter();
  success.write("tfmars420:session", "private queue contents");
  assert.deepEqual(success.writes, [
    {key: "tfmars420:session", value: "private queue contents"},
  ]);
  assert.deepEqual(success.auditEvents, [
    {
      eventName: "storage.write.success",
      details: {key: "tfmars420:session"},
    },
  ]);
  assert.doesNotMatch(JSON.stringify(success.auditEvents), /private queue contents/);

  const failure = createStorageWriter({failure: new Error("storage unavailable")});
  failure.write("tfmars420:active", "false");
  assert.deepEqual(failure.auditEvents, [
    {
      eventName: "storage.write.failure",
      details: {key: "tfmars420:active", error: "storage unavailable"},
    },
  ]);
  assert.equal(failure.warnings.length, 1);
  assert.doesNotMatch(JSON.stringify(failure.auditEvents), /"false"/);
});

test("Firebase writes audit attempts and outcomes without logging payloads", async () => {
  const success = createFirebaseWriter(() => ({
    ok: true,
    status: 200,
    async json() {
      return {ok: true};
    },
  }));
  await success.write("gameId", {value: "secret-game", timestamp: 123});
  assert.deepEqual(success.auditEvents, [
    {eventName: "firebase.write.attempt", details: {field: "gameId"}},
    {eventName: "firebase.write.success", details: {field: "gameId", status: 200}},
  ]);
  assert.match(success.requests[0].options.body, /secret-game/);
  assert.doesNotMatch(JSON.stringify(success.auditEvents), /secret-game/);

  const failure = createFirebaseWriter(() => ({
    ok: false,
    status: 503,
    statusText: "Unavailable",
  }));
  await assert.rejects(
    failure.write("newGameSettings", {value: "private-settings"}),
    /503 Unavailable/,
  );
  assert.deepEqual(failure.auditEvents, [
    {eventName: "firebase.write.attempt", details: {field: "newGameSettings"}},
    {
      eventName: "firebase.write.failure",
      details: {field: "newGameSettings", error: "503 Unavailable"},
    },
  ]);
  assert.doesNotMatch(JSON.stringify(failure.auditEvents), /private-settings/);
});

test("every tfmars420 control category has a semantic user-action audit event", () => {
  [
    "user.extension.toggle",
    "user.runtime.update",
    "user.lobby.open-game",
    "user.settings.edit",
    "user.queue.remove",
    "user.queue.execute",
    "user.queue.autoprocess",
    "user.queue.pass.dequeue",
    "user.queue.pass.enqueue",
    "user.queue.clear",
    "user.queue.option.input",
    "user.queue.option.reject",
    "user.queue.option.enqueue",
    "user.hand.sort",
    "user.card.rank",
    "user.card.project.dequeue",
    "user.card.project.enqueue",
    "user.card.action.dequeue",
    "user.card.action.enqueue",
    "user.card.target.enqueue",
  ].forEach((eventName) => {
    assert.match(source, new RegExp(`auditLog\\("${eventName.replaceAll(".", "\\.")}"`));
  });
  assert.doesNotMatch(source, /document\.addEventListener\([^)]*,\s*auditLog/);
});

test("played-card action control toggles its queued state", () => {
  assert.match(actionToolsSource, /findQueuedCardPosition\(session\.queue, "playedAction", identity\)/);
  assert.match(actionToolsSource, /actionPosition \? "dequeue\\naction" : "enqueue\\naction"/);
  assert.match(actionToolsSource, /removeQueuedCard\(draft, "playedAction", identity\)/);
  assert.match(actionToolsSource, /type: "playedAction"/);
  assert.match(actionToolsSource, /actionButton\.classList\.toggle\("is-queued", Boolean\(actionPosition\)\)/);
  assert.match(actionToolsSource, /actionButton\.title = actionPosition \? "Dequeue action" : "Enqueue action"/);
});

test("played-card target control stays append-only", () => {
  assert.match(targetToolsSource, /countQueuedCards\(session\.queue, "cardTarget", identity\)/);
  assert.match(targetToolsSource, /targetQueueButtonPresentation\(targetCount\)/);
  assert.match(targetToolsSource, /targetButton\.title = targetPresentation\.title/);
  assert.match(targetToolsSource, /type: "cardTarget"/);
  assert.doesNotMatch(targetToolsSource, /findQueuedCardPosition/);
  assert.doesNotMatch(targetToolsSource, /removeQueuedCard/);
  assert.doesNotMatch(targetToolsSource, /classList\.toggle\("is-queued"/);
});

test("target queue presentation renders zero, one, and multiple stars", () => {
  assert.deepEqual(targetQueueButtonPresentation(0), {
    text: "enqueue\ntarget",
    title: "Enqueue target",
  });
  assert.deepEqual(targetQueueButtonPresentation(1), {
    text: "enqueue\ntarget *",
    title: "Enqueue target (1 queued)",
  });
  assert.deepEqual(targetQueueButtonPresentation(3), {
    text: "enqueue\ntarget ***",
    title: "Enqueue target (3 queued)",
  });
});

test("target queue count includes only matching card targets", () => {
  const identity = {
    key: "extractor-balloons",
    slug: "extractor-balloons",
    name: "Extractor Balloons",
  };
  const queue = [
    {type: "cardTarget", cardKey: "extractor-balloons"},
    {type: "cardTarget", cardName: "Extractor Balloons"},
    {type: "playedAction", cardKey: "extractor-balloons"},
    {type: "cardTarget", cardKey: "celestic"},
  ];

  assert.equal(countQueuedCards(queue, "cardTarget", identity), 2);
});

test("only cards with a resource counter are target-eligible", () => {
  assert.equal(createTargetEligibilityCheck({className: "card-resources-counter"})({}), true);
  assert.equal(createTargetEligibilityCheck(null)({}), false);
  assert.doesNotMatch(
    targetEligibilitySource,
    /is-corporation|background-color-prelude|background-color-active/,
  );
});

test("card queue controls remain available after passing", () => {
  assert.doesNotMatch(handToolsSource, /hasCurrentPlayerPassed|alreadyPassed/);
  assert.doesNotMatch(playedToolsSource, /hasCurrentPlayerPassed|alreadyPassed/);
});

test("hand sort mode is bounded inside the per-player session", () => {
  assert.equal(freshQueueSession("p1").handSortMode, null);
  assert.equal(
    normalizeQueueSession(
      {version: 1, playerId: "p1", queue: [], cardRanks: {}, autoProcess: false},
      "p1",
    ).handSortMode,
    null,
  );
  assert.equal(
    normalizeQueueSession(
      {
        version: 1,
        playerId: "p1",
        queue: [],
        cardRanks: {},
        autoProcess: false,
        handSortMode: "science",
      },
      "p1",
    ).handSortMode,
    "science",
  );
  assert.equal(
    normalizeQueueSession(
      {
        version: 1,
        playerId: "old-player",
        queue: [{type: "pass"}],
        cardRanks: {card: "border"},
        handSortMode: "space",
      },
      "new-player",
    ).handSortMode,
    null,
  );
  assert.equal(normalizeHandSortMode("asterisk"), null);
  assert.equal(normalizeHandSortMode("not a tag"), null);
});

test("tag and cost clicks follow the approved local sort cycles", () => {
  assert.equal(nextHandSortModeForTag(null, "science"), "science");
  assert.equal(nextHandSortModeForTag("server", "science"), "science");
  assert.equal(nextHandSortModeForTag("space", "science"), "science");
  assert.equal(nextHandSortModeForTag("science", "science"), null);

  assert.equal(nextHandSortModeForCost("science"), null);
  assert.equal(nextHandSortModeForCost(null), "server");
  assert.equal(nextHandSortModeForCost("server"), null);
});

test("global tag recognition covers every upstream real tag and class form", () => {
  const expectedTags = [
    "animal",
    "building",
    "city",
    "clone",
    "crime",
    "earth",
    "event",
    "jovian",
    "mars",
    "microbe",
    "moon",
    "plant",
    "power",
    "science",
    "space",
    "venus",
    "wild",
  ];
  assert.deepEqual([...terraformingMarsTagTypes].sort(), expectedTags);
  expectedTags.forEach((tagType) => {
    assert.equal(tagTypeFromClassNames(["resource-tag", `tag-${tagType}`]), tagType);
    assert.equal(tagTypeFromClassNames(["card-resource-tag", `card-tag-${tagType}`]), tagType);
    assert.equal(tagTypeFromClassNames(["track-tag", `track-tag-${tagType}`]), tagType);
  });
});

test("global tag recognition rejects tag-like non-tags", () => {
  [
    [],
    ["tag-count", "tag-size-big", "tag-type-main"],
    ["tag-vp"],
    ["tag-tr"],
    ["tag-none"],
    ["tag-asterisk"],
    ["card-tag-size--S"],
    ["card-tag-no_planetary_tag"],
    ["card-tag-floater"],
    ["track-tag"],
    ["totally-unrelated"],
  ].forEach((classNames) => {
    assert.equal(tagTypeFromClassNames(classNames), null);
  });
});

test("global delegated tag clicks update the hand sort and consume the event", () => {
  const first = createGlobalTagClickHandler();
  const event = {
    target: {dynamic: true},
    prevented: 0,
    stopped: 0,
    preventDefault() {
      this.prevented += 1;
    },
    stopPropagation() {
      this.stopped += 1;
    },
  };

  assert.equal(first.handle(event), true);
  assert.equal(first.draft.handSortMode, "science");
  assert.equal(first.updateCount(), 1);
  assert.equal(event.prevented, 1);
  assert.equal(event.stopped, 1);
  assert.deepEqual(first.auditEvents, [
    {
      eventName: "user.hand.sort",
      details: {trigger: "tag", tagType: "science", handSortMode: "science"},
    },
  ]);

  const second = createGlobalTagClickHandler({initialMode: "science"});
  assert.equal(second.handle({...event, prevented: 0, stopped: 0}), true);
  assert.equal(second.draft.handSortMode, null);
});

test("global tag clicks leave native behavior untouched without a hand or session", () => {
  for (const options of [
    {helpersActive: false},
    {resolvedTag: null},
    {handExists: false},
    {sessionExists: false},
  ]) {
    const state = createGlobalTagClickHandler(options);
    const event = {
      target: {},
      prevented: false,
      stopped: false,
      preventDefault() {
        this.prevented = true;
      },
      stopPropagation() {
        this.stopped = true;
      },
    };
    assert.equal(state.handle(event), false);
    assert.equal(state.updateCount(), 0);
    assert.equal(event.prevented, false);
    assert.equal(event.stopped, false);
  }
});

test("global tag listener is delegated and local-only", () => {
  assert.match(
    source,
    /document\.addEventListener\("click", handleGlobalHandTagClick, true\)/,
  );
  assert.match(globalTagClickSource, /terraformingMarsTagTypeFromElement\(event\.target\)/);
  assert.doesNotMatch(
    globalTagClickSource,
    /fetch\(|XMLHttpRequest|submit|queue\.push|executeQueued|playCard/,
  );
});

test("cost sorting is numeric, stable, and puts missing costs last", () => {
  const cards = [
    {name: "server-first-10", cost: 10, tags: [], serverIndex: 0, domIndex: 3},
    {name: "missing-first", cost: null, tags: [], serverIndex: 1, domIndex: 2},
    {name: "cheap", cost: 2, tags: [], serverIndex: 2, domIndex: 1},
    {name: "server-second-10", cost: 10, tags: [], serverIndex: 3, domIndex: 0},
    {name: "missing-second", cost: null, tags: [], serverIndex: 4, domIndex: 4},
  ];

  assert.deepEqual(
    sortHandCardEntries(cards, null).map((card) => card.name),
    ["cheap", "server-first-10", "server-second-10", "missing-first", "missing-second"],
  );
  assert.deepEqual(
    sortHandCardEntries(cards, "server").map((card) => card.name),
    ["server-first-10", "missing-first", "cheap", "server-second-10", "missing-second"],
  );
});

test("tag sorting recomputes greedy counts after each stable group", () => {
  const cards = [
    {name: "A", cost: 10, tags: ["science", "space"], serverIndex: 0, domIndex: 0},
    {name: "B", cost: 10, tags: ["science", "earth"], serverIndex: 1, domIndex: 1},
    {name: "C", cost: 10, tags: ["space", "jovian"], serverIndex: 2, domIndex: 2},
    {name: "D", cost: 10, tags: ["earth"], serverIndex: 3, domIndex: 3},
    {name: "E", cost: 10, tags: ["jovian"], serverIndex: 4, domIndex: 4},
    {name: "F", cost: 10, tags: [], serverIndex: 5, domIndex: 5},
  ];

  assert.deepEqual(
    sortHandCardEntries(cards, "science").map((card) => card.name),
    ["A", "B", "C", "E", "D", "F"],
  );
});

test("tag-count ties break alphabetically and include event", () => {
  const cards = [
    {name: "selected", cost: 1, tags: ["science"], serverIndex: 0, domIndex: 0},
    {name: "space", cost: 2, tags: ["space"], serverIndex: 1, domIndex: 1},
    {name: "event", cost: 3, tags: ["event"], serverIndex: 2, domIndex: 2},
    {name: "earth", cost: 4, tags: ["earth"], serverIndex: 3, domIndex: 3},
  ];

  assert.deepEqual(
    sortHandCardEntries(cards, "science").map((card) => card.name),
    ["selected", "earth", "event", "space"],
  );
});

test("hand sorting is scoped to the real hand and stays local", () => {
  assert.match(handSortDomSource, /"#shortkey-hand \.sortable-cards"/);
  assert.match(handSortDomSource, /sortable\.append\(\.\.\.orderedWrappers\)/);
  assert.match(handSortDomSource, /tags\.add\("event"\)/);
  assert.match(handSortDomSource, /event\.stopPropagation\(\)/);
  assert.doesNotMatch(handSortDomSource, /fetch\(|XMLHttpRequest|clickActionSubmit|\\.click\(\)/);
});

test("live contribution columns follow enabled global tracks", () => {
  assert.deepEqual(
    globalContributionColumnsForGame({gameOptions: {expansions: {}}}).map(
      (column) => column.key,
    ),
    ["temperature", "oxygen", "oceans"],
  );
  assert.deepEqual(
    globalContributionColumnsForGame({
      gameOptions: {expansions: {venus: true, moon: true}},
    }).map((column) => column.key),
    [
      "temperature",
      "oxygen",
      "oceans",
      "venus",
      "moon-habitat",
      "moon-logistic",
      "moon-mining",
    ],
  );
});

test("live contributions preserve exposed zeros and hide empty opponent data", () => {
  const columns = globalContributionColumnsForGame({
    gameOptions: {expansions: {venus: true}},
  });

  assert.deepEqual(
    playerGlobalContributionData(
      {
        globalParameterSteps: {
          temperature: 10,
          oxygen: 10,
          oceans: 4,
          venus: 0,
        },
      },
      columns,
    ),
    {values: [10, 10, 4, 0], total: 24},
  );
  assert.deepEqual(
    playerGlobalContributionData(
      {
        globalParameterSteps: {
          temperature: 9,
          oxygen: 4,
          oceans: 1,
          venus: 8,
        },
      },
      columns,
    ),
    {values: [9, 4, 1, 8], total: 22},
  );
  assert.deepEqual(
    playerGlobalContributionData({globalParameterSteps: {}}, columns),
    {values: [null, null, null, null], total: null},
  );
});

test("live score table stays compact within a bounded horizontal scroller", () => {
  assert.match(
    liveScoreCssSource,
    /\.tfmars420-live-scores-scroll \{[\s\S]*?max-width: 100%;[\s\S]*?overflow-x: auto;[\s\S]*?\}/,
  );
  assert.match(
    liveScoreCssSource,
    /\.tfmars420-live-scores-table \{[\s\S]*?width: max-content;[\s\S]*?\}/,
  );
  assert.doesNotMatch(
    liveScoreCssSource,
    /\.tfmars420-live-scores-table \{[\s\S]*?min-width: 100%;[\s\S]*?\}/,
  );
});

test("contribution total heading shows a large sigma with its semantic label", () => {
  assert.match(
    liveScoreRenderSource,
    /const totalHeader = createLiveScoreHeaderCell\("Contribution total"\)/,
  );
  assert.match(
    liveScoreRenderSource,
    /totalHeader\.className = "tfmars420-score-total-heading"/,
  );
  assert.match(liveScoreRenderSource, /totalHeader\.textContent = "Σ"/);
  assert.match(
    liveScoreCssSource,
    /\.tfmars420-score-total-heading \{[\s\S]*?font-size: 26px;[\s\S]*?line-height: 1;[\s\S]*?\}/,
  );
});

test("board VP uses upstream greenery and city tile classifications", () => {
  assert.deepEqual([...greeneryTileTypes], [0, 36]);
  assert.deepEqual([...cityTileTypes], [2, 3, 20, 37, 43]);
});

test("board hex adjacency matches upstream upper, middle, and lower rows", () => {
  assert.deepEqual(
    adjacentBoardSpaceCoordinates({x: 4, y: 2, spaceType: "land"}, 8),
    [
      [4, 1],
      [5, 1],
      [5, 2],
      [4, 3],
      [3, 3],
      [3, 2],
    ],
  );
  assert.deepEqual(
    adjacentBoardSpaceCoordinates({x: 4, y: 4, spaceType: "land"}, 8),
    [
      [4, 3],
      [5, 3],
      [5, 4],
      [5, 5],
      [4, 5],
      [3, 4],
    ],
  );
  assert.deepEqual(
    adjacentBoardSpaceCoordinates({x: 4, y: 6, spaceType: "land"}, 8),
    [
      [3, 5],
      [4, 5],
      [5, 6],
      [5, 7],
      [4, 7],
      [3, 6],
    ],
  );
  assert.deepEqual(
    adjacentBoardSpaceCoordinates({x: -1, y: -1, spaceType: "colony"}, 8),
    [],
  );
});

test("board VP counts ownership, co-ownership, variants, and adjacent foreign greenery", () => {
  const spaces = [
    {x: 2, y: 2, spaceType: "land", tileType: 2, color: "red"},
    {x: 1, y: 2, spaceType: "land", tileType: 43, color: "yellow", coOwner: "red"},
    {x: 2, y: 1, spaceType: "land", tileType: 0, color: "yellow"},
    {x: 3, y: 1, spaceType: "land", tileType: 0, color: "red"},
    {x: 3, y: 2, spaceType: "land", tileType: 36, color: "yellow", coOwner: "red"},
    {x: 0, y: 0, spaceType: "land", tileType: 0, color: "red"},
    {x: 2, y: 4, spaceType: "land"},
    {x: -1, y: -1, spaceType: "colony", tileType: 2, color: "red"},
  ];

  assert.deepEqual(boardVictoryPointsForColor(spaces, "red"), {
    greenery: 3,
    city: 4,
  });
  assert.deepEqual(boardVictoryPointsForColor(spaces, "yellow"), {
    greenery: 2,
    city: 1,
  });
  assert.equal(boardVictoryPointsForColor(null, "red"), null);
});

test("live score table omits its label and uses globally styled native tile icons", () => {
  assert.match(liveScoreRenderSource, /"card-delegate"/);
  assert.match(
    liveScoreRenderSource,
    /createLiveScoreHeaderCell\("Greenery VP", "tile greenery-no-O2-tile"\)/,
  );
  assert.match(
    liveScoreRenderSource,
    /createLiveScoreHeaderCell\("City VP", "tile city-tile"\)/,
  );
  assert.doesNotMatch(liveScoreRenderSource, /Live contributions & board VP/);
  assert.doesNotMatch(source, /tfmars420-live-scores-title/);
  assert.doesNotMatch(liveScoreRenderSource, /table-forest-tile|table-city-tile/);
  assert.doesNotMatch(
    liveScoreRenderSource,
    /createLiveScoreHeaderCell\("Greenery VP", "tile greenery-tile"\)/,
  );
  assert.match(liveScoreRenderSource, /player_translucent_bg_color_/);
});

test("live score table follows queue controls", () => {
  assert.match(
    queuePanelSource,
    /panel\.append\(actions\);[\s\S]*panel\.append\(autopilotActions\);\s*const liveScoreTable[\s\S]*panel\.append\(liveScoreTable\)/,
  );
});

test("queue execution remains paused after passing", () => {
  assert.match(
    queueExecutionSource,
    /const allowedEscapeAfterPassing =[\s\S]*item\?\.type === "autopilot"[\s\S]*isEscapeFallbackAutopilotMode\(item\.mode\)[\s\S]*isWorldGovernmentTerraformingPrompt\(\)[\s\S]*isWorldGovernmentOceanPlacementPrompt\(\)[\s\S]*isFinalGreeneryPlacementPrompt\(\)[\s\S]*isResearchCardPurchasePrompt\(\)[\s\S]*isBuyEverythingPurchasePrompt\(\)[\s\S]*isBuyEverythingPurchasePaymentPrompt\(\)/,
  );
  assert.match(
    queueExecutionSource,
    /if \(hasCurrentPlayerPassed\(\) && !allowedEscapeAfterPassing\) \{\s*return;\s*\}/,
  );
});

test("queue sessions default autoprocess off and preserve explicit opt-in", () => {
  assert.equal(freshQueueSession("player-1").autoProcess, false);
  assert.equal(
    normalizeQueueSession(
      {version: 1, playerId: "player-1", queue: [], cardRanks: {}},
      "player-1",
    ).autoProcess,
    false,
  );
  assert.equal(
    normalizeQueueSession(
      {version: 1, playerId: "player-1", queue: [], cardRanks: {}, autoProcess: true},
      "player-1",
    ).autoProcess,
    true,
  );
});

test("queue panel renders persisted autoprocess and native row icons", () => {
  assert.match(queuePanelSource, /autoProcessInput\.checked = session\.autoProcess/);
  assert.match(queuePanelSource, /draft\.autoProcess = autoProcessInput\.checked/);
  assert.match(queuePanelSource, /document\.createTextNode\("autoprocess queue"\)/);
  assert.match(queuePanelSource, /"icon-cross"/);
  assert.match(queuePanelSource, /"icon-check"/);
  assert.doesNotMatch(queuePanelSource, /❌|✅|✓|×/);
});

test("manual row execution is indexed and independent of autoprocess", () => {
  assert.match(queuePanelSource, /executeQueuedActionAt\(index, \{ manual: true \}\)/);
  assert.match(queuePanelSource, /execute\.disabled = !canExecuteQueuedItemNow\(item\)/);
  assert.match(indexedQueueExecutionSource, /const item = session\.queue\[index\]/);
  assert.match(indexedQueueExecutionSource, /removeQueuedItemAt\(session\.queue, index\)/);
  assert.match(indexedQueueExecutionSource, /if \(manual\) \{[\s\S]*restoreQueuedAction\(item, index/);
  assert.doesNotMatch(indexedQueueExecutionSource, /autoProcess/);
});

test("only autopilot queue items are persistent", () => {
  const {isPersistentQueueItem} = createQueuePromptChecks();

  assert.equal(isPersistentQueueItem({type: "autopilot", mode: "escape"}), true);
  assert.equal(
    isPersistentQueueItem({type: "autopilot", mode: "gotALottaEnergy"}),
    true,
  );
  for (const type of [
    "pass",
    "projectCard",
    "playedAction",
    "radioOption",
    "cardTarget",
    "quickChoice",
  ]) {
    assert.equal(isPersistentQueueItem({type}), false);
  }
});

test("indexed queue mutation preserves the order of other items", () => {
  const first = {type: "pass"};
  const selected = {type: "playedAction", cardName: "Celestic"};
  const last = {type: "cardTarget", cardName: "Extractor Balloons"};
  const queue = [first, selected, last];

  assert.equal(removeQueuedItemAt(queue, 1), selected);
  assert.deepEqual(queue, [first, last]);

  restoreQueuedItemAt(queue, 1, selected);
  assert.deepEqual(queue, [first, selected, last]);
});

test("executable enqueue runs directly without mutating the persisted queue", () => {
  const existing = {type: "pass", label: "existing"};
  const requested = {type: "projectCard", label: "requested"};
  const executor = createEnqueueDecisionExecutor([existing], {executeNow: true});

  assert.equal(executor.enqueueOrExecuteNow(requested), true);
  assert.deepEqual(executor.executedItems, [requested]);
  assert.deepEqual(executor.session.queue, [existing]);
  assert.equal(executor.session.autoProcess, true);
  assert.equal(executor.updateCount(), 0);
  assert.doesNotMatch(enqueueDecisionSource, /autoProcess/);
});

test("non-executable enqueue appends exactly one item", () => {
  const existing = {type: "pass", label: "existing"};
  const requested = {type: "cardTarget", label: "requested"};
  const executor = createEnqueueDecisionExecutor([existing]);

  assert.equal(executor.enqueueOrExecuteNow(requested), false);
  assert.deepEqual(executor.executedItems, [requested]);
  assert.deepEqual(executor.session.queue, [existing, requested]);
  assert.equal(executor.updateCount(), 1);
});

test("manual indexed execution restores only the selected item after failure", async () => {
  const first = {type: "pass", label: "first"};
  const selected = {type: "playedAction", label: "selected"};
  const last = {type: "cardTarget", label: "last"};
  const executor = createQueueExecutor([first, selected, last], {reject: true});

  assert.equal(executor.executeQueuedActionAt(1, {manual: true}), true);
  assert.deepEqual(executor.queue(), [first, last]);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.queue(), [first, selected, last]);
  assert.equal(executor.clearCount(), 0);
  assert.equal(executor.state().queueExecutionInFlight, false);
  assert.match(executor.state().queueExecutionError, /test failure/);
  assert.deepEqual(
    executor.auditEvents.map(({eventName, details}) => [eventName, details.executionSource]),
    [
      ["game.action.attempt", "manual"],
      ["game.action.failure", "manual"],
    ],
  );
});

test("successful immediate execution audits its source and outcome", async () => {
  const requested = {type: "projectCard", label: "requested"};
  const executor = createQueueExecutor([]);

  assert.equal(executor.executeQueueItemNow(requested), true);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(
    executor.auditEvents.map(({eventName, details}) => [eventName, details.executionSource]),
    [
      ["game.action.attempt", "immediate"],
      ["game.action.success", "immediate"],
    ],
  );
});

test("failed direct execution stays unqueued and reports the error", async () => {
  const existing = {type: "pass", label: "existing"};
  const requested = {type: "playedAction", label: "requested"};
  const executor = createQueueExecutor([existing], {reject: true});

  assert.equal(executor.executeQueueItemNow(requested), true);
  assert.deepEqual(executor.queue(), [existing]);
  assert.deepEqual(executor.executedItems, [requested]);
  assert.equal(executor.writeCount(), 0);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.queue(), [existing]);
  assert.equal(executor.restoreCount(), 0);
  assert.equal(executor.clearCount(), 0);
  assert.equal(executor.learningClearCount(), 1);
  assert.equal(executor.state().queueExecutionInFlight, false);
  assert.equal(
    executor.state().queueExecutionError,
    "Could not execute requested: test failure",
  );
  assert.deepEqual(
    executor.auditEvents.map(({eventName, details}) => [eventName, details.executionSource]),
    [
      ["game.action.attempt", "immediate"],
      ["game.action.failure", "immediate"],
    ],
  );
});

test("failed immediate autopilot execution keeps its prequeued item in place", async () => {
  const first = {type: "pass", label: "first"};
  const autopilot = {type: "autopilot", mode: "escape", label: "autopilot"};
  const executor = createQueueExecutor([first, autopilot], {reject: true});

  assert.equal(
    executor.executeQueueItemNow(autopilot, {executionSource: "immediate"}),
    true,
  );
  assert.deepEqual(executor.queue(), [first, autopilot]);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.queue(), [first, autopilot]);
  assert.equal(executor.writeCount(), 0);
  assert.equal(executor.restoreCount(), 0);
  assert.equal(executor.clearCount(), 0);
  assert.equal(
    executor.state().queueExecutionError,
    "Could not execute autopilot: test failure",
  );
});

test("direct execution declines cleanly when the current prompt cannot accept the item", () => {
  const existing = {type: "pass", label: "existing"};
  const requested = {type: "cardTarget", label: "requested"};
  const executor = createQueueExecutor([existing], {canExecute: false});

  assert.equal(executor.executeQueueItemNow(requested), false);
  assert.deepEqual(executor.queue(), [existing]);
  assert.deepEqual(executor.executedItems, []);
  assert.equal(executor.writeCount(), 0);
});

test("automatic indexed failure still clears the persisted queue", async () => {
  const first = {type: "playedAction", label: "first"};
  const second = {type: "cardTarget", label: "second"};
  const executor = createQueueExecutor([first, second], {reject: true});

  assert.equal(executor.executeQueuedActionAt(0), true);
  assert.deepEqual(executor.queue(), [second]);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.queue(), []);
  assert.equal(executor.clearCount(), 1);
  assert.equal(executor.restoreCount(), 0);
  assert.equal(executor.learningClearCount(), 1);
  assert.deepEqual(
    executor.auditEvents.map(({eventName, details}) => [eventName, details.executionSource]),
    [
      ["game.action.attempt", "automatic"],
      ["game.action.failure", "automatic"],
    ],
  );
});

test("successful indexed autopilot execution keeps its exact queue position", async () => {
  const first = {type: "pass", label: "first"};
  const autopilot = {type: "autopilot", mode: "escape", label: "autopilot"};
  const last = {type: "playedAction", label: "last"};

  for (const manual of [false, true]) {
    const executor = createQueueExecutor([first, autopilot, last]);

    assert.equal(executor.executeQueuedActionAt(1, {manual}), true);
    assert.deepEqual(executor.queue(), [first, autopilot, last]);
    assert.equal(executor.writeCount(), 0);

    await new Promise((resolve) => setImmediate(resolve));

    assert.deepEqual(executor.queue(), [first, autopilot, last]);
    assert.equal(executor.restoreCount(), 0);
    assert.equal(executor.clearCount(), 0);
  }
});

test("failed indexed autopilot execution stays put without clearing or duplicating", async () => {
  const first = {type: "pass", label: "first"};
  const autopilot = {type: "autopilot", mode: "escape", label: "autopilot"};
  const last = {type: "playedAction", label: "last"};

  for (const manual of [false, true]) {
    const executor = createQueueExecutor([first, autopilot, last], {reject: true});

    assert.equal(executor.executeQueuedActionAt(1, {manual}), true);
    assert.deepEqual(executor.queue(), [first, autopilot, last]);

    await new Promise((resolve) => setImmediate(resolve));

    assert.deepEqual(executor.queue(), [first, autopilot, last]);
    assert.equal(executor.writeCount(), 0);
    assert.equal(executor.restoreCount(), 0);
    assert.equal(executor.clearCount(), 0);
    assert.match(executor.state().queueExecutionError, /test failure/);
  }
});

test("queue item execution requires the current turn, live form, and matching prompt", () => {
  const mainPrompt = createQueuePromptChecks();
  assert.equal(mainPrompt.canExecuteQueuedItemNow({type: "pass"}), true);
  assert.equal(mainPrompt.canExecuteQueuedItemNow({type: "cardTarget"}), false);

  const followUpPrompt = createQueuePromptChecks({isTakeNextActionPhase: false});
  assert.equal(followUpPrompt.canExecuteQueuedItemNow({type: "cardTarget"}), true);
  assert.equal(followUpPrompt.canExecuteQueuedItemNow({type: "radioOption"}), true);
  assert.equal(followUpPrompt.canExecuteQueuedItemNow({type: "projectCard"}), false);

  assert.equal(
    createQueuePromptChecks({isCurrentPlayerTurn: false})
      .canExecuteQueuedItemNow({type: "pass"}),
    false,
  );
  assert.equal(
    createQueuePromptChecks({hasLiveActionForm: false})
      .canExecuteQueuedItemNow({type: "pass"}),
    false,
  );
  assert.equal(
    createQueuePromptChecks({queueExecutionInFlight: true})
      .canExecuteQueuedItemNow({type: "pass"}),
    false,
  );
});

test("automatic queue execution is opt-in and still processes only the first item", () => {
  assert.match(
    queueExecutionSource,
    /if \(session\?\.autoProcess !== true\) \{\s*return;\s*\}/,
  );
  assert.match(queueExecutionSource, /executeQueuedActionAt\(0\)/);
});

test("api/player and player/input action prompts with Pass arm the network default", () => {
  const playerView = {
    waitingFor: {
      type: "or",
      title: "Take your next action",
      options: [
        {type: "option", title: "Play project card"},
        {type: "option", title: "Pass for this generation"},
      ],
    },
  };

  assert.equal(
    shouldArmNetworkPassSelection(playerView, "fetch:/api/player?id=p1"),
    true,
  );
  assert.equal(
    shouldArmNetworkPassSelection(playerView, "fetch:/player/input?id=p1"),
    true,
  );
  assert.equal(
    shouldArmNetworkPassSelection(
      {...playerView, waitingFor: {...playerView.waitingFor, title: "Select a card"}},
      "fetch:/api/player?id=p1",
    ),
    false,
  );
  assert.equal(
    shouldArmNetworkPassSelection(
      {...playerView, waitingFor: {...playerView.waitingFor, options: []}},
      "fetch:/player/input?id=p1",
    ),
    false,
  );
});

test("network default selects Pass once and never submits", () => {
  const selector = createNetworkPassSelector();

  assert.equal(selector.select(), true);
  assert.equal(selector.pending(), false);
  assert.equal(selector.select(), false);
  assert.equal(selector.selectionCount(), 1);
  assert.doesNotMatch(networkPassSelectionSource, /clickActionSubmit|clickExactActionSubmit|\.click\(/);
});

test("network default remains pending until the action form is ready", () => {
  const missingForm = createNetworkPassSelector({hasLiveActionForm: false});
  const missingOption = createNetworkPassSelector({optionExists: false});

  assert.equal(missingForm.select(), false);
  assert.equal(missingForm.pending(), true);
  assert.equal(missingOption.select(), false);
  assert.equal(missingOption.pending(), true);
});

test("network turn tracking suppresses the initial state and duplicate updates", () => {
  const currentTurnView = {
    waitingFor: {type: "or", title: "Take your next action"},
  };
  const tracker = createNetworkTurnTracker();

  assert.equal(tracker.remember(currentTurnView), false);
  assert.equal(tracker.state(), true);
  assert.equal(tracker.pending(), false);
  assert.equal(tracker.remember(currentTurnView), false);
  assert.equal(tracker.pending(), false);
});

test("network turn tracking arms once for each false-to-true transition", () => {
  const waitingView = {waitingFor: null};
  const currentTurnView = {
    waitingFor: {type: "or", title: "Take your first action"},
  };
  const followUpView = {
    waitingFor: {type: "selectCard", title: "Select a card"},
  };
  const tracker = createNetworkTurnTracker();

  assert.equal(tracker.remember(waitingView), false);
  assert.equal(tracker.remember(followUpView), false);
  assert.equal(tracker.state(), false);
  assert.equal(tracker.remember(currentTurnView), true);
  assert.equal(tracker.pending(), true);
  assert.equal(tracker.remember(currentTurnView), false);

  tracker.clearPending();
  assert.equal(tracker.remember(waitingView), false);
  assert.equal(tracker.remember(currentTurnView), true);
  assert.equal(tracker.pending(), true);
});

test("turn scroll waits for the rendered action form and runs smoothly once", () => {
  const readiness = {
    isCurrentPlayerTurn: false,
    hasLiveActionForm: false,
    isTakeNextActionPhase: false,
  };
  const executor = createTurnScrollExecutor(readiness);

  assert.equal(executor.scroll(), false);
  assert.equal(executor.pending(), true);
  assert.deepEqual(executor.scrollCalls, []);

  readiness.isCurrentPlayerTurn = true;
  readiness.hasLiveActionForm = true;
  readiness.isTakeNextActionPhase = true;
  assert.equal(executor.scroll(), true);
  assert.equal(executor.pending(), false);
  assert.deepEqual(executor.scrollCalls, [{top: 4321, behavior: "smooth"}]);

  assert.equal(executor.scroll(), false);
  assert.equal(executor.scrollCalls.length, 1);
});

test("turn scroll is consumed without scrolling when autoprocess is checked", () => {
  const executor = createTurnScrollExecutor({
    isCurrentPlayerTurn: true,
    hasLiveActionForm: true,
    isTakeNextActionPhase: true,
    autoProcess: true,
    queue: [{type: "projectCard"}],
  });

  assert.equal(executor.scroll(), false);
  assert.equal(executor.pending(), false);
  assert.deepEqual(executor.scrollCalls, []);
  assert.equal(executor.updateCount(), 0);
});

test("empty queue scrolls without enabling autoprocess", () => {
  const executor = createTurnScrollExecutor({
    isCurrentPlayerTurn: true,
    hasLiveActionForm: true,
    isTakeNextActionPhase: true,
    autoProcess: false,
    queue: [],
  });

  assert.equal(executor.scroll(), true);
  assert.equal(executor.pending(), false);
  assert.equal(executor.session.autoProcess, false);
  assert.equal(executor.updateCount(), 0);
  assert.deepEqual(executor.actions, ["scroll"]);
});

test("nonempty queue scrolls without enabling autoprocess", () => {
  const executor = createTurnScrollExecutor({
    isCurrentPlayerTurn: true,
    hasLiveActionForm: true,
    isTakeNextActionPhase: true,
    autoProcess: false,
    queue: [{type: "projectCard"}],
  });

  assert.equal(executor.scroll(), true);
  assert.equal(executor.session.autoProcess, false);
  assert.equal(executor.updateCount(), 0);
  assert.equal(executor.scrollCalls.length, 1);
});

test("turn scroll stays pending until the queue session exists", () => {
  const readiness = {
    isCurrentPlayerTurn: true,
    hasLiveActionForm: true,
    isTakeNextActionPhase: true,
    sessionExists: false,
  };
  const executor = createTurnScrollExecutor(readiness);

  assert.equal(executor.scroll(), false);
  assert.equal(executor.pending(), true);
  assert.deepEqual(executor.scrollCalls, []);

  readiness.sessionExists = true;
  assert.equal(executor.scroll(), true);
  assert.equal(executor.pending(), false);
});

test("turn scroll never manipulates the rendered autoprocess checkbox", () => {
  assert.doesNotMatch(
    turnScrollSource,
    /querySelector|autoProcessInput|checked|dispatchEvent|\.click\(/,
  );
});

test("Actions mirror maps every cloned element to its exact source element", () => {
  const executor = createActionsMirrorExecutor();
  const sourceChild = {};
  const source = {
    querySelectorAll(selector) {
      assert.equal(selector, "*");
      return [sourceChild];
    },
  };
  const cloneKeys = [];
  const cloneChild = {
    setAttribute(name, value) {
      cloneKeys.push({name, value});
    },
  };
  const clone = {
    querySelectorAll(selector) {
      assert.equal(selector, "*");
      return [cloneChild];
    },
    setAttribute(name, value) {
      cloneKeys.push({name, value});
    },
  };

  const sourceByKey = executor.mapActionsMirrorElements(source, clone);

  assert.deepEqual(cloneKeys, [
    {name: "data-tfmars420-actions-source", value: "0"},
    {name: "data-tfmars420-actions-source", value: "1"},
  ]);
  assert.equal(sourceByKey.get("0"), source);
  assert.equal(sourceByKey.get("1"), sourceChild);
  assert.equal(sourceByKey.size, 2);
});

test("Actions mirror sanitization avoids selectors and native-control conflicts", () => {
  const executor = createActionsMirrorExecutor();
  const classes = new Set(["player_home_block", "player_home_block--actions"]);
  const removedAttributes = [];
  const createSanitizedNode = () => ({
    removeAttribute(name) {
      removedAttributes.push(name);
    },
  });
  const child = createSanitizedNode();
  let extensionRemoveCount = 0;
  const extensionChild = {
    remove() {
      extensionRemoveCount += 1;
    },
  };
  const queryOrder = [];
  const mirror = {
    ...createSanitizedNode(),
    classList: {
      add(name) {
        classes.add(name);
      },
      remove(name) {
        classes.delete(name);
      },
    },
    querySelectorAll(selector) {
      queryOrder.push(selector);
      if (selector === "*") return [child];
      if (selector.includes("#tfmars420-timewarp-panel")) return [extensionChild];
      throw new Error(`unexpected selector: ${selector}`);
    },
  };

  assert.equal(executor.sanitizeActionsMirror(mirror), mirror);
  assert.equal(classes.has("player_home_block--actions"), false);
  assert.equal(classes.has("tfmars420-actions-mirror"), true);
  for (const attribute of ["id", "name", "for", "form"]) {
    assert.equal(
      removedAttributes.filter((name) => name === attribute).length,
      2,
    );
  }
  assert.equal(extensionRemoveCount, 1);
  assert.equal(queryOrder[0].includes("#tfmars420-timewarp-panel"), true);
  assert.equal(queryOrder[1], "*");
});

test("Actions mirror clicks activate the mapped source through scroll preservation", () => {
  const executor = createActionsMirrorExecutor();
  let clickCount = 0;
  const source = {
    click() {
      clickCount += 1;
    },
    isConnected: true,
  };
  const keyed = {
    getAttribute: () => "7",
  };
  const target = {
    closest(selector) {
      if (selector === "[data-tfmars420-actions-source]") return keyed;
      if (selector === "input, textarea, select") return null;
      return null;
    },
  };
  const mirror = {contains: (candidate) => candidate === keyed};
  const sourceByKey = new Map([["7", source]]);
  const interaction = createMirrorEvent("click", target);

  assert.equal(
    executor.proxyActionsMirrorClick(interaction.event, mirror, sourceByKey),
    true,
  );
  assert.equal(clickCount, 1);
  assert.equal(executor.preserved.length, 1);
  assert.equal(executor.refreshCount(), 1);
  assert.equal(interaction.preventDefaultCount(), 1);
  assert.equal(interaction.stopImmediatePropagationCount(), 1);
});

test("Actions mirror value events update and notify the mapped source", () => {
  const executor = createActionsMirrorExecutor();
  const source = {
    checked: false,
    isConnected: true,
    value: "1",
  };
  const target = {
    checked: true,
    closest: () => target,
    getAttribute: () => "4",
    tagName: "INPUT",
    type: "number",
    value: "12",
  };
  const mirror = {contains: (candidate) => candidate === target};
  const sourceByKey = new Map([["4", source]]);
  const interaction = createMirrorEvent("change", target);

  assert.equal(
    executor.proxyActionsMirrorValueEvent(interaction.event, mirror, sourceByKey),
    true,
  );
  assert.equal(source.value, "12");
  assert.equal(source.checked, true);
  assert.deepEqual(executor.dispatched, [{target: source, eventName: "change"}]);
  assert.equal(executor.preserved.length, 1);
  assert.equal(executor.refreshCount(), 1);
  assert.equal(interaction.stopImmediatePropagationCount(), 1);
});

test("Actions mirror ignores its own editable clicks and refreshes stale mappings", () => {
  const executor = createActionsMirrorExecutor();
  const editableTarget = {
    closest(selector) {
      if (selector === "input, textarea, select") {
        return {tagName: "INPUT", type: "text"};
      }
      return null;
    },
  };
  const editableInteraction = createMirrorEvent("click", editableTarget);
  assert.equal(
    executor.proxyActionsMirrorClick(
      editableInteraction.event,
      {contains: () => false},
      new Map(),
    ),
    false,
  );
  assert.equal(editableInteraction.preventDefaultCount(), 0);

  const staleSource = {click: () => assert.fail("stale source must not click"), isConnected: false};
  const keyed = {getAttribute: () => "9"};
  const staleTarget = {
    closest(selector) {
      if (selector === "[data-tfmars420-actions-source]") return keyed;
      if (selector === "input, textarea, select") return null;
      return null;
    },
  };
  const staleInteraction = createMirrorEvent("click", staleTarget);
  assert.equal(
    executor.proxyActionsMirrorClick(
      staleInteraction.event,
      {contains: (candidate) => candidate === keyed},
      new Map([["9", staleSource]]),
    ),
    false,
  );
  assert.equal(executor.refreshCount(), 1);
  assert.equal(staleInteraction.preventDefaultCount(), 1);
  assert.equal(staleInteraction.stopImmediatePropagationCount(), 1);
});

test("interactive Actions mirror is appended after every extension panel section", () => {
  assert.match(
    queuePanelSource,
    /const actionsMirror = renderActionsMirror\(actionsBlock\);\s*if \(actionsMirror\) \{\s*panel\.append\(actionsMirror\);\s*\}/,
  );
  assert.ok(
    queuePanelSource.indexOf("const actionsMirror = renderActionsMirror(actionsBlock)") >
      queuePanelSource.indexOf("panel.append(liveScoreTable)"),
  );
  assert.match(
    source,
    /#\$\{timeWarpPanelId\} > \.tfmars420-actions-mirror \{[\s\S]*?width: 100%;[\s\S]*?\}/,
  );
});

test("player-home turn tint resolves idle, pink, and yellow states", () => {
  assert.equal(
    createTurnTintExecutor({active: false, isTurn: true, canPass: true})
      .playerHomeTurnTintState(),
    "idle",
  );
  assert.equal(
    createTurnTintExecutor({active: true, isTurn: false, canPass: true})
      .playerHomeTurnTintState(),
    "idle",
  );
  assert.equal(
    createTurnTintExecutor({active: true, isTurn: true, canPass: true})
      .playerHomeTurnTintState(),
    "can-pass",
  );
  assert.equal(
    createTurnTintExecutor({active: true, isTurn: true, canPass: false})
      .playerHomeTurnTintState(),
    "no-pass",
  );
  assert.match(turnTintSource, /hasEnabledExactPassOption\(\)/);
});

test("player-home turn tint applies one mutually exclusive state class", () => {
  const pink = createTurnTintExecutor({
    canPass: true,
    isTurn: true,
    startingClasses: ["tfmars420-turn-no-pass"],
  });
  assert.equal(pink.updatePlayerHomeTurnTint(), "can-pass");
  assert.deepEqual([...pink.classes], ["tfmars420-turn-can-pass"]);

  const yellow = createTurnTintExecutor({
    canPass: false,
    isTurn: true,
    startingClasses: ["tfmars420-turn-can-pass"],
  });
  assert.equal(yellow.updatePlayerHomeTurnTint(), "no-pass");
  assert.deepEqual([...yellow.classes], ["tfmars420-turn-no-pass"]);
});

test("player-home turn tint cleans up when disabled and tolerates a missing page", () => {
  const disabled = createTurnTintExecutor({
    active: false,
    canPass: true,
    isTurn: true,
    startingClasses: [
      "tfmars420-turn-can-pass",
      "tfmars420-turn-no-pass",
    ],
  });
  assert.equal(disabled.updatePlayerHomeTurnTint(), "idle");
  assert.deepEqual([...disabled.classes], []);

  const missing = createTurnTintExecutor({
    active: true,
    isTurn: true,
    canPass: true,
    playerHomeExists: false,
  });
  assert.equal(missing.updatePlayerHomeTurnTint(), "idle");
});

test("turn tint CSS pulses natively from zero to 25 percent every four seconds", () => {
  const sharedRule = source.match(
    /#player-home\.tfmars420-turn-can-pass,\s*#player-home\.tfmars420-turn-no-pass \{([\s\S]*?)\}/,
  )?.[1] ?? "";
  const pinkRule = Array.from(
    source.matchAll(/#player-home\.tfmars420-turn-can-pass \{([\s\S]*?)\}/g),
  ).at(-1)?.[1] ?? "";
  const yellowRule = Array.from(
    source.matchAll(/#player-home\.tfmars420-turn-no-pass \{([\s\S]*?)\}/g),
  ).at(-1)?.[1] ?? "";

  assert.match(
    source,
    /@keyframes tfmars420-turn-tint-pulse \{[\s\S]*?0%, 100% \{[\s\S]*?rgba\(var\(--tfmars420-turn-tint-rgb\), 0\)[\s\S]*?50% \{[\s\S]*?rgba\(var\(--tfmars420-turn-tint-rgb\), 0\.25\)/,
  );
  assert.match(
    sharedRule,
    /animation: tfmars420-turn-tint-pulse 4s ease-in-out infinite/,
  );
  assert.match(
    pinkRule,
    /--tfmars420-turn-tint-rgb: 255, 79, 191/,
  );
  assert.match(
    yellowRule,
    /--tfmars420-turn-tint-rgb: 255, 214, 64/,
  );
  assert.doesNotMatch(sharedRule, /background(?:-image)?:/);
  assert.doesNotMatch(pinkRule, /background(?:-image)?:/);
  assert.doesNotMatch(yellowRule, /background(?:-image)?:/);
});

test("turn tint refreshes on toggle, initial setup, DOM, and queue-network updates", () => {
  assert.match(extensionToggleSource, /updatePlayerHomeTurnTint\(\)/);
  assert.match(domUpdateSource, /updatePlayerHomeTurnTint\(\)/);
  assert.match(domObserverStartSource, /updatePlayerHomeTurnTint\(\)/);
  assert.match(queueUiUpdateSource, /updatePlayerHomeTurnTint\(\)/);
});

test("Q jumps the Actions block top to the viewport midpoint", () => {
  const actions = {
    getBoundingClientRect: () => ({top: 250, bottom: 650}),
  };
  const executor = createNavigationHotkeyExecutor({
    targets: {".player_home_block--actions": actions},
  });
  const shortcut = executor.event("q");

  assert.equal(executor.handle(shortcut.keyboardEvent), true);
  assert.deepEqual(executor.selectors, [".player_home_block--actions"]);
  assert.deepEqual(executor.scrollCalls, [{top: 50, behavior: "instant"}]);
  assert.equal(shortcut.preventDefaultCount(), 1);
});

test("Q midpoint alignment clamps at the top of the page", () => {
  const actions = {
    getBoundingClientRect: () => ({top: 100, bottom: 500}),
  };
  const executor = createNavigationHotkeyExecutor({
    scrollY: 0,
    targets: {".player_home_block--actions": actions},
  });
  const shortcut = executor.event("q");

  assert.equal(executor.handle(shortcut.keyboardEvent), true);
  assert.deepEqual(executor.scrollCalls, [{top: 0, behavior: "instant"}]);
  assert.equal(shortcut.preventDefaultCount(), 1);
});

test("W accepts uppercase and jumps the Played Cards top to the viewport top", () => {
  const playedCards = {
    getBoundingClientRect: () => ({top: 900, bottom: 1400}),
  };
  const executor = createNavigationHotkeyExecutor({
    targets: {".player_home_block--cards": playedCards},
  });
  const shortcut = executor.event("W");

  assert.equal(executor.handle(shortcut.keyboardEvent), true);
  assert.deepEqual(executor.selectors, [".player_home_block--cards"]);
  assert.deepEqual(executor.scrollCalls, [{top: 1000, behavior: "instant"}]);
  assert.equal(shortcut.preventDefaultCount(), 1);
});

test("E jumps to the bottom of the page without querying an element", () => {
  const executor = createNavigationHotkeyExecutor({
    scrollHeight: 4321,
  });
  const shortcut = executor.event("e");

  assert.equal(executor.handle(shortcut.keyboardEvent), true);
  assert.deepEqual(executor.selectors, []);
  assert.deepEqual(executor.scrollCalls, [{top: 4321, behavior: "instant"}]);
  assert.equal(shortcut.preventDefaultCount(), 1);
});

test("navigation hotkeys ignore editable targets and browser modifiers", () => {
  const target = {
    getBoundingClientRect: () => ({top: 250, bottom: 650}),
  };
  const executor = createNavigationHotkeyExecutor({
    targets: {".player_home_block--actions": target},
  });
  const editable = executor.event("q", {
    target: {closest: () => ({tagName: "INPUT"})},
  });
  const modified = executor.event("q", {metaKey: true});

  assert.equal(executor.handle(editable.keyboardEvent), false);
  assert.equal(executor.handle(modified.keyboardEvent), false);
  assert.deepEqual(executor.selectors, []);
  assert.deepEqual(executor.scrollCalls, []);
  assert.equal(editable.preventDefaultCount(), 0);
  assert.equal(modified.preventDefaultCount(), 0);
});

test("navigation hotkeys ignore inactive helpers and absent or hidden destinations", () => {
  const hidden = {
    getBoundingClientRect: () => ({top: 250, bottom: 650}),
    hidden: true,
  };
  const hiddenExecutor = createNavigationHotkeyExecutor({
    targets: {".player_home_block--actions": hidden},
  });
  const hiddenShortcut = hiddenExecutor.event("q");
  assert.equal(hiddenExecutor.handle(hiddenShortcut.keyboardEvent), false);
  assert.deepEqual(hiddenExecutor.scrollCalls, []);
  assert.equal(hiddenShortcut.preventDefaultCount(), 0);

  const absentExecutor = createNavigationHotkeyExecutor();
  const absentShortcut = absentExecutor.event("w");
  assert.equal(absentExecutor.handle(absentShortcut.keyboardEvent), false);
  assert.deepEqual(absentExecutor.scrollCalls, []);
  assert.equal(absentShortcut.preventDefaultCount(), 0);

  const inactiveExecutor = createNavigationHotkeyExecutor({
    active: false,
    targets: {".player_home_block--actions": hidden},
  });
  const inactiveShortcut = inactiveExecutor.event("q");
  assert.equal(inactiveExecutor.handle(inactiveShortcut.keyboardEvent), false);
  assert.deepEqual(inactiveExecutor.selectors, []);
});

test("Terraforming Mars startup installs one capture-phase navigation listener", () => {
  assert.match(
    source,
    /const startTerraformingMarsNavigationHotkeys = \(\) => \{\s*document\.addEventListener\("keydown", handleTerraformingMarsNavigationHotkey, true\);\s*\}/,
  );
  assert.equal(
    source.match(/\n  startTerraformingMarsNavigationHotkeys\(\);/g)?.length,
    1,
  );
});

test("every active Enqueue control routes through immediate execution first", () => {
  assert.match(handToolsSource, /enqueueOrExecuteNow\(\{\s*type: "projectCard"/);
  assert.match(actionToolsSource, /enqueueOrExecuteNow\(\{\s*type: "playedAction"/);
  assert.match(targetToolsSource, /enqueueOrExecuteNow\(\{\s*type: "cardTarget"/);
  assert.match(queuePanelSource, /enqueueOrExecuteNow\(\{\s*type: "pass"/);
  assert.match(queuePanelSource, /enqueueOrExecuteNow\(\{\s*type: "radioOption"/);
});

test("autopilot mode is bounded and remembered in the per-player session", () => {
  assert.equal(normalizeAutopilotMode("escape"), "escape");
  assert.equal(normalizeAutopilotMode("gotALottaEnergy"), "gotALottaEnergy");
  assert.equal(normalizeAutopilotMode("buyEverything"), "buyEverything");
  assert.equal(normalizeAutopilotMode("something else"), "escape");
  assert.equal(normalizeAutopilotMode(null), "escape");
  assert.equal(autopilotModeLabel("escape"), "escape");
  assert.equal(autopilotModeLabel("gotALottaEnergy"), "got a lotta energy");
  assert.equal(autopilotModeLabel("buyEverything"), "buy everything");
  assert.equal(freshQueueSession("player-1").autopilotMode, "escape");
  assert.equal(
    normalizeQueueSession(
      {
        version: 1,
        playerId: "player-1",
        queue: [],
        cardRanks: {},
        autopilotMode: "gotALottaEnergy",
      },
      "player-1",
    ).autopilotMode,
    "gotALottaEnergy",
  );
  assert.equal(
    normalizeQueueSession(
      {
        version: 1,
        playerId: "player-1",
        queue: [],
        cardRanks: {},
        autopilotMode: "buyEverything",
      },
      "player-1",
    ).autopilotMode,
    "buyEverything",
  );
  assert.equal(
    normalizeQueueSession(
      {version: 1, playerId: "old-player", autopilotMode: "gotALottaEnergy"},
      "new-player",
    ).autopilotMode,
    "escape",
  );
});

test("autopilot controls occupy their own row and always append a captured mode", () => {
  assert.match(queuePanelSource, /autopilotModeSelect\.value = session\.autopilotMode/);
  assert.match(queuePanelSource, /escapeOption\.textContent = "escape"/);
  assert.match(
    queuePanelSource,
    /energyOption\.textContent = "got a lotta energy"/,
  );
  assert.match(queuePanelSource, /buyEverythingOption\.value = "buyEverything"/);
  assert.match(
    queuePanelSource,
    /buyEverythingOption\.textContent = "buy everything"/,
  );
  assert.match(
    queuePanelSource,
    /autopilotModeSelect\.append\(escapeOption, energyOption, buyEverythingOption\)/,
  );
  assert.match(queuePanelSource, /autopilotButton\.textContent = "enqueue autopilot"/);
  assert.match(
    queuePanelSource,
    /const \{mode, executed\} = enqueueAutopilot\(autopilotModeSelect\.value\)/,
  );
  const autopilotRowSource = queuePanelSource.slice(
    queuePanelSource.indexOf("const autopilotActions"),
    queuePanelSource.indexOf("const liveScoreTable"),
  );
  assert.doesNotMatch(autopilotRowSource, /enqueueOrExecuteNow/);

  const enqueuer = createAutopilotEnqueuer([{type: "pass"}], {executeNow: true});
  assert.deepEqual(enqueuer.enqueueAutopilot("gotALottaEnergy"), {
    mode: "gotALottaEnergy",
    executed: true,
  });
  assert.deepEqual(enqueuer.enqueueAutopilot("escape"), {
    mode: "escape",
    executed: true,
  });
  assert.deepEqual(enqueuer.enqueueAutopilot("buyEverything"), {
    mode: "buyEverything",
    executed: true,
  });
  assert.equal(enqueuer.updateCount(), 3);
  assert.deepEqual(enqueuer.session, {
    autoProcess: false,
    autopilotMode: "buyEverything",
    queue: [
      {type: "pass"},
      {type: "autopilot", mode: "gotALottaEnergy"},
      {type: "autopilot", mode: "escape"},
      {type: "autopilot", mode: "buyEverything"},
    ],
  });
  assert.deepEqual(enqueuer.executedItems, [
    {
      item: {type: "autopilot", mode: "gotALottaEnergy"},
      options: {executionSource: "immediate"},
    },
    {
      item: {type: "autopilot", mode: "escape"},
      options: {executionSource: "immediate"},
    },
    {
      item: {type: "autopilot", mode: "buyEverything"},
      options: {executionSource: "immediate"},
    },
  ]);
  assert.doesNotMatch(enqueueAutopilotSource, /autoProcess/);
});

test("ineligible autopilot enqueue waits in place without a redundant append", () => {
  const enqueuer = createAutopilotEnqueuer([{type: "pass"}]);

  assert.deepEqual(enqueuer.enqueueAutopilot("escape"), {
    mode: "escape",
    executed: false,
  });
  assert.deepEqual(enqueuer.session.queue, [
    {type: "pass"},
    {type: "autopilot", mode: "escape"},
  ]);
  assert.equal(enqueuer.updateCount(), 1);
  assert.equal(enqueuer.executedItems.length, 1);
});

test("autopilot queue labels include the captured mode", () => {
  assert.equal(
    autopilotQueueItemLabel({type: "autopilot", mode: "escape"}),
    "autopilot: escape",
  );
  assert.equal(
    autopilotQueueItemLabel({type: "autopilot", mode: "gotALottaEnergy"}),
    "autopilot: got a lotta energy",
  );
  assert.equal(
    autopilotQueueItemLabel({type: "autopilot", mode: "buyEverything"}),
    "autopilot: buy everything",
  );
  assert.equal(
    autopilotQueueItemLabel({type: "autopilot", mode: "obsolete"}),
    "autopilot: escape",
  );
});

test("target-only quick-choice queue labels identify the remembered card", () => {
  assert.equal(
    autopilotQueueItemLabel({
      type: "quickChoice",
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    "quick: Regolith Eaters",
  );
  assert.equal(
    autopilotQueueItemLabel({
      type: "quickChoice",
      optionText: "Select card to add 1 asteroid",
      targetCardText: "AstroDrill",
    }),
    "quick: Select card to add 1 asteroid → AstroDrill",
  );
});

test("enabled exact Pass capability is heading-independent and read-only", () => {
  const polderTechPrompt = createEnabledExactPassOptionCheck([
    {
      text: "Take first action of PolderTECH Dutch corporation",
    },
    {
      text: "  Pass   for this generation ",
    },
  ]);

  assert.equal(polderTechPrompt.hasEnabledExactPassOption(), true);
  assert.equal(polderTechPrompt.clickCount(), 0);
});

test("enabled exact Pass capability rejects unavailable and ambiguous choices", () => {
  assert.equal(createEnabledExactPassOptionCheck([]).hasEnabledExactPassOption(), false);
  assert.equal(
    createEnabledExactPassOptionCheck([
      {text: "Pass for this generation", disabled: true},
    ]).hasEnabledExactPassOption(),
    false,
  );
  assert.equal(
    createEnabledExactPassOptionCheck([
      {text: "Pass for this generation", hasRadio: false},
    ]).hasEnabledExactPassOption(),
    false,
  );
  assert.equal(
    createEnabledExactPassOptionCheck([
      {text: "Pass for this generation later"},
    ]).hasEnabledExactPassOption(),
    false,
  );
  assert.equal(
    createEnabledExactPassOptionCheck([
      {text: "Pass for this generation"},
      {text: "Pass for this generation"},
    ]).hasEnabledExactPassOption(),
    false,
  );
});

test("autopilot remains a top-level queue item", () => {
  const mainPrompt = createQueuePromptChecks();
  const followUpPrompt = createQueuePromptChecks({isTakeNextActionPhase: false});
  const worldGovernmentPrompt = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    isWorldGovernmentTerraformingPrompt: true,
  });
  const worldGovernmentOceanPrompt = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    isWorldGovernmentOceanPlacementPrompt: true,
    isCurrentPlayerTurn: false,
    hasLiveActionForm: false,
  });
  const worldGovernmentOceanPromptWithoutSpace = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    isWorldGovernmentOceanPlacementPrompt: true,
    hasWorldGovernmentOceanPlacementSpace: false,
    isCurrentPlayerTurn: false,
    hasLiveActionForm: false,
  });
  const researchPurchasePrompt = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    isResearchCardPurchasePrompt: true,
  });
  const finalGreeneryPrompt = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    isFinalGreeneryPlacementPrompt: true,
  });
  const exactPassPrompt = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    hasEnabledExactPassOption: true,
  });
  const buyEverythingPurchasePrompt = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    isBuyEverythingPurchasePrompt: true,
  });
  const buyEverythingPaymentPrompt = createQueuePromptChecks({
    isTakeNextActionPhase: false,
    isBuyEverythingPurchasePaymentPrompt: true,
  });

  assert.equal(mainPrompt.canExecuteQueuedItemNow({type: "autopilot", mode: "escape"}), true);
  assert.equal(
    followUpPrompt.canExecuteQueuedItemNow({type: "autopilot", mode: "escape"}),
    false,
  );
  assert.equal(
    worldGovernmentPrompt.canExecuteQueuedItemNow({type: "autopilot", mode: "escape"}),
    true,
  );
  assert.equal(
    worldGovernmentPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "gotALottaEnergy",
    }),
    false,
  );
  assert.equal(worldGovernmentPrompt.canExecuteQueuedItemNow({type: "pass"}), false);
  assert.equal(
    worldGovernmentOceanPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "escape",
    }),
    true,
  );
  assert.equal(
    worldGovernmentOceanPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "buyEverything",
    }),
    true,
  );
  assert.equal(
    worldGovernmentOceanPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "gotALottaEnergy",
    }),
    false,
  );
  assert.equal(
    worldGovernmentOceanPrompt.canExecuteQueuedItemNow({type: "pass"}),
    false,
  );
  assert.equal(
    worldGovernmentOceanPromptWithoutSpace.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "escape",
    }),
    false,
  );
  assert.equal(
    researchPurchasePrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "escape",
    }),
    true,
  );
  assert.equal(
    researchPurchasePrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "gotALottaEnergy",
    }),
    false,
  );
  assert.equal(
    researchPurchasePrompt.canExecuteQueuedItemNow({type: "pass"}),
    false,
  );
  assert.equal(
    researchPurchasePrompt.canExecuteQueuedItemNow({type: "projectCard"}),
    false,
  );
  assert.equal(
    finalGreeneryPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "escape",
    }),
    true,
  );
  assert.equal(
    finalGreeneryPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "buyEverything",
    }),
    true,
  );
  assert.equal(
    finalGreeneryPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "gotALottaEnergy",
    }),
    false,
  );
  assert.equal(
    finalGreeneryPrompt.canExecuteQueuedItemNow({type: "pass"}),
    false,
  );
  assert.equal(
    exactPassPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "escape",
    }),
    true,
  );
  assert.equal(
    exactPassPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "gotALottaEnergy",
    }),
    false,
  );
  assert.equal(exactPassPrompt.canExecuteQueuedItemNow({type: "pass"}), false);
  assert.equal(
    exactPassPrompt.canExecuteQueuedItemNow({type: "projectCard"}),
    false,
  );
  assert.equal(
    exactPassPrompt.canExecuteQueuedItemNow({type: "radioOption"}),
    true,
  );
  for (const prompt of [
    worldGovernmentPrompt,
    researchPurchasePrompt,
    finalGreeneryPrompt,
    exactPassPrompt,
    buyEverythingPurchasePrompt,
    buyEverythingPaymentPrompt,
  ]) {
    assert.equal(
      prompt.canExecuteQueuedItemNow({
        type: "autopilot",
        mode: "buyEverything",
      }),
      true,
    );
  }
  assert.equal(
    buyEverythingPurchasePrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "gotALottaEnergy",
    }),
    false,
  );
  assert.equal(
    buyEverythingPaymentPrompt.canExecuteQueuedItemNow({
      type: "autopilot",
      mode: "escape",
    }),
    false,
  );
  assert.equal(
    buyEverythingPaymentPrompt.canExecuteQueuedItemNow({type: "pass"}),
    false,
  );
});

test("autopilot executor supports escape, energy, and energy fallback", async () => {
  assert.deepEqual(await executeAutopilotItem("escape", true), ["pass"]);
  assert.deepEqual(await executeAutopilotItem("gotALottaEnergy", true), ["energy"]);
  assert.deepEqual(
    await executeAutopilotItem("gotALottaEnergy", false),
    ["energy", "pass"],
  );
  assert.deepEqual(
    await executeAutopilotItem("buyEverything", true),
    ["buy-everything"],
  );
  assert.deepEqual(await executeAutopilotItem("obsolete", true), ["pass"]);
});

test("buy-everything routes payment, purchase, then Escape fallback", async () => {
  assert.deepEqual(
    await executeBuyEverything({payment: true, purchase: true}),
    ["pay"],
  );
  assert.deepEqual(await executeBuyEverything({purchase: true}), ["purchase"]);
  assert.deepEqual(await executeBuyEverything(), ["escape"]);
});

test("Escape Pass execution selects, renders, and submits in order", async () => {
  assert.deepEqual(await executePass(), [
    "select:Pass for this generation",
    "frame",
    "submit:Pass",
  ]);
});

test("World Government Escape recognition is exact and model-first with a DOM fallback", () => {
  assert.match(
    source,
    /const worldGovernmentTerraformingPrompt =\s*"Select action for World Government Terraforming"/,
  );
  assert.equal(
    createWorldGovernmentPromptCheck({
      modelTitle: "Select action for World Government Terraforming",
    })(),
    true,
  );
  assert.equal(
    createWorldGovernmentPromptCheck({
      renderedTitles: ["Select action for World Government Terraforming"],
    })(),
    true,
  );
  assert.equal(
    createWorldGovernmentPromptCheck({
      modelTitle: "Select action for World Government Terraforming!",
      renderedTitles: ["Take your next action"],
    })(),
    false,
  );
});

test("World Government ocean follow-up recognition is exact and strips the map link", () => {
  assert.equal(
    createWorldGovernmentOceanPlacementPromptCheck({
      modelTitle: "Select space for ocean from temperature increase",
    })(),
    true,
  );
  assert.equal(
    createWorldGovernmentOceanPlacementPromptCheck({
      renderedTitle: "Select space for ocean from temperature increase",
    })(),
    true,
  );
  assert.equal(
    createWorldGovernmentOceanPlacementPromptCheck({
      modelTitle: "Select space for ocean from temperature increase!",
    })(),
    false,
  );
  assert.equal(
    createWorldGovernmentOceanPlacementPromptCheck({
      renderedTitle: "Select space for city",
    })(),
    false,
  );
});

test("World Government ocean follow-up keeps only available ocean spaces", () => {
  const spaces = createWorldGovernmentOceanPlacementSpaces([
    {ocean: true},
    {ocean: false},
    {ocean: true},
  ])();

  assert.deepEqual(spaces.map((space) => space.index), [0, 2]);
});

test("World Government ocean follow-up chooses the fewest bonuses stably", async () => {
  const placement = createWorldGovernmentOceanPlacement({
    spaces: [
      {bonuses: ["steel", "steel"]},
      {bonuses: []},
      {bonuses: ["card"]},
      {bonuses: []},
    ],
  });

  await placement.executeWorldGovernmentOceanPlacement();
  assert.deepEqual(placement.events, ["space:1", "frame"]);
  assert.match(
    source,
    /#main_board > \.board-space\.board-space--available/,
  );
  assert.match(
    source,
    /querySelector\("\.board-space-type-ocean"\)/,
  );
});

test("World Government ocean follow-up confirms only a visible exact Yes", async () => {
  const placement = createWorldGovernmentOceanPlacement({
    spaces: [{bonuses: []}],
    buttons: [
      {text: "Yes", visible: false},
      {text: "No"},
      {text: "Yes"},
      {text: "Yes", disabled: true},
    ],
  });

  await placement.executeWorldGovernmentOceanPlacement();
  assert.deepEqual(placement.events, [
    "space:0",
    "frame",
    "confirm:2",
    "frame",
  ]);
});

test("World Government ocean follow-up fails safely without a space or unique confirmation", async () => {
  const missingSpace = createWorldGovernmentOceanPlacement();
  await assert.rejects(
    missingSpace.executeWorldGovernmentOceanPlacement(),
    /missing available World Government ocean space/,
  );
  assert.deepEqual(missingSpace.events, []);

  const ambiguous = createWorldGovernmentOceanPlacement({
    spaces: [{bonuses: []}],
    buttons: [{text: "Yes"}, {text: "Yes"}],
  });
  await assert.rejects(
    ambiguous.executeWorldGovernmentOceanPlacement(),
    /ambiguous World Government ocean confirmations: 2/,
  );
  assert.deepEqual(ambiguous.events, ["space:0", "frame"]);
});

test("World Government execution places a checked exact ocean before submit", async () => {
  const execution = createWorldGovernmentExecution({
    options: [
      {text: "Add an ocean", checked: true},
      {text: "Increase Venus scale"},
    ],
  });

  await execution.executeWorldGovernmentTerraforming();
  assert.deepEqual(execution.events, ["place-ocean", "submit"]);
});

test("World Government execution preserves non-ocean and already placed choices", async () => {
  const venus = createWorldGovernmentExecution({
    options: [
      {text: "Add an ocean"},
      {text: "Increase Venus scale", checked: true},
    ],
  });
  await venus.executeWorldGovernmentTerraforming();
  assert.deepEqual(venus.events, ["submit"]);

  const nearMatch = createWorldGovernmentExecution({
    options: [{text: "add an ocean", checked: true}],
  });
  await nearMatch.executeWorldGovernmentTerraforming();
  assert.deepEqual(nearMatch.events, ["submit"]);

  const alreadyPlaced = createWorldGovernmentExecution({
    options: [{text: "Add an ocean", checked: true}],
    hasAvailableOceanSpace: false,
  });
  await alreadyPlaced.executeWorldGovernmentTerraforming();
  assert.deepEqual(alreadyPlaced.events, ["submit"]);
});

test("World Government execution rejects missing or ambiguous checked options", async () => {
  const missing = createWorldGovernmentExecution({
    options: [{text: "Add an ocean"}],
  });
  await assert.rejects(
    missing.executeWorldGovernmentTerraforming(),
    /missing selected World Government option/,
  );
  assert.deepEqual(missing.events, []);

  const ambiguous = createWorldGovernmentExecution({
    options: [
      {text: "Add an ocean", checked: true},
      {text: "Increase Venus scale", checked: true},
    ],
  });
  await assert.rejects(
    ambiguous.executeWorldGovernmentTerraforming(),
    /ambiguous selected World Government options: 2/,
  );
  assert.deepEqual(ambiguous.events, []);
});

test("World Government Escape submits the selected default without selecting a radio", async () => {
  assert.deepEqual(await executeEscape({worldGovernment: true}), ["execute-wgt"]);
  assert.deepEqual(
    await executeEscape({worldGovernmentOceanPlacement: true}),
    ["place-ocean"],
  );
  assert.deepEqual(await executeEscape(), ["pass"]);
  assert.doesNotMatch(escapeAutopilotSource, /selectActionOption|radio|\.checked/);
});

test("Escape opts out of the exact final-greenery placement prompt", async () => {
  assert.match(
    source,
    /const finalGreeneryPlacementPrompt =\s*"Place any final greenery from plants"/,
  );
  assert.match(
    source,
    /const declineFinalGreeneryOption =\s*"Don't place a greenery"/,
  );
  assert.deepEqual(
    await executeEscape({finalGreenery: true}),
    ["skip-greenery"],
  );
  assert.deepEqual(await executeFinalGreenerySkip(), [
    "select:Don't place a greenery",
    "frame",
    "submit:Confirm",
  ]);
});

test("final-greenery Escape recognition is exact and model-first with a DOM fallback", () => {
  assert.equal(
    createFinalGreeneryPromptCheck({
      modelTitle: "Place any final greenery from plants",
    })(),
    true,
  );
  assert.equal(
    createFinalGreeneryPromptCheck({
      renderedTitles: ["Place any final greenery from plants"],
    })(),
    true,
  );
  assert.equal(
    createFinalGreeneryPromptCheck({
      modelTitle: "Place any final greenery from plants!",
      renderedTitles: ["Place greenery"],
    })(),
    false,
  );
});

test("final-greenery Escape selects one exact enabled opt-out radio", () => {
  const selector = createExactActionOptionSelector([
    {text: "Select space for greenery tile"},
    {text: "Don't place a greenery"},
  ]);
  selector.selectExactActionOption("Don't place a greenery");
  assert.equal(selector.labels[0].radio.checked, false);
  assert.equal(selector.labels[1].radio.checked, true);
  assert.deepEqual(selector.events, [
    "click:Don't place a greenery",
    "event:input",
    "event:change",
  ]);
});

test("final-greenery Escape rejects missing, disabled, or ambiguous opt-out radios", () => {
  assert.throws(
    () =>
      createExactActionOptionSelector([
        {text: "Select space for greenery tile"},
      ]).selectExactActionOption("Don't place a greenery"),
    /missing exact action option: Don't place a greenery/,
  );
  assert.throws(
    () =>
      createExactActionOptionSelector([
        {text: "Don't place a greenery", disabled: true},
      ]).selectExactActionOption("Don't place a greenery"),
    /exact action option is disabled: Don't place a greenery/,
  );
  assert.throws(
    () =>
      createExactActionOptionSelector([
        {text: "Don't place a greenery"},
        {text: "Don't place a greenery"},
      ]).selectExactActionOption("Don't place a greenery"),
    /ambiguous exact action options: Don't place a greenery/,
  );
});

test("World Government Escape ignores submit text and requires one enabled button", () => {
  let selectedClicks = 0;
  let disabledClicks = 0;
  const submit = createWorldGovernmentSubmit([
    {
      disabled: true,
      textContent: "Increase",
      click() {
        disabledClicks += 1;
      },
    },
    {
      disabled: false,
      textContent: "Whatever the selected option says",
      click() {
        selectedClicks += 1;
      },
    },
  ]);

  submit();
  assert.equal(selectedClicks, 1);
  assert.equal(disabledClicks, 0);
  assert.throws(
    createWorldGovernmentSubmit([{disabled: true, click() {}}]),
    /missing World Government submit button/,
  );
  assert.throws(
    createWorldGovernmentSubmit([
      {disabled: false, click() {}},
      {disabled: false, click() {}},
    ]),
    /ambiguous World Government submit buttons: 2/,
  );
});

test("Escape recognizes both optional research-purchase prompt forms exactly", () => {
  assert.equal(
    createResearchPurchasePromptCheck({
      modelTitle: "Select card(s) to buy",
    })(),
    true,
  );
  assert.equal(
    createResearchPurchasePromptCheck({
      renderedTitles: ["Select card(s) to buy"],
    })(),
    true,
  );
  assert.equal(
    createResearchPurchasePromptCheck({
      renderedTitles: ["Select up to 4 card(s) to buy"],
    })(),
    true,
  );
  assert.equal(
    createResearchPurchasePromptCheck({
      renderedTitles: ["Select up to N card(s) to buy"],
    })(),
    false,
  );
  assert.equal(
    createResearchPurchasePromptCheck({
      renderedTitles: ["Select card(s) to discard"],
    })(),
    false,
  );
  assert.equal(
    createResearchPurchasePromptCheck({
      renderedTitles: ["Select up to 4 card(s) to buy!"],
    })(),
    false,
  );
});

test("buy-everything recognizes purchase selection including unaffordable cards", () => {
  assert.equal(
    createBuyEverythingPromptChecks({
      modelTitle: "Select card(s) to buy",
    }).purchase(),
    true,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      purchaseTitles: ["Select up to 1 card(s) to buy"],
    }).purchase(),
    true,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      purchaseTitles: ["You cannot afford any cards"],
    }).purchase(),
    true,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      purchaseTitles: ["You cannot afford any cards!"],
    }).purchase(),
    false,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      purchaseTitles: ["Select card(s) to keep"],
    }).purchase(),
    false,
  );
});

test("buy-everything recognizes only its exact purchase-payment follow-up", () => {
  assert.equal(
    createBuyEverythingPromptChecks({
      modelTitle: "Select how to spend 9 M€ for 3 cards",
    }).payment(),
    true,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      paymentTitles: ["Select how to spend 6 M€ for 2 cards"],
    }).payment(),
    true,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      paymentTitles: ["Select how to spend 6 M€"],
    }).payment(),
    false,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      paymentTitles: ["Select how to spend 6 M€ for two cards"],
    }).payment(),
    false,
  );
  assert.equal(
    createBuyEverythingPromptChecks({
      paymentTitles: ["Select how to spend 6 M€ for 2 cards!"],
    }).payment(),
    false,
  );
});

test("buy everything preserves selections and selects every available card in order", async () => {
  const purchase = createBuyEverythingPurchase({
    cards: [
      {name: "Research", checked: true},
      {name: "Solarnet"},
      {name: "Solarnet Shutdown"},
      {name: "Comet Aiming"},
      {name: "Asteroid Deflection System"},
    ],
    buttons: [
      {text: "Skip this action", disabled: true},
      {text: "Buy 4"},
    ],
    maxSelected: 4,
  });

  await purchase.executeBuyEverythingPurchase();
  assert.deepEqual(purchase.events, [
    "card:1:true",
    "frame",
    "card:2:true",
    "frame",
    "card:3:true",
    "frame",
    "submit:Buy 4",
  ]);
  assert.deepEqual(
    purchase.inputs.map((input) => input?.checked ?? null),
    [true, true, true, true, false],
  );
});

test("buy-everything keeps selected cards and respects maximum one", async () => {
  const alreadySelected = createBuyEverythingPurchase({
    cards: [
      {name: "Comet Aiming", checked: true},
      {name: "Solarnet"},
    ],
    buttons: [{text: "Buy 2"}],
    maxSelected: 2,
  });
  await alreadySelected.executeBuyEverythingPurchase();
  assert.deepEqual(alreadySelected.events, [
    "card:1:true",
    "frame",
    "submit:Buy 2",
  ]);

  const maximumOne = createBuyEverythingPurchase({
    cards: [
      {name: "Asteroid Deflection System"},
      {name: "Comet Aiming"},
      {name: "Solarnet"},
    ],
    buttons: [{text: "Buy 1"}],
    maxSelected: 1,
  });
  await maximumOne.executeBuyEverythingPurchase();
  assert.deepEqual(maximumOne.events, [
    "card:0:true",
    "frame",
    "submit:Buy 1",
  ]);
});

test("buy-everything skips unselectable cards and safely declines", async () => {
  const purchase = createBuyEverythingPurchase({
    cards: [
      {name: "Comet Aiming", disabled: true},
      {name: "Solarnet", hasInput: false},
      {name: "Research", disabled: true},
    ],
    buttons: [
      {text: "Buy 0", disabled: true},
      {text: "Skip this action"},
    ],
  });

  await purchase.executeBuyEverythingPurchase();
  assert.deepEqual(purchase.events, ["submit:Skip this action"]);
});

test("buy-everything no-purchase fallback uses Skip, Buy 0, then Ok", () => {
  const skip = createBuyEverythingPurchase({
    buttons: [
      {text: "Ok"},
      {text: "Buy 0"},
      {text: "Skip this action"},
    ],
  });
  skip.clickBuyEverythingNoPurchaseSubmit();
  assert.deepEqual(skip.events, ["submit:Skip this action"]);

  const buyZero = createBuyEverythingPurchase({
    buttons: [{text: "Ok"}, {text: "Buy 0"}],
  });
  buyZero.clickBuyEverythingNoPurchaseSubmit();
  assert.deepEqual(buyZero.events, ["submit:Buy 0"]);

  const okWithCount = createBuyEverythingPurchase({buttons: [{text: "Ok 0"}]});
  okWithCount.clickBuyEverythingNoPurchaseSubmit();
  assert.deepEqual(okWithCount.events, ["submit:Ok 0"]);

  const ok = createBuyEverythingPurchase({buttons: [{text: "Ok"}]});
  ok.clickBuyEverythingNoPurchaseSubmit();
  assert.deepEqual(ok.events, ["submit:Ok"]);
});

test("buy-everything rejects missing or ambiguous purchase submits", async () => {
  const ambiguousBuy = createBuyEverythingPurchase({
    cards: [{name: "Comet Aiming"}],
    buttons: [{text: "Buy 1"}, {value: "Buy 1"}],
  });
  await assert.rejects(
    ambiguousBuy.executeBuyEverythingPurchase(),
    /ambiguous buy-everything Buy buttons: 2/,
  );

  const zeroIsNotPositive = createBuyEverythingPurchase({
    cards: [{name: "Comet Aiming"}],
    buttons: [{text: "Buy 0"}],
  });
  await assert.rejects(
    zeroIsNotPositive.executeBuyEverythingPurchase(),
    /missing buy-everything Buy button/,
  );

  const ambiguousSkip = createBuyEverythingPurchase({
    buttons: [
      {text: "Skip this action"},
      {value: "Skip this action"},
      {text: "Buy 0"},
    ],
  });
  assert.throws(
    () => ambiguousSkip.clickBuyEverythingNoPurchaseSubmit(),
    /ambiguous buy-everything Skip this action buttons: 2/,
  );

  assert.throws(
    () => createBuyEverythingPurchase().clickBuyEverythingNoPurchaseSubmit(),
    /missing buy-everything no-purchase button/,
  );
});

test("buy-everything purchase payment submits exact Pay without touching inputs", () => {
  const payment = createPurchasePaymentSubmit([
    {text: "Something else"},
    {text: "Pay"},
  ]);
  payment.clickPurchasePaymentSubmit();
  assert.deepEqual(payment.events, ["submit:Pay"]);

  assert.throws(
    () =>
      createPurchasePaymentSubmit([
        {text: "Pay", disabled: true},
      ]).clickPurchasePaymentSubmit(),
    /missing purchase-payment Pay button/,
  );
  assert.throws(
    () =>
      createPurchasePaymentSubmit([
        {text: "Pay"},
        {value: "Pay"},
      ]).clickPurchasePaymentSubmit(),
    /ambiguous purchase-payment Pay buttons: 2/,
  );
});

test("research-purchase Escape clicks only the exact enabled Skip action", async () => {
  let buyClicks = 0;
  let skipClicks = 0;
  let otherClicks = 0;
  const skip = createResearchPurchaseSkip([
    {
      disabled: false,
      textContent: "Something else",
      click() {
        otherClicks += 1;
      },
    },
    {
      disabled: true,
      textContent: "Buy 0",
      click() {
        buyClicks += 1;
      },
    },
    {
      disabled: false,
      textContent: "  Skip   this action ",
      click() {
        skipClicks += 1;
      },
    },
  ]);

  skip();
  assert.equal(skipClicks, 1);
  assert.equal(buyClicks, 0);
  assert.equal(otherClicks, 0);
  assert.deepEqual(
    await executeEscape({researchPurchase: true}),
    ["skip-research"],
  );
  assert.doesNotMatch(researchPurchaseSkipSource, /selectActionOption|radio|\.checked/);
});

test("research-purchase Escape rejects unavailable or ambiguous Skip actions", () => {
  assert.throws(
    createResearchPurchaseSkip([
      {disabled: false, textContent: "Buy 0", click() {}},
      {disabled: true, textContent: "Skip this action", click() {}},
    ]),
    /missing research-purchase Skip button/,
  );
  assert.throws(
    createResearchPurchaseSkip([
      {disabled: false, textContent: "Skip this action", click() {}},
      {disabled: false, value: "Skip this action", click() {}},
    ]),
    /ambiguous research-purchase Skip buttons: 2/,
  );
});

test("energy autopilot selects Standard projects, Power Plant, and exact Confirm", async () => {
  const success = createPowerPlantAttempt();
  assert.equal(await success.attempt(), true);
  assert.deepEqual(success.events, [
    "action:Standard projects",
    "frame",
    "project:Power Plant",
    "frame",
    "submit:Confirm",
  ]);

  const noStandardProjects = createPowerPlantAttempt({standardProjects: false});
  assert.equal(await noStandardProjects.attempt(), false);
  assert.deepEqual(noStandardProjects.events, ["action:Standard projects"]);

  const noPowerPlant = createPowerPlantAttempt({powerPlant: false});
  assert.equal(await noPowerPlant.attempt(), false);
  assert.deepEqual(noPowerPlant.events, [
    "action:Standard projects",
    "frame",
    "project:Power Plant",
  ]);

  const noConfirm = createPowerPlantAttempt({confirm: false});
  assert.equal(await noConfirm.attempt(), false);
  assert.deepEqual(noConfirm.events, [
    "action:Standard projects",
    "frame",
    "project:Power Plant",
    "frame",
    "submit:Confirm",
  ]);
});

test("energy autopilot selects only an enabled exact Power Plant project", () => {
  const selector = createPowerPlantSelector();
  assert.equal(selector.select({required: false}), true);
  assert.equal(selector.radio.checked, true);
  assert.equal(selector.clickCount(), 1);
  assert.deepEqual(selector.dispatchedEvents, ["input", "change"]);

  assert.equal(
    createPowerPlantSelector({titleText: "Sell Patents"}).select({required: false}),
    false,
  );
  assert.equal(
    createPowerPlantSelector({disabled: true}).select({required: false}),
    false,
  );
});

test("energy autopilot clicks only an enabled exact Confirm submit", () => {
  let confirmClicks = 0;
  let paymentClicks = 0;
  const submit = createExactActionSubmit([
    {
      disabled: false,
      textContent: "Pay with steel",
      click() {
        paymentClicks += 1;
      },
    },
    {
      disabled: false,
      textContent: "Confirm",
      click() {
        confirmClicks += 1;
      },
    },
  ]);

  assert.equal(submit("Confirm", {required: false}), true);
  assert.equal(confirmClicks, 1);
  assert.equal(paymentClicks, 0);
  assert.equal(
    createExactActionSubmit([{disabled: true, textContent: "Confirm", click() {}}])(
      "Confirm",
      {required: false},
    ),
    false,
  );
});

test("player view capture replaces rather than accumulates pending defaults", () => {
  const rememberSource = source.slice(
    source.indexOf("const rememberLatestPlayerView"),
    source.indexOf("const capturePlayerViewResponse"),
  );
  assert.match(
    rememberSource,
    /pendingNetworkPassSelection = shouldArmNetworkPassSelection\(playerView, source\)/,
  );
  assert.match(
    source.slice(source.indexOf("const updateQueueUi"), source.indexOf("const scheduleTerraformingMarsUpdate")),
    /maybeSelectNetworkDefaultPass\(\);\s*maybeScrollToBottomForTurn\(\);\s*maybeExecuteQueuedAction\(\)/,
  );
});

test("player view input changes re-arm persistent queue execution", () => {
  const createInputChanged = Function(
    `"use strict";
      ${playerViewQueueRearmSource.slice(
        playerViewQueueRearmSource.indexOf("const playerViewWaitingForKey"),
        playerViewQueueRearmSource.indexOf("const rememberLatestPlayerView"),
      )}
      return playerViewInputChanged;
    `,
  );
  const inputChanged = createInputChanged();
  const purchase = {
    id: "player-1",
    waitingFor: {title: "Select card(s) to buy", type: "card"},
  };
  const payment = {
    id: "player-1",
    waitingFor: {title: "Select how to spend 11 M€ for 1 cards", type: "payment"},
  };

  assert.equal(inputChanged(purchase, payment), true);
  assert.equal(inputChanged(purchase, structuredClone(purchase)), false);
  assert.equal(inputChanged(purchase, {...payment, id: "player-2"}), false);
  assert.equal(inputChanged(null, payment), false);
  assert.match(
    playerViewQueueRearmSource,
    /if \(playerViewInputChanged\(latestPlayerView, playerView\)\) \{[\s\S]*?queuePendingLogMutation = true;[\s\S]*?queueExecutionAttempted = false;[\s\S]*?queueExecutionError = "";/,
  );
});

test("played-card queue buttons preserve label line breaks", () => {
  assert.match(
    source,
    /\.tfmars420-enqueue-tools button \{[\s\S]*?white-space: pre-line;[\s\S]*?\}/,
  );
});

test("card-target submission ignores the submit button label", () => {
  let clickCount = 0;
  const submit = createCardTargetSubmit([
    {
      disabled: false,
      textContent: "Add asteroid",
      click() {
        clickCount += 1;
      },
    },
  ]);

  submit();

  assert.equal(clickCount, 1);
  assert.doesNotMatch(cardTargetSubmitSource, /Add resource|Add resources/);
});

test("card-target submission rejects a missing enabled submit button", () => {
  const submit = createCardTargetSubmit([{disabled: true, click() {}}]);

  assert.throws(submit, /missing card-target submit button/);
});

test("card-target submission rejects ambiguous enabled submit buttons", () => {
  let clickCount = 0;
  const submit = createCardTargetSubmit([
    {disabled: false, click() { clickCount += 1; }},
    {disabled: false, click() { clickCount += 1; }},
  ]);

  assert.throws(submit, /ambiguous card-target submit buttons: 2/);
  assert.equal(clickCount, 0);
});

test("indexed-radio execution checks the selected option for children before submit", () => {
  assert.match(source, /const selectedRadioOptionHasChildren = \(radio\) =>/);
  assert.match(
    radioOptionExecutionSource,
    /const radio = selectIndexedRadioOption\(item\.optionIndex\);\s*await nextFrame\(\);\s*if \(selectedRadioOptionHasChildren\(radio\)\) return;\s*clickIndexedRadioSubmit\(\)/,
  );
});

test("indexed-radio selection preserves index and disabled validation", () => {
  let clickCount = 0;
  const first = {
    checked: false,
    disabled: false,
    click() {
      clickCount += 1;
    },
  };
  const disabled = {checked: false, disabled: true, click() {}};
  const selector = createIndexedRadioSelector([first, disabled]);

  assert.throws(() => selector.select(0), /invalid radio option index: 0/);
  assert.throws(() => selector.select(3), /missing radio option 3; found 2/);
  assert.throws(() => selector.select(2), /radio option 2 is disabled/);
  assert.equal(selector.select(1), first);
  assert.equal(first.checked, true);
  assert.equal(clickCount, 1);
  assert.deepEqual(
    selector.dispatchedEvents.map(({eventName}) => eventName),
    ["input", "change"],
  );
});

test("indexed-radio execution stops at children and submits leaf options", async () => {
  assert.deepEqual(
    await executeRadioOption({hasChildren: true}),
    ["select:2", "frame", "children:2"],
  );
  assert.deepEqual(
    await executeRadioOption({hasChildren: false}),
    ["select:2", "frame", "children:2", "submit"],
  );
});

test("indexed-radio child detection distinguishes leaf and branching workflows", () => {
  assert.equal(
    selectedRadioOptionHasChildren(
      radioWithNestedWorkflow(createNestedWorkflow({selectOption: true})),
    ),
    false,
  );
  assert.equal(
    selectedRadioOptionHasChildren(
      radioWithNestedWorkflow(createNestedWorkflow()),
    ),
    true,
  );
  assert.equal(
    selectedRadioOptionHasChildren(
      radioWithNestedWorkflow(
        createNestedWorkflow({selectOption: true, interactive: true}),
      ),
    ),
    true,
  );
  assert.equal(selectedRadioOptionHasChildren(null), false);
});

test("indexed-radio leaf submission ignores the submit button label", () => {
  for (const label of ["Remove asteroid", "Gain", "Confirm"]) {
    let clickCount = 0;
    const submit = createIndexedRadioSubmit([
      {
        disabled: false,
        textContent: label,
        click() {
          clickCount += 1;
        },
      },
    ]);

    submit();

    assert.equal(clickCount, 1);
  }
  assert.match(indexedRadioSubmitSource, /button\.btn-submit, input\.btn-submit/);
  assert.match(indexedRadioSubmitSource, /\.filter\(\(candidate\) => !candidate\.disabled\)/);
  assert.doesNotMatch(indexedRadioSubmitSource, /Confirm|Gain|Remove asteroid/);
});

test("indexed-radio leaf submission rejects a missing enabled submit button", () => {
  const submit = createIndexedRadioSubmit([{disabled: true, click() {}}]);

  assert.throws(submit, /missing indexed-radio submit button/);
});

test("indexed-radio leaf submission rejects ambiguous enabled submit buttons", () => {
  let clickCount = 0;
  const submit = createIndexedRadioSubmit([
    {disabled: false, click() { clickCount += 1; }},
    {disabled: false, click() { clickCount += 1; }},
  ]);

  assert.throws(submit, /ambiguous indexed-radio submit buttons: 2/);
  assert.equal(clickCount, 0);
});

test("remembered quick choices are normalized and bounded to the player session", () => {
  assert.deepEqual(freshQueueSession("player-1").rememberedQuickChoices, {});

  const normalized = normalizeQueueSession(
    {
      version: 1,
      playerId: "player-1",
      queue: [],
      cardRanks: {},
      rememberedQuickChoices: {
        astrodrill: [
          {optionText: "  Remove 1 asteroid   on this card to gain 3 titanium  "},
          {optionText: "Remove 1 asteroid on this card to gain 3 titanium"},
          {
            optionText: "Select card to add 1 asteroid",
            targetCardText: "  AstroDrill ",
          },
          {optionText: ""},
          {optionText: "Gain a standard resource", targetCardText: 4},
        ],
        "mohole-lake": [
          {
            promptText: "  Select card   to add microbe or animal ",
            targetCardText: " Regolith Eaters ",
          },
          {
            promptText: "Select card to add microbe or animal",
            targetCardText: "Regolith Eaters",
          },
          {promptText: "", targetCardText: "Vermin"},
          {promptText: "Select card to add microbe or animal", targetCardText: 4},
        ],
      },
    },
    "player-1",
  );
  assert.deepEqual(normalized.rememberedQuickChoices, {
    astrodrill: [
      {optionText: "Remove 1 asteroid on this card to gain 3 titanium"},
      {
        optionText: "Select card to add 1 asteroid",
        targetCardText: "AstroDrill",
      },
    ],
    "mohole-lake": [
      {
        promptText: "Select card to add microbe or animal",
        targetCardText: "Regolith Eaters",
      },
    ],
  });
  assert.deepEqual(
    normalizeQueueSession(
      {
        version: 1,
        playerId: "player-1",
        rememberedQuickChoices: normalized.rememberedQuickChoices,
      },
      "player-2",
    ).rememberedQuickChoices,
    {},
  );
});

test("remembered quick-choice insertion deduplicates exact option and target tuples", () => {
  const draft = freshQueueSession("player-1");
  assert.equal(
    rememberQuickChoice(draft, "astrodrill", {
      optionText: "Remove 1 asteroid on this card to gain 3 titanium",
    }),
    true,
  );
  assert.equal(
    rememberQuickChoice(draft, "astrodrill", {
      optionText: "Remove 1 asteroid on this card to gain 3 titanium",
    }),
    false,
  );
  assert.equal(
    rememberQuickChoice(draft, "astrodrill", {
      optionText: "Select card to add 1 asteroid",
      targetCardText: "AstroDrill",
    }),
    true,
  );
  assert.equal(draft.rememberedQuickChoices.astrodrill.length, 2);

  assert.equal(
    rememberQuickChoice(draft, "mohole-lake", {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    true,
  );
  assert.equal(
    rememberQuickChoice(draft, "mohole-lake", {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    false,
  );
  assert.equal(
    rememberQuickChoice(draft, "mohole-lake", {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Vermin",
    }),
    true,
  );
  assert.deepEqual(draft.rememberedQuickChoices["mohole-lake"], [
    {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    },
    {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Vermin",
    },
  ]);
});

test("played-action learning arms only for the same player's non-Pass follow-up", () => {
  const tracker = createPlayedActionLearningTracker();
  assert.equal(
    tracker.remember({
      type: "playedAction",
      cardKey: "astrodrill",
      cardName: "AstroDrill",
    }),
    true,
  );
  assert.equal(
    tracker.update({
      id: "player-1",
      waitingFor: {
        type: "or",
        title: "Select one option",
        options: [
          {title: "Remove 1 asteroid on this card to gain 3 titanium"},
          {title: "Select card to add 1 asteroid"},
        ],
      },
    }),
    true,
  );
  assert.deepEqual(tracker.state(), {
    pendingPlayedActionLearning: null,
    armedPlayedActionLearning: {
      playerId: "player-1",
      cardKey: "astrodrill",
      cardName: "AstroDrill",
    },
  });

  const pass = createPlayedActionLearningTracker();
  pass.remember({type: "playedAction", cardKey: "astrodrill", cardName: "AstroDrill"});
  assert.equal(
    pass.update({
      id: "player-1",
      waitingFor: {
        type: "or",
        title: "Take your next action",
        options: [{title: "Pass for this generation"}],
      },
    }),
    false,
  );
  assert.deepEqual(pass.state(), {
    pendingPlayedActionLearning: null,
    armedPlayedActionLearning: null,
  });

  for (const playerView of [
    {id: "player-2", waitingFor: {type: "or", title: "Select one option", options: []}},
    {id: "player-1", waitingFor: null},
    {
      id: "player-1",
      waitingFor: {type: "or", title: "Take your first action", options: []},
    },
  ]) {
    const cancelled = createPlayedActionLearningTracker();
    cancelled.remember({
      type: "playedAction",
      cardKey: "astrodrill",
      cardName: "AstroDrill",
    });
    assert.equal(cancelled.update(playerView), false);
    assert.deepEqual(cancelled.state(), {
      pendingPlayedActionLearning: null,
      armedPlayedActionLearning: null,
    });
  }
});

test("immediate, automatic, and manual played-action execution share the learning hook", async () => {
  const item = {
    type: "playedAction",
    cardKey: "astrodrill",
    cardName: "AstroDrill",
    label: "AstroDrill",
  };
  const immediate = createQueueExecutor([]);
  assert.equal(immediate.executeQueueItemNow(item), true);
  assert.deepEqual(immediate.learningItems, [item]);

  const automatic = createQueueExecutor([item]);
  assert.equal(automatic.executeQueuedActionAt(0), true);
  assert.deepEqual(automatic.learningItems, [item]);

  const manual = createQueueExecutor([item]);
  assert.equal(manual.executeQueuedActionAt(0, {manual: true}), true);
  assert.deepEqual(manual.learningItems, [item]);

  await new Promise((resolve) => setImmediate(resolve));
});

test("remembered-choice capture accepts only trusted first-step submissions", () => {
  assert.match(quickChoiceCaptureSource, /event\.isTrusted !== true/);
  assert.match(
    quickChoiceCaptureSource,
    /radio\.closest\?\.\("\.wf-options"\) === outerOptions/,
  );
  assert.match(
    quickChoiceCaptureSource,
    /input\[type='radio'\]:checked, input\[type='checkbox'\]:checked/,
  );
  assert.match(quickChoiceCaptureSource, /rememberQuickChoice\(draft, learning\.cardKey, choice\)/);
  assert.match(quickChoiceCaptureSource, /clearPlayedActionLearning\(\)/);
  assert.match(
    source,
    /document\.addEventListener\("click", handleRememberedQuickChoiceSubmit, true\)/,
  );
});

test("remembered-choice capture stores leaf and exact card-target recipes", () => {
  const leaf = createQuickChoiceCaptureHarness({
    optionText: "  Remove 1 asteroid   on this card to gain 3 titanium  ",
  });
  assert.equal(leaf.handle(leaf.event), true);
  assert.deepEqual(leaf.draft.rememberedQuickChoices, {
    astrodrill: [
      {optionText: "Remove 1 asteroid on this card to gain 3 titanium"},
    ],
  });
  assert.equal(leaf.clearCount(), 1);
  assert.equal(leaf.updateCount(), 1);
  assert.equal(leaf.armed(), null);

  const compound = createQuickChoiceCaptureHarness({
    optionText: "Select card to add 1 asteroid",
    targetCardText: "AstroDrill",
  });
  assert.equal(compound.handle(compound.event), true);
  assert.deepEqual(compound.draft.rememberedQuickChoices, {
    astrodrill: [
      {
        optionText: "Select card to add 1 asteroid",
        targetCardText: "AstroDrill",
      },
    ],
  });
  assert.deepEqual(compound.auditEvents, [
    {
      eventName: "user.card.quick-choice.learn",
      details: {
        cardName: "AstroDrill",
        optionText: "Select card to add 1 asteroid",
        hasTarget: true,
      },
    },
  ]);
});

test("remembered-choice capture stores direct card-target recipes", () => {
  const direct = createQuickChoiceCaptureHarness({
    directPromptText: "  Select card   to add microbe or animal ",
    targetCardText: "Regolith Eaters",
  });

  assert.equal(direct.handle(direct.event), true);
  assert.deepEqual(direct.draft.rememberedQuickChoices, {
    astrodrill: [
      {
        promptText: "Select card to add microbe or animal",
        targetCardText: "Regolith Eaters",
      },
    ],
  });
  assert.deepEqual(direct.auditEvents, [
    {
      eventName: "user.card.quick-choice.learn",
      details: {
        cardName: "AstroDrill",
        promptText: "Select card to add microbe or animal",
        hasTarget: true,
      },
    },
  ]);
  assert.equal(direct.clearCount(), 1);
  assert.equal(direct.updateCount(), 1);
});

test("remembered-choice capture rejects incomplete direct card targets", () => {
  for (const blocked of [
    createQuickChoiceCaptureHarness({
      direct: true,
      targetCardText: "Regolith Eaters",
    }),
    createQuickChoiceCaptureHarness({
      directPromptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
      directSelectedInputCount: 0,
    }),
    createQuickChoiceCaptureHarness({
      directPromptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
      directSelectedInputCount: 2,
    }),
    createQuickChoiceCaptureHarness({
      directPromptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
      directTargetDisabled: true,
    }),
    createQuickChoiceCaptureHarness({
      directPromptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
      directWorkflowCount: 2,
    }),
  ]) {
    assert.equal(blocked.handle(blocked.event), false);
    assert.deepEqual(blocked.draft.rememberedQuickChoices, {});
    assert.equal(blocked.updateCount(), 0);
    assert.equal(blocked.clearCount(), 1);
  }
});

test("remembered-choice capture ignores nested checked radios and rejects synthetic playback", () => {
  const nested = createQuickChoiceCaptureHarness({
    optionText: "Gain a standard resource",
    nestedCheckedOptionText: "Gain 1 titanium",
  });
  assert.equal(nested.handle(nested.event), true);
  assert.deepEqual(nested.draft.rememberedQuickChoices, {
    astrodrill: [{optionText: "Gain a standard resource"}],
  });

  for (const blocked of [
    createQuickChoiceCaptureHarness({trusted: false}),
    createQuickChoiceCaptureHarness({playbackActive: true}),
  ]) {
    assert.equal(blocked.handle(blocked.event), false);
    assert.deepEqual(blocked.draft.rememberedQuickChoices, {});
    assert.equal(blocked.clearCount(), 0);
    assert.equal(blocked.updateCount(), 0);
    assert.notEqual(blocked.armed(), null);
  }
});

test("quick buttons are offered only for a matching latest queued played action", () => {
  const identity = {key: "astrodrill", slug: "astrodrill", name: "AstroDrill"};
  const action = {
    type: "playedAction",
    cardKey: "astrodrill",
    cardSlug: "astrodrill",
    cardName: "AstroDrill",
  };
  assert.equal(latestQueuedPlayedActionMatches([], identity), false);
  assert.equal(latestQueuedPlayedActionMatches([action], identity), true);
  assert.equal(
    latestQueuedPlayedActionMatches([action, {type: "cardTarget", cardName: "AstroDrill"}], identity),
    false,
  );
  assert.equal(
    latestQueuedPlayedActionMatches(
      [{
        ...action,
        cardKey: "asteroid-rights",
        cardSlug: "asteroid-rights",
        cardName: "Asteroid Rights",
      }],
      identity,
    ),
    false,
  );

  assert.deepEqual(
    quickChoiceQueueItem({
      optionText: "Select card to add 1 asteroid",
      targetCardText: "AstroDrill",
    }),
    {
      type: "quickChoice",
      optionText: "Select card to add 1 asteroid",
      targetCardText: "AstroDrill",
    },
  );
  assert.deepEqual(
    quickChoiceQueueItem({
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    {
      type: "quickChoice",
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    },
  );
  assert.match(
    quickChoiceUiSource,
    /choice\.optionText[\s\S]*\? `quick: \$\{choice\.optionText\}`[\s\S]*: `quick: \$\{choice\.targetCardText\}`/,
  );
  assert.match(quickChoiceUiSource, /latestQueuedPlayedActionMatches\(session\.queue, identity\)/);
  assert.match(quickChoiceUiSource, /draft\.queue\.push\(item\)/);
  assert.doesNotMatch(quickChoiceUiSource, /enqueueOrExecuteNow/);
  assert.match(source, /\.tfmars420-quick-choice-list[\s\S]*flex: 1 0 100%/);
});

test("exact quick-choice playback handles leaf and compound AstroDrill recipes", async () => {
  const leaf = createExactQuickChoiceHarness({
    optionLabels: [
      {text: "Remove 1 asteroid on this card to gain 3 titanium"},
      {text: "Gain a standard resource"},
    ],
  });
  await leaf.execute({
    type: "quickChoice",
    optionText: "Remove 1 asteroid on this card to gain 3 titanium",
  });
  assert.deepEqual(leaf.events, [
    "clear-learning",
    "option:Remove 1 asteroid on this card to gain 3 titanium",
    "event:input",
    "event:change",
    "frame",
    "submit:0",
  ]);
  assert.equal(leaf.playbackActive(), false);

  const compound = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "AstroDrill"}, {name: "Asteroid Rights"}],
  });
  await compound.execute({
    type: "quickChoice",
    optionText: "Select card to add 1 asteroid",
    targetCardText: "AstroDrill",
  });
  assert.deepEqual(compound.events, [
    "clear-learning",
    "option:Select card to add 1 asteroid",
    "event:input",
    "event:change",
    "frame",
    "target:AstroDrill",
    "event:input",
    "event:change",
    "frame",
    "submit:0",
  ]);
  assert.equal(compound.playbackActive(), false);
});

test("exact quick-choice playback handles direct Mohole Lake card targets", async () => {
  const direct = createExactQuickChoiceHarness({
    directPromptTexts: ["Select card to add microbe or animal"],
    targetCards: [
      {name: "Regolith Eaters"},
      {name: "Nitrite Reducing Bacteria"},
      {name: "Vermin"},
    ],
  });

  await direct.execute({
    type: "quickChoice",
    promptText: "Select card to add microbe or animal",
    targetCardText: "Regolith Eaters",
  });

  assert.deepEqual(direct.events, [
    "clear-learning",
    "target:Regolith Eaters",
    "event:input",
    "event:change",
    "frame",
    "submit:0",
  ]);
  assert.equal(direct.playbackActive(), false);
});

test("target-less quick playback stops safely at a real child workflow", async () => {
  const harness = createExactQuickChoiceHarness({
    optionLabels: [{text: "Gain a standard resource"}],
    hasChildren: true,
  });
  await harness.execute({type: "quickChoice", optionText: "Gain a standard resource"});
  assert.deepEqual(harness.events, [
    "clear-learning",
    "option:Gain a standard resource",
    "event:input",
    "event:change",
    "frame",
  ]);
});

test("exact quick-option matching rejects missing, duplicate, and disabled text", () => {
  assert.throws(
    () =>
      createExactQuickChoiceHarness({
        optionLabels: [{text: "Gain a standard resource"}],
      }).selectOption("gain a standard resource"),
    /missing exact quick option/,
  );
  assert.throws(
    () =>
      createExactQuickChoiceHarness({
        optionLabels: [
          {text: "Gain a standard resource"},
          {text: "Gain a standard resource"},
        ],
      }).selectOption("Gain a standard resource"),
    /ambiguous exact quick option/,
  );
  assert.throws(
    () =>
      createExactQuickChoiceHarness({
        optionLabels: [{text: "Gain a standard resource", disabled: true}],
      }).selectOption("Gain a standard resource"),
    /exact quick option is disabled/,
  );
  assert.doesNotMatch(
    exactQuickChoiceExecutionSource,
    /normalizeCardName|cardMatchesQueuedItem|optionIndex|\.includes\(/,
  );
});

test("exact quick targets and submits bail out before stale choices are submitted", () => {
  const missingTarget = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "Asteroid Rights"}],
  });
  const radio = missingTarget.labels[0].querySelector("input[type='radio']");
  assert.throws(
    () => missingTarget.selectTarget(radio, "AstroDrill"),
    /missing exact quick target/,
  );

  const duplicateTarget = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "AstroDrill"}, {name: "AstroDrill"}],
  });
  assert.throws(
    () =>
      duplicateTarget.selectTarget(
        duplicateTarget.labels[0].querySelector("input[type='radio']"),
        "AstroDrill",
      ),
    /ambiguous exact quick target/,
  );

  const disabledTarget = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "AstroDrill", input: {disabled: true, click() {}}}],
  });
  assert.throws(
    () =>
      disabledTarget.selectTarget(
        disabledTarget.labels[0].querySelector("input[type='radio']"),
        "AstroDrill",
      ),
    /exact quick target is disabled/,
  );

  assert.throws(
    () => createExactQuickChoiceHarness({submitButtons: []}).submit(),
    /missing quick-choice submit button/,
  );
  let submitCount = 0;
  const ambiguous = createExactQuickChoiceHarness({
    submitButtons: [
      {disabled: false, click() { submitCount += 1; }},
      {disabled: false, click() { submitCount += 1; }},
    ],
  });
  assert.throws(ambiguous.submit, /ambiguous quick-choice submit buttons: 2/);
  assert.equal(submitCount, 0);
});

test("direct quick targets reject stale prompts and cards before submit", async () => {
  const missingPrompt = createExactQuickChoiceHarness({
    directPromptTexts: ["Select a different card"],
    targetCards: [{name: "Regolith Eaters"}],
  });
  await assert.rejects(
    missingPrompt.execute({
      type: "quickChoice",
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    /missing exact direct quick prompt/,
  );
  assert.equal(missingPrompt.events.includes("submit:0"), false);

  const duplicatePrompt = createExactQuickChoiceHarness({
    directPromptTexts: [
      "Select card to add microbe or animal",
      "Select card to add microbe or animal",
    ],
    targetCards: [{name: "Regolith Eaters"}],
  });
  await assert.rejects(
    duplicatePrompt.execute({
      type: "quickChoice",
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    /ambiguous exact direct quick prompt/,
  );
  assert.equal(duplicatePrompt.events.includes("submit:0"), false);

  const missingTarget = createExactQuickChoiceHarness({
    directPromptTexts: ["Select card to add microbe or animal"],
    targetCards: [{name: "Vermin"}],
  });
  await assert.rejects(
    missingTarget.execute({
      type: "quickChoice",
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    /missing exact quick target/,
  );
  assert.equal(missingTarget.events.includes("submit:0"), false);

  const duplicateTarget = createExactQuickChoiceHarness({
    directPromptTexts: ["Select card to add microbe or animal"],
    targetCards: [{name: "Regolith Eaters"}, {name: "Regolith Eaters"}],
  });
  await assert.rejects(
    duplicateTarget.execute({
      type: "quickChoice",
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    /ambiguous exact quick target/,
  );
  assert.equal(duplicateTarget.events.includes("submit:0"), false);

  const disabledTarget = createExactQuickChoiceHarness({
    directPromptTexts: ["Select card to add microbe or animal"],
    targetCards: [
      {name: "Regolith Eaters", input: {disabled: true, click() {}}},
    ],
  });
  await assert.rejects(
    disabledTarget.execute({
      type: "quickChoice",
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    }),
    /exact quick target is disabled/,
  );
  assert.equal(disabledTarget.events.includes("submit:0"), false);
});

test("stale compound quick choices reject without submitting the form", async () => {
  const missingWorkflow = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    hasCardWorkflow: false,
  });
  await assert.rejects(
    missingWorkflow.execute({
      type: "quickChoice",
      optionText: "Select card to add 1 asteroid",
      targetCardText: "AstroDrill",
    }),
    /missing card choices for exact quick target/,
  );
  assert.deepEqual(missingWorkflow.events, [
    "clear-learning",
    "option:Select card to add 1 asteroid",
    "event:input",
    "event:change",
    "frame",
  ]);
  assert.equal(missingWorkflow.playbackActive(), false);

  const missingTarget = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "Asteroid Rights"}],
  });
  await assert.rejects(
    missingTarget.execute({
      type: "quickChoice",
      optionText: "Select card to add 1 asteroid",
      targetCardText: "AstroDrill",
    }),
    /missing exact quick target/,
  );
  assert.equal(missingTarget.events.includes("submit:0"), false);
  assert.equal(missingTarget.playbackActive(), false);
});
