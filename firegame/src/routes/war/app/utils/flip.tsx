import store from "../../../../shared/store";
import resolveCards from "./resolveCards";
import utils from "./utils";

function flip() {
  // draw a card from your deck
  const myCardId = utils.getMyTopCard();
  // see if your opponent has already played a card
  const opponentCardId = utils.getOpponentsCard();
  if (opponentCardId === undefined) {
    // your opponent has not played a card
    // it's now your opponent's turn
    utils.incrementPlayerTurn();
    // what is the name of this card?
    const cardName = utils.cardName(myCardId);
    // send the update
    const message = `flipped ${cardName}`;
    utils.setMessage(message);
    store.update(message);
  } else {
    // your opponent has played a card
    resolveCards(myCardId, opponentCardId);
  }
}

export default flip;
