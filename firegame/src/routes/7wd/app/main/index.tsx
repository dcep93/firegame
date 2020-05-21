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
import { Age, CommercialEnum, ScienceToken, Color } from "../utils/types";

const BASE_TRASH = 2;

enum SelectedEnum {
	trash = -2,
	build = -1,
	// wonder = 0+
}

class Main extends React.Component<
	{},
	{
		selectedTarget?: SelectedEnum;
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
			utils.buyGod(selectedPantheon);
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
					select={this.selectTrash.bind(this)}
					selected={this.state.selectedTarget === SelectedEnum.trash}
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
					selected={this.state.selectedTarget}
					usedTokens={this.state.usedTokens}
					selectWonder={this.select.bind(this)}
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
			selectedPantheon: undefined,
		});
	}

	select(selectedTarget: SelectedEnum) {
		if (!utils.isMyTurn()) return;
		if (this.state.selectedTarget === selectedTarget) return this.reset();
		this.setState({ selectedTarget });
	}

	selectTrash() {
		this.select(SelectedEnum.trash);
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
		if (!utils.canTakeCard(y, x, structureCard.offset))
			return alert("cannot take that card");
		const card = bank.cards[structureCard.cardIndex];
		if (this.state.selectedTarget === SelectedEnum.build) {
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
		} else if (this.state.selectedTarget >= 0) {
			const cost = utils.getWonderCost(
				bank.wonders[
					utils.getMe().wonders[this.state.selectedTarget!]
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
					utils.canTakeCard(rowAboveY, index, aboveCard.offset)
				) {
					if (store.gameW.game.params.godExpansion)
						utils.takeToken(rowAboveY, index);
					aboveCard.revealed = true;
				}
			});
		const me = utils.getMe();
		var message;
		if (this.state.selectedTarget === SelectedEnum.trash) {
			message = `trashed ${card.name}`;
			if (!store.gameW.game.trash) store.gameW.game.trash = [];
			store.gameW.game.trash.push(structureCard.cardIndex);
			me.money +=
				BASE_TRASH +
				(me.cards || [])
					.map((cardIndex) => bank.cards[cardIndex])
					.filter((card) => card.color === Color.yellow).length;
		} else if (this.state.selectedTarget === SelectedEnum.build) {
			message = `built ${card.name}`;
			if (!me.cards) me.cards = [];
			me.cards.push(structureCard.cardIndex);
			utils.handleCardPurchase(card);
		} else {
			const w = utils.getMe().wonders[this.state.selectedTarget!];
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
}

export default Main;
