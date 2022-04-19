import React from "react";

import utils from "../utils/utils";

import HandCard from "./HandCard";

class Me extends React.Component {
	render() {
		const me = utils.getMe();
		if (!me || !me.hand) return null;
		return (
			<div>
				<h2>Hand: {me.hand.map(this.card)}</h2>
			</div>
		);
	}

	card(_: any, index: number) {
		return <HandCard index={index} key={index} />;
	}
}

export default Me;
