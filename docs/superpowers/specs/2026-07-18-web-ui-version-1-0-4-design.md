# Web UI Version 1.0.4

## Goal

Update the version shown by the extension's in-page controls from `v1.0.3` to `v1.0.4`.

## Scope

- Change only `contentScriptVersion` in `extension/content.js`.
- Leave the Chrome package version in `extension/manifest.json` at `0.1.2`.
- Preserve all existing uncommitted changes in both files.

## Behavior

Both web UI locations that use `contentScriptVersion` will display `v1.0.4`. Clicking the version button will continue to use the existing runtime-update behavior.

## Verification

Confirm that `contentScriptVersion` is `v1.0.4`, that no `v1.0.3` runtime label remains in the extension source, and that the implementation diff contains only the intended one-line replacement relative to the current working tree.
