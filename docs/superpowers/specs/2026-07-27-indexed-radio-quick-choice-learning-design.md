# Indexed-Radio Quick-Choice Learning

## Goal

When tfmars420 has armed remembered-choice learning for a played-card action,
completing that action through the extension's `Enqueue option` control must
teach the same exact quick choice as completing it through either visible
Actions panel.

For example, after tfmars420 executes Regolith Eaters, immediately executing
radio option 2 must learn that option for Regolith Eaters once the server
accepts it.

## Selected Approach

Keep the existing explicit learning lifecycle and add an executor-side capture
for indexed radio options. This is narrower and safer than accepting every
synthetic click, and it avoids trying to reconstruct a choice from a later
network response.

The shared queue executor must not discard armed played-action learning merely
because an indexed radio option is about to execute. After selecting the indexed
radio and allowing its children to render:

- If the selected option is a leaf, pass the canonical submit button through
  the existing remembered-choice capture helper before clicking it.
- If the selected option exposes children, leave learning armed and return
  without staging an incomplete recipe. A later supported child completion can
  finish the recipe.

Other follow-up queue items retain their existing lifecycle. `cardTarget`
continues to use its dedicated candidate capture, and remembered quick-choice
playback remains unable to teach itself.

## Confirmation and Persistence

Executor-side capture only stages the exact cleaned option text and any complete
selected target already supported by the existing helper. It does not write the
memory immediately.

The existing network confirmation remains authoritative:

1. Stage the recipe against the current player, played card, and player-input
   key.
2. Click the unique enabled structural submit button.
3. Persist and audit `user.card.quick-choice.learn` only after a subsequent
   same-player network update changes the input key.
4. Discard the staged association if the player, game, or learning context
   becomes invalid.

This prevents a local synthetic click or an unsuccessful server submission from
creating a false memory.

## Failure and Safety

The indexed-radio executor keeps its existing validation for invalid indexes,
disabled options, children, and missing or ambiguous submit buttons. Capture
failure does not weaken those checks or cause a second submit.

The trusted document listener still rejects arbitrary synthetic clicks.
Autopilot and remembered quick-choice playback remain excluded. The executor
calls the canonical capture helper only from the deliberate indexed-radio path.

## Testing

Add regression coverage proving that:

- a leaf indexed-radio execution stages the exact option before its synthetic
  submit;
- the staged choice persists only after the player input advances;
- a branching indexed-radio execution keeps learning armed and does not stage
  an incomplete recipe;
- quick-choice playback and unrelated synthetic document clicks remain
  excluded; and
- the full extension test suite and syntax checks pass.
