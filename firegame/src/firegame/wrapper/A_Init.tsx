import Firebase from "../Firebase";

import { PropsType } from "./E_Base";
import Render from "./B_Render";

const VERSION: string = "v0.0.3";

class Init<T> extends Render<T> {
	constructor(props: PropsType) {
		super(props);
		this.setUserId();
		this.state = { userId: localStorage.userId };
	}

	setUserId(): void {
		if (localStorage.version !== VERSION) {
			localStorage.version = VERSION;
			localStorage.userId = `u_${Math.random().toString(16).substr(2)}`;
		}
	}

	componentDidMount(): void {
		Firebase.init();
		super.componentDidMount();
	}
}

export default Init;
