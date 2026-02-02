# Catann Skill Guide (authoritative, self-updating)

This document is the **single source of truth** for working on Catann tests and
related tooling. Update it in-place whenever new knowledge is discovered so it
stays accurate and complete. Do **not** add a changelog.

## Purpose
- Ensure the Catann test workflow is repeatable and reliable.
- Capture discoveries about how the Catann test harness and `catann_files` work.

## Key implementation facts
- The Catann parent route (`src/routes/catann/app/Catann.tsx`) renders
  `FirebaseWrapper` and injects `IframeScriptString()` into the iframe document;
  the iframe loads `/` and the parent writes a minimal HTML shell with the
  script tag.
- The Catann iframe script (`src/routes/catann/app/IframeScriptString.ts`) loads
  the Colonist client from `public/public_catann/index.html`, and in dev mode
  rewrites CDN asset URLs to `/public_catann/catann_files` so assets and bundles
  load locally.
- WebSocket traffic is intercepted in the iframe:
  - `WebSocket.send` posts `{ catann: true, id, clientData }` to the parent.
  - The parent test listens for `message` events and records `clientData` bytes
    for comparison.
- `handleMessage.ts` parses `clientData` bytes via `parseClientData`, appends
  `clientData`/`serverData` entries to `window.__socketCatannMessages`, and
  responds via `packServerData` so the iframe sees server-shaped responses.
- Firebase is currently mocked (`FirebaseWrapper` has `SHOULD_MOCK = true`):
  `setFirebaseData` feeds `receiveFirebaseDataCatann`, which sends
  `GameStateUpdated` diffs via `sendToMainSocket`. This is the current
  client-side “server loop” that will later be backed by Firebase.
- `catann_files` enums in `src/routes/catann/app/catann_files_enums.ts` mirror
  values extracted from the Colonist bundles under
  `public/public_catann/catann_files` and are used by Catann logic.

## Test expectations and comparisons
- `starting_settlement.json` stores expected `socket.send` byte arrays for the
  starting settlement flow.
- The Playwright test compares captured `socket.send` messages to the expected
  list **after filtering ignorable heartbeats** (payloads that start with
  `[4, 8, ...]`).
- `isRealMessage` in `playwright_test.spec.ts` filters out:
  - SocketMonitorUpdate payloads.
  - Client actions: `ClickedDice`, `SelectedTile`, settlement/road confirm,
    `RequestBeginnerHint`, and `SelectedInitialPlacementIndex`.
  - SelectedCards payloads with a `-1` key.
- The `single_player` recording expects a robber-roll highlight clear
  (type 33 with empty payload) followed by a game-state update that sets
  `mechanicRobberState.locationTileIndex` before a pass-turn action resumes
  the flow.
- Only click interactions should drive the test flow; you are never allowed
  to introduce DOM or style manipulation code. 
- `yarn lint` is the typecheck gate for Catann changes; if it fails (for example,
  duplicate keys in the controller), fix and rerun before proceeding.

## Recording choreographies
- Clear the buffer with `window.__socketCatannMessages.splice(0)` in the parent
  window, perform clicks, then capture the buffer (apply the `isRealMessage`
  filtering rules before saving JSON).
- Tests seed `window.__testOverrides` (mapState, session, startTime,
  databaseGame) before clicking Start; recordings should align with those
  injected values when you regenerate JSON fixtures.

## Asset and file locations
- Catann client assets: `public/public_catann/catann_files/`
- Catann test harness: `src/routes/catann/test/playwright_test.spec.ts`
- Expected message recordings:
  `src/routes/catann/test/starting_settlement.json`,
  `src/routes/catann/test/single_player.json`,
  `src/routes/catann/test/two_player.json`
