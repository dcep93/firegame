import css from "../index.module.css";
import { store } from "../utils/utils";
import { GameType } from "../utils/NewGame";
import BankView from "./BankView";
import BuildingMarket from "./BuildingMarket";
import PlayerBoard from "./PlayerBoard";
import RoleRow from "./RoleRow";
import ScoreBoard from "./ScoreBoard";

function Main(props: { game?: GameType; readOnly?: boolean }) {
  const game = props.game || store.gameW.game;
  const myIndex = game.players.findIndex((player) => player.userId === store.me.userId);
  const players =
    myIndex >= 0
      ? [...game.players.slice(myIndex), ...game.players.slice(0, myIndex)]
      : game.players;
  return (
    <div className={css.root}>
      {game.phase === "game_over" && <ScoreBoard />}
      <RoleRow game={game} readOnly={props.readOnly} />
      <BankView game={game} readOnly={props.readOnly} />
      <BuildingMarket game={game} readOnly={props.readOnly} />
      <div className={css.playerList}>
        {players.map((player) => (
          <PlayerBoard key={player.userId} game={game} player={player} readOnly={props.readOnly} />
        ))}
      </div>
    </div>
  );
}

export default Main;
