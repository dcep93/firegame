import { ShipType, NpcType } from '@eclipse/shared';

const NPC_COLOR = '#c0a060'; // warm amber for all NPCs

// ── Image file mapping ──
// PNG files are white-on-transparent silhouettes in /public/ships/

const FACTION_SHIP_IMAGES: Record<string, string> = {
  [ShipType.Interceptor]: '/ships/interceptor.png',
  [ShipType.Cruiser]: '/ships/cruiser.png',
  [ShipType.Dreadnought]: '/ships/dreadnought.png',
  [ShipType.Starbase]: '/ships/starbase.png',
};

const NPC_SHIP_IMAGES: Record<string, string> = {
  [NpcType.Ancient]: '/ships/ancient.png',
  [NpcType.Guardian]: '/ships/guardian.png',
  [NpcType.GCDS]: '/ships/gcds.png',
};

function getShipImage(shipType: string, isNpc: boolean): string | null {
  return isNpc ? NPC_SHIP_IMAGES[shipType] ?? null : FACTION_SHIP_IMAGES[shipType] ?? null;
}

// ── Per-type size scale ──
// Multiplier applied on top of the base `size` prop.
// Hierarchy: Cruiser < Interceptor ≈ Starbase < Dreadnought
//            Ancient < Guardian < GCDS

const SHIP_SCALE: Record<string, number> = {
  [ShipType.Cruiser]: 1.0,
  [ShipType.Interceptor]: 1.25,
  [ShipType.Starbase]: 1.25,
  [ShipType.Dreadnought]: 1.6,
  [NpcType.Ancient]: 1.7,
  [NpcType.Guardian]: 2.0,
  [NpcType.GCDS]: 1.8,
};

/** Returns the scaled pixel size for a ship type given a base size. */
export function getShipSize(shipType: string, baseSize: number): number {
  return Math.round(baseSize * (SHIP_SCALE[shipType] ?? 1));
}

// ── Component Props ──

interface ShipIconProps {
  /** ShipType for faction ships, NpcType for NPC ships */
  shipType: string;
  /** Fill color — used for faction ships (ignored for NPC ships) */
  color?: string;
  /** Width/height in pixels (square) */
  size?: number;
  /** Is this an NPC ship? */
  isNpc?: boolean;
  /** Optional CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Renders a ship silhouette using a PNG mask image.
 * The white silhouette acts as a mask over a colored background.
 * Faction ships use the provided `color` prop; NPC ships use amber.
 */
export function ShipIcon({
  shipType,
  color = 'var(--text-primary)',
  size = 24,
  isNpc = false,
  className,
  style,
}: ShipIconProps) {
  const img = getShipImage(shipType, isNpc);
  if (!img) return null;

  const fillColor = isNpc ? NPC_COLOR : color;
  const scaled = getShipSize(shipType, size);
  const needsOutline = color === 'var(--player-black)';

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: `${scaled}px`,
        height: `${scaled}px`,
        backgroundColor: fillColor,
        filter: needsOutline ? 'drop-shadow(0 0 3px rgba(255,255,255,0.6))' : undefined,
        WebkitMaskImage: `url('${img}')`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: `url('${img}')`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        ...style,
      }}
    />
  );
}

/**
 * Renders a ship silhouette inside an existing SVG context.
 * Uses <foreignObject> to embed a CSS-masked div within SVG.
 */
export function ShipIconSvg({
  shipType,
  color = 'var(--text-primary)',
  size = 14,
  x,
  y,
  isNpc = false,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  shipType: string;
  color?: string;
  size?: number;
  x: number;
  y: number;
  isNpc?: boolean;
  className?: string;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}) {
  const img = getShipImage(shipType, isNpc);
  if (!img) return null;

  const fillColor = isNpc ? NPC_COLOR : color;
  const scaled = getShipSize(shipType, size);
  const needsOutline = color === 'var(--player-black)';

  return (
    <foreignObject
      x={x - scaled / 2}
      y={y - scaled / 2}
      width={scaled}
      height={scaled}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer', overflow: 'visible' }}
    >
      <div
        style={{
          width: `${scaled}px`,
          height: `${scaled}px`,
          backgroundColor: fillColor,
          WebkitMaskImage: `url('${img}')`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url('${img}')`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          filter: needsOutline ? 'drop-shadow(0 0 3px rgba(255,255,255,0.6))' : undefined,
        }}
      />
    </foreignObject>
  );
}

export { NPC_COLOR };
