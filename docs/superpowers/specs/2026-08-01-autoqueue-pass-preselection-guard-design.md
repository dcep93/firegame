# Guard Pass Preselection During Autoqueue Work

## Goal

Prevent queued and immediately executed Terraforming Mars actions from
submitting `Pass for this generation` when the game UI updates during automatic
queue processing, while retaining Pass as the normal default when Autoqueue has
no pending work.

## Root Cause

Captured player-view responses arm a one-shot operation that selects `Pass for
this generation` when a new top-level action form renders. Automatic queue
processing can start during the same update cycle. The game may then rerender
the action form between the executor selecting its intended action and clicking
the submit control.

Played-action and project-card execution compounds this race by allowing
`clickActionSubmit` to fall back from the requested label to any `.btn-submit`
or enabled button. If Pass becomes selected again and the intended submit label
is absent, this fallback can submit Pass while the audit log attributes the
completed DOM workflow to the queued card.

## Conditional Pass Preselection

Keep the existing network-triggered Pass default for ordinary turns. Before
selecting Pass, read the current player queue session.

Suppress the pending Pass selection when both conditions are true:

- `autoProcess` is enabled; and
- the queue contains at least one item.

Suppression consumes the pending one-shot selection for that action prompt
without selecting Pass in either the canonical action form or the Actions
mirror. It must not postpone the default until later in the same turn because a
delayed selection could still overwrite a queued workflow after execution has
started.

When Autoqueue is disabled or the queue is empty, preserve the current behavior:
select the exact `Pass for this generation` radio once in the canonical form,
mirror its checked state locally, and do not submit it.

Manual queue execution and immediate execution already set the shared
execution-in-flight guard before their asynchronous DOM workflow begins. Pass
preselection must also decline to select while queue execution is in flight,
covering work that is not governed by the persisted Autoqueue preference.

## Exact Action Submission

Change the shared played-action and project-card submission helper to fail
closed. Given a requested label such as `Take action` or `Play card`, it must:

1. search the current canonical actions form for enabled submit controls whose
   normalized visible text or value exactly matches an allowed label;
2. click the control only when exactly one match exists;
3. throw a missing-submit error when no exact match exists; and
4. throw an ambiguous-submit error when multiple exact matches exist.

It must never fall back to a generic `.btn-submit` or arbitrary enabled button.
This ensures a stale or rerendered form produces a visible queue execution
failure instead of submitting a different action.

Explicit Pass execution retains its existing behavior: it selects the exact
Pass option and then requests a Pass-labeled submit control. The stricter helper
continues to support its explicit alternate label where required.

## Execution and Error Handling

Existing queue lifecycle semantics remain unchanged:

- automatic queued items are removed before execution and follow the existing
  automatic failure policy;
- manually executed queued items are restored at their original position when
  execution fails;
- immediate executions remain unqueued after failure; and
- failures appear in the existing queue error UI and audit log.

`game.action.success` continues to mean that the intended exact submit control
was clicked. A missing or ambiguous exact control must instead produce
`game.action.failure`.

## Scope

Do not alter queue ordering, Autoqueue persistence, prompt eligibility,
remembered quick choices, action-card matching, explicit Pass actions,
autopilot modes, the Actions mirror, or turn scrolling beyond guarding the
existing Pass-default integration.

## Verification

Automated tests will verify:

- qualifying player views still arm Pass preselection;
- Pass is selected when Autoqueue is disabled;
- Pass is selected when Autoqueue is enabled with an empty queue;
- Pass is not selected, mirrored, or left pending when Autoqueue is enabled
  with a nonempty queue;
- Pass is not selected while any queue execution is in flight;
- played actions click exactly one enabled `Take action` control;
- project cards click exactly one enabled `Play card` control;
- a Pass button is never used as a fallback for either workflow;
- missing and ambiguous exact submit controls throw without clicking anything;
- explicit Pass execution still selects and submits Pass; and
- the complete extension test suite, JavaScript syntax check, and
  `git diff --check` pass.
