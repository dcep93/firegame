import React from "react";

import utils from "../../utils";
import { PlayerType } from "../../utils/types";

import Tokens from "./Tokens";
import Wonders from "./Wonders";
import Sciences from "./Sciences";
import Cards from "./Cards";

import styles from "../../../../../shared/styles.module.css";

class Player extends React.Component<{
	player: PlayerType;
	selected?: number;
	select: (index: number) => void;
}> {
	render() {
		return (
			<div>
				<div
					className={`${styles.bubble} ${
						this.props.selected === -1 && styles.grey
					}`}
					onClick={() => this.props.select(-1)}
				>
					<h2>
						{this.props.player.userName} - $
						{this.props.player.money} -{" "}
						{utils.getScore(this.props.player)}
					</h2>
					<div className={styles.flex}>
						{this.props.player.wonders && (
							<Wonders
								wonders={this.props.player.wonders}
								select={this.props.select}
								selected={this.props.selected}
							/>
						)}
						{this.props.player.scienceTokens && (
							<Sciences
								sciences={this.props.player.scienceTokens}
							/>
						)}
						{this.props.player.cards && (
							<Cards cards={this.props.player.cards} />
						)}
					</div>
					{this.props.player.tokens && (
						<Tokens tokens={this.props.player.tokens} />
					)}
				</div>
			</div>
		);
	}
}

export default Player;
