import { useState, useMemo } from 'react';
import { SPECIES, TECHS_BY_ID, SHIP_PARTS_BY_ID, ShipPartCategory } from '@eclipse/shared';
import type { FilteredPlayerState, PlayerState, GameEvent } from '@eclipse/shared';
import { useGameState } from '../../hooks/useGameState';
import { TechSupplyBoard } from '../tech/TechSupplyBoard';
import { ResearchBoardOverlay } from '../player-board/PlayerResearch';
import { BlueprintBoardOverlay } from '../player-board/BlueprintBoardOverlay';
import { NpcBlueprints } from '../shared/NpcBlueprints';
import { Modal } from '../shared/Modal';
import { OpponentDetailModal } from '../overlays/OpponentDetailModal';
import { formatEvent, getCategoryColor, type PlayerLookup } from '../../utils/format-event';
import { computeEconomySummary } from '../../utils/compute-economy';

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  userSelect: 'none',
};

function CollapsibleSection({ title, defaultOpen = false, children }: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(!defaultOpen);

  return (
    <div style={{ marginTop: 'var(--spacing-md)' }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          ...sectionHeaderStyle,
          marginBottom: collapsed ? 0 : 'var(--spacing-sm)',
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '10px' }}>{collapsed ? '+' : '-'}</span>
      </div>
      {!collapsed && children}
    </div>
  );
}

const PART_CATEGORY_COLORS: Record<string, string> = {
  [ShipPartCategory.Weapon]: 'var(--accent-red)',
  [ShipPartCategory.Energy]: 'var(--accent-yellow)',
  [ShipPartCategory.Drive]: 'var(--accent-green)',
  [ShipPartCategory.Computer]: 'var(--accent-blue)',
  [ShipPartCategory.Shield]: '#26c6da',
  [ShipPartCategory.Hull]: 'var(--text-secondary)',
};

function hasEventDetail(event: GameEvent): boolean {
  return event.type === 'TECH_RESEARCHED' || event.type === 'SHIP_BUILT' || event.type === 'BLUEPRINT_UPGRADED';
}

