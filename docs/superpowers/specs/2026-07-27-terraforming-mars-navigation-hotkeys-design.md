# Terraforming Mars Navigation Hotkeys Design

## Goal

Add three instant keyboard navigation shortcuts to the Terraforming Mars
extension so the player can move among the page's primary action areas without
manually scrolling.

## Behavior

- `Q` aligns the top of the Actions block with the vertical midpoint of the
  viewport.
- `W` aligns the top of the Played Cards block with the top of the viewport.
- `E` jumps to the bottom of the page.
- Scrolling is immediate, not animated.
- Shortcuts work with either lowercase or uppercase letters.

The listener does nothing when:

- the relevant `Q` or `W` destination is absent or hidden;
- the event has `Ctrl`, `Meta`, or `Alt` pressed, preserving browser and system
  shortcuts; or
- focus is in an input, textarea, select, or editable element, preserving typed
  text and extension controls.

## Implementation

Install one page-level `keydown` listener inside the Terraforming Mars helper
startup path. Map keys to existing stable selectors:

- Actions: `.player_home_block--actions`
- Played Cards: `.player_home_block--cards`

For `Q`, compute the Actions block's document-relative top and subtract half
the viewport height, clamping the result to zero. For `W`, compute the Played
Cards block's document-relative top. For `E`, use the document element's total
scroll height as the destination. Use an explicit instant window scroll so page
CSS cannot introduce animation.

Only prevent the handled key event's default behavior after a valid destination
has been resolved and a scroll has been requested.

## Verification

Automated tests will cover the Actions midpoint and top-of-page clamp, the
Played Cards top calculation, the page-bottom destination, uppercase handling,
missing and hidden destinations, modifier keys, and editable targets. The full
extension test suite will run afterward to guard existing queue, autopilot, and
turn-scroll behavior.
