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
	render(): any {
		switch (this.props.commercial.commercial) {
			case CommercialEnum.chooseWonder:
				return <ChooseWonder />;
			case CommercialEnum.destroyGrey:
				return <DestroyCard color={Color.grey} />;
			case CommercialEnum.destroyBrown:
				return <DestroyCard color={Color.brown} />;
			case CommercialEnum.revive:
				return <Revive />;
			case CommercialEnum.library:
				return (
					<Library
						sciences={this.props.commercial.sciences!}
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
						sciences={this.props.commercial.sciences!}
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

	buildScience(scienceName: ScienceToken) {
		if (!utils.isMyTurn()) return;
		const me = utils.getMe();
		if (!me.scienceTokens) me.scienceTokens = [];
		me.scienceTokens.push(scienceName);
		store.gameW.game.sciences.find(
			(obj) => obj.token === scienceName
		)!.taken = true;
		utils.endCommercial(
			`built ${utils.enumName(scienceName, ScienceToken)}`
		);
	}
}

export default Commercial;
