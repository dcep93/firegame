import store from "../../../../shared/store";
import utils from "./utils";
function flip() {
  const flippedCardId = utils.getMyTopCard();
  const cardName = utils.cardName(flippedCardId);
  const opponentsCard = utils.getOpponentsCard();
  if (opponentsCard === undefined) {
    utils.incrementPlayerTurn();
    const message = `flipped ${cardName}`;
    utils.setMessage(message);
    store.update(message);
  } else {
    const myCardNumber = utils.cardNumber(flippedCardId);
    const opponentCardNumber = utils.cardNumber(opponentsCard);
    if (utils.getMe().userName === "daniel") {
      utils.takeCards();
      const message = `won with ${cardName}`;
      utils.setMessage(message);
      store.update(message);
    } else if (utils.getOpponent().userName === "daniel") {
      utils.incrementPlayerTurn();
      utils.giveCards();
      const message = `lost with ${cardName}`;
      utils.setMessage(message);
      store.update(message);
    } else {
      if (utils.canHaveWar()) {
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
