# Local Hand Sorting

## Goal

Render the current player's hand in a deterministic local order without making
any network request. The default order is current card cost from lowest to
highest. Clicking a card's displayed tag switches to a greedy tag grouping, and
clicking a card's displayed cost alternates between cost order and the order
most recently delivered by the server.

Sorting applies only to cards in the player's actual hand. It does not reorder
drafted-card displays or other card collections.

## Local State and Lifetime

Add an optional `handSortMode` field to the extension's existing
`tfmars420:session` record:

- `null` means cost order and is the default;
- `"server"` means server-delivered order; and
- a tag type string means greedy tag order beginning with that tag.

The existing session record is a single `localStorage` entry associated with
the latest player ID. When the extension sees a different player ID, it replaces
the record with a fresh session. Adding `handSortMode` therefore does not create
one storage key per game and does not cause unbounded growth. Existing saved
sessions without the field are read as `null`.

The base game's separate `cardOrder<playerId>` storage is not used. That system
creates separate keys for player IDs and has no cleanup behavior relevant to
this extension.

## Hand and Server Order

The sortable hand is `#shortkey-hand .sortable-cards`. The extension reorders
only its direct card wrapper children by moving the existing DOM nodes. Moving
nodes preserves the card components and their attached behavior.

The authoritative tie-break order comes from the latest captured player view:
prelude cards, then CEO cards, then project cards, each in the order delivered
by the server. DOM card identities are matched to those entries. If captured
server data is temporarily unavailable or a rendered card cannot be matched,
the card retains its relative DOM order after matched cards with the same sort
priority. Sorting never fetches additional data.

When Vue replaces or rerenders the hand, the extension reapplies the saved mode
through its existing local update cycle.

## Cost Order

Cost order uses each card's currently displayed effective numeric cost,
including a visible discounted cost when present. Cards sort numerically from
lowest to highest. Equal costs retain server order.

Cards without a usable numeric cost sort after priced cards and retain server
order relative to one another.

## Tag Categories

Only tags displayed in the card's top-level card-tag row are clickable sorting
categories. Tag icons elsewhere in requirements, effects, or descriptions are
not sorting controls.

The extension derives the tag type from the tag element's `tag-*` class. The
visual `tag-asterisk` overflow marker is not a real category and does not change
the sort mode. Event cards additionally receive a synthetic `event` category
from their event card type, allowing events to participate in grouping even
though event is not rendered as an ordinary resource tag.

## Tag Grouping Algorithm

For a selected tag `T`:

1. Start with all hand cards in server order.
2. Emit every unplaced card containing `T`, retaining server order.
3. Count every tag category on the remaining unplaced cards.
4. Choose the category with the greatest count. Break equal counts by category
   name in alphabetical order.
5. Emit every remaining card containing that category, retaining server order.
6. Recompute counts from the still-unplaced cards and repeat.
7. If no remaining card has a category, append all leftovers in server order.

A multi-tag card is emitted only once. After placement, none of its other tags
contribute to later category counts.

## Click State Transitions

Clicking a real top-level card tag:

- sets that tag when any other mode is active; or
- clears the mode to `null` when the same tag is already selected.

Repeated clicks on the same tag therefore produce:

`anything -> tag -> null -> tag -> null`

Clicking a card cost:

- changes any tag mode to `null` (cost order);
- changes `null` to `"server"`; and
- changes `"server"` back to `null`.

After leaving a tag mode, later cost clicks therefore alternate between cost
and server order.

Tag and cost clicks take precedence over the existing whole-card rank cycling
listener. They update local state and reorder the hand but do not select, play,
buy, submit, or enqueue the card. No additional active-sort decoration is
introduced.

## Failure Handling

Hand sorting is best-effort and must not interfere with gameplay. If the hand
container, a card identity, a cost, or a tag cannot be parsed, the extension
falls back to stable server or DOM order for the affected card. Invalid saved
sort values are normalized to `null`. A sorting failure must not issue a
request, remove a card, or prevent normal card interaction.

## Verification

Focused tests will verify:

- a fresh or legacy session defaults to cost order;
- session state resets when the player ID changes and remains one bounded
  storage entry;
- cost sorting is numeric and stable by server order;
- discounted displayed costs are used;
- missing-cost cards sort last in server order;
- server mode restores the latest server-delivered order;
- clicking the same tag alternates between that tag and `null`;
- clicking a different tag replaces the selected tag;
- cost clicks follow the tag-to-cost and cost/server alternating cycle;
- the selected tag is emitted first;
- greedy counts are recomputed after every emitted group;
- category-count ties break alphabetically;
- multi-tag cards stop contributing after placement;
- event cards participate through the synthetic event category;
- tagless leftovers retain server order;
- `tag-asterisk` and non-header tag icons do not change the mode;
- only the actual hand is reordered;
- tag and cost clicks do not trigger card-rank cycling;
- rerenders reapply the saved local order; and
- every sorting path performs no remote request or submit action.
