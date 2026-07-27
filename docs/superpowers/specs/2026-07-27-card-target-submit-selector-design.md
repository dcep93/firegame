# Card-Target Submit Selector

## Goal

Allow queued card-target actions to submit regardless of the action-specific or
translated button label. For example, selecting Asteroid Rights must work when
the submit button reads `Add asteroid`.

## Live DOM Contract

Terraforming Mars renders the card-target submit control inside the current
actions area with the `btn-submit` class. Its visible label describes the
selected operation and is not a stable identifier.

The extension will locate card-target submit controls by structure:

1. Find the current Terraforming Mars actions area.
2. Find enabled `button.btn-submit` and `input.btn-submit` descendants.
3. Click the control only when exactly one enabled candidate exists.

The selector will not inspect or constrain the control's visible text.

## Error Handling

If no enabled submit control exists, queue execution will stop with a clear
missing-submit error. If multiple enabled submit controls exist, it will stop
with an ambiguous-submit error instead of guessing.

## Scope

This change applies only to queued `cardTarget` items. Submission behavior for
played actions, project cards, passing, and indexed radio options remains
unchanged.

## Verification

Focused tests will verify that card-target submission:

- uses the `btn-submit` class rather than expected label text;
- accepts arbitrary labels such as `Add asteroid`;
- requires exactly one enabled candidate;
- distinguishes missing and ambiguous submit controls; and
- leaves the indexed-radio submit path unchanged.
