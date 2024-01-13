import styles from "../../../../shared/styles.module.css";
import { PlayerType } from "../utils/NewGame";

export default function Player(props: { p: PlayerType }) {
  return (
    <div>
      <div className={styles.bubble}>{props.p.userName}</div>
    </div>
  );
}
