# Remembered Played-Action Quick Choices

## Goal

Remember the first follow-up choice a player manually completes after tfmars420
executes a played-card action, then offer that exact choice either after a
queued copy of the same action or during that action's current unfinished
follow-up. This includes both conventional outer radio choices and workflows
that directly ask the player to select a target card.

Learning applies equally to all three tfmars420 activation paths:

- immediate execution from an Enqueue click;
- automatic execution of a persisted queue item; and
- manual execution from a queue-row checkbox.

## Session Data

Extend the current player queue session with remembered quick choices grouped by
the played action card's existing identity key. Each remembered choice contains
one of:

- an exact cleaned visible radio-option text, plus an optional exact target-card
  title; or
- an exact target-card title and the exact direct card-selection prompt that
  contained it.

Memories survive page and extension reloads because they use the existing local
queue session. They reset when the extension changes to a different player or
game, matching the current queue-session lifecycle.

Identical recipe tuples are stored once. Distinct choices for the same played
card coexist and each receive their own quick-select button.

## Learning Lifecycle

When the shared queue executor starts a `playedAction`, retain that card as a
pending learning source regardless of whether execution was immediate,
automatic, or manual.

Arm learning only after a captured player view confirms that:

- the response belongs to the same current player;
- the player still has an input to complete; and
- `Pass for this generation` is not one of the available options.

This distinguishes a real played-action follow-up from the top-level action
prompt, where tfmars420 would have selected Pass by default when available.
Abandon the pending source if the player changes, loses the turn, returns to a
top-level action prompt, or the played action fails before producing a
follow-up.

While learning is armed, observe the player's manual completion of the first
follow-up workflow. At its submit:

1. If the workflow has an outer options group, read the selected radio's exact
   cleaned label and, when present, the exact title of its selected enabled card
   child.
2. Otherwise, if the root follow-up is a direct card-selection workflow, read
   the exact prompt and exact title of its one selected enabled card.
3. Persist the completed recipe for the pending played card.
4. Clear the learning context so nested prompts are not incorrectly attributed
   as additional first-step choices.

For example, Mohole Lake can open `Select card to add microbe or animal` as a
root card-selection component. Selecting Regolith Eaters and clicking `Add
resource` learns a direct-target recipe even though there is no outer choice
radio.

Programmatic quick-choice playback does not create a new memory.

## Card UI

Render remembered quick-choice buttons inside the matching played card's
enqueue tools when either:

- that card's `playedAction` item is the final item in the persisted queue; or
- the card is the armed source of the current unfinished non-Pass follow-up.

The second condition reuses the learning association already established from
the network player view. It does not infer the source card from visible prompt
text. A live-follow-up match keeps the enqueue-tools container and remembered
buttons visible even when using the action made the card unavailable and the
card has no target-resource control.

Each button identifies the remembered option. A compound choice also identifies
its target card. A direct-target choice uses only the target, such as `quick:
Regolith Eaters`.

In queued mode, clicking a quick-choice button appends one compound follow-up
item after the played action. Once appended, the played action is no longer the
latest queue item, so its quick-choice buttons disappear on the next render.

In live-follow-up mode, clicking executes the remembered choice immediately
through the existing immediate queue-item executor and does not add, remove, or
reorder persisted queue items. This matches hand-card enqueue behavior when a
card can be played immediately. Live-follow-up mode takes precedence if both
visibility conditions overlap.

The click handler rechecks its mode immediately before acting. If neither the
queued parent nor the matching live follow-up still exists, it does nothing.

The normal action and target buttons keep their existing layout, colors, and
toggle behavior.

## Queue Item and Execution

Use one dedicated compound queue item:

```js
{
  type: "quickChoice",
  optionText: "Select card to add 1 asteroid",
  targetCardText: "AstroDrill"
}
```

`targetCardText` is absent for choices that do not select a card.

A direct-target recipe omits `optionText` and includes the originating prompt:

```js
{
  type: "quickChoice",
  promptText: "Select card to add microbe or animal",
  targetCardText: "Regolith Eaters"
}
```

`quickChoice` is a follow-up queue type. Its executor:

1. For an option recipe, finds exactly one enabled outer radio whose cleaned
   visible label equals `optionText`, selects it, and waits for its workflow to
   render.
2. If that option recipe includes `targetCardText`, finds exactly one enabled
   child card input with that exact cleaned title, selects it, and clicks the
   unique enabled structural submit control.
3. If an option recipe has no target and exposes a real child workflow, stops
   successfully after selecting the option. Otherwise it submits the leaf
   option.
4. For a direct-target recipe, requires one root card-selection workflow whose
   exact cleaned prompt equals `promptText`, finds exactly one enabled card input
   whose exact cleaned title equals `targetCardText`, selects it, and clicks the
   unique enabled structural submit control regardless of the button's label.

The same strict executor handles both persisted queued quick choices and
immediate live-follow-up clicks. Immediate execution is attempted only while
the matching armed source, live action form, and non-top-level prompt remain
current. A failed eligibility recheck does not fall back to persisting an
orphaned quick choice.

All option, prompt, and target matching uses strict `===` equality after the
existing whitespace-only `cleanText` normalization. It does not use substring
matching, case folding, radio indexes, slugs, normalized card names, or fuzzy
fallbacks.

## Failure Behavior

Execution throws and does not submit when:

- the exact option is absent, duplicated, or disabled;
- the exact target card is absent, duplicated, or disabled;
- a direct-target prompt is absent, duplicated, or does not match exactly;
- a target is remembered but the selected option does not expose card choices;
- a required enabled submit control is absent or ambiguous; or
- the current prompt is otherwise incompatible with the recipe.

Selecting a radio before discovering a stale target may change local form
state, but no server-side action is submitted. Existing queue lifecycle rules
remain authoritative: an automatic failure reports the error and clears later
queued work, while a manual failure restores the failed row for inspection or
removal. A stale live-follow-up button is a no-op; an immediate playback error
uses the existing immediate execution error reporting and leaves the queue
unchanged.

## Scope

This feature does not change:

- played-action activation itself;
- played-action immediate-versus-persisted enqueue policy;
- Autoqueue ordering or readiness;
- existing indexed radio-option items;
- existing standalone card-target items;
- default Pass selection;
- card identity matching used by existing action controls; or
- memories outside the current player's queue session.

## Verification

Focused tests cover:

- learning after immediate, automatic, and manual played-action execution;
- refusing to arm when the player changed, the turn ended, or Pass is offered;
- leaf radio memories;
- radio-plus-card compound memories;
- direct card-target learning without an outer radio group;
- direct-target quick-button labeling;
- exact direct-prompt and target playback;
- exact-text matching without fuzzy fallbacks;
- duplicate-memory suppression and multiple distinct memories;
- reload persistence and different-player reset;
- quick-button visibility for the final queued played action;
- quick-button visibility for the matching armed live follow-up;
- keeping live quick buttons on an action card that became unavailable;
- appending one compound item in queued mode;
- immediate execution without queue mutation in live-follow-up mode;
- live-follow-up precedence when both modes overlap;
- stale live-click no-op behavior;
- missing, duplicate, and disabled option failures;
- missing, duplicate, and disabled target failures;
- missing and ambiguous submit failures;
- no programmatic relearning during playback; and
- the complete extension test suite and syntax checks.
