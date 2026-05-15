import { useGame } from '../context/GameContext';

/**
 * Convenience hook for accessing game state in components.
 */
export function useGameState() {
  const { state, isMyTurn, isHost } = useGame();

  return {
    filteredState: state.filteredState,
    legalActions: state.legalActions,
    playerId: state.playerId,
    players: state.players,
    roomCode: state.roomCode,
    roomName: state.roomName,
    roomStatus: state.roomStatus,
    config: state.config,
    error: state.error,
    chatMessages: state.chatMessages,
    roomList: state.roomList,
    explorePeekResult: state.explorePeekResult,
    sessionsPrunedAt: state.sessionsPrunedAt,
    scores: state.scores,
    winner: state.winner,
    rewindMessage: state.rewindMessage,
    lobbyExpiresAt: state.lobbyExpiresAt,
    gameInactivityDeadline: state.gameInactivityDeadline,
    urlTokens: state.urlTokens,
    isMyTurn,
    isHost,
  };
}
