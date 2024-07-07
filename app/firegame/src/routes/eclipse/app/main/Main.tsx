import { useState } from "react";
import { Track } from "../utils/gameTypes";
import { Upgrade } from "../utils/library";
import DashboardView from "./DashboardView";
import PlayersView from "./PlayersView";
import ResearchView from "./ResearchView";
import SectorsView from "./SectorsView";
import UpgradesView from "./UpgradesView";

export default function Main() {
  const [track, updateTrack] = useState(Track.black);
  const [upgrade, updateUpgrade] = useState<Upgrade | null>(null);
  return (
    <div style={{ overflow: "scroll" }}>
      <DashboardView />
      <PlayersView updateTrack={updateTrack} upgrade={upgrade} />
      <SectorsView />
      <ResearchView track={track} />
      <UpgradesView updateUpgrade={updateUpgrade} />
    </div>
  );
}
