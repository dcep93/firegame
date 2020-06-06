import React from "react";

import { Card, Ranks, COUNTS } from "./utils/NewGame";
import utils from "./utils/utils";

import styles from "../../../shared/styles.module.css";

const RULES = {
	[Card.guard]:
		"Choose a player and number (other than 1). If that player has that card, they are out of the round.",
	[Card.priest]: "Look at a player's hand.",
	[Card.baron]:
		"Secretly compare hands with another player. The player with the LOWER number is knocked out",
	[Card.handmaid]:
		"You are immune to the effects of other players’ cards until the start of your next turn.",
	[Card.prince]:
		"Choose a player (including yourself) to discard their hand and draw a new card.",
	[Card.king]: "Trade hands with another player.",
	[Card.countess]:
		"(No effect) - you must discard if you also have the King or Prince.",
	[Card.princess]: "If discarded, you lose.",
	[Card.bishop]:
		"Choose a player and number. If player has that card, you win a token. Also, if you were correct, that player may discard their card and draw a new one. Bishop loses to the Princess at round end.",
	[Card.queen]:
		"Secretly compare hands with another player. The player with the HIGHER number is knocked out",
	[Card.constable]:
		"If knocked out with this in the discard pile, you win a token.",
	[Card.count]:
		"At round end, increases proximity to Princess by 1 for each Count in your discard pile.",
	[Card.sycophant]:
		"When you discard the Sycophant, choose a player (including yourself). Then, as long as the next card played has an effect that chooses one or more players, it has to at least choose the player you chose with the Sycophant.",
	[Card.baroness]: "Look at the hands of 2 other players.",
	[Card.cardinal]:
		"When you discard the Cardinal, choose exactly 2 players (you may include yourself), who will switch hands. Then, once the hands are switched, you may look at one of them.",
	[Card.guardX]: "Expansion guard is the same as the normal guard.",
	[Card.jester]:
		"Choose another player. If that player wins the round, you win a token.",
	[Card.assassin]:
		"If attacked by a guard (regardless if successful), the guard is eliminiated, and you draw a new card, discarding the assassin.",
};

