import type { SectorDefinition, FilteredPlacedSector } from '@eclipse/shared';
import { HexTile } from './HexTile';

interface TilePreviewProps {
  sectorDef: SectorDefinition;
  rotation: number;
  /** Max width of the SVG container in px. Defaults to 260. */
  maxWidth?: number;
  /** Called with a synthetic sector when the preview is clicked. */
  onInspect?: (sector: FilteredPlacedSector) => void;
}

/**
 * Zoomed SVG preview of a sector tile using the real HexTile component.
 * Creates a synthetic FilteredPlacedSector from the SectorDefinition so
 * HexTile can render it unchanged at the SVG origin, then the tight viewBox
 * scales it up to fill the container.
 */
export function TilePreview({ sectorDef, rotation, maxWidth = 260, onInspect }: TilePreviewProps) {
  const syntheticSector: FilteredPlacedSector = {
    sectorId: sectorDef.id,
    position: { q: 0, r: 0 },
    rotation,
    influenceDisc: null,
    populations: [],
    ships: [],
    structures: { hasOrbital: false, orbitalPopulation: null, hasMonolith: false },
    discoveryTile: null,
    hasUnclaimedDiscovery: sectorDef.hasDiscovery,
    ancients: sectorDef.ancientCount ?? (sectorDef.hasAncient ? 1 : 0),
    hasWarpPortal: false,
  };

  return (
    <svg
      viewBox="-120 -120 240 240"
      width="100%"
      style={{
        maxWidth: `${maxWidth}px`,
        display: 'block',
        margin: '0 auto',
        cursor: onInspect ? 'pointer' : undefined,
      }}
      onClick={onInspect ? () => onInspect(syntheticSector) : undefined}
    >
      <HexTile sector={syntheticSector} hexSize={80} playerColors={{}} />
    </svg>
  );
}
