import React from "react";

import utils, { store } from "../utils";

import Structure from "./structure";
import Player from "./player";
import Military from "./Military";
import Trash from "./Trash";
import Commercial from "./commercial";
import Science from "./Science";
import Pantheon from "./Pantheon";
import bank from "../utils/bank";
import {
	Age,
	CommercialEnum,
	ScienceToken,
	Color,
	CardType,
} from "../utils/types";

export enum selected {
	player,
	board,
}

const BASE_TRASH = 2;

// todo organize
class Main extends React.Component<
	{},
	{
		selectedTarget?: selected;
		selectedWonder?: number;
		selectedPantheon?: number;
		usedTokens?: { [tokenIndex: number]: boolean };
	}
> {
	constructor(props: {}) {
		super(props);
		this.state = {};
	}

	selectPantheon(selectedPantheon: number) {
		if (!utils.isMyTurn()) return;
		const godIndex = store.gameW.game.pantheon[selectedPantheon];
		if (store.gameW.game.age === Age.one) {
			if (godIndex !== -1) return;
			if (this.state.selectedPantheon === selectedPantheon)
				selectedPantheon = -1;
			this.setState({ selectedPantheon });
		} else {
			const god = bank.gods[godIndex];
			const me = utils.getMe();
			var cost =
				3 +
				(utils.myIndex() === 0
					? 5 - selectedPantheon
					: selectedPantheon);
			if (god.source === undefined) cost *= 2;
			if (
				(utils.getMe().gods || []).find(
					(godIndex) => bank.gods[godIndex].name === "the sanctuary"
				)
			)
				cost -= 2;
			if (me.money < cost) return alert("cannot afford");
			me.money -= cost;
			if (!me.gods) me.gods = [];
			me.gods.push(godIndex);
			god.f(god);
			utils.incrementPlayerTurn();
			store.update(`purchased ${god.name}`);
		}
	}

	render() {
		return (
			<div>
				{store.gameW.game.commercials && (
					<Commercial
						commercial={store.gameW.game.commercials[0]}
						selectedPantheon={this.state.selectedPantheon}
						reset={this.reset.bind(this)}
					/>
				)}
				{store.gameW.game.params.godExpansion && (
					<div>
						<Pantheon
							selectPantheon={this.selectPantheon.bind(this)}
							selectedPantheon={this.state.selectedPantheon}
						/>
					</div>
				)}
				<div>
					<Structure
						selectCard={this.selectCard.bind(this)}
						{...this.props}
					/>
				</div>
				{this.renderPlayers()}
				<div>
					<Military players={this.getPlayers()} />
				</div>
				<div>
					<Science />
				</div>
				<Trash
					select={this.selectBoard.bind(this)}
					selected={this.state.selectedTarget === selected.board}
				/>
			</div>
		);
	}

	getPlayers() {
		return utils.myIndex() >= 0
			? [utils.getMe(), utils.getOpponent()]
			: store.gameW.game.players;
	}

	renderPlayers() {
		const players = this.getPlayers();

		return (
			<div>
				<Player
					player={players[0]}
					selected={
						this.state.selectedTarget === selected.player
							? this.state.selectedWonder
							: undefined
					}
					selectWonder={this.selectPlayer.bind(this)}
					usedTokens={this.state.usedTokens}
					discount={this.discountToken.bind(this)}
				/>
				<Player
					player={players[1]}
					selectWonder={() => null}
					discount={() => null}
				/>
			</div>
		);
	}

	discountToken(tokenIndex: number) {
		if (!utils.isMyTurn()) return;
		const usedTokens = this.state.usedTokens || {};
		if (usedTokens[tokenIndex]) {
			delete usedTokens[tokenIndex];
		} else {
			usedTokens[tokenIndex] = true;
		}
		this.setState({ usedTokens });
	}

	reset() {
		if (!utils.isMyTurn()) return;
		this.setState({
			selectedTarget: undefined,
			selectedWonder: undefined,
			selectedPantheon: undefined,
		});
	}

	selectPlayer(selectedWonder: number) {
		if (!utils.isMyTurn()) return;
		if (this.state.selectedTarget !== undefined) return this.reset();
		this.setState({ selectedTarget: selected.player, selectedWonder });
	}

	selectBoard() {
		if (!utils.isMyTurn()) return;
		if (this.state.selectedTarget !== undefined) return this.reset();
		this.setState({ selectedTarget: selected.board });
	}

	selectCard(x: number, y: number) {
		if (!utils.isMyTurn()) return;
		const commercial = (store.gameW.game.commercials || [])[0]?.commercial;
		const structureCard = store.gameW.game.structure[y][x];
		if (commercial === CommercialEnum.zeus) {
			structureCard.taken = true;
			utils.endCommercial("destroyed a card");
			return;
		}
		if (commercial) return alert(commercial);
		if (this.state.selectedTarget === undefined)
			return alert("need to select a target first");
		if (!this.canTake(y, x, structureCard.offset))
			return alert("cannot take that card");
		const card = bank.cards[structureCard.cardIndex];
		if (this.state.selectedWonder === -1) {
			const cost = utils.getCardCost(card);
			if (cost > utils.getMe().money)
				return alert("cannot afford that card");
			utils.getMe().money -= cost;
			if (
				(utils.getOpponent().scienceTokens || []).includes(
					ScienceToken.economy
				)
			)
				utils.getOpponent().money += cost;
		} else if (this.state.selectedWonder !== undefined) {
			const cost = utils.getWonderCost(
				bank.wonders[
					utils.getMe().wonders[this.state.selectedWonder!]
						.wonderIndex
				]
			);
			if (cost > utils.getMe().money)
				return alert("cannot afford that wonder");
			utils.getMe().money -= cost;
			if (
				(utils.getOpponent().scienceTokens || []).includes(
					ScienceToken.economy
				)
			)
				utils.getOpponent().money += cost;
		}
		structureCard.taken = true;
		const rowAboveY = y - 1;
		const rowAbove = store.gameW.game.structure[rowAboveY];
		if (rowAbove)
			rowAbove.forEach((aboveCard, index) => {
				if (
					!aboveCard.revealed &&
					this.canTake(rowAboveY, index, aboveCard.offset)
				) {
					if (store.gameW.game.params.godExpansion)
						this.handleToken(rowAboveY, index);
					aboveCard.revealed = true;
				}
			});
		const me = utils.getMe();
		var message;
		if (this.state.selectedTarget === selected.board) {
			message = `trashed ${card.name}`;
			if (!store.gameW.game.trash) store.gameW.game.trash = [];
			store.gameW.game.trash.push(structureCard.cardIndex);
			me.money +=
				BASE_TRASH +
				(me.cards || [])
					.map((cardIndex) => bank.cards[cardIndex])
					.filter((card) => card.color === Color.yellow).length;
		} else if (this.state.selectedWonder === -1) {
			message = `built ${card.name}`;
			if (!me.cards) me.cards = [];
			me.cards.push(structureCard.cardIndex);
			this.handlePurchase(card);
		} else {
			const w = utils.getMe().wonders[this.state.selectedWonder!];
			w.built = true;
			const wonder = bank.wonders[w.wonderIndex];
			wonder.f();
			if (
				wonder.goAgain ||
				(me.scienceTokens || []).includes(ScienceToken.theology)
			)
				utils.incrementPlayerTurn();
			message = `built ${wonder.name} using ${card.name}`;
			if (
				utils.getMe().wonders.filter((wonder) => wonder.built).length +
					utils.getOpponent().wonders.filter((wonder) => wonder.built)
						.length ===
				7
			) {
				var index;
				if (utils.getMe().wonders.filter((wonder) => !wonder.built)) {
					index = me.index;
				} else {
					index = 1 - me.index;
				}
				utils.addCommercial({
					commercial: CommercialEnum.destroyWonder,
					playerIndex: index,
				});
			}
		}
		utils.incrementPlayerTurn();
		if (
			!store.gameW.game.structure.flat().filter((sc) => !sc.taken).length
		) {
			switch (store.gameW.game.age) {
				case Age.one:
					store.gameW.game.age = Age.two;
					utils.deal(store.gameW.game);
					break;
				case Age.two:
					store.gameW.game.age = Age.three;
					utils.deal(store.gameW.game);
					break;
				case Age.three:
					alert("game over");
					break;
			}
		}
		this.reset();
		store.update(message);
	}

	handleToken(row: number, col: number) {
		const game = store.gameW.game;
		const me = utils.getMe();
		if (!me.tokens) me.tokens = [];
		if (game.age === Age.one) {
			if (col % 2 === 0) {
				utils.addCommercial({
					commercial: CommercialEnum.pickGod,
					playerIndex: utils.myIndex(),
				});
			}
		} else if (game.age === Age.two) {
			if (col % 2 === 0 && row === 1) {
				me.tokens.push({ isGod: false, value: game.discounts.pop()! });
			}
		}
	}

	canTake(y: number, x: number, offset: number): boolean {
		const rowBelow = store.gameW.game.structure[y + 1];
		if (!rowBelow) return true;
		const gridX = x * 2 + offset;
		const cardsBelow = rowBelow.filter(
			(card, index) =>
				!card.taken && Math.abs(card.offset + index * 2 - gridX) === 1
		);
		return cardsBelow.length === 0;
	}

	handlePurchase(card: CardType) {
		const me = utils.getMe();
		const sciences = me.scienceTokens || [];
		if (card.extra.f) card.extra.f();
		if (
			card.upgradesFrom !== undefined &&
			(me.scienceTokens || []).includes(ScienceToken.urbanism)
		) {
			if (
				me.cards!.filter(
					(cardIndex) =>
						bank.cards[cardIndex].upgradesTo === card.upgradesFrom
				).length
			)
				me.money += 4;
		}
		if (card.extra.military) {
			var military = card.extra.military;
			if (sciences.includes(ScienceToken.strategy)) military++;
			utils.increaseMilitary(military);
		}
		if (card.extra.science) {
			utils.gainScience(card.extra.science);
		}
	}
}

export default Main;
