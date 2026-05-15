import { useEffect, useState } from "react";
import { Action, Track } from "../utils/gameTypes";
import { Diamonds, Upgrade } from "../utils/library";
import { store } from "../utils/utils";
import ActionView from "./ActionView";
import DashboardView from "./DashboardView";
import PlayersView from "./PlayersView";
import ResearchView from "./ResearchView";
import SectorsView from "./SectorsView";
import UpgradesView from "./UpgradesView";

const initialState = {
  sectorIndex: -1,
  track: Track.black,
  upgrade: "_empty" as Upgrade,
};

export default function Main() {
  const [state, updateState] = useState(initialState);
  const game = store.gameW.game;
  useEffect(() => {
    if (game.action.action === Action.turn) updateState(initialState);
  }, [game]);
  return (
    <div style={{ overflow: "scroll" }}>
      <div>
        <button
          onClick={() => {
            const diamondName = game.diamonds.pop()!;
            const a = JSON.stringify(
              {
                diamondName,
                effect: Diamonds[diamondName],
              },
              null,
              2
            );
            store.update(a);
            alert(a);
          }}
        >
          drawTile ({game.diamonds.length})
        </button>
      </div>
      <ActionView />
      <DashboardView sectorIndex={state.sectorIndex} />
      <PlayersView
        updateTrack={(track) =>
          updateState(Object.assign({}, null, state, { track }))
        }
        upgrade={state.upgrade}
      />
      <SectorsView
        updateSectorIndex={(sectorIndex) =>
          updateState(Object.assign({}, null, state, { sectorIndex }))
        }
      />
      <ResearchView track={state.track} />
      <UpgradesView
        updateUpgrade={(upgrade) =>
          updateState(Object.assign({}, null, state, { upgrade }))
        }
      />
    </div>
  );
}
