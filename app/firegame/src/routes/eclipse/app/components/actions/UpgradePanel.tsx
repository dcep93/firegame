import { useState } from 'react';
import {
  SHIP_PARTS_BY_ID,
  ShipPartCategory,
  DieColor,
} from '@eclipse/shared';
import type {
  ShipType,
  UpgradeActivation,
  ComputedBlueprintStats,
  BlueprintState,
  ShipPartDefinition,
} from '@eclipse/shared';
import { Button } from '../shared/Button';
import type { UpgradeFlowResult } from '../../hooks/useUpgradeFlow';

// ── Constants (reuse from BlueprintCard patterns) ──

const PART_ABBREV: Record<string, string> = {
  nuclear_source: 'Nuc', fusion_source: 'Fus', tachyon_source: 'Tac', zero_point_source: 'ZPt',
  nuclear_drive: 'NuD', fusion_drive: 'FuD', tachyon_drive: 'TaD', transition_drive: 'TrD',
  ion_cannon: 'Ion', plasma_cannon: 'Pla', antimatter_cannon: 'Ant', soliton_cannon: 'Sol',
  plasma_missile: 'PlM', flux_missile: 'FlM',
  electron_computer: 'Elc', positron_computer: 'Pos', gluon_computer: 'Glu',
  gauss_shield: 'Gau', phase_shield: 'Pha', absorption_shield: 'Abs', conifold_field: 'Con',
  hull: 'Hul', improved_hull: 'Imp', sentient_hull: 'Sen',
  muon_source: 'Muo',
};

const PART_CATEGORY_COLORS: Record<string, string> = {
  [ShipPartCategory.Weapon]: 'var(--accent-red)',
  [ShipPartCategory.Energy]: 'var(--accent-yellow)',
  [ShipPartCategory.Drive]: 'var(--accent-green)',
  [ShipPartCategory.Computer]: 'var(--accent-blue)',
  [ShipPartCategory.Shield]: '#26c6da',
  [ShipPartCategory.Hull]: 'var(--text-secondary)',
};

const CATEGORY_LABELS: Record<string, string> = {
  [ShipPartCategory.Weapon]: 'Weapons',
  [ShipPartCategory.Energy]: 'Energy',
  [ShipPartCategory.Drive]: 'Drives',
  [ShipPartCategory.Computer]: 'Computers',
  [ShipPartCategory.Shield]: 'Shields',
  [ShipPartCategory.Hull]: 'Hulls',
  remove: 'Remove',
};

const SHIP_LABELS: Record<string, string> = {
  interceptor: 'INTERCEPTOR',
  cruiser: 'CRUISER',
  dreadnought: 'DREADNOUGHT',
  starbase: 'STARBASE',
};

// ── Props ──

