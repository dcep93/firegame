import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils, { store } from "../utils/utils";

function Bank(props: { update: (selected: { [n: number]: boolean }) => void }) {
  return (
    <div>
      <div className={styles.bubble}>
        <h4 className={styles.inline}>
          Deck: {(store.gameW.game.deck || []).length}
        </h4>
        <h4>Discard: {(store.gameW.game.discard || []).length}</h4>
        <h4>Bank:</h4>
        <div className={styles.flex}>
          {store.gameW.game.bank.map((c, i) =>
            utils.renderCard(c, i, (index: number) => {
              props.update({});
              utils.takeFromBank(index);
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Bank;
