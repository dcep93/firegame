import { store, shared, deal, getText } from "../utils";

function playCard(index: number): string | void {
	// const me = shared.getMe();
	// var card = me.hand[index];
	// const game = store.gameW.game;
	// const fromStaging = game.staging !== null;
	// if (fromStaging) {
	// 	handlePre(card);
	// 	card = game.staging!;
	// 	game.staging = null;
	// } else if (game.lead !== null) {
	// 	if (cantPlay(card)) return alert("cant play that card");
	// }
	// me.hand.splice(index, 1);
	// if (!fromStaging) {
	// 	var duringMessage = handleDuring(card);
	// 	if (duringMessage !== null) {
	// 		game.staging = card;
	// 		return store.update(duringMessage);
	// 	}
	// }
	// var text = getText(card);
	// if (game.lead === null) {
	// 	game.lead = card;
	// 	shared.incrementPlayerTurn();
	// 	return store.update(`lead with ${text}`);
	// } else {
	// 	var winner;
	// 	if (wins(card)) {
	// 		winner = me;
	// 	} else {
	// 		shared.incrementPlayerTurn();
	// 		winner = shared.getCurrent();
	// 	}
	// 	winner.tricks++;
	// 	handlePost(card, winner);
	// 	game.previous = `${getText(game.lead)} vs ${text}`;
	// 	game.lead = null;
	// 	var message = `played ${text}`;
	// 	if (me.hand.length === 0) {
	// 		var scores = game.players
	// 			.map((player) => `${player.userName}: ${player.tricks}`)
	// 			.join(" / ");
	// 		message = `${message} - new hand - ${scores}`;
	// 		game.previous += `\n${scores}`;
	// 		scoreFromTricks();
	// 		deal(game);
	// 	}
	// 	store.update(message);
	// }
}

// function cantPlay(card) {
// 	if (card.suit === state.lead.suit) {
// 		if (state.lead.value !== 11) {
// 			return false;
// 		} else if (card.value === 1) {
// 			return false;
// 		}
// 	}
// 	var hand = me().state.hand;
// 	for (var i = 0; i < hand.length; i++) {
// 		var handCard = hand[i];
// 		if (handCard.suit === state.lead.suit) {
// 			if (state.lead.value === 11) {
// 				if (handCard.value > card.value) {
// 					return true;
// 				}
// 			} else {
// 				return true;
// 			}
// 		}
// 	}
// 	return false;
// }

// function handlePre(card) {
// 	if (state.staging.value === 5) {
// 		state.deck.push(card);
// 	} else if (state.staging.value === 3) {
// 		state.trump = card;
// 	}
// }

// function handleDuring(card) {
// 	if (card.value === 5) {
// 		var hand = me().state.hand;
// 		var drawnCard = state.deck.shift();
// 		var text = getText(drawnCard);
// 		alert(`you drew ${text}`);
// 		hand.unshift(drawnCard);
// 		sortHand(hand);
// 		return "draws a card";
// 	}
// 	if (card.value === 3) {
// 		var hand = me().state.hand;
// 		hand.unshift(state.trump);
// 		sortHand(hand);
// 		return "swaps trump";
// 	}
// 	return null;
// }

// function handlePost(card, winner) {
// 	if (card.value === 1) {
// 		if (winner !== me()) {
// 			advanceTurn();
// 		}
// 	} else if (state.lead.value === 1) {
// 		if (winner === me()) {
// 			advanceTurn();
// 		}
// 	}
// 	if (card.value === 7) winner.state.score++;
// 	if (state.lead.value === 7) winner.state.score++;
// }

// function wins(card) {
// 	if (card.suit === state.lead.suit) {
// 		return card.value > state.lead.value;
// 	} else {
// 		if (card.value === 9) {
// 			if (state.lead.value !== 9) {
// 				if (state.lead.suit === state.trump.suit) {
// 					return card.value > state.lead.value;
// 				} else {
// 					return true;
// 				}
// 			}
// 		} else if (state.lead.value === 9) {
// 			if (card.value < state.lead.value) {
// 				return false;
// 			}
// 		}
// 		return card.suit === state.trump.suit;
// 	}
// }

// function scoreFromTricks() {
// 	for (var i = 0; i < state.players.length; i++) {
// 		var playerState = state.players[i].state;
// 		if (playerState.tricks === 0) {
// 			playerState.score += 6;
// 		} else if (playerState.tricks === 1) {
// 			playerState.score += 6;
// 		} else if (playerState.tricks === 2) {
// 			playerState.score += 6;
// 		} else if (playerState.tricks === 3) {
// 			playerState.score += 6;
// 		} else if (playerState.tricks === 4) {
// 			playerState.score += 1;
// 		} else if (playerState.tricks === 5) {
// 			playerState.score += 2;
// 		} else if (playerState.tricks === 6) {
// 			playerState.score += 3;
// 		} else if (playerState.tricks === 7) {
// 			playerState.score += 6;
// 		} else if (playerState.tricks === 8) {
// 			playerState.score += 6;
// 		} else if (playerState.tricks === 9) {
// 			playerState.score += 6;
// 		}
// 	}
// }

export default playCard;
