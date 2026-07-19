# Played-Action Enqueue Eligibility

## Goal

Show the enqueue control for every unused played card that has an action, including action-bearing corporations and Preludes.

## Eligibility Rule

A played card is eligible when:

- its rendered text contains `Action:` case-insensitively; and
- neither its card container nor a descendant is marked `card-unavailable`.

Card color and type classes do not affect eligibility. The existing player-session and passed-player guards remain unchanged.

## Implementation

Update `isUnusedPlayedActionCard` in `extension/content.js` by removing the `background-color-active` requirement. Do not change queue execution, card identity, styling, or the Chrome manifest version.

## Expected Behavior

- Tycho Magnetics, Floating Trade Hub, and Dirigibles receive enqueue controls while available.
- Board of Directors does not receive a control after use because its container has `card-unavailable`.
- An enqueued card continues to show `dequeue` through the existing queue-state logic.

## Verification

Run JavaScript syntax and whitespace checks. Confirm the predicate still rejects unavailable cards and accepts available action cards without requiring a card-type class. Preserve all pre-existing uncommitted changes in `extension/content.js` and `extension/manifest.json`.
