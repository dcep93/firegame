# Terraforming Mars Theft History Table Design

## Goal

Make every theft record's generation and timestamp visible without turning the event sentence into a dense inline prefix.

## User Interface

Replace the theft-history event list with a compact three-column table beneath Terraform Contributions:

| Gen | Time | Event |
| ---: | --- | --- |
| 2 | 3:14 PM | 🕑 **tran** stole 1 steel production from **santiano** |

- `Gen` shows the integer generation recorded for the log endpoint.
- `Time` shows the log timestamp in the browser's local time zone using the browser's localized short time format.
- Hovering the time cell shows the full localized date and time.
- `Event` preserves the existing clock marker, sentence, and player-color styling.
- Rows remain sorted by timestamp and deduplicated by the existing event key.
- The table uses the same compact borders and dark header treatment as Terraform Contributions.
- A bounded horizontal scroller prevents narrow layouts from expanding the extension panel.

The existing loading and empty states remain plain text under the `Theft history` heading because no table rows exist in those states.

## Components and Data Flow

The theft parser already validates and retains each log entry's numeric millisecond timestamp and generation. No network, storage, or parser changes are required.

A dedicated timestamp formatter converts the retained timestamp into:

- a short visible local time; and
- a full local date-and-time string for the time cell tooltip.

The renderer creates the table, cells, and colored player elements through DOM APIs. It does not use HTML string insertion.

## Error Handling

The parser continues to reject theft entries without finite timestamps or valid generations. The formatter nevertheless fails closed with an em dash if it receives an invalid date, so malformed data cannot render misleading time text or throw during panel rendering.

## Testing

Tests will verify:

- localized short-time and full-date formatting from a known timestamp;
- the invalid-date fallback;
- the `Gen`, `Time`, and `Event` table headings;
- visible generation and time cells;
- the full timestamp tooltip;
- preservation of safe colored player-name rendering;
- horizontal overflow containment and compact table styling; and
- the existing loading and empty states.

The full extension test suite, syntax checks, and whitespace validation will run after implementation.
