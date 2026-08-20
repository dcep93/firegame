# Automatic Queue Submit Deferral Design

## Goal

Make automatic Terraforming Mars queue execution tolerate selection-driven UI
render delays without losing actions. A temporarily unavailable exact submit
control must pause the strict-FIFO queue at its head instead of producing a
failure or clearing queued work.

## Current Behavior and Root Cause

Automatic queue execution removes a non-persistent item before running its DOM
workflow. The released project-card and played-action paths look for the exact
submit control immediately after one animation frame. When Vue has not yet
rendered the enabled control, the executor reports `game.action.failure`.

The local unreleased implementation adds a 250 ms exact-submit poll, but its
automatic failure policy still clears the persisted queue. A missing exact
submit can mean either that rendering is slow or that the selection is not
currently legal. Neither condition justifies discarding the head item or any
actions behind it.

## Approaches Considered

### Selected: Bounded exact-submit wait with a deferred outcome

Wait briefly for the exact enabled submit after any selection-driven action.
If it does not appear, return a distinct deferred outcome, preserve the queue,
and retry only after relevant game or UI state changes. This covers ordinary
render races while avoiding continuous whole-action retries.

### Rejected: Wait indefinitely

An open-ended wait would cover arbitrary render latency, but a stale or illegal
selection could leave execution permanently in flight and suppress other queue
and UI updates.

### Rejected: Periodically rerun the entire action

Repeating action-option and card selections on a timer can cause mutation loops,
duplicate interaction, and unsafe behavior if the UI advances between retries.

## Design

### Generalized exact-submit readiness

Selection-driven exact-submit flows use one shared helper. After the existing
selection and animation-frame boundary, it checks every 25 ms for up to 1
second for one unique, enabled exact-text submit control.

The rule is based on workflow shape, not card identity. It applies uniformly to
the existing selection-driven `Play card`, `Take action`, `Pass`, and `Confirm`
flows. It does not special-case Tardigrades or any other card.

The helper has three outcomes:

1. One exact enabled control appears: click it once and return submitted.
2. No exact enabled control appears within the bound: return deferred without
   clicking another control.
3. Multiple exact enabled controls appear: throw an ambiguity error immediately.

Structural submit flows that do not use exact-text selection-driven submission
retain their existing behavior.

### Strict-FIFO queue lifecycle

Automatic queue execution remains strict FIFO and considers only the head item.
Non-persistent items stay logically reserved while their workflow runs and are
removed only after a submitted outcome. A deferred outcome leaves the item at
the head and leaves every later item in its original order.

The executor latches the deferred attempt so ordinary render activity cannot
create a tight retry loop. It becomes eligible again after a fresh captured
player input, a game-log mutation, or an action-form mutation that newly exposes
the one expected exact submit control. Unrelated DOM mutations do not clear the
latch. If the exact submit appears during the bounded wait, the original attempt
completes without any whole-action retry.

Manual execution preserves its existing indexed restoration semantics.
Immediate, unqueued execution remains unqueued if it encounters a hard error;
the automatic queue deferral policy does not silently create new queue entries.

### Outcomes, errors, and auditing

A deferred automatic action is not a failure. The executor emits
`game.action.deferred` with the execution source, item type, label, and expected
submit label. It does not show the queue failure banner.

Ambiguous controls, invalid queue data, missing target identities, and unknown
item types remain hard failures. Hard automatic failures display the existing
error state and pause at the same queue item. They never clear the whole queue.
This favors recoverability and keeps destructive queue mutation under the
player's control.

`game.action.success` continues to mean that the intended submit control was
clicked. No deferred or hard-failure outcome records success.

## Data Flow

1. Autoqueue reads only the head item and confirms the current prompt can begin
   its workflow.
2. The workflow makes each intended selection once.
3. The shared helper waits for the required exact enabled submit.
4. On submitted, the executor removes the exact head item and records success.
5. On deferred, the executor keeps the full queue unchanged, records deferral,
   and leaves automatic processing latched until captured player input changes,
   the game log changes, or the expected exact submit appears.
6. On hard failure, the executor keeps the full queue unchanged, records the
   failure, displays the error, and remains paused until relevant state changes
   or user intervention.

## Safety Properties

- A missing exact submit never falls back to another button.
- No submit is clicked more than once by one execution attempt.
- A deferred attempt never advances to a later queue item.
- Automatic failure never clears queued work.
- The preceding selection is not repeated during the bounded wait.
- Ambiguity fails closed immediately.
- Queue removal occurs only for the item whose submit workflow completed.

## Testing

Tests will verify:

1. Every scoped selection-driven exact-submit flow uses the shared one-second
   wait.
2. Controls that render during the bound are clicked once without repeating the
   preceding selection.
3. A missing control returns deferred instead of throwing.
4. Deferred automatic items remain at the queue head and block later items.
5. Relevant state changes permit a later retry without a timer loop.
6. Successful items are removed exactly once after submission.
7. Ambiguous controls and hard execution errors preserve the entire queue and
   retain failure reporting.
8. Manual and immediate execution semantics outside automatic deferral remain
   unchanged.
9. The complete extension tests, JavaScript syntax checks, and
   `git diff --check` pass.
