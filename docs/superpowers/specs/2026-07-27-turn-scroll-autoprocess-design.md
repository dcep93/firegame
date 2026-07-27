# Turn Scroll and Autoprocess Coordination

## Goal

Coordinate the existing one-shot "scroll to the bottom when it becomes my
turn" behavior with the persisted autoprocess queue setting:

- suppress the turn scroll when autoprocess is already enabled;
- enable autoprocess while scrolling when the queue is empty; and
- preserve an explicitly disabled autoprocess setting when queued work exists.

This replaces the cancelled card-level Autoqueue button request. No new button
is added.

## Decision Point

Apply the policy inside `maybeScrollToBottomForTurn`, after the normal action
form is rendered and confirmed ready. This keeps the behavior aligned with the
existing pending one-shot scroll and avoids making session decisions while a
network response is still being rendered.

If the current player session is unavailable, keep the pending scroll armed and
try again during a later UI update.

## Behavior

When a pending turn scroll becomes ready:

### Autoprocess already enabled

- consume the pending scroll;
- do not scroll;
- do not change the queue or autoprocess state.

Consuming the pending scroll prevents an unexpected delayed scroll if the user
later disables autoprocess during the same turn.

### Autoprocess disabled and queue empty

- persist `autoProcess: true` through the existing queue-session state helper;
- allow the normal queue-panel rerender to check the checkbox;
- consume the pending scroll; and
- smoothly scroll to the bottom.

The implementation does not click or directly modify the rendered checkbox.

### Autoprocess disabled and queue nonempty

- leave `autoProcess` disabled;
- leave the queue unchanged;
- consume the pending scroll; and
- smoothly scroll to the bottom.

## Scope and Safety

The change affects only the one-shot turn-scroll path. It does not alter:

- turn-transition detection;
- queue ordering or contents;
- manual row execution;
- automatic queue execution rules;
- Pass selection;
- action submission; or
- player-input requests.

## Verification

Focused tests will verify:

- a checked autoprocess setting suppresses scrolling and consumes the pending
  one-shot;
- an unchecked setting with an empty queue is persisted as checked and still
  scrolls;
- an unchecked setting with a nonempty queue remains unchecked and still
  scrolls;
- missing session and not-yet-ready action forms keep the scroll pending;
- repeated updates do not scroll twice;
- the state change uses the queue-session helper; and
- the scroll path never queries, clicks, checks, or dispatches events on the
  checkbox DOM element.
