import styles from "../../../../shared/styles.module.css";
import { Resource, Ship, Track } from "../utils/gameTypes";
import {
  disc_cost_arr,
  Faction,
  Factions,
  income_arr,
  Upgrade,
  Upgrades,
} from "../utils/library";
import utils, { store } from "../utils/utils";

export default function PlayersView(props: {
  updateTrack: (track: Track) => void;
  upgrade: Upgrade;
}) {
  const game = store.gameW.game;
  const myIndex = utils.getMe() ? utils.myIndex() : 0;
  return (
    <div style={{ display: "flex" }}>
      {game.players
        .map(
          (_, i) => (i + game.players.length - myIndex) % game.players.length
        )
        .map((playerIndex) => ({ p: game.players[playerIndex], playerIndex }))
        .map(({ p, playerIndex }) => (
          <div key={p.userId}>
            <div
              className={styles.bubble}
              style={{
                backgroundColor:
                  p.d !== undefined && game.currentPlayer === playerIndex
                    ? "grey"
                    : undefined,
              }}
            >
              <h1>{p.userName}</h1>
              {p.d === undefined ? (
                game.currentPlayer !== playerIndex ? null : (
                  <SelectFaction />
                )
              ) : (
                <div>
                  <div
                    className={styles.bubble}
                    style={{ backgroundColor: Factions[p.d.faction].color }}
                  >
                    faction: {p.d.faction}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <div className={styles.bubble}>
                      <h5>storage:</h5>
                      {utils.enumArray(Resource).map((r) => (
                        <div key={r}>
                          {Resource[r]}: {p.d!.storage[r]}
                        </div>
                      ))}
                    </div>
                    <div className={styles.bubble}>
                      <h5 title={JSON.stringify(income_arr)}>income:</h5>
                      {utils.enumArray(Resource).map((r) => (
                        <div key={r}>
                          {Resource[r]}: {income_arr[p.d!.income[r]]}{" "}
                          {p.d!.well[r] === 0 ? null : `(${p.d!.well[r]})`}
                        </div>
                      ))}
                    </div>
                    <div className={styles.bubble}>
                      <h5 title={JSON.stringify(disc_cost_arr)}>discs:</h5>
                      <div>{p.d!.usedDiscs} used</div>
                      <div>{p.d!.remainingDiscs} remaining</div>
                      <div>
                        {
                          disc_cost_arr[
                            disc_cost_arr.length - p.d!.remainingDiscs
                          ]
                        }{" "}
                        gold
                      </div>
                    </div>
                    <div className={styles.bubble}>
                      <h5>military:</h5>
                      <pre>
                        {JSON.stringify(
                          p.d.military ||
                            [].map((m) =>
                              utils.myIndex() === playerIndex ? m : "?"
                            )
                        )}
                      </pre>
                    </div>
                    <div className={styles.bubble}>
                      <h5>diamonds:</h5>
                      <div>two points: {p.d.twoPointers}</div>
                      {(p.d.diamondUpgrades || []).map((d) => (
                        <div key={d} title={JSON.stringify(Upgrades[d])}>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.bubble} style={{ display: "block" }}>
                    <h5>research:</h5>
                    <table>
                      <tbody>
                        {utils
                          .enumArray(Track)
                          .filter((t) => t !== Track.black)
                          .map((t) => (
                            <tr key={t}>
                              <td>{Track[t]}</td>
                              {p
                                .d!.research.filter(({ track }) => track === t)
                                .map(({ science }) => (
                                  <td
                                    key={science}
                                    className={styles.bubble}
                                    style={{ margin: 0 }}
                                  >
                                    {science}
                                  </td>
                                ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    {utils.enumArray(Ship).map((s) => (
                      <div key={s} className={styles.bubble}>
                        <h5
                          title={JSON.stringify(
                            p.d!.ships[s].builtIn || {},
                            null,
                            2
                          )}
                        >
                          {Ship[s]}
                        </h5>
                        <div>
                          {p.d!.ships[s].upgrades.map((u, i) => (
                            <div
                              key={i}
                              title={JSON.stringify(Upgrades[u], null, 2)}
                            >
                              {u}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              backgroundColor: Factions[obj.faction].color,
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
