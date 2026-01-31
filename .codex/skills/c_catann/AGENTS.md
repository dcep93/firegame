# Catann Choreography Notes

- Pass turn handling for the single-player choreo currently stages a second pass
  attempt by toggling `currentState.actionState` without sending a game update,
  then processing the real pass on the next click.
- Dice rolls that total 7 should switch `currentState.actionState` to
  `PlaceRobberOrPirate`, shorten `allocatedTime` to 40, skip resource
  distribution, and emit highlight updates for robber placement.
- Robber highlight tiles should use the base list
  `[0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15]` and exclude the current
  `mechanicRobberState.locationTileIndex`.
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
- Auto-placing the robber after a 7 roll should switch from tile 4 on the first
  robber roll to tile 3 on the next (when the current robber location is 4).
- The build-road action button can be clicked via
  `div[class*="actionButton"] img[src*="road_"]` to emit
  `WantToBuildRoad` (action 10) before clicking the road edge.
- Always treat Catann logic as a stand-in for the server: derive updates from
  the current game state (resource counts, player cards, etc.) instead of
  hardcoding values.
- Avoid color-specific UI selectors; use generic asset matches so any player
  color works.
- Responses should start with the codex trigger dictionary
  (`console.log({ codex: ... })`), followed immediately by a screenshot when one
  is available.
- The edge 63 road click in the single-player flow maps to the
  `{ col: 4, row: 5 }` → `{ col: 4, row: 6 }` midpoint; use the unchecked
  click helper if pointer detection blocks it.
- After confirming edge 63, the expected sequence starts with a
  `GameStateUpdateType.ExchangeCards` (type 43) payload before highlight
  resets (31/32/30/33/31/32), skipping the second `HighlightRoadEdges`
  call normally sent by `placeRoad`.
- After the pass-turn following edge 63, the recording continues with
  action 62 (payload false), a dice roll update (type 28 + type 91), and
  another pass-turn loop; choreo must continue to drain sequences 76–79.
- When the robber roll occurs with the current robber location at tile 3, the
  expected auto-placement in the recording moves it to tile 14 (tile info
  diceNumber 5, resourceType 3) before continuing the pass/roll loop.
- Past client action sequence 75, the recording expects empty resource
  distributions for sequence 110; mismatches suggest missing UI actions like
  the action 9 (buy development card) or the action 67/68 reconnect messages.
- After the post-roll pass-turn at sequence 117, the recording expects a
  `clientData` action 7 payload `{ gameId, clientVersion }` followed by
  action 67/68 reconnect messages; current controller helpers cannot emit these,
  so advancing past this point likely requires new choreo clicks or client
  reconnect handling.