const FLAVOR = {
	[Card.guard]: `
1: Guard Odette
Charged with seeing to the security of the royal family, Odette follows her orders with persistence and diligence… even though her mentor is said to have drowned while fleeing arrest for complicity in the Queen’s treason.

When you discard the Guard, choose a player and name a number (other than 1). If that player has that number in their hand, that player is knocked out of the round. If all other players still in the round cannot be chosen (eg. due to Handmaid or Sycophant), this card is discarded without effect.`,
	[Card.priest]: `
2: Priest Tomas
Open, honest, and uplifting, Father Tomas always seeks out the opportunity to do good. With the arrest of the Queen, he is often seen about the palace, acting as confessor, counselor, and friend.

When you discard the Priest, you can look at another player’s hand. Do not reveal the hand to any other players.`,
	[Card.baron]: `
3: Baron Talus
The scion of an esteemed house that has long been a close ally of the royal family, Baron Talus has a quiet and gentle demeanor that conceals a man used to being obeyed. His suggestions are often treated as if they came from the King himself.

When you discard the Baron, choose another player still in the round. You and that player secretly compare your hands. The player with the lower number is knocked out of the round. In case of a tie, nothing happens.`,
	[Card.handmaid]: `
4: Handmaid Susannah
Few would trust a mere Handmaid with a letter of importance. Fewer still understand Susannah’s cleverness, or her skilled ability at playing the foolish Handmaid. That the Queen’s confidante and loyal servant escaped any attention after the Queen’s arrest is a testament to her clever mind.

When you discard the Handmaid, you are immune to the effects of other players’ cards until the start of your next turn. If all players other than the player whose turn it is are protected by the Handmaid, the player must choose himor herself for a card’s effects, if possible.`,
	[Card.prince]: `
5: Prince Arnaud
As a social gadfly, Prince Arnaud was not as distressed over his mother’s arrest as one would suppose. Since many women clamor for his attention, he hopes to help his sister find the same banal happiness by playing matchmaker.

When you discard Prince Arnaud, choose one player still in the round (including yourself). That player discards his or her hand (but doesn’t apply its effect, unless it is the Princess, see page 8) and draws a new one. If the deck is empty and the player cannot draw a card, that player draws the card that was removed at the start of the round. If all other players are protected by the Handmaid, you must choose yourself.`,
	[Card.king]: `
6: King Arnaud IV
The undisputed ruler of Tempest… for the moment. Because of his role in the arrest of Queen Marianna, he does not rate as highly with Princess Annette as a father should. He hopes to work himself back into her graces.

When you discard King Arnaud IV, trade the card in your hand with the card held by another player of your choice. You cannot trade with a player who is out of the round.`,
	[Card.countess]: `
7: Countess Wilhelmina
Always on the prowl for a handsome man or juicy gossip, Wilhelmina’s age and noble blood make her one of Princess Annette’s friends. While she has great influence over the Princess, she makes herself scarce whenever the King or Prince are around. Unlike other cards, which take effect when discarded, the text on the Countess applies while she is in your hand. In fact, the only time it doesn’t apply is when you discard her.

If you ever have the Countess and either the King or Prince in your hand, you must discard the Countess. You do not have to reveal the other card in your hand. Of course, you can also discard the Countess even if you do not have a royal family member in your hand. The Countess likes to play mind games....`,
	[Card.princess]: `
8: Princess Annette
Hampered only by the naïveté of youth, Princess Annette is elegant, charming, and beautiful. Obviously, you want the princess to carry your letter. However, she is self-conscious about matters of the heart, and if confronted, will toss your letter in the fire and deny looking at any correspondence.

If you discard the Princess—no matter how or why—she has tossed your letter into the fire. You are immediately knocked out of the round. If the Princess was discarded by a card effect, any remaining effects of that card do not apply (you do not draw a card from the Prince, for example). Effects tied to being knocked out the round still apply (eg. Constable, Jester), however.`,
	[Card.bishop]: `
9: Bishop Vinizio
Measured and calculating, Bishop Vinizio may come across as a schemer or opportunist. The truth, though, is that he cares deeply for the welfare of his congregants, and will go to great lengths to protect and help them.

Discarding the Bishop allows you to name a number and a player. If the player has that number in their hand, you get a Token of Affection. If this would give you enough Tokens to win the game, then you win immediately and the game ends. If you gained a Token of Affection from this effect, then the player whose card you effectively revealed with the Bishop may discard their card (but doesn’t apply its effects, unless it is the Princess, see page 8) and draw a new one. At the end of a round, despite his impressive 9, the Princess still beats the Bishop when comparing the values of cards in players’ hands. He is considered to have a value of 9 for all other game effects, however`,
	[Card.queen]: `
7: Dowager Queen Tummia
Mother to King Arnaud, the dowager Queen Mother Tummia was devastated by the arrest of her daughter-in-law, Queen Marianna. She now focuses her attention on her granddaughter, Princess Annette, in whom she sees much of the deposed Queen.

When you discard the Dowager Queen, choose another player still in the round. You and that player secretly compare your hands. The player with the higher number is knocked out of the round. In case of a tie, nothing happens.`,
	[Card.constable]: `
6: Constable Viktor
Because the security of the royal court ultimately rests in the hands of Constable Viktor, it was his decision to arrest the Queen for high treason. Now, as the weight of his duty bears down on him, he is determined to see no harm befall the young Princess.

The Constable is a somewhat unusual card, insofar as its effect applies not when discarded, like most cards, but when you are knocked out of the round with it in your discard pile. Should this happen, show the Constable, then claim a Token of Affection. If this would give you enough Tokens to win the game, then you win immediately and the game ends.`,
	[Card.count]: `
5: Count Guntram
An ambitious man, the wily Count Guntram is careful to offer his support to whomever he believes is most likely to benefit his own interests in court. Once he has made his choice, though, his loyalty is certain, as he continues to work behind the scenes on his chosen patron’s behalf.

When the round ends, if it is necessary to check the number in the players’ hands to determine a winner, the Count will increase that number by 1. Note that this stacks, so if you have both copies of the Count in your discard pile, the number will increase by 2. In this case, the cards with a number of 7—the Countess and the Dowager Queen—would beat the Princess. If increasing the number of the card in your hand with the Count would result in a tie for highest number in a player’s hand, then resolve ties normally, by adding the numbers of the cards in the discard pile of each tied player and comparing the totals.`,
	[Card.sycophant]: `
4: Sycophant Morris
The Sycophant is a true opportunist. Obsequious to the point of groveling, he will do almost anything to gain favor from more powerful and influential courtiers, then seek to use that favor to further his own standing in court.

When you discard the Sycophant, choose a player (including yourself). Then, as long as the next card played has an effect that chooses one or more players, it has to at least choose the player you chose with the Sycophant.`,
	[Card.baroness]: `
3: Baroness Fiona
While Baroness Fiona is seemingly content to remain in the political shadow of her husband, Baron Talus, this is really a ruse. Fiona has a keen mind for courtly intrigue, and will take firm, albeit discrete action as she sees fit, regardless of whether it aligns with her husband’s interests.

When you discard the Baroness, you can look at the hands of either 1 or 2 other players. Do not reveal them to any other players.`,
	[Card.cardinal]: `
2: Cardinal Vesper
A devout and notoriously uncompromising man, Cardinal Vesper would see the Princess married to an “appropriate” suitor—and as soon as possible, at that. The girl’s happiness is certainly a consideration, but stabilizing the royal family and its succession in the wake of the Queen’s alleged treason is what matters most.

When you discard the Cardinal, choose exactly 2 players (you may include yourself), who will switch hands. Then, once the hands are switched, you may look at one of them without revealing it to any other players. If less than 2 players still in the round can be chosen, (eg. due to Handmaid or Sycophant), this card is discarded without effect.`,
	[Card.guardX]: `
1: Guard Dougaul
Dour and uncompromising, Dougaul is every bit as committed to the security and well-being of the royal family as Odette, his fellow Guard. He has an abiding, almost fatherly fondness for the young Princess, though, and will cast a wary and searching eye on any suitor seeking her favor.

When you discard the Guard, choose a player and name a number (other than 1). If that player has that number in their hand, that player is knocked out of the round. If all other players still in the round cannot be chosen (eg. due to Handmaid or Sycophant), this card is discarded without effect.`,
	[Card.jester]: `
0: Jester Darius
Although often seen in court, Jester Darius is a mere entertainer. This might seem to suggest his influence is negligible, but like many of low station who work in the royal court, Darius is largely invisible to the powerful courtiers around him. As a result, he sees and hears much more than most realize, giving him a potent sort of influence of his own.

When you discard the Jester, choose another player—ideally, the one you believe is most likely to win the round. It’s helpful to place the Jester token provided in the game near the player you chose, so everyone remembers your choice. If you’re correct, and your chosen player does win the round, you gain a Token of Affection. If this would give you enough Tokens to win the game, then you win immediately and the game ends.`,
	[Card.assassin]: `
0: Assassin
A shadowy and elusive figure of menace, the Assassin will work for whomever can meet his price. He is particularly adept at circumventing the Guards who protect the court, allowing him to pursue his secretive activities undisturbed—whether that’s delivering a suitor’s letter of affection to the cloistered Princess, or conducting more sinister business...

This is a card whose effect only applies while it is in your hand. If another player chooses you when playing a Guard, then regardless of what number that player named (even 0!), when you reveal the Assassin (to all players), the Guard’s player is eliminated from the round, while you are not. Of course, all other players will now know that you have the Assassin in your hand. It would be both improper and dangerous to keep consorting with such an unsavory character, so after you’ve resolved the Assassin’s effect, you must discard him and draw a new card. If the deck is empty and you cannot draw a card, then draw the card that was removed at the start of the round.`,
};

