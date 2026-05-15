interface RotateButtonProps {
  rotation: number;
  validRotations: Set<number>;
  onSetRotation: (rot: number) => void;
}

/** Get sorted array of valid rotations by index (0-5). */
function sortedValid(validRotations: Set<number>): number[] {
  return Array.from(validRotations).sort((a, b) => a - b);
}

/**
 * Step to the next valid rotation in engine index order (+1).
 * Engine indices go counter-clockwise, so +1 = visually CCW.
 */
function nextUp(current: number, validRotations: Set<number>): number {
  const sorted = sortedValid(validRotations);
  if (sorted.length === 0) return current;
  const idx = sorted.indexOf(current);
  if (idx === -1) return sorted[0]!;
  return sorted[(idx + 1) % sorted.length]!;
}

/**
 * Step to the previous valid rotation in engine index order (-1).
 * Engine indices go counter-clockwise, so -1 = visually CW.
 */
function nextDown(current: number, validRotations: Set<number>): number {
  const sorted = sortedValid(validRotations);
  if (sorted.length === 0) return current;
  const idx = sorted.indexOf(current);
  if (idx === -1) return sorted[0]!;
  return sorted[(idx - 1 + sorted.length) % sorted.length]!;
}

const ARROW_STYLE_BASE = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  fontSize: '28px',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
} as const;

/**
 * Rotation control with counter-clockwise / clockwise arrows and a position indicator.
 * Engine rotation indices increase CCW, so:
 *   ↻ (visual CW)  = decrement engine index
 *   ↺ (visual CCW) = increment engine index
 */
export function RotateButton({ rotation, validRotations, onSetRotation }: RotateButtonProps) {
  const sorted = sortedValid(validRotations);
  const currentIndex = sorted.indexOf(rotation);
  const total = sorted.length;
  const onlyOne = total <= 1;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '4px 0',
    }}>
      {/* CCW arrow — engine +1 */}
      <button
        disabled={onlyOne}
        onClick={() => onSetRotation(nextUp(rotation, validRotations))}
        style={{
          ...ARROW_STYLE_BASE,
          border: '1px solid var(--border-color)',
          background: onlyOne ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
          color: onlyOne ? 'var(--text-muted)' : 'var(--text-primary)',
          cursor: onlyOne ? 'not-allowed' : 'pointer',
          opacity: onlyOne ? 0.4 : 1,
        }}
        title="Rotate counter-clockwise"
      >
        {'\u21BA'}
      </button>

      {/* Position label */}
      <span style={{
        flex: 1,
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
      }}>
        {total > 0 ? `${currentIndex + 1} / ${total}` : 'none'}
      </span>

      {/* CW arrow — engine -1 */}
      <button
        disabled={onlyOne}
        onClick={() => onSetRotation(nextDown(rotation, validRotations))}
        style={{
          ...ARROW_STYLE_BASE,
          border: '1px solid var(--border-color)',
          background: onlyOne ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
          color: onlyOne ? 'var(--text-muted)' : 'var(--text-primary)',
          cursor: onlyOne ? 'not-allowed' : 'pointer',
          opacity: onlyOne ? 0.4 : 1,
        }}
        title="Rotate clockwise"
      >
        {'\u21BB'}
      </button>
    </div>
  );
}
