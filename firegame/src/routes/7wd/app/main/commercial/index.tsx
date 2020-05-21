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

	render(): any {
		switch (this.props.commercial.commercial) {
			case CommercialEnum.chooseWonder:
				return <ChooseWonder extra={this.props.commercial.extra} />;
			case CommercialEnum.destroyGrey:
				return <DestroyCard color={Color.grey} />;
			case CommercialEnum.destroyBrown:
				return <DestroyCard color={Color.brown} />;
			case CommercialEnum.revive:
				return <Revive />;
			case CommercialEnum.library:
				return (
					<Library
						extra={this.props.commercial.extra}
						buildScience={this.buildScience.bind(this)}
					/>
				);
			case CommercialEnum.destroyWonder:
				return <DestroyWonder />;
			case CommercialEnum.pickGod:
				return (
					<PickGod
						reset={this.props.reset}
						selectedPantheon={this.props.selectedPantheon}
					/>
				);
			case CommercialEnum.anubis:
				return <Anubis />;
			case CommercialEnum.ra:
				return <Ra />;
			case CommercialEnum.isis:
				return <Isis />;
			case CommercialEnum.nisaba:
				return <Nisaba />;
			case CommercialEnum.enki:
				return (
					<Enki
						extra={this.props.commercial.extra}
						buildScience={this.buildScience.bind(this)}
					/>
				);
			case CommercialEnum.baal:
				return <Baal />;
			case CommercialEnum.theater:
				return <Theater />;
			case CommercialEnum.gate:
				return <Gate />;
		}
		return null;
	}

	// todo cant build the same science
	buildScience(scienceName: ScienceToken) {
		if (!utils.isMyTurn()) return alert("not your turn");
		const me = utils.getMe();
		if (!me.sciences) me.sciences = [];
		me.sciences.push(scienceName);
		utils.endCommercial(
			`built ${utils.enumName(scienceName, ScienceToken)}`
		);
	}
}

export default Commercial;
