import { GameType } from "./Render";
import Quizlet from "./Quizlet";
import { LobbyType } from "../../../../firegame/wrapper/C_LobbyListener";

export type Params = {
	quizlet: string;
	handSize: number;
	boardStartingSize: number;
	swap: boolean;
	reverse: boolean;
	lobby: LobbyType;
};

type DataType = { response: any; game: GameType };

function NewGame(params: Params): PromiseLike<GameType> {
	const base = parseInt(params.quizlet)
		? fetchBySetId(params.quizlet)
		: fetchByQuery(params.quizlet);
	// @ts-ignore
	const game: GameType = { params };
	return base
		.then((response: any) => ({
			response,
			game,
		}))
		.then(setDeck)
		.then(setPlayers)
		.then((data) => data.game);
}

function fetchBySetId(setId: string) {
	return Quizlet.fetch(Quizlet.SET_URL, setId);
}

function fetchByQuery(queryString: string) {
	return Quizlet.fetch(Quizlet.SEARCH_URL, queryString)
		.then((response) => response.models.set[0].id)
		.then(fetchBySetId);
}

function setDeck(data: DataType): DataType {
	return data;
}

function setPlayers(data: DataType): DataType {
	return data;
}

export default NewGame;
