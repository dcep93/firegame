# Global Tag Clicks for Hand Sorting

## Goal

Allow any real Terraforming Mars tag icon anywhere on the game page to select
the existing local hand-sort tag. This expands the source of sorting clicks
without changing the hand grouping algorithm, queue state, or network behavior.

## Event Delegation

Install one capture-phase click listener on `document`. Delegation allows
existing and dynamically rendered tag icons to work without attaching a
listener to every element or depending on a particular Vue render.

The listener acts only when:

- Terraforming Mars helpers are active;
- the click resolves to a recognized real tag;
- a sortable player hand exists; and
- the current per-player extension session is available.

When those conditions are not met, the listener leaves the event untouched so
the page's native behavior continues.

When they are met, the listener prevents the native click and stops propagation
before card-rank cycling, card filters, or other page handlers. It updates
`handSortMode` through the existing session helper, which schedules a local hand
rerender without a request.

## Recognized Tags

Use an explicit set matching the upstream Terraforming Mars tag enum:

- animal
- building
- city
- clone
- crime
- earth
- event
- jovian
- mars
- microbe
- moon
- plant
- power
- science
- space
- venus
- wild

Resolve those tag names from the page's real icon class forms:

- `tag-<type>`
- `card-tag-<type>`
- `track-tag-<type>`

This covers card headers, card requirements and effects, rendered log entries,
preview cards, player tag counts, planetary tracks, policies, colonies, help
content, and other currently or dynamically rendered tag icons.

Classes that merely contain the word "tag" are not controls. In particular,
generic counters and layout classes, `tag-none`, `tag-asterisk`, special
resource icons, size classes, victory points, and Terraform Rating are ignored.

## State Transition

The existing transition remains authoritative:

- clicking a tag different from the current mode selects that tag;
- clicking the currently selected tag clears the mode to `null`, returning to
  cost order.

The hand's tag extraction and greedy grouping remain unchanged. Only the
locations from which a user can select the first tag are expanded.

## Scope and Safety

The behavior is local-only. A global tag click does not:

- make a fetch or player-input request;
- submit an action;
- select, play, buy, or enqueue a card;
- change queue contents; or
- alter the saved mode for another player ID.

The existing hand-only delegated tag handler will be removed so a hand-header
tag click is processed exactly once. Cost clicks remain scoped to the hand and
continue using their existing cost/server-order cycle.

## Verification

Focused tests will verify:

- every upstream real tag type is recognized;
- `tag-*`, `card-tag-*`, and `track-tag-*` class forms resolve correctly;
- unrelated, malformed, `none`, and `asterisk` classes are rejected;
- a dynamically supplied tag element works through document delegation;
- valid clicks use the existing tag-mode transition;
- valid clicks are consumed before other handlers;
- clicks remain untouched when the hand or session is unavailable;
- hand cost clicks retain their existing behavior;
- hand card-rank cycling ignores tag clicks; and
- the global handler contains no request, submit, queue mutation, or card-play
  behavior.
