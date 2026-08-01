# Extension Release Shorthand

## Goal

Define `release` as a complete, extension-scoped publishing instruction so an
agent can safely verify, version, commit, push, publish, and validate a browser
extension release without asking the user to enumerate each routine step.

## Trigger and Scope

Add the shorthand to `extension/AGENTS.md`, alongside the existing GitHub
release requirements.

When the user asks to `release` the browser extension, treat that request as
authorization to perform the full workflow in this design. The shorthand
applies only to browser extension work governed by that `AGENTS.md`; it does not
redefine unrelated uses of the word `release` elsewhere.

A more specific instruction in the same request overrides the shorthand. This
includes an explicit version, target branch, draft or prerelease status,
package-version change, release-note requirement, or pull-request request.

## Release Workflow

The agent must:

1. Inspect the current branch, status, and diff. Stage only changes belonging
   to the release and stop for clarification if unrelated work cannot be safely
   separated.
2. Inspect existing GitHub releases and determine the next patch release unless
   the user specifies another version.
3. Update `contentScriptVersion` in `extension/content.js` to the release tag
   and update its corresponding automated assertion.
4. Leave the Chrome package version in `extension/manifest.json` unchanged
   unless the user explicitly requests a package-version bump.
5. Run the relevant complete extension tests, JavaScript syntax checks, and
   `git diff --check`. Do not publish a release with failing checks.
6. Commit the intended changes with a concise message and push the current
   branch to its configured remote.
7. Publish a public, non-draft, non-prerelease GitHub release targeting the
   pushed branch. Do not open a pull request unless explicitly requested.
8. Write player-focused release notes under the appropriate supported-site or
   feature headings, following the existing release-note requirements in
   `extension/AGENTS.md`.
9. Verify that the remote branch contains the commit, the tag resolves to that
   commit, the GitHub release is published with the intended metadata, and the
   local worktree is clean and synchronized.

## Failure Handling

Authentication, remote-access, version conflicts, failing tests, unrelated
working-tree changes, an existing tag, or release-publication errors block the
workflow at the affected step. Report the concrete blocker and preserve all
completed local work. Do not silently retag, force-push, overwrite a release,
discard changes, or weaken validation.

If commit or push succeeds but release publication fails, report the pushed
branch and commit together with the release error so the user can safely resume
from that point.

## Verification

Review the final `AGENTS.md` wording to confirm it explicitly covers:

- the plain `release` trigger and extension-only scope;
- scoped staging and validation;
- next-patch default versioning through `contentScriptVersion`;
- no automatic `manifest.json` bump;
- commit and current-branch push;
- public release creation without a default pull request;
- user-facing notes and release verification; and
- safe failure behavior without destructive recovery.

Run `git diff --check` after the instruction change.
