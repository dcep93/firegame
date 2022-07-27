import React from "react";

import css from "./index.module.css";
import styles from "../../../shared/styles.module.css";

class Rules extends React.Component {
	render() {
		return (
			<div className={`${styles.bubble} ${css.rules}`}>
				<h2>
					<a href="https://cdn.1j1ju.com/medias/7f/91/ba-splendor-rulebook.pdf">
						Rules
					</a>
				</h2>
				<ol>
					<li>
						Once a player has earned 15 points, finish the round,
						and the player with the most points wins.
					</li>
					<li>Points are earned primarily through buying cards.</li>
					<li>
						To buy a card, pay the token cost listed. Cards that you
						have bought will give you a permanent discount on tokens
						of that card's color.
					</li>
					<li>
						You can see the discounts from cards that all players
						have earned in the "Players" bubble. Your discounts are
						also visible in your "Tokens" bubble.
					</li>
					<li>
						You can also earn points by getting Nobles. Nobles are
						worth 3 points each, and are automatically earned when
						you have bought the cards of the listed colors.
					</li>
					<li>
						Tokens are used to pay for cards. To take tokens, select
						3 colors from the bank. If there are 4 players, and
						there are at least 6 of a color in the bank, you can
						take 2 of that single color instead of 3 different
						colors. Gold stars can not be taken using this action.
					</li>
					<li>
						If you have more than 10 tokens at the end of your turn,
						you must discard some until you only have 10.
					</li>
					<li>
						The only way to get gold stars is to reserve a card.
						Click the gold star followed by the card you want to
						reserve. Reserving a card puts it into your hand, and
						only you can buy that card.
					</li>
					<li>
						You can also reserve a random face-down card from the
						deck, in the case that you don't like any revealed
						cards, or you don't want your opponent to know what card
						you want to build.
					</li>
					<li>
						You cannot reserve a card if you already have 3 cards in
						your hand. If there are no gold star tokens available,
						you can still reserve a card, but you won't get a gold
						star.
					</li>
					<li>
						Whenever a card is bought or reserved, a new card from
						that level is revealed, so that there are always 4 cards
						of each level available.
					</li>
				</ol>
			</div>
		);
	}
}

export default Rules;
