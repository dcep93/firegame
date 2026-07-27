# Resource Targets and Passed-Player Queuing

## Goal

Show `enqueue target` only for cards that can hold resources, and allow players
to prepare card queues after they have passed.

## Target Eligibility

A played card is eligible for `enqueue target` when its rendered card container
contains `.card-resources-counter`.

Terraforming Mars renders this counter through `CardResourceCounter` when the
card model has a resource type. The marker therefore includes resource-holding
cards such as Celestic and Extractor Balloons while excluding cards such as
Nitrogen Shipment.

The extension will no longer infer target eligibility from corporation, prelude,
or active-card title classes. It will not parse card descriptions, inspect
resource icons embedded in effects, or maintain a hard-coded card-name list.

## Queuing After Passing

Passing will no longer hide card queue controls. A passed player can continue
to manage:

- project cards in hand;
- played-card actions; and
- played-card targets.

Existing eligibility rules unrelated to passing remain in effect. In
particular, a played action must still be unused and available.

## Execution

Queue execution remains paused while the current player is passed. Items added
after passing stay in the queue until a later legal action phase, such as the
next generation.

## Scope

This change affects only target-button eligibility and the visibility of card
queue controls after passing. It does not change queue ordering, action
execution, pass detection, card identity matching, target submission, or the
queue panel's existing controls.

## Verification

Focused tests will verify that:

- a played card with `.card-resources-counter` is target-eligible;
- a played card without the counter is not target-eligible;
- title color/type classes no longer determine target eligibility;
- hand, played-action, and played-target queue controls do not depend on passed
  state; and
- queue execution still stops while the player is passed.
