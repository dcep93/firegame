import styles from "../../../../shared/styles.module.css";
import { Track } from "../utils/gameTypes";
import { Science, Sciences } from "../utils/library";
import utils, { store } from "../utils/utils";

export default function ResearchView(props: { track: Track }) {
  const game = store.gameW.game;
  return (
    <div>
      <div className={styles.bubble}>
        <h5>research:</h5>
        <table>
          <tbody>
            {utils.enumArray(Track).map((t) => (
              <tr key={t}>
                <td>{Track[t]}</td>
                {Object.entries(Sciences)
                  .map(([science, obj]) => ({
                    science: science as Science,
                    ...obj,
                    count: game.buyableSciences.filter((s) => s === science)
                      .length,
                  }))
                  .filter(
                    (obj) =>
                      t === obj.track && (t !== Track.black || obj.count > 0)
                  )
                  .map((obj) => (
                    <td key={obj.science} title={JSON.stringify(obj, null, 2)}>
                      {obj.count === 0 ? null : (
                        <div
                          className={styles.bubble}
                          style={{
                            margin: 0,
                            cursor: utils.research(
                              false,
                              obj.science,
                              props.track
                            )
                              ? "pointer"
                              : undefined,
                          }}
                          onClick={() =>
                            utils.research(true, obj.science, props.track)
                          }
                        >
                          <div>{obj.science}</div>
                          <div>
                            ${obj.cost}/{obj.floor} (x{obj.count})
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
