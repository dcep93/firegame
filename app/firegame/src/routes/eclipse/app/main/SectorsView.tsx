import { store } from "../utils/utils";

export default function SectorsView() {
  const game = store.gameW.game;
  return (
    <div>
      {game.sectors.map((sector) => (
        <div key={sector.tile}>{JSON.stringify(sector)}</div>
      ))}
    </div>
  );
}
