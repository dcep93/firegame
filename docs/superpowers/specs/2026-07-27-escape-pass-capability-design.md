# Escape Pass-Capability Design

## Context

Escape autopilot is a persistent queue item that chooses a safe exit from the
current prompt. On an ordinary action prompt, it selects
`Pass for this generation` and submits Pass. It also has narrow handlers for
World Government Terraforming and optional research-card purchases.

The current ordinary-action eligibility check depends on recognizing a
`Take your first action` or `Take your next action` heading. PolderTECH's first
turn instead renders `Select one option`, with these choices:

- `Take first action of PolderTECH Dutch corporation`
- `Pass for this generation`

The Pass choice is valid and enabled, but Escape remains ineligible because the
heading does not match. The rendered queue therefore disables manual execution,
and automatic processing never calls the otherwise-working Pass executor.

## Goal

Let Escape autopilot execute on any live action form that exposes exactly one
enabled option labeled `Pass for this generation`, regardless of the prompt
heading.

## Non-goals

- Do not broaden eligibility for energy autopilot, Pass queue items, project
  cards, played-card actions, radio options, targets, or quick choices.
- Do not treat partial, fuzzy, disabled, or ambiguous Pass labels as eligible.
- Do not change World Government Terraforming or research-purchase Escape
  behavior.
- Do not change the persistent queue position or autoprocess semantics.
- Do not change the network-update default-Pass feature or turn scrolling.

## Design

### Exact Pass capability

Add a read-only predicate that searches the current actions block for
`label.form-radio` controls. A label qualifies only when:

1. its normalized visible text is exactly `Pass for this generation`;
2. it contains an `input[type='radio']`; and
3. that radio is enabled.

The predicate returns true only when exactly one label qualifies. Missing,
disabled, and duplicate enabled Pass choices return false.

This predicate describes what Escape can do rather than guessing from a prompt
title. It covers PolderTECH and future prompts that genuinely offer the same
Pass action without widening unrelated queue behavior.

### Queue eligibility

An Escape autopilot item is eligible when any existing Escape capability is
present:

- World Government Terraforming;
- optional research-card purchase; or
- one enabled exact Pass option.

All non-Escape queue items continue through the current main-versus-follow-up
prompt classification.

### Execution

No new click sequence is introduced. Once eligible through the Pass capability,
Escape uses the existing `executePassAction` flow:

1. select `Pass for this generation`;
2. wait one animation frame for the form to update; and
3. submit the exact Pass action.

The predicate performs no clicks, selection, checkbox changes, or submissions.

### Passed-state behavior

The existing passed-state guard remains unchanged. A player who has already
passed normally has no enabled Pass option, so the new capability does not
create an additional post-pass exception. Existing World Government and
research-purchase exceptions remain intact.

## Error handling

Missing, disabled, or ambiguous Pass controls make Escape ineligible, so the
queue item waits in place without an execution attempt. If the DOM changes
between eligibility and execution, the existing Pass executor reports its
specific missing or disabled option error, while persistent-autopilot failure
handling leaves the item at its current queue index.

## Testing

Behavioral tests will cover:

- an unrecognized `Select one option` prompt with one enabled exact Pass radio;
- ordinary recognized action prompts;
- missing and disabled Pass radios;
- duplicate enabled exact Pass radios;
- near-match Pass text;
- Escape versus energy autopilot and ordinary queue items;
- unchanged World Government and research-purchase eligibility; and
- the existing select-radio, next-frame, exact-submit Pass execution path.

The focused content-script suite and the complete extension test suite must
pass, along with JavaScript syntax and whitespace checks.
