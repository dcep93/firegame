import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./content.js", import.meta.url), "utf8");

test("in-page release version travels with content.js", () => {
  assert.match(source, /const contentScriptVersion = "v1\.0\.8"/);
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
const playerViewCaptureTransportSource = source.slice(
  source.indexOf("const capturePlayerViewResponse"),
  source.indexOf("const currentPlayerId"),
);
const playedActionLearningSource = source.slice(
  source.indexOf("const playerInputModelTitle"),
  source.indexOf("const rememberNetworkTurnState"),
);
const turnScrollSource = source.slice(
  source.indexOf("const maybeScrollToBottomForTurn"),
  source.indexOf("const selectIndexedRadioOption"),
);
const queuedViewportAnchorSource = source.slice(
  source.indexOf("const queuedExecutionSourceUsesViewportAnchor"),
  source.indexOf("const getQueuePanelHost"),
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
const cardToolsWidthSource = source.slice(
  source.indexOf("const syncCardToolsWidth"),
  source.indexOf("const getCardIdentity"),
);
const targetEligibilitySource = source.slice(
  source.indexOf("const isEnqueueablePlayedCardTarget"),
  source.indexOf("const renderPlayedActionTools"),
);
const queuedCardCountSource = source.slice(
  source.indexOf("const queuedCardMatches"),
  source.indexOf("const removeQueuedCard"),
);
const quickChoiceSelectionSource = source.slice(
  source.indexOf("const exactRadioOptionText"),
  source.indexOf("const persistPlayedActionQuickChoice"),
);
const quickChoicePersistenceSource = source.slice(
  source.indexOf("const persistPlayedActionQuickChoice"),
  source.indexOf("const currentPlayedActionLearningSource"),
);
const cardTargetLearningSource = source.slice(
  source.indexOf("const currentPlayedActionLearningSource"),
  source.indexOf("const handleRememberedQuickChoiceSubmit"),
);
const quickChoiceSubmitSource = source.slice(
  source.indexOf("const captureRememberedQuickChoiceSubmit"),
  source.indexOf("const startRememberedQuickChoiceListener"),
);
const quickChoiceCaptureSource = [
  quickChoiceSelectionSource,
  quickChoiceSubmitSource,
].join("\n");
const quickChoiceListenerSource = source.slice(
  source.indexOf("const startRememberedQuickChoiceListener"),
  source.indexOf("const queuedCardMatches"),
);
const quickChoiceUiSource = source.slice(
  source.indexOf("const quickChoiceQueueItem"),
  source.indexOf("const renderPlayedActionTools"),
);
const quickChoiceModeStart = source.indexOf("const playedActionLearningMatchesIdentity");
const quickChoiceModeSource =
  quickChoiceModeStart < 0
    ? ""
    : source.slice(
        quickChoiceModeStart,
        source.indexOf("const targetQueueButtonPresentation"),
      );
const quickChoiceActivationStart = source.indexOf("const activateRememberedQuickChoice");
const quickChoiceActivationSource =
  quickChoiceActivationStart < 0
    ? ""
    : source.slice(
        quickChoiceActivationStart,
        source.indexOf("const renderRememberedQuickChoiceTools"),
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
  source.indexOf("const selectionInputForActionCard"),
);
const cardSelectionSource = source.slice(
  source.indexOf("const selectionInputForActionCard"),
  source.indexOf("const cardMatchesQueuedItem"),
);
const actionSubmitSource = source.slice(
  source.indexOf("const exactActionSubmitMatches"),
  source.indexOf("const clickLogCard"),
);
const deferredQueueResumeSource = source.slice(
  source.indexOf("const queueItemRetryKey"),
  source.indexOf("const clickActionSubmit"),
);
const logCardClickSource = source.slice(
  source.indexOf("const clickLogCard"),
  source.indexOf("const closeRenderedLogCardPanel"),
);
const renderedLogCardCaptureSource = source.slice(
  source.indexOf("const captureRenderedLogCard"),
  source.indexOf("const waitForRenderedLogCard"),
);
const renderedLogCardWaitSource = source.slice(
  source.indexOf("const waitForRenderedLogCard"),
  source.indexOf("const clickMissingCards"),
);
const missingLogCardRenderSource = source.slice(
  source.indexOf("const clickMissingCards"),
  source.indexOf("const requestMissingCardRender"),
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
  source.indexOf("const exactQuickChoiceOptionMatch"),
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
const theftHistoryStateSource = source.slice(
  source.indexOf('let theftHistoryPlayerId = ""'),
  source.indexOf("const looksLikePlayerView"),
);
const theftHistoryDataSource = source.slice(
  source.indexOf("const parseTheftHistoryLogRequest"),
  source.indexOf("const baseGlobalContributionColumns"),
);
const theftHistoryRenderSource = source.slice(
  source.indexOf("const createTheftHistoryPlayerName"),
  source.indexOf("const renderLiveScoreTable"),
);
const liveScoreRenderSource = source.slice(
  source.indexOf("const liveScoreText"),
  source.indexOf("const renderQueuePanel"),
);
const theftHistoryCssSource = source.slice(
  source.indexOf(`#\${timeWarpPanelId} .tfmars420-theft-history {`),
  source.indexOf(`#\${timeWarpPanelId} > .tfmars420-actions-mirror`),
);
const liveScoreCssSource = source.slice(
  source.indexOf(`#\${timeWarpPanelId} .tfmars420-live-scores-scroll`),
  source.indexOf(`#\${timeWarpPanelId} .tfmars420-radio-option-index`),
);
const cardToolsCssStart = source.indexOf(
  "    .tfmars420-card-tools,\n    .tfmars420-enqueue-tools {",
);
const cardToolsCssSource = source.slice(
  cardToolsCssStart,
  source.indexOf("    .tfmars420-card-tools button:hover", cardToolsCssStart),
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
  const mirrorSelections = [];
  const state = Function(
    "isCurrentPlayerTurn",
    "hasLiveActionForm",
    "isTakeNextActionPhase",
    "readQueueSession",
    "selectActionOption",
    "checkActionsMirrorOption",
    "initialQueueExecutionInFlight",
    `"use strict";
      let pendingNetworkPassSelection = true;
      let queueExecutionInFlight = initialQueueExecutionInFlight;
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
    () => ({
      autoProcess: options.autoProcess ?? false,
      queue: options.queue ?? [],
    }),
    (label, selectOptions) => {
      assert.equal(label, "Pass for this generation");
      assert.deepEqual(selectOptions, {required: false});
      selectionCount += 1;
      return options.optionExists ?? true;
    },
    (label) => {
      mirrorSelections.push(label);
      return options.mirrorOptionExists ?? true;
    },
    options.queueExecutionInFlight ?? false,
  );
  return {
    ...state,
    mirrorSelections,
    selectionCount: () => selectionCount,
  };
};

const createActionSubmit = (buttons) => {
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "button, input[type='submit']");
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
    `"use strict"; ${actionSubmitSource}; return clickActionSubmit;`,
  )(
    () => actionsBlock,
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
  );
};

const createWaitingActionSubmit = (buttonsForProbe) => {
  let probeCount = 0;
  const waits = [];
  const actionsRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "button, input[type='submit']");
      const buttons = buttonsForProbe(probeCount);
      probeCount += 1;
      return buttons;
    },
  };
  const actionsBlock = {
    querySelector(selector) {
      assert.equal(selector, ".wf-root, form");
      return actionsRoot;
    },
  };
  const submit = Function(
    "getActionsBlock",
    "cleanText",
    "preserveScrollDuring",
    "wait",
    `"use strict"; ${actionSubmitSource}; return waitForActionSubmit;`,
  )(
    () => actionsBlock,
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (callback) => callback(),
    async (milliseconds) => {
      waits.push(milliseconds);
    },
  );
  return {
    submit,
    probeCount: () => probeCount,
    waits,
  };
};

const createActionCardSelection = ({
  cardName = "Queued Card",
  inputLocation = "direct",
  inputAfterProbe = 0,
  disabled = false,
  checked = false,
  activationRegisters = true,
  replaceInputAfterClick = false,
  replacementChecked = false,
  includeMatchingCard = true,
  includeNeighbor = false,
} = {}) => {
  let probeCount = 0;
  let clickCount = 0;
  const waits = [];
  const input = {
    checked,
    disabled,
    isConnected: true,
    click() {
      clickCount += 1;
      if (activationRegisters) this.checked = true;
      if (replaceInputAfterClick) {
        this.isConnected = false;
        currentInput = replacementInput;
      }
    },
  };
  const replacementInput = {
    checked: replacementChecked,
    disabled: false,
    isConnected: true,
    click() {
      assert.fail("replacement input must not be clicked during confirmation");
    },
  };
  let currentInput = input;
  const neighborInput = {
    checked: false,
    disabled: false,
    isConnected: true,
    click() {
      assert.fail("neighbor input must not be clicked");
    },
  };
  const createCard = (name, candidateInput) => {
    const ownerLabel = {
      querySelector(selector) {
        assert.equal(selector, "input[type='radio'], input[type='checkbox']");
        return probeCount > inputAfterProbe
          ? candidateInput === input ? currentInput : candidateInput
          : null;
      },
    };
    return {
      name,
      querySelector(selector) {
        assert.equal(selector, "input[type='radio'], input[type='checkbox']");
        if (inputLocation !== "direct") return null;
        return probeCount > inputAfterProbe
          ? candidateInput === input ? currentInput : candidateInput
          : null;
      },
      closest(selector) {
        assert.equal(selector, "label");
        return inputLocation === "ancestor" ? ownerLabel : null;
      },
    };
  };
  const cards = [];
  if (includeNeighbor) cards.push(createCard("Neighbor Card", neighborInput));
  if (includeMatchingCard) cards.push(createCard(cardName, input));

  const selection = Function(
    "document",
    "cardMatchesQueuedItem",
    "getCardIdentity",
    "createQueueActionDeferredError",
    "preserveScrollDuring",
    "nextFrame",
    "wait",
    `"use strict";
      ${cardSelectionSource}
      return {selectionInputForActionCard, selectActionCard};
    `,
  )(
    {
      querySelectorAll(selector) {
        assert.equal(selector, ".action-card");
        probeCount += 1;
        return cards;
      },
    },
    (cardBox, item) => cardBox.name === item.cardName,
    (cardBox) => ({name: cardBox.name}),
    (message, reason, details = {}) => {
      const error = new Error(message);
      error.code = "queue-action-deferred";
      error.reason = reason;
      Object.assign(error, details);
      return error;
    },
    (callback) => callback(),
    async () => {},
    async (milliseconds) => {
      waits.push(milliseconds);
    },
  );

  return {
    ...selection,
    clickCount: () => clickCount,
    input,
    neighborInput,
    replacementInput,
    probeCount: () => probeCount,
    select: () => selection.selectActionCard({cardName}, ".action-card"),
    waits,
  };
};

const createDeferredQueueResume = ({
  buttons = [],
  autoProcess = true,
  playerId = "player-1",
  queuedItem = {type: "projectCard", cardName: "Queued Project"},
} = {}) => {
  const session = {playerId, autoProcess, queue: [queuedItem]};
  let scheduleCount = 0;
  const resume = Function(
    "exactActionSubmitMatches",
    "readQueueSession",
    "latestPlayerView",
    "scheduleTerraformingMarsUpdate",
    "queueDeferredSubmit",
    "queueExecutionInFlight",
    "queueExecutionAttempted",
    "queueExecutionError",
    `"use strict";
      ${deferredQueueResumeSource}
      return {
        remember: rememberDeferredQueueSubmit,
        resume: maybeResumeDeferredQueueExecution,
        state: () => ({
          queueDeferredSubmit,
          queueExecutionAttempted,
          queueExecutionError,
        }),
      };
    `,
  )(
    () => buttons,
    () => session,
    {id: "player-1"},
    () => {
      scheduleCount += 1;
    },
    null,
    false,
    true,
    "waiting",
  );
  return {
    ...resume,
    scheduleCount: () => scheduleCount,
    session,
  };
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
    "initialPlayerView",
    `"use strict";
      let latestPlayerView = initialPlayerView;
      let pendingPlayedActionLearning = null;
      let armedPlayedActionLearning = null;
      let stagedPlayedActionLearning = null;
      ${playedActionLearningSource}
      return {
        remember: rememberPlayedActionForLearning,
        update: updatePlayedActionLearningFromPlayerView,
        stage: stagePlayedActionQuickChoice,
        takeConfirmed: takeConfirmedStagedPlayedActionQuickChoice,
        setPlayerView: (playerView) => { latestPlayerView = playerView; },
        clear: clearPlayedActionLearning,
        state: () => ({
          pendingPlayedActionLearning,
          armedPlayedActionLearning,
          stagedPlayedActionLearning,
        }),
      };
    `,
  )(
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    () => playerId,
    {
      id: playerId,
      waitingFor: {type: "or", title: "Select one option", options: []},
    },
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

  const stagedChoices = [];
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
    "recordStagedChoice",
    "initialPlaybackActive",
    `"use strict";
      let armedPlayedActionLearning = {
        playerId: "player-1",
        cardKey: "astrodrill",
        cardName: "AstroDrill",
      };
      let quickChoicePlaybackActive = initialPlaybackActive;
      const currentPlayedActionLearningSource = () => armedPlayedActionLearning;
      const stagePlayedActionQuickChoice = (learning, choice) => {
        recordStagedChoice(learning, choice);
        armedPlayedActionLearning = null;
        return true;
      };
      ${quickChoiceCaptureSource}
      return {
        capture: captureRememberedQuickChoiceSubmit,
        handle: handleRememberedQuickChoiceSubmit,
        armed: () => armedPlayedActionLearning,
      };
    `,
  )(
    FakeElement,
    () => actionsBlock,
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (cardBox) => ({name: cardBox?.name ?? "Card"}),
    (learning, choice) => {
      stagedChoices.push({learning: {...learning}, choice});
    },
    playbackActive,
  );
  return {
    ...capture,
    event: {isTrusted: trusted, target: new FakeElement()},
    stagedChoices,
  };
};

const createQuickChoicePersistenceHarness = (playerId = "player-1") => {
  const session = freshQueueSession(playerId);
  const auditEvents = [];
  let updateCount = 0;
  const persist = Function(
    "normalizeRememberedQuickChoice",
    "readQueueSession",
    "updateQueueSession",
    "rememberQuickChoice",
    "auditLog",
    `"use strict";
      ${quickChoicePersistenceSource}
      return persistPlayedActionQuickChoice;
    `,
  )(
    normalizeRememberedQuickChoice,
    () => session,
    (updater) => {
      updateCount += 1;
      updater(session);
      return session;
    },
    rememberQuickChoice,
    (eventName, details) => auditEvents.push({eventName, details}),
  );
  return {
    auditEvents,
    persist,
    session,
    updateCount: () => updateCount,
  };
};

const createCardTargetLearningHarness = ({
  direct = true,
  duplicateTarget = false,
  targetDisabled = false,
  playbackActive = false,
  hasLiveForm = true,
  takeNextAction = false,
  hasPass = false,
} = {}) => {
  const targetName = "Regolith Eaters";
  const input = {disabled: targetDisabled};
  const makeCard = () => ({
    name: targetName,
    querySelector(selector) {
      assert.equal(selector, "input[type='radio'], input[type='checkbox']");
      return input;
    },
  });
  const cards = duplicateTarget ? [makeCard(), makeCard()] : [makeCard()];
  const workflow = {
    querySelector(selector) {
      assert.equal(selector, ":scope > .wf-component-title");
      return {textContent: "Select card to add microbe or animal"};
    },
    querySelectorAll(selector) {
      assert.equal(selector, ".cardbox");
      return cards;
    },
  };
  const outerOptions = {};
  const optionLabel = {
    parentElement: {
      contains(candidate) {
        return candidate === workflow;
      },
    },
    querySelector(selector) {
      assert.equal(selector, "span");
      return {textContent: "Select card to add 1 microbe"};
    },
  };
  const optionRadio = {
    disabled: false,
    closest(selector) {
      if (selector === ".wf-options") return outerOptions;
      assert.equal(selector, "label.form-radio");
      return optionLabel;
    },
  };
  outerOptions.querySelectorAll = (selector) => {
    assert.equal(selector, "label.form-radio input[type='radio']:checked");
    return direct ? [] : [optionRadio];
  };
  const actionsRoot = {
    querySelector(selector) {
      assert.equal(selector, ".wf-options");
      return direct ? null : outerOptions;
    },
    querySelectorAll(selector) {
      if (selector === ".wf-component--select-card") return [workflow];
      assert.equal(selector, ":scope > .wf-component--select-card");
      return direct ? [workflow] : [];
    },
  };
  const latestPlayerView = {
    id: "player-1",
    waitingFor: {type: "card", title: "Select card to add microbe or animal"},
  };
  const candidate = Function(
    "initialPlaybackActive",
    "latestPlayerView",
    "playedActionInputKey",
    "hasLiveActionForm",
    "isTakeNextActionPhase",
    "hasEnabledExactPassOption",
    "getActionsBlock",
    "cardMatchesQueuedItem",
    "getCardIdentity",
    "cleanText",
    "quickChoiceCardWorkflowPrompt",
    "exactRadioOptionText",
    `"use strict";
      let quickChoicePlaybackActive = initialPlaybackActive;
      let armedPlayedActionLearning = {
        playerId: "player-1",
        cardKey: "mohole-lake",
        cardName: "Mohole Lake",
      };
      let stagedPlayedActionLearning = null;
      ${cardTargetLearningSource}
      return cardTargetQuickChoiceLearningCandidate;
    `,
  )(
    playbackActive,
    latestPlayerView,
    (playerView) => JSON.stringify(playerView?.waitingFor ?? null),
    () => hasLiveForm,
    () => takeNextAction,
    () => hasPass,
    () => ({
      querySelector(selector) {
        assert.equal(selector, ".wf-root, form");
        return actionsRoot;
      },
    }),
    (cardBox, item) => cardBox.name === item.cardName,
    (cardBox) => ({name: cardBox?.name ?? "Card"}),
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (cardWorkflow) =>
      String(
        cardWorkflow?.querySelector(":scope > .wf-component-title")?.textContent ?? "",
      )
        .replace(/\s+/g, " ")
        .trim(),
    (radio) =>
      String(radio.closest("label.form-radio").querySelector("span").textContent)
        .replace(/\s+/g, " ")
        .trim(),
  );
  return {
    candidate,
    item: {
      type: "cardTarget",
      cardKey: "regolith-eaters",
      cardName: targetName,
    },
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

const createQueuedViewportAnchorHarness = ({
  actionsTop = -300,
  actionsBottom = -100,
  candidateTop = 120,
} = {}) => {
  const actionsRect = {top: actionsTop, bottom: actionsBottom};
  const candidateRect = {top: candidateTop, bottom: candidateTop + 40};
  const scrollCalls = [];
  const listeners = new Map();
  const timers = new Map();
  let nextTimer = 1;
  const candidate = {
    isConnected: true,
    closest: () => null,
    getBoundingClientRect: () => ({...candidateRect}),
  };
  const actionsBlock = {
    contains: () => false,
    getBoundingClientRect: () => ({...actionsRect}),
  };
  const documentElement = {};
  const body = {};
  const document = {
    body,
    documentElement,
    elementsFromPoint: () => [candidate],
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
  };
  const window = {
    innerHeight: 800,
    innerWidth: 1200,
    clearTimeout(timer) {
      timers.delete(timer);
    },
    getComputedStyle: () => ({position: "static"}),
    scrollBy(options) {
      scrollCalls.push(options);
      candidateRect.top -= options.top;
      candidateRect.bottom -= options.top;
      actionsRect.top -= options.top;
      actionsRect.bottom -= options.top;
    },
    setTimeout(callback) {
      const timer = nextTimer++;
      timers.set(timer, callback);
      return timer;
    },
  };
  const executor = Function(
    "window",
    "document",
    "getActionsBlock",
    `"use strict";
      let queuedExecutionViewportAnchor = null;
      let queuedExecutionViewportAnchorSettleTimer = null;
      ${queuedViewportAnchorSource}
      return {
        begin: beginQueuedExecutionViewportAnchor,
        maintain: maintainQueuedExecutionViewportAnchor,
        markRelease: markQueuedExecutionViewportAnchorForRelease,
        startInput: startQueuedExecutionViewportUserInput,
        state: () => queuedExecutionViewportAnchor,
      };
    `,
  )(window, document, () => actionsBlock);
  return {
    ...executor,
    actionsRect,
    candidate,
    candidateRect,
    listeners,
    runLastTimer() {
      const entry = [...timers.entries()].at(-1);
      if (!entry) return false;
      timers.delete(entry[0]);
      entry[1]();
      return true;
    },
    scrollCalls,
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

const createActionsMirrorExecutor = (mirror = null) => {
  const preserved = [];
  const dispatched = [];
  const rememberedSubmits = [];
  let refreshCount = 0;
  const executor = Function(
    "timeWarpPanelId",
    "lobbyRootClass",
    "preserveScrollDuring",
    "dispatchBubbledEvent",
    "scheduleTerraformingMarsUpdate",
    "document",
    "cleanText",
    "captureRememberedQuickChoiceSubmit",
    `"use strict";
      ${actionsMirrorSource}
      return {
        mapActionsMirrorElements,
        sanitizeActionsMirror,
        proxyActionsMirrorClick,
        proxyActionsMirrorValueEvent,
        checkActionsMirrorOption,
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
    {
      querySelector(selector) {
        assert.equal(selector, ".tfmars420-actions-mirror");
        return mirror;
      },
    },
    (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
    (source) => {
      rememberedSubmits.push(source);
      return true;
    },
  );
  return {
    ...executor,
    dispatched,
    preserved,
    rememberedSubmits,
    refreshCount: () => refreshCount,
  };
};

const createMirrorEvent = (type, target, overrides = {}) => {
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
      ...overrides,
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

const createQuickChoiceModeHarness = ({
  armed = null,
  hasLiveForm = true,
  takeNextAction = false,
  hasPass = false,
} = {}) => {
  if (!quickChoiceModeSource) {
    return {
      matches: () => false,
      mode: () => null,
    };
  }
  return Function(
    "normalizeCardName",
    "latestQueuedPlayedActionMatches",
    "hasLiveActionForm",
    "isTakeNextActionPhase",
    "hasEnabledExactPassOption",
    "initialArmed",
    `"use strict";
      let armedPlayedActionLearning = initialArmed;
      ${quickChoiceModeSource}
      return {
        matches: playedActionLearningMatchesIdentity,
        mode: rememberedQuickChoiceRenderMode,
      };
    `,
  )(
    (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(),
    latestQueuedPlayedActionMatches,
    () => hasLiveForm,
    () => takeNextAction,
    () => hasPass,
    armed,
  );
};

const createQuickChoiceActivationHarness = ({
  initialQueue = [],
  modes = ["queued"],
  immediateResult = true,
} = {}) => {
  const session = {queue: [...initialQueue]};
  const auditEvents = [];
  const executions = [];
  let updateCount = 0;
  let modeIndex = 0;
  if (!quickChoiceActivationSource) {
    return {
      activate: () => false,
      auditEvents,
      executions,
      session,
      updateCount: () => updateCount,
    };
  }
  const activate = Function(
    "readQueueSession",
    "rememberedQuickChoiceRenderMode",
    "quickChoiceQueueItem",
    "auditLog",
    "executeQueueItemNow",
    "updateQueueSession",
    `"use strict";
      ${quickChoiceActivationSource}
      return activateRememberedQuickChoice;
    `,
  )(
    () => session,
    () => modes[Math.min(modeIndex++, modes.length - 1)] ?? null,
    quickChoiceQueueItem,
    (eventName, details) => auditEvents.push({eventName, details}),
    (item, options) => {
      executions.push({item, options});
      return immediateResult;
    },
    (updater) => {
      updateCount += 1;
      updater(session);
      return session;
    },
  );
  return {
    activate,
    auditEvents,
    executions,
    session,
    updateCount: () => updateCount,
  };
};

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

const createIndexedRadioSubmit = (buttons, {capture = () => false} = {}) => {
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
    "captureRememberedQuickChoiceSubmit",
    `"use strict"; ${indexedRadioSubmitSource}; return clickIndexedRadioSubmit;`,
  )(
    () => actionsBlock,
    (callback) => callback(),
    capture,
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
    card.input ??= {};
    card.input.type ??= "radio";
    card.input.checked ??= false;
    card.input.disabled ??= false;
    card.input.isConnected ??= true;
    card.input.click ??= function clickTargetInput() {
      this.checked = this.type === "checkbox" ? !this.checked : true;
      events.push(`target:${card.name}`);
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
    "createQueueActionDeferredError",
    "wait",
    "nextFrame",
    "selectedRadioOptionHasChildren",
    `"use strict";
      let quickChoicePlaybackActive = false;
      ${cardSelectionSource}
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
    (message, reason, details = {}) => {
      const error = new Error(message);
      error.code = "queue-action-deferred";
      error.reason = reason;
      Object.assign(error, details);
      return error;
    },
    async () => {},
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

const {
  parseTheftHistoryLogRequest,
  theftHistoryObservationIsCurrent,
  parseTheftLogEntry,
  sortedUniqueTheftHistoryEvents,
  theftHistoryTimestampText,
  theftGenerationFingerprint,
  promoteCompletedTheftHistoryFingerprints,
  theftGenerationRequestPlan,
} = Function(
  "cleanText",
  "normalizeCardName",
  "isPlainObject",
  `"use strict";
    ${theftHistoryDataSource}
    return {
      parseTheftHistoryLogRequest,
      theftHistoryObservationIsCurrent,
      parseTheftLogEntry,
      sortedUniqueTheftHistoryEvents,
      theftHistoryTimestampText,
      theftGenerationFingerprint,
      promoteCompletedTheftHistoryFingerprints,
      theftGenerationRequestPlan,
    };
  `,
)(
  (value) => String(value ?? "").replace(/\s+/g, " ").trim(),
  (value) => String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase(),
  (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value),
);

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
    "waitForActionSubmit",
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

const executeQueuedCard = async (type) => {
  const events = [];
  await Function(
    "selectActionOption",
    "nextFrame",
    "selectActionCard",
    "actionCardSelector",
    "waitForActionSubmit",
    `"use strict"; ${executeQueuedItemSource}; return executeQueuedItem({type: ${JSON.stringify(type)}});`,
  )(
    (label) => events.push(`select:${label}`),
    async () => events.push("frame"),
    async () => events.push("select-card"),
    () => ".action-card",
    async (label) => events.push(`submit:${label}`),
  );
  return events;
};

const executeFinalGreenerySkip = async () => {
  const events = [];
  await Function(
    "selectExactActionOption",
    "declineFinalGreeneryOption",
    "nextFrame",
    "waitForActionSubmit",
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
    "waitForActionSubmit",
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
    async (label, alternatives = [], options = {}) => {
      events.push(`submit:${label}`);
      assert.deepEqual(alternatives, []);
      assert.deepEqual(options, {});
      if (!confirm) {
        const error = new Error(
          "missing exact action submit button after 1000ms: Confirm",
        );
        error.code = "queue-action-deferred";
        error.reason = "exact-submit-not-ready";
        error.expectedSubmit = "Confirm";
        error.alternateSubmitTexts = [];
        throw error;
      }
      return true;
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

const createQueueExecutor = (
  initialQueue,
  {
    reject = false,
    defer = false,
    canExecute = true,
    targetLearningCandidate = null,
  } = {},
) => {
  const session = {playerId: "player-1", queue: [...initialQueue]};
  const auditEvents = [];
  let clearCount = 0;
  let restoreCount = 0;
  let writeCount = 0;
  const executedItems = [];
  const learningItems = [];
  const persistedTargetLearnings = [];
  let learningClearCount = 0;
  const viewportAnchorBegins = [];
  let viewportAnchorClearCount = 0;
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
    "cardTargetQuickChoiceLearningCandidate",
    "persistPlayedActionQuickChoice",
    "rememberPlayedActionForLearning",
    "isFollowUpQueueItem",
    "clearPlayedActionLearning",
    "beginQueuedExecutionViewportAnchor",
    "clearQueuedExecutionViewportAnchor",
    "isQueueActionDeferredError",
    "rememberDeferredQueueSubmit",
    "maybeResumeDeferredQueueExecution",
    "window",
    "scheduleTerraformingMarsUpdate",
    "queueExecutionAttempted",
    "queueExecutionInFlight",
    "queuePendingLogMutation",
    "queueExecutionError",
    "queueDeferredSubmit",
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
      if (defer) {
        const error = new Error(
          defer === "selection"
            ? `card selection not ready after 1000ms: ${item.cardName ?? item.label}`
            : "missing exact action submit button after 1000ms: Play card",
        );
        error.code = "queue-action-deferred";
        if (defer === "selection") {
          error.reason = "card-selection-not-ready";
          error.expectedCard = item.cardName ?? item.label;
        } else {
          error.reason = "exact-submit-not-ready";
          error.expectedSubmit = "Play card";
          error.alternateSubmitTexts = [];
        }
        throw error;
      }
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
    (item) => (item?.type === "cardTarget" ? targetLearningCandidate : null),
    (learning, choice) => {
      persistedTargetLearnings.push({learning, choice});
      return true;
    },
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
    (executionSource) => {
      viewportAnchorBegins.push(executionSource);
      return executionSource !== "immediate";
    },
    () => {
      viewportAnchorClearCount += 1;
    },
    (error) => error?.code === "queue-action-deferred",
    () => {},
    () => false,
    {setTimeout: (callback) => callback()},
    () => {},
    false,
    false,
    false,
    "",
    null,
  );
  return {
    ...executor,
    auditEvents,
    queue: () => session.queue,
    clearCount: () => clearCount,
    executedItems,
    learningClearCount: () => learningClearCount,
    learningItems,
    persistedTargetLearnings,
    restoreCount: () => restoreCount,
    writeCount: () => writeCount,
    viewportAnchorBegins,
    viewportAnchorClearCount: () => viewportAnchorClearCount,
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

const theftHistoryPlayers = [
  {name: "tran", color: "yellow"},
  {name: "dan", color: "red"},
  {name: "santiano", color: "green"},
  {name: "neil", color: "black"},
];

test("theft history recognizes same-origin relative and absolute log requests", () => {
  const baseUrl = "https://terraforming-mars.herokuapp.com/player?id=p123";
  assert.deepEqual(
    parseTheftHistoryLogRequest("/api/game/logs?id=p123&generation=4", baseUrl),
    {playerId: "p123", generation: 4},
  );
  assert.deepEqual(
    parseTheftHistoryLogRequest(
      "https://terraforming-mars.herokuapp.com/api/game/logs?generation=9&id=s456",
      baseUrl,
    ),
    {playerId: "s456", generation: 9},
  );
  assert.equal(
    parseTheftHistoryLogRequest(
      "https://example.com/api/game/logs?id=p123&generation=4",
      baseUrl,
    ),
    null,
  );
  assert.equal(parseTheftHistoryLogRequest("/api/game/logs?id=p123", baseUrl), null);
  assert.equal(
    parseTheftHistoryLogRequest("/api/game/logs?id=p123&generation=0", baseUrl),
    null,
  );
  assert.equal(
    parseTheftHistoryLogRequest("/api/player?id=p123&generation=4", baseUrl),
    null,
  );
});

test("theft history observations require the current player session and sequence", () => {
  const observation = {
    playerId: "p123",
    generation: 4,
    sequence: 8,
    sessionRevision: 3,
  };
  assert.equal(
    theftHistoryObservationIsCurrent(observation, {
      playerId: "p123",
      sessionRevision: 3,
      latestSequence: 8,
    }),
    true,
  );
  assert.equal(
    theftHistoryObservationIsCurrent(observation, {
      playerId: "p999",
      sessionRevision: 3,
      latestSequence: 8,
    }),
    false,
  );
  assert.equal(
    theftHistoryObservationIsCurrent(observation, {
      playerId: "p123",
      sessionRevision: 4,
      latestSequence: 8,
    }),
    false,
  );
  assert.equal(
    theftHistoryObservationIsCurrent(observation, {
      playerId: "p123",
      sessionRevision: 3,
      latestSequence: 9,
    }),
    false,
  );
});

test("theft history parses production and direct-resource log messages", () => {
  assert.deepEqual(
    parseTheftLogEntry(
      {
        message: "${3} stole ${1} ${2} production from ${0}",
        data: [
          {type: 2, value: "green"},
          {type: 1, value: "1"},
          {type: 0, value: "steel"},
          {type: 2, value: "yellow"},
        ],
        timestamp: 1000,
      },
      2,
      theftHistoryPlayers,
    ),
    {
      generation: 2,
      timestamp: 1000,
      thiefName: "tran",
      thiefColor: "yellow",
      descriptor: "1 steel production",
      victimName: "santiano",
      victimColor: "green",
    },
  );

  assert.deepEqual(
    parseTheftLogEntry(
      {
        message: "${3} stole ${1} ${2} from ${0}",
        data: [
          {type: 2, value: "black"},
          {type: 1, value: "3"},
          {type: 0, value: "M€"},
          {type: 2, value: "red"},
        ],
        timestamp: 2000,
      },
      9,
      theftHistoryPlayers,
    ),
    {
      generation: 9,
      timestamp: 2000,
      thiefName: "dan",
      thiefColor: "red",
      descriptor: "3 M€",
      victimName: "neil",
      victimColor: "black",
    },
  );
});

test("theft history rejects malformed, unresolved, and non-theft logs", () => {
  const baseEntry = {
    message: "${3} stole ${1} ${2} from ${0}",
    data: [
      {type: 2, value: "black"},
      {type: 1, value: "3"},
      {type: 0, value: "M€"},
      {type: 2, value: "red"},
    ],
    timestamp: 2000,
  };
  assert.equal(
    parseTheftLogEntry(
      {...baseEntry, data: [{type: 2, value: "purple"}, ...baseEntry.data.slice(1)]},
      9,
      theftHistoryPlayers,
    ),
    null,
  );
  assert.equal(
    parseTheftLogEntry({...baseEntry, message: "${4} stole ${1} from ${0}"}, 9, theftHistoryPlayers),
    null,
  );
  assert.equal(
    parseTheftLogEntry({...baseEntry, message: "${3} gained ${1} ${2}"}, 9, theftHistoryPlayers),
    null,
  );
  assert.equal(
    parseTheftLogEntry({...baseEntry, timestamp: undefined}, 9, theftHistoryPlayers),
    null,
  );
});

test("theft history sorts chronologically and removes exact duplicates", () => {
  const early = {
    generation: 2,
    timestamp: 1000,
    thiefName: "tran",
    thiefColor: "yellow",
    descriptor: "1 steel production",
    victimName: "santiano",
    victimColor: "green",
  };
  const late = {
    generation: 9,
    timestamp: 2000,
    thiefName: "dan",
    thiefColor: "red",
    descriptor: "3 M€",
    victimName: "neil",
    victimColor: "black",
  };
  assert.deepEqual(
    sortedUniqueTheftHistoryEvents([late, early, {...late}]),
    [early, late],
  );
});

test("theft history formats visible and full timestamps locally", () => {
  const timestamp = Date.UTC(2026, 7, 2, 15, 4);
  assert.equal(
    theftHistoryTimestampText(timestamp, {locales: "en-US", timeZone: "UTC"}),
    "3:04 PM",
  );
  assert.equal(
    theftHistoryTimestampText(timestamp, {
      full: true,
      locales: "en-US",
      timeZone: "UTC",
    }),
    "Aug 2, 2026, 3:04 PM",
  );
  assert.equal(theftHistoryTimestampText(Number.NaN), "—");
  assert.equal(theftHistoryTimestampText("1785683040000"), "—");
  assert.equal(theftHistoryTimestampText(timestamp, {timeZone: "Not/AZone"}), "—");
});

test("theft generation requests promote observed history and exclude the active generation", () => {
  const playerView = {game: {generation: 3, step: 10}};
  const loaded = new Map();
  const inFlight = new Map();
  assert.deepEqual(
    theftGenerationRequestPlan(playerView, loaded, inFlight),
    [
      {generation: 1, fingerprint: "complete"},
      {generation: 2, fingerprint: "complete"},
    ],
  );

  loaded.set(1, "complete");
  loaded.set(2, "active:9");
  loaded.set(3, "active:10");
  promoteCompletedTheftHistoryFingerprints(playerView, loaded);
  assert.equal(loaded.get(2), "complete");
  assert.equal(loaded.get(3), "active:10");
  assert.deepEqual(theftGenerationRequestPlan(playerView, loaded, inFlight), []);
  assert.equal(theftGenerationFingerprint({game: {generation: 3, step: 11}}, 2), "complete");
  assert.deepEqual(
    theftGenerationRequestPlan(
      {game: {generation: 3, step: 11}},
      loaded,
      inFlight,
    ),
    [],
  );

  loaded.delete(2);
  assert.deepEqual(
    theftGenerationRequestPlan(playerView, loaded, inFlight),
    [{generation: 2, fingerprint: "complete"}],
  );
  inFlight.set(2, "complete");
  assert.deepEqual(theftGenerationRequestPlan(playerView, loaded, inFlight), []);
});

test("theft history latches page log responses without delaying the game response", () => {
  assert.match(
    playerViewCaptureTransportSource,
    /terraformingMarsOriginalFetch = originalFetch/,
  );
  assert.match(
    playerViewCaptureTransportSource,
    /const theftHistoryObservation = beginTheftHistoryLogObservation\(source\)/,
  );
  assert.match(
    playerViewCaptureTransportSource,
    /captureTheftHistoryLogResponse\(response, theftHistoryObservation\);\s*}\s*return response/,
  );
  assert.match(theftHistoryDataSource, /response\s*\.clone\(\)\s*\.json\(\)/);
  assert.match(
    theftHistoryDataSource,
    /theftHistoryObservationIsCurrent\(observation,[\s\S]*latestSequence:/,
  );
  assert.match(
    theftHistoryDataSource,
    /theftHistoryEventsByGeneration\.set\(observation\.generation, events\)/,
  );
  assert.match(
    theftHistoryDataSource,
    /theftHistoryLoadedFingerprints\.set\([\s\S]*theftGenerationFingerprint\(playerView, observation\.generation\)/,
  );
});

test("theft history requests only missing history and resets observation state", () => {
  assert.match(
    theftHistoryDataSource,
    /terraformingMarsOriginalFetch\(\s*`\/api\/game\/logs\?\$\{query\.toString\(\)\}`/,
  );
  assert.doesNotMatch(
    theftHistoryDataSource,
    /window\.fetch\(`\/api\/game\/logs/,
  );
  assert.ok(
    theftHistoryDataSource.indexOf("theftHistoryEventsByGeneration.set") <
      theftHistoryDataSource.indexOf("theftHistoryLoadedFingerprints.set"),
  );
  assert.match(theftHistoryDataSource, /catch \(error\)[\s\S]*theft-history-request-error/);
  assert.match(theftHistoryDataSource, /finally[\s\S]*theftHistoryInFlightFingerprints\.delete/);
  assert.match(
    theftHistoryDataSource,
    /theftHistoryInFlightFingerprints\.get\(request\.generation\) !==\s*request\.fingerprint/,
  );
  assert.doesNotMatch(theftHistoryDataSource, /catch \(error\)[\s\S]*theftHistoryEventsByGeneration\.clear/);
  assert.match(theftHistoryStateSource, /theftHistoryEventsByGeneration\.clear\(\)/);
  assert.match(theftHistoryStateSource, /theftHistoryLoadedFingerprints\.clear\(\)/);
  assert.match(theftHistoryStateSource, /theftHistoryInFlightFingerprints\.clear\(\)/);
  assert.match(theftHistoryStateSource, /theftHistorySessionRevision \+= 1/);
  assert.match(theftHistoryStateSource, /theftHistoryLatestObservationSequence\.clear\(\)/);
  assert.match(source, /cleanupTerraformingMarsHelpersForHidden[\s\S]*resetTheftHistoryState\(\)/);
});

test("theft history renders a metadata table below contributions with safe colored names", () => {
  assert.match(
    liveScoreRenderSource,
    /section\.append\(scroller, renderTheftHistory\(playerView\)\)/,
  );
  assert.match(theftHistoryRenderSource, /title\.textContent = "Theft history"/);
  assert.match(theftHistoryRenderSource, /"Loading theft history…"/);
  assert.match(theftHistoryRenderSource, /"No theft recorded\."/);
  assert.match(theftHistoryRenderSource, /className = "tfmars420-theft-history-scroll"/);
  assert.match(theftHistoryRenderSource, /className = "tfmars420-theft-history-table"/);
  assert.match(theftHistoryRenderSource, /\["Gen", "Time", "Event"\]/);
  assert.match(theftHistoryRenderSource, /generationCell\.textContent = String\(event\.generation\)/);
  assert.match(
    theftHistoryRenderSource,
    /timeCell\.textContent = theftHistoryTimestampText\(event\.timestamp\)/,
  );
  assert.match(
    theftHistoryRenderSource,
    /timeCell\.title = theftHistoryTimestampText\(event\.timestamp, \{full: true\}\)/,
  );
  assert.match(theftHistoryRenderSource, /document\.createElement\("tr"\)/);
  assert.match(theftHistoryRenderSource, /table\.append\(head, body\)/);
  assert.match(theftHistoryRenderSource, /document\.createElement\("strong"\)/);
  assert.match(theftHistoryRenderSource, /player_bg_color_\$\{color\}/);
  assert.match(theftHistoryRenderSource, /` stole \$\{event\.descriptor\} from `/);
  assert.doesNotMatch(theftHistoryRenderSource, /innerHTML|insertAdjacentHTML/);
  assert.match(
    theftHistoryCssSource,
    /\.tfmars420-theft-history-scroll[\s\S]*max-width: 100%[\s\S]*overflow-x: auto/,
  );
  assert.match(
    theftHistoryCssSource,
    /\.tfmars420-theft-history-table th,[\s\S]*border: 1px solid[\s\S]*padding: 4px 6px/,
  );
  assert.match(
    theftHistoryCssSource,
    /\.tfmars420-theft-history-generation,[\s\S]*white-space: nowrap/,
  );
  assert.match(theftHistoryCssSource, /\.tfmars420-theft-history-player[\s\S]*font-weight: 700/);
  assert.match(
    theftHistoryCssSource,
    /\.tfmars420-theft-history-event[\s\S]*max-width: 420px[\s\S]*overflow-wrap: anywhere[\s\S]*white-space: normal/,
  );
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
    /panel\.append\(actions\);[\s\S]*panel\.append\(autopilotActions\);[\s\S]*requestTheftHistory\(latestPlayerView\);\s*const liveScoreTable[\s\S]*panel\.append\(liveScoreTable\)/,
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
  assert.deepEqual(executor.viewportAnchorBegins, ["manual"]);
  assert.equal(executor.viewportAnchorClearCount(), 1);
  assert.equal(executor.state().queueExecutionInFlight, false);
  assert.match(executor.state().queueExecutionError, /test failure/);
  assert.deepEqual(
    executor.auditEvents.map(({eventName, details}) => [eventName, details.executionSource]),
    [["game.action.failure", "manual"]],
  );
});

test("successful immediate execution audits its source and outcome", async () => {
  assert.doesNotMatch(queueLifecycleSource, /game\.action\.attempt/);
  const requested = {type: "projectCard", label: "requested"};
  const executor = createQueueExecutor([]);

  assert.equal(executor.executeQueueItemNow(requested), true);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(
    executor.auditEvents.map(({eventName, details}) => [eventName, details.executionSource]),
    [["game.action.success", "immediate"]],
  );
  assert.deepEqual(executor.viewportAnchorBegins, ["immediate"]);
  assert.equal(executor.viewportAnchorClearCount(), 0);
});

test("successful card-target execution persists its captured quick choice", async () => {
  const item = {
    type: "cardTarget",
    cardName: "Regolith Eaters",
    label: "target: Regolith Eaters",
  };
  const targetLearningCandidate = {
    playerId: "player-1",
    cardKey: "mohole-lake",
    cardName: "Mohole Lake",
    choice: {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    },
  };
  const executor = createQueueExecutor([], {targetLearningCandidate});

  assert.equal(executor.executeQueueItemNow(item), true);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.persistedTargetLearnings, [
    {
      learning: targetLearningCandidate,
      choice: targetLearningCandidate.choice,
    },
  ]);

  const queued = createQueueExecutor([item], {targetLearningCandidate});
  assert.equal(queued.executeQueuedActionAt(0), true);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(queued.persistedTargetLearnings, [
    {
      learning: targetLearningCandidate,
      choice: targetLearningCandidate.choice,
    },
  ]);
});

test("failed card-target execution discards its captured quick choice", async () => {
  const item = {
    type: "cardTarget",
    cardName: "Regolith Eaters",
    label: "target: Regolith Eaters",
  };
  const targetLearningCandidate = {
    playerId: "player-1",
    cardKey: "mohole-lake",
    cardName: "Mohole Lake",
    choice: {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    },
  };
  const executor = createQueueExecutor([], {
    reject: true,
    targetLearningCandidate,
  });

  assert.equal(executor.executeQueueItemNow(item), true);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.persistedTargetLearnings, []);
  assert.deepEqual(
    executor.auditEvents.map(({eventName}) => eventName),
    ["game.action.failure"],
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
    [["game.action.failure", "immediate"]],
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

test("automatic indexed failure preserves the strict-FIFO queue", async () => {
  const first = {type: "playedAction", label: "first"};
  const second = {type: "cardTarget", label: "second"};
  const executor = createQueueExecutor([first, second], {reject: true});

  assert.equal(executor.executeQueuedActionAt(0), true);
  assert.deepEqual(executor.queue(), [second]);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.queue(), [first, second]);
  assert.equal(executor.clearCount(), 0);
  assert.equal(executor.restoreCount(), 1);
  assert.equal(executor.learningClearCount(), 1);
  assert.deepEqual(
    executor.auditEvents.map(({eventName, details}) => [eventName, details.executionSource]),
    [["game.action.failure", "automatic"]],
  );
});

test("automatic exact-submit deferral restores the head without failing", async () => {
  const first = {type: "projectCard", label: "first"};
  const second = {type: "playedAction", label: "second"};
  const executor = createQueueExecutor([first, second], {defer: true});

  assert.equal(executor.executeQueuedActionAt(0), true);
  assert.deepEqual(executor.queue(), [second]);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.queue(), [first, second]);
  assert.equal(executor.clearCount(), 0);
  assert.equal(executor.restoreCount(), 1);
  assert.equal(executor.state().queueExecutionAttempted, true);
  assert.equal(executor.state().queueExecutionError, "");
  assert.deepEqual(executor.auditEvents, [
    {
      eventName: "game.action.deferred",
      details: {
        executionSource: "automatic",
        itemType: "projectCard",
        label: "first",
        reason: "exact-submit-not-ready",
        expectedSubmit: "Play card",
      },
    },
  ]);
});

test("automatic card-selection deferral restores and pauses the strict-FIFO head", async () => {
  const first = {
    type: "playedAction",
    cardName: "Queued Action",
    label: "Queued Action",
  };
  const second = {type: "projectCard", label: "later project"};
  const executor = createQueueExecutor([first, second], {defer: "selection"});

  assert.equal(executor.executeQueuedActionAt(0), true);
  assert.deepEqual(executor.queue(), [second]);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(executor.queue(), [first, second]);
  assert.equal(executor.restoreCount(), 1);
  assert.equal(executor.clearCount(), 0);
  assert.equal(executor.state().queueExecutionAttempted, true);
  assert.equal(executor.state().queueExecutionError, "");
  assert.deepEqual(executor.auditEvents, [
    {
      eventName: "game.action.deferred",
      details: {
        executionSource: "automatic",
        itemType: "playedAction",
        label: "Queued Action",
        reason: "card-selection-not-ready",
        expectedCard: "Queued Action",
      },
    },
  ]);
});

test("manual and immediate exact-submit timeouts retain failure semantics", async () => {
  const item = {type: "projectCard", label: "queued project"};
  const manual = createQueueExecutor([item], {defer: true});
  const immediate = createQueueExecutor([], {defer: true});

  assert.equal(manual.executeQueuedActionAt(0, {manual: true}), true);
  assert.equal(immediate.executeQueueItemNow(item), true);

  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(manual.queue(), [item]);
  assert.equal(manual.restoreCount(), 1);
  assert.match(manual.state().queueExecutionError, /after 1000ms: Play card/);
  assert.deepEqual(
    manual.auditEvents.map(({eventName, details}) => [
      eventName,
      details.executionSource,
    ]),
    [["game.action.failure", "manual"]],
  );

  assert.deepEqual(immediate.queue(), []);
  assert.equal(immediate.restoreCount(), 0);
  assert.match(immediate.state().queueExecutionError, /after 1000ms: Play card/);
  assert.deepEqual(
    immediate.auditEvents.map(({eventName, details}) => [
      eventName,
      details.executionSource,
    ]),
    [["game.action.failure", "immediate"]],
  );
});

test("manual and immediate card-selection deferrals remain visible failures", async () => {
  const item = {
    type: "playedAction",
    cardName: "Queued Action",
    label: "Queued Action",
  };
  const manual = createQueueExecutor([item], {defer: "selection"});
  const immediate = createQueueExecutor([], {defer: "selection"});

  assert.equal(manual.executeQueuedActionAt(0, {manual: true}), true);
  assert.equal(immediate.executeQueueItemNow(item), true);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(manual.queue(), [item]);
  assert.match(manual.state().queueExecutionError, /card selection not ready/);
  assert.deepEqual(immediate.queue(), []);
  assert.match(immediate.state().queueExecutionError, /card selection not ready/);
  assert.deepEqual(
    [manual, immediate].map((executor) =>
      executor.auditEvents.map(({eventName}) => eventName),
    ),
    [["game.action.failure"], ["game.action.failure"]],
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
  assert.deepEqual(selector.mirrorSelections, ["Pass for this generation"]);
  assert.doesNotMatch(networkPassSelectionSource, /clickActionSubmit|clickExactActionSubmit|\.click\(/);
});

test("network default remains pending until the action form is ready", () => {
  const missingForm = createNetworkPassSelector({hasLiveActionForm: false});
  const missingOption = createNetworkPassSelector({optionExists: false});

  assert.equal(missingForm.select(), false);
  assert.equal(missingForm.pending(), true);
  assert.equal(missingOption.select(), false);
  assert.equal(missingOption.pending(), true);
  assert.deepEqual(missingForm.mirrorSelections, []);
  assert.deepEqual(missingOption.mirrorSelections, []);
});

test("network default remains successful when the mirrored Pass option is absent", () => {
  const selector = createNetworkPassSelector({mirrorOptionExists: false});

  assert.equal(selector.select(), true);
  assert.equal(selector.pending(), false);
  assert.equal(selector.selectionCount(), 1);
  assert.deepEqual(selector.mirrorSelections, ["Pass for this generation"]);
});

test("network default preserves Pass when Autoqueue is disabled", () => {
  const selector = createNetworkPassSelector({
    autoProcess: false,
    queue: [{type: "playedAction", cardName: "Bio Printing Facility"}],
  });

  assert.equal(selector.select(), true);
  assert.equal(selector.pending(), false);
  assert.equal(selector.selectionCount(), 1);
  assert.deepEqual(selector.mirrorSelections, ["Pass for this generation"]);
});

test("network default preserves Pass when Autoqueue has no pending work", () => {
  const selector = createNetworkPassSelector({autoProcess: true, queue: []});

  assert.equal(selector.select(), true);
  assert.equal(selector.pending(), false);
  assert.equal(selector.selectionCount(), 1);
  assert.deepEqual(selector.mirrorSelections, ["Pass for this generation"]);
});

test("network default suppresses Pass while Autoqueue has pending work", () => {
  const selector = createNetworkPassSelector({
    autoProcess: true,
    queue: [{type: "playedAction", cardName: "Bio Printing Facility"}],
  });

  assert.equal(selector.select(), true);
  assert.equal(selector.pending(), false);
  assert.equal(selector.selectionCount(), 0);
  assert.deepEqual(selector.mirrorSelections, []);
});

test("network default suppresses Pass while queue execution is in flight", () => {
  const selector = createNetworkPassSelector({queueExecutionInFlight: true});

  assert.equal(selector.select(), true);
  assert.equal(selector.pending(), false);
  assert.equal(selector.selectionCount(), 0);
  assert.deepEqual(selector.mirrorSelections, []);
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

test("queued viewport anchoring excludes immediate execution and visible Actions", () => {
  const offscreen = createQueuedViewportAnchorHarness();
  assert.equal(offscreen.begin("immediate"), false);
  assert.equal(offscreen.state(), null);
  assert.equal(offscreen.begin("automatic"), true);
  assert.equal(offscreen.state()?.candidates.length, 1);

  const visible = createQueuedViewportAnchorHarness({
    actionsTop: -50,
    actionsBottom: 100,
  });
  assert.equal(visible.begin("manual"), false);
  assert.equal(visible.state(), null);
  assert.deepEqual(visible.scrollCalls, []);

  const below = createQueuedViewportAnchorHarness({
    actionsTop: 900,
    actionsBottom: 1100,
  });
  assert.equal(below.begin("automatic"), false);
  assert.equal(below.state(), null);
});

test("queued viewport anchoring corrects residual movement and falls back to Actions", () => {
  const candidate = createQueuedViewportAnchorHarness();
  assert.equal(candidate.begin("automatic"), true);
  candidate.candidateRect.top += 35;
  candidate.candidateRect.bottom += 35;
  assert.equal(candidate.maintain(), true);
  assert.deepEqual(candidate.scrollCalls, [{top: 35, left: 0, behavior: "auto"}]);
  assert.equal(candidate.maintain(), true);
  assert.equal(candidate.scrollCalls.length, 1);

  const fallback = createQueuedViewportAnchorHarness();
  assert.equal(fallback.begin("manual"), true);
  fallback.candidate.isConnected = false;
  fallback.actionsRect.top -= 45;
  fallback.actionsRect.bottom -= 45;
  assert.equal(fallback.maintain(), true);
  assert.deepEqual(fallback.scrollCalls, [{top: -45, left: 0, behavior: "auto"}]);
});

test("queued viewport anchoring yields to user scrolling and releases after settling", () => {
  const user = createQueuedViewportAnchorHarness();
  assert.equal(user.begin("automatic"), true);
  user.startInput();
  user.listeners.get("wheel")({type: "wheel", isTrusted: true});
  assert.equal(user.state(), null);

  const settled = createQueuedViewportAnchorHarness();
  assert.equal(settled.begin("manual"), true);
  assert.equal(settled.markRelease(), true);
  assert.equal(settled.runLastTimer(), true);
  assert.equal(settled.state(), null);
  assert.match(domUpdateSource, /refreshQueuedExecutionViewportAnchor\(\)/);
  assert.match(queueUiUpdateSource, /refreshQueuedExecutionViewportAnchor\(\)/);
  assert.match(
    playerViewQueueRearmSource,
    /markQueuedExecutionViewportAnchorForRelease\(\)/,
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

test("Actions mirror checks exact Pass locally without activating either form", () => {
  const passGroup = {};
  const nestedGroup = {};
  let clickCount = 0;
  const createRadio = (group, checked = false) => ({
    checked,
    click() {
      clickCount += 1;
    },
    closest(selector) {
      assert.equal(selector, ".wf-options");
      return group;
    },
    disabled: false,
  });
  const other = createRadio(passGroup, true);
  const pass = createRadio(passGroup);
  const nested = createRadio(nestedGroup, true);
  const labels = [
    {text: "Perform an action", radio: other},
    {text: "Pass for this generation", radio: pass},
    {text: "Nested choice", radio: nested},
  ].map(({text, radio}) => ({
    querySelector(selector) {
      if (selector === "input[type='radio']") return radio;
      assert.equal(selector, "span");
      return {textContent: text};
    },
  }));
  const mirror = {
    querySelectorAll(selector) {
      if (selector === "label.form-radio") return labels;
      assert.equal(selector, "label.form-radio input[type='radio']");
      return [other, pass, nested];
    },
  };
  const executor = createActionsMirrorExecutor(mirror);

  assert.equal(
    executor.checkActionsMirrorOption("Pass for this generation"),
    true,
  );
  assert.equal(pass.checked, true);
  assert.equal(other.checked, false);
  assert.equal(nested.checked, true);
  assert.equal(clickCount, 0);
  assert.doesNotMatch(
    actionsMirrorSource.slice(
      actionsMirrorSource.indexOf("const checkActionsMirrorOption"),
    ),
    /\.click\(|dispatchBubbledEvent/,
  );
});

test("Actions mirror ignores missing, disabled, and ambiguous Pass options", () => {
  assert.equal(
    createActionsMirrorExecutor().checkActionsMirrorOption(
      "Pass for this generation",
    ),
    false,
  );

  const createMirror = ({disabled = false, duplicate = false} = {}) => {
    const radio = {
      checked: false,
      disabled,
      closest: () => ({}),
    };
    const label = {
      querySelector(selector) {
        if (selector === "input[type='radio']") return radio;
        return {textContent: "Pass for this generation"};
      },
    };
    return {
      radio,
      root: {
        querySelectorAll(selector) {
          if (selector === "label.form-radio") {
            return duplicate ? [label, label] : [label];
          }
          return [radio];
        },
      },
    };
  };

  for (const candidate of [
    createMirror({disabled: true}),
    createMirror({duplicate: true}),
  ]) {
    assert.equal(
      createActionsMirrorExecutor(candidate.root).checkActionsMirrorOption(
        "Pass for this generation",
      ),
      false,
    );
    assert.equal(candidate.radio.checked, false);
  }
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
  assert.deepEqual(executor.rememberedSubmits, []);
  assert.equal(interaction.preventDefaultCount(), 1);
  assert.equal(interaction.stopImmediatePropagationCount(), 1);
});

test("trusted Actions mirror clicks offer the canonical source for learning once", () => {
  let clickCount = 0;
  const source = {
    click() {
      clickCount += 1;
    },
    isConnected: true,
  };
  const keyed = {getAttribute: () => "5"};
  const target = {
    closest(selector) {
      if (selector === "[data-tfmars420-actions-source]") return keyed;
      if (selector === "input, textarea, select") return null;
      return null;
    },
  };
  const mirror = {contains: (candidate) => candidate === keyed};
  const executor = createActionsMirrorExecutor();
  const interaction = createMirrorEvent("click", target, {isTrusted: true});

  assert.equal(
    executor.proxyActionsMirrorClick(
      interaction.event,
      mirror,
      new Map([["5", source]]),
    ),
    true,
  );
  assert.deepEqual(executor.rememberedSubmits, [source]);
  assert.equal(clickCount, 1);
  assert.match(
    actionsMirrorSource,
    /event\.isTrusted === true[\s\S]*captureRememberedQuickChoiceSubmit\(source\)[\s\S]*source\.click\(\)/,
  );
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
  await assert.rejects(
    noConfirm.attempt(),
    (error) =>
      error.code === "queue-action-deferred" &&
      error.expectedSubmit === "Confirm",
  );
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

test("queued card selection confirms direct and ancestor-label inputs", async () => {
  for (const inputLocation of ["direct", "ancestor"]) {
    const selection = createActionCardSelection({
      inputLocation,
      includeNeighbor: true,
    });

    await selection.select();

    assert.equal(selection.input.checked, true);
    assert.equal(selection.clickCount(), 1);
    assert.equal(selection.neighborInput.checked, false);
    assert.equal(selection.probeCount(), 2);
    assert.deepEqual(selection.waits, []);
  }
});

test("queued card selection waits for its exact enabled input", async () => {
  const selection = createActionCardSelection({
    inputLocation: "ancestor",
    inputAfterProbe: 3,
  });

  await selection.select();

  assert.equal(selection.input.checked, true);
  assert.equal(selection.clickCount(), 1);
  assert.equal(selection.probeCount(), 5);
  assert.deepEqual(selection.waits, [25, 25, 25]);
});

test("queued card selection never toggles an already-selected input", async () => {
  const selection = createActionCardSelection({checked: true});

  await selection.select();

  assert.equal(selection.input.checked, true);
  assert.equal(selection.clickCount(), 0);
});

test("queued card selection confirms the current input after Vue replaces it", async () => {
  const confirmed = createActionCardSelection({
    replaceInputAfterClick: true,
    replacementChecked: true,
  });

  await confirmed.select();

  assert.equal(confirmed.input.isConnected, false);
  assert.equal(confirmed.replacementInput.checked, true);

  const unconfirmed = createActionCardSelection({
    replaceInputAfterClick: true,
    replacementChecked: false,
  });
  await assert.rejects(unconfirmed.select(), (error) => {
    assert.equal(error.code, "queue-action-deferred");
    assert.equal(error.reason, "card-selection-not-confirmed");
    return true;
  });
});

test("queued card selection defers unavailable and unconfirmed inputs", async () => {
  for (const selection of [
    createActionCardSelection({disabled: true}),
    createActionCardSelection({
      includeMatchingCard: false,
      includeNeighbor: true,
    }),
  ]) {
    await assert.rejects(selection.select(), (error) => {
      assert.equal(error.code, "queue-action-deferred");
      assert.equal(error.reason, "card-selection-not-ready");
      assert.equal(error.expectedCard, "Queued Card");
      return true;
    });
    assert.equal(selection.clickCount(), 0);
    assert.equal(selection.probeCount(), 41);
    assert.deepEqual(selection.waits, Array(40).fill(25));
  }

  const unconfirmed = createActionCardSelection({activationRegisters: false});
  await assert.rejects(unconfirmed.select(), (error) => {
    assert.equal(error.code, "queue-action-deferred");
    assert.equal(error.reason, "card-selection-not-confirmed");
    assert.equal(error.expectedCard, "Queued Card");
    return true;
  });
  assert.equal(unconfirmed.clickCount(), 1);
  assert.equal(unconfirmed.input.checked, false);
});

test("queued card selection uses only confirmed native input activation", () => {
  assert.doesNotMatch(cardSelectionSource, /input\.checked\s*=\s*true/);
  assert.doesNotMatch(cardSelectionSource, /dispatchBubbledEvent/);
  assert.doesNotMatch(cardSelectionSource, /cardBox\.dispatchEvent|new MouseEvent/);
  assert.doesNotMatch(cardSelectionSource, /requireEnabledInput/);
  assert.match(
    cardSelectionSource,
    /if \(!candidate\.input\.checked\)[\s\S]*candidate\.input\.click\(\)/,
  );
  assert.match(
    cardSelectionSource,
    /await nextFrame\(\)[\s\S]*current\.input\.checked[\s\S]*"card-selection-not-confirmed"/,
  );
});

test("queued action submission clicks only the requested exact label", () => {
  let takeActionClicks = 0;
  let passClicks = 0;
  const submit = createActionSubmit([
    {
      disabled: false,
      textContent: "Pass",
      classList: {contains: () => true},
      click() {
        passClicks += 1;
      },
    },
    {
      disabled: false,
      textContent: "Take action",
      classList: {contains: () => true},
      click() {
        takeActionClicks += 1;
      },
    },
  ]);

  submit("Take action");
  assert.equal(takeActionClicks, 1);
  assert.equal(passClicks, 0);
});

test("queued project submission clicks the exact Play card label", () => {
  let playCardClicks = 0;
  const submit = createActionSubmit([
    {
      disabled: false,
      textContent: "Play card",
      classList: {contains: () => true},
      click() {
        playCardClicks += 1;
      },
    },
  ]);

  submit("Play card");
  assert.equal(playCardClicks, 1);
});

test("queued action submission never falls back to Pass", () => {
  let passClicks = 0;
  const submit = createActionSubmit([
    {
      disabled: false,
      textContent: "Pass",
      classList: {contains: () => true},
      click() {
        passClicks += 1;
      },
    },
  ]);

  assert.throws(
    () => submit("Take action"),
    /missing exact action submit button: Take action/,
  );
  assert.equal(passClicks, 0);
});

test("queued action submission rejects ambiguous exact controls", () => {
  let clickCount = 0;
  const button = () => ({
    disabled: false,
    textContent: "Take action",
    classList: {contains: () => true},
    click() {
      clickCount += 1;
    },
  });
  const submit = createActionSubmit([button(), button()]);

  assert.throws(
    () => submit("Take action"),
    /ambiguous exact action submit buttons: Take action/,
  );
  assert.equal(clickCount, 0);
});

test("explicit Pass submission accepts its exact alternate label", () => {
  let passClicks = 0;
  const submit = createActionSubmit([
    {
      disabled: false,
      value: "Pass for this generation",
      classList: {contains: () => true},
      click() {
        passClicks += 1;
      },
    },
  ]);

  submit("Pass", ["Pass for this generation"]);
  assert.equal(passClicks, 1);
});

test("automatic Pass waits briefly for its exact submit control", async () => {
  let passClicks = 0;
  const button = {
    disabled: false,
    value: "Pass for this generation",
    click() {
      passClicks += 1;
    },
  };
  const waitingSubmit = createWaitingActionSubmit((probe) =>
    probe < 3 ? [] : [button],
  );

  assert.equal(
    await waitingSubmit.submit("Pass", ["Pass for this generation"]),
    true,
  );

  assert.equal(waitingSubmit.probeCount(), 4);
  assert.deepEqual(waitingSubmit.waits, [25, 25, 25]);
  assert.equal(passClicks, 1);
});

test("an immediately available exact submit is clicked without waiting", async () => {
  let clickCount = 0;
  const waitingSubmit = createWaitingActionSubmit(() => [
    {
      disabled: false,
      textContent: "Take action",
      click() {
        clickCount += 1;
      },
    },
  ]);

  assert.equal(await waitingSubmit.submit("Take action"), true);
  assert.equal(waitingSubmit.probeCount(), 1);
  assert.deepEqual(waitingSubmit.waits, []);
  assert.equal(clickCount, 1);
});

test("automatic Pass stops after its bounded submit wait", async () => {
  const waitingSubmit = createWaitingActionSubmit(() => []);

  await assert.rejects(
    waitingSubmit.submit("Pass", ["Pass for this generation"]),
    (error) => {
      assert.match(
        error.message,
        /missing exact action submit button after 1000ms: Pass/,
      );
      assert.equal(error.code, "queue-action-deferred");
      assert.equal(error.reason, "exact-submit-not-ready");
      assert.equal(error.expectedSubmit, "Pass");
      assert.deepEqual(error.alternateSubmitTexts, ["Pass for this generation"]);
      return true;
    },
  );

  assert.equal(waitingSubmit.probeCount(), 41);
  assert.deepEqual(waitingSubmit.waits, Array(40).fill(25));
});

test("optional exact submit returns false after the same bounded wait", async () => {
  const waitingSubmit = createWaitingActionSubmit(() => []);

  assert.equal(
    await waitingSubmit.submit("Confirm", [], {required: false}),
    false,
  );

  assert.equal(waitingSubmit.probeCount(), 41);
  assert.deepEqual(waitingSubmit.waits, Array(40).fill(25));
});

test("optional exact submit rejects ambiguity without waiting or clicking", async () => {
  let passClicks = 0;
  const button = () => ({
    disabled: false,
    textContent: "Pass",
    click() {
      passClicks += 1;
    },
  });
  const waitingSubmit = createWaitingActionSubmit(() => [button(), button()]);

  await assert.rejects(
    waitingSubmit.submit("Pass", ["Pass for this generation"], {required: false}),
    /ambiguous exact action submit buttons: Pass/,
  );

  assert.equal(waitingSubmit.probeCount(), 1);
  assert.deepEqual(waitingSubmit.waits, []);
  assert.equal(passClicks, 0);
});

test("deferred queue execution resumes only for the same head and exact submit", () => {
  const queuedItem = {type: "projectCard", cardName: "Queued Project"};
  const exact = createDeferredQueueResume({
    queuedItem,
    buttons: [{disabled: false, textContent: "Play card"}],
  });
  exact.remember(queuedItem, {
    expectedSubmit: "Play card",
    alternateSubmitTexts: [],
  });

  assert.equal(exact.resume(), true);
  assert.equal(exact.scheduleCount(), 1);
  assert.deepEqual(exact.state(), {
    queueDeferredSubmit: null,
    queueExecutionAttempted: false,
    queueExecutionError: "",
  });

  for (const blocked of [
    createDeferredQueueResume({queuedItem, buttons: []}),
    createDeferredQueueResume({
      queuedItem,
      buttons: [
        {disabled: false, textContent: "Play card"},
        {disabled: false, textContent: "Play card"},
      ],
    }),
    createDeferredQueueResume({
      queuedItem: {type: "projectCard", cardName: "Different Project"},
      buttons: [{disabled: false, textContent: "Play card"}],
    }),
    createDeferredQueueResume({
      queuedItem,
      playerId: "player-2",
      buttons: [{disabled: false, textContent: "Play card"}],
    }),
  ]) {
    blocked.remember(queuedItem, {
      expectedSubmit: "Play card",
      alternateSubmitTexts: [],
    });
    assert.equal(blocked.resume(), false);
    assert.equal(blocked.scheduleCount(), 0);
    assert.equal(blocked.state().queueExecutionAttempted, true);
  }
});

test("relevant Terraforming Mars DOM mutations probe deferred submit readiness", () => {
  assert.match(
    source.slice(
      source.indexOf("const startTerraformingMarsDomObserver"),
      source.indexOf("function removeTimeWarpUi"),
    ),
    /if \(!shouldUpdate\) return;\s*maybeResumeDeferredQueueExecution\(\)/,
  );
});

test("selection-driven exact submits use the bounded wait", async () => {
  assert.deepEqual(await executeQueuedCard("playedAction"), [
    "select:Perform an action from a played card",
    "frame",
    "select-card",
    "frame",
    "submit:Take action",
  ]);
  assert.deepEqual(await executeQueuedCard("projectCard"), [
    "select:Play project card",
    "frame",
    "select-card",
    "frame",
    "submit:Play card",
  ]);
  assert.match(passActionSource, /await waitForActionSubmit\("Pass"/);
  assert.match(
    executeQueuedItemSource,
    /await selectActionCard\(item, actionCardSelector\(\)\);[\s\S]*await nextFrame\(\);[\s\S]*await waitForActionSubmit\("Take action"\)/,
  );
  assert.match(
    executeQueuedItemSource,
    /await selectActionCard\(item, actionCardSelector\(\)\);[\s\S]*await nextFrame\(\);[\s\S]*await waitForActionSubmit\("Play card"\)/,
  );
  assert.match(
    executeQueuedItemSource,
    /if \(item\?\.type === "cardTarget"\)[\s\S]*await selectActionCard\(item, actionCardSelector\(\)\);[\s\S]*clickCardTargetSubmit\(\)/,
  );
  assert.match(finalGreenerySkipSource, /await waitForActionSubmit\("Confirm"\)/);
  assert.match(
    powerPlantAttemptSource,
    /return await waitForActionSubmit\("Confirm"\)/,
  );
  assert.doesNotMatch(executeQueuedItemSource, /clickActionSubmit\("(?:Take action|Play card)"\)/);
  assert.doesNotMatch(cardTargetSubmitSource, /waitForActionSubmit/);
  assert.doesNotMatch(radioOptionExecutionSource, /waitForActionSubmit/);
  assert.doesNotMatch(researchPurchaseSkipSource, /waitForActionSubmit/);
  assert.doesNotMatch(purchasePaymentSubmitSource, /waitForActionSubmit/);
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

test("indexed-radio leaf submission offers the canonical submit for learning before click", () => {
  const events = [];
  const button = {
    disabled: false,
    click() {
      events.push("click");
    },
  };
  const submit = createIndexedRadioSubmit([button], {
    capture(candidate) {
      events.push("capture");
      assert.equal(candidate, button);
      return true;
    },
  });

  submit();

  assert.deepEqual(events, ["capture", "click"]);
});

test("indexed-radio execution preserves armed learning while other follow-ups clear it", async () => {
  const radio = createQueueExecutor([]);
  assert.equal(
    radio.executeQueueItemNow({
      type: "radioOption",
      optionIndex: 2,
      label: "radio option 2",
    }),
    true,
  );

  const quick = createQueueExecutor([]);
  assert.equal(
    quick.executeQueueItemNow({
      type: "quickChoice",
      optionText: "Add 1 microbe to this card",
      label: "quick choice",
    }),
    true,
  );

  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(radio.learningClearCount(), 0);
  assert.equal(quick.learningClearCount(), 1);
});

test("failed indexed-radio execution clears its learning association", async () => {
  const radio = createQueueExecutor([], {reject: true});
  assert.equal(
    radio.executeQueueItemNow({
      type: "radioOption",
      optionIndex: 2,
      label: "radio option 2",
    }),
    true,
  );

  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(radio.learningClearCount(), 1);
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
    stagedPlayedActionLearning: null,
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
    stagedPlayedActionLearning: null,
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
      stagedPlayedActionLearning: null,
    });
  }
});

test("native played-action choices stage until the player input advances", () => {
  assert.match(
    source,
    /takeConfirmedStagedPlayedActionQuickChoice\(playerView\)[\s\S]*persistPlayedActionQuickChoice\([\s\S]*confirmedQuickChoice\.choice/,
  );
  const tracker = createPlayedActionLearningTracker();
  const learning = {
    playerId: "player-1",
    cardKey: "mohole-lake",
    cardName: "Mohole Lake",
  };
  const firstChoice = {
    promptText: "Select card to add microbe or animal",
    targetCardText: "Regolith Eaters",
  };
  const retryChoice = {
    promptText: "Select card to add microbe or animal",
    targetCardText: "Fish",
  };

  assert.equal(tracker.stage(learning, firstChoice), true);
  assert.equal(tracker.stage(learning, retryChoice), true);
  assert.deepEqual(tracker.state().stagedPlayedActionLearning?.choice, retryChoice);
  assert.equal(
    tracker.takeConfirmed({
      id: "player-1",
      waitingFor: {type: "or", title: "Select one option", options: []},
    }),
    null,
  );

  const confirmed = tracker.takeConfirmed({
    id: "player-1",
    waitingFor: {type: "or", title: "Take your next action", options: []},
  });
  assert.deepEqual(confirmed?.choice, retryChoice);
  assert.equal(tracker.state().stagedPlayedActionLearning, null);

  tracker.stage(learning, firstChoice);
  assert.equal(
    tracker.takeConfirmed({
      id: "player-2",
      waitingFor: {type: "or", title: "Take your next action", options: []},
    }),
    null,
  );
  assert.deepEqual(tracker.state(), {
    pendingPlayedActionLearning: null,
    armedPlayedActionLearning: null,
    stagedPlayedActionLearning: null,
  });
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

test("confirmed played-action choices persist once and audit only new memories", () => {
  const harness = createQuickChoicePersistenceHarness();
  const learning = {
    playerId: "player-1",
    cardKey: "mohole-lake",
    cardName: "Mohole Lake",
  };
  const choice = {
    promptText: "Select card to add microbe or animal",
    targetCardText: "Regolith Eaters",
  };

  assert.equal(harness.persist(learning, choice), true);
  assert.equal(harness.persist(learning, choice), false);
  assert.deepEqual(harness.session.rememberedQuickChoices["mohole-lake"], [choice]);
  assert.equal(harness.updateCount(), 2);
  assert.deepEqual(harness.auditEvents, [
    {
      eventName: "user.card.quick-choice.learn",
      details: {
        cardName: "Mohole Lake",
        promptText: "Select card to add microbe or animal",
        hasTarget: true,
      },
    },
  ]);
  assert.equal(
    harness.persist({...learning, playerId: "other-player"}, choice),
    false,
  );
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
  assert.match(
    quickChoiceCaptureSource,
    /stagePlayedActionQuickChoice\(learning, choice\)/,
  );
  assert.doesNotMatch(quickChoiceCaptureSource, /rememberQuickChoice\(/);
  assert.match(
    quickChoiceListenerSource,
    /document\.addEventListener\("click", handleRememberedQuickChoiceSubmit, true\)/,
  );
});

test("trusted mirror submission uses canonical capture without accepting synthetic document clicks", () => {
  const mirrored = createQuickChoiceCaptureHarness({
    optionText: "Remove 2 microbes to raise oxygen level 1 step",
  });

  assert.equal(mirrored.capture(mirrored.event.target), true);
  assert.deepEqual(mirrored.stagedChoices[0]?.choice, {
    optionText: "Remove 2 microbes to raise oxygen level 1 step",
  });

  const synthetic = createQuickChoiceCaptureHarness({
    optionText: "Remove 2 microbes to raise oxygen level 1 step",
    trusted: false,
  });
  assert.equal(synthetic.handle(synthetic.event), false);
  assert.deepEqual(synthetic.stagedChoices, []);

  const playback = createQuickChoiceCaptureHarness({
    optionText: "Remove 2 microbes to raise oxygen level 1 step",
    playbackActive: true,
  });
  assert.equal(playback.capture(playback.event.target), false);
  assert.deepEqual(playback.stagedChoices, []);
});

test("remembered-choice capture stages leaf and exact card-target recipes", () => {
  const leaf = createQuickChoiceCaptureHarness({
    optionText: "  Remove 1 asteroid   on this card to gain 3 titanium  ",
  });
  assert.equal(leaf.handle(leaf.event), true);
  assert.deepEqual(leaf.stagedChoices, [
    {
      learning: {
        playerId: "player-1",
        cardKey: "astrodrill",
        cardName: "AstroDrill",
      },
      choice: {
        optionText: "Remove 1 asteroid on this card to gain 3 titanium",
      },
    },
  ]);
  assert.equal(leaf.armed(), null);

  const compound = createQuickChoiceCaptureHarness({
    optionText: "Select card to add 1 asteroid",
    targetCardText: "AstroDrill",
  });
  assert.equal(compound.handle(compound.event), true);
  assert.deepEqual(compound.stagedChoices, [
    {
      learning: {
        playerId: "player-1",
        cardKey: "astrodrill",
        cardName: "AstroDrill",
      },
      choice: {
        optionText: "Select card to add 1 asteroid",
        targetCardText: "AstroDrill",
      },
    },
  ]);
});

test("remembered-choice capture stages direct card-target recipes", () => {
  const direct = createQuickChoiceCaptureHarness({
    directPromptText: "  Select card   to add microbe or animal ",
    targetCardText: "Regolith Eaters",
  });

  assert.equal(direct.handle(direct.event), true);
  assert.deepEqual(direct.stagedChoices, [
    {
      learning: {
        playerId: "player-1",
        cardKey: "astrodrill",
        cardName: "AstroDrill",
      },
      choice: {
        promptText: "Select card to add microbe or animal",
        targetCardText: "Regolith Eaters",
      },
    },
  ]);
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
    assert.deepEqual(blocked.stagedChoices, []);
    assert.notEqual(blocked.armed(), null);
  }
});

test("remembered-choice capture ignores nested checked radios and rejects synthetic playback", () => {
  const nested = createQuickChoiceCaptureHarness({
    optionText: "Gain a standard resource",
    nestedCheckedOptionText: "Gain 1 titanium",
  });
  assert.equal(nested.handle(nested.event), true);
  assert.deepEqual(nested.stagedChoices[0]?.choice, {
    optionText: "Gain a standard resource",
  });

  for (const blocked of [
    createQuickChoiceCaptureHarness({trusted: false}),
    createQuickChoiceCaptureHarness({playbackActive: true}),
  ]) {
    assert.equal(blocked.handle(blocked.event), false);
    assert.deepEqual(blocked.stagedChoices, []);
    assert.notEqual(blocked.armed(), null);
  }
});

test("card-target execution derives Mohole Lake direct and nested quick choices", () => {
  const direct = createCardTargetLearningHarness();
  assert.deepEqual(direct.candidate(direct.item), {
    playerId: "player-1",
    cardKey: "mohole-lake",
    cardName: "Mohole Lake",
    choice: {
      promptText: "Select card to add microbe or animal",
      targetCardText: "Regolith Eaters",
    },
  });

  const nested = createCardTargetLearningHarness({direct: false});
  assert.deepEqual(nested.candidate(nested.item), {
    playerId: "player-1",
    cardKey: "mohole-lake",
    cardName: "Mohole Lake",
    choice: {
      optionText: "Select card to add 1 microbe",
      targetCardText: "Regolith Eaters",
    },
  });
});

test("card-target learning rejects stale, ambiguous, disabled, and playback targets", () => {
  for (const harness of [
    createCardTargetLearningHarness({duplicateTarget: true}),
    createCardTargetLearningHarness({targetDisabled: true}),
    createCardTargetLearningHarness({playbackActive: true}),
    createCardTargetLearningHarness({hasLiveForm: false}),
    createCardTargetLearningHarness({takeNextAction: true}),
    createCardTargetLearningHarness({hasPass: true}),
  ]) {
    assert.equal(harness.candidate(harness.item), null);
  }
});

test("remembered quick-choice mode prefers the matching live follow-up", () => {
  const identity = {key: "regolith-eaters", slug: "regolith-eaters", name: "Regolith Eaters"};
  const action = {
    type: "playedAction",
    cardKey: "regolith-eaters",
    cardSlug: "regolith-eaters",
    cardName: "Regolith Eaters",
  };
  const live = createQuickChoiceModeHarness({
    armed: {
      playerId: "player-1",
      cardKey: "regolith-eaters",
      cardName: "Regolith Eaters",
    },
  });

  assert.equal(live.matches({
    cardKey: "regolith-eaters",
    cardName: "Regolith Eaters",
  }, identity), true);
  assert.equal(live.mode({queue: []}, identity), "live");
  assert.equal(live.mode({queue: [action]}, identity), "live");

  const nameFallback = createQuickChoiceModeHarness({
    armed: {
      playerId: "player-1",
      cardKey: "old-regolith-key",
      cardName: "  Regolith Eaters ",
    },
  });
  assert.equal(nameFallback.mode({queue: []}, identity), "live");

  const queued = createQuickChoiceModeHarness();
  assert.equal(queued.mode({queue: [action]}, identity), "queued");
  assert.equal(queued.mode({queue: []}, identity), null);
});

test("live quick-choice mode rejects stale, top-level, and Pass inputs", () => {
  const identity = {key: "regolith-eaters", slug: "regolith-eaters", name: "Regolith Eaters"};
  const armed = {
    playerId: "player-1",
    cardKey: "regolith-eaters",
    cardName: "Regolith Eaters",
  };

  for (const harness of [
    createQuickChoiceModeHarness({armed: null}),
    createQuickChoiceModeHarness({
      armed: {...armed, cardKey: "nitrite-reducing-bacteria", cardName: "Nitrite Reducing Bacteria"},
    }),
    createQuickChoiceModeHarness({armed, hasLiveForm: false}),
    createQuickChoiceModeHarness({armed, takeNextAction: true}),
    createQuickChoiceModeHarness({armed, hasPass: true}),
  ]) {
    assert.equal(harness.mode({queue: []}, identity), null);
  }
});

test("live quick controls survive an action card becoming unavailable", () => {
  assert.match(
    playedToolsSource,
    /if \(!canQueueAction && !canQueueTarget && !quickChoicePresentation\)/,
  );
  assert.match(
    playedToolsSource,
    /renderRememberedQuickChoiceTools\(tools, session, identity, quickChoicePresentation\)/,
  );
});

test("quick-choice activation executes live inputs and appends queued inputs", () => {
  const identity = {key: "regolith-eaters", name: "Regolith Eaters"};
  const choice = {optionText: "Add 1 microbe to this card"};
  const action = {
    type: "playedAction",
    cardKey: "regolith-eaters",
    cardName: "Regolith Eaters",
  };

  const live = createQuickChoiceActivationHarness({
    initialQueue: [{type: "pass"}],
    modes: ["live"],
  });
  assert.equal(live.activate(choice, identity), true);
  assert.deepEqual(live.session.queue, [{type: "pass"}]);
  assert.deepEqual(live.executions, [
    {
      item: {type: "quickChoice", optionText: "Add 1 microbe to this card"},
      options: {executionSource: "immediate"},
    },
  ]);
  assert.equal(live.updateCount(), 0);
  assert.equal(live.auditEvents[0]?.eventName, "user.card.quick-choice.execute");

  const queued = createQuickChoiceActivationHarness({
    initialQueue: [action],
    modes: ["queued", "queued"],
  });
  assert.equal(queued.activate(choice, identity), true);
  assert.deepEqual(queued.session.queue, [
    action,
    {type: "quickChoice", optionText: "Add 1 microbe to this card"},
  ]);
  assert.deepEqual(queued.executions, []);
  assert.equal(queued.updateCount(), 1);
  assert.equal(queued.auditEvents[0]?.eventName, "user.card.quick-choice.enqueue");
});

test("quick-choice activation rechecks mode and never persists an orphan", () => {
  const identity = {key: "regolith-eaters", name: "Regolith Eaters"};
  const choice = {optionText: "Add 1 microbe to this card"};

  const stale = createQuickChoiceActivationHarness({
    initialQueue: [{type: "pass"}],
    modes: [null],
  });
  assert.equal(stale.activate(choice, identity), false);
  assert.deepEqual(stale.session.queue, [{type: "pass"}]);
  assert.deepEqual(stale.executions, []);
  assert.equal(stale.updateCount(), 0);

  const racedQueue = createQuickChoiceActivationHarness({
    initialQueue: [{type: "playedAction", cardKey: "regolith-eaters"}],
    modes: ["queued", null],
  });
  assert.equal(racedQueue.activate(choice, identity), false);
  assert.equal(racedQueue.session.queue.length, 1);

  const failedLive = createQuickChoiceActivationHarness({
    initialQueue: [{type: "pass"}],
    modes: ["live"],
    immediateResult: false,
  });
  assert.equal(failedLive.activate(choice, identity), false);
  assert.deepEqual(failedLive.session.queue, [{type: "pass"}]);
  assert.equal(failedLive.updateCount(), 0);
});

test("quick buttons support queued and live follow-up modes", () => {
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
  assert.match(
    quickChoiceUiSource,
    /rememberedQuickChoiceRenderMode\(currentSession, identity\)/,
  );
  assert.match(
    quickChoiceUiSource,
    /executeQueueItemNow\(item, \{ executionSource: "immediate" \}\)/,
  );
  assert.match(quickChoiceUiSource, /draft\.queue\.push\(item\)/);
  assert.doesNotMatch(quickChoiceUiSource, /enqueueOrExecuteNow/);
  assert.match(source, /\.tfmars420-quick-choice-list[\s\S]*flex: 1 0 100%/);
});

test("quick actions are constrained to their rendered card width", () => {
  const syncCardToolsWidth = Function(
    `"use strict"; ${cardToolsWidthSource}; return syncCardToolsWidth;`,
  )();
  const properties = new Map();
  const tools = {
    style: {
      removeProperty(name) {
        properties.delete(name);
      },
      setProperty(name, value) {
        properties.set(name, value);
      },
    },
  };
  const cardContainer = {offsetWidth: 248};
  const cardBox = {
    classList: {contains: () => false},
    querySelector(selector) {
      assert.equal(selector, ".card-container");
      return cardContainer;
    },
  };

  assert.equal(syncCardToolsWidth(tools, cardBox), true);
  assert.equal(properties.get("--tfmars420-card-tools-width"), "248px");
  cardContainer.offsetWidth = 224;
  assert.equal(syncCardToolsWidth(tools, cardBox), true);
  assert.equal(properties.get("--tfmars420-card-tools-width"), "224px");
  cardContainer.offsetWidth = 0;
  assert.equal(syncCardToolsWidth(tools, cardBox), false);
  assert.equal(properties.has("--tfmars420-card-tools-width"), false);

  assert.match(source, /const syncCardToolsWidth = \(tools, cardBox\) =>/);
  assert.match(handToolsSource, /syncCardToolsWidth\(tools, cardBox\)/);
  assert.match(playedToolsSource, /syncCardToolsWidth\(tools, cardBox\)/);
  assert.match(
    cardToolsCssSource,
    /width: min\(100%, var\(--tfmars420-card-tools-width, 100%\)\)/,
  );
  assert.match(
    cardToolsCssSource,
    /\.tfmars420-enqueue-tools \.tfmars420-quick-choice-list \{[\s\S]*?min-width: 0;/,
  );
  assert.match(
    cardToolsCssSource,
    /\.tfmars420-enqueue-tools \.tfmars420-quick-choice-button \{[\s\S]*?box-sizing: border-box;[\s\S]*?max-width: 100%;[\s\S]*?overflow-wrap: anywhere;[\s\S]*?width: 100%;/,
  );
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
    "frame",
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
    "frame",
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

test("quick card targets use native checkbox activation before submit", async () => {
  const targetInput = {
    type: "checkbox",
    checked: false,
    disabled: false,
    isConnected: true,
    click() {
      this.checked = !this.checked;
    },
  };
  const harness = createExactQuickChoiceHarness({
    directPromptTexts: ["Select card to add an asteroid"],
    targetCards: [{name: "Main Belt Asteroids", input: targetInput}],
  });

  await harness.execute({
    type: "quickChoice",
    promptText: "Select card to add an asteroid",
    targetCardText: "Main Belt Asteroids",
  });

  assert.equal(targetInput.checked, true);
  assert.equal(harness.events.includes("submit:0"), true);
});

test("quick card targets reject an unchecked Vue replacement before submit", async () => {
  const replacementInput = {
    type: "radio",
    checked: false,
    disabled: false,
    isConnected: true,
    click() {
      assert.fail("replacement input must not be activated");
    },
  };
  const targetCard = {name: "Main Belt Asteroids"};
  targetCard.input = {
    type: "radio",
    checked: false,
    disabled: false,
    isConnected: true,
    click() {
      this.checked = true;
      this.isConnected = false;
      targetCard.input = replacementInput;
    },
  };
  const harness = createExactQuickChoiceHarness({
    directPromptTexts: ["Select card to add an asteroid"],
    targetCards: [targetCard],
  });

  await assert.rejects(
    harness.execute({
      type: "quickChoice",
      promptText: "Select card to add an asteroid",
      targetCardText: "Main Belt Asteroids",
    }),
    (error) => {
      assert.equal(error.code, "queue-action-deferred");
      assert.equal(error.reason, "card-selection-not-confirmed");
      return true;
    },
  );

  assert.equal(replacementInput.checked, false);
  assert.equal(harness.events.includes("submit:0"), false);
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

test("exact quick targets and submits bail out before stale choices are submitted", async () => {
  const missingTarget = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "Asteroid Rights"}],
  });
  await assert.rejects(
    missingTarget.selectTarget("Select card to add 1 asteroid", "AstroDrill"),
    /card selection not ready/,
  );

  const duplicateTarget = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "AstroDrill"}, {name: "AstroDrill"}],
  });
  await assert.rejects(
    duplicateTarget.selectTarget("Select card to add 1 asteroid", "AstroDrill"),
    /ambiguous exact quick target/,
  );

  const disabledTarget = createExactQuickChoiceHarness({
    optionLabels: [{text: "Select card to add 1 asteroid"}],
    targetCards: [{name: "AstroDrill", input: {disabled: true, click() {}}}],
  });
  await assert.rejects(
    disabledTarget.selectTarget("Select card to add 1 asteroid", "AstroDrill"),
    /card selection not ready/,
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
    /card selection not ready/,
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
    /card selection not ready/,
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
    /card selection not ready/,
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
    /card selection not ready/,
  );
  assert.equal(missingTarget.events.includes("submit:0"), false);
  assert.equal(missingTarget.playbackActive(), false);
});

test("log card rendering clicks the exact card within a shared log row", () => {
  const dispatched = [];
  const sharedRow = {
    dispatchEvent() {
      dispatched.push("row");
    },
  };
  const cards = ["Protected Growth", "Lichen"].map((name) => ({
    closest() {
      return sharedRow;
    },
    dispatchEvent(event) {
      dispatched.push({name, event});
    },
  }));
  class MockMouseEvent {
    constructor(type, options) {
      this.type = type;
      this.options = options;
    }
  }
  const clickLogCard = Function(
    "document",
    "MouseEvent",
    "window",
    `"use strict"; ${logCardClickSource}; return clickLogCard;`,
  )(
    {querySelectorAll: () => cards},
    MockMouseEvent,
    {},
  );

  clickLogCard(0);
  clickLogCard(1);

  assert.deepEqual(
    dispatched.map((entry) => entry.name),
    ["Protected Growth", "Lichen"],
  );
  assert.equal(dispatched.some((entry) => entry === "row"), false);
  assert.equal(dispatched[0].event.type, "click");
  assert.equal(dispatched[0].event.options.bubbles, true);
  assert.throws(() => clickLogCard(2), /No log card found at 2/);
});

const createRenderedLogCardCaptureHarness = ({renderedName, renderedSlug}) => {
  const renderedCardHtmlByKey = new Map();
  const title = {};
  const rendered = {
    outerHTML: `<article>${renderedName}</article>`,
    querySelector(selector) {
      return selector === ".card-title" ? title : null;
    },
  };
  const document = {
    querySelector(selector) {
      return selector === ".card-panel #log_panel_card .card-container"
        ? rendered
        : null;
    },
  };
  const normalizeCardName = (name) => name.trim().toLowerCase();
  const slugifyCardName = (name) =>
    normalizeCardName(name)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const captureRenderedLogCard = Function(
    "document",
    "cardNameFromElement",
    "cardSlugFromElement",
    "normalizeCardName",
    "slugifyCardName",
    "renderedCardHtmlByKey",
    `"use strict"; ${renderedLogCardCaptureSource}; return captureRenderedLogCard;`,
  )(
    document,
    (element) => (element === title ? renderedName : ""),
    () => renderedSlug,
    normalizeCardName,
    slugifyCardName,
    renderedCardHtmlByKey,
  );
  return {captureRenderedLogCard, renderedCardHtmlByKey, rendered};
};

test("rendered log cards are cached only under a matching identity", () => {
  const matching = createRenderedLogCardCaptureHarness({
    renderedName: "Lichen",
    renderedSlug: "lichen",
  });
  assert.equal(matching.captureRenderedLogCard({name: "Lichen"}), true);
  assert.equal(
    matching.renderedCardHtmlByKey.get("lichen"),
    matching.rendered.outerHTML,
  );

  const stale = createRenderedLogCardCaptureHarness({
    renderedName: "Protected Growth",
    renderedSlug: "protected-growth",
  });
  assert.equal(stale.captureRenderedLogCard({name: "Lichen"}), false);
  assert.equal(stale.renderedCardHtmlByKey.size, 0);
});

test("rendered log card waiting accepts a later matching panel state", async () => {
  let captureAttempts = 0;
  let waits = 0;
  const waitForRenderedLogCard = Function(
    "captureRenderedLogCard",
    "shouldRunTerraformingMarsHelpers",
    "wait",
    `"use strict"; ${renderedLogCardWaitSource}; return waitForRenderedLogCard;`,
  )(
    () => {
      captureAttempts += 1;
      return captureAttempts === 3;
    },
    () => true,
    async () => {
      waits += 1;
    },
  );

  assert.equal(await waitForRenderedLogCard({name: "Lichen"}, 5, 0), true);
  assert.equal(captureAttempts, 3);
  assert.equal(waits, 2);

  let timeoutAttempts = 0;
  const timeoutWaitForRenderedLogCard = Function(
    "captureRenderedLogCard",
    "shouldRunTerraformingMarsHelpers",
    "wait",
    `"use strict"; ${renderedLogCardWaitSource}; return waitForRenderedLogCard;`,
  )(
    () => {
      timeoutAttempts += 1;
      return false;
    },
    () => true,
    async () => {},
  );
  assert.equal(
    await timeoutWaitForRenderedLogCard({name: "Lichen"}, 3, 0),
    false,
  );
  assert.equal(timeoutAttempts, 3);
  assert.match(
    missingLogCardRenderSource,
    /await waitForRenderedLogCard\(card\)[\s\S]*renderedCardRequests\.add\(slug\)/,
  );
});
