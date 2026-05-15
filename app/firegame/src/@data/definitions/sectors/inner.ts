import { PopulationSquareType, RingType, WormholeEdge } from '../../enums';
import type { SectorDefinition } from '../../types/sector';

/**
 * Inner ring sectors (101–110) for Second Dawn.
 *
 * Population squares, VP, discovery/artifact/ancient data verified against
 * Second Dawn reference data. Wormhole edge COUNTS are correct but specific
 * edge positions are approximate — needs physical tile verification.
 */
export const INNER_SECTORS: readonly SectorDefinition[] = Object.freeze([
  {
    id: '101',
    name: 'Castor',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge4, WormholeEdge.Edge5], // 5 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '102',
    name: 'Pollux',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge5], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '103',
    name: 'Beta Leonis',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge4, WormholeEdge.Edge5], // 5 connections
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
    id: '104',
    name: 'Arcturus',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 2,
  },
  {
    id: '105',
    name: 'Zeta Herculis',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4, WormholeEdge.Edge5], // 5 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '106',
    name: 'Capella',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge3], // 4 connections
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
    id: '107',
    name: 'Aldebaran',
    ring: RingType.Inner,
    vpValue: 3,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge5], // 5 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
  },
  {
    id: '108',
    name: 'Mu Cassiopeiae',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '109',
    name: 'Alpha Lacertae',
    ring: RingType.Inner,
    vpValue: 4,
    wormholes: {
      edges: [WormholeEdge.Edge1, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge4, WormholeEdge.Edge5], // 5 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: true,
    ancientCount: 2,
  },
  {
    id: '110',
    name: 'Iota Bootis',
    ring: RingType.Inner,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Wild, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
]);
