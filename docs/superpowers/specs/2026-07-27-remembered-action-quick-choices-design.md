# Remembered Played-Action Quick Choices

## Goal

Remember the first follow-up choice a player manually completes after tfmars420
executes a played-card action, then offer that exact choice as a one-click queue
item the next time the same played-card action is last in the queue.

Learning applies equally to all three tfmars420 activation paths:

- immediate execution from an Enqueue click;
- automatic execution of a persisted queue item; and
- manual execution from a queue-row checkbox.

## Session Data

Extend the current player queue session with remembered quick choices grouped by
the played action card's existing identity key. Each remembered choice contains:

- the exact cleaned visible radio-option text; and
- when applicable, the exact cleaned visible target-card title.

Memories survive page and extension reloads because they use the existing local
queue session. They reset when the extension changes to a different player or
game, matching the current queue-session lifecycle.

Identical option/target tuples are stored once. Distinct choices for the same
played card coexist and each receive their own quick-select button.

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

1. Read the selected radio's exact cleaned label.
2. If the selected option has a card-selection child, read the exact cleaned
   title of the selected enabled card.
3. Persist the completed recipe for the pending played card.
4. Clear the learning context so nested prompts are not incorrectly attributed
   as additional first-step choices.

Programmatic quick-choice playback does not create a new memory.

## Card UI

Render remembered quick-choice buttons inside the matching played card's
enqueue tools, directly below its pink queued-action button, only when that
card's `playedAction` item is the final item in the persisted queue.

Each button identifies the remembered option. A compound choice also identifies
its target card. Clicking a quick-choice button appends one compound follow-up
item after the played action. Once appended, the played action is no longer the
latest queue item, so its quick-choice buttons disappear on the next render.

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

`quickChoice` is a follow-up queue type. Its executor:

1. Finds exactly one enabled radio whose cleaned visible label equals
   `optionText`.
2. Selects it and waits for the chosen workflow to render.
3. If `targetCardText` is present, finds exactly one enabled card input whose
   cleaned visible card title equals it, selects the card, and clicks the unique
   enabled structural submit control.
4. If no target is present and the option exposes a real child workflow, stops
   successfully after selecting the option.
5. Otherwise clicks the unique enabled structural submit control for the leaf
   option.

All option and target matching uses strict `===` equality after the existing
whitespace-only `cleanText` normalization. It does not use substring matching,
case folding, radio indexes, slugs, normalized card names, or fuzzy fallbacks.

## Failure Behavior

Execution throws and does not submit when:

- the exact option is absent, duplicated, or disabled;
- the exact target card is absent, duplicated, or disabled;
- a target is remembered but the selected option does not expose card choices;
- a required enabled submit control is absent or ambiguous; or
- the current prompt is otherwise incompatible with the recipe.

Selecting a radio before discovering a stale target may change local form
state, but no server-side action is submitted. Existing queue lifecycle rules
remain authoritative: an automatic failure reports the error and clears later
queued work, while a manual failure restores the failed row for inspection or
removal.

## Scope

This feature does not change:

- played-action activation itself;
- immediate-versus-persisted enqueue policy;
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
- exact-text matching without fuzzy fallbacks;
- duplicate-memory suppression and multiple distinct memories;
- reload persistence and different-player reset;
- quick-button visibility only for the final queued played action;
- appending one compound item from a quick button;
- missing, duplicate, and disabled option failures;
- missing, duplicate, and disabled target failures;
- missing and ambiguous submit failures;
- no programmatic relearning during playback; and
- the complete extension test suite and syntax checks.
