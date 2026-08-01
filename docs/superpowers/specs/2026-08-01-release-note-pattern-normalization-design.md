# Release Note Pattern Normalization

## Goal

Normalize every published browser-extension release to numbered-list release
notes, remove obsolete top headers from v1.0.7 and v1.0.8, simplify the v1.0.8
Autoqueue wording, and require future release workflows to infer their notes
format from recent releases.

## Published Release Updates

Edit only the bodies of the existing v1.0.6, v1.0.7, and v1.0.8 GitHub
releases. Preserve their tags, titles, target commits, publication status, and
prerelease status.

### v1.0.6

Keep the `# Firegame browser helper` heading and all existing prose, feature
claims, links, and section order.

Convert every unordered list to explicit ordered Markdown numbering:

- the Terraforming Mars feature list;
- the nested Autopilots list;
- the Colonist feature list; and
- the Disable or uninstall list.

Keep the already ordered Install and Update instructions as numbered lists.
Nested Autopilot steps remain nested beneath their parent feature item.

### v1.0.7

Remove the `# Firegame browser helper` heading and its following blank line.
Keep `## Terraforming Mars` as the first line. Convert the four labeled feature
paragraphs into a single ordered list while preserving their wording and order.

### v1.0.8

Remove the `# Firegame browser helper` heading and its following blank line.
Keep `## Terraforming Mars` as the first line. Convert the two labeled feature
paragraphs into a single ordered list while preserving their order.

In the Safer Autoqueue item, remove the parenthetical example
`—such as Bio Printing Facility—`. The resulting sentence states that the
change prevents a queued card action from being submitted as a pass without
naming a specific card. Preserve the remainder of both feature claims.

## Future Release Pattern Rule

Extend the `Release shorthand` section in `extension/AGENTS.md`. Before drafting
release notes, the agent must inspect recent published releases and infer the
current presentation pattern, including:

- section headings and their order;
- ordered-list structure and nesting;
- tone and detail level; and
- whether installation or update instructions are normally included.

The new release should follow that recent pattern unless the user gives a more
specific instruction. Recent releases are style references, not authoritative
sources for the new release's facts; feature claims must still be verified
against the current code and behavior, and stale claims must not be copied
forward.

## Failure Handling

Before editing, read each current release body and preserve a local copy for
comparison. If a release is missing, its body changed after inspection, GitHub
authentication fails, or any update command fails, stop and report the specific
release and error. Do not alter tags, recreate releases, or overwrite unrelated
metadata to recover.

## Verification

After the edits:

- reread v1.0.6, v1.0.7, and v1.0.8 from GitHub;
- confirm all lists use ordered Markdown numbering;
- confirm v1.0.6 retains its top header;
- confirm v1.0.7 and v1.0.8 begin with `## Terraforming Mars`;
- confirm v1.0.8 no longer mentions Bio Printing Facility;
- confirm release tags and publication metadata are unchanged;
- inspect the `extension/AGENTS.md` diff for the recent-release pattern rule;
  and
- run `git diff --check`.
