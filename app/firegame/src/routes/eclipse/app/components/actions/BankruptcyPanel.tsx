import { Button } from '../shared/Button';
import type { BankruptcyTrackChoiceEntry } from '../../hooks/useBankruptcyFlow';
import type { ResourceType } from '@eclipse/shared';

const TRACK_LABELS: Record<string, string> = {
  money: 'Money',
  science: 'Science',
  materials: 'Materials',
};

const TRACK_COLORS: Record<string, string> = {
  money: 'var(--accent-gold, #f59e0b)',
  science: 'var(--accent-pink, #ec4899)',
  materials: 'var(--accent-brown, #a16207)',
};

interface SectorInfo {
  key: string;
  label: string;
  position: { q: number; r: number };
  populations: readonly { slotIndex: number; sourceTrack: string; isWild: boolean }[];
  hasOrbitalPop: boolean;
  orbitalTrack: ResourceType | null;
}

interface BankruptcyPanelProps {
  deficit: number;
  controlledSectors: SectorInfo[];
  selectedKeys: Set<string>;
  sectorTrackChoices: Map<string, BankruptcyTrackChoiceEntry[]>;
  onToggleSector: (key: string) => void;
  onUpdateTrackChoice: (sectorKey: string, slotIndex: number, track: ResourceType) => void;
  onConfirm: () => void;
  // Trade props
  trades: Map<ResourceType, number>;
  onSetTrade: (resource: ResourceType, amount: number) => void;
  tradeRate: number;
  moneyFromTrades: number;
  availableResources: readonly { resource: ResourceType; available: number }[];
  // Projected balance
  upkeepSavings: number;
  productionLoss: number;
  trackCapacity: Readonly<Record<ResourceType, number>>;
  disabledSectorKeys: Set<string>;
  projectedBalance: number;
  isResolutionValid: boolean;
}

