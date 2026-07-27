# Two-Tier Extension Releases

## Goal

Restore the GitHub release history so `v1.0.6` is the older baseline release
with the complete extension feature catalog and all installation lifecycle
instructions, while `v1.0.7` is the latest incremental release containing only
the newly added Terraforming Mars features.

## Tags and Targets

- `v1.0.6` points to historical commit `bdccc931`.
- `v1.0.7` points to release commit `77d539ea`.

Do not retarget either version or change repository code as part of the release
reconstruction.

## v1.0.6

Restore the captured full release notes from the original `v1.0.6` release.
They include:

- the complete Terraforming Mars feature summary available at that point;
- the Colonist dice-history feature;
- Install and Update instructions with verification;
- Disable and Uninstall instructions.

This release is not marked Latest.

## v1.0.7

Publish only the approved incremental Terraforming Mars feature summary:

**Remembered quick actions:** Played-card choices can now be learned from
Actions panel, target controls, and numbered radio-option execution. Learned
choices can be reused immediately during an unfinished action or placed behind
that action in the queue.

**Actions anywhere:** A fully interactive copy of the Actions panel appears
below the extension controls. Pass defaults are synchronized across both
panels.

**Turn visibility:** The game background pulses pink when you can pass and
yellow when another response is required.

**Navigation keys:** Q centers Actions, W jumps to Played Cards, and E jumps to
the bottom.

Do not repeat Install, Update, Disable, or Uninstall instructions in `v1.0.7`.
Mark this release Latest.

## Ordering

Because GitHub orders releases using publication metadata, reconstruct the
release records oldest-first:

1. Remove the current `v1.0.7` release record while retaining its tag.
2. Restore the remote `v1.0.6` tag and create the baseline release.
3. Recreate the `v1.0.7` release from its existing remote tag.

This makes `v1.0.6` older and `v1.0.7` the tip both semantically and in the
release list.

## Verification

Confirm:

- both releases exist in `v1.0.7`, then `v1.0.6` order;
- only `v1.0.7` has the Latest marker;
- each remote tag resolves to its required commit;
- `v1.0.6` contains the full instructions;
- `v1.0.7` contains none of the instruction headings; and
- the four `v1.0.7` feature paragraphs match the approved wording.
