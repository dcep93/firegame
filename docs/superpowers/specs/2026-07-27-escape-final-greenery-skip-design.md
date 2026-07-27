# Escape Final Greenery Skip

## Goal

Extend Escape autopilot to handle the exact endgame prompt:

`Place any final greenery from plants`

At that prompt, Escape must select `Don't place a greenery` and submit the
choice. The player should not need to complete the final-greenery action
manually.

## Prompt Recognition

Recognize the prompt by exact, case-sensitive normalized text from either:

1. `latestPlayerView.waitingFor.title`, using `playerInputModelTitle`; or
2. the rendered top-level `.wf-options > label` title, using `cleanText`.

The model is the primary semantic signal and the DOM is a render-timing
fallback. Near matches and other greenery-placement prompts do not qualify.

## Queue Eligibility

Treat the exact final-greenery prompt as an Escape-fallback prompt for:

- `autopilot: escape`; and
- `autopilot: buy space rocks`, when it falls back to Escape.

Do not make `autopilot: got a lotta energy`, Pass, or other queue item types
eligible at this prompt.

Because final greenery placement occurs after the action phase, permit the
same two Escape-fallback modes to execute at the exact prompt even if the
player has already passed. Existing current-player, live-action-form,
auto-process, queue-head, and in-flight guards remain in force.

## Execution

When Escape sees the exact prompt:

1. Find the exactly matching enabled radio labeled
   `Don't place a greenery`.
2. Select it with the existing action-option interaction.
3. Wait for the rendered child state to settle.
4. Click the exact enabled submit button labeled `Save`.
5. Return without attempting Pass.

Missing, disabled, or ambiguous opt-out controls are safe failures. A missing,
disabled, or ambiguous `Save` button is also a safe failure. No approximate
button label or radio index is allowed.

The behavior applies to both automatic and manual queue execution because both
paths share the Escape executor. Persistent autopilot queue semantics remain
unchanged.

## Alternatives Rejected

Selecting the second radio by index is brittle if the server changes option
order.

Matching any prompt containing `greenery` could opt out of ordinary,
user-directed greenery placement.

Using the generic submit fallback could click a different enabled control if
the prompt layout changes.

## Scope

This change does not alter ordinary Escape-to-Pass behavior, World Government
Terraforming, WGT ocean placement, research-card skipping, card purchasing,
queue ordering, queue persistence, Autoqueue, scrolling, or network default
Pass selection.

## Verification

Tests cover exact model and DOM prompt recognition, near-match rejection,
queue eligibility by autopilot mode, post-Pass allowance, exact radio and Save
interaction order, safe failures, and unchanged ordinary Escape behavior.
