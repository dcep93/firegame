# Escape Autopilot Research-Purchase Skip

## Goal

Extend `autopilot: escape` to skip optional research-card purchases at either
of these prompts:

- `Select card(s) to buy`
- `Select up to N card(s) to buy`, where `N` is one or more digits

Escape clicks `Skip this action` without selecting any offered card.

## Prompt Recognition

Add a semantic research-purchase prompt predicate.

The exact non-parameterized title may be recognized from
`latestPlayerView.waitingFor.title` through the existing
`playerInputModelTitle` helper.

The rendered action form is also inspected because the parameterized upstream
title is serialized as a message object and rendered with its numeric value.
Within the current `.wf-component--select-card`, normalize the visible
`.wf-component-title` text and accept only:

- exact `Select card(s) to buy`; or
- `^Select up to \d+ card\(s\) to buy$`.

Do not infer this state from card presence or the Skip button alone. Other
optional card-selection workflows can contain similar controls.

## Queue Eligibility

At a recognized research-purchase prompt:

- `autopilot: escape` matches and may execute;
- `autopilot: got a lotta energy` does not match;
- ordinary top-level queue items do not match; and
- follow-up items retain their existing classification.

All normal current-player, live-form, and in-flight checks remain required.

Automatic processing normally pauses when the player appears to have passed.
Research occurs after the preceding generation, and DOM/log fallbacks can
retain stale Pass evidence. Permit only the queue-head Escape autopilot through
that passed-state guard while this exact purchase prompt is active. Preserve
the guard for every other item.

## Escape Execution

Route the recognized purchase prompt through the existing Escape executor
before ordinary Pass behavior.

1. Locate the current `.wf-component--select-card`.
2. Collect enabled `button.btn-submit` and `input.btn-submit` controls.
3. Match normalized button text exactly to `Skip this action`.
4. Click it when exactly one enabled exact match exists.
5. Return without changing any card checkbox or running the Pass workflow.

The neighboring `Buy 0` control is not a fallback and must never be clicked.
Button order does not matter.

World Government Escape behavior remains unchanged and continues to submit its
single enabled default-action button regardless of text.

## Errors and Persistence

If no enabled exact Skip button exists, throw a missing research-skip error. If
more than one enabled exact Skip exists, throw an ambiguous research-skip
error. Neither case clicks any control.

Because autopilots are persistent, success and failure both leave the Escape
item at its exact queue position. The user removes it only with X or Clear
queue.

## Immediate and Automatic Behavior

An Escape autopilot enqueued while the purchase prompt is active may cut the
line immediately, independently of the Autoqueue checkbox. It remains queued
after skipping.

Future automatic purchase skipping requires Autoqueue and normal queue-head
ordering. No code reads or manipulates the rendered Autoqueue checkbox.

## Alternatives Rejected

Matching only the presence of `Skip this action` could affect unrelated optional
workflows.

Clicking the first enabled submit could select `Buy 0` or another action when
the upstream layout changes.

Exact prompt semantics plus an exact Skip-button match constrain the behavior
to the requested research purchase.

## Scope

This change does not alter:

- energy autopilot behavior;
- ordinary Escape-to-Pass behavior;
- World Government Escape behavior;
- persistent queue positioning or removal;
- card selection or hand sorting;
- normal project-card purchase choices outside these prompts;
- turn scrolling; or
- network default-Pass selection.

## Verification

Tests will cover:

- exact non-parameterized model-title recognition;
- exact and parameterized rendered-title recognition;
- rejection of unrelated and near-match titles;
- Escape-only queue eligibility;
- the narrow passed-state exception;
- clicking one enabled exact `Skip this action`;
- ignoring disabled Buy and Skip controls;
- rejection of missing and ambiguous enabled Skip controls;
- no card checkbox or radio manipulation;
- unchanged World Government and ordinary Pass Escape paths;
- immediate enqueue compatibility and persistent retention; and
- the focused and full extension test suites.
