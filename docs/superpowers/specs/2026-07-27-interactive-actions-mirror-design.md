# Interactive Actions Mirror Design

## Goal

Render a fully interactive duplicate of Terraforming Mars's current Actions
block at the bottom of the tfmars420 extension panel while keeping the original
Vue-controlled block intact.

## Architecture

The extension will rebuild an Actions mirror from
`.player_home_block--actions` whenever the queue panel renders. The mirror is a
visual clone, not a second Vue component. Each mirrored element receives a
temporary key connected to the corresponding source element from the same
clone operation.

The mirror root retains the game's general block styling but replaces the
canonical `player_home_block--actions` class with
`tfmars420-actions-mirror`. This ensures every existing automation helper
continues to resolve the original live form.

Before insertion, the mirror removes:

- duplicated IDs and named anchors;
- input names that could join the original radio groups; and
- tfmars420 descendants accidentally copied when the extension panel is hosted
  inside the Actions block.

The completed mirror is appended after every other extension-panel section.

## Interaction

A delegated capture listener on the mirror forwards user interaction to the
mapped source element:

- clicks call the exact source element's native `click()` method;
- text, numeric, range, textarea, and select edits copy their value before
  dispatching the matching native `input` or `change` event; and
- checkbox and radio activation uses the source control's native click path so
  Vue receives its normal event sequence.

Forwarded interactions run through the existing scroll-preservation helper.
The mirror prevents its own default behavior so cloned labels, radio groups,
forms, and buttons cannot mutate independent state or submit separately.

The game's resulting DOM mutation schedules the normal extension update, which
rebuilds the mirror from fresh source state. If no original Actions block is
available, no mirror is rendered.

## Safety

- Existing queue and autopilot executors continue to query only the canonical
  original Actions block.
- Mapping exists only for the current mirror render and is discarded with it.
- A stale or disconnected source element causes the interaction to do nothing
  and schedules a refresh.
- Mirrored extension controls are removed to avoid recursion.
- The extension's disabled state removes the whole panel and mirror through the
  existing cleanup path.

## Verification

Automated tests will cover clone sanitization, source mapping, bottom-of-panel
placement, click and value forwarding, scroll preservation, stale-source
handling, and the guarantee that the mirror does not match
`.player_home_block--actions`. The full extension suite will then guard queue,
autopilot, sorting, scrolling, and update behavior.
