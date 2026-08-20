# Queued Card Selection Confirmation Design

## Goal

Prevent Terraforming Mars queue workflows from submitting an empty card
selection and triggering the server error `Not enough cards selected`.

## Root Cause

The shared queued-card selector considers a matching card container sufficient
readiness. It may proceed while the card's radio or checkbox is still absent,
or it may fail to find an input that lives on an ancestor label. In that case it
falls back to dispatching a click on the visual card container and never checks
whether Vue registered a selection.

The subsequent `Take action` control is enabled even with no required card
selected. The extension can therefore click it and send an empty `cards` array,
which the server rejects.

The existing input path is also unsafe for checkboxes: it assigns
`checked = true` and then calls `click()`. Native checkbox activation toggles the
state, so that sequence can turn the checkbox back off.

## Approaches Considered

### Selected: Locate, activate, and confirm the real input

Wait for the matching card's enabled radio or checkbox, activate that actual
control once, and verify its checked state before allowing execution to
continue. This follows the upstream Vue component's selection contract and
prevents submission unless the browser reflects a real selection.

### Rejected: Continue clicking the visual card container

Nested labels normally forward clicks to their controls, but the behavior is
not reliable while Vue is rendering and provides no positive confirmation that
the model received the intended card.

### Rejected: Retry after the server rejects the request

The invalid request has already escaped the extension by that point. Retrying a
whole workflow after a server response can also duplicate or conflict with game
state changes.

## Design

### Input discovery

The shared card lookup continues to match card identity exactly. For the
matching card container, it resolves the selection control in this order:

1. a radio or checkbox inside the matched card container;
2. a radio or checkbox inside the matched card container's nearest owning
   `label`.

This supports both upstream structures:

- `SelectCard.vue` renders the input inside a label that is itself the cardbox;
- `SelectProjectCardToPlay.vue` renders the input beside the visual card inside
  an ancestor label.

The lookup never selects an input belonging to a different card.

### Bounded selection readiness

The selector probes every 25 ms for up to one second. It becomes ready only
when both the exact card container and its enabled selection input exist.

When the exact card appears without an input, or its input is disabled, the
selector continues waiting. If readiness never arrives, it produces a typed
queue-deferred condition containing the card identity and a selection reason.
Automatic execution restores and pauses at the strict-FIFO head through the
existing deferral lifecycle. Manual and immediate execution retain their
existing visible failure semantics.

An exact card that never appears retains the diagnostic list of visible card
names, but uses the same typed deferred condition for automatic execution
instead of permitting an unverified click.

### Activation and confirmation

Once an enabled input is available:

1. If it is already checked, do not click it again.
2. Otherwise call its native `click()` once inside the existing scroll
   preservation boundary.
3. Do not assign `checked` before clicking and do not synthesize duplicate
   `input` or `change` events; native activation provides those events.
4. Verify synchronously that `input.checked === true` after activation.
5. If activation did not produce a checked input, produce the typed deferred
   selection condition.

Only confirmed selection allows the existing animation-frame boundary and
exact-submit wait to run. The visual card-container click fallback is removed.

### Scope

The behavior is based on the shared card-selection workflow, not card names. It
applies to queued played actions, project cards, and card targets. It does not
special-case any Terraforming Mars card.

Quick-choice target selection has separate exact-target semantics and remains
outside this change.

## Error Handling and Auditing

The queue lifecycle recognizes both exact-submit and card-selection deferred
conditions as automatic `game.action.deferred` outcomes. Deferred audit details
include a stable reason and, where relevant, the expected card or submit label.

Missing, disabled, or unconfirmed inputs never lead to a submit click. Hard
ambiguity and malformed queue errors remain failures. All automatic outcomes
retain the queue-preservation behavior already implemented.

## Safety Properties

- No queued card submit occurs without a checked exact-card input.
- One attempt activates the selection input at most once.
- Already-checked inputs are never toggled off.
- Checkbox activation is not preceded by a manual checked assignment.
- Ancestor-label inputs are associated only with their matched card.
- A transiently unavailable input defers the queue head and blocks later work.
- No card name receives special handling.

## Testing

Tests will verify:

1. direct child and ancestor-label inputs are resolved correctly;
2. delayed input rendering is awaited within the one-second bound;
3. radio and checkbox controls become checked after exactly one native click;
4. already-checked inputs are not clicked;
5. disabled, missing, and activation-resistant inputs defer without submitting;
6. selection timeout metadata identifies the expected card and reason;
7. automatic selection deferral restores and pauses the strict-FIFO queue;
8. manual and immediate selection timeouts remain visible failures;
9. no card-container click or manual pre-check fallback remains;
10. the complete extension tests, JavaScript syntax checks, and
    `git diff --check` pass.
