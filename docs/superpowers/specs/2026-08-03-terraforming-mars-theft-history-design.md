# Terraforming Mars Theft History

## Goal

Show every theft from every generation of the current Terraforming Mars game
directly below the extension's Terraform Contributions table. Each entry must
identify the thief, the complete stolen quantity or production descriptor, and
the victim without assuming that the theft concerns production.

## Source Data

The game exposes one structured log response per generation at
`api/game/logs?id=<player-id>&generation=<number>`. The current player view
provides the player ID, current generation, and the mapping from player colors
to player names.

Each log entry contains a message template, typed substitution data, and a
timestamp. For example, a non-production theft uses a template equivalent to
`${3} stole ${1} ${2} from ${0}`, while a production theft includes the word
`production` before `from`. Player substitutions contain colors, not display
names.

The extension will request each generation in the background. Completed
generations are cached in memory for the current player ID. The active
generation remains refreshable because new events can be appended to it. No
visible generation tab will be clicked or changed.

## Theft Parsing

Resolve every message-template placeholder from its indexed data item. Player
data items are converted from colors to current player names; other values are
preserved as displayed by the game.

Treat an entry as a theft only when its resolved template has the structural
form:

`<player> stole <descriptor> from <player>`

The descriptor is the complete normalized text between `stole` and `from`.
Examples include `1 steel production`, `1 energy production`, and `3 M€`.
The parser must not require or remove the word `production`.

Retain the timestamp and generation with each parsed event. Sort chronologically
and deduplicate by generation, timestamp, thief, descriptor, and victim so
reloading the active generation cannot duplicate a line.

Malformed responses, unresolved player colors, missing placeholders, and
messages that merely contain similar words but do not match the full structure
are ignored safely.

## User Interface

Append a compact **Theft history** block immediately below the Terraform
Contributions table inside the existing live-score section.

Render one chronological line per event in this form:

`🕑 dan stole 3 M€ from neil`

The thief and victim names are visually bold and use their known Terraforming
Mars player-color classes. The descriptor remains plain text. Construct the
line with DOM text nodes and elements rather than HTML interpolation.

While generation requests are pending, render the history already available.
When no theft exists after the requested generations have loaded, show
`No theft recorded.` A failed generation request must not erase successfully
loaded history; the next normal update may retry that generation.

## Lifecycle

Reset in-memory theft state when the player ID changes. Stop issuing requests
and remove the UI when Terraforming Mars helpers are disabled. Re-render the
queue panel after a request adds or changes theft history, while avoiding
duplicate in-flight requests and render loops.

The feature does not write theft history to local storage because the complete
current-game history is reconstructable from the game's generation endpoints.

## Scope

Do not alter the native game log, selected generation, Terraform Contributions
calculations, queue behavior, player-view capture, card previews, or completed
game results pages.

## Verification

Automated tests will cover:

- indexed log-message substitution and player color-to-name resolution;
- production thefts and direct-resource thefts such as `3 M€`;
- malformed, non-theft, and unresolved-player messages;
- chronological sorting and duplicate suppression;
- generation request caching with an active-generation refresh;
- UI placement below the contribution table, bold colored player names, and
  the empty state;
- request failures preserving previously loaded events; and
- the complete extension test suite, JavaScript syntax checks, and
  `git diff --check`.
