# Append-Only Played-Card Queue Controls

## Goal

Allow a player to enqueue the same played-card action or target more than once, including sequences such as `action → target → action → target` for the same card.

## Controls

The played-card controls remain labeled `enqueue action` and `enqueue target` after every click. Clicking either control always appends a new queue item of the corresponding type:

- `enqueue action` appends a `playedAction` item;
- `enqueue target` appends a `cardTarget` item.

The controls do not switch to dequeue labels or queued styling based on matching queue contents. Existing eligibility rules for showing each control remain unchanged.

## Queue Removal

Duplicate entries remain separate ordered queue items. A player removes a specific occurrence with that row's existing remove button in the queue panel. The existing `Clear queue` control continues to remove all entries.

## Scope

Only the played-card action and target controls become append-only. Pass and project-card controls keep their current behavior. Queue storage, execution order, card identity matching, and failure handling remain unchanged.

## Verification

Tests will verify that:

- action and target controls retain their enqueue labels;
- each click appends an item without removing a matching item already in the queue;
- duplicate `playedAction` and `cardTarget` entries are supported; and
- the existing per-row queue removal behavior remains available.
