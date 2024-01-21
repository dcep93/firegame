import { useState } from "react";
import styles from "../../../../shared/styles.module.css";

import single_player from "../assets/1.jpg";
import one_to_three from "../assets/1_3.jpg";
import four_to_seven from "../assets/4_7.jpg";
import five_player from "../assets/5.jpg";
import caverns from "../assets/caverns.jpg";
import mat from "../assets/mat.jpg";
import upcoming from "../assets/upcoming.jpg";

export default function Photos() {
  const [visible, update] = useState<{ [k: string]: boolean }>({});
  return (
    <div className={styles.bubble}>
      <h3>images</h3>
      {Object.entries({
        mat,
        caverns,
        upcoming,
        single_player,
        one_to_three,
        four_to_seven,
        five_player,
      }).map(([k, v]) => (
        <div key={k}>
          <div
            onClick={() => {
              update(Object.assign({}, visible, { [k]: !visible[k] }));
            }}
          >
            {k}
          </div>
          <img hidden={!visible[k]} src={v} alt={k} style={{ width: "100%" }} />
        </div>
      ))}
    </div>
  );
}
