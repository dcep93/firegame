import React from "react";

import Hand from "./Hand";
import Players from "./Players";
import Cards from "./Cards";
import Nobles from "./Nobles";
import Tokens from "./Tokens";

class Main extends React.Component<{}, { goldSelected?: boolean }> {
	constructor(props: {}) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<>
				<Hand />
				<br />
				<Players />
				<br />
				<Cards />
				<br />
				<Nobles />
				<br />
				<Tokens
					goldSelected={this.state.goldSelected}
					selectGold={this.selectGold.bind(this)}
				/>
			</>
		);
	}

	selectGold(allowSelect: boolean) {
		this.setState({
			goldSelected: allowSelect && !this.state.goldSelected,
		});
	}
}

export default Main;
