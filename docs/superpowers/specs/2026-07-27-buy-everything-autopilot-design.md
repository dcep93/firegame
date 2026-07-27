# Buy Everything Autopilot Design

## Goal

Replace the obsolete selective-card autopilot with a persistent mode named
`buy everything`. At every recognized research-card purchase, it buys every
card the game currently permits it to select, completes the corresponding
payment, and otherwise falls back to Escape.

## Mode Representation and UI

The normalized internal mode is `buyEverything`. Its display label is
`buy everything`.

The Autopilot dropdown order is:

1. `escape`
2. `got a lotta energy`
3. `buy everything`

Queued items render as `autopilot: buy everything` and retain the existing
persistent-autopilot behavior. Successful or failed execution leaves the item
at its queue index until the user removes it.

There is no compatibility migration for obsolete saved values. An unrecognized
historical mode follows the existing normalization fallback to Escape.

## Prompt Recognition

The purchase-selection workflow is recognized only from:

- `Select card(s) to buy`
- `Select up to N card(s) to buy`, where `N` contains one or more digits
- `You cannot afford any cards`

The purchase-payment workflow is recognized only from:

`Select how to spend N M€ for M cards`

Both numeric fields must contain one or more digits. Recognition uses the
captured player-input model first and the scoped rendered action workflow as a
fallback.

On every other eligible prompt, this mode uses the shared Escape executor.

## Purchase Selection

The executor operates only inside the active `.wf-component--select-card`
workflow.

1. Preserve every card that is already selected.
2. Visit card rows in rendered order.
3. Before handling each position, re-read the active workflow and its rows so
   the executor uses the current rendered checkbox state.
4. If that row has an unchecked, enabled checkbox, click it.
5. Wait for the next rendered frame before examining the next row.
6. Skip missing or disabled checkboxes.
7. After visiting every row, re-read the workflow and count every checked card.
8. If one or more cards are selected, click exactly one enabled submit whose
   normalized label is `Buy N` for a positive integer `N`.

Waiting between clicks lets Terraforming Mars enforce affordability and
maximum-selection rules. The extension does not calculate prices, available
megacredits, or a card maximum. Consequently it buys every card the native UI
allows in rendered order, even when that is fewer than all offered cards.

The executor does not reorder cards or issue a separate remote request.

## No-Purchase Fallback

If no card is selected after the pass, click exactly one enabled control in
this priority order:

1. `Skip this action`
2. `Buy 0`
3. `Ok` or `Ok 0`

Missing or duplicate qualifying controls are safe failures.

## Payment

At the exact purchase-payment prompt, leave the native default payment inputs
untouched and click exactly one enabled submit labeled `Pay`. Missing,
disabled, or duplicate Pay controls are safe failures.

## Queue Eligibility and Escape Fallback

`buyEverything` is an Escape-fallback mode. It is eligible for:

- recognized purchase-selection and purchase-payment prompts;
- an enabled exact Pass action;
- World Government Terraforming and its ocean follow-up;
- optional research-card purchase skipping;
- the exact final-greenery opt-out prompt; and
- any later prompt explicitly handled by the shared Escape executor.

It receives the same narrow post-Pass exceptions as Escape for those exact
prompts. Other queue modes and item types remain unchanged.

## Removal Scope

All obsolete mode labels, internal identifiers, helper names, error messages,
tests, and current design references are removed from the working tree. Git
history is not rewritten.

## Error Handling

- Missing purchase or payment workflows fail without guessing.
- Missing and disabled card inputs are skipped.
- Missing or ambiguous positive Buy controls fail without submission.
- Missing or ambiguous no-purchase and Pay controls fail without submission.
- Existing persistent-autopilot failure handling preserves queue position.

## Verification

Tests cover mode normalization, UI order, queue labels, prompt recognition,
selection of all enabled cards in rendered order, preservation of existing
selections, reactive purchase limits, unavailable cards, no-purchase
fallbacks, positive Buy submission, exact Pay submission, Escape fallback,
post-Pass eligibility, persistent queue behavior, and absence of obsolete
identifiers from the current tree.
