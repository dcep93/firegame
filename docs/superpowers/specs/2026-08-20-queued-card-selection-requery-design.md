# Queued Card Selection Re-query Design

## Goal

Prevent every Terraforming Mars queued card workflow from submitting an empty
selection, including remembered quick choices and follow-up card targets.

## Root Cause

The normal queued-card path was changed to use native input activation, but the
separate remembered quick-choice target path still assigns `checked = true`
before calling `click()`. Native checkbox activation then toggles the control
back off, allowing the quick-choice submit to send an empty card array.

The normal path also confirms only the input object it originally clicked.
That is weaker than confirming the current Vue-rendered form: a render can
replace the input, leaving the old detached object checked while the live form
has no selection.

## Approaches Considered

### Selected: One confirmed native-selection primitive

Route normal queued cards, card targets, and remembered quick-choice targets
through one exact-card selection primitive. It waits for the exact enabled
input, activates it natively without assigning `checked`, then re-queries after
Vue has rendered and confirms that the current connected input is checked.

This removes divergent selection semantics and validates the form that will
actually be submitted.

### Rejected: Patch only remembered quick choices

Removing the pre-check from the quick-choice helper fixes the known checkbox
toggle, but preserves duplicate selection implementations and does not address
the detached-input race in normal queued actions.

### Rejected: Retry after the server rejects the request

The invalid request has already reached the game server. Retrying at that point
is harder to reason about and can conflict with a changed workflow.

## Design

### Exact input resolution

Selection continues to match the requested card by normalized identity. The
primitive accepts a scoped card workflow or selector so nested quick choices do
not accidentally select an identically named card elsewhere on the page.

For the exact cardbox, resolve its radio or checkbox either directly or through
its nearest owning label. Missing, disabled, or ambiguous targets never submit.

### Native activation

If the current exact input is unchecked, call `click()` exactly once inside the
existing scroll-preservation boundary. Do not assign `checked` and do not emit
synthetic duplicate input or change events.

If the input is already checked, leave it unchanged.

### Live-form confirmation

After activation, yield through the render boundary and repeatedly re-query the
same scoped workflow for up to one second. Selection is confirmed only when the
newly resolved exact input:

- is connected to the current document;
- is enabled; and
- is checked.

The primitive returns only after confirming the live input. Submit helpers run
after that confirmation.

### Queue behavior

When automatic execution cannot confirm the live selection within the bound,
raise the existing typed queue-deferred condition. Restore and retain the item
at the strict-FIFO head, pause the whole queue, and do not click submit.

Manual and immediate execution keep visible failure behavior. The change does
not special-case any Terraforming Mars card.

### Scope

The primitive applies to:

- queued played-action card selection;
- queued project-card selection;
- queued follow-up card targets; and
- direct or nested remembered quick-choice card targets.

Radio-option selection that does not contain a SelectCard workflow remains
unchanged.

## Testing

Tests will cover:

1. native radio and checkbox activation without a manual pre-check;
2. exact-card resolution for direct and ancestor-label inputs;
3. re-query confirmation of the current connected input;
4. replacement of the clicked input with an unchecked input;
5. delayed live-form confirmation;
6. missing, disabled, detached, and unconfirmed inputs deferring safely;
7. normal queued cards and remembered quick targets sharing the primitive;
8. no submit occurring before live confirmation;
9. strict-FIFO queue preservation on automatic deferral; and
10. the full extension test suite, syntax checks, and `git diff --check`.
