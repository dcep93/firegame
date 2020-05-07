import { GameType } from "./Render";
import Quizlet from "./Quizlet";
import { LobbyType } from "../../../../firegame/wrapper/C_LobbyListener";
import utils from "../../../../shared/components/utils";

export type Params = {
	quizlet: string;
	handSize: number;
	boardStartingSize: number;
	swap: boolean;
	reverse: boolean;
	useRank: boolean;
	lobby: LobbyType;
	userId: string;
};

type DataType = { response: any; game: GameType };

function NewGame(params: Params): PromiseLike<GameType> {
	const base = parseInt(params.quizlet)
		? fetchBySetId(params.quizlet)
		: fetchByQuery(params.quizlet);
	// @ts-ignore
	const game: GameType = {};
	game.params = params;
	return base
		.then((response) => ({
			response,
			game,
		}))
		.then(setDeck)
		.then(setPlayers)
		.then(setBoard)
		.then((data) => data.game);
}

function fetchBySetId(setId: string): Promise<any> {
	const setPromise = Quizlet.fetch(Quizlet.SET_URL, setId).then(
		(response) => response.models.set[0]
	);
	const termsPromise = Quizlet.fetch(Quizlet.TERMS_URL, setId).then(
		(response) => response.models.term
	);
	return Promise.all([setPromise, termsPromise]).then(([set, terms]) => ({
		set,
		terms,
	}));
}

function fetchByQuery(queryString: string): Promise<any> {
	return Quizlet.fetch(Quizlet.SEARCH_URL, queryString)
		.then((response) => response.models.set[0].id)
		.then(fetchBySetId);
}

function setDeck(data: DataType): DataType {
	const terms = data.response.terms.map((term: any) => ({
		definition: term.definition || null,
		word: term.word || null,
		image: term._imageUrl || null,
	}));
	if (data.game.params.reverse) terms.reverse();
	if (data.game.params.swap)
		terms.forEach((term: any) => {
			[term.word, term.definition] = [term.definition, term.word];
		});
	if (data.game.params.useRank)
		terms.forEach((term: any, index: number) => {
			term.definition = index.toString();
		});
	const deck = terms.map((_: any, index: number) => index);
	utils.shuffle(deck);

	data.game.title = data.response.set.title;
	data.game.setId = data.response.set.id;
	data.game.terms = terms;
	data.game.deck = deck;
	return data;
}

function setPlayers(data: DataType): DataType {
	const players = Object.keys(data.game.params.lobby).map(
		(userId, index: number) => ({
			index,
			username: data.game.params.lobby[userId],
			userId,
			hand: data.game.deck.splice(0, data.game.params.handSize),
		})
	);
	data.game.currentPlayer = players
		.map((player) => player.userId)
		.indexOf(data.game.params.userId);
	data.game.players = players;
	return data;
}

function setBoard(data: DataType): DataType {
	data.game.board = data.game.deck.splice(
		0,
		data.game.params.boardStartingSize
	);
	data.game.board.sort((a, b) => b - a);
	return data;
}

export default NewGame;
