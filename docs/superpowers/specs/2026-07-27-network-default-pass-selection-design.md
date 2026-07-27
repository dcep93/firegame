# Network-Triggered Default Pass Selection

## Goal

When an `api/player` or `player/input` response gives the current player a
normal action prompt, select `Pass for this generation` by default without
submitting it or reselecting it during later UI updates.

## Qualifying Network Response

A successful captured `api/player` or `player/input` player-view response can
arm the default. A response qualifies when its serialized `waitingFor` model:

- is an `or` choice;
- has the title `Take your first action` or `Take your next action`; and
- contains a `Pass for this generation` option.

Intermediate `player/input` responses for payments, card targets, and other
follow-up prompts do not qualify. Any nonqualifying captured player-view
response clears a stale pending default.

## One-Shot Selection

A qualifying response creates a pending one-shot selection. The extension waits
until the corresponding action form is rendered, then uses the existing action
option selection behavior to choose `Pass for this generation`.

After the canonical radio is selected, the extension finds the exact matching
radio in the current `.tfmars420-actions-mirror` and sets its local `checked`
property. It does not click the mirrored radio or dispatch mirrored events,
because the mirror proxies those interactions back to the canonical form and
would otherwise activate the same option twice. A missing or stale mirror does
not make canonical selection fail; the next mirror render inherits the
canonical state.

After selecting the radio, the extension immediately consumes the pending
state. DOM mutations, queue rerenders, and other UI updates do not re-arm it.
The player can therefore select a different radio afterward without the
extension changing it back.

If a queued action executes, the queue executor may replace the default Pass
selection while carrying out that queued action.

## Submission

The default behavior changes only the selected canonical and mirrored radio
state. It never clicks a submit button, sends player input, or passes the player
automatically.

## Rendering and Races

Network response parsing may finish before the game has rendered the new action
form. The pending selection remains available until a matching action form is
observed. It is consumed only after the Pass radio is found and selected.

## Scope

This change does not alter queue contents, queue execution, target selection,
pass detection, or network requests.

## Verification

Focused tests will verify:

- qualifying action models with a Pass option arm the default;
- other prompts and action models without Pass do not arm it;
- qualifying `api/player` and `player/input` responses can both arm the
  default;
- intermediate `player/input` follow-up prompts do not arm it;
- the canonical Pass option is selected once after the form renders;
- the mirrored Pass radio is checked without a click or dispatched event;
- a missing mirror does not block canonical selection;
- later UI updates do not select it again; and
- the one-shot path contains no submit action.
