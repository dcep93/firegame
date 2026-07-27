# Turn Transition Scroll Design

## Goal

When a Terraforming Mars network update indicates that control has transitioned
from another player to the current player, smoothly scroll the page to the
bottom once so the action area is brought into view.

## Transition detection

Derive a boolean “my turn” state from each captured `api/player` or
`player/input` response. A response represents the current player's turn when
its `waitingFor` model is an action choice titled “Take your first action” or
“Take your next action.”

Keep the previous derived state in memory:

- the first valid network state only establishes the baseline;
- `false → true` arms a pending scroll;
- repeated `true` responses do nothing;
- `true → false` records that the turn ended and permits the next transition;
- unrecognized payloads do not invent a transition.

This state is intentionally not persisted. Reloading the page establishes a new
baseline and must not scroll merely because it loaded during the player's turn.

## Scroll timing

A network response may arrive before the game has rendered the corresponding
controls. The network hook therefore arms a one-shot pending flag and schedules
the existing Terraforming Mars UI update.

During that update, execute the pending scroll only when:

- the current player has an enabled live action control;
- a live action form exists; and
- the current prompt is the main “Take your first/next action” prompt.

Call:

```js
window.scrollTo({
  top: document.documentElement.scrollHeight,
  behavior: "smooth",
});
```

Clear the pending flag before scrolling so DOM mutations caused during or after
the scroll cannot trigger it again. If the form is not ready, leave the flag
armed and let the existing DOM/update scheduling retry it.

## Integration

Turn derivation is a small pure helper shared with the existing network-default
Pass qualification where practical. Transition tracking belongs in
`rememberLatestPlayerView`, alongside the current network-derived one-shot Pass
state. The scroll executor belongs in the queue/UI update path because that path
already waits for Terraforming Mars action controls to render.

The feature does not submit an action, change a selected option, modify queue
state, or persist any new localStorage value.

## Verification

Tests cover:

- initial `true` and initial `false` states establishing a baseline without a
  scroll;
- exactly one pending scroll on `false → true`;
- no repeat scroll for duplicate `true` updates;
- rearming after a later `true → false → true` sequence;
- retaining the pending state until the live action form is ready; and
- a smooth scroll to `document.documentElement.scrollHeight`.

Run the extension Node test suite, a JavaScript syntax check, and
`git diff --check`.
