# Sigma Contribution Total Header Design

## Goal

Replace the visible “Contribution total” score-table heading with a compact,
prominent uppercase Greek sigma.

## Design

The contribution-total header will visibly render `Σ` at 26 pixels with a
compact line height. The existing header cell continues to expose
“Contribution total” through its `title` and `aria-label`, preserving the
meaning for hover text and assistive technology.

No data cells, calculations, table dimensions, or other headings change.

## Verification

- Assert that the total heading is created with “Contribution total” semantics.
- Assert that its visible text is `Σ` and its dedicated class applies the
  approved 26-pixel size.
- Run the extension tests, JavaScript syntax checks, and whitespace validation.
