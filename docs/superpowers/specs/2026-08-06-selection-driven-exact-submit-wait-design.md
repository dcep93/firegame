# Selection-Driven Exact Submit Wait Design

## Goal

Prevent intermittent Terraforming Mars queue failures when the extension has made a valid UI selection but Vue has not rendered the resulting exact-text submit control by the next animation frame.

## Scope

Use the existing 250 ms bounded exact-text wait for submits that depend on a selection the extension just made:

1. `Pass` or `Pass for this generation` after selecting `Pass for this generation`.
2. `Take action` after selecting a played-action card.
3. `Play card` after selecting a project card.
4. `Confirm` after selecting the final-greenery opt-out.
5. `Confirm` after selecting the Power Plant standard project.

Do not broaden the wait to structural submits whose identity is not exact text, including card-target and indexed-radio submits. Do not add it to exact-text controls that belong to an already-rendered prompt and do not depend on a preceding extension selection, such as research-purchase `Skip this action` or purchase-payment `Pay`.

## Approaches Considered

### Selected: Shared wait for selection-driven exact-text submits

Reuse one exact-match lookup and one bounded wait across the five scoped flows. This fixes the common render race while retaining the safety guarantees and keeping unrelated prompt-entry behavior unchanged.

### Rejected: Wait only for Pass

This is the current implementation. It addresses the observed failure but leaves `Take action`, `Play card`, and selection-driven `Confirm` exposed to the same render timing class.

### Rejected: Wait for every submit helper

This would also delay structural or already-rendered prompt controls. Those paths have different identity rules and failure semantics, so a universal submit retry would be broader than the demonstrated race.

## Design

Keep `exactActionSubmitMatches` as the single exact enabled-text lookup. Generalize `waitForActionSubmit` so every scoped caller awaits it after its existing selection and render frame. The helper will:

1. Check immediately for one unique enabled exact-text control.
2. If none exists, poll every 25 ms for at most 250 ms.
3. Click exactly once when one match exists.
4. Fail immediately if multiple exact matches exist.
5. Throw the timeout-specific missing-control error after the full bound.

The helper never repeats the preceding selection and never retries after clicking. Existing scroll preservation remains around the click.

The synchronous `clickActionSubmit` may remain for unmodified synchronous callers or be removed if no production caller remains. Exact matching behavior must remain centralized rather than duplicated.

## Data Flow

For each scoped flow:

1. Validate and select the intended radio, card, or option.
2. Await the existing animation-frame boundary.
3. Await the bounded exact-submit helper with the expected label and any accepted exact alternate.
4. Let the existing queue executor record success or surface the thrown failure through `game.action.failure`.

No whole-action retry, queue mutation change, network fetch, or additional audit event is introduced.

## Error Handling and Safety

- Missing exact controls remain failures; the extension does not fall back to another button.
- Duplicate exact controls fail before any click.
- Disabled controls do not qualify.
- A successful lookup produces at most one click.
- The wait is bounded to 250 ms and does not cross into retrying the selection.
- Non-text and immediate prompt-entry submit paths retain their existing behavior.

## Testing

Tests will verify:

1. `Pass`, `Take action`, `Play card`, and both selection-driven `Confirm` flows use the bounded wait.
2. A matching control that appears during the bound is clicked once.
3. Immediate exact controls are still clicked without an artificial initial delay.
4. Missing controls fail after 250 ms with the timeout-specific error.
5. Ambiguous controls fail immediately without waiting or clicking.
6. Preceding selections occur only once.
7. Structural and already-rendered prompt-entry submit paths remain synchronous and unchanged.
8. The complete extension tests, JavaScript syntax checks, and `git diff --check` pass.

## Relationship to the Pass-Only Design

This design supersedes the scope restriction in `2026-08-06-pass-submit-render-wait-design.md`. The Pass implementation and safety rules remain valid; the same bounded exact-submit behavior now applies to every selection-driven exact-text submit listed above.
