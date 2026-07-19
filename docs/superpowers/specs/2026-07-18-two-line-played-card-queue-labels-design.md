# Two-Line Played-Card Queue Labels

## Goal

Make the played-card action and target queue buttons easier to scan by placing each word of their labels on its own line.

## Behavior

The four dynamic button states render as two lines:

- `enqueue` above `action`
- `dequeue` above `action`
- `enqueue` above `target`
- `dequeue` above `target`

The line break is explicit in the button content so it does not depend on the available width. Button titles, queue behavior, styling, dimensions, and all other controls remain unchanged.

## Implementation

Update the played-card action and target label construction in `extension/content.js` to use an explicit line break for both queued and unqueued states. Keep the accessible button name readable as the same two words.

## Verification

Add or update focused automated coverage that confirms the action and target labels contain the explicit line break in both enqueue and dequeue states. Run the extension's relevant test suite and syntax checks.
