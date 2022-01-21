import React from "react";
import styles from "../../../../shared/styles.module.css";
import utils from "../utils/utils";

function Me() {
  const me = utils.getMe();
  return (
    <div>
      <div className={styles.bubble}>
        <h4>Trains:</h4>
        {(me.hand || []).map((c, i) => utils.renderCard(c, i, () => null))}
      </div>
      <div className={styles.bubble}>
        <h4>Tickets: ?</h4>
      </div>
    </div>
  );
}

export default Me;
