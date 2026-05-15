import { useEffect, useState } from 'react';

interface PhaseTransitionProps {
  phase: string;
}

const PHASE_LABELS: Record<string, string> = {
  action: 'Action Phase',
  combat: 'Combat Phase',
  upkeep: 'Upkeep Phase',
  cleanup: 'Cleanup Phase',
  game_over: 'Game Over',
};

const PHASE_COLORS: Record<string, string> = {
  action: 'var(--accent-blue)',
  combat: 'var(--accent-red)',
  upkeep: 'var(--accent-green)',
  cleanup: 'var(--accent-yellow)',
  game_over: 'var(--accent-yellow)',
};

export function PhaseTransition({ phase }: PhaseTransitionProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  if (!visible) return null;

  return (
    <div
      className="phase-banner-enter"
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: 'var(--spacing-md) var(--spacing-xl)',
        background: 'var(--bg-card)',
        border: `2px solid ${PHASE_COLORS[phase] ?? 'var(--border-color)'}`,
        borderRadius: 'var(--border-radius)',
        zIndex: 600,
        textAlign: 'center',
      }}
    >
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: PHASE_COLORS[phase] ?? 'var(--text-primary)',
      }}>
        {PHASE_LABELS[phase] ?? phase}
      </div>
    </div>
  );
}
