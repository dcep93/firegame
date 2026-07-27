# Buy Space Rocks Autopilot Design

## Context

The extension currently offers two persistent autopilot modes:

- `escape`, which chooses safe exits such as Pass, World Government submit, or
  skipping an optional research-card purchase; and
- `got a lotta energy`, which attempts the Power Plant standard project and
  otherwise falls back to Escape.

Terraforming Mars can offer optional project cards for purchase. The purchase
workflow renders selectable cards, imposes a server-provided maximum based on
available funds, and may produce a payment follow-up after Buy. The new mode
automates purchases for a small exact allowlist and behaves like Escape
everywhere else.

## Goal

Add a persistent autopilot mode named `buy space rocks` that buys permitted
copies of three exact cards in rendered order, completes the corresponding
payment, and safely declines or escapes when no desired purchase is possible.

## Exact card allowlist

The mode recognizes these upstream English card names exactly:

- `Comet Aiming`
- `Asteroid Deflection System`
- `Solarnet`

Near matches, localized names, and `Solarnet Shutdown` do not qualify.

## Mode representation and UI

The normalized internal mode is `buySpaceRocks`. Its display label is
`buy space rocks`.

The Autopilot mode dropdown order is:

1. `escape`
2. `got a lotta energy`
3. `buy space rocks`

The selected mode remains part of the bounded per-player queue session. Queued
items render as `autopilot: buy space rocks`. The item follows the existing
persistent-autopilot contract: successful or failed execution leaves it at the
same queue index until the user removes it or clears the queue.

## Prompt recognition

### Research-card purchase

The purchase workflow is recognized only from these rendered titles:

- `Select card(s) to buy`
- `Select up to N card(s) to buy`, where `N` is one or more digits
- `You cannot afford any cards`

Recognition is scoped to the current actions block and its
`.wf-component--select-card` workflow.

### Purchase payment

The payment follow-up is recognized only when the current payment workflow
renders:

`Select how to spend N M€ for M cards`

Both `N` and `M` must be one or more digits. The `for M cards` suffix
distinguishes research-card purchase payment from unrelated payment prompts.

### Escape fallback

On prompts that are neither purchase selection nor purchase payment, the mode
uses the same eligibility capabilities as Escape:

- one enabled exact `Pass for this generation` option;
- World Government Terraforming; or
- the existing optional research-purchase prompt.

Other queue-item modes retain their current eligibility rules.

## Purchase selection

The purchase executor operates only inside the active select-card workflow.

1. Read card labels in their rendered DOM order.
2. Resolve each card's visible name through the extension's existing card-name
   helper.
3. Uncheck any checked non-allowlisted card, waiting one animation frame after
   each change.
4. Leave checked allowlisted cards selected.
5. Walk allowlisted cards in rendered order. For each unchecked card whose
   checkbox exists and is enabled, select it and wait one animation frame.
6. Re-read input state after each frame so the application's server-provided
   maximum can disable later cards.
7. If at least one allowlisted card is selected, click exactly one enabled
   purchase submit whose normalized label is `Buy N` for a positive integer
   `N`.

This naturally chooses the first rendered target when the maximum is one and
selects all rendered targets permitted by larger maxima. The extension does not
infer affordability or calculate a maximum itself.

The selector does not reorder cards and does not send any additional remote
request beyond the native clicks.

## Safe no-purchase fallback

If no allowlisted card is selected after the selection pass, the executor
declines the purchase using exactly one enabled control in this order:

1. `Skip this action`
2. `Buy 0`
3. `Ok`

Only exact normalized labels qualify. The first label category with exactly one
enabled match is clicked. Missing or duplicate controls are treated as a safe
failure rather than submitting an unknown action.

This covers ordinary optional purchases, maximum-one purchases whose valid
zero-card action is `Buy 0`, and the server's `You cannot afford any cards`
workflow.

## Payment completion

When the exact purchase-payment prompt is present, the executor does not alter
resource inputs. Terraforming Mars initializes a valid default payment through
its native `computeDefaultPayment` logic.

The mode clicks exactly one enabled submit control labeled `Pay`. Missing,
disabled, or duplicate Pay controls are a safe failure. When the server can
charge megacredits without presenting a payment form, no payment step is
needed.

## Execution order

For a `buySpaceRocks` queue item:

1. If the exact purchase-payment prompt is present, submit Pay.
2. Else if a recognized purchase-selection prompt is present, attempt the
   allowlisted purchase or safe no-purchase fallback.
3. Else execute the existing Escape behavior.

The energy autopilot path is unchanged.

## Passed-state behavior

`buySpaceRocks` is an Escape-fallback mode. It receives the same narrow
post-pass exception as Escape for World Government Terraforming and recognized
research-purchase workflows. It does not bypass the passed-state guard on
ordinary prompts.

## Error handling

- Missing, disabled, or ambiguous controls throw specific errors.
- A target that becomes disabled after an earlier selection is skipped.
- A target without a selectable checkbox is not purchased.
- No unknown or fuzzy card name, button label, or payment title is accepted.
- Existing persistent-autopilot failure handling leaves the item at its exact
  queue index and records the failure.

## Testing

Behavioral coverage will include:

- mode normalization, label rendering, persistence, and dropdown order;
- exact allowlist acceptance and near-match rejection;
- multiple matching cards selected in rendered order;
- maximum-one behavior caused by live checkbox disabling;
- checked allowlisted cards retained;
- checked non-allowlisted cards cleared;
- missing and disabled target inputs;
- `Skip this action`, `Buy 0`, and `Ok` fallback paths;
- positive `Buy N` submit matching and ambiguous-submit rejection;
- exact purchase-payment recognition and Pay submission without input changes;
- rejection of unrelated payment prompts;
- Escape behavior on ordinary, World Government, and research prompts;
- isolation from `got a lotta energy` and ordinary queue items;
- persistent queue position on success and failure; and
- full extension regression coverage.

JavaScript syntax, the focused content-script suite, the service-worker suite,
the full extension suite, and whitespace checks must pass.