export function BankruptcyPanel({
  deficit,
  controlledSectors,
  selectedKeys,
  sectorTrackChoices,
  onToggleSector,
  onUpdateTrackChoice,
  onConfirm,
  trades,
  onSetTrade,
  tradeRate,
  moneyFromTrades,
  availableResources,
  upkeepSavings,
  productionLoss,
  trackCapacity,
  disabledSectorKeys,
  projectedBalance,
  isResolutionValid,
}: BankruptcyPanelProps) {

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', height: '100%' }}>
      <h3 style={{ color: 'var(--accent-red, #ef4444)', margin: 0, fontSize: '16px' }}>
        Bankruptcy
      </h3>

      <div style={{
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--accent-red, #ef4444)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
      }}>
        You are <strong style={{ color: 'var(--accent-red, #ef4444)' }}>{deficit} money</strong> in debt.
        Trade resources and/or abandon sectors to resolve.
      </div>

      {/* Balance breakdown */}
      <div style={{
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--border-radius)',
        fontSize: '11px',
        fontFamily: 'var(--font-mono, monospace)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Balance</span>
          <span style={{ color: 'var(--accent-red, #ef4444)', fontWeight: 'bold' }}>
            {-deficit}
          </span>
        </div>
        {moneyFromTrades > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Trades</span>
            <span style={{ color: 'var(--accent-gold, #f59e0b)', fontWeight: 'bold' }}>
              +{moneyFromTrades}
            </span>
          </div>
        )}
        {upkeepSavings > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Savings ({selectedKeys.size} sec)
            </span>
            <span style={{ color: 'var(--accent-blue, #3b82f6)', fontWeight: 'bold' }}>
              +{upkeepSavings}
            </span>
          </div>
        )}
        {productionLoss > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Lost income
            </span>
            <span style={{ color: 'var(--accent-red, #ef4444)', fontWeight: 'bold' }}>
              -{productionLoss}
            </span>
          </div>
        )}
        {(moneyFromTrades > 0 || upkeepSavings > 0 || productionLoss > 0) && (
          <>
            <div style={{ borderTop: '1px solid var(--border-color)', margin: '2px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>After</span>
              <span style={{
                color: projectedBalance >= 0 ? 'var(--accent-green, #22c55e)' : 'var(--accent-red, #ef4444)',
                fontWeight: 'bold',
              }}>
                {projectedBalance >= 0 ? `=${projectedBalance}` : `${projectedBalance}`}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Resource Trading Section */}
      {availableResources.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Trade Resources ({tradeRate}:1)
          </div>
          {availableResources.map(({ resource, available }) => {
            const currentAmount = trades.get(resource) ?? 0;
            const moneyFromThis = Math.floor(currentAmount / tradeRate);
            return (
              <div key={resource} style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--border-radius)',
                border: `1px solid ${currentAmount > 0 ? (TRACK_COLORS[resource] ?? 'var(--border-color)') : 'var(--border-color)'}`,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: TRACK_COLORS[resource] ?? 'var(--text-primary)',
                  }}>
                    {TRACK_LABELS[resource] ?? resource}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {available} available
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <button
                    onClick={() => onSetTrade(resource, Math.max(0, currentAmount - tradeRate))}
                    disabled={currentAmount <= 0}
                    style={{
                      width: '24px',
                      height: '24px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: currentAmount <= 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                      cursor: currentAmount <= 0 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: TRACK_COLORS[resource] ?? 'var(--text-primary)',
                    minWidth: '30px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    {currentAmount}
                  </span>
                  <button
                    onClick={() => onSetTrade(resource, Math.min(available, currentAmount + tradeRate))}
                    disabled={currentAmount >= available}
                    style={{
                      width: '24px',
                      height: '24px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: currentAmount >= available ? 'var(--text-muted)' : 'var(--text-primary)',
                      cursor: currentAmount >= available ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    +
                  </button>
                  {moneyFromThis > 0 && (
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--accent-gold, #f59e0b)',
                      marginLeft: 'auto',
                    }}>
                      +{moneyFromThis} money
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sector abandonment section */}
      {controlledSectors.length > 0 && (
        <>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Abandon Sectors
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {controlledSectors.map(sector => {
              const checked = selectedKeys.has(sector.key);
              const disabled = disabledSectorKeys.has(sector.key);
              const choices = sectorTrackChoices.get(sector.key);
              return (
                <div key={sector.key}>
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      background: checked ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-tertiary)',
                      border: `1px solid ${checked ? 'var(--accent-red, #ef4444)' : 'var(--border-color)'}`,
                      borderRadius: choices && checked ? 'var(--border-radius) var(--border-radius) 0 0' : 'var(--border-radius)',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.45 : 1,
                      transition: 'background var(--transition-fast)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                    }}
                    title={disabled ? 'Track full — cannot return non-wild cubes' : undefined}
                    onClick={() => { if (!disabled) onToggleSector(sector.key); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: `2px solid ${checked ? 'var(--accent-red, #ef4444)' : 'var(--text-muted)'}`,
                        borderRadius: '3px',
                        background: checked ? 'var(--accent-red, #ef4444)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '10px',
                        color: '#fff',
                      }}>
                        {checked ? '\u2713' : ''}
                      </span>
                      <span style={{ fontWeight: 500 }}>{sector.label}</span>
                    </div>
                    {(sector.populations.length > 0 || sector.hasOrbitalPop) && (
                      <div style={{ display: 'flex', gap: '4px', marginLeft: '28px', alignItems: 'center' }}>
                        {sector.populations.map((pop, i) => (
                          <span
                            key={i}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '2px',
                              background: pop.isWild
                                ? 'linear-gradient(135deg, var(--accent-brown, #a16207) 33%, var(--accent-pink, #ec4899) 33%, var(--accent-pink, #ec4899) 66%, var(--accent-gold, #f59e0b) 66%)'
                                : (TRACK_COLORS[pop.sourceTrack] ?? 'var(--text-muted)'),
                              border: pop.isWild ? '1px solid var(--text-muted)' : undefined,
                            }}
                            title={pop.isWild ? 'Wild cube' : `${pop.sourceTrack} cube`}
                          />
                        ))}
                        {sector.hasOrbitalPop && sector.orbitalTrack && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: TRACK_COLORS[sector.orbitalTrack] ?? 'var(--text-muted)',
                              border: '1px solid var(--text-muted)',
                            }}
                            title={`Orbital cube (${sector.orbitalTrack})`}
                          />
                        )}
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '2px' }}>
                          {sector.populations.length + (sector.hasOrbitalPop ? 1 : 0)} cube{(sector.populations.length + (sector.hasOrbitalPop ? 1 : 0)) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Inline track choices for wild/orbital cubes */}
                  {checked && choices && (
                    <div style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      background: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid var(--accent-red, #ef4444)',
                      borderTop: 'none',
                      borderRadius: '0 0 var(--border-radius) var(--border-radius)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Return to which track?
                      </div>
                      {choices.map(entry => (
                        <div key={entry.slotIndex} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {entry.slotIndex === -1 ? (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: TRACK_COLORS[entry.selectedTrack] ?? 'var(--text-muted)',
                              flexShrink: 0,
                              border: '1px solid var(--text-muted)',
                            }} />
                          ) : (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '2px',
                              background: 'linear-gradient(135deg, var(--accent-brown, #a16207) 33%, var(--accent-pink, #ec4899) 33%, var(--accent-pink, #ec4899) 66%, var(--accent-gold, #f59e0b) 66%)',
                              flexShrink: 0,
                              border: '1px solid var(--text-muted)',
                            }} />
                          )}
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '42px' }}>
                            {entry.label}
                          </span>
                          <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
                            {entry.allowedTracks.map(track => {
                              const selected = entry.selectedTrack === track;
                              // Track is available if: it's already selected (entry uses this slot),
                              // OR the track has remaining capacity
                              const trackFull = !selected && (trackCapacity[track] ?? 0) <= 0;
                              return (
                                <button
                                  key={track}
                                  disabled={trackFull}
                                  onClick={(e) => { e.stopPropagation(); if (!trackFull) onUpdateTrackChoice(sector.key, entry.slotIndex, track); }}
                                  title={trackFull ? `${TRACK_LABELS[track] ?? track} track is full` : undefined}
                                  style={{
                                    flex: 1,
                                    padding: '2px 4px',
                                    fontSize: '10px',
                                    fontWeight: selected ? 'bold' : 'normal',
                                    color: trackFull ? 'var(--text-muted)' : selected ? '#fff' : 'var(--text-primary)',
                                    background: selected ? (TRACK_COLORS[track] ?? 'var(--accent-blue)') : 'var(--bg-primary)',
                                    border: `1px solid ${selected ? 'transparent' : 'var(--border-color)'}`,
                                    borderRadius: '3px',
                                    cursor: trackFull ? 'not-allowed' : 'pointer',
                                    opacity: trackFull ? 0.4 : 1,
                                    fontFamily: 'var(--font-body)',
                                  }}
                                >
                                  {TRACK_LABELS[track] ?? track}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Action button */}
      <Button
        onClick={onConfirm}
        disabled={!isResolutionValid}
        style={{ width: '100%' }}
      >
        {!isResolutionValid
          ? `Still in deficit (${projectedBalance})`
          : selectedKeys.size > 0
            ? `Abandon ${selectedKeys.size} sector${selectedKeys.size !== 1 ? 's' : ''}${moneyFromTrades > 0 ? ' + Trade' : ''}`
            : moneyFromTrades > 0
              ? 'Resolve with Trades'
              : 'Resolve'}
      </Button>
    </div>
  );
}
