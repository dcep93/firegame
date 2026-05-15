import { PopulationSquareType, RingType, WormholeEdge } from '../../enums';
import type { SectorDefinition } from '../../types/sector';

export const GALACTIC_CENTER_SECTOR: Readonly<SectorDefinition> = Object.freeze({
  id: '001',
  name: 'Galactic Center',
  ring: RingType.GalacticCenter,
  vpValue: 4,
  wormholes: {
    edges: [
      WormholeEdge.Edge0,
      WormholeEdge.Edge1,
      WormholeEdge.Edge2,
      WormholeEdge.Edge3,
      WormholeEdge.Edge4,
      WormholeEdge.Edge5,
    ],
  },
  populationSquares: [
    { type: PopulationSquareType.Money, advanced: false },
    { type: PopulationSquareType.Money, advanced: false },
    { type: PopulationSquareType.Materials, advanced: false },
    { type: PopulationSquareType.Materials, advanced: true },
    { type: PopulationSquareType.Science, advanced: false },
    { type: PopulationSquareType.Science, advanced: true },
  ],
  hasDiscovery: true,
  hasArtifact: true,
  hasAncient: false, // GCDS occupies center, not a regular Ancient
  ancientCount: 0,
});