interface UpgradePanelProps {
  queue: UpgradeFlowResult['queue'];
  maxActivations: number;
  placementCount: number;
  selectedShip: ShipType | null;
  selectedSlot: number | null;
  previewBlueprints: Readonly<Record<string, BlueprintState>> | null;
  availableShipTypes: ShipType[];
  availableSlots: UpgradeFlowResult['availableSlots'];
  availableParts: UpgradeFlowResult['availableParts'];
  previewStats: ComputedBlueprintStats | null;
  canConfirm: boolean;
  onSelectShip: (shipType: ShipType) => void;
  onSelectSlot: (slotIndex: number) => void;
  onSelectPart: (partId: string | null) => void;
  onRemoveFromQueue: (index: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

// ── Main Component ──

export function UpgradePanel({
  queue,
  maxActivations,
  placementCount,
  selectedShip,
  selectedSlot,
  previewBlueprints,
  availableShipTypes,
  availableSlots,
  availableParts,
  previewStats,
  canConfirm,
  onSelectShip,
  onSelectSlot,
  onSelectPart,
  onRemoveFromQueue,
  onConfirm,
  onCancel,
}: UpgradePanelProps) {
  const isMulti = maxActivations > 1;
  // Only placements count toward the limit; removals are free
  const placementsFull = placementCount >= maxActivations;

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
          color: 'var(--accent-orange)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Upgrade
        </span>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
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
          Placements {placementCount} / {maxActivations} (removals are free)
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
        {placementsFull
          ? 'Placements full \u2014 confirm, remove, or add free removals'
          : selectedSlot !== null
            ? 'Select a part to install'
            : selectedShip
              ? 'Select a slot to modify'
              : 'Select a ship to upgrade'}
      </div>

      {/* Ship Selector */}
      <ShipSelector
        availableShipTypes={availableShipTypes}
        selectedShip={selectedShip}
        previewBlueprints={previewBlueprints}
        queue={queue}
        onSelectShip={onSelectShip}
      />

      {/* Slot Picker */}
      {selectedShip && (
        <SlotPicker
          shipType={selectedShip}
          selectedSlot={selectedSlot}
          availableSlots={availableSlots}
          queue={queue}
          onSelectSlot={onSelectSlot}
        />
      )}

      {/* Part Picker */}
      {selectedSlot !== null && (
        <PartPicker
          availableParts={availableParts}
          placementsFull={placementsFull}
          onSelectPart={onSelectPart}
        />
      )}

      {/* Preview Stats */}
      {selectedShip && previewStats && (
        <PreviewStats stats={previewStats} />
      )}

      {/* Queue (multi only) */}
      {isMulti && queue.length > 0 && (
        <QueueDisplay
          queue={queue}
          onRemoveFromQueue={onRemoveFromQueue}
        />
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
            disabled={!canConfirm}
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

// ── Ship Selector ──

function ShipSelector({
  availableShipTypes,
  selectedShip,
  previewBlueprints,
  queue,
  onSelectShip,
}: {
  availableShipTypes: ShipType[];
  selectedShip: ShipType | null;
  previewBlueprints: Readonly<Record<string, BlueprintState>> | null;
  queue: UpgradeActivation[];
  onSelectShip: (shipType: ShipType) => void;
}) {
  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <div style={{
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-xs)',
        fontWeight: 'bold',
      }}>
        Ships
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {availableShipTypes.map(shipType => {
          const bp = previewBlueprints?.[shipType];
          const isSelected = selectedShip === shipType;
          const queuedCount = queue.filter(a => a.shipType === shipType).length;

          return (
            <ShipRow
              key={shipType}
              shipType={shipType}
              blueprint={bp ?? null}
              isSelected={isSelected}
              queuedCount={queuedCount}
              onSelect={() => onSelectShip(shipType)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ShipRow({
  shipType,
  blueprint,
  isSelected,
  queuedCount,
  onSelect,
}: {
  shipType: ShipType;
  blueprint: BlueprintState | null;
  isSelected: boolean;
  queuedCount: number;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 8px',
        background: isSelected ? 'var(--bg-hover)' : hovered ? 'var(--bg-tertiary)' : 'var(--bg-tertiary)',
        border: `1px solid ${isSelected ? 'var(--accent-orange)' : 'var(--border-color)'}`,
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-primary)',
      }}
    >
      <span style={{ fontWeight: 'bold', minWidth: '90px' }}>
        {SHIP_LABELS[shipType] ?? shipType}
      </span>
      {blueprint && (
        <MiniPartGrid grid={blueprint.grid[0]!} fixedParts={blueprint.fixedParts} />
      )}
      {queuedCount > 0 && (
        <span style={{
          marginLeft: 'auto',
          fontSize: '9px',
          color: 'var(--accent-orange)',
          fontWeight: 'bold',
        }}>
          {queuedCount} queued
        </span>
      )}
    </button>
  );
}

function MiniPartGrid({ grid, fixedParts }: { grid: readonly (string | null)[]; fixedParts: readonly string[] }) {
  const fixedSet = new Set(fixedParts);
  return (
    <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
      {grid.map((partId, i) => {
        const def = partId ? SHIP_PARTS_BY_ID[partId] : null;
        const abbrev = partId ? (PART_ABBREV[partId] ?? partId.slice(0, 3)) : null;
        const color = def ? PART_CATEGORY_COLORS[def.category] ?? 'var(--text-secondary)' : undefined;
        const isFixed = partId !== null && fixedSet.has(partId);

        return (
          <span key={i} style={{
            fontSize: '8px',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            padding: '1px 3px',
            borderRadius: '2px',
            background: def ? color : 'var(--bg-primary)',
            color: def ? 'var(--bg-primary)' : 'var(--text-muted)',
            border: def ? `1px solid ${color}` : '1px dashed var(--border-color)',
            opacity: isFixed ? 0.6 : 1,
          }}>
            {abbrev ?? '\u00B7'}
          </span>
        );
      })}
    </div>
  );
}

// ── Slot Picker ──

function SlotPicker({
  shipType,
  selectedSlot,
  availableSlots,
  queue,
  onSelectSlot,
}: {
  shipType: ShipType;
  selectedSlot: number | null;
  availableSlots: Map<number, { currentPart: string | null; isFixed: boolean; hasOptions: boolean }>;
  queue: UpgradeActivation[];
  onSelectSlot: (slotIndex: number) => void;
}) {
  const queuedSlotSet = new Set(queue.filter(a => a.shipType === shipType).map(a => a.slotIndex));

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <div style={{
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--accent-orange)',
        marginBottom: 'var(--spacing-xs)',
        fontWeight: 'bold',
        borderBottom: '1px solid var(--accent-orange)',
        paddingBottom: '4px',
      }}>
        {SHIP_LABELS[shipType]} Slots
      </div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {Array.from(availableSlots.entries()).map(([slotIndex, slot]) => {
          const isQueued = queuedSlotSet.has(slotIndex);
          const isSelected = selectedSlot === slotIndex;
          const canClick = slot.hasOptions && !slot.isFixed && !isQueued;

          const def = slot.currentPart ? SHIP_PARTS_BY_ID[slot.currentPart] : null;
          const abbrev = slot.currentPart ? (PART_ABBREV[slot.currentPart] ?? slot.currentPart.slice(0, 3)) : null;
          const color = def ? PART_CATEGORY_COLORS[def.category] ?? 'var(--text-secondary)' : undefined;

          return (
            <button
              key={slotIndex}
              disabled={!canClick}
              onClick={() => canClick && onSelectSlot(slotIndex)}
              style={{
                width: '44px',
                height: '32px',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                color: def ? 'var(--bg-primary)' : 'var(--text-muted)',
                background: isSelected
                  ? 'var(--accent-orange)'
                  : def ? color : 'var(--bg-primary)',
                border: isSelected
                  ? '2px solid var(--text-primary)'
                  : isQueued
                    ? '2px solid var(--accent-orange)'
                    : canClick
                      ? `1px solid ${color ?? 'var(--border-color)'}`
                      : '1px dashed var(--border-color)',
                cursor: canClick ? 'pointer' : 'default',
                opacity: slot.isFixed ? 0.4 : canClick || isQueued ? 1 : 0.5,
                position: 'relative',
              }}
            >
              {abbrev ?? '\u00B7'}
              {isQueued && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--accent-orange)',
                  fontSize: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  Q
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Part Picker ──

function PartPicker({
  availableParts,
  placementsFull,
  onSelectPart,
}: {
  availableParts: { partId: string | null; def: ShipPartDefinition | null; category: string }[];
  placementsFull: boolean;
  onSelectPart: (partId: string | null) => void;
}) {
  // Group by category
  const groups = new Map<string, typeof availableParts>();
  for (const part of availableParts) {
    const cat = part.category;
    const existing = groups.get(cat) ?? [];
    existing.push(part);
    groups.set(cat, existing);
  }

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <div style={{
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-xs)',
        fontWeight: 'bold',
      }}>
        Available Parts
      </div>
      {Array.from(groups.entries()).map(([category, parts]) => (
        <div key={category} style={{ marginBottom: '6px' }}>
          <div style={{
            fontSize: '10px',
            color: PART_CATEGORY_COLORS[category] ?? 'var(--text-muted)',
            fontWeight: 'bold',
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {CATEGORY_LABELS[category] ?? category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {parts.map(part => {
              // Placements are disabled when placement limit is reached; removals always enabled
              const isDisabled = part.partId !== null && placementsFull;
              return (
                <PartRow
                  key={part.partId ?? 'remove'}
                  partId={part.partId}
                  def={part.def}
                  category={part.category}
                  disabled={isDisabled}
                  onSelect={() => onSelectPart(part.partId)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function PartRow({
  partId,
  def,
  category,
  disabled,
  onSelect,
}: {
  partId: string | null;
  def: ShipPartDefinition | null;
  category: string;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isRemove = partId === null;
  const color = isRemove ? 'var(--accent-red)' : PART_CATEGORY_COLORS[category] ?? 'var(--text-secondary)';

  // Build delta text
  const deltas: string[] = [];
  if (def) {
    if (def.energyDelta !== 0) deltas.push(`${def.energyDelta > 0 ? '+' : ''}${def.energyDelta}E`);
    if (def.computerDelta !== 0) deltas.push(`C${def.computerDelta > 0 ? '+' : ''}${def.computerDelta}`);
    if (def.shieldDelta !== 0) deltas.push(`S${def.shieldDelta > 0 ? '+' : ''}${def.shieldDelta}`);
    if (def.hullDelta !== 0) deltas.push(`H${def.hullDelta > 0 ? '+' : ''}${def.hullDelta}`);
    if (def.movementDelta !== 0) deltas.push(`Mv${def.movementDelta > 0 ? '+' : ''}${def.movementDelta}`);
    if (def.initiativeDelta !== 0) deltas.push(`I${def.initiativeDelta > 0 ? '+' : ''}${def.initiativeDelta}`);
    if (def.weapon) {
      const dieLabel = def.weapon.dieColor === DieColor.Yellow ? 'Y'
        : def.weapon.dieColor === DieColor.Orange ? 'O'
        : def.weapon.dieColor === DieColor.Red ? 'R'
        : 'B';
      deltas.push(`${def.weapon.dieCount}x${dieLabel}${def.weapon.isMissile ? 'm' : ''}`);
    }
  }

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
        padding: '5px 8px',
        background: hovered && !disabled ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
        border: `1px solid ${hovered && !disabled ? color : 'var(--border-color)'}`,
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-primary)',
      }}
    >
      <span style={{ fontWeight: 'bold', color: isRemove ? 'var(--accent-red)' : undefined }}>
        {isRemove ? 'Remove part' : def?.name ?? partId}
      </span>
      {deltas.length > 0 && (
        <span style={{
          fontSize: '9px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          flexShrink: 0,
          marginLeft: '8px',
        }}>
          {deltas.join(' ')}
        </span>
      )}
    </button>
  );
}

// ── Preview Stats ──

function PreviewStats({ stats }: { stats: ComputedBlueprintStats }) {
  const energyColor = stats.energyBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

  return (
    <div style={{
      padding: 'var(--spacing-xs) var(--spacing-sm)',
      background: 'var(--bg-tertiary)',
      borderRadius: 'var(--border-radius)',
      marginBottom: 'var(--spacing-md)',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      color: 'var(--text-muted)',
    }}>
      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
        fontWeight: 'bold',
        fontFamily: 'var(--font-body)',
      }}>
        Preview
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <span>I:{stats.initiative}</span>
        <span>Mv:{stats.movement}</span>
        <span>H:{stats.hullValue}</span>
        <span>S:{stats.shieldValue}</span>
        <span>C:{stats.computerValue}</span>
      </div>
      <div style={{ color: energyColor }}>
        {'\u26A1'} +{stats.energyProduction}/{'\u2212'}{stats.energyConsumption} = {stats.energyBalance}
      </div>
    </div>
  );
}

// ── Queue Display ──

function QueueDisplay({
  queue,
  onRemoveFromQueue,
}: {
  queue: UpgradeActivation[];
  onRemoveFromQueue: (index: number) => void;
}) {
  return (
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
      {queue.map((act, i) => {
        const partDef = act.partId ? SHIP_PARTS_BY_ID[act.partId] : null;
        const partName = act.partId === null ? 'Remove' : (partDef?.name ?? act.partId);

        return (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
            borderBottom: i < queue.length - 1 ? '1px solid var(--border-color)' : undefined,
          }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '11px' }}>
              {i + 1}. {(SHIP_LABELS[act.shipType] ?? act.shipType).slice(0, 3)} slot {act.slotIndex} {'\u2190'} {partName}
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
        );
      })}
    </div>
  );
}
