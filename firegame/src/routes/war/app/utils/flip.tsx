import store from "../../../../shared/store";
import utils from "./utils";

function flip() {
  if (utils.isWar()) {
    flipWar();
  } else {
    flipNoWar();
  }
}

function flipNoWar() {
  // draw a card from your deck
  const flippedCardId = utils.getMyTopCard();
  // see if your opponent has already played a card
  const opponentsCard = utils.getOpponentsCard();
  if (opponentsCard === undefined) {
    // your opponent has not played a card
    // it's now your opponent's turn
    utils.incrementPlayerTurn();
    // send the update
    store.update(`flipped ${utils.cardName(flippedCardId)}`);
  } else {
    // your opponent has played a card

    // see which one is bigger
    const myCardNumber = utils.cardNumber(flippedCardId);
    const opponentCardNumber = utils.cardNumber(opponentsCard);

    if (myCardNumber > opponentCardNumber) {
      // your card is bigger
      utils.takeCards();
      store.update(`won with ${utils.cardName(flippedCardId)}`);
    } else if (opponentCardNumber > myCardNumber) {
      utils.incrementPlayerTurn();
      // your opponent's card is bigger
      utils.giveCards();
      store.update(`lost with ${utils.cardName(flippedCardId)}`);
    } else {
      // the cards are equal!
      if (utils.canHaveWar()) {
        // war!
        utils.setIsWar();
        utils.incrementPlayerTurn();
        store.update(`tied with ${utils.cardName(flippedCardId)} - war!`);
      } else {
        utils.cancelWar();
        store.update(
          `tied with ${utils.cardName(flippedCardId)} - war cancelled!`
        );
      }
    }
  }
}

function flipWar() {
  // draw a card from your deck
  const flippedCardId = utils.getMyTopCard();
  // see if your opponent has already played a card
  const opponentsCard = utils.getOpponentsCard();
  if (opponentsCard === undefined) {
    // your opponent has not played a card
    // it's now your opponent's turn
    utils.incrementPlayerTurn();
    // send the update
    store.update(`flipped ${utils.cardName(flippedCardId)}`);
  } else {
    // your opponent has played a card

    // see which one is bigger
    const myCardNumber = utils.cardNumber(flippedCardId);
    const opponentCardNumber = utils.cardNumber(opponentsCard);

    if (myCardNumber > opponentCardNumber) {
      // your card is bigger
      utils.takeWarCards();
      store.update(`won with ${utils.cardName(flippedCardId)}`);
    } else if (opponentCardNumber < myCardNumber) {
      utils.incrementPlayerTurn();
      // your opponent's card is bigger
      utils.giveWarCards();
      store.update(`lost with ${utils.cardName(flippedCardId)}`);
    } else {
      // the cards are equal - no double war
      utils.cancelDoubleWar();
      store.update(
        `tied with ${utils.cardName(flippedCardId)} - double war cancelled!`
      );
    }
  }
}

export default flip;
