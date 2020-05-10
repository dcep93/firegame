import { LobbyType } from "../../../../shared/store";

import { sortBoard, shared } from "./";
import Quizlet from "./Quizlet";

export type GameType = {
	params: Params;
	currentPlayer: number;
	title: string;
	setId: number;
	terms: TermType[];
	deck: number[];
	players: PlayerType[];
	board: number[];
	last?: { termIndex: number; correct: boolean };
};

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

type TermType = {
	word: string;
	definition: string;
	image: string;
	rank: number;
};

export type PlayerType = {
	index: number;
	userId: string;
	hand: number[];
	userName: string;
};

type DataType = { response: any; game: GameType };

function NewGame(params: Params): PromiseLike<GameType> {
	const base = parseInt(params.quizlet) ? fetchBySetId : fetchByQuery;
	// @ts-ignore game being constructed
	const game: GameType = {};
	game.params = params;
	return base(params.quizlet)
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
		(response) => response.set[0]
	);
	const termsPromise = Quizlet.fetch(Quizlet.TERMS_URL, setId).then(
		(response) => response.term
	);
	return Promise.all([setPromise, termsPromise]).then(([set, terms]) => ({
		set,
		terms,
	}));
}

function fetchByQuery(queryString: string): Promise<any> {
	return Quizlet.fetch(Quizlet.SEARCH_URL, queryString)
		.then((response) => response.set[0].id)
		.then(fetchBySetId);
}

function setDeck(data: DataType): DataType {
	const terms: TermType[] = data.response.terms.map((term: any) => ({
		definition: term.definition || null,
		word: term.word || null,
		image: term._imageUrl || null,
		rank: term.rank || 0,
	}));
	if (data.game.params.swap)
		terms.forEach((term: any) => {
			[term.word, term.definition] = [term.definition, term.word];
		});
	if (data.game.params.useRank)
		terms.forEach((term: any) => {
			term.definition = term.rank;
		});
	terms.sort((a, b) => b.rank - a.rank);
	if (data.game.params.reverse) terms.reverse();

	const deck = terms.map((term: TermType) => term.rank);
	shared.shuffle(deck);

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
			userName: data.game.params.lobby[userId],
			userId,
			hand: data.game.deck.splice(0, data.game.params.handSize),
		})
	);
	data.game.players = players;
	data.game.currentPlayer = shared.myIndex(data.game);
	return data;
}

function setBoard(data: DataType): DataType {
	data.game.board = data.game.deck.splice(
		0,
		data.game.params.boardStartingSize
	);
	if (data.game.board.length < 1)
		throw Error(`too few terms in that set (${data.game.terms.length})`);
	sortBoard(data.game);
	return data;
}

export default NewGame;
