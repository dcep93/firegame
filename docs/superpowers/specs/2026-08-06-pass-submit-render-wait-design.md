# Pass Submit Render Wait Design

## Goal

Prevent intermittent automatic Pass failures when Terraforming Mars has accepted the `Pass for this generation` radio selection but has not rendered its submit button after the extension's current one-frame wait.

## Confirmed Failure

The observed audit error is:

`missing exact action submit button: Pass`

`executePassAction` currently selects the Pass radio, waits one animation frame, and immediately requires the exact enabled `Pass` or `Pass for this generation` submit control. The radio exists and was selected; only the dependent submit control is late.

## Design

Add a Pass-specific bounded submit wait:

1. Select `Pass for this generation` exactly once.
2. Wait the existing animation frame.
3. Look for exactly one enabled submit control whose text is `Pass` or `Pass for this generation`.
4. If none exists, poll the same read-only lookup every 25 ms for at most 250 ms.
5. Click the control exactly once when it becomes available.

The wait never repeats the radio selection and never retries after clicking. Other queued actions retain their existing synchronous exact-submit behavior.

An ambiguous exact submit set fails immediately because waiting cannot safely choose between duplicate controls. A missing control after the full bound throws a timeout-specific error that remains visible in the existing `game.action.failure` audit and queue error banner.

## Components

- Extract the exact-submit lookup from `clickActionSubmit` so both synchronous and waiting paths use identical matching rules.
- Keep `clickActionSubmit` synchronous for existing callers.
- Add an asynchronous bounded helper used only by `executePassAction`.

## Safety

- No whole-action retry.
- No fallback to a different button label.
- No click before one unique enabled exact control exists.
- At most one click.
- Existing scroll preservation remains around the click.

## Testing

Tests will verify:

- Pass still selects, waits, and submits in order when the button is immediately available.
- A Pass button appearing during the bounded wait is clicked once.
- The radio selection is not repeated while waiting.
- The alternate exact label remains accepted.
- Missing controls fail after the bound with the new timeout error.
- Ambiguous exact controls fail immediately without clicking.
- Non-Pass action submission behavior is unchanged.
- The full extension suite and syntax checks pass.
