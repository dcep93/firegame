import { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { useGameState } from '../../hooks/useGameState';
import { Button } from '../shared/Button';
import type { DiscoveryDecisionAction, LegalActions, ShipType } from '@eclipse/shared';
import { DISCOVERY_TILES_BY_ID, DiscoveryType, TECHS_BY_ID, SHIP_PARTS_BY_ID } from '@eclipse/shared';

const SHIP_TYPE_LABELS: Record<string, string> = {
  interceptor: 'Interceptor',
  cruiser: 'Cruiser',
  dreadnought: 'Dreadnought',
  starbase: 'Starbase',
};

export function DiscoveryDecision() {
  const { filteredState, playerId, legalActions } = useGameState();
  const { sendAction } = useGame();
  const [selectedAction, setSelectedAction] = useState<DiscoveryDecisionAction | null>(null);

  if (!filteredState?.subPhase) return null;
  if (filteredState.subPhase.type !== 'DISCOVERY_DECISION') return null;
  if (filteredState.subPhase.playerId !== playerId) return null;

  const tileId = filteredState.subPhase.tileId;
  const tileDef = DISCOVERY_TILES_BY_ID.get(tileId);
  const decisions = (legalActions as LegalActions | null)?.discoveryDecision ?? [];

  const useRewardOptions = decisions.filter(d => d.decision === 'USE_REWARD');
  const canKeepVP = decisions.some(d => d.decision === 'KEEP_VP');

  const handleSubmit = (action: DiscoveryDecisionAction) => {
    sendAction(action);
    setSelectedAction(null);
  };

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 499,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--accent-yellow)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-xl)',
          maxWidth: '420px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ color: 'var(--accent-yellow)', marginBottom: 'var(--spacing-sm)', textAlign: 'center' }}>
          Discovery Tile
        </h3>

        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {tileDef?.name ?? tileId}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {tileDef?.description ?? ''}
          </div>
        </div>

        {/* USE_REWARD section */}
        {useRewardOptions.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)', fontWeight: 600 }}>
              Use Reward
            </div>
            <RewardOptions
              tileDef={tileDef}
              options={useRewardOptions}
              selected={selectedAction}
              onSelect={setSelectedAction}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {/* KEEP_VP button */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
          {canKeepVP && (
            <Button
              variant="secondary"
              onClick={() => handleSubmit({ type: 'DISCOVERY_DECISION', decision: 'KEEP_VP' })}
              style={{ flex: 1 }}
            >
              Keep for {tileDef?.vpValue ?? 2} VP
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function RewardOptions({
  tileDef,
  options,
  selected,
  onSelect,
  onSubmit,
}: {
  tileDef: ReturnType<typeof DISCOVERY_TILES_BY_ID.get>;
  options: readonly DiscoveryDecisionAction[];
  selected: DiscoveryDecisionAction | null;
  onSelect: (a: DiscoveryDecisionAction) => void;
  onSubmit: (a: DiscoveryDecisionAction) => void;
}) {
  if (!tileDef) return null;

  switch (tileDef.type) {
    case DiscoveryType.ResourceBonus: {
      const bonusText = Object.entries(tileDef.resourceBonus ?? {})
        .map(([res, amt]) => `+${amt} ${res}`)
        .join(', ');
      return (
        <Button onClick={() => onSubmit(options[0]!)} style={{ width: '100%' }}>
          Gain {bonusText}
        </Button>
      );
    }

    case DiscoveryType.AncientTech: {
      if (options.length === 1) {
        // Only one eligible tech — show a direct button
        const tech = TECHS_BY_ID[options[0]!.techId!];
        return (
          <Button onClick={() => onSubmit(options[0]!)} style={{ width: '100%' }}>
            Research {tech?.name ?? options[0]!.techId} (cost {tech?.minCost ?? '?'})
          </Button>
        );
      }
      return (
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Choose one of the lowest-cost techs:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            marginBottom: 'var(--spacing-xs)',
          }}>
            {options.map((opt, i) => {
              const tech = TECHS_BY_ID[opt.techId!];
              const isSelected = selected?.techId === opt.techId;
              return (
                <button
                  key={i}
                  onClick={() => onSelect(opt)}
                  style={{
                    padding: '6px 8px',
                    fontSize: '12px',
                    background: isSelected ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                    color: isSelected ? '#fff' : 'var(--text-primary)',
                    border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {tech?.name ?? opt.techId}
                </button>
              );
            })}
          </div>
          {selected && selected.decision === 'USE_REWARD' && (
            <Button onClick={() => onSubmit(selected)} style={{ width: '100%' }}>
              Research {TECHS_BY_ID[selected.techId!]?.name ?? selected.techId}
            </Button>
          )}
        </div>
      );
    }

    case DiscoveryType.AncientCruiser:
      return (
        <Button onClick={() => onSubmit(options[0]!)} style={{ width: '100%' }}>
          Place Cruiser in sector
        </Button>
      );

    case DiscoveryType.AncientOrbital:
      return (
        <Button onClick={() => onSubmit(options[0]!)} style={{ width: '100%' }}>
          Place Orbital + gain 2 Materials
        </Button>
      );

    case DiscoveryType.AncientMonolith:
      return (
        <Button onClick={() => onSubmit(options[0]!)} style={{ width: '100%' }}>
          Place Monolith in sector
        </Button>
      );

    case DiscoveryType.AncientWarpPortal:
      return (
        <Button onClick={() => onSubmit(options[0]!)} style={{ width: '100%' }}>
          Place Warp Portal in sector
        </Button>
      );

    case DiscoveryType.AncientShipPart:
      return (
        <AncientShipPartReward
          tileDef={tileDef}
          options={options}
          onSubmit={onSubmit}
        />
      );

    default:
      return null;
  }
}

/**
 * Ancient Ship Part reward component.
 * Shows the part stats, then offers: Install Now | Save for Later.
 * Install flow:
 *   - Muon Source: ship type buttons only (no slot selection)
 *   - Others: ship type → slot picker (2 steps)
 */
function AncientShipPartReward({
  tileDef,
  options,
  onSubmit,
}: {
  tileDef: NonNullable<ReturnType<typeof DISCOVERY_TILES_BY_ID.get>>;
  options: readonly DiscoveryDecisionAction[];
  onSubmit: (a: DiscoveryDecisionAction) => void;
}) {
  const [step, setStep] = useState<'choose' | 'ship' | 'slot'>('choose');
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);

  const { filteredState } = useGameState();

  const shipPartId = tileDef.shipPartId;
  const part = shipPartId ? SHIP_PARTS_BY_ID[shipPartId] : null;
  const isMuonSource = shipPartId === 'muon_source';

  const saveForLaterOption = options.find(o => o.saveForLater === true);
  const installOptions = options.filter(o => !o.saveForLater);

  // Group install options by ship type
  const shipTypes = useMemo(() => {
    const set = new Set<string>();
    for (const opt of installOptions) {
      if (opt.targetShipType) set.add(opt.targetShipType);
    }
    return Array.from(set);
  }, [installOptions]);

  // Slots available for the selected ship
  const slotsForShip = useMemo(() => {
    if (!selectedShip) return [];
    return installOptions
      .filter(o => o.targetShipType === selectedShip && o.slotIndex != null)
      .map(o => o.slotIndex!)
      .sort((a, b) => a - b);
  }, [selectedShip, installOptions]);

  const currentBlueprint = selectedShip && filteredState
    ? filteredState.you.blueprints[selectedShip]
    : null;

  // Part stats display
  const statsText = part ? partStatSummary(part) : '';

  if (step === 'choose') {
    return (
      <div>
        {/* Show part info */}
        {part && (
          <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius)',
            padding: '8px',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{part.name}</span>
            {statsText && <span> — {statsText}</span>}
            {isMuonSource && <div style={{ marginTop: '4px', fontStyle: 'italic' }}>Permanent (outside grid)</div>}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {installOptions.length > 0 && (
            <Button onClick={() => setStep('ship')} style={{ width: '100%' }}>
              Install Now
            </Button>
          )}
          {saveForLaterOption && (
            <Button
              variant="secondary"
              onClick={() => onSubmit(saveForLaterOption)}
              style={{ width: '100%' }}
            >
              Save for Later
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'ship') {
    return (
      <div>
        <button
          onClick={() => { setSelectedShip(null); setStep('choose'); }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-blue)',
            cursor: 'pointer',
            fontSize: '12px',
            padding: '0 0 6px 0',
          }}
        >
          &larr; Back
        </button>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Install {part?.name ?? 'part'} — choose ship:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {shipTypes.map(st => (
            <button
              key={st}
              onClick={() => {
                if (isMuonSource) {
                  // Muon Source: submit immediately on ship pick (no slot selection)
                  const action = installOptions.find(o => o.targetShipType === st);
                  if (action) onSubmit(action);
                } else {
                  setSelectedShip(st as ShipType);
                  setStep('slot');
                }
              }}
              style={{
                padding: '8px 10px',
                fontSize: '13px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {SHIP_TYPE_LABELS[st] ?? st}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // step === 'slot'
  return (
    <div>
      <button
        onClick={() => { setSelectedShip(null); setStep('ship'); }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--accent-blue)',
          cursor: 'pointer',
          fontSize: '12px',
          padding: '0 0 6px 0',
        }}
      >
        &larr; Back
      </button>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
        {SHIP_TYPE_LABELS[selectedShip!] ?? selectedShip} — choose slot:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {slotsForShip.map(si => {
          const currentPartId = currentBlueprint?.grid[0]?.[si] ?? null;
          const currentPartName = currentPartId ? (SHIP_PARTS_BY_ID[currentPartId]?.name ?? currentPartId) : 'Empty';
          return (
            <button
              key={si}
              onClick={() => {
                const action = installOptions.find(
                  o => o.targetShipType === selectedShip && o.slotIndex === si,
                );
                if (action) onSubmit(action);
              }}
              style={{
                padding: '8px 10px',
                fontSize: '13px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              Slot {si + 1}: {currentPartName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function partStatSummary(part: {
  energyDelta: number;
  movementDelta: number;
  computerDelta: number;
  shieldDelta: number;
  hullDelta: number;
  initiativeDelta: number;
  weapon?: { dieColor: string; dieCount: number; isMissile: boolean };
}): string {
  const bits: string[] = [];
  if (part.weapon) {
    bits.push(`${part.weapon.dieCount} ${part.weapon.dieColor} ${part.weapon.isMissile ? 'missile' : 'cannon'}`);
  }
  if (part.energyDelta !== 0) bits.push(`${part.energyDelta > 0 ? '+' : ''}${part.energyDelta} energy`);
  if (part.movementDelta !== 0) bits.push(`+${part.movementDelta} move`);
  if (part.computerDelta !== 0) bits.push(`+${part.computerDelta} comp`);
  if (part.shieldDelta !== 0) bits.push(`${part.shieldDelta > 0 ? '+' : ''}${part.shieldDelta} shield`);
  if (part.hullDelta !== 0) bits.push(`+${part.hullDelta} hull`);
  if (part.initiativeDelta !== 0) bits.push(`+${part.initiativeDelta} init`);
  return bits.join(', ');
}
