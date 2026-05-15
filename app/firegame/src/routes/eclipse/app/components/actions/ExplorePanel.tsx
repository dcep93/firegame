import type { SectorDefinition, FilteredPlacedSector } from '@eclipse/shared';
import { Button } from '../shared/Button';
import { TilePreview } from '../board/TilePreview';
import { RotateButton } from './RotateButton';

interface ExplorePanelProps {
  step: 'pick_hex' | 'review_tile';
  sectorDef: SectorDefinition | null;
  rotation: number;
  takeInfluence: boolean;
  validRotations: Set<number>;
  currentActivation: number;
  maxActivations: number;
  isPeeking: boolean;
  isDraco?: boolean;
  onSetRotation: (rot: number) => void;
  onSetTakeInfluence: (val: boolean) => void;
  onConfirmPlace: () => void;
  onConfirmDiscard: () => void;
  onCancel: () => void;
  onTileInspect?: (sector: FilteredPlacedSector) => void;
}

export function ExplorePanel({
  step,
  sectorDef,
  rotation,
  takeInfluence,
  validRotations,
  currentActivation,
  maxActivations,
  isPeeking,
  isDraco,
  onSetRotation,
  onSetTakeInfluence,
  onConfirmPlace,
  onConfirmDiscard,
  onCancel,
  onTileInspect,
}: ExplorePanelProps) {
  const hasAncients = sectorDef ? (sectorDef.hasAncient || (sectorDef.ancientCount ?? 0) > 0) : false;
  const showInfluenceToggle = !hasAncients || isDraco;

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
          color: 'var(--accent-blue)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Explore Action
        </span>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>

      {/* Activation counter */}
      {maxActivations > 1 && (
        <div style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-secondary)',
        }}>
          Activation {currentActivation} / {maxActivations}
        </div>
      )}

      {/* Step indicator */}
      <div style={{
        padding: 'var(--spacing-sm)',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--accent-yellow)',
        fontSize: '13px',
      }}>
        {step === 'pick_hex' && !isPeeking && 'Click a highlighted hex to explore'}
        {step === 'pick_hex' && isPeeking && 'Drawing tile...'}
        {step === 'review_tile' && 'Review drawn tile — choose rotation'}
      </div>

      {/* Zoomed tile preview with rotation controls inside */}
      {sectorDef && (
        <div style={{
          padding: 'var(--spacing-md)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-xs)',
          }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '13px' }}>
              {sectorDef.name}
            </span>
            <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {hasAncients && (
                <span style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: 600 }}>
                  {sectorDef.ancientCount ?? 1} Ancient{(sectorDef.ancientCount ?? 1) > 1 ? 's' : ''}
                </span>
              )}
              {sectorDef.hasDiscovery && (
                <span style={{ fontSize: '11px', color: 'var(--accent-yellow)' }}>Discovery</span>
              )}
              {sectorDef.vpValue > 0 && (
                <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
                  {sectorDef.vpValue} VP
                </span>
              )}
            </span>
          </div>
          {step === 'review_tile' && (
            <RotateButton
              rotation={rotation}
              validRotations={validRotations}
              onSetRotation={onSetRotation}
            />
          )}
          <TilePreview sectorDef={sectorDef} rotation={rotation} maxWidth={240} onInspect={onTileInspect} />
        </div>
      )}

      {/* Influence + actions */}
      {step === 'review_tile' && sectorDef && (
        <>
          {/* Take influence toggle — hidden if ancients present (unless Draco) */}
          {showInfluenceToggle && (
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 'var(--spacing-xs)',
              }}>
                Influence
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => onSetTakeInfluence(true)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--border-radius)',
                    border: takeInfluence ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    background: takeInfluence ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                    color: takeInfluence ? '#fff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  Place Disc
                </button>
                <button
                  onClick={() => onSetTakeInfluence(false)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--border-radius)',
                    border: !takeInfluence ? '2px solid var(--accent-yellow)' : '1px solid var(--border-color)',
                    background: !takeInfluence ? 'rgba(255, 193, 7, 0.2)' : 'var(--bg-tertiary)',
                    color: !takeInfluence ? 'var(--accent-yellow)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  No Disc
                </button>
              </div>
            </div>
          )}
          {hasAncients && !isDraco && (
            <div style={{
              marginBottom: 'var(--spacing-md)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: 'rgba(255, 74, 106, 0.1)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--accent-red)',
              fontSize: '11px',
            }}>
              Cannot place disc — sector has ancients
            </div>
          )}
          {hasAncients && isDraco && (
            <div style={{
              marginBottom: 'var(--spacing-md)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: 'rgba(74, 222, 128, 0.1)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--accent-green, #4ade80)',
              fontSize: '11px',
            }}>
              Draco coexists with ancients — disc allowed
            </div>
          )}

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-sm)',
          }}>
            <Button
              variant="primary"
              size="sm"
              disabled={!validRotations.has(rotation)}
              onClick={onConfirmPlace}
              style={{ flex: 1 }}
            >
              Place Tile
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onConfirmDiscard}
              style={{ flex: 1 }}
            >
              Discard
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

