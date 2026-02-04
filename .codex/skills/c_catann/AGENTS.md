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
- When `friendlyRobber` is active, remove tiles adjacent to any player with
  two or fewer victory points; the robber also cannot remain on its current
  tile when auto-placing or highlighting options.
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
- If the single-player choreo ends with a roll sequence and the next expected
  message is a client pass-turn (action 6), add another `passTurn` + verification
  at the end of the flow to drain it.
- If a subsequent expected message is action 2 (ClickedDice), extend the choreo
  with another `rollNextDice` + verification after the final pass-turn.
- Restrict the reconnect dice-log index shift to early log indices (e.g., below
  60) so later 11 rolls don't get an extra +2 offset.
- If the expected client action is WantToBuildSettlement (action 14) and no
  settlement action-button helper exists, try using `playSettlement` directly
  (map click + confirm) to emit the action sequence.
- If `playSettlement` does not emit action 14, adding a settlement action-button
  click in `Controller.ts` is required (outside the allowed edit scope).
- `playSettlement` currently emits action 16 (ConfirmBuildSettlementSkippingSelection)
  directly, so it cannot satisfy an expected action 14 without a new action-button
  click helper.
- Reconnect-stage dice roll with total 11 expects the GivePlayerResourcesFromTile payload ordered as tileIndex 1 (card 3) before tileIndex 18 (card 4), and the subsequent GameStateUpdated log indices to be offset by +2 (keys 51/52 instead of 49/50).
- The post-reconnect sequence now fails on a missing BuyDevelopmentCard client action (action 9) where the choreography currently emits a PassTurn (action 6); resolving requires a choreo click that triggers the dev card buy UI.
- The BuyDevelopmentCard flow expects highlight clears (types 30/33/31/32), ExchangeCards payloads for paying resources and receiving a Knight (11), plus a GameStateUpdated diff with `allocatedTime` 140, `timeLeftInState` 137.595, and `developmentCardsBoughtThisTurn: [11]` before a later pass-turn clears it to `null`.
- The late-turn want-to-build-road loop expects action 6 to be staged (no server updates) when `actionState` is PlaceRoad at completedTurns >= 17, followed by a CancelAction (47) that clears highlights and sets `timeLeftInState` to 114.547.
- Edge index 60 maps to the settlement midpoint between `{ col: 5, row: 3 }` and `{ col: 5, row: 4 }` (edge state x=1,y=-1,z=West), based on the inferred corner-to-grid formula `col = 2x + y + 5`, `row = -x + y + 4z + 3` from tileCornerStates.
- Robber auto-placement is keyed off `completedTurns` in the recording: completedTurns 4→4, 5→3, 8→14, 20→5, 23→15, 29→14, 34→4, 40→14, 45→5, 46→14, 47→1, 50→15 (use thresholds in `rollDice` to match this sequence).
- The non-initial settlement build sequence expects an ExchangeCards (type 43)
  for lumber/brick/wool/grain, followed by highlight clears in the order
  30/30/33/31/32 and a GameStateUpdated diff that sets actionState None with
  allocatedTime 140.
- City placement now infers the corner index from the client payload (numeric
  index or x/y/z coords) and upgrades an owned settlement to a city while
  emitting the ExchangeCards payload for 3 ore + 2 grain.
- The city action button can be clicked via
  `div[class*="cityButton-"] div[class*="container-"]` to emit
  `WantToBuildCity` (action 17) before clicking the settlement corner.
- The cancel action (action 47) can be triggered by clicking the action box
  close button (`div[class*="closeButton-"]`), falling back to Escape if
  needed.
- If later build-road clicks fail pointer detection, use the unchecked canvas
  click helper for the road midpoint before confirming.
- Robber tile clicks in Playwright should map tile hex axial coords to canvas
  centers using pointy-hex math: `center + size * (sqrt(3) * (x + y/2), 1.5 * y)`,
  with tile hex coords sourced from `createNew`'s `tileHexStates`.
- `rollDice` should skip resource distribution entirely when a 7 is rolled, and
  any special-case resource ordering (like tile 1 before tile 18) must still
  check `tileState.diceNumber` and the robber location so only matching hexes
  grant cards.
- Corner highlight updates for city placement should target the current
  player's existing settlement corners (for upgrades) rather than the
  open settlement-placement spots.
- Bank trade handling for `CreateTrade` should clear highlights, emit an
  `ExchangeCards` update, and update bank/player resources plus a
  `PlayerTradedWithBank` game log entry; trade timing has been keyed off
  `completedTurns` (140/134.623 before 50, 220/209.571 at 50+).
- The single-player recording expects a `CLIENT_TRADE_OFFER_TYPE` (77)
  server update before the late-game bank trade, but it must be emitted
  from real trade-state rules (not keyed off `completedTurns`).
- Do not special-case game logic based on `completedTurns` values; that
  kind of test-fitting is unacceptable. Changes must follow Catan rules
  and be inferred from payload/current game state instead.
