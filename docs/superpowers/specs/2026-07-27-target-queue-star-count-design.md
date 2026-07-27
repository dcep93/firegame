# Target Queue Star Count

## Goal

Show how many times a played card is currently queued as a target without
changing the target control's append-only behavior.

## Label

The target control keeps its two-line label:

```text
enqueue
target ***
```

The suffix contains exactly one `*` for each matching queued `cardTarget`.
There is no suffix or trailing space when the count is zero.

The control remains blue and always appends another target when clicked. It
does not become a dequeue toggle.

## Counting

Target occurrences will be matched with the same card identity fields used by
the existing queue controls: card key, slug, and normalized card name. Only
`cardTarget` items for the current card contribute to its star count.

The displayed count updates whenever queue state is rendered, including after:

- enqueueing another target;
- removing an individual queue row; and
- clearing the queue.

The count is not capped or abbreviated.

## Accessibility

The button tooltip will include the numeric count when nonzero, such as
`Enqueue target (3 queued)`. At zero it remains `Enqueue target`.

## Scope

This change affects only the played-card target button's label and tooltip. It
does not change target eligibility, queue storage, ordering, execution,
submission, or removal behavior.

## Verification

Focused tests will verify:

- zero targets render no stars;
- one target renders one star;
- multiple targets render the same number of stars;
- only matching `cardTarget` items are counted;
- the tooltip reports the numeric count; and
- the target control remains append-only and does not use queued styling.
