import { PlayerType } from "../utils/NewGame";

export default function Player(props: { p: PlayerType }) {
  return <div>{props.p.userName}</div>;
}
