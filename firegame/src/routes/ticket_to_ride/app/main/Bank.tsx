import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

function Bank() {
  return (
    <div>
      <div className={styles.bubble}>
        <h4 onClick={utils.takeFromDeck}>
          Deck: {(store.gameW.game.deck || []).length}
        </h4>
        <h4>Discard: {(store.gameW.game.discard || []).length}</h4>
        <h4>Bank:</h4>
        <div className={styles.flex}>
          {store.gameW.game.bank.map((c, i) =>
            utils.renderCard(c, i, utils.takeFromBank)
          )}
        </div>
      </div>
    </div>
  );
}

export default Bank;
