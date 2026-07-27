# Download Cancellation Reloads the Extension

## Goal

Keep the extension's existing, known-working
`chrome.downloads.download({saveAs: true})` update flow. When the user cancels
the Save As picker instead of downloading the remote `content.js`, reload the
currently installed local extension and refresh the originating game tab.

This provides a version-button route for picking up local unpacked-extension
changes without automating `chrome://extensions`.

## Existing Flow

Clicking either in-page version number posts the existing
`tfmars420:update-content-and-reload` message. The isolated reload bridge
forwards it to the service worker, which calls `chrome.downloads.download` with:

- the remote GitHub `content.js` URL;
- the suggested filename `content.js`;
- overwrite conflict handling; and
- `saveAs: true`.

A completed download calls `finishUpdate`, which asks the originating tab to
reload and then reloads the extension runtime.

## Cancellation and Failure Behavior

Preserve the existing download request and Save As picker.

### No download ID

When the `chrome.downloads.download` callback receives no `downloadId`, call
`finishUpdate` instead of returning after a warning. Chrome documents that
startup error strings are not stable and must not be parsed, so every no-ID
result uses this conservative reload-only path.

This covers picker cancellation before an observable download item exists. It
can also reload the local extension after another download-start failure; no
remote file is installed in either case.

### Download item interrupted by user

When `chrome.downloads.onChanged` reports:

- state `interrupted`; and
- error `USER_CANCELED`;

remove the listener and call `finishUpdate`.

This covers cancellation represented as an interrupted download item.

### Other interruption

For any other interrupted download:

- remove the listener;
- log the interruption reason; and
- keep the current extension runtime loaded.

Network, server, disk, security, or other failures must not be treated as a
successful update.

### Successful download

Keep the existing behavior: remove the listener and call `finishUpdate` when
the item reaches `complete`.

## Scope

Do not replace the downloads API, add File System Access API code, alter the
version buttons, change the reload bridge protocol, or remove the `downloads`
permission.

The downloads API cannot guarantee that no HTTP activity occurs before its
built-in Save As picker. Retaining the proven flow is an explicit tradeoff.

## Verification

Add focused service-worker tests that verify:

- the download call retains its current URL, filename, overwrite, and `saveAs`
  options;
- a completed download reloads the originating tab and runtime;
- a callback with no download ID takes the reload-only path;
- an interrupted `USER_CANCELED` item takes the reload-only path;
- another interruption logs its stable reason and does not reload;
- event listeners are removed on every terminal download-item state; and
- unrelated runtime messages and unrelated download events are ignored.

Run the complete extension test suite after the focused tests pass.
