import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { BattleReplay, BattleStep } from '../../services/battle-parser';
import type { CombatFlowState } from '../../hooks/useCombatFlow';
import type { BattlefieldState } from '../../hooks/useBattlefield';
import type { RetreatDecisionFlowResult } from '../../hooks/useRetreatDecisionFlow';
import type { DamageAssignmentFlowResult } from '../../hooks/useDamageAssignmentFlow';
import { RetreatDecisionPanel } from './RetreatDecisionPanel';
import { DamageAssignmentPanel } from './DamageAssignmentPanel';
import { BattleStage } from './BattleStage';
import { BattlefieldDisplay } from './BattlefieldDisplay';
import { BattleControls } from './BattleControls';
import { Button } from '../shared/Button';

// ── Animation timing constants (ms) ──

const DICE_PHASE_MS = 900;        // Let dice stagger-reveal finish
const MISS_HOLD_MS = 500;         // Brief pause to see "No hits" before cleanup
const MISSILE_FLIGHT_MS = 1000;   // Missile arcs across with exhaust
const CANNON_FLIGHT_MS = 800;     // Cannon bolt zips across
const IMPACT_SETTLE_MS = 700;     // Let hull break + hit flash play out

type AnimPhase = 'idle' | 'dice' | 'projectile' | 'impact';

// ── Legacy Replay Props (from useCombatReplay) ──

interface LegacyBattlePanelProps {
  mode: 'replay';
  battles: BattleReplay[];
  battleIndex: number;
  stepIndex: number;
  currentStep: BattleStep | null;
  phaseLabel: string;
  autoAdvance: boolean;
  isComplete: boolean;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkipBattle: () => void;
  onSkipAll: () => void;
  onToggleAuto: () => void;
  onDismiss: () => void;
  playerColors: Record<string, string>;
  playerNames: Record<string, string>;
}

// ── Interactive Props (from useCombatFlow) ──

interface InteractiveBattlePanelProps {
  mode: 'interactive';
  combatFlow: CombatFlowState;
  battlefield: BattlefieldState | null;
  playerColors: Record<string, string>;
  playerNames: Record<string, string>;
  retreatDecision?: RetreatDecisionFlowResult;
  damageAssignment?: DamageAssignmentFlowResult;
  onVictoryDismiss?: () => void;
}

type BattlePanelProps = LegacyBattlePanelProps | InteractiveBattlePanelProps;

export function BattlePanel(props: BattlePanelProps) {
  if (props.mode === 'interactive') {
    return <InteractivePanel {...props} />;
  }
  return <ReplayPanel {...props} />;
}

// ── Interactive Mode ──

function formatShipType(shipType: string): string {
  return shipType.charAt(0).toUpperCase() + shipType.slice(1).toLowerCase();
}

/** Compute total damage across all ships in a battlefield for change detection. */
function battlefieldDamageFingerprint(bf: BattlefieldState | null): string {
  if (!bf) return '';
  const parts: string[] = [];
  for (const faction of [bf.left, bf.right]) {
    for (const group of faction.shipGroups) {
      for (const ship of group.ships) {
        parts.push(`${ship.id}:${ship.damage}:${ship.isDestroyed ? 1 : 0}:${ship.isRetreating ? 1 : 0}:${ship.isRetreated ? 1 : 0}`);
      }
    }
  }
  return parts.join(',');
}

