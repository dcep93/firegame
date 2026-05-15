import { useState } from 'react';
import type { HexCoord } from '@eclipse/shared';
import { Button } from '../shared/Button';
import { useGameState } from '../../hooks/useGameState';
import type { BuildFlowResult, BuildOption } from '../../hooks/useBuildFlow';

interface BuildPanelProps {
  step: 'pick_type' | 'pick_sector';
  queue: BuildFlowResult['queue'];
  maxActivations: number;
  materialsAvailable: number;
  selectedBuildType: string | null;
  availableBuildTypes: BuildFlowResult['availableBuildTypes'];
  onSelectBuildType: (type: string) => void;
  onRemoveFromQueue: (index: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const BUILD_TYPE_LABELS: Record<string, string> = {
  interceptor: 'Interceptor',
  cruiser: 'Cruiser',
  dreadnought: 'Dreadnought',
  starbase: 'Starbase',
  ORBITAL: 'Orbital',
  MONOLITH: 'Monolith',
};

export function BuildPanel({
  step,
  queue,
  maxActivations,
  materialsAvailable,
  selectedBuildType,
  availableBuildTypes,
  onSelectBuildType,
  onRemoveFromQueue,
  onConfirm,
  onCancel,
}: BuildPanelProps) {
  const { filteredState } = useGameState();
  const getSectorId = (pos: HexCoord) => {
    const key = `${pos.q},${pos.r}`;
    return filteredState?.board.sectors[key]?.sectorId ?? key;
  };
  const isMulti = maxActivations > 1;
  const queueFull = queue.length >= maxActivations;

  return (
    <div style={{
      padding: 'var(--spacing-md)',
      background: 'var(--bg-secondary)',
      height: '100%',
      overflowY: 'auto',
      borderLeft: '1px solid var(--border-color)',
      fontSize: '12px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'var(--resource-materials)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Build
        </span>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>

      {/* Materials available */}
      <div style={{
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: 'var(--text-secondary)' }}>Materials available</span>
        <span style={{ color: 'var(--resource-materials)', fontWeight: 'bold', fontSize: '14px' }}>
          {materialsAvailable}
        </span>
      </div>

      {/* Activation counter (multi only) */}
      {isMulti && (
        <div style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-secondary)',
        }}>
          Activation {queue.length + 1} / {maxActivations}
        </div>
      )}

      {/* Instruction */}
      <div style={{
        padding: 'var(--spacing-sm)',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--accent-yellow)',
        fontSize: '13px',
      }}>
        {step === 'pick_sector'
          ? `Select a sector for ${BUILD_TYPE_LABELS[selectedBuildType ?? ''] ?? selectedBuildType}`
          : isMulti
            ? queueFull
              ? 'Queue full \u2014 confirm or remove an item'
              : 'Select what to build (confirm when ready)'
            : 'Select what to build'}
      </div>

      {/* Build type groups */}
      {step === 'pick_type' && availableBuildTypes.map(group => (
        <div key={group.group} style={{ marginBottom: 'var(--spacing-md)' }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-secondary)',
            fontWeight: 'bold',
            marginBottom: 'var(--spacing-xs)',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '4px',
          }}>
            {group.group}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {group.options.map(opt => (
              <BuildTypeRow
                key={opt.buildType}
                option={opt}
                disabled={!opt.canAfford || queueFull}
                onSelect={() => onSelectBuildType(opt.buildType)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* When picking sector, show selected type highlighted */}
      {step === 'pick_sector' && selectedBuildType && (
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid var(--resource-materials)',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 'bold',
        }}>
          Building: {BUILD_TYPE_LABELS[selectedBuildType] ?? selectedBuildType}
        </div>
      )}

      {/* Queue (multi only) */}
      {isMulti && queue.length > 0 && (
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            Queued ({queue.length})
          </div>
          {queue.map((act, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              borderBottom: i < queue.length - 1 ? '1px solid var(--border-color)' : undefined,
            }}>
              <span style={{ color: 'var(--text-primary)' }}>
                {i + 1}. {BUILD_TYPE_LABELS[act.buildType] ?? act.buildType}{' '}
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                  #{getSectorId(act.sectorPosition)}
                </span>
              </span>
              <button
                onClick={() => onRemoveFromQueue(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-red)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '0 4px',
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm / Cancel buttons (multi only) */}
      {isMulti && (
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-sm)',
        }}>
          <Button
            variant="primary"
            size="sm"
            disabled={queue.length === 0}
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            Confirm ({queue.length})
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

function BuildTypeRow({ option, disabled, onSelect }: { option: BuildOption; disabled: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        background: hovered && !disabled ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
        border: `1px solid ${hovered && !disabled ? 'var(--resource-materials)' : 'var(--border-color)'}`,
        borderRadius: '4px',
        cursor: !disabled ? 'pointer' : 'not-allowed',
        opacity: !disabled ? 1 : 0.45,
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-primary)',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>{option.label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {option.supplyRemaining !== null && (
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {option.supplyRemaining} left
          </span>
        )}
        <span style={{
          color: 'var(--resource-materials)',
          fontWeight: 'bold',
          fontSize: '13px',
          minWidth: '20px',
          textAlign: 'right',
        }}>
          {option.cost}M
        </span>
      </div>
    </button>
  );
}
