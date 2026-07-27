# Reload Bridge Error Handling Design

## Goal

Prevent an invalidated Chrome extension context from producing an uncaught
extension error when the page asks the reload bridge to update the content
script and reload. Preserve the existing message flow and record the failure in
the extension console with `console.log`.

## Design

Add a small helper inside `extension/reload_bridge.js` that sends the runtime
message. The helper catches errors thrown synchronously by
`chrome.runtime.sendMessage` and handles a rejected promise when the API returns
one. Both paths log the failure with a stable reload-bridge prefix.

The existing validated `window` message listener will call the helper instead
of calling `chrome.runtime.sendMessage` directly. No retry is attempted because
an invalidated extension context cannot recover without the content script
being reloaded, and retrying would add noise without restoring the request.

## Error Handling

Only failures from this reload-bridge send operation are converted to log
messages. Successful sends remain silent. The caught error object is passed to
`console.log` so its original message and stack remain available for debugging.

## Testing

Add focused Node tests that execute the bridge with mocked browser globals and
verify:

- a synchronous `Extension context invalidated` exception does not escape and
  is logged once;
- a rejected send promise is handled and logged once;
- a successful send does not log an error.

Run the focused test and the full extension test set.
