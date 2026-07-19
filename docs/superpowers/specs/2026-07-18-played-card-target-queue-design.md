# Played-Card Target Queue

## Goal

Allow a player to queue a played card as the target of a later card-selection action, such as `Select card to add 1 Floater`.

## Played-Card Controls

For every played corporation, Prelude, and blue active card:

- show a compact `enqueue target` button;
- do not inspect resource type, resource count, or current target-form eligibility; and
- allow target queuing even when the card is marked `card-unavailable` as an action source.

An unused action card also keeps its existing action control, relabeled `enqueue action`. Both controls use a smaller two-button layout. Queued controls toggle to `dequeue target` and `dequeue action` respectively.

Corporations are recognized by `.card-title.is-corporation`, Preludes by `.card-title.background-color-prelude`, and blue cards by `.card-title.background-color-active`. Automated and event cards do not receive target controls.

## Queue Data and Display

Store targets with the existing card identity fields:

```js
{
  type: "cardTarget",
  cardName: "Floating Trade Hub",
  cardSlug: "floating-trade-hub",
  cardKey: "floating-trade-hub"
}
```

The queue list displays the item as `target: Card Name`.

## Execution

A `cardTarget` item waits for a live follow-up action form rather than the outer `Take your first/next action` form. The executor:

1. Searches cardboxes inside the actions section using the existing name/slug/key identity matching.
2. Selects the matching card's radio or checkbox without checking resource semantics.
3. Advances one frame.
4. Clicks an exact `Add resource` or `Add resources` submit control.

## Failure Behavior

If the queued card is absent from the target form, cannot be selected, or the expected submit control is missing or disabled, execution throws. The existing error path displays the error and clears the remaining queue.

## Scope and Verification

Preserve pass, project-card, played-action, indexed-radio, cost, and queue removal behavior along with all pre-existing uncommitted changes. Verify syntax and whitespace; assert source coverage for target creation, target labels, follow-up phase gating, identity selection, and strict resource submission. The inspected live form offers Floating Trade Hub and Dirigibles as radio targets and uses `Add resource` as its submit label.
