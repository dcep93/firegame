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
