import { useEffect, useState } from "react";
import { Track } from "../utils/gameTypes";
import { Upgrade } from "../utils/library";
import utils, { store } from "../utils/utils";
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
    if (utils.isMyTurn()) return;
    updateState(initialState);
  }, [game]);
  return (
    <div style={{ overflow: "scroll" }}>
      <DashboardView selectedSector={state.sectorIndex} />
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
