import React from "react";
import styles from "../../../../shared/styles.module.css";
import flip from "../utils/flip";
import { PlayerType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Main extends React.Component {
  render() {
    return (
      <div>
        {store.gameW.game.players.map((p, i) => (
          <div key={i}>
            <div className={styles.bubble}>
              <h2>{p.userName}</h2>
              <div>
                <div>
                  {p.warCards !== undefined &&
                    "war cards: " +
                      p.warCards.map((cardId) => utils.cardName(cardId))}
                </div>
                <div>
                  played:{" "}
                  {p.flippedCard !== undefined && utils.cardName(p.flippedCard)}
                </div>
              </div>
              <div>
                <div>cards in deck: {(p.deck || []).length}</div>
                <div>cards in discard: {(p.discard || []).length}</div>
              </div>
            </div>
          </div>
        ))}
        <div className={styles.bubble}>
          <button disabled={!utils.isMyTurn()} onClick={flipHelper}>
            Flip
          </button>
        </div>
      </div>
    );
  }
}

function ensureReady(p: PlayerType) {
  if (!p.discard) p.discard = [];
  if (!p.deck) p.deck = [];
}

function flipHelper() {
  ensureReady(utils.getMe());
  ensureReady(utils.getOpponent());
  flip();
}

export default Main;
