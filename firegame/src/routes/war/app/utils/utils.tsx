import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { GameType, PlayerType } from "./NewGame";

const store: StoreType<GameType> = store_;

const NUM_WAR_CARDS = 3;

class Utils extends Shared<GameType, PlayerType> {
  getDeck(): number[] {
    return this.shuffle(this.count(52));
  }

  dealToPlayers(deck: number[], players: PlayerType[]): void {
    var nextPlayer = 0;
    while (deck.length > 0) {
      players[nextPlayer].deck!.push(deck.pop()!);
      nextPlayer++;
      if (nextPlayer >= players.length) {
        nextPlayer = 0;
      }
    }
  }

  cardNumber(cardId: number): number {
    return Math.floor(cardId / 4) + 2;
  }

  cardName(cardId: number): string {
    const numberNumber = this.cardNumber(cardId);
    const numberToRoyal: { [number: number]: string } = {
      11: "J",
      12: "Q",
      13: "K",
      14: "A",
    };
    const numberString =
      numberNumber > 10 ? numberToRoyal[numberNumber] : numberNumber;
    const suitToSuit: { [number: number]: string } = {
      0: "♠️",
      1: "♦️",
      2: "♥️",
      3: "♣️",
    };
    const suitString = suitToSuit[cardId % 4];
    return `${numberString}${suitString}`;
  }

  getMyTopCard() {
    const cardId = this.getMe().deck!.pop()!;
    utils.getMe().flippedCard = cardId;
    return cardId;
  }

  getOpponentsCard(): number | undefined {
    return this.getOpponent().flippedCard;
  }

  isWar(): boolean {
    return store.gameW.game.isWar;
  }

  setIsWar() {
    this.setWarCards(utils.getMe());
    this.setWarCards(utils.getOpponent());
    store.gameW.game.isWar = true;
  }

  setWarCards(p: PlayerType) {
    p.warCards = [p.flippedCard!];
    delete p.flippedCard;
    for (let i = 0; i < NUM_WAR_CARDS; i++) {
      this.maybeShuffle(p);
      p.warCards.push(p.deck!.pop()!);
    }
  }

  collectCards(p: PlayerType) {
    if (store.gameW.game.isWar) {
      store.gameW.game.isWar = false;
      p.discard!.push(
        ...utils.getMe().warCards!,
        ...utils.getOpponent().warCards!
      );
      delete utils.getMe().warCards;
      delete utils.getOpponent().warCards;
    }
    const cards = [
      utils.getMe().flippedCard!,
      utils.getOpponent().flippedCard!,
    ];
    p.discard!.push(...cards);
    this.maybeShuffle(utils.getMe());
    this.maybeShuffle(utils.getOpponent());
    return cards;
  }

  maybeShuffle(p: PlayerType) {
    delete p.flippedCard;
    if (p.deck!.length === 0) {
      p.deck = this.shuffle(p.discard || []);
      p.discard = [];
    }
    if (p.deck!.length === 0) {
      store.gameW.game.currentPlayer = -1;
      store.gameW.info.alert = "game over";
    }
  }

  takeCards() {
    this.collectCards(utils.getMe());
  }

  giveCards() {
    this.collectCards(utils.getOpponent());
  }

  canHaveWar(): boolean {
    return (
      !store.gameW.game.isWar &&
      this.playerCanHaveWar(utils.getMe()) &&
      this.playerCanHaveWar(utils.getOpponent())
    );
  }

  playerCanHaveWar(p: PlayerType): boolean {
    return (p.deck || []).length + (p.discard || []).length >= NUM_WAR_CARDS;
  }

  cancelWar() {
    store.gameW.game.isWar = false;
    this.cancelPlayerWar(utils.getMe());
    this.cancelPlayerWar(utils.getOpponent());
  }

  cancelPlayerWar(p: PlayerType) {
    p.discard!.push(...(p.warCards || []));
    delete p.warCards;
    p.discard!.push(p.flippedCard!);
    delete p.flippedCard;
    this.maybeShuffle(p);
  }

  setMessage(msg: string) {
    var full_message = `${this.getMe().userName}: ${msg}`;
    if (store.gameW.game.isWar || this.getMe().flippedCard === undefined) {
      full_message = `${store.gameW.game.message} / ${full_message}`;
    }
    store.gameW.game.message = full_message;
  }
}

const utils = new Utils();

export default utils;

export { store };
