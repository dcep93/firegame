# Catann Choreography Notes

- Pass turn handling for the single-player choreo currently stages a second pass
  attempt by toggling `currentState.actionState` without sending a game update,
  then processing the real pass on the next click.
- Dice rolls that total 7 should switch `currentState.actionState` to
  `PlaceRobberOrPirate`, shorten `allocatedTime` to 40, skip resource
  distribution, and emit highlight updates for robber placement.
- Robber highlight tiles currently match the recorded `single_player.json` list:
  `[0, 2, 3, 4, 5, 6, 8, 9, 10, 11, 14, 15]`.
- After the robber roll update (sequence 49), the next expected client action is
  a pass-turn click (`GAME_ACTION.PassedTurn`, action 6), followed by reset
  trade state (type 80) and a new turn-state update.
- After the robber roll (sequence 49) and the subsequent pass-turn click (action 6, sequence 37), the recorded single_player flow expects a reset trade state update (type 80, sequence 50) and a follow-on GameStateUpdated message; choreo must continue past this point to drain expected messages.
- `applyGameAction` only handles a narrow set of actions (confirm road/settlement,
  clicked dice, passed turn, selected initial placement). Any unhandled
  `clientData` that isn't filtered out by `isRealMessage` will surface as a
  `not implemented` error in `handleMessage.ts`.
- `Controller.rollNextDice()` reads the next expected dice roll from the
  recording and sets `window.parent.__diceState` before clicking the dice, so
  mismatched recordings often point to an out-of-sync expectedMessages list.
