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

export enum SelectedEnum {
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
		const message = utils.selectCard(x, y, this.state.selectedTarget);
		if (!message) return;
		this.reset();
		store.update(message);
	}
}

export default Main;
