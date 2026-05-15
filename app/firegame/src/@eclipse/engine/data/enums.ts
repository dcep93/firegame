// Player & Game
export enum PlayerColor {
  Red = 'red',
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
  White = 'white',
  Black = 'black',
}

export enum PhaseType {
  Setup = 'setup',
  Action = 'action',
  Combat = 'combat',
  Upkeep = 'upkeep',
  Cleanup = 'cleanup',
  GameOver = 'game_over',
}

export enum ActionType {
  Explore = 'explore',
  Research = 'research',
  Upgrade = 'upgrade',
  Build = 'build',
  Move = 'move',
  Influence = 'influence',
}

export enum ResourceType {
  Materials = 'materials',
  Science = 'science',
  Money = 'money',
}

// Map & Sectors
export enum RingType {
  GalacticCenter = 'galactic_center',
  Inner = 'inner',
  Middle = 'middle',
  Outer = 'outer',
  Starting = 'starting',
  Guardian = 'guardian',
}

export enum WormholeEdge {
  Edge0 = 0,
  Edge1 = 1,
  Edge2 = 2,
  Edge3 = 3,
  Edge4 = 4,
  Edge5 = 5,
}

// Population
export enum PopulationSquareType {
  Money = 'money',
  Science = 'science',
  Materials = 'materials',
  Wild = 'wild',
}

// Technology
export enum TechCategory {
  Military = 'military',
  Grid = 'grid',
  Nano = 'nano',
  Rare = 'rare',
}

// Ships
export enum ShipType {
  Interceptor = 'interceptor',
  Cruiser = 'cruiser',
  Dreadnought = 'dreadnought',
  Starbase = 'starbase',
}

export enum ShipPartSlotType {
  Weapon = 'weapon',
  Drive = 'drive',
  Computer = 'computer',
  Shield = 'shield',
  Hull = 'hull',
  Energy = 'energy',
  Any = 'any',
}

export enum ShipPartCategory {
  Weapon = 'weapon',
  Computer = 'computer',
  Shield = 'shield',
  Hull = 'hull',
  Drive = 'drive',
  Energy = 'energy',
}

// Combat & Dice
export enum DieColor {
  Yellow = 'yellow',
  Orange = 'orange',
  Blue = 'blue',
  Red = 'red',
}

export enum DiscoveryType {
  ResourceBonus = 'resource_bonus',
  AncientTech = 'ancient_tech',
  AncientCruiser = 'ancient_cruiser',
  AncientOrbital = 'ancient_orbital',
  AncientMonolith = 'ancient_monolith',
  AncientShipPart = 'ancient_ship_part',
  AncientWarpPortal = 'ancient_warp_portal',
}

// Species & NPCs
export enum SpeciesId {
  EridaniEmpire = 'eridani_empire',
  HydranProgress = 'hydran_progress',
  Planta = 'planta',
  DescendantsOfDraco = 'descendants_of_draco',
  Mechanema = 'mechanema',
  OrionHegemony = 'orion_hegemony',
}

export enum NpcType {
  Ancient = 'ancient',
  Guardian = 'guardian',
  GCDS = 'gcds',
}

export enum ReputationSlotType {
  Reputation = 'reputation',
  Ambassador = 'ambassador',
  Shared = 'shared',
}
