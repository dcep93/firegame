# Immediate Enqueue Execution and Turn Scroll Policy

## Goal

Make every Enqueue control execute its requested action immediately when that
action can be performed in the current prompt, without temporarily adding it to
the persisted queue. Also remove the turn-scroll behavior that automatically
enabled Autoqueue for an empty queue.

## Turn Scroll

The one-shot turn scroll continues to wait for:

- the current player's turn;
- a live action form;
- the "Take your next action" prompt; and
- an available player queue session.

Once ready:

- if Autoqueue is enabled, consume the pending scroll without scrolling;
- if Autoqueue is disabled, consume the pending scroll and smoothly scroll to
  the bottom, regardless of whether the queue is empty; and
- never change Autoqueue state or query, click, check, or dispatch an event on
  the rendered Autoqueue checkbox.

## Immediate Enqueue Execution

The policy applies to every control whose active operation is Enqueue:

- project cards;
- played-card actions;
- played-card resource targets;
- Pass; and
- indexed radio options.

Each click constructs the same action item that would otherwise be appended to
the queue. Before mutating queue state, it checks the existing execution
readiness contract:

- no queue execution is already in flight;
- it is the current player's turn;
- a live action form exists; and
- the action item matches the current top-level or follow-up prompt.

When those conditions pass, the item executes directly. Direct execution:

- does not add, remove, or reorder persisted queue items;
- ignores the Autoqueue setting;
- may run ahead of already queued items, because the user explicitly clicked
  this action for immediate execution;
- uses the existing item executor and execution-in-flight guard;
- reports failures through the existing queue error UI; and
- leaves a failed item unqueued.

When readiness does not pass, the existing enqueue behavior is preserved.

## Existing Toggle Semantics

Controls that currently toggle between Enqueue and Dequeue keep that behavior.
If an item is already queued, clicking Dequeue only removes it; it does not
execute it.

Played-card target controls remain append-only. If a target can execute
immediately, its queued star count remains unchanged because no new queue entry
is created. Otherwise, the click appends one target entry as it does today.

## Implementation Shape

Introduce one shared immediate-execution helper used by all enqueue click
handlers. It accepts a fully constructed queue item, applies the existing
readiness predicate, and starts execution without a queue index or queue
mutation.

Share the asynchronous execution lifecycle between indexed queued execution and
direct execution:

- mark execution attempted and in flight;
- clear the previous queue error;
- render the queue panel;
- call the existing item executor;
- handle failure according to the caller's persistence policy; and
- clear the in-flight state and schedule the normal follow-up update.

Indexed queued execution keeps its current removal and restoration behavior.
Direct execution has no restoration step because it never persists the item.

## Error Handling

If a direct execution fails after readiness passed, display:

`Could not execute <item label>: <reason>`

The failed item stays unqueued. Existing queue contents and order remain
unchanged.

## Verification

Tests will verify that:

- an empty queue no longer enables Autoqueue during turn scrolling;
- turn scrolling never manipulates the checkbox DOM;
- checked Autoqueue still suppresses the one-shot scroll;
- unchecked Autoqueue scrolls with both empty and nonempty queues;
- each of the five Enqueue control categories attempts direct execution first;
- immediately executable clicks do not mutate queue state;
- non-executable clicks retain their current enqueue behavior;
- Dequeue remains removal-only;
- immediate execution is independent of Autoqueue and existing queue contents;
- direct failures remain unqueued and show the existing error; and
- the full extension suite continues to pass.
