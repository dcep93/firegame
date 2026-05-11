export type GameType = {
  players: PlayerType[];
  current_player_name: string;
  current_player_start_timestamp: number;
};

export type PlayerType = {
  name: string;
  time_used_previously_ms: number;
};

function NewGame(): PromiseLike<GameType> {
  return Promise.resolve({
    players: [],
    current_player_name: "",
    current_player_start_timestamp: 0,
  });
}

export default NewGame;
