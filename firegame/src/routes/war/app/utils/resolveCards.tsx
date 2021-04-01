import store from "../../../../shared/store";
import utils from "./utils";

function resolveCards(myCardId: number, opponentCardId: number) {
  const cardName = utils.cardName(myCardId);

  // see which one is bigger
  const myCardNumber = utils.cardNumber(myCardId);
  const opponentCardNumber = utils.cardNumber(opponentCardId);

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

export default resolveCards;
