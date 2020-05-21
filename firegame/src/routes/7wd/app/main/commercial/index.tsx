import React from "react";

import utils, { store } from "../../utils";
import {
	CommercialType,
	CommercialEnum,
	Color,
	ScienceToken,
} from "../../utils/types";

import Isis from "./Isis";
import ChooseWonder from "./ChooseWonder";
import DestroyCard from "./DestroyCard";
import Revive from "./Revive";
import Library from "./Library";
import DestroyWonder from "./DestroyWonder";
import PickGod from "./PickGod";
import Anubis from "./Anubis";
import Ra from "./Ra";
import Nisaba from "./Nisaba";
import Enki from "./Enki";
import Baal from "./Baal";
import Theater from "./Theater";
import Gate from "./Gate";

class Commercial extends React.Component<{
	commercial: CommercialType;
	selectedPantheon?: number;
	reset: () => void;
}> {
	componentDidMount() {
		this.alert();
	}

	componentDidUpdate() {
		this.alert();
	}

	alert() {
		if (this.props.commercial.playerIndex === utils.myIndex())
			alert(this.props.commercial.commercial);
	}

	pop() {
		store.gameW.game.commercials!.shift();
	}

	render(): any {
		switch (this.props.commercial.commercial) {
			case CommercialEnum.chooseWonder:
				return (
					<ChooseWonder
						commercial={this.props.commercial}
						pop={this.pop}
					/>
				);
			case CommercialEnum.destroyGrey:
				return (
					<DestroyCard
						commercial={this.props.commercial}
						pop={this.pop}
						color={Color.grey}
					/>
				);
			case CommercialEnum.destroyBrown:
				return (
					<DestroyCard
						commercial={this.props.commercial}
						pop={this.pop}
						color={Color.brown}
					/>
				);
			case CommercialEnum.revive:
				return (
					<Revive commercial={this.props.commercial} pop={this.pop} />
				);
			case CommercialEnum.library:
				return (
					<Library
						commercial={this.props.commercial}
						pop={this.pop}
						buildScience={this.buildScience.bind(this)}
					/>
				);
			case CommercialEnum.destroyWonder:
				return (
					<DestroyWonder
						commercial={this.props.commercial}
						pop={this.pop}
					/>
				);
			case CommercialEnum.pickGod:
				return (
					<PickGod
						commercial={this.props.commercial}
						pop={this.pop}
						reset={this.props.reset}
						selectedPantheon={this.props.selectedPantheon}
					/>
				);
			case CommercialEnum.anubis:
				return (
					<Anubis commercial={this.props.commercial} pop={this.pop} />
				);
			case CommercialEnum.ra:
				return <Ra commercial={this.props.commercial} pop={this.pop} />;
			case CommercialEnum.isis:
				return <Isis pop={this.pop.bind(this)} />;
			case CommercialEnum.nisaba:
				return (
					<Nisaba commercial={this.props.commercial} pop={this.pop} />
				);
			case CommercialEnum.enki:
				return (
					<Enki
						commercial={this.props.commercial}
						pop={this.pop}
						buildScience={this.buildScience.bind(this)}
					/>
				);
			case CommercialEnum.baal:
				return (
					<Baal commercial={this.props.commercial} pop={this.pop} />
				);
			case CommercialEnum.theater:
				return (
					<Theater
						commercial={this.props.commercial}
						pop={this.pop}
					/>
				);
			case CommercialEnum.gate:
				return (
					<Gate commercial={this.props.commercial} pop={this.pop} />
				);
		}
		return null;
	}

	// todo cant build the same science
	buildScience(scienceName: ScienceToken) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const me = utils.getMe();
		if (!me.sciences) me.sciences = [];
		me.sciences.push(scienceName);
		this.pop();
		store.update(`built ${utils.enumName(scienceName, ScienceToken)}`);
	}
}

export default Commercial;
