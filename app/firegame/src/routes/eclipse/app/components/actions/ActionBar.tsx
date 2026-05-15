import { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useLegalActions } from '../../hooks/useLegalActions';
import { useGame } from '../../context/GameContext';
import { Button } from '../shared/Button';
import { SpeciesId } from '@eclipse/shared';
import type { DiplomacyAction } from '@eclipse/shared';

const SPECIES_NAMES: Record<string, string> = {
  [SpeciesId.EridaniEmpire]: 'Eridani',
  [SpeciesId.HydranProgress]: 'Hydran',
  [SpeciesId.Planta]: 'Planta',
  [SpeciesId.DescendantsOfDraco]: 'Draco',
  [SpeciesId.Mechanema]: 'Mechanema',
  [SpeciesId.OrionHegemony]: 'Orion',
};

const SPECIES_BUTTON_COLORS: Record<string, string> = {
  [SpeciesId.EridaniEmpire]: 'var(--player-red)',
  [SpeciesId.HydranProgress]: 'var(--player-blue)',
  [SpeciesId.Planta]: 'var(--player-green)',
  [SpeciesId.DescendantsOfDraco]: 'var(--player-yellow)',
  [SpeciesId.Mechanema]: 'var(--player-white)',
  [SpeciesId.OrionHegemony]: 'var(--player-black)',
};

interface ActionBarProps {
  isExploring?: boolean;
  isResearching?: boolean;
  isUpgrading?: boolean;
  isBuilding?: boolean;
  isMoving?: boolean;
  isInfluencing?: boolean;
  isTrading?: boolean;
  isColonyShipping?: boolean;
  onStartAction?: (actionType: string) => void;
  onCancelAction?: () => void;
  onStartTrade?: () => void;
  onCancelTrade?: () => void;
  onStartColonyShip?: () => void;
  onCancelColonyShip?: () => void;
}

const TRACK_LABELS: Record<string, string> = {
  materials: 'Mat',
  science: 'Sci',
  money: 'Mon',
};

const TRACK_COLORS: Record<string, string> = {
  materials: 'var(--resource-materials)',
  science: 'var(--resource-science)',
  money: 'var(--resource-money)',
};

