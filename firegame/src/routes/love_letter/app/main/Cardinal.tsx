import React from "react";

import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Cardinal extends React.Component<
	{
		targets: number[];
		finish: (m: string) => void;
	},
	{ targetIndex: number }
> {
	componentDidMount() {
		this.action();
	}

	componentDidUpdate() {
		this.action();
	}

	action() {
		window.requestAnimationFrame(this.actionHelper.bind(this));
	}

	actionHelper() {
		if (store.gameW.game.cardinal) return;
		if (this.props.targets.length < 2) {
			this.props.finish("not enough targets");
		} else if (this.props.targets.length === 2) {
			this.execute(this.props.targets[0], this.props.targets[1]);
		}
	}

	execute(p1: number, p2: number) {
		const players = store.gameW.game.players;
		store.gameW.game.cardinal = { p1, p2 };
		[players[p1].hand, players[p2].hand] = [
			players[p2].hand,
			players[p1].hand,
		];
		store.update(
			`swapped ${players[p1].userName} and ${players[p2].userName}`
		);
	}

	render() {
		if (store.gameW.game.cardinal) {
			return this.renderView();
		} else {
			if (this.props.targets.length <= 2) return null;
			return this.renderChoose();
		}
	}

	renderView() {
		const cardinal = store.gameW.game.cardinal!;
		return (
			<div className={styles.bubble}>
				<h2>Peek at a swapped player's new hand</h2>
				<div className={styles.bubble} onClick={() => this.view(-1)}>
					None
				</div>
				<div
					className={styles.bubble}
					onClick={() => this.view(cardinal.p1)}
				>
					{store.gameW.game.players[cardinal.p1].userName}
				</div>
				<div
					className={styles.bubble}
					onClick={() => this.view(cardinal.p2)}
				>
					{store.gameW.game.players[cardinal.p2].userName}
				</div>
			</div>
		);
	}

	view(index: number) {
		delete store.gameW.game.cardinal;
		if (index < 0) {
			this.props.finish(`declined to peek`);
		} else {
			const p = store.gameW.game.players[index];
			alert(utils.cardString(p.hand![0]));
			this.props.finish(`peeked at [${p.userName}]'s hand`);
		}
	}

	renderChoose() {
		return this.props.targets
			.map((index) => ({
				index,
				player: store.gameW.game.players[index]!,
			}))
			.map((o) => (
				<div
					key={o.index}
					onClick={() => this.choose(o.index)}
					className={`${styles.bubble} ${
						this.state &&
						this.state.targetIndex === o.index &&
						styles.grey
					}`}
				>
					{o.player.userName}
				</div>
			));
	}

	choose(targetIndex: number) {
		if (this.state) {
			const prev = this.state.targetIndex;
			if (prev !== -1) {
				if (prev !== targetIndex) {
					this.execute(prev, targetIndex);
				}
				targetIndex = -1;
			}
		}
		this.setState({ targetIndex });
	}
}

export default Cardinal;
