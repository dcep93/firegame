# Log Card Preview Identity Safety

## Goal

Render the correct Terraforming Mars card preview when one game-log row names
multiple cards, and prevent a stale or unrelated card panel from being cached
under the requested card's identity.

## Exact Log-Card Targeting

The preview renderer will dispatch its synthetic click from the exact
`.log-card` element selected by `logIndex`. It will no longer replace that
element with its closest log-row `<li>`.

This preserves the event target that distinguishes cards such as Protected
Growth and Lichen when both appear in the same log message. The event continues
to bubble normally so the game's existing delegated click handling still runs.

## Identity-Aware Capture

After clicking a log card, the renderer will wait for the shared card panel to
contain a card whose normalized title or card slug matches the requested log
card. It will capture HTML only after that identity check succeeds.

The wait will be bounded. If the panel never displays the requested card, the
renderer will close the panel, mark that render attempt as handled for the
current page session, and retain the generated fallback preview. This avoids
both incorrect cache entries and an immediate retry loop.

Captured HTML may be indexed by the requested and rendered identities only
after they have been proven equivalent. Existing visible-card reuse and recent
card ordering remain unchanged.

## Error Handling

A missing log-card element remains an execution error. A panel that does not
open or does not reach the expected identity is a recoverable preview miss: it
must not replace another card, block other missing-card renders, or leave the
panel open.

## Scope

Do not change game-log parsing, recent-card deduplication, fallback card
appearance, queue execution, automatic actions, or user-driven game controls.

## Verification

Automated tests will verify:

- two card elements in the same `<li>` receive distinguishable synthetic click
  targets;
- a matching rendered card is captured and cached;
- a mismatched or stale rendered card is rejected;
- a later matching panel state can be captured within the bounded wait;
- a failed attempt retains the fallback without immediately retrying forever;
  and
- the complete extension test suite, JavaScript syntax checks, and
  `git diff --check` pass.
