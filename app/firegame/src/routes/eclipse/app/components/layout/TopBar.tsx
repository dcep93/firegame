import { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useConnection } from '../../context/ConnectionContext';
import { useGame } from '../../context/GameContext';

export function TopBar() {
  const { filteredState, roomCode, roomStatus, config, isHost, isMyTurn, rewindMessage, gameInactivityDeadline, players, urlTokens } = useGameState();
  const { status } = useConnection();
  const { requestRewind, clearRewindMessage } = useGame();
  const [rewindOpen, setRewindOpen] = useState(false);
  const [showTurnNotification, setShowTurnNotification] = useState(false);
  const prevIsMyTurn = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const connectionColor = {
    connected: 'var(--accent-green)',
    connecting: 'var(--accent-yellow)',
    reconnecting: 'var(--accent-orange)',
    disconnected: 'var(--accent-red)',
  }[status];

  // Close dropdown on outside click
  useEffect(() => {
    if (!rewindOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRewindOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [rewindOpen]);

  // Auto-clear rewind message after 3 seconds
  useEffect(() => {
    if (rewindMessage) {
      const timer = setTimeout(() => clearRewindMessage(), 3000);
      return () => clearTimeout(timer);
    }
  }, [rewindMessage, clearRewindMessage]);

  // Turn notification — show while it's the player's turn
  useEffect(() => {
    const wasMyTurn = prevIsMyTurn.current;
    prevIsMyTurn.current = isMyTurn;
    if (isMyTurn && !wasMyTurn) {
      setShowTurnNotification(true);
    } else if (!isMyTurn && wasMyTurn) {
      setShowTurnNotification(false);
    }
  }, [isMyTurn]);

  // Game inactivity countdown (host only)
  const [idleRemaining, setIdleRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!isHost || roomStatus !== 'IN_GAME' || gameInactivityDeadline == null) {
      setIdleRemaining(null);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, gameInactivityDeadline - Date.now());
      setIdleRemaining(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isHost, roomStatus, gameInactivityDeadline]);

  const formatIdleTime = (ms: number): string => {
    const totalSecs = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const showRewind = roomStatus === 'IN_GAME'
    && config?.rewindMode !== 'DISABLED'
    && isHost
    && filteredState
    && filteredState.turnNumber > 1;

  const maxSteps = filteredState ? Math.min(filteredState.turnNumber - 1, 10) : 0;

  // Active player info — sub-phase player takes priority
  const subPhase = filteredState?.subPhase;
  const subPhasePlayerId = subPhase && 'playerId' in subPhase ? (subPhase as { playerId: string }).playerId : null;
  const actionPlayerId = filteredState && filteredState.currentPlayerIndex >= 0 && filteredState.currentPlayerIndex < filteredState.turnOrder.length
    ? filteredState.turnOrder[filteredState.currentPlayerIndex]
    : null;
  const activePlayerId = subPhasePlayerId ?? actionPlayerId;

  const getPlayerColor = (pid: string) =>
    pid === filteredState!.you.id ? filteredState!.you.color : filteredState!.opponents[pid]?.color;

  const activeColor = activePlayerId ? getPlayerColor(activePlayerId) : undefined;
  const activeNickname = activePlayerId
    ? players.find(p => p.playerId === activePlayerId)?.nickname
    : undefined;

  return (
    <>
      <header
        className="game-topbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--spacing-md)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          height: 'var(--topbar-height)',
          position: 'relative',
          zIndex: 1010,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>ECLIPSE</span>
          {roomCode && (
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              Room: {roomCode}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          {filteredState && roomStatus === 'IN_GAME' && (
            <>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Round {filteredState.round}/8
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Phase: {filteredState.phase}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Turn #{filteredState.turnNumber}
              </span>
              {activeColor && activeNickname && (() => {
                const activePlayer = players.find(p => p.playerId === activePlayerId);
                const isActiveDisconnected = activePlayer && !activePlayer.connected;
                return (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isActiveDisconnected ? 'var(--accent-red)' : `var(--player-${activeColor})`,
                      display: 'inline-block',
                    }} />
                    <span style={{ color: isActiveDisconnected ? 'var(--text-muted)' : `var(--player-${activeColor})`, fontWeight: 600 }}>
                      {activeNickname}
                    </span>
                    {isActiveDisconnected && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: 'var(--accent-red)',
                        background: 'rgba(255, 80, 80, 0.12)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        lineHeight: '14px',
                      }}>OFFLINE</span>
                    )}
                    {isActiveDisconnected && activePlayerId && urlTokens?.[activePlayerId] && roomCode && (
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/${roomCode}/${urlTokens[activePlayerId]}`;
                          navigator.clipboard.writeText(url);
                        }}
                        title="Copy rejoin link for this player"
                        style={{
                          background: 'rgba(100, 180, 255, 0.12)',
                          border: 'none',
                          borderRadius: '3px',
                          color: 'var(--accent-blue)',
                          cursor: 'pointer',
                          padding: '1px 5px',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          lineHeight: '14px',
                        }}
                      >
                        COPY LINK
                      </button>
                    )}
                  </span>
                );
              })()}
            </>
          )}

          {idleRemaining != null && (
            <span style={{
              fontSize: '12px',
              color: idleRemaining < 5 * 60 * 1000 ? 'var(--accent-red)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              Idle: {formatIdleTime(idleRemaining)}
            </span>
          )}

          {showRewind && (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setRewindOpen(o => !o)}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  background: rewindOpen ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {'\u23EA'} Rewind {rewindOpen ? '\u25B4' : '\u25BE'}
              </button>
              {rewindOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '4px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '4px 0',
                  minWidth: '160px',
                  zIndex: 1020,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}>
                  {Array.from({ length: maxSteps }, (_, i) => i + 1).map(steps => (
                    <button
                      key={steps}
                      onClick={() => {
                        if (!filteredState) return;
                        requestRewind(filteredState.turnNumber - steps);
                        setRewindOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {steps} step{steps > 1 ? 's' : ''} back (Turn {(filteredState?.turnNumber ?? 0) - steps})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: connectionColor,
              display: 'inline-block',
            }}
            title={`Connection: ${status}`}
          />
        </div>
      </header>

      {(status === 'reconnecting' || status === 'disconnected') && (
        <div style={{
          padding: '4px var(--spacing-md)',
          background: status === 'reconnecting' ? 'var(--accent-orange)' : 'var(--accent-red)',
          color: '#000',
          fontSize: '12px',
          fontWeight: 600,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1010,
        }}>
          {status === 'reconnecting' ? 'Reconnecting\u2026' : 'Disconnected'}
        </div>
      )}

      {rewindMessage && (
        <div style={{
          padding: '6px var(--spacing-md)',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '13px',
          color: 'var(--accent-blue)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1010,
        }}>
          {rewindMessage}
        </div>
      )}

      {showTurnNotification && (
        <div
          className="turn-notification"
          style={{
            position: 'absolute',
            top: 'var(--topbar-height)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 16px',
            background: filteredState?.you.color ? `var(--player-${filteredState.you.color})` : 'var(--accent-green)',
            color: '#000',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '0 0 8px 8px',
            zIndex: 1010,
            pointerEvents: 'none',
          }}
        >
          Your Turn
        </div>
      )}
    </>
  );
}
