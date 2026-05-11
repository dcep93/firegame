export type GameType = {
  players: PlayerType[];
  current_player_name: string;
  current_player_start_timestamp: number;
};

export type PlayerType = {
  name: string;
  time_used_previously_ms: number;
  turns: TurnType[];
};

export type TurnType = {
  start_timestamp: number;
  end_timestamp: number;
  duration_ms: number;
  counts_towards_total: boolean;
};

function NewGame(): PromiseLike<GameType> {
  return Promise.resolve({
    players: [],
    current_player_name: "",
    current_player_start_timestamp: 0,
  });
}

export default NewGame;
