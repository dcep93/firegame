import { Track } from "../utils/gameTypes";
import { Upgrade } from "../utils/library";
import { store } from "../utils/utils";

export default function PlayersView(props: {
  upgrade: Upgrade | null;
  updateTrack: (track: Track) => void;
}) {
  const game = store.gameW.game;
  return (
    <div>
      {game.players.map((p) => (
        <div key={p.userId}>{JSON.stringify(p.d)}</div>
      ))}
    </div>
  );
}
