import store from "../../../../shared/store";
import utils from "./utils";

function flip() {
  // draw a card from your deck
  const flippedCardId = utils.getMyTopCard();
  // what is the name of this card?
  const cardName = utils.cardName(flippedCardId);
  // see if your opponent has already played a card
  const opponentsCard = utils.getOpponentsCard();
  if (opponentsCard === undefined) {
    // your opponent has not played a card
    // it's now your opponent's turn
    utils.incrementPlayerTurn();
    // send the update
    const message = `flipped ${cardName}`;
    utils.setMessage(message);
    store.update(message);
  } else {
    // your opponent has played a card

    // see which one is bigger
    const myCardNumber = utils.cardNumber(flippedCardId);
    const opponentCardNumber = utils.cardNumber(opponentsCard);

    if (myCardNumber > opponentCardNumber) {
      // your card is bigger
      utils.takeCards();
      const message = `won with ${cardName}`;
      utils.setMessage(message);
      store.update(message);
    } else if (opponentCardNumber > myCardNumber) {
      utils.incrementPlayerTurn();
      // your opponent's card is bigger
      utils.giveCards();
      const message = `lost with ${cardName}`;
      utils.setMessage(message);
      store.update(message);
    } else {
      // the cards are equal!
      if (utils.canHaveWar()) {
        // war!
        utils.setIsWar();
        const message = `tied with ${cardName} - war!`;
        utils.setMessage(message);
        store.update(message);
      } else {
        utils.cancelWar();
        const message = `tied with ${cardName} - war cancelled!`;
        utils.setMessage(message);
        store.update(message);
      }
    }
  }
}

export default flip;
