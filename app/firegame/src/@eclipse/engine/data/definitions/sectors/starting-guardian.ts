import { PopulationSquareType, RingType, SpeciesId, WormholeEdge } from '../../enums';
import type { SectorDefinition } from '../../types/sector';

/**
 * Starting sectors — one per species.
 *
 * Known facts:
 * - All starting sectors have vpValue=3 and hasArtifact=true
 * - Each maps to exactly one species via speciesHome
 * - No discovery tiles, no ancients
 *
 * Wormhole pattern: all homeworlds share [0,1,3,4] (4 connections).
 * Population squares verified against firegame reference data.
 */
export const STARTING_SECTORS: readonly SectorDefinition[] = Object.freeze([
  {
    id: '228',
    name: 'Draco Homeworld',
    ring: RingType.Starting,
    vpValue: 3,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
    speciesHome: SpeciesId.DescendantsOfDraco,
  },
  {
    id: '222',
    name: 'Eridani Homeworld',
    ring: RingType.Starting,
    vpValue: 3,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
    speciesHome: SpeciesId.EridaniEmpire,
  },
  {
    id: '224',
    name: 'Hydran Homeworld',
    ring: RingType.Starting,
    vpValue: 3,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: true },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
    speciesHome: SpeciesId.HydranProgress,
  },
  {
    id: '226',
    name: 'Planta Homeworld',
    ring: RingType.Starting,
    vpValue: 3,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
    speciesHome: SpeciesId.Planta,
  },
  {
    id: '230',
    name: 'Mechanema Homeworld',
    ring: RingType.Starting,
    vpValue: 3,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Money, advanced: true },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
    speciesHome: SpeciesId.Mechanema,
  },
  {
    id: '232',
    name: 'Orion Homeworld',
    ring: RingType.Starting,
    vpValue: 3,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: false,
    hasArtifact: true,
    hasAncient: false,
    speciesHome: SpeciesId.OrionHegemony,
  },
]);

/**
 * Guardian sectors (271–274).
 *
 * Population squares, VP, discovery/artifact data verified against
 * Second Dawn reference data. Wormhole edge COUNTS are correct (4 each)
 * but specific edge positions are approximate — needs physical tile
 * verification for exact positions.
 *
 * Guardians occupy these sectors (not regular Ancients).
 */
export const GUARDIAN_SECTORS: readonly SectorDefinition[] = Object.freeze([
  {
    id: '271',
    name: 'Omega Fornacis',
    ring: RingType.Guardian,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: false, // Guardians, not regular Ancients
  },
  {
    id: '272',
    name: 'Sigma Hydrae',
    ring: RingType.Guardian,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: false,
  },
  {
    id: '273',
    name: 'Theta Ophiuchi',
    ring: RingType.Guardian,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Materials, advanced: false },
      { type: PopulationSquareType.Materials, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: false,
  },
  {
    id: '274',
    name: 'Alpha Lyncis',
    ring: RingType.Guardian,
    vpValue: 2,
    wormholes: {
      edges: [WormholeEdge.Edge0, WormholeEdge.Edge1, WormholeEdge.Edge3, WormholeEdge.Edge4], // 4 connections
    },
    populationSquares: [
      { type: PopulationSquareType.Money, advanced: false },
      { type: PopulationSquareType.Science, advanced: false },
      { type: PopulationSquareType.Science, advanced: true },
    ],
    hasDiscovery: true,
    hasArtifact: true,
    hasAncient: false,
  },
]);
