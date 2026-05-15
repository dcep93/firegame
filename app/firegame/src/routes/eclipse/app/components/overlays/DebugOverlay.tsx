import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '../../hooks/useGameState';

/**
 * Dev-only debug overlay toggled with backtick key.
 * Shows live phase, subPhase, combat state, legal actions, and recent events.
 */
export function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const isDev = process.env.NODE_ENV !== 'production';

  const toggle = useCallback(() => setVisible(v => !v), []);

  useEffect(() => {
    if (!isDev) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, isDev]);

  if (!isDev || !visible) return null;

  return <DebugPanel />;
}

function DebugPanel() {
  const { filteredState, legalActions, playerId, error } = useGameState();

  if (!filteredState) return null;

  const fs = filteredState;
  const currentPlayerId = fs.turnOrder[fs.currentPlayerIndex] ?? '?';
  const isYou = currentPlayerId === playerId;

  // Summarize legal actions — only non-empty categories
  const laSummary: string[] = [];
  if (legalActions) {
    if (legalActions.explore.length > 0) laSummary.push(`explore: ${legalActions.explore.length}`);
    if (legalActions.research.length > 0) laSummary.push(`research: ${legalActions.research.length}`);
    if (legalActions.upgrade.length > 0) laSummary.push(`upgrade: ${legalActions.upgrade.length}`);
    if (legalActions.build.length > 0) laSummary.push(`build: ${legalActions.build.length}`);
    if (legalActions.move.length > 0) laSummary.push(`move: ${legalActions.move.length}`);
    if (legalActions.influence.length > 0) laSummary.push(`influence: ${legalActions.influence.length}`);
    if (legalActions.canPass) laSummary.push('canPass: true');
    if (legalActions.canAdvanceCombat) laSummary.push('canAdvanceCombat: true');
    if (legalActions.discoveryDecision.length > 0) laSummary.push(`discoveryDecision: ${legalActions.discoveryDecision.length}`);
    if (legalActions.influenceSectorChoice.length > 0) laSummary.push(`influenceSectorChoice: ${legalActions.influenceSectorChoice.length}`);
    if (legalActions.bankruptcyResolution.length > 0) laSummary.push(`bankruptcyResolution: ${legalActions.bankruptcyResolution.length}`);
    if (legalActions.diplomacyResponse.length > 0) laSummary.push(`diplomacyResponse: ${legalActions.diplomacyResponse.length}`);
    if (legalActions.freeActions.trade.length > 0) laSummary.push(`trade: ${legalActions.freeActions.trade.length}`);
    if (legalActions.freeActions.colonyShip.length > 0) laSummary.push(`colonyShip: ${legalActions.freeActions.colonyShip.length}`);
    if (legalActions.freeActions.diplomacy.length > 0) laSummary.push(`diplomacy: ${legalActions.freeActions.diplomacy.length}`);
    if (legalActions.moveContinuation) laSummary.push('moveContinuation: true');
    const rxUp = legalActions.reactions.upgrade.length;
    const rxBuild = legalActions.reactions.build.length;
    const rxMove = legalActions.reactions.move.length;
    if (rxUp > 0 || rxBuild > 0 || rxMove > 0) {
      laSummary.push(`reactions: U${rxUp}/B${rxBuild}/M${rxMove}`);
    }
  }

  // Format subPhase
  let subPhaseStr = 'null';
  if (fs.subPhase) {
    const sp: Record<string, unknown> = fs.subPhase as unknown as Record<string, unknown>;
    const parts: string[] = [String(sp.type)];
    if ('playerId' in sp) parts.push(`player=${sp.playerId}`);
    if ('sectorKey' in sp) parts.push(`sector=${sp.sectorKey}`);
    if ('tileId' in sp) parts.push(`tile=${sp.tileId}`);
    subPhaseStr = parts.join(' ');
  }

  // Format combat
  let combatStr = 'null';
  if (fs.combatState) {
    const cs = fs.combatState;
    combatStr = `step=${cs.step} battle=${cs.currentBattleIndex} actor=${cs.currentActorOwner ?? 'none'} target=${cs.currentTargetOwner ?? 'none'}`;
  }

  // Recent events (last 5)
  const recentEvents = fs.recentEvents.slice(-5).map(e => e.type).join(', ');

  return (
    <div style={{
      position: 'fixed',
      top: 8,
      right: 8,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.85)',
      color: '#afc',
      fontFamily: 'monospace',
      fontSize: '11px',
      lineHeight: '1.4',
      padding: '8px 10px',
      borderRadius: 6,
      maxWidth: 420,
      pointerEvents: 'auto',
      border: '1px solid rgba(100, 255, 150, 0.2)',
      userSelect: 'text',
    }}>
      <div style={{ color: '#6f6', fontWeight: 'bold', marginBottom: 4 }}>DEBUG</div>
      <Row label="Phase" value={`${fs.phase} | Round ${fs.round} | Turn #${fs.turnNumber}`} />
      <Row label="SubPhase" value={subPhaseStr} />
      <Row label="Combat" value={combatStr} />
      <Row label="Current" value={`idx=${fs.currentPlayerIndex} ${currentPlayerId.slice(0, 12)}${isYou ? ' (YOU)' : ''}`} />
      <Row label="Pass" value={fs.passOrder.length > 0 ? fs.passOrder.map(p => p.slice(0, 8)).join(', ') : '(none)'} />
      <div style={{ borderTop: '1px solid rgba(100, 255, 150, 0.15)', margin: '4px 0' }} />
      <div style={{ color: '#8cf', fontWeight: 'bold', marginBottom: 2 }}>Legal Actions</div>
      {laSummary.length === 0 ? (
        <div style={{ color: '#666' }}>(none)</div>
      ) : (
        laSummary.map((s, i) => <div key={i} style={{ paddingLeft: 8 }}>{s}</div>)
      )}
      {error && (
        <>
          <div style={{ borderTop: '1px solid rgba(255, 100, 100, 0.3)', margin: '4px 0' }} />
          <Row label="Error" value={error} color="#f66" />
        </>
      )}
      {recentEvents && (
        <>
          <div style={{ borderTop: '1px solid rgba(100, 255, 150, 0.15)', margin: '4px 0' }} />
          <div style={{ color: '#888', fontSize: '10px' }}>Recent: {recentEvents}</div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <span style={{ color: '#888', minWidth: 70 }}>{label}:</span>
      <span style={{ color: color ?? '#ccc', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}
