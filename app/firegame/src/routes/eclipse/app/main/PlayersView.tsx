import { Track } from "../utils/gameTypes";
import { Faction, Factions, Upgrade } from "../utils/library";
import utils, { store } from "../utils/utils";

export default function PlayersView(props: {
  upgrade: Upgrade | null;
  updateTrack: (track: Track) => void;
}) {
  const game = store.gameW.game;
  return (
    <div style={{ display: "flex" }}>
      {game.players.map((p) => (
        <div key={p.userId}>
          {p.d === undefined ? <SelectFaction /> : JSON.stringify(p.d)}
        </div>
      ))}
    </div>
  );
}

function SelectFaction() {
  const game = store.gameW.game;
  return (
    <div>
      {Object.entries(Factions)
        .map(([faction, obj]) => ({
          faction: faction as Faction,
          ...obj,
        }))
        .filter(
          (obj) =>
            game.players.find((p) => p.d?.faction === obj.faction) === undefined
        )
        .map((obj) => (
          <div
            key={obj.faction}
            style={{
              cursor: utils.selectFaction(false, obj.faction)
                ? "pointer"
                : undefined,
            }}
            onClick={() => utils.selectFaction(true, obj.faction)}
          >
            {obj.faction}
          </div>
        ))}
    </div>
  );
}
