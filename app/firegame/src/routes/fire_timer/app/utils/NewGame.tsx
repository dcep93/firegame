export type GameType = {
  players: PlayerType[];
};

export type PlayerType = {
  name: string;
  turn_finished: number;
};

function NewGame(): PromiseLike<GameType> {
  return Promise.resolve({
    players: [],
  });
}

export default NewGame;
