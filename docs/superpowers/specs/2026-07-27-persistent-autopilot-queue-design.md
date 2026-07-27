# Persistent Autopilot Queue Items

## Goal

Make every queued autopilot a persistent rule rather than a consumable action.
Executing an autopilot must leave it in its exact queue position until the user
removes it explicitly.

Clicking `enqueue autopilot` during a compatible prompt also executes the newly
added autopilot immediately, while retaining it in the queue.

## Persistence

An item is persistent when `item.type === "autopilot"`.

For automatic and manual indexed execution:

- do not remove a persistent item before execution;
- leave it at the same index after success;
- leave it and every other queue item intact after failure; and
- preserve the existing audit source (`automatic` or `manual`).

The item remains until the user removes it with its row X button or uses Clear
queue. Reordering is not introduced.

This same-position policy is deliberate. A persistent autopilot at the front
continues receiving every compatible automatic opportunity. Items behind it do
not advance automatically until the autopilot is removed, although their
manual check controls continue to work when eligible.

Duplicate autopilots remain valid and independently removable.

## Immediate Enqueue Execution

Clicking `enqueue autopilot` always appends exactly one item containing the
currently selected mode.

After persistence succeeds:

1. test whether the newly created item is executable against the current
   prompt;
2. if it is, start it immediately with execution source `immediate`;
3. do not remove or redundantly append the item; and
4. leave it at the appended index after success or failure.

This immediate cut-the-line attempt is independent of the Autoqueue checkbox,
matching the extension’s other immediate Enqueue controls. Autoqueue still
governs all future automatic runs of the retained item.

If the current prompt cannot accept the autopilot, enqueueing simply leaves the
new item waiting at the end of the queue.

## Failure Behavior

Persistent items must never enter the consumable-item failure paths:

- an automatic autopilot failure must not clear the queue;
- a manual autopilot failure must not restore a duplicate copy; and
- an immediate autopilot failure must not remove the newly queued item.

The normal queue error remains visible. The existing execution-attempt guard
prevents automatic tight retry loops until a meaningful subsequent update
re-arms queue processing. Manual retry remains available through the row check
button.

Consumable queue items retain their current behavior:

- manual failure restores the removed item at its prior index; and
- automatic failure clears the remaining queue.

## Execution Flow

Introduce one narrow queue-policy helper, such as
`isPersistentQueueItem(item)`, and use it in indexed execution.

For a consumable item, retain the current remove-before-run lifecycle.

For a persistent item:

- read it from the requested index;
- validate current executability normally;
- start execution without mutating persisted queue state; and
- omit removal, restoration, and clearing callbacks.

Immediate autopilot enqueue uses the existing direct execution entry point only
after the item has been written to the queue. The direct executor already runs
without removing queue state, so the newly appended item remains visible.

## Autoqueue Interaction

- Autoqueue off: an eligible enqueue click may execute the new autopilot once,
  then future runs wait for manual execution or Autoqueue being enabled.
- Autoqueue on: an eligible enqueue click may execute immediately; afterward,
  normal scheduler updates may run the persistent queue-head autopilot again
  when a new compatible prompt arrives.
- Enqueueing an ineligible autopilot never forces execution.
- No code reads, clicks, or manipulates the rendered Autoqueue checkbox.

## Alternatives Rejected

Removing and re-adding an autopilot after each run can reorder the queue, create
duplicates after partial failures, and violate exact-position persistence.

Representing autopilot as separate hidden session state would break the visible
queue’s X-button ownership and make ordering unclear.

A persistent-item policy inside the existing queue lifecycle keeps the queue
as the single source of truth.

## Scope

This change does not alter:

- the Escape or energy execution algorithms;
- World Government prompt handling;
- queue labels or autopilot mode persistence;
- immediate behavior of non-autopilot Enqueue controls;
- removal, Clear queue, or manual row controls;
- hand sorting;
- turn scrolling; or
- network default-Pass behavior.

## Verification

Tests will cover:

- persistent-item classification limited to autopilot;
- same-position retention after automatic and manual success;
- autopilot retention after automatic and manual failure;
- no automatic queue clearing or duplicate restoration for autopilot;
- unchanged consumable-item success and failure behavior;
- enqueueing exactly one autopilot;
- immediate eligible enqueue execution independent of Autoqueue;
- retained queue state after immediate success and failure;
- ineligible enqueue waiting without execution;
- duplicate autopilot entries;
- row X and Clear queue remaining the explicit removal paths; and
- the focused and full extension test suites.
