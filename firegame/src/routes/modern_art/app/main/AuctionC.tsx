import React, { RefObject } from "react";
import styles from "../../../../shared/styles.module.css";
import { AType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class AuctionC extends React.Component {
  inputRef: RefObject<HTMLInputElement> = React.createRef();
  render(): JSX.Element | null {
    const auction = store.gameW.game.auction!;
    if (auction.art[0].aType === AType.double) return null;
    return (
      <div className={styles.bubble}>
        <div>current bid: {auction.bid >= 0 && auction.bid}</div>
        {utils.isMyTurn() && (
          <div>
            <form onSubmit={this.submit.bind(this)}>
              <input type="number" ref={this.inputRef} />
            </form>
            <button onClick={() => this.submitHelper(-1)}>pass</button>
          </div>
        )}
      </div>
    );
  }

  submit(e: React.FormEvent<HTMLFormElement>): void {
    this.submitHelper(parseInt(this.inputRef.current!.value));
    e.preventDefault();
  }

  submitHelper(bid: number): void {
    const auction = store.gameW.game.auction!;
    const aType = auction.art[0].aType;
    switch (aType) {
      case AType.fixed:
        if (auction.bid < 0) {
          if (bid < 0) return alert("need to set a price");
          if (bid > utils.getMe().money)
            return alert("cannot bid more than you have");
          auction.bid = bid;
          return store.update(`set a price of ${bid}`);
        }
        if (bid < 0 && auction.playerIndex !== utils.myIndex()) {
          utils.incrementPlayerTurn();
          return store.update("passed");
        }
        if (auction.bid !== bid) return alert(`need to bid ${auction.bid}`);
        return this.buy(bid, utils.myIndex());
      case AType.hidden:
        if (utils.myIndex() === auction.playerIndex && bid < 0)
          return alert("cannot bid less than zero");
        if (bid > -auction.bid) {
          auction.bid = -bid;
          auction.bidder = utils.myIndex();
        }
        if (auction.playerIndex !== utils.myIndex())
          return store.update("placed a bid");
        return this.buy(auction.bid, auction.bidder);
      case AType.open:
        if (bid < 0) {
          utils.incrementPlayerTurn();
          if (auction.bidder === utils.currentIndex())
            return this.buy(auction.bid, utils.currentIndex());
          return store.update("passed");
        }
        if (bid <= auction.bid) return alert("need to increase the bid");
        auction.bid = bid;
        auction.bidder = utils.myIndex();
        utils.incrementPlayerTurn();
        return store.update(`bid ${bid}`);
      case AType.single:
        if (auction.playerIndex === utils.myIndex()) {
          if (bid < 0) return this.buy(auction.bid, auction.bidder);
          if (auction.bid > bid) return alert("need to increase the bid");
          return this.buy(bid, utils.myIndex());
        }
        if (bid < 0) {
          utils.incrementPlayerTurn();
          if (auction.playerIndex === utils.currentIndex() && auction.bid === 0)
            return this.buy(0, auction.playerIndex);
          return store.update("passed");
        }
        if (auction.bid && bid <= auction.bid)
          return alert("need to increase the bid");
        auction.bid = bid;
        auction.bidder = utils.myIndex();
        utils.incrementPlayerTurn();
        return store.update(`bid ${bid}`);
    }
  }

  buy(bid: number, playerIndex: number): void {
    const auction = store.gameW.game.auction!;
    delete store.gameW.game.auction;
    store.gameW.game.currentPlayer = auction.playerIndex;
    if (utils.isMyTurn()) {
      utils.getMe().money -= bid;
    } else {
      utils.getCurrent().money += bid;
      store.gameW.game.players[auction.bidder].money -= bid;
    }
    utils.incrementPlayerTurn();
    store.update(
      `${bid} - ${
        store.gameW.game.players[playerIndex].userName
      } - ${auction.art.map(utils.artToString).join(",")}`
    );
  }
}

export default AuctionC;
