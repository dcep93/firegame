# Played-Card Queue Control Behavior

## Goal

Restore clear queued-state feedback for played-card actions while continuing to
allow the same played card to be selected repeatedly as a follow-up target.

## Controls

The two played-card controls intentionally use different behaviors.

### Action

The action control is a toggle:

- When no matching `playedAction` is queued, it is blue and labeled
  `enqueue action`.
- Clicking it appends one matching `playedAction`, changes the control to the
  pink queued style, and relabels it `dequeue action`.
- Clicking it again removes the matching `playedAction`, restores the blue
  style, and relabels it `enqueue action`.
- At most one matching `playedAction` can be queued through this control.

### Target

The target control remains append-only:

- It stays blue and labeled `enqueue target`.
- Every click appends a new matching `cardTarget`.
- It does not switch to a dequeue label or queued styling based on existing
  target entries.

Existing eligibility rules for showing each control remain unchanged.

## Queue Removal

An action can be removed either by toggling its pink action control or by using
that row's remove button in the queue panel. Target occurrences are removed
individually with their queue-row remove buttons. The existing `Clear queue`
control continues to remove all entries.

## Scope

Only the played-card action control changes from the current local append-only
implementation. The target control remains append-only. Pass and project-card
controls keep their current behavior. Queue storage, execution order, card
identity matching, and failure handling remain unchanged.

## Verification

Tests will verify that:

- the action control finds a matching queued action;
- an unqueued action click appends a `playedAction`;
- a queued action click removes the matching item;
- the action label and pink `is-queued` class reflect the matching queue state;
- the target control always appends a `cardTarget` and never toggles queued
  styling; and
- the existing per-row queue removal behavior remains available.
