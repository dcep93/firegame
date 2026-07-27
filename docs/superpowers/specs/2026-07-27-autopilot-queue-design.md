# Autopilot Queue Items

## Goal

Add a second queue-control row containing:

- an `enqueue autopilot` button; and
- a mode dropdown with `escape` and `got a lotta energy`.

Each click appends a distinct autopilot item to the persisted queue. Autopilot
uses the same queue ordering, manual execution, and Autoqueue processing rules
as other queued actions.

## Queue Representation

An autopilot queue item stores its selected mode:

```js
{type: "autopilot", mode: "escape"}
{type: "autopilot", mode: "gotALottaEnergy"}
```

Queue rows render these as:

- `autopilot: escape`
- `autopilot: got a lotta energy`

The selected mode is copied into every item at enqueue time. Changing the
dropdown later cannot modify already queued items.

Unlike the existing Enqueue controls that may execute a compatible action
immediately, `enqueue autopilot` always appends its item to the queue first.
When Autoqueue is checked and the new item reaches the head of the queue, the
existing scheduler may execute it normally.

## Remembered Mode

The dropdown selection is stored in the existing per-game, per-player local
queue session as `autopilotMode`.

- The default is `escape`.
- Rerendering the queue panel preserves the selection.
- A different game or player receives its own default/session.
- Invalid or obsolete stored values normalize to `escape`.
- Existing bounded session cleanup remains responsible for preventing
  unbounded local-storage growth.

## User Interface

The existing queue action controls remain unchanged. A second
`.tfmars420-queue-actions` row is inserted directly underneath them.

The row contains the `enqueue autopilot` button and its adjacent mode dropdown.
The button is available whenever the queue panel is available because it only
records work; whether queued work runs automatically remains controlled by the
Autoqueue checkbox.

Changing the dropdown only persists the preferred mode. Clicking the button
appends one item with the currently selected mode. Repeated clicks append
repeated items.

## Execution

Autopilot is a top-level queue item, not a follow-up item. It therefore observes
the same turn/readiness requirements as Pass, project cards, and played
actions.

### Escape

`escape` uses the established Pass executor:

1. select `Pass for this generation`;
2. wait for the action form to update; and
3. click the enabled Pass submit button.

### Got a Lotta Energy

`got a lotta energy` attempts the following semantic workflow:

1. select the enabled top-level `Standard projects` radio;
2. wait for its nested controls to render;
3. find and select the enabled standard project named `Power Plant`;
4. wait for payment/action controls to update; and
5. click the enabled action submit button labeled exactly `Confirm`.

Selectors are scoped to the current main action form. Power Plant is identified
by its rendered standard-project title and associated radio, rather than by its
position in the list. The final button requires the semantic `Confirm` label so
payment-card submit controls are not mistaken for the action submission.

If Standard projects, Power Plant, or its final Confirm action is missing or
disabled, the mode falls back to the complete `escape` workflow. Selecting
radios only changes local UI state, so fallback remains safe until Confirm is
clicked.

If Confirm is clicked, the energy action is considered submitted and Pass is
not attempted. If neither the requested energy workflow nor Pass is executable,
normal queue failure handling reports the error and leaves the item available
according to existing queue execution policy.

## Autoqueue and Queue Semantics

This feature does not read, click, check, or otherwise manipulate the rendered
Autoqueue checkbox.

- With Autoqueue off, the item waits until manually executed.
- With Autoqueue on, it waits for earlier queue items and is processed at the
  head of the queue.
- Manual execution uses the existing row check control.
- Reordering, deleting, and clearing work without special cases.
- Auditing follows the existing queue mutation and game-action execution paths.

## Alternatives Rejected

Expanding autopilot into ordinary queue items at enqueue time is unreliable
because the available action tree is not known until execution and the energy
mode needs conditional fallback.

Running autopilot in an independent loop would bypass queue ordering and the
Autoqueue preference.

A dedicated queue item with a small semantic executor preserves both the
requested modes and all existing queue behavior.

## Scope

This change does not alter:

- immediate execution behavior of existing Enqueue controls;
- queue ordering or removal rules;
- the Autoqueue checkbox or turn-triggered scrolling;
- ordinary Pass, radio-option, card-target, project-card, played-action, or
  quick-choice items;
- hand sorting; or
- remote request handling.

## Verification

Tests will cover:

- the second-row button and both dropdown options;
- per-game remembered dropdown state and invalid-value normalization;
- distinct mode capture and repeated autopilot queue items;
- the required queue labels;
- always enqueueing rather than using immediate execution;
- Autoqueue-off waiting and normal Autoqueue-on scheduling;
- Escape selecting and submitting Pass;
- the complete Standard projects → Power Plant → Confirm workflow;
- fallback to Escape for missing or disabled prerequisites;
- avoiding unrelated payment submit buttons;
- queue serialization and existing queue controls; and
- the task-scoped extension test suites.
