import React from "react";

import { CommercialEnum, Color } from "../../utils/types";
import { store } from "../../utils";

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
	selectedPantheon?: number;
	reset: () => void;
}> {
	render(): any {
		switch (store.gameW.game.commercials![0].commercial) {
			case CommercialEnum.chooseWonder:
				return <ChooseWonder />;
			case CommercialEnum.destroyGrey:
				return <DestroyCard color={Color.grey} />;
			case CommercialEnum.destroyBrown:
				return <DestroyCard color={Color.brown} />;
			case CommercialEnum.revive:
				return <Revive />;
			case CommercialEnum.library:
				return <Library />;
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
				return <Enki />;
			case CommercialEnum.baal:
				return <Baal />;
			case CommercialEnum.theater:
				return <Theater />;
			case CommercialEnum.gate:
				return <Gate />;
		}
		return null;
	}
}

export default Commercial;
