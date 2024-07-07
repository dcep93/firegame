import styles from "../../../../shared/styles.module.css";
import { Diamonds, Upgrade, Upgrades } from "../utils/library";

export default function UpgradesView(props: {
  updateUpgrade: (upgrade: Upgrade) => void;
}) {
  return (
    <div>
      <div className={styles.bubble}>
        <h5>upgrades:</h5>
        <div style={{ display: "flex", flexWrap: "wrap" }}></div>
        {Object.keys(Upgrades)
          .map((upgrade) => upgrade as Upgrade)
          .filter((upgrade) => Diamonds[upgrade] === undefined)
          .map((upgrade) => (
            <div
              key={upgrade}
              className={styles.bubble}
              onClick={() => props.updateUpgrade(upgrade)}
            >
              <div>{upgrade}</div>
              <div>{JSON.stringify(Upgrades[upgrade])}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
