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

The shortened feature summary will retain two top-level site areas:

1. Terraforming Mars
2. Colonist

The Terraforming Mars section will consolidate shared setup, card previews,
hand sorting, live scoring, queues, remembered choices, and turn helpers.
Autopilots will be a Terraforming Mars feature bullet with three nested bullets
that name and summarize Escape, Got a Lotta Energy, and Buy Everything. The
Colonist section will retain full-log dice history, live recency display,
refresh behavior, and clipboard copying.

There will be no standalone `Controls and updates` feature section. Update and
disable behavior remains documented only in the unchanged instruction sections.

## Verification

- Confirm the pre-Install portion is at most 200 words locally and after
  publishing.
- Confirm the instruction portion exactly matches the previously published
  instruction text.
- Confirm Terraforming Mars and Colonist are the only top-level feature
  headings.
- Confirm Autopilots is a Terraforming Mars bullet with nested bullets for all
  three autopilot names.
- Confirm no standalone Controls and updates section remains.
- Confirm `v1.0.6` remains the only release.
