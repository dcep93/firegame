# tfmars420 Audit Logging Design

## Goal

Add always-on browser-console audit logging for:

1. Every meaningful action a user takes through tfmars420 controls.
2. Every durable or external write initiated by tfmars420.

The logs should make extension behavior traceable without logging unrelated Terraforming Mars page actions, routine DOM rendering, large payloads, or sensitive game state.

## Scope

### User actions

Log semantic actions handled by tfmars420, including:

- enabling or disabling the extension;
- requesting a content-script update;
- editing shared new-game settings;
- adding, removing, clearing, or manually executing queued actions;
- enabling or disabling automatic queue processing;
- changing the hand sort mode;
- changing a card rank;
- enqueueing or dequeueing project cards and played-card actions;
- enqueueing card targets or indexed options.

Do not log ordinary interactions handled solely by the Terraforming Mars application.

### Durable and external writes

Log writes at their centralized boundaries:

- `localStorage` writes for extension activation and queue session state;
- Firebase `PUT` requests for shared settings and game IDs;
- extension runtime and tab messages;
- content-script downloads;
- extension reloads and requested page reloads;
- programmatic execution of queued actions against the game UI.

DOM creation, text changes, styling, scrolling, mutation-observer activity, reads, and network response capture are outside this audit scope.

## Architecture

Add a small audit logger to each execution context that needs it:

- the main-world content script;
- the isolated-world reload bridge;
- the service worker.

Each logger writes a structured console entry with the prefix `[tfmars420:audit]`, an event name, and a compact details object. Event names use stable dotted names such as `queue.clear`, `storage.write`, and `firebase.write.success`.

Instrumentation belongs in two places:

1. Semantic tfmars420 event handlers log user intent once.
2. Centralized side-effect boundaries log write attempts and outcomes.

This avoids generic page-wide event interception and avoids duplicating write logs at every caller.

## Event Semantics

User-action events are emitted after tfmars420 accepts an interaction as relevant, but before it performs the requested work. Rejected or invalid interactions may log a corresponding rejected outcome when that information is useful.

Synchronous writes emit one success event after the write completes. Failures emit a failure event with a normalized error message.

Asynchronous external writes emit:

- an attempt event before starting;
- a success event when completion is confirmed; or
- a failure event when the operation fails.

Programmatic queued-action execution is logged separately from user actions because it may be automatic. Its details identify whether execution was manual, automatic, or immediate.

## Logged Data

Details may include:

- storage key;
- Firebase field name;
- message type;
- queue item type and safe card/action label;
- queue length;
- boolean setting value;
- sort mode or rank;
- download ID or interruption reason;
- destination category;
- normalized error message.

Logs must not contain:

- complete serialized new-game settings;
- complete queue-session JSON;
- player-view responses;
- full Firebase payloads;
- arbitrary DOM text;
- credentials, tokens, or cookies.

## Error Handling

Audit logging must never change extension behavior. The logger should tolerate missing console methods and values that cannot be safely represented. Existing warnings and errors remain in place; audit failure events supplement them.

A failed write must be logged before existing recovery behavior runs. Logging failures must not be allowed to mask the original failure.

## Testing

Add focused tests that verify:

- audit entries use the stable prefix and structured event names;
- successful and failed `localStorage` writes are logged;
- Firebase writes log attempts and outcomes without full payloads;
- runtime messages, downloads, and reloads are logged;
- representative queue, settings, sorting, ranking, and update controls log semantic user actions;
- automatic queued-action execution is distinguishable from manual execution;
- unrelated page events and DOM rendering do not create audit entries;
- existing extension behavior and current uncommitted work remain intact.

## Success Criteria

- All scoped tfmars420 user-action entry points emit an always-on audit entry.
- All scoped durable or external write boundaries emit an always-on audit entry with an outcome.
- Console output is compact, structured, and safe to share for debugging.
- Existing extension tests continue to pass.
