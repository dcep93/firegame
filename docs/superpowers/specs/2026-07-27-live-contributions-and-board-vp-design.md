# Live Contributions and Board VP Design

## Goal

Add a live player table to the bottom of the Terraforming Mars extension box.
The table shows authoritative global-parameter contributions when the server
exposes them and exact current greenery/city victory points calculated from the
public board snapshot.

The feature must not parse logs, maintain a historical counter, or persist
derived scores.

## Placement and presentation

Render the table inside `#tfmars420-timewarp-panel` after the existing queue
controls, making it the final section of the extension box.

Keep players in the order supplied by `latestPlayerView.players`. Use the
game's native parameter/tile icon classes where available and visually identify
rows with the player's server-supplied color.

The columns are:

- player;
- temperature contributions;
- oxygen contributions;
- ocean contributions;
- each supported optional global track enabled for the current game, including
  Venus;
- contribution total;
- greenery VP; and
- city VP.

Base global columns are always present. Optional columns are present only when
their corresponding expansion/track is enabled or represented by the current
game model. Moon tracks may be included when enabled; unrelated expansion
metrics are out of scope.

## Authoritative contribution data

Read contribution values from each public player model's
`globalParameterSteps` object. A non-empty object is authoritative, including
legitimate zero values.

The server normally exposes these values for the current player. It also
exposes them for every player at game end, in solo games, or when the game's
other-player-VP visibility option is enabled.

If a player's contribution object is empty or missing:

- display `—` in every contribution cell for that player;
- display `—` in that player's contribution-total cell; and
- do not estimate the values from totals, logs, active-player state, or prior
  snapshots.

The current player's exposed data and all end-game data remain direct server
values.

## Board VP calculation

Calculate greenery and city VP from `latestPlayerView.game.spaces` on every
render.

Use the server's tile classifications:

- greenery tiles include normal greenery and Wetlands;
- city tiles include normal cities, Capital, Ocean City, Red City, and New
  Holland.

Ownership comes from each space's `color`; `coOwner` also counts as ownership
when supplied by the server.

Greenery VP is one point for every greenery tile owned or co-owned by the
player.

City VP is one point for every greenery tile adjacent to each city tile owned
or co-owned by the player. Greenery ownership does not matter for city VP.
Determine adjacency from the board's public `x`/`y` coordinates using the same
odd-row hex geometry as the upstream server. Colony/off-board spaces do not
participate.

These calculations are stateless and are repeated from the complete public
board model, so refreshes, missed updates, and undo operations cannot cause
drift.

## Update flow and isolation

The existing `api/player` and `player/input` capture already stores the latest
player view and schedules the Terraforming Mars UI update. Add pure helpers for
optional-column selection, contribution formatting, adjacency, and board VP.

`renderQueuePanel` appends the new table after the queue action controls. If the
player or board arrays are unavailable, omit the table or show unavailable
cells without throwing. Queue rendering and execution must continue normally
if score data is incomplete.

No new network request, localStorage field, log observer, or mutation observer
is required.

## Verification

Tests cover:

- exposed global contributions and totals;
- hidden opponent contributions rendering as `—`;
- preservation of legitimate zeros;
- base and optional global columns;
- normal and variant greenery/city tile types;
- ownership and co-ownership;
- edge, corner, and middle-row hex adjacency;
- city VP from adjacent greenery regardless of greenery owner;
- table placement after the queue controls; and
- graceful behavior for incomplete player/game snapshots.

Run the complete extension Node test suite, JavaScript syntax validation, and
`git diff --check`.
