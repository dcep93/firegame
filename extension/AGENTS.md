# Extension Release Instructions

## GitHub releases

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

