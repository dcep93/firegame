# Terraforming Mars Navigation Hotkeys Design

## Goal

Add three instant keyboard navigation shortcuts to the Terraforming Mars
extension so the player can move among the page's primary action areas without
manually scrolling.

## Behavior

- `Q` aligns the top of the Actions block with the top of the viewport.
- `W` aligns the top of the Played Cards block with the top of the viewport.
- `E` aligns the bottom of the extension queue panel with the bottom of the
  viewport.
- Scrolling is immediate, not animated.
- Shortcuts work with either lowercase or uppercase letters.

The listener does nothing when:

- the relevant destination is absent or hidden;
- the event has `Ctrl`, `Meta`, or `Alt` pressed, preserving browser and system
  shortcuts; or
- focus is in an input, textarea, select, or editable element, preserving typed
  text and extension controls.

## Implementation

Install one page-level `keydown` listener inside the Terraforming Mars helper
startup path. Map keys to existing stable selectors:

- Actions: `.player_home_block--actions`
- Played Cards: `.player_home_block--cards`
- Extension panel: `#tfmars420-timewarp-panel`

For `Q` and `W`, compute the destination's document-relative top and move the
window there. For `E`, compute the destination's document-relative bottom and
subtract the viewport height. Clamp the final position to zero. Use an explicit
instant window scroll so page CSS cannot introduce animation.

Only prevent the handled key event's default behavior after a visible
destination has been found and a scroll has been requested.

## Verification

Automated tests will cover all three position calculations, uppercase handling,
missing and hidden destinations, modifier keys, and editable targets. The full
extension test suite will run afterward to guard existing queue, autopilot, and
turn-scroll behavior.
