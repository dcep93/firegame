# World Government Escape Autopilot

## Goal

Extend `autopilot: escape` to handle the exact Terraforming Mars prompt:

`Select action for World Government Terraforming`

At that prompt, Escape submits whichever option the game selected by default.
It must not choose or change a radio option.

## Prompt Recognition

Use an exact, case-sensitive comparison with the English prompt text. Recognize
the prompt from either:

1. `latestPlayerView.waitingFor.title`, normalized through the existing
   `playerInputModelTitle` helper; or
2. the rendered top-level `.wf-options` title, normalized through `cleanText`.

The player-view model is the primary semantic signal. The DOM check covers the
brief render interval when the visible workflow is newer than the most recently
captured model.

This recognition is intentionally narrow. Other choice prompts must retain
their current queue classification and behavior.

## Queue Eligibility

The existing queue considers normal top-level items executable only during
“Take your first action” or “Take your next action.”

Add one exception:

- an autopilot item whose normalized mode is `escape` matches the World
  Government Terraforming prompt.

`autopilot: got a lotta energy` does not match that prompt and remains eligible
only during a normal take-action phase. No other top-level or follow-up queue
item changes classification.

All other readiness checks remain mandatory:

- no queue execution is already in flight;
- it is the current player’s turn; and
- a live action form exists.

Automatic queue processing ordinarily pauses when the player appears to have
passed. World Government Terraforming occurs after the action phase, and the
DOM or log fallback can still report the player’s prior Pass. Allow only the
queue-head `autopilot: escape` item through that guard while the exact World
Government prompt is active. Every other item remains paused after passing.

## Escape Execution

Route Escape through a dedicated executor:

1. If the exact World Government Terraforming prompt is active, leave the
   currently selected radio untouched.
2. Find enabled `.btn-submit` controls inside the current action form.
3. Click the control when exactly one is enabled, regardless of its text.
4. Return without running the ordinary Pass workflow.
5. For every other prompt, select `Pass for this generation`, wait for the
   render update, and submit Pass exactly as before.

This behavior applies whether the queued Escape item is processed
automatically or executed manually because both paths use the shared queued
item executor.

## Submit Safety

The World Government path must not guess:

- zero enabled submit controls produces a missing-submit error;
- more than one enabled submit control produces an ambiguous-submit error; and
- neither case clicks anything.

The submit search is scoped to the current Terraforming Mars action form. Button
text is diagnostic only and cannot determine eligibility.

## Alternatives Rejected

DOM-only prompt recognition is more sensitive to render timing and loses the
semantic player-input model already captured by the extension.

Treating World Government Terraforming as an ordinary top-level action prompt
for every queued item could run Power Plant autopilot or unrelated queued
actions during the wrong phase.

Selecting a known World Government radio before submission would override the
game’s default and contradict the requested behavior.

## Scope

This change does not alter:

- Escape behavior during ordinary action turns;
- the energy autopilot workflow;
- the selected World Government radio;
- queue ordering, removal, restoration, or Autoqueue rules;
- immediate execution behavior for other Enqueue controls;
- network default-Pass selection;
- turn-triggered scrolling; or
- submit handling for radio options, card targets, or remembered quick choices.

## Verification

Tests will cover:

- exact model-title recognition;
- rendered-title fallback recognition;
- rejection of near-match and unrelated prompts;
- Escape eligibility at the World Government prompt;
- energy and all other top-level items remaining ineligible there;
- clicking the single enabled submit without selecting a radio;
- ignoring the submit label;
- missing, disabled, and ambiguous submit controls;
- unchanged ordinary Escape-to-Pass behavior; and
- the focused and full extension test suites.
