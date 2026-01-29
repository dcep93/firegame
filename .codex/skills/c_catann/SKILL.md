---
name: c_catann
description: Capture Colonist.io (catann) websocket traffic by overriding the hashed shared.js bundle, then run a private single-player game to produce a JSON transcript in firegame/app/firegame/src/routes/catann/test. Use when asked to override Colonist assets, log socket messages, or record a full solo game.
---

# Skill: c_catann

## Overview

Override Colonist's hashed shared bundle to log websocket traffic, run a full solo game, and save the captured messages as JSON in the catann test fixtures folder.

## Workflow

1. Locate the active shared bundle

- Open colonist.io and find the `<script defer src=".../shared.<hash>.js">` tag.
- Use the hash to identify the local files:
  - Override target: `firegame/app/firegame/public/public_catann/overrides/cdn.colonist.io/dist/js/shared.<hash>.js`
  - Local copy: `firegame/app/firegame/public/public_catann/catann_files/shared.<hash>.js`

2. Apply the websocket logging override

- Ensure both files above contain the same instrumentation.
- Required behavior:
  - Initialize `window.__socketCatannMessages = [];` once at load.
  - Log a console sanity check (e.g., `console.log("initialized socketCatannMessages")`).
  - On incoming socket messages, append:
    - `{ trigger: "serverData", data: <deep-copied message payload> }`
  - On outgoing socket messages, append:
    - `{ trigger: "clientData", data: <deep-copied message payload> }`
- Keep the override minimal and resilient: no format changes, just append and log.

3. Ensure the override is used

- Confirm that the overridden file is served instead of the CDN version on subsequent visits.
- If needed, refresh and verify the console log appears.

4. Create a private solo room

- Navigate to colonist.io.
- Click "Rooms" in the sidebar.
- Create a room, set it to private, and confirm no other players are present.
- Start the game.

5. Play a full single-player game

- Make reasonably intelligent moves (build for expansion, secure ports if possible, balance resources).
- Finish the game to the end state.

6. Extract and save socket messages

- In the browser console, read `window.__socketCatannMessages`.
- Serialize to JSON and save to:
  - `firegame/app/firegame/src/routes/catann/test/<relevant_name>.json`
- Use a relevant filename (e.g., `single_player_<date>.json`) and keep it valid JSON.

## Notes

- If the shared bundle hash changes, repeat the override on the new hash.
- Keep `overrides/` and `catann_files/` in sync.
