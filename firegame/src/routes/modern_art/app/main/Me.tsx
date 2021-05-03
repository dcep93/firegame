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
      if (this.isFifth(a.artist, false)) return this.endRound();
      store.gameW.game.auction = {
        art: [utils.getMe().hand.splice(i, 1)[0]],
        playerIndex: utils.myIndex(),
        bid: 0,
        bidder: utils.myIndex(),
      };
      this.initializeAuction();
      store.update(`auctions ${Artist[a.artist]} - ${AType[a.aType]}`);
      return;
    }
    const last = auction.art[auction.art.length - 1];
    if (last.aType !== AType.double) return;
    if (this.isFifth(a.artist, true)) return this.endRound();
    auction.art.push(utils.getMe().hand.splice(i, 1)[0]);
    this.initializeAuction();
    store.update(`double auctions ${Artist[a.artist]} - ${AType[a.aType]}`);
  }

  // todo
  isFifth(a: Artist, isDouble: boolean): boolean {
    return false;
  }

  // todo
  endRound(): void {}

  initializeAuction() {
    const auction = store.gameW.game.auction!;
    switch (auction.art[auction.art.length - 1].aType) {
      case AType.fixed:
        auction.bid = -1;
        break;
      case AType.hidden:
      case AType.open:
      case AType.single:
        utils.incrementPlayerTurn();
        break;
    }
  }
}

export default Me;
