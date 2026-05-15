import type { BattleStep } from '../../services/battle-parser';
import { DiceRoller } from './DiceRoller';

interface BattleStageProps {
  step: BattleStep;
  stepIndex: number;
  playerColors: Record<string, string>;
  playerNames: Record<string, string>;
}

export function BattleStage({ step, stepIndex, playerColors, playerNames }: BattleStageProps) {
  const getName = (id: string) => playerNames[id] ?? id;
  const getColor = (id: string) => playerColors[id] ?? 'var(--text-primary)';

  return (
    <div key={stepIndex} className="battle-step-enter" style={{
      padding: 'var(--spacing-md)',
      minHeight: '80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
    }}>
      {step.type === 'dice_rolled' && (
        <DiceRollStep
          step={step}
          getName={getName}
          getColor={getColor}
        />
      )}
      {step.type === 'ship_destroyed' && (
        <ShipDestroyedStep
          step={step}
          getName={getName}
          getColor={getColor}
        />
      )}
      {step.type === 'reputation_drawn' && (
        <ReputationStep
          step={step}
          getName={getName}
          getColor={getColor}
        />
      )}
      {step.type === 'population_destroyed' && (
        <div style={{ color: 'var(--accent-orange)' }}>
          Population ({step.track}) destroyed at ({step.sector.q},{step.sector.r}) by{' '}
          <span style={{ color: getColor(step.destroyedBy) }}>{getName(step.destroyedBy)}</span>
        </div>
      )}
      {step.type === 'influence_placed' && (
        <div style={{ color: 'var(--accent-blue)' }}>
          <span style={{ color: getColor(step.playerId) }}>{getName(step.playerId)}</span>
          {' '}takes control of sector ({step.sector.q},{step.sector.r})
        </div>
      )}
      {step.type === 'discovery_claimed' && (
        <div style={{ color: 'var(--accent-yellow)' }}>
          <span style={{ color: getColor(step.playerId) }}>{getName(step.playerId)}</span>
          {' '}claims a discovery tile
        </div>
      )}
    </div>
  );
}

function DiceRollStep({
  step,
  getName,
  getColor,
}: {
  step: Extract<BattleStep, { type: 'dice_rolled' }>;
  getName: (id: string) => string;
  getColor: (id: string) => string;
}) {
  const hitCount = step.dice.filter(d => d.isHit).length;

  return (
    <>
      <div style={{ fontSize: '14px' }}>
        <span style={{ color: getColor(step.roller), fontWeight: 'bold' }}>
          {getName(step.roller)}
        </span>
        {"'s "}
        <span style={{ fontWeight: 'bold' }}>
          {step.shipType.charAt(0).toUpperCase() + step.shipType.slice(1).toLowerCase()}
        </span>
        {' rolls:'}
      </div>
      <DiceRoller
        dice={step.dice.map(d => ({ color: d.color, face: d.face, isHit: d.isHit }))}
        staggerReveal
      />
      <div style={{
        fontSize: '13px',
        color: hitCount > 0 ? 'var(--accent-green)' : 'var(--text-muted)',
        fontWeight: hitCount > 0 ? 'bold' : 'normal',
      }}>
        {hitCount > 0
          ? `${hitCount} hit${hitCount > 1 ? 's' : ''}!`
          : 'No hits'}
      </div>
    </>
  );
}

function ShipDestroyedStep({
  step,
  getName,
  getColor,
}: {
  step: Extract<BattleStep, { type: 'ship_destroyed' }>;
  getName: (id: string) => string;
  getColor: (id: string) => string;
}) {
  return (
    <div className="ship-explode" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
    }}>
      <span style={{ fontSize: '24px' }}>*</span>
      <div>
        <div style={{ color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '15px' }}>
          Ship destroyed!
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ color: getColor(step.owner) }}>{getName(step.owner)}</span>
          {"'s ship eliminated by "}
          <span style={{ color: getColor(step.destroyedBy) }}>{getName(step.destroyedBy)}</span>
        </div>
      </div>
    </div>
  );
}

function ReputationStep({
  step,
  getName,
  getColor,
}: {
  step: Extract<BattleStep, { type: 'reputation_drawn' }>;
  getName: (id: string) => string;
  getColor: (id: string) => string;
}) {
  const allZero = step.drawn.every(v => v === 0);

  return (
    <div>
      <div style={{ fontSize: '14px' }}>
        <span style={{ color: getColor(step.playerId), fontWeight: 'bold' }}>
          {getName(step.playerId)}
        </span>
        {' '}draws reputation:
      </div>
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        marginTop: 'var(--spacing-xs)',
      }}>
        {step.drawn.map((val, i) => (
          <div key={i} style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            background: 'var(--bg-tertiary)',
            border: step.kept === val ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
          }}>
            {allZero ? '?' : val}
          </div>
        ))}
      </div>
      {step.kept !== null && !allZero && (
        <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '4px' }}>
          Kept: {step.kept} VP
        </div>
      )}
    </div>
  );
}
