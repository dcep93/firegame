import type { PlayerState } from '@eclipse/shared';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerEconomy, type TrackSlot } from '../../hooks/usePlayerEconomy';

// ── Shared Styles ──

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  flexShrink: 0,
  minWidth: 0,
};

const headerStyle: React.CSSProperties = {
  fontWeight: 'bold',
  color: 'var(--text-secondary)',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  alignSelf: 'stretch',
  background: 'var(--border-color)',
  flexShrink: 0,
};

// ── Track Row Component ──

function TrackRow({ label, slots, color, shape }: {
  label: string;
  slots: TrackSlot[];
  color: string;
  shape: 'circle' | 'square';
}) {
  const borderRadius = shape === 'circle' ? '50%' : '3px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span style={{
        width: '64px',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        textAlign: 'right',
        flexShrink: 0,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
        {slots.map((slot, i) => (
          <div
            key={i}
            title={slot.filled
              ? `On track (value: ${slot.value})`
              : `Placed (value: ${slot.value})`
            }
            style={{
              width: '20px',
              height: '20px',
              borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              ...(slot.isCurrent
                ? {
                    background: 'rgba(255, 255, 255, 0.85)',
                    color: '#111',
                    border: '1.5px solid #fff',
                    opacity: 1,
                  }
                : slot.filled
                  ? {
                      background: color,
                      opacity: 0.8,
                      color: 'rgba(0, 0, 0, 0.5)',
                      border: '1.5px solid transparent',
                      ...(slot.isNext ? {
                        boxShadow: `0 0 6px ${color}, 0 0 2px ${color}`,
                        opacity: 1,
                        border: '1.5px solid rgba(255, 255, 255, 0.6)',
                      } : {}),
                    }
                  : {
                      background: 'transparent',
                      color,
                      border: `1.5px solid ${color}`,
                      opacity: 0.45,
                    }
              ),
            }}
          >
            {slot.value > 0 ? slot.value : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section Components ──

function ResourceRow({ label, value, production, color }: {
  label: string;
  value: number;
  production: number;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ ...valueStyle, color, width: '64px' }}>{label}</span>
      <span style={{ ...valueStyle, fontWeight: 'bold', width: '24px', textAlign: 'right' }}>
        {value}
      </span>
      <span style={{ ...valueStyle, color: 'var(--text-secondary)', fontSize: '11px' }}>
        +{production}/rd
      </span>
    </div>
  );
}

function ResourcesSection({ player, production }: {
  player: PlayerState;
  production: { money: number; science: number; materials: number };
}) {
  return (
    <div style={sectionStyle}>
      <span style={{ ...headerStyle, marginBottom: '4px' }}>Resources</span>
      <ResourceRow
        label="Money"
        value={player.resources.money}
        production={production.money}
        color="var(--resource-money)"
      />
      <ResourceRow
        label="Science"
        value={player.resources.science}
        production={production.science}
        color="var(--resource-science)"
      />
      <ResourceRow
        label="Materials"
        value={player.resources.materials}
        production={production.materials}
        color="var(--resource-materials)"
      />
    </div>
  );
}

// ── Colony Ship Icon (hexagonal token shape) ──

function ColonyShipIcon({ available }: { available: boolean }) {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" style={{ display: 'block' }}>
      <polygon
        points="4,0 24,0 28,10 24,20 4,20 0,10"
        fill={available ? 'rgba(100, 180, 255, 0.25)' : 'transparent'}
        stroke={available ? 'rgba(100, 180, 255, 0.7)' : 'rgba(100, 180, 255, 0.2)'}
        strokeWidth="1.5"
      />
      {/* Simple ship silhouette */}
      <path
        d="M8,13 L12,7 L14,6 L16,7 L20,13 L17,12 L14,13 L11,12 Z"
        fill={available ? 'rgba(100, 180, 255, 0.8)' : 'rgba(100, 180, 255, 0.15)'}
      />
    </svg>
  );
}

function ColonyShipsSection({ player }: { player: PlayerState }) {
  const { total, available } = player.colonyShips;
  const used = total - available;
  return (
    <div style={{ ...sectionStyle, alignItems: 'center' }}>
      <span style={{ ...headerStyle, marginBottom: '4px', alignSelf: 'center' }}>Colony Ships</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
        {Array.from({ length: total }, (_, i) => (
          <ColonyShipIcon key={i} available={i >= used} />
        ))}
      </div>
    </div>
  );
}

function EconomySummary({ netIncome, upkeep, production, bank }: {
  netIncome: number;
  upkeep: number;
  production: number;
  bank: number;
}) {
  const afterUpkeep = bank + netIncome;
  const rowStyle: React.CSSProperties = {
    ...valueStyle,
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    fontSize: '11px',
  };
  return (
    <div style={{ ...sectionStyle, minWidth: '80px' }}>
      <span style={{ ...headerStyle, marginBottom: '4px' }}>Economy</span>
      <div style={rowStyle}>
        <span style={{ color: 'var(--text-secondary)' }}>income</span>
        <span style={{ fontWeight: 'bold', color: 'var(--resource-money)' }}>+{production}</span>
      </div>
      <div style={rowStyle}>
        <span style={{ color: 'var(--text-secondary)' }}>upkeep</span>
        <span style={{ fontWeight: 'bold', color: upkeep < 0 ? '#ef5350' : 'var(--text-secondary)' }}>{upkeep}</span>
      </div>
      <div style={rowStyle}>
        <span style={{ color: 'var(--text-secondary)' }}>bank</span>
        <span style={{ fontWeight: 'bold', color: 'var(--resource-money)' }}>{bank}</span>
      </div>
      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1px', paddingTop: '2px' }}>
        <div style={rowStyle}>
          <span style={{ color: 'var(--text-secondary)' }}>total</span>
          <span style={{ fontWeight: 'bold', color: afterUpkeep >= 0 ? '#4caf50' : '#ef5350' }}>
            {afterUpkeep >= 0 ? '+' : ''}{afterUpkeep}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReputationSlotBox({ slot }: { slot: PlayerState['reputationTrack'][number] }) {
  const hasTile = slot.tile !== null;
  const isAmb = slot.tile?.fromAmbassador ?? false;
  const isAmbSlot = slot.slotType === 'ambassador';
  const isRepSlot = slot.slotType === 'reputation';
  const isShared = slot.slotType === 'shared';

  const repColor = 'rgba(245, 158, 11, 0.5)';
  const ambColor = 'rgba(59, 130, 246, 0.5)';
  const size = 26;

  const titleText = hasTile
    ? `${isAmb ? 'Ambassador' : 'Reputation'}: ${slot.tile!.value}`
    : `Empty ${slot.slotType} slot`;

  // Shield SVG for reputation (military badge)
  const shieldEl = (filled: boolean) => (
    <svg
      viewBox="0 0 24 28"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <path
        d="M12,1 L22,5 L22,14 Q22,22 12,27 Q2,22 2,14 L2,5 Z"
        fill={filled ? 'rgba(245, 158, 11, 0.15)' : 'transparent'}
        stroke={filled ? 'rgba(245, 158, 11, 0.6)' : repColor}
        strokeWidth="1.5"
      />
    </svg>
  );

  // Circle for ambassador (alliance)
  const circleEl = (filled: boolean) => (
    <svg
      viewBox="0 0 24 28"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <ellipse
        cx="12" cy="14" rx="10" ry="11"
        fill={filled ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}
        stroke={filled ? 'rgba(59, 130, 246, 0.6)' : ambColor}
        strokeWidth="1.5"
      />
    </svg>
  );

  const contentStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: hasTile ? 'bold' : 'normal',
    color: hasTile ? (isAmb ? '#3b82f6' : '#f59e0b') : 'var(--text-muted)',
    zIndex: 1,
  };

  return (
    <div title={titleText} style={{ width: `${size}px`, height: `${size + 2}px`, position: 'relative' }}>
      {(isShared || isRepSlot) && shieldEl(hasTile && !isAmb)}
      {(isShared || isAmbSlot) && circleEl(hasTile && isAmb)}
      <span style={contentStyle}>{hasTile ? slot.tile!.value : '\u00B7'}</span>
    </div>
  );
}

function ReputationSection({ player }: { player: PlayerState }) {
  return (
    <div style={{ ...sectionStyle, alignItems: 'center' }}>
      <span style={{ ...headerStyle, marginBottom: '4px', alignSelf: 'center' }}>
        Rep
        {player.discoveryTilesKeptForVP.length > 0 && (
          <span style={{ fontWeight: 'normal', opacity: 0.7 }}>
            {' '}+{player.discoveryTilesKeptForVP.length}
          </span>
        )}
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', justifyItems: 'center' }}>
        {player.reputationTrack.map((slot, i) => (
          <ReputationSlotBox key={i} slot={slot} />
        ))}
      </div>
    </div>
  );
}

// ── Visual Tracks Section ──

function TracksSection({ influenceSlots, populationSlots }: {
  influenceSlots: TrackSlot[];
  populationSlots: {
    materials: TrackSlot[];
    science: TrackSlot[];
    money: TrackSlot[];
  };
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, justifyContent: 'center' }}>
      <span style={headerStyle}>Tracks</span>
      <TrackRow
        label="Influence"
        slots={influenceSlots}
        color="var(--accent-blue)"
        shape="circle"
      />
      <TrackRow
        label="Materials"
        slots={populationSlots.materials}
        color="var(--resource-materials)"
        shape="square"
      />
      <TrackRow
        label="Science"
        slots={populationSlots.science}
        color="var(--resource-science)"
        shape="square"
      />
      <TrackRow
        label="Money"
        slots={populationSlots.money}
        color="var(--resource-money)"
        shape="square"
      />
    </div>
  );
}

// ── Main Component ──

export function PlayerBoard() {
  const { filteredState } = useGameState();

  if (!filteredState) return null;

  return <PlayerBoardContent player={filteredState.you} />;
}

function PlayerBoardContent({ player }: { player: import('@eclipse/shared').PlayerState }) {
  const { production, upkeep, netIncome, influenceSlots, populationSlots } = usePlayerEconomy(player);

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      overflowX: 'auto',
      fontSize: '12px',
      alignItems: 'flex-start',
    }}>
      <ResourcesSection player={player} production={production} />
      <div style={dividerStyle} />
      <TracksSection influenceSlots={influenceSlots} populationSlots={populationSlots} />
      <div style={dividerStyle} />
      <EconomySummary netIncome={netIncome} upkeep={upkeep} production={production.money} bank={player.resources.money} />
      <div style={dividerStyle} />
      <ColonyShipsSection player={player} />
      <div style={dividerStyle} />
      <ReputationSection player={player} />
    </div>
  );
}
