import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Art, Artist, AType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import ArtC from "./ArtC";

class Me extends React.Component {
  render() {
    const me = utils.getMe();
    return (
      <div className={styles.bubble}>
        <div>money: {me.money}</div>
        <div>
          {me.hand.map((a, i) => (
            <span onClick={() => this.click(a, i)} key={i}>
              <ArtC a={a} />
            </span>
          ))}
        </div>
      </div>
    );
  }

  click(a: Art, i: number): void {
    if (!utils.isMyTurn()) return;
    const auction = store.gameW.game.auction;
    if (!auction) {
      store.gameW.game.auction = {
        art: [utils.getMe().hand.splice(i, 1)[0]],
        bid: -1,
        playerIndex: utils.myIndex(),
      };
      this.initializeAuction();
      store.update(`auctions ${Artist[a.artist]} - ${AType[a.aType]}`);
      return;
    }
    const last = auction.art[auction.art.length - 1];
    if (last.aType !== AType.double) return;
    auction.art.push(utils.getMe().hand.splice(i, 1)[0]);
    this.initializeAuction();
    store.update(`double auctions ${Artist[a.artist]} - ${AType[a.aType]}`);
  }

  initializeAuction() {
    const auction = store.gameW.game.auction!;
    switch (auction.art[auction.art.length - 1].aType) {
      case AType.hidden:
        utils.incrementPlayerTurn();
        break;
      case AType.open:
        utils.incrementPlayerTurn();
        break;
      case AType.single:
        utils.incrementPlayerTurn();
        break;
    }
  }
}

export default Me;
