# Card-Width Quick Actions

## Goal

Keep every remembered quick-action control at or below the width of the
Terraforming Mars card it belongs to. Long quick-choice labels must wrap within
the card instead of widening the played-card layout.

## Sizing

When tfmars420 renders tools for a hand or played card, read the corresponding
native card container's layout width. Store that width as a CSS custom property
on the card's tools container.

The tools container uses the measured value as its width and maximum width while
remaining bounded by its parent. This follows the game's actual card size rather
than assuming a fixed pixel width, so it continues to work with card variants
and responsive layouts.

If the card does not expose a positive finite layout width, omit the custom
property and retain the current fallback layout.

## Quick-Choice Layout

The quick-choice list must be allowed to shrink within its flex parent by using
`min-width: 0`. Each quick-choice button uses border-box sizing, fills the
available list width, and cannot exceed it. Long labels wrap normally, with
overflow wrapping available for unusually long unbroken text.

The existing action and target buttons retain their two-column sizing and all
controls keep their current appearance and behavior.

## Updates and Cleanup

Refresh the measured card width during each existing card-tools render. This
lets the control width follow a later native card-size change without adding a
new observer.

Removing the tools element removes the inline custom property with it. No
session data, queue behavior, or network behavior changes.

## Verification

Tests cover positive measured widths, missing or invalid widths, rerendered
width changes, and CSS constraints for both the quick-choice list and button.
The full extension syntax and test suite must continue to pass.
