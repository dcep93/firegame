import { useState } from 'react';
import { TECHS_BY_ID } from '@eclipse/shared';
import { useGameState } from '../../hooks/useGameState';
import { TechSupplyBoard } from './TechSupplyBoard';

const CATEGORIES = [
  { key: 'military' as const, label: 'Military', color: 'var(--tech-military)' },
  { key: 'grid' as const, label: 'Grid', color: 'var(--tech-grid)' },
  { key: 'nano' as const, label: 'Nano', color: 'var(--tech-nano)' },
  { key: 'rare' as const, label: 'Rare', color: 'var(--tech-rare)' },
];

function TechTrayRow({ techId, count }: { techId: string; count: number }) {
  const [expanded, setExpanded] = useState(false);
  const def = TECHS_BY_ID[techId];
  if (!def) return null;

  const depleted = count <= 0;

  return (
    <div
      className={`tech-tray-row${depleted ? ' tech-tray-row--depleted' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="tech-tray-row__main">
        <span className="tech-tray-row__name">{def.name}</span>
        <div className="tech-tray-row__right">
          <span className="tech-tray-row__cost">
            <span className="tech-tray-row__cost-max">{def.maxCost}</span>
            {def.minCost !== def.maxCost && (
              <span className="tech-tray-row__cost-min">({def.minCost})</span>
            )}
          </span>
          <span className={`tech-tray-row__count${depleted ? ' tech-tray-row__count--depleted' : ''}`}>
            x{count}
          </span>
        </div>
      </div>
      {expanded && def.description && (
        <div className="tech-tray-row__desc">{def.description}</div>
      )}
    </div>
  );
}

export function TechTray() {
  const { filteredState } = useGameState();
  const [collapsed, setCollapsed] = useState(false);
  const [showBoard, setShowBoard] = useState(false);

  if (!filteredState) return null;

  const { techTray } = filteredState;

  return (
    <div>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: collapsed ? 0 : 'var(--spacing-sm)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        <span>Tech Tray</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!collapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBoard(true);
              }}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                color: 'var(--text-muted)',
                fontSize: '9px',
                padding: '2px 6px',
                cursor: 'pointer',
                textTransform: 'none',
                letterSpacing: '0',
              }}
            >
              View Board
            </button>
          )}
          <span style={{ fontSize: '10px' }}>{collapsed ? '+' : '-'}</span>
        </div>
      </div>

      {!collapsed && CATEGORIES.map(cat => {
        const slots = techTray[cat.key];
        if (slots.length === 0) return null;

        const sorted = [...slots].sort((a, b) => {
          const da = TECHS_BY_ID[a.techId], db = TECHS_BY_ID[b.techId];
          if (!da || !db) return 0;
          return (da.minCost - db.minCost) || (da.maxCost - db.maxCost);
        });

        return (
          <div key={cat.key} style={{ marginBottom: 'var(--spacing-sm)' }}>
            <div className="tech-tray-cat-label" style={{ color: cat.color, borderColor: cat.color }}>
              {cat.label}
            </div>
            <div className="tech-tray-list">
              {sorted.map(slot => (
                <TechTrayRow key={slot.techId} techId={slot.techId} count={slot.count} />
              ))}
            </div>
          </div>
        );
      })}

      {showBoard && (
        <TechSupplyBoard
          techTray={techTray}
          onClose={() => setShowBoard(false)}
        />
      )}
    </div>
  );
}
