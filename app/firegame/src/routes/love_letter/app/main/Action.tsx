import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Card, deal, Ranks } from "../utils/NewGame";
import utils, { store, WINNER } from "../utils/utils";
import ActionComponent from "./ActionComponent";
import Baroness from "./Baroness";
import Bishop from "./Bishop";
import BishopDiscard from "./BishopDiscard";
import Cardinal from "./Cardinal";
import Guard from "./Guard";
import Winner from "./Winner";

var actioning = false;

enum ComponentsE {
  bishop,
  bishopDiscard,
  guard,
  winner,
}

const ComponentsM: { [c in ComponentsE]: typeof ActionComponent } = {
  [ComponentsE.bishop]: Bishop,
  [ComponentsE.bishopDiscard]: BishopDiscard,
  [ComponentsE.guard]: Guard,
  [ComponentsE.winner]: Winner,
};

class Action extends React.Component<{}, { c?: ComponentsE; index?: number }> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.action();
  }

  componentDidUpdate() {
    this.action();
  }

  action() {
    window.requestAnimationFrame(this.actionHelper.bind(this));
  }

  actionHelper() {
    if (
      !utils.isMyTurn() ||
      store.gameW.game.played === undefined ||
      this.state.c !== undefined ||
      actioning
    )
      return;
    actioning = true;
    switch (store.gameW.game.played) {
      // @ts-ignore
      case WINNER:
        const jester = store.gameW.game.jester;
        delete store.gameW.game.jester;
        if (store.gameW.game.tiedPlayers) {
          const tiedPlayers = store.gameW.game.tiedPlayers;
          delete store.gameW.game.tiedPlayers;
          deal(store.gameW.game);
          store.update(
            `no one wins because of a tie between ${tiedPlayers
              .map((i) => store.gameW.game.players[i].userName)
              .join(",")}`
          );
        }
        if (jester === utils.myIndex()) {
          const p = store.gameW.game.players.find(
            (p) => (p.played || []).indexOf(Card.jester) !== -1
          )!;
          p.score++;
          store.update(`wins, [${p.userName}] scores a jester`);
        } else {
          this.setState({ c: ComponentsE.winner });
        }
        break;
      case Card.cardinal:
      // @ts-ignore fallthrough
      case Card.baroness:
        break;
      // @ts-ignore
      case Card.bishop:
        if (store.gameW.game.bishop !== undefined) {
          this.setState({ c: ComponentsE.bishopDiscard });
          break;
        }
      // @ts-ignore fallthrough
      default:
        const targets = this.getTargets();
        if (targets.length === 0) {
          this.finish("no targets");
        } else if (targets.length === 1) {
          this.execute(targets[0]);
        }
        break;
    }
    actioning = false;
  }

  getTargets() {
    return store.gameW.game.players
      .map((player, index) => ({ player, index }))
      .filter((o) => o.player.hand)
      .filter((o) => (o.player.played || [])[0] !== Card.handmaid)
      .filter(
        (o) =>
          store.gameW.game.sycophant === undefined ||
          o.index === store.gameW.game.sycophant ||
          store.gameW.game.played === Card.cardinal ||
          store.gameW.game.played === Card.baroness
      )
      .filter(
        (o) =>
          store.gameW.game.played === Card.prince ||
          store.gameW.game.played === Card.sycophant ||
          store.gameW.game.played === Card.cardinal ||
          o.player.userId !== utils.getCurrent().userId
      )
      .map((o) => o.index);
  }

  execute(index: number) {
    const player = store.gameW.game.players[index];
    switch (store.gameW.game.played) {
      case Card.guardX:
      // @ts-ignore fallthrough
      case Card.guard:
        const card = player.hand![0];
        if (card === Card.assassin) {
          utils.discard(player, false);
          utils.discard(utils.getMe(), true);
          this.finish(`was assassinated by ${player.userName}`);
        } else {
          this.setState({ c: ComponentsE.guard, index });
        }
        break;
      case Card.priest:
        alert(utils.cardString(player.hand![0]));
        this.finish(`looked at [${player.userName}]'s hand`);
        break;
      case Card.baron:
        const diff = Ranks[player.hand![0]] - Ranks[utils.getMe().hand![0]];
        if (diff === 0) {
          this.finish(`baron tied [${player.userName}]`);
        } else {
          const loser = diff > 0 ? utils.getMe() : player;
          const cardString = utils.cardString(loser.hand![0]);
          utils.discard(loser, true);
          this.finish(`baron [${player.userName}] (${cardString})`);
        }
        break;
      case Card.prince:
        const msg = `made [${player.userName}] discard ${utils.cardString(
          player.hand![0]
        )}`;
        utils.discard(player, false);
        this.finish(msg);
        break;
      case Card.king:
        const me = utils.getMe();
        [me.hand, player.hand] = [player.hand, me.hand];
        this.finish(`swapped with [${player.userName}]`);
        break;
      case Card.jester:
        store.gameW.game.jester = index;
        this.finish(`selected ${player.userName} to win`);
        break;
      case Card.sycophant:
        // need to set sycophant before finishing::advancingTurn
        // because advancingTurn resets sycophant
        this.finish();
        store.gameW.game.sycophant = index;
        store.update(`sycophanted ${player.userName}`);
        break;
      case Card.queen:
        const diffQ = Ranks[player.hand![0]] - Ranks[utils.getMe().hand![0]];
        if (diffQ === 0) {
          this.finish(`queen tied [${player.userName}]`);
        } else {
          const loser = diffQ < 0 ? utils.getMe() : player;
          const cardString = utils.cardString(loser.hand![0]);
          utils.discard(loser, true);
          this.finish(`queen [${player.userName}] (${cardString})`);
        }
        break;
      case Card.bishop:
        this.setState({ c: ComponentsE.bishop, index });
        break;
    }
  }

  finish(msg?: string) {
    delete store.gameW.game.played;
    utils.advanceTurn();
    if (msg !== undefined) store.update(msg);
  }

  reset() {
    this.setState({ c: undefined, index: undefined });
  }

  render() {
    if (!utils.isMyTurn() || store.gameW.game.played === undefined) return null;
    if (this.state.c !== undefined) {
      const c = ComponentsM[this.state.c];
      const cc = { c };
      return (
        <cc.c
          index={this.state.index!}
          player={store.gameW.game.players[this.state.index!]}
          finish={this.finish.bind(this)}
          reset={this.reset.bind(this)}
        />
      );
    }
    if (store.gameW.game.bishop !== undefined) return null;
    const targets = this.getTargets();
    if (store.gameW.game.played === Card.cardinal)
      return <Cardinal targets={targets} finish={this.finish.bind(this)} />;
    if (store.gameW.game.played === Card.baroness)
      return <Baroness targets={targets} finish={this.finish.bind(this)} />;
    if (targets.length <= 1) return null;
    return targets
      .map((index) => ({
        index,
        player: store.gameW.game.players[index],
      }))
      .map((o, index) => (
        <div
          key={index}
          className={styles.bubble}
          onClick={() => this.execute(o.index)}
        >
          {o.player.userName}
        </div>
      ));
  }
}

export default Action;
