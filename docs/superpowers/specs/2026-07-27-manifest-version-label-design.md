# Manifest-Sourced Extension Version Label

## Goal

Set the Chrome extension manifest version to `1.0.6` and make every in-page
version label derive from the loaded manifest. Future manifest-only version
changes must appear automatically after the extension and page reload.

The rendered label keeps the existing visual prefix and displays `v1.0.6`.

## Context Boundary

`content.js` runs in the page's MAIN world, where `chrome.runtime` is not
available. `reload_bridge.js` runs in the extension's ISOLATED world and can
read `chrome.runtime.getManifest().version`. Both worlds can communicate
through the existing origin-scoped `window.postMessage` bridge.

## Version Request Flow

1. `content.js` installs its page-message listener.
2. It posts a local `tfmars420:request-extension-version` message.
3. `reload_bridge.js` validates the message source and origin.
4. The bridge reads `chrome.runtime.getManifest().version`.
5. It posts `tfmars420:extension-version` with the manifest value.
6. `content.js` validates the value as one to four dot-separated numeric
   components.
7. It formats the value as `v${version}` and updates all existing Terraforming
   Mars and Colonist version buttons.

The flow performs no network request and does not contact the service worker.

## Rendering

Before the response arrives, version buttons use the transient text `v…`.
After a valid response, newly rendered controls use the resolved label and
already-rendered controls update in place.

Both of these controls share the same resolved state:

- `.tfmars420-controls-version`
- `.firegame-colonist-dice-version`

The version button's existing update/download behavior remains unchanged.

## Safety and Failure Behavior

Ignore messages from another window or origin. Ignore malformed version
responses and keep the transient label. The isolated bridge must not throw if
manifest metadata is unexpectedly unavailable; it logs the failure and sends
no response.

The version is cosmetic and does not grant authority, alter storage, or change
remote-update behavior.

## Alternatives Rejected

A DOM data attribute depends on document-start ordering between worlds and can
be absent when the main-world script initializes.

A generated JavaScript constant introduces a build-time synchronization step
and can drift from the manifest again.

## Verification

Tests cover manifest `1.0.6`, bridge request/response behavior, invalid-message
rejection, `v` prefix formatting, updating both button classes, transient
fallback behavior, and absence of a hardcoded semantic version in
`content.js`. Full extension tests, JavaScript syntax checks, and whitespace
checks must pass.
