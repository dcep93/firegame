import { useMemo } from 'react';
import type { FilteredPlacedSector } from '@eclipse/shared';
import { SECTORS_BY_ID, NpcType } from '@eclipse/shared';
import { useGameState } from '../../hooks/useGameState';
import { Modal } from '../shared/Modal';
import { HexTile } from './HexTile';

const RING_LABELS: Record<string, string> = {
  galactic_center: 'Center',
  inner: 'Inner',
  middle: 'Middle',
  outer: 'Outer',
  starting: 'Home',
  guardian: 'Guardian',
};

const SHIP_TYPE_LABELS: Record<string, string> = {
  interceptor: 'Interceptor',
  cruiser: 'Cruiser',
  dreadnought: 'Dreadnought',
  starbase: 'Starbase',
};

const NPC_LABELS: Record<string, string> = {
  [NpcType.Ancient]: 'Ancient',
  [NpcType.Guardian]: 'Guardian',
  [NpcType.GCDS]: 'GCDS',
};

interface SectorInspectModalProps {
  sector: FilteredPlacedSector | null;
  onClose: () => void;
  playerColors: Record<string, string>;
  playerNames: Record<string, string>;
}

export function SectorInspectModal({ sector, onClose, playerColors, playerNames }: SectorInspectModalProps) {
  const { filteredState } = useGameState();

  // HexTile needs playerId → colorName (e.g. "red"), not CSS vars
  const hexPlayerColors = useMemo(() => {
    if (!filteredState) return {};
    const map: Record<string, string> = {};
    map[filteredState.you.id] = filteredState.you.color;
    for (const [id, opp] of Object.entries(filteredState.opponents)) {
      map[id] = opp.color;
    }
    return map;
  }, [filteredState]);

  if (!sector) return null;

  const def = SECTORS_BY_ID[sector.sectorId];
  const ringLabel = def ? RING_LABELS[def.ring] ?? def.ring : '?';

  // Center the sector at origin for the zoomed SVG
  const centeredSector: FilteredPlacedSector = { ...sector, position: { q: 0, r: 0 } };

  // Build title with ring and VP
  const titleParts: string[] = [def?.name ?? `Sector ${sector.sectorId}`];
  if (def) titleParts.push(`[${ringLabel}]`);
  if (def && def.vpValue > 0) titleParts.push(`${def.vpValue} VP`);

  // Group ships for footer
  const playerShips = sector.ships.filter(s => typeof s.owner === 'string' && !(s.owner in NPC_LABELS));
  const npcShips = sector.ships.filter(s => typeof s.owner === 'string' && s.owner in NPC_LABELS);

  // Wormhole info
  const wormholeCount = def?.wormholes.edges.length ?? 0;
  const halfWormholeCount = def?.wormholes.halfWormholes?.length ?? 0;

  // Structures
  const structures: string[] = [];
  if (sector.structures.hasOrbital) structures.push('Orbital');
  if (sector.structures.hasMonolith) structures.push('Monolith');

  return (
    <Modal isOpen title={titleParts.join('  ')} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)', minWidth: '280px' }}>

        {/* Zoomed hex tile SVG */}
        <svg
          viewBox="-105 -105 210 210"
          width="100%"
          style={{ maxWidth: '420px', display: 'block' }}
        >
          <HexTile sector={centeredSector} hexSize={80} playerColors={hexPlayerColors} />
        </svg>

        {/* Compact detail footer */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--text-primary)',
          borderTop: '1px solid var(--border-color)',
          paddingTop: 'var(--spacing-sm)',
        }}>
          {/* Owner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <span style={{ color: 'var(--text-muted)', minWidth: '50px' }}>Owner</span>
            {sector.influenceDisc ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: playerColors[sector.influenceDisc] ?? 'var(--text-muted)',
                }} />
                {playerNames[sector.influenceDisc] ?? sector.influenceDisc}
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Uncontrolled</span>
            )}
          </div>

          {/* Ships */}
          {sector.ships.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', minWidth: '50px' }}>Ships</span>
              <span>
                {playerShips.map((ship, i) => (
                  <span key={ship.id}>
                    {i > 0 && ', '}
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: playerColors[ship.owner as string] ?? 'var(--text-muted)',
                      marginRight: '3px',
                      verticalAlign: 'middle',
                    }} />
                    {SHIP_TYPE_LABELS[ship.type] ?? ship.type}
                    {ship.damage > 0 && (
                      <span style={{ color: 'var(--accent-red)', fontSize: '11px' }}> ({ship.damage} dmg)</span>
                    )}
                  </span>
                ))}
                {npcShips.map((ship, i) => (
                  <span key={ship.id} style={{ color: 'var(--text-muted)' }}>
                    {(i > 0 || playerShips.length > 0) && ', '}
                    {NPC_LABELS[ship.owner as string] ?? ship.owner} {SHIP_TYPE_LABELS[ship.type] ?? ship.type}
                    {ship.damage > 0 && (
                      <span style={{ color: 'var(--accent-red)', fontSize: '11px' }}> ({ship.damage} dmg)</span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          )}

          {/* Ancients */}
          {sector.ancients > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span style={{ color: 'var(--text-muted)', minWidth: '50px' }}>Ancients</span>
              <span>{sector.ancients} ancient ship{sector.ancients > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Wormholes & warp portal */}
          {(wormholeCount > 0 || sector.hasWarpPortal) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', minWidth: '50px' }}>Worms</span>
              <span>
                {wormholeCount > 0 && (
                  <>
                    {wormholeCount} wormhole{wormholeCount > 1 ? 's' : ''}
                    {halfWormholeCount > 0 && (
                      <span style={{ color: 'var(--text-muted)' }}> + {halfWormholeCount} half</span>
                    )}
                  </>
                )}
                {sector.hasWarpPortal && (
                  <span style={{
                    fontSize: '11px',
                    padding: '1px 5px',
                    marginLeft: wormholeCount > 0 ? '8px' : '0',
                    borderRadius: '3px',
                    background: 'rgba(74, 144, 226, 0.15)',
                    color: 'var(--accent-blue)',
                    fontWeight: 'bold',
                  }}>
                    Warp Portal
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Structures */}
          {structures.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span style={{ color: 'var(--text-muted)', minWidth: '50px' }}>Built</span>
              <span>{structures.join(' + ')}</span>
            </div>
          )}

          {/* Discovery */}
          {sector.hasUnclaimedDiscovery && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span style={{ color: 'var(--text-muted)', minWidth: '50px' }}>Disc.</span>
              <span style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '3px',
                background: 'rgba(255, 196, 0, 0.12)',
                color: 'var(--accent-yellow)',
              }}>
                Unclaimed discovery tile
              </span>
            </div>
          )}

          {/* Artifact */}
          {def?.hasArtifact && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <span style={{ color: 'var(--text-muted)', minWidth: '50px' }}>Artifact</span>
              <span style={{ color: 'var(--accent-yellow)' }}>{'\u25C6'} Present</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
