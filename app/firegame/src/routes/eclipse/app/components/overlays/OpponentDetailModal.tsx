import { SPECIES } from '@eclipse/shared';
import type { FilteredPlayerState, SpeciesId } from '@eclipse/shared';
import { Modal } from '../shared/Modal';
import { TrackCategory } from '../player-board/PlayerResearch';
import { ShipBlueprints } from '../player-board/ShipBlueprints';
import { TrackRow } from '../shared/TrackRow';
import { computePlayerEconomy } from '../../utils/compute-economy';

const CATEGORIES = [
  { key: 'military' as const, label: 'Military', color: 'var(--accent-red)' },
  { key: 'grid' as const, label: 'Grid', color: 'var(--accent-blue)' },
  { key: 'nano' as const, label: 'Nano', color: 'var(--accent-green)' },
] as const;

const sectionStyle: React.CSSProperties = {
  padding: 'var(--spacing-sm)',
  background: 'var(--bg-tertiary)',
  borderRadius: 'var(--border-radius)',
  marginBottom: 'var(--spacing-sm)',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '6px',
};

interface OpponentDetailModalProps {
  opponent: FilteredPlayerState;
  nickname: string;
  isOpen: boolean;
  onClose: () => void;
}

function OpponentEconomySection({ opponent, economy }: { opponent: FilteredPlayerState; economy: ReturnType<typeof computePlayerEconomy> }) {
  const afterUpkeep = opponent.resources.money + economy.netIncome;
  const netColor = economy.netIncome >= 0 && afterUpkeep >= 0
    ? '#4caf50'
    : afterUpkeep >= 0
      ? 'var(--accent-orange, #ff9800)'
      : '#ef5350';

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 0',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
  };

  return (
    <div style={sectionStyle}>
      <div style={sectionLabelStyle}>Economy</div>
      <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: '8px', fontSize: '11px' }}>
        <span style={{ color: 'var(--resource-money)' }}>Money +{economy.production.money}</span>
        <span style={{ color: 'var(--resource-science)' }}>Science +{economy.production.science}</span>
        <span style={{ color: 'var(--resource-materials)' }}>Materials +{economy.production.materials}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', maxWidth: '280px' }}>
        <div style={rowStyle}>
          <span style={{ color: 'var(--text-secondary)' }}>Income</span>
          <span style={{ fontWeight: 'bold', color: 'var(--resource-money)' }}>+{economy.production.money}</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--text-secondary)' }}>Upkeep</span>
          <span style={{ fontWeight: 'bold', color: economy.upkeep < 0 ? '#ef5350' : 'var(--text-secondary)' }}>{economy.upkeep}</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--text-secondary)' }}>Bank</span>
          <span style={{ fontWeight: 'bold', color: 'var(--resource-money)' }}>{opponent.resources.money}</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--text-secondary)' }}>After Upkeep</span>
          <span style={{ fontWeight: 'bold', color: netColor }}>
            {afterUpkeep >= 0 ? '+' : ''}{afterUpkeep}
            {afterUpkeep < 0 && ' !'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OpponentDetailModal({ opponent, nickname, isOpen, onClose }: OpponentDetailModalProps) {
  const species = SPECIES[opponent.speciesId as SpeciesId];
  const speciesName = species?.name ?? opponent.speciesId;

  const economy = computePlayerEconomy(opponent);
  const discs = opponent.influenceDiscs;
  const available = discs.total - discs.onActions - discs.onReactions - discs.onSectors;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: `var(--player-${opponent.color})`,
            flexShrink: 0,
          }} />
          <div>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {speciesName}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '8px' }}>
              ({nickname})
            </span>
          </div>
          {opponent.eliminated && (
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              background: 'var(--accent-red)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
            }}>ELIMINATED</span>
          )}
          {!opponent.eliminated && opponent.hasPassed && (
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              background: 'var(--bg-hover)',
              borderRadius: '4px',
              color: 'var(--text-muted)',
            }}>PASSED</span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
      </div>

      {/* Resources */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Resources</div>
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: '13px' }}>
          <span>
            <span style={{ color: 'var(--resource-money)' }}>Money:</span>{' '}
            {opponent.resources.money}
          </span>
          <span>
            <span style={{ color: 'var(--resource-science)' }}>Science:</span>{' '}
            {opponent.resources.science}
          </span>
          <span>
            <span style={{ color: 'var(--resource-materials)' }}>Materials:</span>{' '}
            {opponent.resources.materials}
          </span>
        </div>
      </div>

      {/* Economy */}
      <OpponentEconomySection opponent={opponent} economy={economy} />

      {/* Influence & Stats */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Influence & Stats</div>
        <div style={{ marginBottom: '8px' }}>
          <TrackRow
            label="Influence"
            slots={economy.influenceSlots}
            color="var(--accent-blue)"
            shape="circle"
          />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <div>
            Discs: {available}/{discs.total} available
            {' \u00B7 '}Sectors: {discs.onSectors}
            {' \u00B7 '}Actions: {discs.onActions}
            {' \u00B7 '}React: {discs.onReactions}
          </div>
          <div>
            Colony Ships: {opponent.colonyShips.available}/{opponent.colonyShips.total}
          </div>
          <div>
            Reputation: {opponent.reputationTileCount} tile{opponent.reputationTileCount !== 1 ? 's' : ''}
            {' \u00B7 '}Discovery VP: {opponent.discoveryTilesKeptCount}
          </div>
          {(opponent.ambassadorsGiven.length > 0 || opponent.ambassadorsReceived.length > 0) && (
            <div>
              Ambassadors:
              {opponent.ambassadorsGiven.length > 0 && (
                <span> given to {opponent.ambassadorsGiven.map(a => a.playerId).join(', ')}</span>
              )}
              {opponent.ambassadorsGiven.length > 0 && opponent.ambassadorsReceived.length > 0 && ' \u00B7 '}
              {opponent.ambassadorsReceived.length > 0 && (
                <span> from {opponent.ambassadorsReceived.map(a => a.playerId).join(', ')}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Research */}
      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Research</div>
        {CATEGORIES.map(cat => (
          <TrackCategory
            key={cat.key}
            label={cat.label}
            color={cat.color}
            techs={opponent.techTracks[cat.key]}
          />
        ))}
      </div>

      {/* Ship Blueprints */}
      <div style={{ ...sectionStyle, marginBottom: 0 }}>
        <div style={sectionLabelStyle}>Ship Blueprints</div>
        <ShipBlueprints blueprints={opponent.blueprints} shipSupply={opponent.shipSupply} expanded />
      </div>
    </Modal>
  );
}
