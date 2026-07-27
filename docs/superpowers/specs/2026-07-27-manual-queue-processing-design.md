# Manual Queue Processing Design

## Goal

Give Terraforming Mars queue users explicit control over whether queued actions
run automatically, while allowing any currently executable queue item to be run
manually.

## Persisted autoprocess preference

Add an `autoProcess` boolean to the existing `tfmars420:session` localStorage
record. The record is already scoped to the active Terraforming Mars player/game
session through its `playerId`; the new preference follows that same lifecycle.

New sessions and older records without the field normalize to
`autoProcess: false`. Queue edits, queue clearing, and card-rank edits preserve
the preference.

The queue panel renders an `autoprocess queue` checkbox immediately above the
row containing `Enqueue Pass` or `Dequeue Pass`. The checkbox remains editable
regardless of whose turn it is. Changing it writes the session immediately.

Automatic queue execution is gated by this preference. When unchecked,
render/network/log updates must not pop or execute any queued item. Turning it
on during a compatible live turn may allow the normal automatic executor to
process the first queued item.

## Per-item controls

Each queue row renders two compact native-icon buttons before its label:

- a remove button containing the site's `icon icon-cross` span;
- an execute button containing the site's `icon icon-check` span.

Both buttons retain accessible titles and `aria-label` values. Literal emoji are
not used.

The execute button runs the item at that row's current index, even when it is
not first in the queue. It bypasses the autoprocess preference and removes only
the selected item, preserving the order of every other queued item.

The execute button is disabled when:

- it is not the current player's turn;
- no live action form is present;
- another queue item is already executing; or
- the selected item does not match the current prompt phase.

`radioOption` and `cardTarget` items are follow-up items and are executable only
outside the main “Take your first/next action” prompt. All other queue item
types are main-action items and are executable only at that prompt.

## Execution and failure handling

Automatic and manual execution share an indexed execution primitive so their
turn, prompt, and in-flight behavior cannot drift.

Automatic processing invokes index zero only when `autoProcess` is true and
retains the existing behavior of pausing after the player has passed. Manual
execution invokes the clicked index and is permitted regardless of the
autoprocess setting, but still requires a compatible current-turn prompt.

The selected item is removed as execution starts. If manual execution rejects,
the failed item is restored at its original position when possible, the rest of
the queue remains intact, and the existing queue error display reports the
failure. Automatic execution retains its established failure behavior unless
the shared primitive can safely preserve the same semantics.

## Verification

Automated tests cover:

- defaulting and normalization of `autoProcess`;
- gating automatic execution while unchecked;
- rendering and persistence of the checkbox;
- native cross/check icon markup without emoji;
- per-row enablement based on turn, live form, in-flight state, and prompt type;
- execution of a non-first item without reordering remaining items; and
- preservation/restoration of queue state after a failed manual execution.

Run the extension Node test suite, a JavaScript syntax check, and
`git diff --check`.
