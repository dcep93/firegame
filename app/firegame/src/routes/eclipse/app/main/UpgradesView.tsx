import { Upgrade, Upgrades } from "../utils/library";

export default function UpgradesView(props: {
  updateUpgrade: (upgrade: Upgrade) => void;
}) {
  return (
    <div>
      {Object.entries(Upgrades)
        .map(([upgrade, obj]) => ({
          upgrade: upgrade as Upgrade,
          obj,
        }))
        .map((obj) => (
          <div
            key={obj.upgrade}
            onClick={() => props.updateUpgrade(obj.upgrade)}
          >
            <div>{obj.upgrade}</div>
          </div>
        ))}
    </div>
  );
}
