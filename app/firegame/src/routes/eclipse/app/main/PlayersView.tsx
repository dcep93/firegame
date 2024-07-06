import { Track } from "../utils/gameTypes";
import { Faction, Factions, Upgrade } from "../utils/library";
import utils, { store } from "../utils/utils";

export default function PlayersView(props: {
  upgrade: Upgrade | null;
  updateTrack: (track: Track) => void;
}) {
  const game = store.gameW.game;
  return (
    <div>
      {game.players.map((p) => (
        <div key={p.userId}>
          {p.d === undefined
            ? Object.entries(Factions)
                .map(([faction, obj]) => ({
                  faction: faction as Faction,
                  ...obj,
                }))
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
                ))
            : JSON.stringify(p.d)}
        </div>
      ))}
    </div>
  );
}
