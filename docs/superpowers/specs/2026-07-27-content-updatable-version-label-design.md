# Content-Updatable Version Label

## Goal

Keep the Chrome manifest at its established package version `0.1.2` and store
the user-facing release version in `content.js` as `v1.0.6`.

The existing in-page updater replaces only `content.js`. Therefore the
rendered version must travel inside that file so a successful content update
immediately displays the new release version after the extension and page
reload.

## Version Roles

- `manifest.json` version `0.1.2` is Chrome's static unpacked-extension package
  version.
- `contentScriptVersion` in `content.js` is the user-facing updater version.
- Terraforming Mars and Colonist controls both render the same
  `contentScriptVersion` value.
- Future content releases update the constant in `content.js`; they do not
  change the manifest unless the extension package itself needs a manual
  reinstall.

## Update Flow

1. The user clicks the in-page version button.
2. The existing page-to-isolated-world bridge requests the known-working
   `chrome.downloads.download` Save As flow.
3. The user overwrites the installed extension's `content.js`.
4. The service worker reloads the unpacked extension and originating tab.
5. The replacement `content.js` renders its updated user-facing version.

No manifest-version lookup or version-specific cross-world message is needed.

## Removal

Remove:

- the manifest-version request and response messages;
- isolated-world `chrome.runtime.getManifest()` version handling;
- transient `v…` state;
- DOM-wide version-response updates; and
- tests and documentation for that bridge.

The existing runtime-update bridge, download behavior, version-button click
behavior, and page reload remain unchanged.

## Release Correction

After verification:

1. Commit and push the correction on `agent/tfmars-queue-tools`.
2. Force-move the published `v1.0.6` tag to the corrected commit.
3. Retain the existing GitHub release name, notes, and URL.
4. Verify the remote tag and release resolve to the corrected commit.

The user explicitly authorized moving the published tag.

## Verification

Tests cover manifest `0.1.2`, exact rendered `v1.0.6`, both in-page controls
using the shared constant, absence of the manifest-version bridge, and
unchanged content download/reload behavior. Full extension tests, JavaScript
syntax checks, whitespace checks, branch synchronization, and remote tag
resolution must pass.
