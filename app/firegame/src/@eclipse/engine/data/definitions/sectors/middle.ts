import { PopulationSquareType, RingType, WormholeEdge } from '../../enums';
import type { SectorDefinition } from '../../types/sector';

/**
 * Middle ring sectors (201–211, 214, 281) for Second Dawn.
 *
 * Population squares, VP, discovery/artifact/ancient data verified against
 * Second Dawn reference data. Wormhole edge COUNTS are correct but specific
 * edge positions are approximate — needs physical tile verification.
 *
 * Sectors 212/213 from original Eclipse are not in Second Dawn.
 * Sector 214 (Beta Monocerotis) and 281 (Delta Corvi) are new to Second Dawn.
 * Sector 281 is a special wormhole sector.
 */
export const MIDDLE_SECTORS: readonly SectorDefinition[] = Object.freeze([
  {
    id: '201',
    name: 'Alpha Centauri',
    ring: RingType.Middle,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge5], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '202',
    name: 'Fomalhaut',
    ring: RingType.Middle,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge5], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
  },
  {
    id: '203',
    name: 'Chi Draconis',
    ring: RingType.Middle,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge5], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 2,
  },
  {
    id: '204',
    name: 'Vega',
    ring: RingType.Middle,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge5], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
      { type: PopulationSquareType.Money, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '205',
    name: 'Mu Herculis',
    ring: RingType.Middle,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge4], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
  },
  {
    id: '206',
    name: 'Epsilon Indi',
    ring: RingType.Middle,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge5], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '207',
    name: 'Zeta Reticuli',
    ring: RingType.Middle,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '208',
    name: 'Iota Persei',
    ring: RingType.Middle,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge5], // 4 connections
    },
    populationSquares: [],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '209',
    name: 'Delta Eridani',
    ring: RingType.Middle,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge5], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '210',
    name: 'Psi Capricorni',
    ring: RingType.Middle,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3, WormholeEdge.Edge5], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '211',
    name: 'Beta Aquilae',
    ring: RingType.Middle,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge3], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: false },
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '214',
    name: 'Beta Monocerotis',
    ring: RingType.Middle,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge4, WormholeEdge.Edge5], // 5 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: true },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '281',
    name: 'Delta Corvi',
    ring: RingType.Middle,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge5], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
]);
