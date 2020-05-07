import { GameType } from "./Render";

function NewGame(): Promise<GameType> | GameType {
	return { dan: Date.now() };
}

export default NewGame;
