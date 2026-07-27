# World Government Escape Autopilot

## Goal

Extend `autopilot: escape` to handle the exact Terraforming Mars prompt:

`Select action for World Government Terraforming`

At that prompt, Escape submits whichever option the game selected by default.
It must not choose or change a radio option. When that selected default is
`Add an ocean`, Escape must satisfy its embedded `Must select a space`
requirement before submitting the WGT form.

Escape must also finish the exact blocking follow-up:

`Select space for ocean from temperature increase`

This follow-up can occur when World Government raises temperature across the
ocean-bonus threshold. It is not a request to choose Ocean on the original
World Government parameter screen.

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

Recognize the ocean follow-up by the exact normalized title
`Select space for ocean from temperature increase`, using the player-input
model first and rendered `.wf-select-space` text as a fallback. The rendered
fallback must read the workflow title without including its `go to map` link.
Near matches and other select-space prompts do not qualify.

## Queue Eligibility

The existing queue considers normal top-level items executable only during
“Take your first action” or “Take your next action.”

Add one exception:

- an Escape-fallback autopilot item matches the World Government Terraforming
  prompt and its exact ocean-placement follow-up.

`autopilot: got a lotta energy` does not match that prompt and remains eligible
only during a normal take-action phase. No other top-level or follow-up queue
item changes classification.

All other readiness checks remain mandatory:

- no queue execution is already in flight;
- it is the current player’s turn; and
- a live action form exists.

The ocean-placement follow-up has no normal action form or enabled control
inside the actions block. Add a prompt-specific readiness exception only when:

- the queue item is an Escape-fallback autopilot mode;
- the exact ocean-placement prompt is active; and
- at least one rendered, available ocean space exists on the main board.

No other select-space prompt bypasses the ordinary current-turn and live-form
checks.

Automatic queue processing ordinarily pauses when the player appears to have
passed. World Government Terraforming occurs after the action phase, and the
DOM or log fallback can still report the player’s prior Pass. Allow only the
queue-head Escape-fallback autopilot item through that guard while the exact
World Government prompt or its exact ocean-placement follow-up is active.
Every other item remains paused after passing.

## Escape Execution

Route Escape through a dedicated executor:

1. If the exact World Government Terraforming prompt is active, find the
   exactly one checked, enabled top-level radio and leave it untouched.
2. If its normalized label is exactly `Add an ocean` and available ocean
   spaces remain, run the least-bonus ocean-placement workflow before submit.
3. Wait for the map selection and any optional visible `Yes` confirmation to
   render completely.
4. Find enabled `.btn-submit` controls inside the current action form.
5. Click the control when exactly one is enabled, regardless of its text.
6. Return without running the ordinary Pass workflow.
7. For every other prompt, select `Pass for this generation`, wait for the
   render update, and submit Pass exactly as before.

If a different WGT option is checked, submit it unchanged without interacting
with the board. Missing or ambiguous checked WGT options are safe failures.

This behavior applies whether the queued Escape item is processed
automatically or executed manually because both paths use the shared queued
item executor.

## Blocking Ocean Placement

When the exact ocean-placement follow-up is active:

1. Read only direct main-board spaces matching
   `#main_board > .board-space.board-space--available`.
2. Keep only spaces that render a `.board-space-type-ocean` child.
3. Count each space's rendered `.board-space-bonus` elements.
4. Select the space with the fewest bonuses. Break ties by rendered DOM order.
5. Click that space without scrolling the user's page.
6. Wait for the next rendered frame.
7. If the game shows exactly one visible, enabled confirmation button whose
   normalized text is `Yes`, click it. If no such confirmation is visible, the
   native space click has already submitted and execution is complete.
8. After clicking a visible confirmation, wait for one more rendered frame
   before a caller submits any containing WGT form.

Missing available ocean spaces are a safe failure. Multiple visible enabled
`Yes` controls are ambiguous and must fail without clicking a confirmation.
Hidden confirmation controls must not be clicked.

The behavior applies to `autopilot: escape` and modes such as
`autopilot: buy space rocks` that explicitly fall back to the same Escape
executor. It does not apply to `got a lotta energy`.

## Submit Safety

The World Government path must not guess:

- zero or multiple checked enabled WGT radios produce a selection error;
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

Submitting first and handling a later validation response cannot work when the
client keeps the invalid WGT form open without changing the player input.

Selecting a map space for every WGT option would couple unrelated parameter
choices to board interaction.

## Scope

This change does not alter:

- Escape behavior during ordinary action turns;
- the energy autopilot workflow;
- the selected World Government radio;
- the World Government parameter-selection strategy;
- any city, greenery, colony, or other map-placement prompt;
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
- preserving a checked non-ocean WGT option and submitting directly;
- recognizing only an exact checked `Add an ocean` option;
- selecting the least-bonus ocean before submitting an embedded WGT form;
- waiting through optional ocean confirmation before WGT submit;
- missing and ambiguous checked-option failures;
- ignoring the submit label;
- missing, disabled, and ambiguous submit controls;
- exact ocean-follow-up recognition and rejection of near matches;
- prompt-specific queue eligibility without a normal action form;
- least-bonus ocean selection with rendered-order tie-breaking;
- rejection of non-ocean and unavailable map spaces;
- optional visible `Yes` confirmation and direct-submit behavior;
- missing-space and ambiguous-confirmation failures;
- post-pass execution for only the exact ocean follow-up;
- unchanged ordinary Escape-to-Pass behavior; and
- the focused and full extension test suites.
