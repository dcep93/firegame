import React from "react";

import utils, { store } from "../utils/utils";

import styles from "../../../../shared/styles.module.css";

class Baroness extends React.Component<
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
		if (this.props.targets.length === 0) {
			this.props.finish("not enough targets");
		} else if (this.props.targets.length <= 2) {
			this.execute(this.props.targets[0], this.props.targets[1]);
		}
	}

	execute(p1: number, p2?: number) {
		const players = store.gameW.game.players;
		const targets = p2 === undefined ? [p1] : [p1, p2];
		const a = targets
			.map((i) => players[i])
			.map((p) => `${p.userName}: ${utils.cardString(p.hand![0])}`)
			.join("\n");
		alert(a);
		const msg = `viewed ${targets
			.map((i) => players[i].userName)
			.join(" and ")}`;
		this.props.finish(msg);
	}

	render() {
		return this.props.targets
			.map((index) => store.gameW.game.players[index]!)
			.map((p, index) => (
				<div key={index} onClick={() => this.choose(index)}>
					{p.userName}
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

export default Baroness;