class Rules extends React.Component {
	render() {
		return (
			<div className={styles.bubble}>
				<h2>
					<a href="http://alderac.com/wp-content/uploads/2017/11/Love-Letter-Premium_Rulebook.pdf">
						Rules
					</a>
				</h2>
				<div className={styles.bubble}>
					<ol>
						<li>Draw a card.</li>
						<li>
							Pick one of your two cards to play. Its effect is
							activated.
						</li>
						<li>Your remaining card stays in your hand.</li>
						<li>
							The last player remaining in the round is the
							winner, and earns a token of affection.
						</li>
						<li>
							If multiple players are still in the round when the
							deck runs out, the player with the higher rank card
							in their hand wins the round.
						</li>
						<li>
							If there is a tie, the player with the highest sum
							of ranks in their discard pile is the winner of the
							round.
						</li>
						<li>
							If there is STILL a tie, nobody wins a token of
							affection.
						</li>
						<li>
							When the round is over, a new round begins, and
							everyone draws a new starting card.
						</li>
						<li>
							You need a bunch of tokens of affection to win the
							game.
						</li>
						<li>
							Each round, secretly remove one card from the deck.
							It is replaced at the end of the round.
						</li>
						<li>
							In a 2-4 player game, only use the first 8 types of
							card.
						</li>
						<li>
							In a 2 player game, remove and reveal 3 cards from
							the deck to expedite rounds.
						</li>
					</ol>
				</div>
				<div>
					{Object.values(Card).map(
						(c) =>
							typeof c === "number" && (
								<div
									key={c}
									title={FLAVOR[c].replace(/^\s+|\s+$/g, "")}
								>
									{utils.cardString(c)}: {Math.abs(COUNTS[c])}
									<p>{RULES[c]}</p>
								</div>
							)
					)}
				</div>
			</div>
		);
	}
}

export default Rules;
