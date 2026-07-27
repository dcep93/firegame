# Concise Extension Release Notes Design

## Goal

Reduce the public `v1.0.6` release notes to at most 200 words before the
`Install` heading while preserving useful coverage of both supported games.

## Scope

- Rewrite only the release introduction and feature summary.
- Preserve the `Install`, `Update`, and `Disable or uninstall` sections
  verbatim.
- Count the Markdown headings as words.
- Use the same published-body counting method as the earlier measurement:
  extract everything before `## Install` and pass it to `wc -w`.
- Target fewer than 190 words so minor formatting differences cannot cross the
  200-word limit.

## Structure

The shortened feature summary will retain four scannable areas:

1. Terraforming Mars
2. Autopilots
3. Colonist
4. Controls and updates

The Terraforming Mars section will consolidate shared setup, card previews,
hand sorting, live scoring, queues, remembered choices, and turn helpers. The
Autopilots section will name and summarize Escape, Got a Lotta Energy, and Buy
Everything. The Colonist section will retain full-log dice history, live
recency display, refresh behavior, and clipboard copying. Controls and updates
will retain enable/disable behavior and the content-only update workflow.

## Verification

- Confirm the pre-Install portion is at most 200 words locally and after
  publishing.
- Confirm the instruction portion exactly matches the previously published
  instruction text.
- Confirm all four feature headings and all three autopilot names remain.
- Confirm `v1.0.6` remains the only release.
