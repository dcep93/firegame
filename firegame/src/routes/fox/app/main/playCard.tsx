import { store, shared, deal, getText, sortHand } from "../utils/utils";
import { Card, PlayerType } from "../utils/NewGame";

function playCard(index: number): string | void {
	const me = shared.getMe();
	var card = me.hand[index];
	const game = store.gameW.game;
	const fromStaging = Boolean(game.staging);
	if (fromStaging) {
		handlePre_3_5(card);
		card = game.staging!;
		game.staging = null;
	} else if (game.lead) {
		if (!canPlay(card, game.lead)) return alert("cant play that card");
	}
	me.hand.splice(index, 1);
	if (!fromStaging) {
		var duringMessage = handleDuring_3_5(card);
		if (duringMessage !== null) {
			game.staging = card;
			return store.update(duringMessage);
		}
	}
	var text = getText(card);
	if (!game.lead) {
		game.lead = card;
		shared.incrementPlayerTurn();
		return store.update(`lead with ${text}`);
	} else {
		var winner;
		if (wins(card)) {
			winner = me;
		} else {
			shared.incrementPlayerTurn();
			winner = shared.getCurrent();
		}
		winner.tricks++;
		handlePost_1_7(card, winner);
		game.previous = `${getText(game.lead)} vs ${text}`;
		game.lead = null;
		var message = `played ${text}`;
		if (me.hand.length === 0) {
			var scores = game.players
				.map((player) => `${player.userName}: ${player.tricks}`)
				.join(" / ");
			message = `${message} - new hand - ${scores}`;
			game.previous += `\n${scores}`;
			scoreFromTricks();
			deal(game);
		}
		store.update(message);
	}
}

function canPlay(card: Card, lead: Card) {
	if (card.suit === lead.suit) {
		if (lead.value !== 11) {
			return true;
		} else if (card.value === 1) {
			return true;
		}
	}
	var hand = shared.getMe().hand;
	for (var i = 0; i < hand.length; i++) {
		var handCard = hand[i];
		if (handCard.suit === lead.suit) {
			if (lead.value === 11) {
				if (handCard.value > card.value) {
					return false;
				}
			} else {
				return false;
			}
		}
	}
	return true;
}

function handlePre_3_5(card: Card) {
	const game = store.gameW.game;
	if (game.staging!.value === 5) {
		game.deck.push(card);
	} else if (game.staging!.value === 3) {
		game.trump = card;
	}
}

function handleDuring_3_5(card: Card) {
	const hand = shared.getMe().hand;
	const game = store.gameW.game;
	if (card.value === 5) {
		var drawnCard = game.deck.shift()!;
		var text = getText(drawnCard);
		alert(`you drew ${text}`);
		hand.unshift(drawnCard);
		sortHand(hand);
		return "draws a card";
	}
	if (card.value === 3) {
		hand.unshift(game.trump);
		sortHand(hand);
		return "swaps trump";
	}
	return null;
}

function handlePost_1_7(card: Card, winner: PlayerType) {
	const me = shared.getMe();
	const game = store.gameW.game;
	if (card.value === 1) {
		if (winner !== me) {
			shared.incrementPlayerTurn();
		}
	} else if (game.lead!.value === 1) {
		if (winner === me) {
			shared.incrementPlayerTurn();
		}
	}
	if (card.value === 7) winner.score++;
	if (game.lead!.value === 7) winner.score++;
}

function wins(card: Card) {
	const game = store.gameW.game;
	const lead = game.lead!;
	if (card.suit === lead.suit) {
		return card.value > lead.value;
	} else {
		if (card.value === 9) {
			if (lead.value !== 9) {
				if (lead.suit === game.trump.suit) {
					return card.value > lead.value;
				} else {
					return true;
				}
			}
		} else if (lead.value === 9) {
			if (card.value < lead.value) {
				return false;
			}
		}
		return card.suit === game.trump.suit;
	}
}

function scoreFromTricks() {
	const players = store.gameW.game.players;
	for (var i = 0; i < players.length; i++) {
		var playerState = players[i];
		switch (playerState.tricks) {
			case 0:
			case 1:
			case 2:
			case 3:
				playerState.score += 6;
				return;
			case 4:
				playerState.score += 1;
				return;
			case 5:
				playerState.score += 2;
				return;
			case 6:
				playerState.score += 3;
				return;
			case 7:
			case 8:
			case 9:
				playerState.score += 6;
				return;
		}
	}
}

export default playCard;
