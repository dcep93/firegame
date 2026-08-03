# Terraforming Mars Log Reuse Design

## Goal

Populate theft history from log responses Terraforming Mars already requests, avoiding a redundant extension request for the active generation while retaining complete all-generation history.

## Existing Data Paths

Terraform Contributions does not make its own requests. The content script installs a `window.fetch` wrapper at `document_start`, clones successful player-view responses from `api/player` and `player/input`, and keeps the latest view in memory. The panel derives contribution values from `players[*].globalParameterSteps`, enabled tracks from `game.gameOptions`, and board victory points from `game.spaces`.

Terraforming Mars separately requests `/api/game/logs?id=<participant>&generation=<generation>` whenever its log panel mounts. Player-view refreshes remount that panel, so the page normally downloads a fresh snapshot of the active generation after each state update.

## Reuse-First Acquisition

Extend the existing fetch wrapper to observe successful `api/game/logs` responses. For each request:

1. Parse the participant ID and positive integer generation from the request URL.
2. Assign a monotonically increasing observation sequence when the request begins.
3. Clone the response and parse its JSON without delaying or altering the response returned to the game client.
4. Ignore malformed payloads, mismatched participants, stale observations, and responses from an obsolete player session.
5. Parse theft events with the existing structured-log parser and replace that generation's in-memory snapshot.
6. Mark the generation loaded using the current generation fingerprint and schedule a panel render.

The newest initiated page request wins for a generation even if responses resolve out of order.

## Extension Request Policy

The extension never initiates a request for the active generation. It waits for the game's own log-panel request.

For generations older than the current generation:

- A latched generation is promoted to the immutable `complete` fingerprint without refetching.
- A generation not observed from the page is fetched once through the extension's preserved original fetch function.
- Failed historical requests remain unloaded and retryable.

Using the preserved original fetch function keeps extension-generated historical requests out of the page-response observer and provides a single parsing path for each response.

On reload, the cache starts empty. The active generation fills from the page's request, while only missing historical generations require extension requests.

## Rendering

No Terraform Contributions or theft-table layout changes are required. Both sections continue to render from in-memory state:

- Terraform Contributions from the latest captured player view.
- Theft history from the merged per-generation event snapshots.

While the active generation's first page response is pending, the theft table may show already loaded historical events. If no events are loaded yet, the existing loading state remains visible.

## Failure and Race Handling

- Response cloning or JSON parsing failures are logged and do not affect the game's response.
- A participant ID mismatch is ignored.
- A sequence older than the last accepted observation for that generation cannot overwrite the cache.
- Resetting or switching player sessions invalidates pending observations.
- An active generation is intentionally never self-fetched, even if its page response fails; the next normal game refresh can supply it. Once it becomes historical, it is eligible for the missing-history fallback.

## Testing

Tests will verify:

- log request URL parsing for relative and absolute URLs;
- active-generation exclusion from extension request plans;
- promotion of latched prior generations to `complete`;
- fetching only missing historical generations;
- successful page responses replacing the appropriate generation snapshot;
- repeated active responses refreshing theft events;
- rejection of mismatched participants, malformed payloads, stale sequences, and stale player sessions;
- historical request failures remaining retryable;
- the original fetch function being used for historical requests; and
- unchanged Terraform Contributions rendering and the complete extension regression suite.
