# Extension Release Instructions

## GitHub releases

### Release shorthand

When the user asks to `release` the browser extension, treat that request as
authorization to complete the full release workflow. More specific instructions
in the same request override these defaults.

1. Inspect the current branch, status, and diff. Include only changes that
   belong to the release; stop for clarification if unrelated work cannot be
   safely separated.
2. Inspect recent published GitHub releases and use the next patch tag unless
   the user specifies another version.
3. Draft release notes by following the recent releases' current pattern for
   headings, ordered lists and nesting, tone, detail, and installation or
   update instructions. More specific user instructions override that pattern.
   Treat recent releases as style references only: verify current feature claims
   against the code and behavior, and do not copy stale facts forward.
4. Update `contentScriptVersion` in `content.js` to the release tag and update
   its matching automated assertion. Do not change the Chrome package version
   in `manifest.json` unless the user explicitly requests a package-version
   bump.
5. Run the complete relevant extension tests, JavaScript syntax checks, and
   `git diff --check`. Do not publish with failing checks.
6. Commit the scoped changes with a concise message and push the current branch
   to its configured remote.
7. Publish a public, non-draft, non-prerelease GitHub release targeting the
   pushed branch. Follow the release-note rules below. Do not create a pull
   request unless the user explicitly requests one.
8. Verify that the remote branch contains the commit, the release tag resolves
   to that commit, the release metadata is correct, and the local worktree is
   clean and synchronized.

Stop and report concrete blockers such as unrelated working-tree changes,
failing checks, authentication or remote-access failures, version or tag
conflicts, push failures, or release-publication failures. Preserve completed
work and do not force-push, retag, overwrite a release, discard changes, or
weaken validation without explicit authorization. If commit or push succeeds
but release publication fails, report the pushed branch and commit together
with the release error so the workflow can resume safely.

When asked to create or update a GitHub release for the browser extension:

- Include a changelog that is useful to nontechnical users.
- Explain what players can see and do, and why each change matters.
- Group notes by supported site or feature area so they are easy to scan.
- For a normal update, describe meaningful changes since the previous release.
  For a first or consolidated release, summarize the complete current feature
  set.
- Avoid raw commit summaries, internal function or variable names,
  implementation jargon, and test-only details.
- Mention installation or update workflow changes when they affect users.
- Verify feature claims against the extension code and behavior before
  publishing.
- Treat `manifest.json` as Chrome's package version and
  `contentScriptVersion` in `content.js` as the user-facing release label. Do
  not claim that one automatically follows the other.
