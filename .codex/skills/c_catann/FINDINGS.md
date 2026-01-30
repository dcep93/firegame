
## Pass-turn staging and robber roll highlights
- what would've saved time to get your bearings: The recorded single-player flow expects a second pass click to be staged (no server response) before the actual pass update, and a dice total of 7 triggers robber highlight messages instead of resource distribution.
- what you changed: Added pass-turn staging by toggling `currentState.actionState` between `None` and `SelectCardsToDiscard`, and updated dice roll logic to handle totals of 7 by skipping resource distribution, emitting robber highlights, and setting `actionState` to `PlaceRobberOrPirate` with `allocatedTime` 40.
- why the test isn't passing: The single-player choreo still stops before consuming later expected highlight messages (e.g., additional `HighlightTiles` updates), so `expectedMessages` remains non-empty.
- next suggested step: Extend `singlePlayerChoreo` to continue the recorded flow after the robber roll (likely through the next tile selection/passing sequence), or adjust game logic to emit the remaining expected highlight messages without extra choreo actions.

## Auto-placing robber after a 7 roll
- what would've saved time to get your bearings: The filtered `single_player.json` expects a HighlightTiles clear (type 33, empty payload) and a GameStateUpdated diff that moves the robber before the next pass-turn action, even though the SelectedTile client action is filtered out.
- what you changed: Added `autoPlaceRobber` in `gameLogic/index.ts` to update `mechanicRobberState.locationTileIndex`, log entries (types 11 and 74), clear tile highlights, and emit a follow-up GameStateUpdated after a robber roll.
- why the test isn't passing: The choreography stops after the robber roll; the remaining expected messages start with a pass-turn action (client action 6, sequence 37) and subsequent server updates that aren't triggered.
- next suggested step: Extend `singlePlayerChoreo` with another `passTurn()` and follow-on actions (rolls/build road) to consume the remaining expected messages in `single_player.json`.

## Single-player pass-turn follow-on
- what would've saved time to get your bearings: The recorded single_player flow continues past the robber roll with a pass-turn action that emits a reset trade state (type 80) and follow-on GameStateUpdated messages; stopping after the client pass leaves expected messages queued.
- what you changed: Added an extra pass-turn + verification at the end of singlePlayerChoreo to consume the next clientData action (action 6, sequence 37).
- why the test isn't passing: The choreo still stops before consuming the subsequent serverData reset trade state (type 80, sequence 50) and the rest of the recorded sequence, so expectedMessages remains non-empty.
- next suggested step: Extend singlePlayerChoreo to continue the recorded flow after the pass-turn (wait for reset trade state and continue with the following recorded actions), or expand the choreography to cover the remaining client action sequence from single_player.json.
