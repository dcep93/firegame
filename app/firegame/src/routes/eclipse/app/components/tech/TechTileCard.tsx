import { useState } from 'react';
import { TECHS_BY_ID } from '@eclipse/shared';

export interface TechTileCardProps {
  techId: string;
  count?: number;
  computedCost?: number;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  compact?: boolean;
}

export function TechTileCard({
  techId,
  count,
  computedCost,
  onClick,
  disabled,
  selected,
}: TechTileCardProps) {
  const [hovered, setHovered] = useState(false);
  const def = TECHS_BY_ID[techId];
  if (!def) return null;

  const depleted = count !== undefined && count <= 0;

  const classes = [
    'tech-tile-card',
    onClick && !disabled && 'tech-tile-card--clickable',
    selected && 'tech-tile-card--selected',
    disabled && 'tech-tile-card--disabled',
    depleted && 'tech-tile-card--depleted',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className="tech-tile-card__img"
        src={`/tech-icons/${techId}.svg`}
        alt={def.name}
        draggable={false}
      />

      {count !== undefined && (
        <span className={`tech-tile-card__count${depleted ? ' tech-tile-card__count--depleted' : ''}`}>
          x{count}
        </span>
      )}

      {hovered && (
        <div className="tech-tile-card__tooltip">
          <div className="tech-tile-card__tooltip-name">{def.name}</div>
          {computedCost !== undefined && (
            <div className="tech-tile-card__tooltip-cost">
              Cost: <span style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>{computedCost}</span>
              {computedCost < def.maxCost && (
                <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '4px' }}>{def.maxCost}</span>
              )}
            </div>
          )}
          {def.description && (
            <div className="tech-tile-card__tooltip-desc">{def.description}</div>
          )}
        </div>
      )}
    </div>
  );
}
