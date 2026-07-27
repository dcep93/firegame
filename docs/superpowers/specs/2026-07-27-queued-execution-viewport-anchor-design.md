# Queued-Execution Viewport Anchor

## Goal

Keep the same visible Terraforming Mars content in the same viewport position
while an already-queued action causes asynchronous data and DOM updates. This
primarily prevents the canonical top Actions panel from shifting the player's
view when it shrinks or expands.

## Eligibility

Start viewport preservation only for an item executed from an existing queue
row:

- automatic autoprocess execution; or
- manual execution using the queue row's execute control.

Do not activate it for an immediate `enqueue and execute now` action.

Before capturing anything, inspect the canonical
`.player_home_block--actions` rectangle. If any portion of that top Actions
panel intersects the viewport, do not establish an anchor and do not perform
scroll correction for that execution.

## Anchor Capture

When Actions is entirely above the viewport, sample several vertical points in
the current viewport and retain multiple connected, non-fixed elements under
those points with their current viewport-top offsets. Exclude the canonical
Actions panel, the bottom Actions mirror, document roots, and fixed or sticky
overlays.

Also record the canonical Actions panel's bottom offset as a fallback. Multiple
element candidates let preservation survive a component being replaced during
the game's render. The Actions-bottom fallback covers a render that replaces
all sampled descendants while still directly compensating for the panel height
change.

## Correction

After relevant DOM updates, select the first captured element that is still
connected and measure its new viewport-top offset. Scroll only by the residual
difference from its captured offset. If no element survives, perform the same
residual calculation from the current canonical Actions bottom.

Measuring residual movement instead of applying the raw Actions height delta
cooperates with Chrome's native scroll anchoring: if Chrome already preserved
the viewport, the measured difference is zero and tfmars420 does nothing.

If the canonical Actions panel becomes visible before a correction, cancel
preservation without scrolling.

## Lifetime and User Control

Maintain the anchor through the queued executor's local clicks and subsequent
network-driven render. When the same player's input advances, mark the anchor
for release but keep correcting through a short DOM-settling debounce. Clear it
after the resulting render settles.

Clear immediately when:

- queued execution fails;
- the player or game changes;
- the extension is disabled; or
- trusted wheel, touch, or scroll-navigation keyboard input indicates that the
  player is intentionally moving the viewport.

Programmatic correction must not cancel itself.

The existing turn-transition smooth scroll, navigation hotkeys, synchronous
`preserveScrollDuring`, queue order, and action submission behavior remain
unchanged.

## Verification

Tests cover eligibility by execution source, the no-op when Actions is visible,
multiple candidate capture, connected-candidate correction, Actions-bottom
fallback, native-anchor zero residual, cancellation on user scroll input,
network-settle release, failure cleanup, and noninterference with existing
turn-triggered scrolling.
