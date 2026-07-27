# Extension Release Consolidation Design

## Goal

Make `v1.0.6` the only public Firegame release and version tag, describe the
complete extension in language useful to players, and preserve that standard
for future extension releases.

## Public Release

- Keep the existing `v1.0.6` release, URL, and tag.
- Delete the empty `v1.0.0` release and its tag.
- Replace the stale `v1.0.6` description. It must not claim that the Chrome
  manifest carries the user-facing release number.
- Organize the notes by audience-visible area:
  - Terraforming Mars
  - Autopilot modes
  - Colonist
  - Controls and updates
- Describe what players can do. Avoid commit hashes, test counts, internal
  function names, implementation details, and developer-oriented chronology.

## Feature Coverage

The Terraforming Mars section will cover:

- shared new-game settings and the latest-game lobby link;
- the pink enable/disable control and visible release number;
- recent-card previews;
- local hand sorting by price, original order, or tags;
- live score and board-contribution helpers;
- queued cards, played-card actions, card resource targets, passes, and radio
  choices;
- immediate execution when an enqueued action is already available;
- optional automatic queue processing, manual execution, removal, and clearing;
- turn detection, pass preselection without automatic submission, and
  turn-triggered scrolling;
- remembered quick choices for repeated card actions;
- the persistent Escape, Got a Lotta Energy, and Buy Everything autopilots;
- special Escape handling for research purchases, World Government Terraforming
  ocean placement, and final greenery prompts.

The Colonist section will cover:

- the pink `420` control;
- full dice-history scanning, including virtualized logs;
- a live table for sums 2 through 12 showing how many turns ago each sum rolled;
- automatic refresh while the overlay is open;
- copying the full readable game log to the clipboard when the overlay opens.

The controls and updates section will cover:

- per-browser enable/disable behavior;
- the content-only update button and automatic page refresh;
- the user-facing `v1.0.6` label traveling with `content.js`.

## Repository Guidance

Create `extension/AGENTS.md`. It will require any future request to make an
extension GitHub release to include a changelog written for nontechnical users.
The changelog must:

- explain visible benefits and behavior;
- group changes by site or feature area;
- distinguish the package manifest version from the user-facing content
  release version;
- avoid raw commit summaries, internal symbols, and test-only details;
- mention installation or update effects when they changed.

## Verification

- Confirm GitHub lists only `v1.0.6` as a release.
- Confirm only the `v1.0.6` release tag remains.
- Confirm the `v1.0.6` body contains both Terraforming Mars and Colonist
  sections and no stale manifest-version claim.
- Confirm `extension/AGENTS.md` contains the future-release rule.
- Run repository whitespace checks and the extension test suite.
- Commit and push the repository documentation changes.
