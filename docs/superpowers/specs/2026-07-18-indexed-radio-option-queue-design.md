# Indexed Radio-Option Queue

## Goal

Allow a player to queue a 1-based radio-option index for a follow-up action form without storing or matching the option's text.

## Queue UI

Add a compact number input and an `Enqueue option` button immediately after `Clear queue` in the queue action row.

- The input defaults to `1`, has a minimum of `1`, and accepts integers only.
- Enqueuing `2` appends a queue item for the second radio in the action form.
- Invalid values are rejected before changing the queue.
- The queue list displays indexed items as `radio option N`.

## Queue Data

Use a dedicated queue item:

```js
{ type: "radioOption", optionIndex: 2 }
```

The index is 1-based. Multiple indexed option items may be queued.

## Execution

An indexed option waits until the current player has a live, non-`Take your first/next action` form. The executor then:

1. Finds radio inputs within the actions section's current `.wf-root` or `form`.
2. Selects the radio at `optionIndex - 1` using DOM order only.
3. Dispatches the existing click, input, and change events.
4. Advances one frame and clicks the form's `Confirm` submit control.

Radio label text, value, and name are not used to select the option.

## Failure Behavior

Missing, out-of-range, or disabled radio options throw an execution error. A missing or disabled confirmation control also throws. The existing queue failure path displays the error and clears the remaining queue, so no later queued action runs.

## Scope and Verification

Keep existing project-card, played-action, pass, queue-cost, and unavailable-card behavior unchanged. Preserve pre-existing uncommitted edits. Verify JavaScript syntax and whitespace, source-level queue-item coverage, and the new UI/execution paths against the inspected two-radio live form where index `2` represents `Add 1 floater here`.
