import Firebase from "../../../firegame/Firebase";

export type GameType = { dan: number };

function builder() {
	return { dan: Firebase.now() };
}

export default builder;
