import { useState, useEffect, useMemo } from 'react';

interface DiceRollerProps {
  dice: readonly { color: string; face: number; isHit: boolean }[];
  rolling?: boolean;
  staggerReveal?: boolean;
}

const STAR_COUNTS: Record<string, number> = {
  yellow: 1,
  orange: 2,
  blue: 3,
  red: 4,
};

/** face=0 is either miss or burst — distinguish by isHit */
function isBurstRoll(die: { face: number; isHit: boolean }) {
  return die.face === 0 && die.isHit;
}

function isMissRoll(die: { face: number; isHit: boolean }) {
  return die.face === 0 && !die.isHit;
}

function renderDieFace(die: { color: string; face: number; isHit: boolean }) {
  if (isMissRoll(die)) return '';
  if (isBurstRoll(die)) return '\u2605'.repeat(STAR_COUNTS[die.color] ?? 1);
  return die.face;
}

const DICE_COLORS: Record<string, string> = {
  yellow: 'var(--accent-yellow)',
  orange: 'var(--accent-orange)',
  blue: 'var(--accent-blue)',
  red: 'var(--accent-red)',
};

export function DiceRoller({ dice, rolling = false, staggerReveal = false }: DiceRollerProps) {
  // Stable fingerprint so we only re-trigger stagger when dice content changes
  const fingerprint = useMemo(
    () => dice.map(d => `${d.color}:${d.face}:${d.isHit ? 1 : 0}`).join(','),
    [dice],
  );

  const [revealedCount, setRevealedCount] = useState(staggerReveal ? 0 : dice.length);

  useEffect(() => {
    if (!staggerReveal) {
      setRevealedCount(dice.length);
      return;
    }

    setRevealedCount(0);
    if (dice.length === 0) return;

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= dice.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fingerprint, staggerReveal]);

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
      {dice.map((die, i) => (
        <div
          key={i}
          className={rolling ? 'dice-rolling' : i < revealedCount && staggerReveal ? 'dice-appear' : ''}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            background: DICE_COLORS[die.color] ?? 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: isBurstRoll(die) ? '12px' : '18px',
            color: isMissRoll(die) ? 'rgba(0,0,0,0.3)' : '#000',
            border: die.isHit ? '2px solid var(--accent-green)' : isMissRoll(die) ? '2px solid rgba(255,0,0,0.4)' : '2px solid transparent',
            boxShadow: die.isHit ? '0 0 8px var(--accent-green)' : 'none',
            opacity: staggerReveal && i >= revealedCount ? 0 : 1,
            transition: 'opacity 0.15s ease-out',
          }}
        >
          {renderDieFace(die)}
        </div>
      ))}
    </div>
  );
}
