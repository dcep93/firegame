import React, { RefObject } from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { AType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import ArtC from "./ArtC";

class AuctionC extends React.Component {
  inputRef: RefObject<HTMLInputElement> = React.createRef();
  render(): JSX.Element | null {
    const auction = store.gameW.game.auction!;
    const isBiddable = auction.art[0]!.aType !== AType.double;
    return (
      <div className={styles.bubble}>
        {auction.art.map((a, i) => (
          <ArtC key={i} a={a} c={css.auction_art} />
        ))}
        {isBiddable && (
          <div>current bid: {auction.bid >= 0 && auction.bid}</div>
        )}
        {(utils.isMyTurn() || auction.art[0].aType === AType.open) && (
          <div>
            {isBiddable && (
              <form onSubmit={this.submit.bind(this)}>
                <input type="number" ref={this.inputRef} />
                <input type="submit" value="Bid" />
              </form>
            )}
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
          utils.incrementPlayerTurn();
          return store.update(`set a price of ${bid}`);
        }
        if (bid < 0 && auction.seller !== utils.myIndex()) {
          utils.incrementPlayerTurn();
          return store.update("passed");
        }
        if (auction.bid !== bid) return alert(`need to bid ${auction.bid}`);
        auction.bidder = utils.myIndex();
        auction.bid = bid;
        return this.buy();
      case AType.hidden:
        if (utils.myIndex() === auction.seller && bid < 0)
          return alert("cannot bid less than zero");
        if (!auction.hiddenBids) auction.hiddenBids = [];
        auction.hiddenBids.push(bid);
        if (bid > -auction.bid) {
          auction.bid = -bid;
          auction.bidder = utils.myIndex();
        }
        if (auction.seller !== utils.myIndex()) {
          utils.incrementPlayerTurn();
          return store.update("placed a bid");
        }
        auction.bid = -auction.bid;
        return this.buy(auction.hiddenBids!.join(","));
      case AType.open:
        if (bid < 0) {
          utils.incrementPlayerTurn();
          return store.update("passed");
        }
        if (bid <= auction.bid) return alert("need to increase the bid");
        auction.bid = bid;
        auction.bidder = utils.myIndex();
        return this.buy();
      case AType.single:
        if (auction.seller === utils.myIndex()) {
          if (bid < 0) return this.buy();
          if (auction.bid > bid) return alert("need to increase the bid");
          auction.bidder = utils.myIndex();
          auction.bid = bid;
          return this.buy();
        }
        if (bid < 0) {
          utils.incrementPlayerTurn();
          if (auction.seller === utils.currentIndex() && auction.bid === 0)
            return this.buy();
          return store.update("passed");
        }
        if (auction.bid && bid <= auction.bid)
          return alert("need to increase the bid");
        auction.bid = bid;
        auction.bidder = utils.myIndex();
        utils.incrementPlayerTurn();
        return store.update(`bid ${bid}`);
      case AType.double:
        utils.incrementPlayerTurn();
        if (auction.seller === utils.currentIndex()) {
          return this.buy("free");
        }
        return store.update("passed");
    }
  }

  buy(msg: string | null = null): void {
    const auction = store.gameW.game.auction!;
    delete store.gameW.game.auction;
    store.gameW.game.currentPlayer = auction.seller;
    const winner = store.gameW.game.players[auction.bidder];
    winner.money -= auction.bid;
    if (auction.bidder !== auction.seller) {
      store.gameW.game.players[auction.seller].money += auction.bid;
    }
    auction.art.forEach((a) => winner.collection[a.artist]++);
    for (let i = 0; i < store.gameW.game.players.length; i++) {
      utils.incrementPlayerTurn();
      if (utils.getCurrent().hand !== undefined) break;
    }
    const msgs = [
      "won auction",
      auction.bid,
      store.gameW.game.players[auction.bidder].userName,
      auction.art.map(utils.artToString).join(","),
    ];
    if (msg) msgs.push(msg);

    store.update(msgs.join(" - "));
  }
}

export default AuctionC;