export function ActionBar({ isExploring, isResearching, isUpgrading, isBuilding, isMoving, isInfluencing, isTrading, isColonyShipping, onStartAction, onCancelAction, onStartTrade, onCancelTrade, onStartColonyShip, onCancelColonyShip }: ActionBarProps) {
  const { isMyTurn, filteredState } = useGameState();
  const legal = useLegalActions();
  const { sendAction } = useGame();
  const [diplomacyPickTarget, setDiplomacyPickTarget] = useState<string | null>(null);

  const getSpeciesName = (playerId: string): string => {
    const opponent = filteredState?.opponents?.[playerId];
    if (opponent) return SPECIES_NAMES[opponent.speciesId] ?? playerId;
    return playerId;
  };

  const getSpeciesColor = (playerId: string): string => {
    const opponent = filteredState?.opponents?.[playerId];
    if (opponent) return SPECIES_BUTTON_COLORS[opponent.speciesId] ?? 'var(--accent-blue)';
    return 'var(--accent-blue)';
  };

  if (isTrading) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--resource-money)', fontWeight: 'bold' }}>
          Trading...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelTrade}>
          Cancel Trade
        </Button>
      </div>
    );
  }

  if (isColonyShipping) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontWeight: 'bold' }}>
          Colonizing...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelColonyShip}>
          Cancel Colony Ship
        </Button>
      </div>
    );
  }

  if (isBuilding) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--resource-materials)', fontWeight: 'bold' }}>
          Building...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelAction}>
          Cancel Build
        </Button>
      </div>
    );
  }

  if (isMoving) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: '#a855f7', fontWeight: 'bold' }}>
          Moving...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelAction}>
          Cancel Move
        </Button>
      </div>
    );
  }

  if (isInfluencing) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: 'bold' }}>
          Influencing...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelAction}>
          Cancel Influence
        </Button>
      </div>
    );
  }

  if (isUpgrading) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--accent-orange)', fontWeight: 'bold' }}>
          Upgrading...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelAction}>
          Cancel Upgrade
        </Button>
      </div>
    );
  }

  if (isResearching) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--resource-science)', fontWeight: 'bold' }}>
          Researching...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelAction}>
          Cancel Research
        </Button>
      </div>
    );
  }

  if (isExploring) {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: 'bold' }}>
          Exploring...
        </span>
        <div style={{ flex: 1 }} />
        <Button size="sm" variant="danger" onClick={onCancelAction}>
          Cancel Explore
        </Button>
      </div>
    );
  }

  if (!isMyTurn && !legal.hasReactions && !legal.canTrade && !legal.canColonyShip && !legal.canDiplomacy && !legal.canRespondToDiplomacy && !legal.isBankrupt) {
    return (
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-md)',
        color: 'var(--text-muted)',
        fontSize: '13px',
        background: 'var(--bg-tertiary)',
      }}>
        Waiting for other player's turn...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--spacing-xs)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      background: 'var(--bg-tertiary)',
      borderTop: '1px solid var(--border-color)',
      flexWrap: 'wrap',
    }}>
      {isMyTurn && (
        <>
          <Button
            size="sm"
            disabled={!legal.canExplore}
            variant={legal.canExplore ? 'primary' : 'ghost'}
            onClick={() => legal.canExplore && onStartAction?.('EXPLORE')}
          >
            Explore
          </Button>
          <Button
            size="sm"
            disabled={!legal.canResearch}
            variant={legal.canResearch ? 'primary' : 'ghost'}
            onClick={() => legal.canResearch && onStartAction?.('RESEARCH')}
          >
            Research
          </Button>
          <Button
            size="sm"
            disabled={!legal.canUpgrade}
            variant={legal.canUpgrade ? 'primary' : 'ghost'}
            onClick={() => legal.canUpgrade && onStartAction?.('UPGRADE')}
          >
            Upgrade
          </Button>
          <Button
            size="sm"
            disabled={!legal.canBuild}
            variant={legal.canBuild ? 'primary' : 'ghost'}
            onClick={() => legal.canBuild && onStartAction?.('BUILD')}
          >
            Build
          </Button>
          <Button
            size="sm"
            disabled={!legal.canMove}
            variant={legal.canMove ? 'primary' : 'ghost'}
            onClick={() => legal.canMove && onStartAction?.('MOVE')}
          >
            Move
          </Button>
          <Button
            size="sm"
            disabled={!legal.canInfluence}
            variant={legal.canInfluence ? 'primary' : 'ghost'}
            onClick={() => legal.canInfluence && onStartAction?.('INFLUENCE')}
          >
            Influence
          </Button>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
          <Button
            size="sm"
            variant="danger"
            disabled={!legal.canPass}
            onClick={() => sendAction({ type: 'PASS' })}
          >
            Pass
          </Button>
        </>
      )}

      {/* Free actions */}
      {legal.canTrade && !isExploring && !isTrading && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onStartTrade}
          style={{ borderColor: 'var(--resource-money)', color: 'var(--resource-money)' }}
        >
          Trade
        </Button>
      )}
      {legal.canColonyShip && !isExploring && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onStartColonyShip}
          style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
        >
          Colony Ship
        </Button>
      )}
      {legal.canDiplomacy && (() => {
        // Group diplomacy targets by playerId
        const grouped = new Map<string, DiplomacyAction[]>();
        for (const action of legal.diplomacyTargets ?? []) {
          let arr = grouped.get(action.targetPlayerId);
          if (!arr) { arr = []; grouped.set(action.targetPlayerId, arr); }
          arr.push(action);
        }
        return Array.from(grouped.entries()).map(([targetId, actions]) => {
          const color = getSpeciesColor(targetId);
          if (diplomacyPickTarget === targetId) {
            return (
              <span key={targetId} style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
                {actions.map((action) => (
                  <Button
                    key={action.sourceTrack}
                    size="sm"
                    variant="secondary"
                    onClick={() => { sendAction(action); setDiplomacyPickTarget(null); }}
                    style={{ borderColor: TRACK_COLORS[action.sourceTrack], color: TRACK_COLORS[action.sourceTrack], fontSize: '11px', padding: '2px 6px' }}
                  >
                    {TRACK_LABELS[action.sourceTrack]}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDiplomacyPickTarget(null)}
                  style={{ fontSize: '11px', padding: '2px 4px' }}
                >
                  &times;
                </Button>
              </span>
            );
          }
          return (
            <Button
              key={targetId}
              size="sm"
              variant="secondary"
              onClick={() => setDiplomacyPickTarget(targetId)}
              style={{ borderColor: color, color }}
            >
              Ally {getSpeciesName(targetId)}
            </Button>
          );
        });
      })()}

      {/* Diplomacy response (target player) */}
      {legal.canRespondToDiplomacy && (() => {
        const sub = filteredState?.subPhase;
        const initiatorId = sub?.type === 'DIPLOMACY_RESPONSE' ? sub.initiatorId : null;
        const initiatorName = initiatorId ? getSpeciesName(initiatorId) : 'Unknown';
        return (
          <span style={{ display: 'inline-flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
              {initiatorName} proposes alliance!
            </span>
            <Button
              size="sm"
              variant="danger"
              onClick={() => sendAction({ type: 'DIPLOMACY_RESPONSE', accept: false })}
            >
              Decline
            </Button>
            {legal.diplomacyResponseOptions
              .filter(opt => opt.accept && opt.sourceTrack)
              .map(opt => (
                <Button
                  key={opt.sourceTrack}
                  size="sm"
                  variant="secondary"
                  onClick={() => sendAction(opt)}
                  style={{
                    borderColor: TRACK_COLORS[opt.sourceTrack!],
                    color: TRACK_COLORS[opt.sourceTrack!],
                  }}
                >
                  Accept ({TRACK_LABELS[opt.sourceTrack!]})
                </Button>
              ))
            }
          </span>
        );
      })()}

      {/* Reactions (only shown on passed player's turn) */}
      {legal.hasReactions && (
        <>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
          <span style={{ fontSize: '11px', color: 'var(--accent-yellow)', alignSelf: 'center', marginRight: '4px' }}>
            React:
          </span>
          {legal.canReactUpgrade && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStartAction?.('REACTION_UPGRADE')}
              style={{ borderColor: 'var(--accent-yellow)', color: 'var(--accent-yellow)' }}
            >
              Upgrade
            </Button>
          )}
          {legal.canReactBuild && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStartAction?.('REACTION_BUILD')}
              style={{ borderColor: 'var(--accent-yellow)', color: 'var(--accent-yellow)' }}
            >
              Build
            </Button>
          )}
          {legal.canReactMove && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStartAction?.('REACTION_MOVE')}
              style={{ borderColor: 'var(--accent-yellow)', color: 'var(--accent-yellow)' }}
            >
              Move
            </Button>
          )}
        </>
      )}
    </div>
  );
}
