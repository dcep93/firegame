# Compact Live Score Table Design

## Problem

The live contributions and board-VP table uses `min-width: 100%`. The extension
panel inherits the game page's full content width, so the table stretches its
columns across several thousand pixels even when its contents need only a small
fraction of that space.

## Design

Keep the queue panel and the score table's data, icons, and row structure
unchanged. Make the table use its intrinsic content width and keep it aligned to
the left.

The scrolling wrapper remains capped at the available width and retains
horizontal overflow. This preserves access to every column in games whose
player names or expansion tracks genuinely exceed the available viewport.

## Verification

- Assert that the score table CSS uses intrinsic content width and no longer
  forces a 100% minimum width.
- Assert that the scrolling wrapper remains bounded to the available width and
  keeps horizontal overflow.
- Run the extension tests and JavaScript syntax checks.
