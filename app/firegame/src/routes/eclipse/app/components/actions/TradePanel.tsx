import { useState } from 'react';
import { Button } from '../shared/Button';
import type { TradeFlowResult, TradeResource } from '../../hooks/useTradeFlow';

interface TradePanelProps {
  selectedFromResource: TradeResource | null;
  selectedToResource: TradeResource | null;
  amount: number;
  maxAmount: number;
  tradeRate: number;
  gained: number;
  availableFromResources: TradeFlowResult['availableFromResources'];
  availableToResources: TradeResource[];
  onSelectFromResource: (resource: TradeResource) => void;
  onSelectToResource: (resource: TradeResource) => void;
  onSetAmount: (amount: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const RESOURCE_COLORS: Record<string, string> = {
  materials: 'var(--resource-materials)',
  science: 'var(--resource-science)',
  money: 'var(--resource-money)',
};

const RESOURCE_LABELS: Record<string, string> = {
  materials: 'Materials',
  science: 'Science',
  money: 'Money',
};

export function TradePanel({
  selectedFromResource,
  selectedToResource,
  amount,
  maxAmount,
  tradeRate,
  gained,
  availableFromResources,
  availableToResources,
  onSelectFromResource,
  onSelectToResource,
  onSetAmount,
  onConfirm,
  onCancel,
}: TradePanelProps) {
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
          Trade
        </span>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>

      {/* Trade rate info */}
      <div style={{
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        color: 'var(--text-secondary)',
        fontSize: '11px',
      }}>
        Trade rate: {tradeRate} of any resource = 1 of another
      </div>

      {/* Step 1: Select FROM resource */}
      {!selectedFromResource && (
        <>
          <div style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--accent-yellow)',
            fontSize: '13px',
          }}>
            Select resource to trade away
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--spacing-md)' }}>
            {availableFromResources.map(({ resource, available }) => (
              <ResourceButton
                key={resource}
                resource={resource}
                available={available}
                onSelect={() => onSelectFromResource(resource)}
              />
            ))}
            {availableFromResources.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', padding: '4px 0' }}>
                No resources available to trade
              </div>
            )}
          </div>
        </>
      )}

      {/* Step 2: Select TO resource */}
      {selectedFromResource && !selectedToResource && (
        <>
          {/* From resource indicator */}
          <div style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-sm)',
            border: `1px solid ${RESOURCE_COLORS[selectedFromResource]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: RESOURCE_COLORS[selectedFromResource], fontWeight: 'bold' }}>
              Trading: {RESOURCE_LABELS[selectedFromResource]}
            </span>
            <button
              onClick={() => onSelectFromResource(null as any)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '10px',
                textDecoration: 'underline',
              }}
            >
              change
            </button>
          </div>

          <div style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--accent-yellow)',
            fontSize: '13px',
          }}>
            Select resource to receive
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--spacing-md)' }}>
            {availableToResources.map((resource) => (
              <ResourceButton
                key={resource}
                resource={resource}
                onSelect={() => onSelectToResource(resource)}
              />
            ))}
          </div>
        </>
      )}

      {/* Step 3: Amount selector */}
      {selectedFromResource && selectedToResource && (
        <>
          {/* Trade direction indicator */}
          <div style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
          }}>
            <span style={{ color: RESOURCE_COLORS[selectedFromResource], fontWeight: 'bold' }}>
              {RESOURCE_LABELS[selectedFromResource]}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
            <span style={{ color: RESOURCE_COLORS[selectedToResource], fontWeight: 'bold' }}>
              {RESOURCE_LABELS[selectedToResource]}
            </span>
            <button
              onClick={() => onSelectFromResource(null as any)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '10px',
                textDecoration: 'underline',
                marginLeft: '4px',
              }}
            >
              change
            </button>
          </div>

          {/* Amount controls */}
          <div style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-md)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-sm)',
            }}>
              <button
                onClick={() => onSetAmount(amount - 1)}
                disabled={amount <= 1}
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: amount <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: amount <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                -
              </button>
              <span style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: RESOURCE_COLORS[selectedFromResource],
                minWidth: '40px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
              }}>
                {amount}
              </span>
              <button
                onClick={() => onSetAmount(amount + 1)}
                disabled={amount >= maxAmount}
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: amount >= maxAmount ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: amount >= maxAmount ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>

            {/* Quick amount buttons */}
            <div style={{
              display: 'flex',
              gap: '4px',
              justifyContent: 'center',
            }}>
              {[tradeRate, tradeRate * 2, tradeRate * 3, maxAmount].filter((v, i, a) => v <= maxAmount && v >= 1 && a.indexOf(v) === i).map(val => (
                <button
                  key={val}
                  onClick={() => onSetAmount(val)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '10px',
                    background: amount === val ? 'var(--bg-hover)' : 'var(--bg-primary)',
                    border: `1px solid ${amount === val ? RESOURCE_COLORS[selectedFromResource] : 'var(--border-color)'}`,
                    borderRadius: '3px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {val === maxAmount ? 'All' : val}
                </button>
              ))}
            </div>
          </div>

          {/* Trade preview */}
          <div style={{
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
            fontSize: '13px',
          }}>
            <span style={{ color: RESOURCE_COLORS[selectedFromResource], fontWeight: 'bold' }}>
              -{amount} {RESOURCE_LABELS[selectedFromResource]}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
            <span style={{ color: RESOURCE_COLORS[selectedToResource], fontWeight: 'bold' }}>
              +{gained} {RESOURCE_LABELS[selectedToResource]}
            </span>
          </div>

          {gained === 0 && (
            <div style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              color: 'var(--accent-red)',
              fontSize: '11px',
              marginBottom: 'var(--spacing-sm)',
            }}>
              Need at least {tradeRate} to gain 1 {RESOURCE_LABELS[selectedToResource]?.toLowerCase()}
            </div>
          )}

          {/* Confirm / Cancel */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-sm)',
          }}>
            <Button
              variant="primary"
              size="sm"
              disabled={gained === 0}
              onClick={onConfirm}
              style={{ flex: 1 }}
            >
              Trade
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ResourceButton({ resource, available, onSelect }: { resource: string; available?: number; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const color = RESOURCE_COLORS[resource] ?? 'var(--text-secondary)';

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        background: hovered ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
        border: `1px solid ${hovered ? color : 'var(--border-color)'}`,
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-primary)',
      }}
    >
      <span style={{ fontWeight: 'bold', color }}>{RESOURCE_LABELS[resource] ?? resource}</span>
      {available != null && (
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {available} available
        </span>
      )}
    </button>
  );
}
