import type { ScoreBreakdown } from '@eclipse/shared';
import { Modal } from '../shared/Modal';

interface ScoringOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  scores: readonly ScoreBreakdown[];
  winner: string;
}

export function ScoringOverlay({ isOpen, onClose, scores, winner }: ScoringOverlayProps) {
  const sorted = [...scores].sort((a, b) => b.total - a.total);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Over">
      <div style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
        <span style={{ fontSize: '20px', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
          Winner: {winner}
        </span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <th style={thStyle}>Player</th>
            <th style={thStyle}>Rep</th>
            <th style={thStyle}>Amb</th>
            <th style={thStyle}>Sectors</th>
            <th style={thStyle}>Mono</th>
            <th style={thStyle}>Warp</th>
            <th style={thStyle}>Disc</th>
            <th style={thStyle}>Tech</th>
            <th style={thStyle}>Species</th>
            <th style={thStyle}>Traitor</th>
            <th style={{ ...thStyle, color: 'var(--accent-yellow)' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((score) => (
            <tr key={score.playerId} style={{
              borderBottom: '1px solid var(--bg-tertiary)',
              background: score.playerId === winner ? 'rgba(255, 204, 74, 0.1)' : undefined,
            }}>
              <td style={tdStyle}>{score.speciesId}</td>
              <td style={tdStyle}>{score.reputationTiles}</td>
              <td style={tdStyle}>{score.ambassadorTiles}</td>
              <td style={tdStyle}>{score.controlledSectors}</td>
              <td style={tdStyle}>{score.monoliths}</td>
              <td style={tdStyle}>{score.warpPortals}</td>
              <td style={tdStyle}>{score.discoveryTiles}</td>
              <td style={tdStyle}>{score.techTrackProgress}</td>
              <td style={tdStyle}>{score.speciesBonus}</td>
              <td style={tdStyle}>{score.traitorPenalty}</td>
              <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--accent-yellow)' }}>{score.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}

const thStyle: React.CSSProperties = {
  padding: '6px 8px',
  textAlign: 'center',
  color: 'var(--text-secondary)',
  fontWeight: 'normal',
  fontSize: '11px',
  textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '6px 8px',
  textAlign: 'center',
  color: 'var(--text-primary)',
};
