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
          {(me.hand || []).map((a, i) => (
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
      if (this.roundEnds(a.artist, false)) return this.endRound(a, i);
      store.gameW.game.auction = {
        art: utils.getMe().hand!.splice(i, 1),
        seller: utils.myIndex(),
        bid: 0,
        bidder: utils.myIndex(),
      };
      this.initializeAuction();
      store.update(`auctions ${utils.artToString(a)}`);
      return;
    }
    const last = auction.art[0];
    if (last.artist !== a.artist) return;
    if (last.aType !== AType.double) return;
    if (utils.getMe().hand![i].aType === AType.double) return;
    if (this.roundEnds(a.artist, true)) {
      delete store.gameW.game.auction;
      return this.endRound(a, i);
    }
    auction.seller = auction.bidder = utils.myIndex();
    auction.art.unshift(utils.getMe().hand!.splice(i, 1)[0]);
    this.initializeAuction();
    store.update(`double auctions ${utils.artToString(a)}`);
  }

  roundEnds(a: Artist, isDouble: boolean): boolean {
    if (store.gameW.game.players.map((p) => (p.hand || []).length).sum() === 1)
      return true;
    return utils.countArt(a) + (isDouble ? 1 : 0) === 4;
  }

  endRound(a: Art, i: number): void {
    utils.getMe().hand!.splice(i, 1);
    utils.incrementPlayerTurn();
    const ranks = utils
      .enumArray(Artist)
      .sort((a, b) => utils.countArt(b) - utils.countArt(a)) as Artist[];
    store.gameW.game.values[ranks[0]][store.gameW.game.round] = 30;
    store.gameW.game.values[ranks[1]][store.gameW.game.round] = 20;
    store.gameW.game.values[ranks[2]][store.gameW.game.round] = 10;
    const incomeByArtist = utils.enumArray(Artist).reduce(
      (iterIncome, a: Artist) => ({
        ...iterIncome,
        [a]:
          store.gameW.game.values[a][store.gameW.game.round] === 0
            ? 0
            : store.gameW.game.values[a].sum(),
      }),
      {}
    ) as {
      [a in Artist]: number;
    };
    const incomeByPlayer = store.gameW.game.players.map((p) => {
      const rval = Object.entries(p.collection)
        .map(([a, num]) => num * incomeByArtist[parseInt(a) as Artist])
        .sum();
      p.collection = utils.emptyCollection();
      p.money += rval;
      return rval;
    });
    const valuesString = incomeByPlayer.map(
      (income, index) =>
        `${store.gameW.game.players[index].userName} - ${income}`
    );
    utils.allDraw(store.gameW.game);
    store.update(`ends the round - ${valuesString} - ${utils.artToString(a)}`);
  }

  initializeAuction() {
    const auction = store.gameW.game.auction!;
    switch (auction.art[0].aType) {
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