function EventDetail({ event, filteredState }: { event: GameEvent; filteredState: NonNullable<ReturnType<typeof useGameState>['filteredState']> }) {
  const detailStyle: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--text-muted)',
    padding: '4px 0 2px 29px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  };

  const partPill = (partId: string) => {
    const def = SHIP_PARTS_BY_ID[partId];
    if (!def) return <span>{partId}</span>;
    const color = PART_CATEGORY_COLORS[def.category] ?? 'var(--text-secondary)';
    const deltas: string[] = [];
    if (def.energyDelta !== 0) deltas.push(`Eng ${def.energyDelta > 0 ? '+' : ''}${def.energyDelta}`);
    if (def.initiativeDelta !== 0) deltas.push(`Init ${def.initiativeDelta > 0 ? '+' : ''}${def.initiativeDelta}`);
    if (def.computerDelta !== 0) deltas.push(`Comp ${def.computerDelta > 0 ? '+' : ''}${def.computerDelta}`);
    if (def.shieldDelta !== 0) deltas.push(`Shld ${def.shieldDelta > 0 ? '+' : ''}${def.shieldDelta}`);
    if (def.hullDelta !== 0) deltas.push(`Hull ${def.hullDelta > 0 ? '+' : ''}${def.hullDelta}`);
    if (def.movementDelta !== 0) deltas.push(`Mv ${def.movementDelta > 0 ? '+' : ''}${def.movementDelta}`);
    if (def.weapon) deltas.push(`${def.weapon.dieCount}x ${def.weapon.isMissile ? 'missile' : 'cannon'}`);
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <span style={{
          padding: '1px 4px',
          borderRadius: '3px',
          background: `${color}22`,
          border: `1px solid ${color}55`,
          color,
          fontWeight: 600,
          fontSize: '9px',
        }}>{def.name}</span>
        {deltas.length > 0 && <span style={{ color: 'var(--text-muted)' }}>{deltas.join(' · ')}</span>}
      </span>
    );
  };

  if (event.type === 'TECH_RESEARCHED') {
    const tech = TECHS_BY_ID[event.techId];
    if (!tech) return null;
    return (
      <div style={detailStyle}>
        <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{tech.name}</div>
        {tech.description && <div>{tech.description}</div>}
        {tech.unlocksShipPart && <div>Unlocks: {partPill(tech.unlocksShipPart)}</div>}
      </div>
    );
  }

  if (event.type === 'SHIP_BUILT') {
    // Show current blueprint stats for the player who built
    const pid = event.playerId;
    const playerData = pid === filteredState.you.id
      ? filteredState.you
      : filteredState.opponents[pid];
    const bp = playerData?.blueprints[event.shipType];
    if (!bp?.computed) return null;
    const { computed } = bp;
    const stats = [
      `Init ${computed.initiative}`,
      `Mv ${computed.movement}`,
      `Hull ${computed.hullValue}`,
      `Shld ${computed.shieldValue}`,
      `Comp ${computed.computerValue}`,
    ];
    return (
      <div style={detailStyle}>
        <div>{stats.join(' · ')}</div>
        {(computed.weapons.length > 0 || computed.missiles.length > 0) && (
          <div>
            {[...computed.weapons, ...computed.missiles].map((w, i) => (
              <span key={i} style={{ marginRight: '6px' }}>
                {w.dieCount}x {w.dieColor}{(w as { isMissile?: boolean }).isMissile ? ' missile' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (event.type === 'BLUEPRINT_UPGRADED') {
    return (
      <div style={detailStyle}>
        {event.added && <div>+ {partPill(event.added)}</div>}
        {event.removed.map((r, i) => <div key={i}>- {partPill(r)}</div>)}
      </div>
    );
  }

  return null;
}

function RecentEventsSection({ filteredState, players }: {
  filteredState: NonNullable<ReturnType<typeof useGameState>['filteredState']>;
  players: ReturnType<typeof useGameState>['players'];
}) {
  const lookup = useMemo<PlayerLookup>(() => {
    const map = new Map<string, { nickname: string; color: string }>();
    // Add yourself
    const myId = filteredState.you.id;
    const myNick = players?.find(p => p.playerId === myId)?.nickname ?? myId;
    map.set(myId, { nickname: myNick, color: filteredState.you.color });
    // Add opponents
    for (const [pid, opp] of Object.entries(filteredState.opponents)) {
      const nick = players?.find(p => p.playerId === pid)?.nickname ?? pid;
      map.set(pid, { nickname: nick, color: opp.color });
    }
    return { players: map, myId };
  }, [filteredState.you.id, filteredState.you.color, filteredState.opponents, players]);

  const formattedEvents = useMemo(() => {
    return filteredState.recentEvents.slice(-15).reverse().map(event => ({
      raw: event,
      formatted: formatEvent(event, lookup),
    }));
  }, [filteredState.recentEvents, lookup]);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <CollapsibleSection title="Recent Events">
      <div style={{ maxHeight: '260px', overflow: 'auto' }}>
        {formattedEvents.map((item, i) => {
          const { formatted, raw } = item;
          const expandable = hasEventDetail(raw);
          const expanded = expandedIndex === i;
          return (
            <div
              key={i}
              style={{
                borderBottom: '1px solid var(--bg-primary)',
              }}
            >
              <div
                onClick={expandable ? () => setExpandedIndex(expanded ? null : i) : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  padding: '4px 0',
                  cursor: expandable ? 'pointer' : 'default',
                  background: expanded ? 'rgba(255,255,255,0.03)' : undefined,
                }}
              >
                {/* Left accent bar showing player color */}
                <div style={{
                  width: '3px',
                  minHeight: '16px',
                  alignSelf: 'stretch',
                  borderRadius: '2px',
                  background: formatted.playerColor ?? 'transparent',
                  flexShrink: 0,
                }} />

                {/* Category icon badge */}
                <div style={{
                  width: '20px',
                  height: '18px',
                  borderRadius: '3px',
                  background: `color-mix(in srgb, ${getCategoryColor(formatted.category)} 15%, transparent)`,
                  color: formatted.iconColor,
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  lineHeight: 1,
                }}>
                  {formatted.icon}
                </div>

                {/* Event text */}
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  lineHeight: '16px',
                  flex: 1,
                  minWidth: 0,
                }}>
                  {formatted.text}
                </div>

                {expandable && (
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }}>
                    {expanded ? '\u25B4' : '\u25BE'}
                  </span>
                )}
              </div>
              {expanded && <EventDetail event={raw} filteredState={filteredState} />}
            </div>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}

export function Sidebar({ onExpandBottom }: { onExpandBottom?: () => void } = {}) {
  const { filteredState, players, roomCode, urlTokens } = useGameState();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showTechTray, setShowTechTray] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [showBlueprints, setShowBlueprints] = useState(false);

  if (!filteredState) return null;

  return (
    <div style={{
      padding: 'var(--spacing-md)',
      background: 'var(--bg-secondary)',
      height: '100%',
      overflowY: 'auto',
      borderLeft: '1px solid var(--border-color)',
      fontSize: '12px',
    }}>
      {/* Players — all players sorted by turn order */}
      <CollapsibleSection title="Players">
        {filteredState.turnOrder.map((pid) => {
          const isYou = pid === filteredState.you.id;
          const data: PlayerState | FilteredPlayerState = isYou
            ? filteredState.you
            : filteredState.opponents[pid];
          if (!data) return null;
          const nickname = players?.find(p => p.playerId === pid)?.nickname ?? pid;
          const species = SPECIES[data.speciesId as keyof typeof SPECIES];
          const speciesName = species?.name ?? data.speciesId;
          const isTurn = filteredState.turnOrder[filteredState.currentPlayerIndex] === pid;
          const passPosition = filteredState.passOrder.indexOf(pid) + 1; // 0=not passed, 1+=position

          const economy = computeEconomySummary(data);
          const afterUpkeep = data.resources.money + economy.netIncome;
          const netColor = economy.netIncome >= 0 && afterUpkeep >= 0
            ? '#4caf50'
            : afterUpkeep >= 0
              ? 'var(--accent-orange, #ff9800)'
              : '#ef5350';

          const playerInfo = players?.find(p => p.playerId === pid);
          const isDisconnected = playerInfo && !playerInfo.connected;
          const playerUrlToken = urlTokens?.[pid];

          return (
            <div
              key={pid}
              onClick={() => setSelectedPlayerId(pid)}
              style={{
                padding: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-xs)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--border-radius)',
                border: isTurn
                  ? '1px solid var(--accent-blue)'
                  : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isTurn && <span style={{ color: 'var(--accent-blue)', fontSize: '10px' }}>▶</span>}
                  <span style={{ fontWeight: 'bold', color: isDisconnected ? 'var(--text-muted)' : `var(--player-${data.color})` }}>
                    {nickname}
                  </span>
                  {isYou && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: `var(--player-${data.color})`,
                      background: `color-mix(in srgb, var(--player-${data.color}) 15%, transparent)`,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      lineHeight: '14px',
                    }}>YOU</span>
                  )}
                  {isDisconnected && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: 'var(--accent-red)',
                      background: 'rgba(255, 80, 80, 0.12)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      lineHeight: '14px',
                    }}>OFFLINE</span>
                  )}
                  {isDisconnected && playerUrlToken && roomCode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `${window.location.origin}/${roomCode}/${playerUrlToken}`;
                        navigator.clipboard.writeText(url);
                      }}
                      title="Copy rejoin link for this player"
                      style={{
                        background: 'rgba(100, 180, 255, 0.12)',
                        border: 'none',
                        borderRadius: '3px',
                        color: 'var(--accent-blue)',
                        cursor: 'pointer',
                        padding: '1px 5px',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        lineHeight: '14px',
                      }}
                    >
                      COPY LINK
                    </button>
                  )}
                </span>
                {passPosition > 0 && (
                  passPosition === 1
                    ? <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#fdd835', background: 'rgba(253,216,53,0.15)', padding: '1px 5px', borderRadius: '3px' }}>1ST · NEXT START</span>
                    : <span style={{ fontSize: '9px', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '1px 5px', borderRadius: '3px' }}>PASSED #{passPosition}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <span>M:{data.resources.money} <span style={{ color: 'var(--resource-money)', fontSize: '10px' }}>(+{economy.production.money})</span></span>
                <span>S:{data.resources.science} <span style={{ color: 'var(--resource-science)', fontSize: '10px' }}>(+{economy.production.science})</span></span>
                <span>Mt:{data.resources.materials} <span style={{ color: 'var(--resource-materials)', fontSize: '10px' }}>(+{economy.production.materials})</span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: '2px', fontSize: '11px' }}>
                <span>
                  <span style={{ fontWeight: 'bold', color: netColor }}>
                    Net: {economy.netIncome >= 0 ? '+' : ''}{economy.netIncome}
                    {afterUpkeep < 0 && ' !'}
                  </span>
                  <span style={{ marginLeft: '6px' }}>Upkeep: {economy.upkeep}</span>
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                Rep: {isYou ? (data as PlayerState).reputationTrack.filter(s => s.tile !== null).length : (data as FilteredPlayerState).reputationTileCount}
                {' | '}
                Disc: {isYou ? (data as PlayerState).discoveryTilesKeptForVP.length : (data as FilteredPlayerState).discoveryTilesKeptCount}
              </div>
            </div>
          );
        })}
      </CollapsibleSection>

      {/* Recent events */}
      {filteredState.recentEvents.length > 0 && (
        <RecentEventsSection
          filteredState={filteredState}
          players={players}
        />
      )}

      {/* Tech Tray — opens full modal */}
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <div
          onClick={() => setShowTechTray(true)}
          style={{
            ...sectionHeaderStyle,
            marginBottom: 0,
          }}
        >
          <span>Tech Tray</span>
          <span style={{ fontSize: '10px' }}>↗</span>
        </div>
      </div>

      {/* My Research — opens full modal */}
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <div
          onClick={() => setShowResearch(true)}
          style={{
            ...sectionHeaderStyle,
            marginBottom: 0,
          }}
        >
          <span>My Research</span>
          <span style={{ fontSize: '10px' }}>↗</span>
        </div>
      </div>

      {/* Ship Blueprints — opens full overlay */}
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <div
          onClick={() => setShowBlueprints(true)}
          style={{
            ...sectionHeaderStyle,
            marginBottom: 0,
          }}
        >
          <span>Ship Blueprints</span>
          <span style={{ fontSize: '10px' }}>↗</span>
        </div>
      </div>

      {/* Game info — lower priority */}
      <CollapsibleSection title="Game Info" defaultOpen={false}>
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          <div>Discovery deck: {filteredState.discoveryDeckSize}</div>
          <div>Reputation bag: {filteredState.reputationBagSize}</div>
          <div>Sector stacks: I:{filteredState.sectorStackSizes.inner} M:{filteredState.sectorStackSizes.middle} O:{filteredState.sectorStackSizes.outer}</div>
        </div>
      </CollapsibleSection>

      {/* NPC Blueprints — lower priority */}
      <CollapsibleSection title="NPC Blueprints" defaultOpen={false}>
        <NpcBlueprints headless />
      </CollapsibleSection>

      {/* Tech Supply Board overlay */}
      {showTechTray && (
        <TechSupplyBoard
          techTray={filteredState.techTray}
          onClose={() => setShowTechTray(false)}
        />
      )}

      {/* Research Board overlay */}
      {showResearch && (
        <ResearchBoardOverlay
          techTracks={filteredState.you.techTracks}
          onClose={() => setShowResearch(false)}
        />
      )}

      {/* Blueprint Board overlay */}
      {showBlueprints && (
        <BlueprintBoardOverlay
          blueprints={filteredState.you.blueprints}
          shipSupply={filteredState.you.shipSupply}
          onClose={() => setShowBlueprints(false)}
        />
      )}

      {/* Player detail modal (self or opponent) */}
      {selectedPlayerId && (() => {
        const isYou = selectedPlayerId === filteredState.you.id;
        const playerData = isYou
          ? {
              ...filteredState.you,
              reputationTileCount: filteredState.you.reputationTrack.filter(s => s.tile !== null).length,
              discoveryTilesKeptCount: filteredState.you.discoveryTilesKeptForVP.length,
            }
          : filteredState.opponents[selectedPlayerId];
        if (!playerData) return null;
        return (
          <OpponentDetailModal
            opponent={playerData}
            nickname={players?.find(p => p.playerId === selectedPlayerId)?.nickname ?? selectedPlayerId}
            isOpen
            onClose={() => setSelectedPlayerId(null)}
          />
        );
      })()}
    </div>
  );
}
