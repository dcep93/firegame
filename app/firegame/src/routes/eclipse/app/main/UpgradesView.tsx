import styles from "../../../../shared/styles.module.css";
import { Action } from "../utils/gameTypes";
import { Diamonds, Sciences, Upgrade, Upgrades } from "../utils/library";
import utils, { store } from "../utils/utils";

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
              title={JSON.stringify(Sciences[upgrade], null, 2)}
              onClick={() =>
                utils.isMyTurn() &&
                store.gameW.game.action.action === Action.upgrade &&
                props.updateUpgrade(upgrade)
              }
            >
              <div>{upgrade}</div>
              <div>{JSON.stringify(Upgrades[upgrade])}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