function InteractivePanel({
  combatFlow,
  battlefield,
  playerColors,
  playerNames,
  retreatDecision,
  damageAssignment,
  onVictoryDismiss,
}: InteractiveBattlePanelProps) {
  const getName = (id: string) => playerNames[id] ?? id;
  const getColor = (id: string) => playerColors[id] ?? 'var(--text-primary)';

  // Whether the retreat sub-phase is active (round-boundary decision)
  const isRetreatSubPhase = retreatDecision?.active ?? false;
  // Whether the damage assignment sub-phase is active
  const isDamageAssignmentSubPhase = damageAssignment?.active ?? false;

  // ── Staged animation state ──
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');
  const animPhaseRef = useRef<AnimPhase>('idle');
  const [displayBattlefield, setDisplayBattlefield] = useState(battlefield);
  const prevBfFingerprintRef = useRef(battlefieldDamageFingerprint(battlefield));
  const prevDiceFingerprintRef = useRef('');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Track attacker and weapon type at the moment of the roll
  const [projectileActor, setProjectileActor] = useState<string | null>(null);
  const [weaponType, setWeaponType] = useState<'missile' | 'cannon'>('cannon');
  // Keep recentSteps in a ref so we can read them in the effect without adding as dep
  const recentStepsRef = useRef(combatFlow.recentSteps);
  recentStepsRef.current = combatFlow.recentSteps;

  // Stable fingerprint for dice results — triggers animation even when battlefield doesn't change (all misses)
  const currentDiceFingerprint = useMemo(() => {
    const diceStep = combatFlow.recentSteps.find(s => s.type === 'dice_rolled');
    if (!diceStep || diceStep.type !== 'dice_rolled') return '';
    return `${diceStep.roller}:${diceStep.shipType}:` +
      diceStep.dice.map(d => `${d.color}:${d.face}:${d.isHit ? 1 : 0}`).join(',');
  }, [combatFlow.recentSteps]);

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
  }, []);

  const setPhase = useCallback((phase: AnimPhase) => {
    animPhaseRef.current = phase;
    setAnimPhase(phase);
  }, []);

  useEffect(() => {
    const newBfFp = battlefieldDamageFingerprint(battlefield);
    const bfChanged = newBfFp !== prevBfFingerprintRef.current;
    const newDice = currentDiceFingerprint !== '' && currentDiceFingerprint !== prevDiceFingerprintRef.current;

    if (animPhaseRef.current !== 'idle') {
      // New state arrived during animation — force-complete current animation
      // so we don't get stuck (cleanup would cancel the timers that reset to idle)
      clearTimers();
      if (battlefield) setDisplayBattlefield(battlefield);
      prevBfFingerprintRef.current = newBfFp;
      prevDiceFingerprintRef.current = currentDiceFingerprint;
      setPhase('idle');
      setProjectileActor(null);
      return;
    }

    if (newDice) {
      // New dice results — start full staged animation: announce → dice → projectile → impact
      prevDiceFingerprintRef.current = currentDiceFingerprint;
      prevBfFingerprintRef.current = newBfFp;
      const pendingBattlefield = battlefield;

      const steps = recentStepsRef.current;
      const diceStep = steps.find(s => s.type === 'dice_rolled');
      if (!diceStep || diceStep.type !== 'dice_rolled') return clearTimers;

      const hitCount = diceStep.dice.filter(d => d.isHit).length;
      const roller = diceStep.roller;
      const isMissile = diceStep.purpose === 'missiles';

      setWeaponType(isMissile ? 'missile' : 'cannon');
      setProjectileActor(roller);

      // Start with dice phase directly — the idle "Next:" preview already announced who fires
      setPhase('dice');

      if (hitCount > 0) {
        // Hits — dice → projectile → impact → idle
        const flightMs = isMissile ? MISSILE_FLIGHT_MS : CANNON_FLIGHT_MS;

        const t0 = setTimeout(() => setPhase('projectile'), DICE_PHASE_MS);
        const t1 = setTimeout(() => {
          setDisplayBattlefield(pendingBattlefield);
          setPhase('impact');
        }, DICE_PHASE_MS + flightMs);
        const t2 = setTimeout(() => {
          setPhase('idle');
          setProjectileActor(null);
        }, DICE_PHASE_MS + flightMs + IMPACT_SETTLE_MS);

        timersRef.current = [t0, t1, t2];
      } else {
        // All misses — dice → brief hold → idle
        const t0 = setTimeout(() => {
          if (bfChanged && pendingBattlefield) setDisplayBattlefield(pendingBattlefield);
          setPhase('idle');
          setProjectileActor(null);
        }, DICE_PHASE_MS + MISS_HOLD_MS);

        timersRef.current = [t0];
      }
    } else if (bfChanged && battlefield) {
      // Battlefield changed without dice (post-battle cleanup) — sync immediately
      prevBfFingerprintRef.current = newBfFp;
      setDisplayBattlefield(battlefield);
    } else if (!bfChanged) {
      // No meaningful changes — keep display in sync
      setDisplayBattlefield(battlefield);
      prevBfFingerprintRef.current = newBfFp;
    }

    return clearTimers;
  }, [battlefield, currentDiceFingerprint, clearTimers, setPhase]);

  const battle = combatFlow.battle;
  if (!battle) return null;

  const pos = combatFlow.sectorPosition;
  const posLabel = pos ? `#${combatFlow.sectorId ?? battle.sectorKey}` : battle.sectorKey;

  // During animation, hide the "next" button so the player can't skip
  const isAnimating = animPhase !== 'idle';

  // Victory detection — one (or both) faction(s) wiped out
  const leftWiped = displayBattlefield != null && displayBattlefield.left.totalAlive === 0;
  const rightWiped = displayBattlefield != null && displayBattlefield.right.totalAlive === 0;
  const isVictory = !isAnimating && (leftWiped || rightWiped);
  const victorFaction = isVictory
    ? (leftWiped && rightWiped ? null : leftWiped ? displayBattlefield!.right : displayBattlefield!.left)
    : null;

  // Determine projectile direction based on which faction column is actor
  const projectileDirection = (() => {
    if (animPhase !== 'projectile' || !projectileActor || !displayBattlefield) return null;
    if (projectileActor === displayBattlefield.left.ownerId) return 'ltr' as const;
    if (projectileActor === displayBattlefield.right.ownerId) return 'rtl' as const;
    return null;
  })();

  // Get projectile color from the dice that were just rolled
  const projectileColor = (() => {
    const diceStep = combatFlow.recentSteps.find(s => s.type === 'dice_rolled');
    if (!diceStep || diceStep.type !== 'dice_rolled') return 'var(--accent-yellow)';
    const COLORS: Record<string, string> = {
      yellow: 'var(--accent-yellow)',
      orange: 'var(--accent-orange)',
      blue: 'var(--accent-blue)',
      red: 'var(--accent-red)',
    };
    // Use the color of the first die
    return COLORS[diceStep.dice[0]?.color ?? 'yellow'] ?? 'var(--accent-yellow)';
  })();

  return (
    <>
      {/* Backdrop */}
      <div
        className="combat-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 900,
        }}
      />

      {/* Panel */}
      <div
        className="fade-in"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-card)',
          border: '2px solid var(--accent-red)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          zIndex: 901,
          width: '680px',
          maxWidth: '90vw',
          height: 'min(80vh, 640px)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--spacing-sm)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              color: 'var(--accent-red)',
              margin: 0,
              fontSize: '18px',
            }}>
              BATTLE at {posLabel}
            </h2>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginTop: '4px',
            }}>
              {battle.participants.map((p, i) => (
                <span key={String(p)}>
                  {i > 0 && ' vs '}
                  <span style={{ color: getColor(String(p)), fontWeight: 'bold' }}>
                    {getName(String(p))}
                  </span>
                </span>
              ))}
            </div>
          </div>
          {combatFlow.totalBattles > 1 && (
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              padding: '2px 8px',
              background: 'var(--bg-tertiary)',
              borderRadius: '4px',
            }}>
              Battle {combatFlow.battleIndex + 1} of {combatFlow.totalBattles}
            </div>
          )}
        </div>

        {/* Phase label */}
        <div style={{
          padding: '6px 0',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 'bold',
          color: isRetreatSubPhase ? 'var(--accent-yellow)' : 'var(--text-secondary)',
          letterSpacing: '0.5px',
          flexShrink: 0,
        }}>
          {isRetreatSubPhase ? 'Retreat Decision' : combatFlow.phaseLabel}
        </div>

        {/* Battlefield ship display (with staged damage) */}
        {displayBattlefield && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <BattlefieldDisplay
              battlefield={displayBattlefield}
              actorOwner={combatFlow.actorOwner}
              targetOwner={combatFlow.targetOwner}
            />

            {/* Projectile overlay */}
            {projectileDirection && (
              <ProjectileOverlay
                direction={projectileDirection}
                color={projectileColor}
                weaponType={weaponType}
              />
            )}
          </div>
        )}

        {/* Step content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: 'var(--spacing-md)',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
        }}>
          {/* Retreat decision — takes over the step content area at round boundary */}
          {isRetreatSubPhase && retreatDecision && (
            <RetreatDecisionPanel retreat={retreatDecision} />
          )}

          {/* Damage assignment — takes over when manual damage assignment is active */}
          {isDamageAssignmentSubPhase && damageAssignment && (
            <DamageAssignmentPanel flow={damageAssignment} />
          )}

          {/* Normal combat content (hidden during retreat/damage sub-phases) */}
          {!isRetreatSubPhase && !isDamageAssignmentSubPhase && (
            <>
              {/* Victory banner with celebration */}
              {isVictory && (
                <VictoryBanner
                  victorFaction={victorFaction}
                  getName={getName}
                  getColor={getColor}
                />
              )}

              {/* Next actor preview when idle (before clicking) */}
              {!isAnimating && !isVictory && combatFlow.actorOwner && combatFlow.actorShipType && combatFlow.targetOwner && (
                <div style={{
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: 'var(--spacing-xs) 0',
                  color: 'var(--text-secondary)',
                }}>
                  {'Next: '}
                  <span style={{ color: getColor(combatFlow.actorOwner), fontWeight: 'bold' }}>
                    {getName(combatFlow.actorOwner)}
                  </span>
                  {"'s "}
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {formatShipType(combatFlow.actorShipType)}
                  </span>
                  {' at '}
                  <span style={{ color: getColor(combatFlow.targetOwner), fontWeight: 'bold' }}>
                    {getName(combatFlow.targetOwner)}
                  </span>
                </div>
              )}

              {/* AWAITING_START prompt */}
              {!isAnimating && combatFlow.step === 'AWAITING_START' && (
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                }}>
                  Click to begin the battle
                </div>
              )}

              {/* Dice rolls — visible during animation phases AND on victory (so winning roll stays visible) */}
              {((animPhase === 'dice' || animPhase === 'projectile' || animPhase === 'impact')
                || (animPhase === 'idle' && isVictory)) &&
                combatFlow.recentSteps
                  .filter(s => s.type === 'dice_rolled')
                  .map((s, i) => (
                    <BattleStage
                      key={`dice-${i}`}
                      step={s}
                      stepIndex={i}
                      playerColors={playerColors}
                      playerNames={playerNames}
                    />
                  ))
              }

              {/* Aftermath (ship destroyed, reputation, etc.) — shown during idle only */}
              {animPhase === 'idle' &&
                combatFlow.recentSteps
                  .filter(s => s.type !== 'dice_rolled')
                  .map((s, i) => (
                    <BattleStage
                      key={`aftermath-${i}`}
                      step={s}
                      stepIndex={i}
                      playerColors={playerColors}
                      playerNames={playerNames}
                    />
                  ))
              }
            </>
          )}
        </div>

        {/* Action buttons — hidden during retreat/damage sub-phases (they have their own buttons) */}
        {!isRetreatSubPhase && !isDamageAssignmentSubPhase && (
          <div style={{
            padding: 'var(--spacing-sm) 0',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
            flexShrink: 0,
          }}>
            <Button
              size="lg"
              variant="primary"
              onClick={isAnimating ? undefined : (onVictoryDismiss ?? combatFlow.advance)}
              disabled={isAnimating || (!onVictoryDismiss && !combatFlow.canAdvance)}
              title={!isAnimating && !combatFlow.canAdvance && !onVictoryDismiss ? "Waiting for opponent's turn" : undefined}
              style={{
                minWidth: '160px',
                fontSize: '16px',
              }}
            >
              {isAnimating ? 'Resolving...' : onVictoryDismiss ? 'Continue' : combatFlow.buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Victory Banner ──

const VICTORY_KEYFRAMES = `
@keyframes sparkle-rise {
  0% { opacity: 0; transform: translateY(0) scale(0); }
  15% { opacity: 1; transform: translateY(-5px) scale(1); }
  85% { opacity: 0.8; transform: translateY(-35px) scale(0.8); }
  100% { opacity: 0; transform: translateY(-45px) scale(0); }
}
`;

const SPARKLE_CONFIGS = [
  { left: '10%', delay: 0, duration: 1.8, char: '\u2726' },
  { left: '25%', delay: 0.3, duration: 2.0, char: '\u2605' },
  { left: '40%', delay: 0.6, duration: 1.6, char: '\u2726' },
  { left: '55%', delay: 0.15, duration: 2.2, char: '\u2726' },
  { left: '70%', delay: 0.45, duration: 1.9, char: '\u2605' },
  { left: '85%', delay: 0.75, duration: 1.7, char: '\u2726' },
  { left: '15%', delay: 0.9, duration: 2.1, char: '\u00b7' },
  { left: '50%', delay: 1.1, duration: 1.8, char: '\u00b7' },
  { left: '80%', delay: 0.5, duration: 2.0, char: '\u00b7' },
];

function VictoryBanner({
  victorFaction,
  getName,
  getColor,
}: {
  victorFaction: { ownerId: string } | null;
  getName: (id: string) => string;
  getColor: (id: string) => string;
}) {
  const accentColor = victorFaction ? getColor(victorFaction.ownerId) : '#888';
  const isMutual = !victorFaction;

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
      padding: 'var(--spacing-md) var(--spacing-lg)',
    }}>
      <style>{VICTORY_KEYFRAMES}</style>

      {/* Sparkle particles */}
      {!isMutual && SPARKLE_CONFIGS.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.left,
            bottom: '4px',
            fontSize: i < 6 ? '14px' : '8px',
            color: i % 2 === 0 ? 'rgba(255,215,0,0.9)' : accentColor,
            animation: `sparkle-rise ${s.duration}s ease-out ${s.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 2,
            filter: 'drop-shadow(0 0 2px rgba(255,215,0,0.6))',
          }}
        >
          {s.char}
        </div>
      ))}

      <div style={{
        fontSize: '22px',
        fontWeight: 'bold',
        color: isMutual ? 'var(--text-secondary)' : accentColor,
        marginBottom: '4px',
        textShadow: isMutual ? 'none' : `0 0 12px ${accentColor}40, 0 0 24px ${accentColor}20`,
      }}>
        {isMutual ? 'Mutual Destruction!' : `${getName(victorFaction!.ownerId)} Wins!`}
      </div>
      {isMutual && (
        <div style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          Both fleets destroyed
        </div>
      )}
    </div>
  );
}

// ── Projectile Overlay ──

function ProjectileOverlay({
  direction,
  color,
  weaponType,
}: {
  direction: 'ltr' | 'rtl';
  color: string;
  weaponType: 'missile' | 'cannon';
}) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 10,
    }}>
      {weaponType === 'missile'
        ? <MissileVolley direction={direction} color={color} />
        : <CannonBolts direction={direction} color={color} />
      }
    </div>
  );
}

/** Missiles: pointed body with exhaust plume, slight arc wobble, staggered salvo */
function MissileVolley({ direction, color }: { direction: 'ltr' | 'rtl'; color: string }) {
  const missiles = [
    { delay: 0, y: '30%' },
    { delay: 120, y: '50%' },
    { delay: 240, y: '70%' },
  ];

  const isLtr = direction === 'ltr';
  const animClass = isLtr ? 'bf-missile-ltr' : 'bf-missile-rtl';

  return (
    <>
      {missiles.map((m, i) => (
        <div
          key={i}
          className={animClass}
          style={{
            position: 'absolute',
            top: m.y,
            [isLtr ? 'left' : 'right']: '2%',
            animationDelay: `${m.delay}ms`,
            opacity: 0,
          }}
        >
          {/* Missile body — pointed oval */}
          <div style={{
            position: 'relative',
            width: '20px',
            height: '7px',
          }}>
            {/* Nose cone */}
            <div style={{
              position: 'absolute',
              [isLtr ? 'right' : 'left']: '-5px',
              top: '0',
              width: '0',
              height: '0',
              borderTop: '3.5px solid transparent',
              borderBottom: '3.5px solid transparent',
              [isLtr ? 'borderLeft' : 'borderRight']: `7px solid ${color}`,
            }} />
            {/* Body */}
            <div style={{
              width: '16px',
              height: '7px',
              background: color,
              borderRadius: '2px',
              boxShadow: `0 0 6px ${color}`,
            }} />
            {/* Fins */}
            <div style={{
              position: 'absolute',
              [isLtr ? 'left' : 'right']: '0',
              top: '-3px',
              width: '0',
              height: '0',
              borderLeft: isLtr ? `5px solid rgba(255,255,255,0.3)` : 'none',
              borderRight: isLtr ? 'none' : `5px solid rgba(255,255,255,0.3)`,
              borderBottom: '3px solid transparent',
            }} />
            <div style={{
              position: 'absolute',
              [isLtr ? 'left' : 'right']: '0',
              bottom: '-3px',
              width: '0',
              height: '0',
              borderLeft: isLtr ? `5px solid rgba(255,255,255,0.3)` : 'none',
              borderRight: isLtr ? 'none' : `5px solid rgba(255,255,255,0.3)`,
              borderTop: '3px solid transparent',
            }} />
            {/* Exhaust plume */}
            <div
              className="bf-exhaust"
              style={{
                position: 'absolute',
                [isLtr ? 'left' : 'right']: isLtr ? '-20px' : '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '4px',
                width: '18px',
                background: `linear-gradient(${isLtr ? 'to left' : 'to right'}, ${color}, orange, transparent)`,
                borderRadius: '2px',
                filter: 'blur(1px)',
                animationDelay: `${m.delay}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

/** Cannons: elongated bright bolts with beam trail, fast and straight */
function CannonBolts({ direction, color }: { direction: 'ltr' | 'rtl'; color: string }) {
  const bolts = [
    { delay: 0, y: '33%', length: 28 },
    { delay: 100, y: '50%', length: 24 },
    { delay: 200, y: '67%', length: 20 },
  ];

  const isLtr = direction === 'ltr';
  const animClass = isLtr ? 'bf-cannon-ltr' : 'bf-cannon-rtl';

  return (
    <>
      {bolts.map((b, i) => (
        <div
          key={i}
          className={animClass}
          style={{
            position: 'absolute',
            top: b.y,
            [isLtr ? 'left' : 'right']: '5%',
            animationDelay: `${b.delay}ms`,
            opacity: 0,
          }}
        >
          {/* Bolt core — bright elongated rectangle */}
          <div style={{
            width: `${b.length}px`,
            height: '3px',
            background: `linear-gradient(${isLtr ? 'to right' : 'to left'}, transparent, ${color} 20%, white 50%, ${color} 80%, transparent)`,
            borderRadius: '2px',
            boxShadow: `0 0 4px ${color}, 0 0 8px ${color}, 0 0 12px ${color}`,
          }} />
          {/* Beam trail — fading line behind */}
          <div
            className="bf-beam-trail"
            style={{
              position: 'absolute',
              top: '0',
              [isLtr ? 'left' : 'right']: `${-b.length * 0.6}px`,
              width: `${b.length * 0.6}px`,
              height: '3px',
              background: `linear-gradient(${isLtr ? 'to right' : 'to left'}, transparent, ${color})`,
              borderRadius: '2px',
              filter: 'blur(1px)',
              animationDelay: `${b.delay}ms`,
            }}
          />
        </div>
      ))}
    </>
  );
}

// ── Legacy Replay Mode ──

function ReplayPanel({
  battles,
  battleIndex,
  stepIndex,
  currentStep,
  phaseLabel,
  autoAdvance,
  isComplete,
  totalSteps,
  onNext,
  onPrev,
  onSkipBattle,
  onSkipAll,
  onToggleAuto,
  onDismiss,
  playerColors,
  playerNames,
}: LegacyBattlePanelProps) {
  const battle = battles[battleIndex];
  if (!battle) return null;

  const getName = (id: string) => playerNames[id] ?? id;
  const getColor = (id: string) => playerColors[id] ?? 'var(--text-primary)';

  return (
    <>
      {/* Backdrop */}
      <div
        className="combat-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 900,
        }}
        onClick={onDismiss}
      />

      {/* Panel */}
      <div
        className="fade-in"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-card)',
          border: '2px solid var(--accent-red)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          zIndex: 901,
          width: '460px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--spacing-sm)',
        }}>
          <div>
            <h2 style={{
              color: 'var(--accent-red)',
              margin: 0,
              fontSize: '18px',
            }}>
              BATTLE at ({battle.sector.q},{battle.sector.r})
            </h2>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginTop: '4px',
            }}>
              {battle.participants.map((p, i) => (
                <span key={p}>
                  {i > 0 && ' vs '}
                  <span style={{ color: getColor(p), fontWeight: 'bold' }}>
                    {getName(p)}
                  </span>
                </span>
              ))}
            </div>
          </div>
          {battles.length > 1 && (
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              padding: '2px 8px',
              background: 'var(--bg-tertiary)',
              borderRadius: '4px',
            }}>
              Battle {battleIndex + 1} of {battles.length}
            </div>
          )}
        </div>

        {/* Phase label */}
        <div style={{
          padding: '6px 0',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 'bold',
          color: 'var(--text-secondary)',
          letterSpacing: '0.5px',
        }}>
          {phaseLabel}
        </div>

        {/* Step content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {currentStep ? (
            <BattleStage
              step={currentStep}
              stepIndex={stepIndex}
              playerColors={playerColors}
              playerNames={playerNames}
            />
          ) : (
            <div style={{
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '13px',
            }}>
              No combat steps to display
            </div>
          )}
        </div>

        {/* Controls */}
        <BattleControls
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          autoAdvance={autoAdvance}
          isComplete={isComplete}
          onPrev={onPrev}
          onNext={onNext}
          onSkipBattle={onSkipBattle}
          onSkipAll={onSkipAll}
          onToggleAuto={onToggleAuto}
          onDismiss={onDismiss}
        />
      </div>
    </>
  );
}
