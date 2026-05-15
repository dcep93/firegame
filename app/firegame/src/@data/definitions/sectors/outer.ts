import { PopulationSquareType, RingType, WormholeEdge } from '../../enums';
import type { SectorDefinition } from '../../types/sector';

/**
 * Outer ring sectors (301–318, 381–382) for Second Dawn.
 *
 * Population squares, VP, discovery/artifact/ancient data verified against
 * Second Dawn reference data. Wormhole edge COUNTS are correct but specific
 * edge positions are approximate — needs physical tile verification.
 *
 * Sectors 381 (Beta Sextantis) and 382 (Zeta Chamaeleontis) are special
 * wormhole sectors new to Second Dawn.
 */
export const OUTER_SECTORS: readonly SectorDefinition[] = Object.freeze([
  {
    id: '301',
    name: 'Zeta Draconis',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: true,
    ancientCount: 2,
  },
  {
    id: '302',
    name: 'Gamma Serpentis',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3, WormholeEdge.Edge4], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '303',
    name: 'Eta Cephei',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge3, WormholeEdge.Edge5], // 2 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: false },
      { type: PopulationSquareType.Science, advanced: true },
      { type: PopulationSquareType.Money, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '304',
    name: 'Theta Pegasi',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3], // 2 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '305',
    name: 'Lambda Serpentis',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: true,
    ancientCount: 1,
  },
  {
    id: '306',
    name: 'Beta Centauri',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge1, WormholeEdge.Edge3], // 2 connections
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
    id: '307',
    name: 'Sigma Sagittarii',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '308',
    name: 'Kappa Scorpii',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge5], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '309',
    name: 'Phi Piscium',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3, WormholeEdge.Edge5], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '310',
    name: 'Nu Phoenicis',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3], // 2 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '311',
    name: 'Canopus',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '312',
    name: 'Antares',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '313',
    name: 'Alpha Ursae',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3], // 2 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '314',
    name: 'Spica',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge2, WormholeEdge.Edge3, WormholeEdge.Edge4], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '315',
    name: 'Epsilon Aurigae',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3, WormholeEdge.Edge5], // 3 connections
    },
    populationSquares: [],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '316',
    name: 'Iota Carinae',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '317',
    name: 'Beta Crucis',
    ring: RingType.Outer,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge3, WormholeEdge.Edge4], // 2 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '318',
    name: 'Gamma Velorum',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge2, WormholeEdge.Edge3], // 2 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Wild, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '381',
    name: 'Beta Sextantis',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge3, WormholeEdge.Edge4], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
  {
    id: '382',
    name: 'Zeta Chamaeleontis',
    ring: RingType.Outer,
    vpValue: 1,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge2, WormholeEdge.Edge3], // 3 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
    ],
    hasDiscovery: true,
    hasArtifact: false,
    hasAncient: false,
  },
]);
